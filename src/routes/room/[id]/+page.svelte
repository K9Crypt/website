<script lang="ts">
    import { page } from '$app/stores';
    import { leaveRoom, joinRoom, checkRoom, checkPassword, listRooms } from '$lib/room';
    import { sendMessage, getMessages, markMessageAsRead, reactToMessage } from '$lib/message';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { emojis } from '$lib/emojis';
    import { fade, scale, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { _ } from 'svelte-i18n';

    interface Message {
        id: string;
        userId: string;
        message: string;
        replyTo?: { sender: string; content: string };
        readBy?: string[];
        reactions?: Record<string, string[]>;
        status?: 'sending' | 'sent' | 'failed';
        timestamp?: number;
    }

    interface ServerMessage {
        id: string;
        userId: string;
        message: string;
        readBy?: string[];
        reactions?: Record<string, string[]>;
        timestamp?: number;
    }

    let userId: string = '';
    let message: string = '';
    let isLoading = false;
    let status: boolean | null = null;
    let error = '';
    let messages: Message[] = [];
    let pollingInterval: ReturnType<typeof setInterval>;
    let replyingTo: { message: string } | null = null;
    let roomType = '';
    let roomPassword = '';
    let isPasswordRequired = false;
    let hasJoinedRoom = false;
    let roomUsers: string[] = [];
    let filteredUsers: string[] = [];
    let showUserDropdown = false;
    let userDropdownIndex = -1;
    let messageInput: HTMLTextAreaElement;
    let commonEmojis = ['👍', '❤️', '🎉', '🔥', '😂', '😍', '🙏'];
    let showEmojiPicker = false;
    let activeMessageId: string | null = null;
    let emojiPickerRef: HTMLDivElement;
    let emojiButtonRef: HTMLButtonElement;
    let showInputEmojiPicker = false;
    let inputEmojiPickerRef: HTMLDivElement;
    let inputEmojiButtonRef: HTMLButtonElement;
    let emojiSearchQuery = '';
    let filteredEmojis = emojis;
    let selectedCategory = '';
    let messagesContainer: HTMLDivElement;
    let shouldAutoScroll = true;
    let showCopyPopup = false;
    let fileInput: HTMLInputElement;
    let fileInputButtonRef: HTMLButtonElement;
    let selectedImage: string | null = null;
    let imageUploadProgress: number = 0;
    let bookmarks: Array<{
        messageId: string;
        message: string;
        userId: string;
        timestamp: number;
    }> = [];
    let showBookmarkPanel = false;
    let showSearchPanel = false;
    let messageSearchQuery = '';
    let roomName = '';
    let searchResults: Array<{
        id: string;
        message: string;
        userId: string;
        timestamp: number;
    }> = [];
    let lastFetchTimestamp = 0;
    const FETCH_COOLDOWN = 1000;
    let showMessageInfo: string | null = null;
    let loadTimeout: ReturnType<typeof setTimeout>;
    let isTabVisible = true;
    let currentMessage = '';
    let currentReplyTo: { message: string } | null = null;
    let currentImage: string | null = null;

    type EmojiCategories = {
        [key: string]: string[];
        'Smileys & Emotion': string[];
        'People & Body': string[];
        'Animals & Nature': string[];
        'Food & Drink': string[];
        'Activities': string[];
        'Travel & Places': string[];
        'Objects': string[];
        'Symbols': string[];
    };

    const emojiCategories: EmojiCategories = {
        'Smileys & Emotion': emojis.slice(0, 72),
        'People & Body': emojis.slice(72, 160),
        'Animals & Nature': emojis.slice(160, 240),
        'Food & Drink': emojis.slice(240, 320),
        'Activities': emojis.slice(320, 360),
        'Travel & Places': emojis.slice(360, 400),
        'Objects': emojis.slice(400, 440),
        'Symbols': emojis.slice(440)
    };

    $: {
        if (messageSearchQuery.length > 0) {
            const query = messageSearchQuery.toLowerCase();
            searchResults = messages
                .filter(msg => 
                    msg.message.toLowerCase().includes(query) ||
                    msg.userId.toLowerCase().includes(query)
                )
                .map(msg => ({
                    id: msg.id,
                    message: msg.message,
                    userId: msg.userId,
                    timestamp: Date.now()
                }));
        } else {
            searchResults = [];
        }
    }

    function toggleMessageInfo(messageId: string) {
        showMessageInfo = showMessageInfo === messageId ? null : messageId;
    }

    const memoizedParseMarkdown = (() => {
        const cache = new Map<string, string>();
        return (text: string): string => {
            if (cache.has(text)) {
                return cache.get(text)!;
            }
            const result = text
                .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/~~(.*?)~~/g, '<del>$1</del>')
                .replace(/```(.*?)```/gs, '<pre class="bg-black/20 p-2 rounded text-cYellow my-2 overflow-x-auto"><code>$1</code></pre>')
                .replace(/`([^`]+)`/g, '<code class="bg-black/20 px-1.5 py-0.5 rounded text-cYellow">$1</code>')
                .replace(/__(.*?)__/g, '<u>$1</u>')
                .replace(/==(.*?)==/g, '<mark class="bg-cYellow/30 px-1 rounded">$1</mark>')
                .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-cYellow pl-3 py-1 my-2 italic">$1</blockquote>')
                .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
                .replace(/^\+ (.*$)/gm, '<li class="ml-4 list-circle">$1</li>')
                .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>');
            cache.set(text, result);
            return result;
        };
    })();

    function throttle<T extends (...args: any[]) => void>(
        func: T,
        limit: number
    ): (...args: Parameters<T>) => void {
        let inThrottle: boolean;
        return function(this: any, ...args: Parameters<T>): void {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    }

    const throttledHandleScroll = throttle(() => {
        if (messagesContainer) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
            shouldAutoScroll = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
        }
    }, 100);

    function debounce<T extends (...args: any[]) => void>(
        func: T,
        wait: number
    ): (...args: Parameters<T>) => void {
        let timeout: ReturnType<typeof setTimeout>;
        return function(this: any, ...args: Parameters<T>): void {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const debouncedHandleInput = debounce((event: Event) => {
        handleInput(event);
    }, 150);

    let visibleMessages: Message[] = [];
    let messageHeight = 80;
    let visibleCount = 20;
    let startIndex = 0;

    function updateVisibleMessages() {
        if (!messagesContainer) return;
        
        const scrollTop = messagesContainer.scrollTop;
        startIndex = Math.floor(scrollTop / messageHeight);
        startIndex = Math.max(0, startIndex - 5);
        
        visibleMessages = messages.slice(
            startIndex,
            Math.min(startIndex + visibleCount + 10, messages.length)
        );
    }

    const throttledUpdateVisibleMessages = throttle(updateVisibleMessages, 100);

    let observer: IntersectionObserver;

    onMount(() => {
        observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const messageId = entry.target.id.replace('message-', '');
                        const message = messages.find(m => m.id === messageId);
                        if (message && !message.readBy?.includes(userId)) {
                            markMessageAsRead(roomId, userId, messageId).catch(console.error);
                        }
                    }
                });
            },
            { threshold: 0.5 }
        );

        return () => {
            observer.disconnect();
        };
    });

    $: {
        if (messages) {
            updateVisibleMessages();
            setTimeout(() => {
                if (shouldAutoScroll) {
                    scrollToBottom();
                }
            }, 100);
        }
    }

    async function handleFileSelect(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        if (file.size > 1024 * 1024 * 1024) {
            toast.error($_('room.chat.imageUpload.error.sizeLimit'));
            return;
        }

        try {
            imageUploadProgress = 0;
            const base64 = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                        imageUploadProgress = (event.loaded / event.total) * 100;
                    }
                };
                reader.readAsDataURL(file);
            });
            
            const response = await fetch('/api/image/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64 })
            });

            if (!response.ok) throw new Error('Upload failed');
            
            const { imageUrl } = await response.json();
            selectedImage = imageUrl;
            await handleSendMessage(true);
            selectedImage = null;
        } catch (err) {
            toast.error($_('room.chat.imageUpload.error.uploadFailed'));
        } finally {
            imageUploadProgress = 0;
        }
    }

    function levenshteinDistance(str1: string, str2: string): number {
        const track = Array(str2.length + 1).fill(null).map(() =>
            Array(str1.length + 1).fill(null));
        
        for (let i = 0; i <= str1.length; i++) track[0][i] = i;
        for (let j = 0; j <= str2.length; j++) track[j][0] = j;
        
        for (let j = 1; j <= str2.length; j++) {
            for (let i = 1; i <= str1.length; i++) {
                const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator
                );
            }
        }
        
        return track[str2.length][str1.length];
    }

    function toggleCopyPopup() {
        showCopyPopup = !showCopyPopup;
    }

    async function copyRoomIdWithPopup() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err) {
            toast.error('Failed to copy room ID', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        }
    }

    function toggleBookmark(message: any) {
        const existingIndex = bookmarks.findIndex(b => b.messageId === message.id);
        
        if (existingIndex > -1) {
            bookmarks = bookmarks.filter(b => b.messageId !== message.id);
        } else {
            if (!bookmarks.some(b => b.messageId === message.id)) {
                bookmarks = [...bookmarks, {
                    messageId: message.id,
                    message: message.message,
                    userId: message.userId,
                    timestamp: Date.now()
                }];
            }
        }
        
        localStorage.setItem(`bookmarks_${roomId}_${userId}`, JSON.stringify(bookmarks));
    }

    function scrollToMessage(messageId: string) {
        const messageElement = document.getElementById(`message-${messageId}`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.classList.add('highlight-message');
            setTimeout(() => messageElement.classList.remove('highlight-message'), 2000);
        }
    }

    function scrollToBottom() {
        if (messagesContainer && shouldAutoScroll) {
            messagesContainer.scrollTo({
                top: messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }
    }

    function handleScroll() {
        if (messagesContainer) {
            const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
            shouldAutoScroll = Math.abs(scrollHeight - clientHeight - scrollTop) < 100;
        }
    }

    $: {
        if (emojiSearchQuery) {
            const query = emojiSearchQuery.toLowerCase();
            const searchResults = new Map();
            const categoryMatch = Object.entries(emojiCategories).find(([cat]) => 
                cat.toLowerCase().includes(query)
            );
            
            if (categoryMatch) {
                selectedCategory = categoryMatch[0];
                filteredEmojis = categoryMatch[1];
            } else {
                selectedCategory = '';
                
                Object.entries(emojiCategories).forEach(([emoji, descriptions]) => {
                    let score = 0;
                    
                    if (emoji === query) score += 100;
                    
                    descriptions.forEach((desc, index) => {
                        if (desc.toLowerCase() === query) {
                            score += 50;
                        }
                        else if (desc.toLowerCase().startsWith(query)) {
                            score += 30;
                        }
                        else if (desc.toLowerCase().includes(query)) {
                            score += 20;
                        }
                        else if (levenshteinDistance(desc.toLowerCase(), query) <= 2) {
                            score += 10;
                        }
                        
                        if (index === 0 && score > 0) score += 5;
                    });

                    if (score > 0) {
                        searchResults.set(emoji, score);
                    }
                });

                filteredEmojis = Array.from(searchResults.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([emoji]) => emoji);

                if (filteredEmojis.length === 0) {
                    filteredEmojis = [
                        '👍', '❤️', '😊', '🎉', '🔥', '😂',
                        '🥰', '😍', '🤗', '🙏', '✨', '💪'
                    ];
                }
            }
        } else if (selectedCategory) {
            filteredEmojis = emojiCategories[selectedCategory];
        } else {
            filteredEmojis = [
                '👍', '❤️', '😊', '🎉', '🔥', '😂',
                '🥰', '😍', '🤗', '🙏', '✨', '💪',
                '👀', '🤔', '😎', '🥺', '😢', '😀'
            ];
        }
    }

    $: if (messages) {
        setTimeout(scrollToBottom, 100);
    }

    $: roomId = $page.params.id;
    $: isSendButtonDisabled = isLoading || !message.trim();

    async function copyMessage(msg: string) {
        try {
            await navigator.clipboard.writeText(msg);
            toast.success('Message copied to clipboard', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err) {
            toast.error('Failed to copy message', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        }
    }

    function handleVisibilityChange() {
        isTabVisible = document.visibilityState === 'visible';
        if (isTabVisible) {
            loadRoomData().then(() => startPolling());
        } else {
            stopPolling();
        }
    }

    async function loadRoomData(force = false) {
        const now = Date.now();
        if (!force && now - lastFetchTimestamp < FETCH_COOLDOWN) return;

        try {
            const [newMessages, { users = [], type = roomType, roomName: newRoomName = roomName, roomOwner: owner }] = await Promise.all([
                getMessages(roomId),
                checkRoom(roomId).catch(() => ({}))
            ]);

            roomUsers = users;
            roomType = type;
            roomName = newRoomName;

            const messageMap = new Map(messages
                .filter(msg => msg.id.startsWith('temp-') && 
                            msg.status === 'sending' &&
                            msg.timestamp && 
                            Date.now() - msg.timestamp < 30000)
                .map(msg => [msg.id, msg]));

            const processedMessages = (newMessages as ServerMessage[])
                .filter(msg => msg?.id && msg?.userId && msg?.message)
                .map(msg => {
                    const readBy = new Set(msg.readBy || []);
                    
                    if (!readBy.has(userId) && msg.userId !== userId) {
                        markMessageAsRead(roomId, userId, msg.id).catch(console.error);
                        readBy.add(userId);
                    }

                    return {
                        ...msg,
                        readBy: Array.from(readBy),
                        reactions: msg.reactions || {},
                        status: 'sent' as const,
                        timestamp: msg.timestamp || now
                    };
                });

            messages = [
                ...processedMessages,
                ...Array.from(messageMap.values())
            ].sort((a, b) => ((a.timestamp || 0) - (b.timestamp || 0)));

            if (shouldAutoScroll) {
                requestAnimationFrame(scrollToBottom);
            }

        } catch (err) {
            console.error('Room data loading error:', err);
            error = 'Failed to load room data';
        }
    }

    async function handleReaction(messageId: string, emoji: string) {
        try {
            messages = messages.map(msg => {
                if (msg.id === messageId) {
                    const reactions = { ...(msg.reactions || {}) };
                    if (!reactions[emoji]) {
                        reactions[emoji] = [userId];
                    } else if (reactions[emoji].includes(userId)) {
                        reactions[emoji] = reactions[emoji].filter(id => id !== userId);
                        if (reactions[emoji].length === 0) {
                            delete reactions[emoji];
                        }
                    } else {
                        reactions[emoji] = [...reactions[emoji], userId];
                    }
                    return { ...msg, reactions };
                }
                return msg;
            });
            
            showEmojiPicker = false;
            activeMessageId = null;
            
            await reactToMessage(roomId, userId, messageId, emoji);
        } catch (err) {
            await loadRoomData();
            toast.error('Failed to react to message', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        }
    }

    let clickOutsideHandler: ((event: MouseEvent) => void) | null = null;

    function handleClickOutside(event: MouseEvent) {
        if (showEmojiPicker && 
            emojiPickerRef && 
            emojiButtonRef && 
            !emojiPickerRef.contains(event.target as Node) && 
            !emojiButtonRef.contains(event.target as Node)) {
            showEmojiPicker = false;
            activeMessageId = null;
        }
    }

    function toggleEmojiPicker(messageId: string, event: MouseEvent) {
        event.stopPropagation();
        if (activeMessageId === messageId) {
            activeMessageId = null;
            showEmojiPicker = false;
        } else {
            showEmojiPicker = false;
            activeMessageId = null;
            setTimeout(() => {
                activeMessageId = messageId;
                showEmojiPicker = true;
            }, 0);
        }
    }

    async function startPolling() {
        stopPolling();
        pollingInterval = setInterval(loadRoomData, 5000);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }
    }

    function handleReply(msg: { message: string }) {
        if (!msg.message.startsWith('[IMAGE]')) {
            replyingTo = msg;
            message = '';
            focusMessageInput();
        }
    }

    function focusMessageInput() {
        setTimeout(() => {
            const input = document.getElementById('message-input');
            if (input) {
                input.focus();
            }
        }, 0);
    }

    function cancelReply() {
        replyingTo = null;
        focusMessageInput();
    }

    function handleInputEmojiClick(emoji: string) {
        message = message + emoji;
        showInputEmojiPicker = false;
        focusMessageInput();
    }

    function handleInputEmojiPickerClickOutside(event: MouseEvent) {
        if (showInputEmojiPicker && 
            inputEmojiPickerRef && 
            inputEmojiButtonRef && 
            !inputEmojiPickerRef.contains(event.target as Node) && 
            !inputEmojiButtonRef.contains(event.target as Node)) {
            showInputEmojiPicker = false;
        }
    }

    onMount(async () => {
        const savedBookmarks = localStorage.getItem(`bookmarks_${roomId}_${userId}`);
        if (savedBookmarks) {
            bookmarks = JSON.parse(savedBookmarks);
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        clickOutsideHandler = (event: MouseEvent) => {
            handleClickOutside(event);
            handleInputEmojiPickerClickOutside(event);
        };
        document.addEventListener('click', clickOutsideHandler);

        try {
            const roomId = $page.params.id;
            userId = localStorage.getItem('userId') || '';
            const hasJoinedRoomStorage = localStorage.getItem(`hasJoinedRoom_${roomId}`);
            
            if (!hasJoinedRoomStorage) {
                toast.error('Please join the room first.', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                goto('/join/room');
                return;
            }

            if (!userId) {
                toast.error('Please enter a username.', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                goto('/join/room');
                return;
            }

            const roomDetails = await checkRoom(roomId);
            roomType = roomDetails.type;
            roomUsers = roomDetails.users || [];
            roomName = roomDetails.roomName || '';

            if (roomType === 'private' && !hasJoinedRoomStorage) {
                isPasswordRequired = true;
                return;
            }

            hasJoinedRoom = true;
            await loadRoomData();
            if (isTabVisible) {
                startPolling();
            }
        } catch (err) {
            error = 'Failed to initialize room';
            toast.error(error);
            await goto('/join/room');
        }
    });

    onDestroy(() => {
        stopPolling();
        clearTimeout(loadTimeout);
        observer?.disconnect();
        if (typeof document !== 'undefined') {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('click', clickOutsideHandler);
        }
    });

    async function handleSendMessage(isImage = false) {
        if (isLoading) return;
        if ((!isImage && (!message || message.trim().length === 0)) || 
            (isImage && !selectedImage)) return;
        
        if (!userId || !roomId || !hasJoinedRoom) {
            toast.error('Please rejoin the room');
            goto('/join/room');
            return;
        }

        const messageToSend = isImage 
            ? `[IMAGE]${selectedImage}`
            : replyingTo
                ? `Replying to "${replyingTo.message.substring(0, 50)}${replyingTo.message.length > 50 ? '...' : ''}": \n\n${message.trim()}`
                : message.trim();

        const tempMessage = {
            id: `temp-${Date.now()}-${crypto.randomUUID()}`,
            userId,
            message: messageToSend,
            readBy: [userId],
            reactions: {},
            status: 'sending',
            timestamp: Date.now()
        };

        try {
            isLoading = true;

            const currentMessage = message;
            const currentReplyTo = replyingTo;
            const currentImage = selectedImage;

            message = '';
            replyingTo = null;
            selectedImage = null;

            if (messageInput) {
                messageInput.style.height = '48px';
                messageInput.value = '';
            }

            messages = [...messages.filter(msg => !msg.id.startsWith('temp-')), tempMessage];

            await new Promise(resolve => setTimeout(resolve, 0));
            shouldAutoScroll = true;
            scrollToBottom();

            const result = await sendMessage(roomId, userId, messageToSend);
            
            if (!result) throw new Error('Failed to send message');

            messages = messages.map(msg => 
                msg.id === tempMessage.id 
                    ? { ...msg, status: 'sent', id: result.id || msg.id }
                    : msg
            );

            await loadRoomData(true);
        } catch (err) {
            console.error('Message sending error:', err);

            messages = messages.filter(msg => msg.id !== tempMessage.id);
            message = currentMessage || '';
            replyingTo = currentReplyTo;
            selectedImage = currentImage;

            toast.error('Failed to send message. Please try again.', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        } finally {
            isLoading = false;
        }
    }

    function decodeBase64Image(encodedString: string): string {
        return encodedString
            .replace(/&#x2F;/g, '/')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"');
    }

    async function handleLeaveRoom() {
        try {
            const roomId = $page.params.id;
            localStorage.removeItem(`hasJoinedRoom_${roomId}`);
            await leaveRoom(roomId, userId);
            toast.success('Left the room successfully!', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            goto('/join/room');
        } catch (err) {
            console.error('Error leaving room:', err);
            toast.error('Failed to leave room. Please try again.', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        }
    }

    async function handlePasswordSubmit() {
        if (isLoading || !roomPassword.trim()) return;
        
        isLoading = true;
        try {
            const isPasswordValid = await checkPassword(roomId, roomPassword);
            if (!isPasswordValid) {
                error = 'Invalid password';
                toast.error(error, { 
                    duration: 3000, 
                    position: 'bottom-right', 
                    style: 'background-color: #1B1B1B; color: #fff;' 
                });
                isPasswordRequired = true;
                hasJoinedRoom = false;
                isLoading = false;
                return;
            }

            await joinRoom(roomId, userId, roomPassword);
            toast.success('Joined the room', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            isPasswordRequired = false;
            hasJoinedRoom = true;
            localStorage.setItem(`hasJoinedRoom_${roomId}`, 'true');
            roomPassword = '';
            await loadRoomData();
            startPolling();
        } catch (err) {
            error = 'Failed to join room';
            toast.error(error, { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            isPasswordRequired = true;
            hasJoinedRoom = false;
        } finally {
            isLoading = false;
        }
    }

    function handleInput(event: Event) {
        const input = event.target as HTMLTextAreaElement;
        if (!input) return;
        
        message = input.value;
        input.style.height = 'auto';
        input.style.height = `${input.scrollHeight}px`;
        
        const lastWord = message.split(/\s/).pop() || '';
        if (lastWord.startsWith('@') && lastWord.length > 1) {
            const searchTerm = lastWord.slice(1).toLowerCase();
            filteredUsers = roomUsers.filter(user => 
                user.toLowerCase().startsWith(searchTerm) && 
                user.toLowerCase() !== 'system'
            );
            showUserDropdown = filteredUsers.length > 0;
            userDropdownIndex = -1;
        } else {
            showUserDropdown = false;
            filteredUsers = [];
            userDropdownIndex = -1;
        }
    }

    function handleImageError(event: Event) {
        const img = event.currentTarget as HTMLImageElement;
        const nextElement = img.nextElementSibling as HTMLElement;
        if (img && nextElement) {
            img.style.display = 'none';
            nextElement.style.display = 'flex';
        }
    }

    function selectUser(user: string) {
        const words = message.split(/\s/);
        words[words.length - 1] = `@${user} `;
        message = words.join(' ');
        showUserDropdown = false;
        userDropdownIndex = -1;
        focusMessageInput();
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (showUserDropdown) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    userDropdownIndex = (userDropdownIndex + 1) % filteredUsers.length;
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    userDropdownIndex = (userDropdownIndex - 1 + filteredUsers.length) % filteredUsers.length;
                    break;
                case 'Enter':
                    if (userDropdownIndex !== -1) {
                        event.preventDefault();
                        selectUser(filteredUsers[userDropdownIndex]);
                    }
                    break;
                case 'Escape':
                    event.preventDefault();
                    showUserDropdown = false;
                    userDropdownIndex = -1;
                    break;
                case 'Tab':
                    if (filteredUsers.length > 0) {
                        event.preventDefault();
                        selectUser(filteredUsers[userDropdownIndex === -1 ? 0 : userDropdownIndex]);
                    }
                    break;
            }
        } else if (event.key === 'Enter' && !event.shiftKey && !isSendButtonDisabled) {
            event.preventDefault();
            handleSendMessage();
        }
    }

    async function routeSupport() {
        goto('/support');
    }
</script>

<Toaster />

{#if error}
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
    <div class="bg-cWhiteGray p-8 rounded-lg shadow-xl border border-white/10 max-w-md w-full mx-4" transition:scale={{ duration: 300, easing: quintOut }}>
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <i class="ri-error-warning-fill text-red-500 text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">{$_("room.chat.error.notFoundTitle")}</h3>
            <p class="text-white opacity-50 mb-6">{$_("room.chat.error.notFoundDesc")}</p>
            
            <div class="flex gap-3">
                <a href="/create/room" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center no-underline">{$_("room.chat.error.goBack")}</a>
                <a href="/contact" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center no-underline">{$_("room.chat.error.support")}</a>
            </div>
        </div>
    </div>
</div>
{/if}
{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">{$_("room.create.error.connectionTitle")}</h1>
        <p class="text-white opacity-50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">{$_("room.create.error.connectionDesc")}</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">{$_("room.create.error.serverStatus")}</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">{$_("room.create.error.serverDesc")}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>{$_("room.create.error.tryAgain")}</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>{$_("room.create.error.support")}</button>
        </div>
    </div>
</div>
{:else}
{#if isPasswordRequired}
<div class="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">{$_("room.chat.passReq.title")}</h3>
        <p class="text-white opacity-50 text-sm mb-6">{$_("room.chat.passReq.description")}</p>
        
        <div class="space-y-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_("room.chat.passReq.password")}</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-50"></i>
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white opacity-30 transition-all duration-300 text-white" />
                </div>
                {#if error}
                <p class="text-xs text-red-500">{error}</p>
                {/if}
            </div>
        </div>
    </div>
</div>
{:else}
<div class="fixed inset-0">
    <div class="h-screen flex flex-col">
        <div class="bg-cWhiteGray border-b border-white/10">
            <div class="px-4 sm:px-6 py-2.5 sm:py-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-11 sm:h-11 bg-cYellow rounded-lg flex items-center justify-center text-black font-bold transition-all duration-300 text-sm sm:text-base">
                            {userId?.slice(0, 2).toUpperCase()}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="font-semibold flex items-center gap-2 text-base sm:text-lg truncate">
                                <span class="truncate">{$_("room.chat.roomName")}: {roomName}</span>
                                <button on:click={toggleCopyPopup} class="flex-shrink-0 hover:scale-105 active:scale-95">
                                    <i class="ri-file-copy-fill text-white opacity-50 hover:text-cYellow transition-all duration-300 p-1.5 rounded-lg hover:bg-white/10"></i>
                                </button>
                            </h3>
                            <span class="text-white opacity-50 text-xs sm:text-sm flex items-center gap-1.5">
                                <i class="ri-shield-keyhole-fill"></i>
                                {$_("room.chat.roomType")}: {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <div class="grid grid-cols-2 sm:flex items-stretch gap-2">
                            <button on:click={() => showSearchPanel = !showSearchPanel} class="bg-[#2C2C2C]/90 text-white opacity-70 hover:text-cYellow px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#2C2C2C] active:scale-95 transition-all duration-300">
                                <i class="ri-search-line text-lg sm:text-base opacity-70"></i>
                                <span class="hidden xs:inline">{$_("room.chat.searchButton")}</span>
                            </button>
                            <button on:click={() => showBookmarkPanel = !showBookmarkPanel} class="bg-[#2C2C2C]/90 text-white opacity-70 hover:text-cYellow px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-[#2C2C2C] active:scale-95 transition-all duration-300">
                                <i class="ri-bookmark-line text-lg sm:text-base opacity-70"></i>
                                <span class="hidden xs:inline">{$_("room.chat.bookmarksButton")}</span>
                                {#if bookmarks.length > 0}
                                <span class="text-xs bg-cYellow text-black rounded-full px-1.5">{bookmarks.length}</span>
                                {/if}
                            </button>
                        </div>
                        <button on:click={handleLeaveRoom} class="bg-red-500/10 text-red-500 px-3 sm:px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-1.5 sm:gap-2 hover:bg-red-500/20 active:scale-95 transition-all duration-300">
                            <i class="ri-door-open-fill text-lg sm:text-base"></i>
                            <span>{$_("room.chat.leaveButton")}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {#if showSearchPanel}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" transition:fade={{ duration: 200 }}>
            <div class="hidden md:block">
                <div class="fixed right-0 top-0 bottom-0 w-80 bg-cWhiteGray border-l border-white/10 shadow-xl z-50" transition:slide={{ duration: 300, axis: 'x', easing: quintOut }}>
                    <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                                <i class="ri-search-line text-cYellow text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold">{$_("room.chat.searchMessage")}</h3>
                            </div>
                            <button on:click={() => showSearchPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div class="relative">
                            <input 
                                type="text" 
                                bind:value={messageSearchQuery}
                                placeholder="Search messages..." 
                                class="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-4 py-2.5 pl-9 text-sm placeholder:text-white opacity-30 focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20"
                            >
                            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-30"></i>
                        </div>
                    </div>

                    <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                        {#if messageSearchQuery.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-search-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.searchMessage")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.searchMessageDescription")}</p>
                        </div>
                        {:else if searchResults.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-file-search-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.messageNotFound")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.searchNotFoundDescription")}</p>
                        </div>
                        {:else}
                        {#each searchResults as result}
                        <div class="bg-[#2C2C2C] rounded-lg p-4 group hover:bg-[#363636] transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg">
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-cYellow rounded-lg flex items-center justify-center text-black text-sm font-bold shadow-md">
                                        {result.userId.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-white opacity-90">{result.userId}</span>
                                        <span class="text-xs text-white opacity-50">{new Date(result.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {#if result.message.startsWith('[IMAGE]')}
                            <div class="relative ml-10">
                                <div class="relative group/image">
                                    <img 
                                        src={decodeBase64Image(result.message.slice(7))} 
                                        alt="Search result image" 
                                        class="max-w-full w-[200px] rounded-lg object-contain hover:shadow-xl transition-all duration-300"
                                        on:error={handleImageError}
                                    />
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        <button class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300">
                                            <i class="ri-zoom-in-line text-white text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-[200px]">
                                    <i class="ri-image-line text-xl"></i>
                                    <span class="text-xs">{$_("room.chat.imageUnavailable")}</span>
                                </div>
                            </div>
                            {:else}
                            <p class="text-sm text-white opacity-70 break-words ml-10 bg-black/20 p-3 rounded-lg">{result.message}</p>
                            {/if}

                            <div class="flex items-center gap-2 mt-3 ml-10">
                                <button 
                                    on:click={() => {
                                        scrollToMessage(result.id);
                                        showSearchPanel = false;
                                    }}
                                    class="text-xs bg-cYellow/10 hover:bg-cYellow/20 text-cYellow px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg"
                                >
                                    <i class="ri-arrow-right-line"></i>
                                    {$_("room.chat.gotoMessage")}
                                </button>
                                <button 
                                    on:click={() => copyMessage(result.message)}
                                    class="text-xs bg-white/5 hover:bg-white/10 text-white opacity-70 hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                >
                                    <i class="ri-file-copy-line"></i>
                                    {$_("room.chat.copyMessage")}
                                </button>
                            </div>
                        </div>
                        {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <div class="block md:hidden">
                <div class="fixed bottom-0 left-0 right-0 h-[80vh] bg-cWhiteGray border-t border-white/10 shadow-xl z-50 rounded-t-xl" transition:slide={{ duration: 300, axis: 'y', easing: quintOut }}>
                    <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                                <i class="ri-search-line text-cYellow text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold">{$_("room.chat.searchMessage")}</h3>
                            </div>
                            <button on:click={() => showSearchPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>

                        <div class="relative">
                            <input 
                                type="text" 
                                bind:value={messageSearchQuery}
                                placeholder="Search messages..." 
                                class="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-4 py-2.5 pl-9 text-sm placeholder:text-white opacity-30 focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20"
                            >
                            <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-30"></i>
                        </div>
                    </div>

                    <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                        {#if messageSearchQuery.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-search-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.searchMessage")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.searchMessageDescription")}</p>
                        </div>
                        {:else if searchResults.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-file-search-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.messageNotFound")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.searchNotFoundDescription")}</p>
                        </div>
                        {:else}
                        {#each searchResults as result}
                        <div class="bg-[#2C2C2C] rounded-lg p-4 group hover:bg-[#363636] transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg">
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-cYellow rounded-lg flex items-center justify-center text-black text-sm font-bold shadow-md">
                                        {result.userId.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-white opacity-90">{result.userId}</span>
                                        <span class="text-xs text-white opacity-50">{new Date(result.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {#if result.message.startsWith('[IMAGE]')}
                            <div class="relative ml-10">
                                <div class="relative group/image">
                                    <img 
                                        src={decodeBase64Image(result.message.slice(7))} 
                                        alt="Search result image" 
                                        class="max-w-full w-[200px] rounded-lg object-contain hover:shadow-xl transition-all duration-300"
                                        on:error={handleImageError}
                                    />
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        <button class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300">
                                            <i class="ri-zoom-in-line text-white text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-[200px]">
                                    <i class="ri-image-line text-xl"></i>
                                    <span class="text-xs">{$_("room.chat.imageUnavailable")}</span>
                                </div>
                            </div>
                            {:else}
                            <p class="text-sm text-white opacity-70 break-words ml-10 bg-black/20 p-3 rounded-lg">{result.message}</p>
                            {/if}

                            <div class="flex items-center gap-2 mt-3 ml-10">
                                <button 
                                    on:click={() => {
                                        scrollToMessage(result.id);
                                        showSearchPanel = false;
                                    }}
                                    class="text-xs bg-cYellow/10 hover:bg-cYellow/20 text-cYellow px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg"
                                >
                                    <i class="ri-arrow-right-line"></i>
                                    {$_("room.chat.gotoMessage")}
                                </button>
                                <button 
                                    on:click={() => copyMessage(result.message)}
                                    class="text-xs bg-white/5 hover:bg-white/10 text-white opacity-70 hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                >
                                    <i class="ri-file-copy-line"></i>
                                    {$_("room.chat.copyMessage")}
                                </button>
                            </div>
                        </div>
                        {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        {/if}

        {#if showCopyPopup}
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
            <div class="bg-cWhiteGray p-6 rounded-lg max-w-md w-full mx-4" transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white opacity-90">{$_("room.chat.copyPopup.id")}</h3>
                    <button on:click={toggleCopyPopup} class="text-white opacity-50 hover:text-white transition-all duration-300">
                        <i class="ri-close-line text-xl"></i>
                    </button>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="relative flex-1">
                        <i class="ri-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-50"></i>
                        <input type="text" value={roomId} readonly class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg text-white" />
                    </div>
                </div>
                <button on:click={copyRoomIdWithPopup} class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center w-full mb-4">Copy</button>
                <p class="text-white opacity-50 text-sm">{$_("room.chat.copyPopup.description")}</p>
            </div>
        </div>
        {/if}

        {#if !error && status !== false}
        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50 pb-[120px] sm:pb-0" 
            bind:this={messagesContainer} 
            on:scroll={throttledHandleScroll}
        >
            <div class="px-4 sm:px-6 py-6 space-y-4">
                {#each messages as message (message.id)}
                <div class="flex flex-col {message.userId === userId ? 'items-end' : 'items-start'} group animate-fadeIn"
                    id="message-{message.id}"
                    use:observeMessage
                >
                    {#if message.replyTo}
                    <div class="bg-[#2C2C2C]/80 rounded-lg p-2 mb-2 max-w-[85%] text-sm text-white opacity-50 border-l-2 border-l-cYellow border border-white/5 relative">
                        <div class="font-medium text-cYellow flex items-center gap-1.5 mb-1">
                            <i class="ri-reply-fill text-sm"></i>
                            <span class="text-white opacity-90 text-sm">{message.replyTo.sender}</span>
                        </div>
                        <div class="pl-4 border-l border-white/10">
                            {#if message.replyTo.content.startsWith('[IMAGE]')}
                                <div class="relative">
                                    <img 
                                        src={decodeBase64Image(message.replyTo.content.slice(7))} 
                                        alt="Replied image" 
                                        class="max-w-full w-[100px] rounded-lg object-contain"
                                        on:error={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-full min-h-[50px]">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="ri-error-warning-line text-xl"></i>
                                            <span class="text-xs">{$_("room.chat.imageUploadFailed")}</span>
                                        </div>
                                    </div>
                                </div>
                            {:else}
                                <span class="text-sm opacity-75">{message.replyTo.content}</span>
                            {/if}
                        </div>
                    </div>
                    {/if}

                    <div class="relative group">
                        <div class="{message.userId === userId ? 'bg-cYellow text-black rounded-l-lg rounded-tr-lg' : 'bg-[#2C2C2C] text-white rounded-r-lg rounded-tl-lg'} py-2.5 px-3.5 relative max-w-[350px] w-fit shadow-sm">
                            <div class="flex flex-col gap-1.5">
                                {#if message.userId !== userId}
                                <span class="text-xs font-medium flex items-center gap-1.5 {message.userId === 'System' ? 'text-cYellow' : 'opacity-75'}">
                                    {#if message.userId === 'System'}
                                    <i class="ri-shield-star-fill text-sm"></i>
                                    {/if}
                                    {message.userId}
                                </span>
                                {/if}
                                
                                {#if message?.message?.startsWith('[IMAGE]')}
                                <div class="relative">
                                    <img 
                                        src={decodeBase64Image(message.message.slice(7))} 
                                        alt="Shared image" 
                                        class="max-w-full w-[200px] rounded-lg object-contain"
                                        on:error={handleImageError}
                                    />
                                    <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-full min-h-[100px]">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="ri-error-warning-line text-2xl"></i>
                                            <span class="text-sm">{$_("room.chat.imageUploadFailed")}</span>
                                        </div>
                                    </div>
                                    {#if message.status}
                                    <div class="message-status {message.status} mt-1">
                                        {#if message.status === 'sending'}
                                            <div class="flex items-center gap-1">
                                                <i class="ri-time-line"></i>
                                                <p class="text-xs">{$_("room.chat.sending")}</p>
                                            </div>
                                        {:else if message.status === 'failed'}
                                            <div class="flex items-center gap-1">
                                                <i class="ri-error-warning-line"></i>
                                                <p class="text-xs">{$_("room.chat.failed")}</p>
                                            </div>
                                        {/if}
                                    </div>
                                    {/if}
                                </div>
                                {:else}
                                <p class="leading-relaxed whitespace-pre-wrap break-words text-sm">
                                    {@html memoizedParseMarkdown(message?.message?.replace(/@(\w+)/g, '<span class="font-bold underline">@$1</span>')) || ''}
                                </p>
                                {#if message.status}
                                <div class="message-status {message.status}">
                                    {#if message.status === 'sending'}
                                        <div class="flex items-center gap-1">
                                            <i class="ri-time-line"></i>
                                            <p class="text-xs">{$_("room.chat.sending")}</p>
                                        </div>
                                    {:else if message.status === 'sent'}
                                        <div class="flex items-center gap-1">
                                            <i class="ri-check-double-line"></i>
                                            <p class="text-xs">{$_("room.chat.sent")}</p>
                                        </div>
                                    {:else if message.status === 'failed'}
                                        <div class="flex items-center gap-1">
                                            <i class="ri-error-warning-line"></i>
                                            <p class="text-xs">{$_("room.chat.failed")}</p>
                                        </div>
                                    {/if}
                                </div>
                                {/if}
                                {/if}
                            </div>
                        </div>                        

                        <div class="absolute top-1/2 -translate-y-1/2 {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center gap-1 px-1.5 animate-fadeIn">
                            {#if !message.message.startsWith('[IMAGE]')}
                            <button on:click={() => handleReply(message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-reply-fill text-sm"></i>
                            </button>
                            {/if}
                            <button on:click={() => copyMessage(message.message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-file-copy-fill text-sm"></i>
                            </button>
                            <button bind:this={emojiButtonRef} on:click={(e) => toggleEmojiPicker(message.id, e)} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-emotion-line text-sm"></i>
                            </button>
                            <button on:click={() => toggleBookmark(message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-bookmark-{bookmarks.some(b => b.messageId === message.id) ? 'fill text-cYellow' : 'line'} text-sm"></i>
                            </button>
                            {#if message.userId === userId}
                            <button on:click={() => toggleMessageInfo(message.id)} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-information-line text-sm"></i>
                            </button>
                            {/if}
                        </div>

                        {#if showMessageInfo === message.id && message.userId === userId}
                        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
                            <div class="bg-cWhiteGray p-8 rounded-lg max-w-md w-full mx-4 shadow-2xl border border-white/10" transition:scale={{ duration: 300, easing: quintOut }}>
                                <div class="flex justify-between items-center mb-6">
                                    <div class="flex items-center gap-3">
                                        <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                                            <i class="ri-information-line text-cYellow text-xl"></i>
                                        </div>
                                        <h3 class="text-xl font-semibold text-white opacity-90">{$_("room.chat.messageInfo.title")}</h3>
                                    </div>
                                    <button on:click={() => showMessageInfo = null} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300">
                                        <i class="ri-close-line text-xl"></i>
                                    </button>
                                </div>
                                
                                <div class="space-y-6">
                                    <div class="bg-[#2C2C2C]/50 rounded-lg p-4 border border-white/5">
                                        <div class="flex items-center justify-between mb-4">
                                            <span class="text-white opacity-50 flex items-center gap-2">
                                                <i class="ri-eye-line"></i>
                                                {$_("room.chat.messageInfo.readBy")}
                                            </span>
                                            <span class="font-medium bg-cYellow/10 text-cYellow px-2.5 py-1 rounded-full text-sm">
                                                {message.readBy?.length || 0} {$_("room.chat.messageInfo.people")}
                                            </span>
                                        </div>
                                        
                                        <div class="max-h-[250px] overflow-y-auto custom-scrollbar">
                                            {#if message.readBy && message.readBy.length > 0}
                                                <div class="space-y-2">
                                                    {#each message.readBy as reader}
                                                    <div class="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-lg transition-colors duration-200">
                                                        <div class="w-9 h-9 bg-cYellow rounded-lg flex items-center justify-center text-black text-sm font-bold shadow-lg">
                                                            {(reader as string).slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <span class="text-white opacity-90 font-medium">{reader}</span>
                                                    </div>
                                                    {/each}
                                                </div>
                                            {:else}
                                                <div class="text-center py-8 text-white opacity-50">
                                                    <i class="ri-eye-off-line text-3xl mb-2"></i>
                                                    <p>{$_("room.chat.messageInfo.noReadersYet")}</p>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/if}

                        {#if showEmojiPicker && activeMessageId === message.id}
                        <div bind:this={emojiPickerRef} class="absolute {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} bg-[#2C2C2C]/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 p-2.5 z-50 animate-fadeIn" style="top: 0; margin-top: 8px; margin-bottom: 10px;">
                            <div class="flex gap-1">
                                {#each commonEmojis as emoji}
                                <button on:click={() => handleReaction(message.id, emoji)} class="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 {message.reactions?.[emoji]?.includes(userId) ? message.userId === userId ? 'bg-cYellow text-black' : 'bg-white/10' : ''}">
                                    {emoji}
                                </button>
                                {/each}
                            </div>
                        </div>
                        {/if}
                    </div>

                    {#if Object.keys(message.reactions || {}).length > 0}
                    <div class="flex flex-wrap gap-1 mt-1.5 {message.userId === userId ? 'justify-end' : 'justify-start'}" style="width: {message.message.length > 100 ? '350px' : 'fit-content'}">
                        {#each Object.entries(message.reactions || {}) as [emoji, users]}
                        <div class="flex items-center gap-1 bg-[#2C2C2C] rounded-lg px-2 py-0.5 text-sm hover:bg-[#363636] transition-colors duration-200">
                            <span>{emoji}</span>
                            <span class="text-xs opacity-70">{users.length}</span>
                        </div>
                        {/each}
                    </div>
                    {/if}
                </div>
                {/each}
            </div>
        </div>
        {/if}

        {#if showBookmarkPanel}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" transition:fade={{ duration: 200 }}>
            <div class="hidden md:block">
                <div class="fixed right-0 top-0 bottom-0 w-80 bg-cWhiteGray border-l border-white/10 shadow-xl z-50" transition:slide={{ duration: 300, axis: 'x', easing: quintOut }}>
                    <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                                <i class="ri-bookmark-fill text-cYellow text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold">{$_("room.chat.bookmarkPanel.title")}</h3>
                            </div>
                            <button on:click={() => showBookmarkPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <p class="text-xs text-white opacity-20 mt-5">
                            <span class="text-white opacity-50">
                                {$_("room.chat.bookmarkPanel.description")}
                            </span>
                        </p>
                    </div>

                    <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                        {#if bookmarks.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-bookmark-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.bookmarkPanel.noBookmarksYet")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.bookmarkPanel.noBookmarksYetDescription")}</p>
                        </div>
                        {:else}
                        {#each bookmarks.sort((a, b) => b.timestamp - a.timestamp) as bookmark}
                        <div class="bg-[#2C2C2C] rounded-lg p-4 group hover:bg-[#363636] transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg">
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-cYellow rounded-lg flex items-center justify-center text-black text-sm font-bold shadow-md">
                                        {bookmark.userId.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-white opacity-90">{bookmark.userId}</span>
                                        <span class="text-xs text-white opacity-50">{new Date(bookmark.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button 
                                    class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all duration-300"
                                    on:click={() => toggleBookmark({ id: bookmark.messageId, message: bookmark.message })}
                                >
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>

                            {#if bookmark.message.startsWith('[IMAGE]')}
                            <div class="relative ml-10">
                                <div class="relative group/image">
                                    <img 
                                        src={decodeBase64Image(bookmark.message.slice(7))} 
                                        alt="Bookmarked image" 
                                        class="max-w-full w-[200px] rounded-lg object-contain hover:shadow-xl transition-all duration-300"
                                        on:error={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        <button class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300">
                                            <i class="ri-zoom-in-line text-white text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-[200px]">
                                    <i class="ri-image-line text-xl"></i>
                                    <span class="text-xs">{$_("room.chat.imageUnavailable")}</span>
                                </div>
                            </div>
                            {:else}
                            <p class="text-sm text-white opacity-70 break-words ml-10 bg-black/20 p-3 rounded-lg">{bookmark.message}</p>
                            {/if}

                            <div class="flex items-center gap-2 mt-3 ml-10">
                                <button 
                                    on:click={() => {
                                        scrollToMessage(bookmark.messageId);
                                        showBookmarkPanel = false;
                                    }}
                                    class="text-xs bg-cYellow/10 hover:bg-cYellow/20 text-cYellow px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg"
                                >
                                    <i class="ri-arrow-right-line"></i>
                                    {$_("room.chat.gotoMessage")}
                                </button>
                                <button 
                                    on:click={() => copyMessage(bookmark.message)}
                                    class="text-xs bg-white/5 hover:bg-white/10 text-white opacity-70 hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                >
                                    <i class="ri-file-copy-line"></i>
                                    {$_("room.chat.copyMessage")}
                                </button>
                            </div>
                        </div>
                        {/each}
                        {/if}
                    </div>
                </div>
            </div>

            <div class="block md:hidden">
                <div class="fixed bottom-0 left-0 right-0 h-[80vh] bg-cWhiteGray border-t border-white/10 shadow-xl z-50 rounded-t-xl" transition:slide={{ duration: 300, axis: 'y', easing: quintOut }}>
                    <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                                <i class="ri-bookmark-fill text-cYellow text-xl"></i>
                            </div>
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold">{$_("room.chat.bookmarkPanel.title")}</h3>
                            </div>
                            <button on:click={() => showBookmarkPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300">
                                <i class="ri-close-line text-xl"></i>
                            </button>
                        </div>
                        <p class="text-xs text-white opacity-20 mt-5">
                            <span class="text-white opacity-50">
                                {$_("room.chat.bookmarkPanel.description")}
                            </span>
                        </p>
                    </div>

                    <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                        {#if bookmarks.length === 0}
                        <div class="flex flex-col items-center justify-center py-16 text-white opacity-30">
                            <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                                <i class="ri-bookmark-line text-4xl"></i>
                            </div>
                            <p class="text-base font-medium text-white opacity-70">{$_("room.chat.bookmarkPanel.noBookmarksYet")}</p>
                            <p class="text-sm text-white opacity-40 text-center mt-2">{$_("room.chat.bookmarkPanel.noBookmarksYetDescription")}</p>
                        </div>
                        {:else}
                        {#each bookmarks.sort((a, b) => b.timestamp - a.timestamp) as bookmark}
                        <div class="bg-[#2C2C2C] rounded-lg p-4 group hover:bg-[#363636] transition-all duration-300 border border-white/5 hover:border-white/10 hover:shadow-lg">
                            <div class="flex items-start justify-between gap-3 mb-2">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-8 h-8 bg-cYellow rounded-lg flex items-center justify-center text-black text-sm font-bold shadow-md">
                                        {bookmark.userId.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-sm font-medium text-white opacity-90">{bookmark.userId}</span>
                                        <span class="text-xs text-white opacity-50">{new Date(bookmark.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <button 
                                    class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-0 group-hover:opacity-50 hover:opacity-100 transition-all duration-300"
                                    on:click={() => toggleBookmark({ id: bookmark.messageId, message: bookmark.message })}
                                >
                                    <i class="ri-delete-bin-line"></i>
                                </button>
                            </div>

                            {#if bookmark.message.startsWith('[IMAGE]')}
                            <div class="relative ml-10">
                                <div class="relative group/image">
                                    <img 
                                        src={decodeBase64Image(bookmark.message.slice(7))} 
                                        alt="Bookmarked image" 
                                        class="max-w-full w-[200px] rounded-lg object-contain hover:shadow-xl transition-all duration-300"
                                        on:error={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                                        <button class="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-300">
                                            <i class="ri-zoom-in-line text-white text-xl"></i>
                                        </button>
                                    </div>
                                </div>
                                <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-[200px]">
                                    <i class="ri-image-line text-xl"></i>
                                    <span class="text-xs">{$_("room.chat.imageUnavailable")}</span>
                                </div>
                            </div>
                            {:else}
                            <p class="text-sm text-white opacity-70 break-words ml-10 bg-black/20 p-3 rounded-lg">{bookmark.message}</p>
                            {/if}

                            <div class="flex items-center gap-2 mt-3 ml-10">
                                <button 
                                    on:click={() => {
                                        scrollToMessage(bookmark.messageId);
                                        showBookmarkPanel = false;
                                    }}
                                    class="text-xs bg-cYellow/10 hover:bg-cYellow/20 text-cYellow px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5 hover:shadow-lg"
                                >
                                    <i class="ri-arrow-right-line"></i>
                                    {$_("room.chat.gotoMessage")}
                                </button>
                                <button 
                                    on:click={() => copyMessage(bookmark.message)}
                                    class="text-xs bg-white/5 hover:bg-white/10 text-white opacity-70 hover:opacity-90 px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1.5"
                                >
                                    <i class="ri-file-copy-line"></i>
                                    {$_("room.chat.copyMessage")}
                                </button>
                            </div>
                        </div>
                        {/each}
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        {/if}

        <div class="bg-cWhiteGray border-t border-white/10 fixed bottom-0 left-0 right-0 sm:relative z-10">
            <div class="px-4 sm:px-6 py-2.5 sm:py-4">
                {#if replyingTo}
                <div class="bg-[#2C2C2C]/90 rounded-lg p-3 mb-3 flex items-center justify-between border-l-2 border-l-cYellow border border-white/5">
                    <div class="text-sm text-white opacity-50 truncate flex items-center gap-2">
                        <i class="ri-reply-fill text-cYellow text-lg"></i>
                        <div>
                            <span class="text-cYellow font-medium">{$_("room.chat.replyingMessage")}</span>
                            <p class="truncate">{replyingTo.message}</p>
                        </div>
                    </div>
                    <button on:click={cancelReply} class="p-1.5 hover:bg-white/10 rounded-lg text-white opacity-50 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                        <i class="ri-close-fill text-lg"></i>
                    </button>
                </div>
                {/if}

                <div class="flex gap-2 max-w-[100vw] sm:max-w-none">
                    <div class="relative">
                        <button bind:this={inputEmojiButtonRef} on:click={() => showInputEmojiPicker = !showInputEmojiPicker} class="w-12 h-12 bg-[#2C2C2C]/90 border border-white/10 rounded-lg focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 transition-all duration-300 text-white hover:bg-[#2C2C2C] flex items-center justify-center flex-shrink-0">
                            <i class="ri-emotion-line text-xl"></i>
                        </button>

                        {#if showInputEmojiPicker}
                        <div bind:this={inputEmojiPickerRef} class="absolute bottom-full left-0 mb-2 bg-[#2C2C2C]/95 backdrop-blur-sm rounded-lg shadow-xl border border-white/10 p-3 z-50 animate-fadeIn w-[320px]" in:slide={{ duration: 200, axis: 'y' }} out:slide={{ duration: 200, axis: 'y' }}>
                            <div class="mb-3">
                                <div class="relative">
                                    <input type="text" bind:value={emojiSearchQuery} placeholder={$_("room.chat.emojiPicker.placeholder")} class="w-full pl-9 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20 placeholder-white opacity-30" />
                                    <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white opacity-30"></i>
                                </div>
                            </div>

                            <div class="overflow-hidden rounded-lg">
                                {#if !emojiSearchQuery}
                                    <div class="flex gap-1 mb-2 pb-2 overflow-x-auto custom-scrollbar border-b border-white/10">
                                        {#each Object.entries({
                                            [$_("room.chat.emojiPicker.smileysAndemotion")]: 'ri-emotion-happy-line',
                                            [$_("room.chat.emojiPicker.peopleAndbody")]: 'ri-user-smile-line',
                                            [$_("room.chat.emojiPicker.animalsAndnature")]: 'ri-plant-line',
                                            [$_("room.chat.emojiPicker.foodAnddrink")]: 'ri-cup-line',
                                            [$_("room.chat.emojiPicker.activities")]: 'ri-basketball-line',
                                            [$_("room.chat.emojiPicker.travelAndplaces")]: 'ri-map-pin-line',
                                            [$_("room.chat.emojiPicker.objects")]: 'ri-lightbulb-line',
                                            [$_("room.chat.emojiPicker.symbols")]: 'ri-heart-3-line'
                                        }) as [category, icon]}
                                        <button class="px-3 py-2.5 text-xs whitespace-nowrap rounded-lg transition-all duration-300 flex items-center gap-2 {selectedCategory === category ? 'bg-cYellow text-black font-medium shadow-lg' : 'text-white opacity-70 hover:bg-white/10'}" on:click={() => selectedCategory = category}>
                                            <i class={icon}></i>
                                            <span class="hidden sm:inline">{category}</span>
                                        </button>
                                        {/each}
                                    </div>

                                    <div class="overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                                        {#if selectedCategory}
                                            <div class="grid grid-cols-8 gap-1.5">
                                                {#each emojiCategories[selectedCategory] as emoji}
                                                    <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
                                                        {emoji}
                                                    </button>
                                                {/each}
                                            </div>
                                        {:else}
                                            {#each Object.entries({
                                                [$_("room.chat.emojiPicker.smileysAndemotion")]: ['ri-emotion-happy-line', emojiCategories['Smileys & Emotion']],
                                                [$_("room.chat.emojiPicker.peopleAndbody")]: ['ri-user-smile-line', emojiCategories['People & Body']],
                                                [$_("room.chat.emojiPicker.animalsAndnature")]: ['ri-plant-line', emojiCategories['Animals & Nature']],
                                                [$_("room.chat.emojiPicker.foodAnddrink")]: ['ri-cup-line', emojiCategories['Food & Drink']],
                                                [$_("room.chat.emojiPicker.activities")]: ['ri-basketball-line', emojiCategories['Activities']],
                                                [$_("room.chat.emojiPicker.travelAndplaces")]: ['ri-map-pin-line', emojiCategories['Travel & Places']],
                                                [$_("room.chat.emojiPicker.objects")]: ['ri-lightbulb-line', emojiCategories['Objects']],
                                                [$_("room.chat.emojiPicker.symbols")]: ['ri-heart-3-line', emojiCategories['Symbols']]
                                            }) as [category, [icon, categoryEmojis]]}
                                                <div class="mb-4 last:mb-0">
                                                    <div class="flex items-center gap-2 mb-2">
                                                        <div class="text-xs font-medium text-white opacity-70 flex items-center gap-1.5">
                                                            <i class={icon}></i>
                                                            {category}
                                                        </div>
                                                        <div class="h-[1px] flex-1 bg-white/10"></div>
                                                    </div>
                                                    <div class="grid grid-cols-8 gap-1.5">
                                                        {#each categoryEmojis as emoji}
                                                            <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
                                                                {emoji}
                                                            </button>
                                                        {/each}
                                                    </div>
                                                </div>
                                            {/each}
                                        {/if}
                                    </div>
                                {:else}
                                    <div class="overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                                        {#if filteredEmojis.length > 0}
                                        <div class="grid grid-cols-8 gap-1.5">
                                            {#each filteredEmojis as emoji}
                                            <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
                                                {emoji}
                                            </button>
                                            {/each}
                                        </div>
                                        {:else}
                                        <div class="text-center py-8 text-white opacity-50">
                                            <i class="ri-emotion-sad-line text-3xl mb-2 block"></i>
                                            <p class="text-sm">{$_("room.chat.emojiPicker.noEmojisFound")}</p>
                                        </div>
                                        {/if}
                                    </div>
                                {/if}
                            </div>

                            <div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white opacity-40">
                                <span>{$_("room.chat.emojiPicker.insert")}</span>
                                {#if selectedCategory}
                                <span>{emojiCategories[selectedCategory].length} {$_("room.chat.emojiPicker.length")}</span>
                                {/if}
                            </div>
                        </div>
                        {/if}
                    </div>

                    <div class="relative">
                        <button bind:this={fileInputButtonRef} on:click={() => fileInput.click()} class="w-12 h-12 bg-[#2C2C2C]/90 border border-white/10 rounded-lg focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 transition-all duration-300 text-white hover:bg-[#2C2C2C] flex items-center justify-center flex-shrink-0">
                            <i class="ri-image-line text-xl"></i>
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            bind:this={fileInput}
                            class="hidden"
                            on:change={handleFileSelect}
                        />
                        
                        {#if imageUploadProgress > 0}
                        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
                            <div class="bg-[#2C2C2C] p-8 rounded-lg shadow-xl border border-white/10 max-w-sm w-full mx-4" transition:scale={{ duration: 300, easing: quintOut }}>
                                <div class="flex flex-col items-center gap-4">
                                    <div class="flex items-center gap-3 w-full">
                                        <div class="w-full bg-black/20 rounded-full h-2 overflow-hidden">
                                            <div class="h-full bg-cYellow transition-all duration-300 rounded-full" style="width: {imageUploadProgress}%"></div>
                                        </div>
                                        <div class="text-sm font-medium text-white opacity-90 min-w-[40px]">{Math.round(imageUploadProgress)}%</div>
                                    </div>
                                    <p class="text-white opacity-70 text-sm text-center">{$_("room.chat.imageSelector.uploading")}</p>
                                </div>
                            </div>
                        </div>                        
                        {/if}
                    </div>             

                    <div class="flex-1 relative">
                        <textarea 
                            id="message-input" 
                            bind:value={message} 
                            bind:this={messageInput}
                            placeholder={$_("room.chat.messageInput.placeholder")} 
                            on:input={(e) => {
                                handleInput(e);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                            }}
                            on:keydown={(e) => {
                                handleKeyDown(e);
                                if (e.key === 'Enter' && !e.shiftKey && !isSendButtonDisabled) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }} 
                            class="w-full min-h-[48px] max-h-[120px] bg-[#2C2C2C]/90 border border-white/10 
                                rounded-lg px-4 py-3 text-sm text-white
                                placeholder:text-white/30 placeholder:text-sm
                                focus:outline-none focus:border-cYellow focus:ring-2 
                                focus:ring-cYellow/20 focus:shadow-lg focus:shadow-cYellow/5
                                transition-all duration-300 ease-in-out
                                resize-none overflow-hidden
                                hover:bg-[#2C2C2C]/95 hover:border-white/20"
                            rows="1"
                        ></textarea>
                        
                        {#if showUserDropdown && filteredUsers.length > 0}
                        <div class="absolute bottom-full left-0 w-full bg-[#2C2C2C]/90 border border-white/10 rounded-lg overflow-hidden mb-2 shadow-xl animate-fadeIn">
                            {#each filteredUsers as user, index}
                            <button class="w-full px-4 py-2.5.5 text-left hover:bg-white/10 transition-all duration-300 text-sm
                                {index === userDropdownIndex ? 'bg-white/10 text-cYellow' : 'text-white'} flex items-center gap-2" 
                                on:click={() => selectUser(user)}>
                                <i class="ri-at-fill"></i>
                                {user}
                            </button>
                            {/each}
                        </div>
                        {/if}
                    </div>
                    
                    <button 
                        on:click={() => {
                            if (!isSendButtonDisabled) {
                                handleSendMessage();
                                messageInput.focus();
                            }
                        }} 
                        disabled={isSendButtonDisabled} 
                        class="w-12 h-12 bg-cYellow text-black rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 active:scale-95 disabled:hover:scale-100 flex-shrink-0"
                    >
                        <i class="ri-send-plane-2-fill text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}
{/if}