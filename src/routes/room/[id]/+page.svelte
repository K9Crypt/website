<script lang="ts">
    import { page } from '$app/stores';
    import { leaveRoom, joinRoom, checkRoom, checkPassword } from '$lib/room';
    import { sendMessage, getMessages, markMessageAsRead, reactToMessage } from '$lib/message';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { emojis } from '$lib/emojis';
    import { fade, scale, slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    let userId: string = '';
    let message: string = '';
    let isLoading = false;
    let status: boolean | null = null;
    let error = '';
    let isPageLoading = true;
    let messages: Array<{ 
        id: string; 
        userId: string; 
        message: string; 
        replyTo?: { sender: string; content: string };
        readBy?: string[];
        reactions?: Record<string, string[]>;
    }> = [];
    let pollingInterval: NodeJS.Timeout;
    let replyingTo: { 
        message: string;
        sender: string;
        content: string;
        id: string;
    } | null = null;
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
    let emojiDescriptions = {
        '😀': ['grinning face', 'happy', 'smile', 'joy', 'grin'],
        '😃': ['grinning face with big eyes', 'happy', 'joy', 'smiley', 'excited'],
        '😄': ['grinning face with smiling eyes', 'happy', 'laugh', 'joy', 'pleased'],
        '😊': ['smiling face', 'happy', 'warm', 'sweet', 'pleasant'],
        '❤️': ['heart', 'love', 'like', 'romance', 'affection'],
        '👍': ['thumbs up', 'approve', 'ok', 'good', 'agree'],
        '🎉': ['party popper', 'celebration', 'tada', 'party', 'congrats'],
        '🔥': ['fire', 'hot', 'trending', 'lit', 'popular'],
        '😂': ['face with tears of joy', 'laugh', 'lol', 'funny', 'haha'],
        '🥰': ['smiling face with hearts', 'love', 'affection', 'adore', 'crush'],
        '😍': ['heart eyes', 'love', 'crush', 'adore', 'attractive'],
        '🤗': ['hugging face', 'hug', 'embrace', 'comfort', 'support'],
        '🙏': ['folded hands', 'please', 'thank you', 'pray', 'grateful'],
        '✨': ['sparkles', 'shine', 'special', 'magic', 'glitter'],
        '💪': ['flexed biceps', 'strong', 'muscle', 'power', 'flex'],
        '👀': ['eyes', 'look', 'see', 'watch', 'peek'],
        '🤔': ['thinking face', 'hmm', 'wonder', 'curious', 'ponder'],
        '😎': ['cool face', 'sunglasses', 'awesome', 'chill', 'rad'],
        '🥺': ['pleading face', 'puppy eyes', 'cute', 'beg', 'please'],
        '😢': ['crying face', 'sad', 'tear', 'unhappy', 'upset']
    };
    let emojiCategories = {
        'Smileys & Emotion': emojis.slice(0, 72),
        'People & Body': emojis.slice(72, 160),
        'Animals & Nature': emojis.slice(160, 240),
        'Food & Drink': emojis.slice(240, 320),
        'Activities': emojis.slice(320, 360),
        'Travel & Places': emojis.slice(360, 400),
        'Objects': emojis.slice(400, 440),
        'Symbols': emojis.slice(440)
    };
    let lastMessageTimestamp = 0;
    const MESSAGE_COOLDOWN = 100;
    let messageQueue: Array<{ content: string; tempId: string; isImage: boolean }> = [];
    let isProcessingQueue = false;
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

    function parseMarkdown(text: string): string {
        return text
            .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
            .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
            .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/~~(.*?)~~/g, '<del>$1</del>')
            .replace(/```(.*?)```/gs, '<pre class="bg-black/20 p-2 rounded-lg text-cYellow my-2 overflow-x-auto"><code>$1</code></pre>')
            .replace(/`([^`]+)`/g, '<code class="bg-black/20 px-1.5 py-0.5 rounded-lg text-cYellow">$1</code>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/==(.*?)==/g, '<mark class="bg-cYellow/30 px-1 rounded-lg">$1</mark>')
            .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-cYellow pl-3 py-1 my-2 italic">$1</blockquote>')
            .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
            .replace(/^\+ (.*$)/gm, '<li class="ml-4 list-circle">$1</li>')
            .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-500 hover:underline">$1</a>');
    }

    async function handleFileSelect(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
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
            toast.error('Failed to process image');
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
                
                Object.entries(emojiDescriptions).forEach(([emoji, descriptions]) => {
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

    let loadTimeout: NodeJS.Timeout;
    let isTabVisible = true;

    function handleVisibilityChange() {
        isTabVisible = document.visibilityState === 'visible';
        if (isTabVisible) {
            loadRoomData().then(() => startPolling());
        } else {
            stopPolling();
        }
    }

    async function loadRoomData() {
        try {
            const loadingStartTime = Date.now();
            const newMessages = await getMessages(roomId);
            
            if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                const processedMessages = newMessages.map(msg => {
                    const existingMessage = messages.find(m => m.id === msg.id);
                    const readBy = msg.readBy || [];
                    
                    if (!readBy.includes(userId) && msg.userId !== userId) {
                        markMessageAsRead(roomId, userId, msg.id).catch(console.error);
                        readBy.push(userId);
                    }
                    
                    return {
                        ...msg,
                        id: msg.id || existingMessage?.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        readBy,
                        reactions: msg.reactions || existingMessage?.reactions || {}
                    };
                });

                messages = processedMessages;
                
                const responseTime = Date.now() - loadingStartTime;
                pollingInterval = Math.max(2000, Math.min(5000, responseTime * 2));
            }
        } catch (err) {
            error = 'Failed to load room data';
            console.error('Error loading room data:', err);
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

    function startPolling() {
        stopPolling();
        loadRoomData();
        pollingInterval = setInterval(loadRoomData, 3000);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
        }
    }

    function handleReply(msg: { 
        message: string; 
        userId: string; 
        id: string;
    }) {
        if (!msg.message.startsWith('[IMAGE]')) {
            replyingTo = {
                message: msg.message,
                sender: msg.userId,
                content: msg.message,
                id: msg.id
            };
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
                isPageLoading = false;
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
        } finally {
            isPageLoading = false;
        }
    });

    onDestroy(() => {
        if (typeof document !== 'undefined') {
            stopPolling();
            clearTimeout(loadTimeout);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (clickOutsideHandler) {
                document.removeEventListener('click', clickOutsideHandler);
            }
        }
    });

    async function processMessageQueue() {
        if (isProcessingQueue || messageQueue.length === 0) return;
        
        isProcessingQueue = true;
        
        while (messageQueue.length > 0) {
            const { content, tempId, isImage } = messageQueue[0];
            
            try {
                await sendMessage(roomId, userId, content);
                await loadRoomData();
                messageQueue.shift();
            } catch (err) {
                messages = messages.filter(m => m.id !== tempId);
                toast.error('Failed to send message', {
                    duration: 3000,
                    position: 'bottom-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                messageQueue = [];
                break;
            }
            
            await new Promise(resolve => setTimeout(resolve, MESSAGE_COOLDOWN));
        }
        
        isProcessingQueue = false;
    }

    async function handleSendMessage(isImage = false) {
        const now = Date.now();
        if (now - lastMessageTimestamp < MESSAGE_COOLDOWN) {
            return;
        }
        
        if ((!isImage && isSendButtonDisabled) || (isImage && !selectedImage)) return;
        
        const messageContent = isImage 
            ? `[IMAGE]${selectedImage}`
            : replyingTo
                ? `Replying to "${replyingTo.message}": \n\n${message.trim()}`
                : message.trim();
                
        if (!isImage && (!messageContent || messageContent.length > 2000)) {
            toast.error('Message must be between 1 and 2000 characters', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        const tempId = `temp-${Date.now()}`;
        const tempMessage = {
            id: tempId,
            userId: userId,
            message: messageContent,
            readBy: [userId],
            reactions: {},
            replyTo: replyingTo ? {
                sender: userId,
                content: replyingTo.message
            } : undefined
        };
        
        messages = [...messages, tempMessage];
        message = '';
        replyingTo = null;
        isLoading = true;
        lastMessageTimestamp = now;

        messageQueue.push({
            content: messageContent,
            tempId,
            isImage
        });

        processMessageQueue();
        isLoading = false;
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
        message = input.value;
        
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
    <div class="bg-cWhiteGray p-8 rounded-lg-lg shadow-xl border border-white/10 max-w-md w-full mx-4" transition:scale={{ duration: 300, easing: quintOut }}>
        <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-red-500/10 rounded-lg-full flex items-center justify-center mb-4">
                <i class="ri-error-warning-fill text-red-500 text-3xl"></i>
            </div>
            <h3 class="text-xl font-bold mb-2">Room Not Found</h3>
            <p class="text-white/50 mb-6">This room might have been deleted or never existed.</p>
            
            <div class="flex gap-3">
                <a href="/create/room" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center no-underline">Go Back</a>
                <a href="/contact" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center no-underline">Support</a>
            </div>
        </div>
    </div>
</div>
{/if}
{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>Try Again</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>Support</button>
        </div>
    </div>
</div>
{:else}
{#if isPageLoading}
<div class="fixed inset-0">
    <div class="h-screen flex flex-col">
        <div class="bg-cWhiteGray/50 backdrop-blur-md border-b border-white/10">
            <div class="px-3 sm:px-6 py-2.5 sm:py-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2C2C2C] rounded-lg animate-pulse"></div>
                        <div class="min-w-0 flex-1">
                            <div class="h-5 sm:h-6 bg-[#2C2C2C] rounded-lg w-32 sm:w-48 mb-2 animate-pulse"></div>
                            <div class="h-4 bg-[#2C2C2C] rounded-lg w-24 sm:w-32 animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div class="w-full sm:w-auto h-10 bg-[#2C2C2C] rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50">
            <div class="px-6 py-6 space-y-6 min-h-full">
                {#each Array(5) as _, i}
                <div class="flex flex-col {i % 2 === 0 ? 'items-end' : 'items-start'} animate-fadeIn">
                    {#if i % 3 === 0}
                    <div class="bg-[#2C2C2C]/80 rounded-lg p-3 mb-2 max-w-[85%] text-sm text-white/50 border-l-2 border-l-cYellow border border-white/5 relative">
                        <div class="h-4 bg-[#2C2C2C] rounded-lg w-24 mb-2"></div>
                        <div class="h-3 bg-[#2C2C2C] rounded-lg w-48"></div>
                    </div>
                    {/if}
                    
                    <div class="{i % 2 === 0 ? 'bg-cYellow/20 text-white rounded-lg-l-lg rounded-lg-tr-lg' : 'bg-[#2C2C2C] text-white rounded-lg-r-lg rounded-lg-tl-lg'} p-4 max-w-[350px] w-fit border border-white/5 relative">
                        {#if i % 2 !== 0}
                        <div class="h-4 bg-[#2C2C2C] rounded-lg w-24 mb-2"></div>
                        {/if}
                        <div class="flex flex-col gap-2">
                            {#if i % 2 !== 0}
                            <div class="h-3 bg-[#2C2C2C] rounded-lg w-24 opacity-50"></div>
                            {/if}
                            <div class="h-3 bg-[#2C2C2C] rounded-lg w-full"></div>
                            <div class="h-3 bg-[#2C2C2C] rounded-lg w-3/4"></div>
                            {#if i % 2 === 0}
                            <div class="h-3 bg-[#2C2C2C] rounded-lg w-1/2"></div>
                            {/if}
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>

        <div class="bg-cWhiteGray border-t border-white/10">
            <div class="px-6 py-4">
                <div class="flex gap-3">
                    <div class="flex-1 h-[52px] bg-[#2C2C2C] rounded-lg animate-pulse"></div>
                    <div class="w-[52px] h-[52px] bg-[#2C2C2C] rounded-lg animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
{#if isPasswordRequired}
<div class="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Enter Room Password</h3>
        <p class="text-white/50 text-sm mb-6">This is a private room. Please enter the password to join.</p>
        
        <div class="space-y-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium">Password</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white/30 transition-all duration-300 text-white" />
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
                                <span class="truncate">Room Name: {roomName}</span>
                                <button on:click={toggleCopyPopup} class="flex-shrink-0 hover:scale-105 active:scale-95">
                                    <i class="ri-file-copy-fill text-white/50 hover:text-cYellow transition-all duration-300 p-1.5 rounded-lg hover:bg-white/10"></i>
                                </button>
                            </h3>
                            <span class="text-white/50 text-xs sm:text-sm flex items-center gap-1.5">
                                <i class="ri-shield-keyhole-fill"></i>
                                {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
                            </span>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <button on:click={() => showSearchPanel = !showSearchPanel} class="bg-[#2C2C2C]/90 text-white/70 hover:text-cYellow px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#2C2C2C] active:scale-95 transition-all duration-300">
                            <i class="ri-search-line"></i>
                            <span>Search</span>
                        </button>
                        <button on:click={() => showBookmarkPanel = !showBookmarkPanel} class="bg-[#2C2C2C]/90 text-white/70 hover:text-cYellow px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#2C2C2C] active:scale-95 transition-all duration-300">
                            <i class="ri-bookmark-line"></i>
                            <span>Bookmarks</span>
                            {#if bookmarks.length > 0}
                            <span class="text-xs bg-cYellow text-black rounded-full px-1.5">{bookmarks.length}</span>
                            {/if}
                        </button>
                        <button on:click={handleLeaveRoom} class="bg-red-500/10 text-red-500 px-4 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-95 transition-all duration-300">
                            <i class="ri-door-open-fill"></i>
                            <span>Leave Room</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {#if showSearchPanel}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" transition:fade={{ duration: 200 }}>
            <div class="fixed right-0 top-0 bottom-0 w-80 bg-cWhiteGray border-l border-white/10 shadow-xl z-50" transition:slide={{ duration: 300, axis: 'x', easing: quintOut }}>
                
                <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                            <i class="ri-search-line text-cYellow text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold">Search Messages</h3>
                            <p class="text-sm text-white/50">{searchResults.length} results found</p>
                        </div>
                        <button on:click={() => showSearchPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all duration-300">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>

                    <div class="relative">
                        <input 
                            type="text" 
                            bind:value={messageSearchQuery}
                            placeholder="Search messages..." 
                            class="w-full bg-[#2C2C2C] border border-white/10 rounded-lg px-4 py-2.5 pl-9 text-sm placeholder:text-white/30 focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20"
                        >
                        <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30"></i>
                    </div>
                </div>

                <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                    {#if messageSearchQuery.length === 0}
                    <div class="flex flex-col items-center justify-center py-16 text-white/30">
                        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                            <i class="ri-search-line text-4xl"></i>
                        </div>
                        <p class="text-base font-medium text-white/70">Search Messages</p>
                        <p class="text-sm text-white/40 text-center mt-2">Type to search through messages</p>
                    </div>
                    {:else if searchResults.length === 0}
                    <div class="flex flex-col items-center justify-center py-16 text-white/30">
                        <div class="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-5">
                            <i class="ri-file-search-line text-4xl"></i>
                        </div>
                        <p class="text-base font-medium text-white/70">No results found</p>
                        <p class="text-sm text-white/40 text-center mt-2">Try different keywords</p>
                    </div>
                    {:else}
                    {#each searchResults as result}
                    <div class="bg-[#2C2C2C] rounded-lg p-3 group hover:bg-[#363636] transition-colors duration-200">
                        <div class="flex items-start justify-between gap-2 mb-1">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-cYellow rounded-lg flex items-center justify-center text-black text-xs font-bold">
                                    {result.userId.slice(0, 2).toUpperCase()}
                                </div>
                                <span class="text-sm font-medium text-white/90">{result.userId}</span>
                            </div>
                        </div>
                        <p class="text-sm text-white/70 mb-2 break-words pl-8">{result.message}</p>
                        <button 
                            on:click={() => {
                                scrollToMessage(result.id);
                                showSearchPanel = false;
                            }}
                            class="text-xs text-cYellow hover:text-cYellow/80 transition-all duration-300 flex items-center gap-1.5 ml-8"
                        >
                            <i class="ri-arrow-right-line"></i>
                            Go to message
                        </button>
                    </div>
                    {/each}
                    {/if}
                </div>
            </div>
        </div>
        {/if}

        {#if showCopyPopup}
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
            <div class="bg-cWhiteGray p-6 rounded-lg max-w-md w-full mx-4" transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white/90">Copy Room ID</h3>
                    <button on:click={toggleCopyPopup} class="text-white/50 hover:text-white transition-all duration-300">
                        <i class="ri-close-line text-xl"></i>
                    </button>
                </div>
                
                <div class="flex items-center justify-between mb-4">
                    <div class="relative flex-1">
                        <i class="ri-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                        <input type="text" value={roomId} readonly class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg text-white" />
                    </div>
                </div>
                <button on:click={copyRoomIdWithPopup} class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center w-full mb-4">Copy</button>
                <p class="text-white/50 text-sm">You need to enter this Room ID in the <a href="/join/room" class="underline">join/room</a> section after providing your username.</p>
            </div>
        </div>
        {/if}

        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50 pb-[120px] sm:pb-0" bind:this={messagesContainer} on:scroll={handleScroll}>
            <div class="px-4 sm:px-6 py-6 space-y-6 min-h-full">
                {#each messages as message (message.id)}
                <div class="flex flex-col {message.userId === userId ? 'items-end' : 'items-start'} group animate-fadeIn" id="message-{message.id}">
                    {#if message.replyTo}
                    <div class="bg-[#2C2C2C]/80 rounded-lg p-2 mb-2 max-w-[85%] text-sm text-white/50 border-l-2 border-l-cYellow border border-white/5 relative">
                        <div class="font-medium text-cYellow flex items-center gap-1.5 mb-1">
                            <i class="ri-reply-fill text-sm"></i>
                            <span class="text-white/90 text-sm">{message.replyTo.sender}</span>
                        </div>
                        <div class="pl-4 border-l border-white/10">
                            {#if message.replyTo.content.startsWith('[IMAGE]')}
                                <div class="relative">
                                    <img 
                                        src={decodeBase64Image(message.replyTo.content.slice(7))} 
                                        alt="Replied image" 
                                        class="max-w-full w-[100px] rounded-lg-lg object-contain"
                                        on:error={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg-lg w-full min-h-[50px]">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="ri-error-warning-line text-xl"></i>
                                            <span class="text-xs">Image failed to load</span>
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
                                        on:error={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-full min-h-[100px]">
                                        <div class="flex flex-col items-center gap-2">
                                            <i class="ri-error-warning-line text-2xl"></i>
                                            <span class="text-sm">Image failed to load</span>
                                        </div>
                                    </div>
                                </div>
                                {:else}
                                <p class="leading-relaxed whitespace-pre-wrap break-words text-sm">{@html parseMarkdown(message?.message?.replace(/@(\w+)/g, '<span class="font-bold underline">@$1</span>')) || ''}</p>
                                {/if}
                            </div>
                        </div>                        

                        <div class="absolute top-1/2 -translate-y-1/2 {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center gap-1 px-1.5 animate-fadeIn">
                            {#if !message.message.startsWith('[IMAGE]')}
                            <button on:click={() => handleReply(message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-reply-fill text-sm"></i>
                            </button>
                            {/if}
                            <button on:click={() => copyMessage(message.message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-file-copy-fill text-sm"></i>
                            </button>
                            <button bind:this={emojiButtonRef} on:click={(e) => toggleEmojiPicker(message.id, e)} class="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-emotion-line text-sm"></i>
                            </button>
                            <button on:click={() => toggleBookmark(message)} class="p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-bookmark-{bookmarks.some(b => b.messageId === message.id) ? 'fill text-cYellow' : 'line'} text-sm"></i>
                            </button>
                        </div>

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

        {#if showBookmarkPanel}
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" transition:fade={{ duration: 200 }}>
            <div class="fixed right-0 top-0 bottom-0 w-80 bg-cWhiteGray border-l border-white/10 shadow-xl z-50" transition:slide={{ duration: 300, axis: 'x', easing: quintOut }}>
                <div class="p-4 border-b border-white/10 bg-[#2C2C2C]/30 backdrop-blur-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 bg-cYellow/10 rounded-lg flex items-center justify-center">
                            <i class="ri-bookmark-fill text-cYellow text-xl"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold">Bookmarks</h3>
                            <p class="text-sm text-white/50">{bookmarks.length} saved {bookmarks.length === 1 ? 'message' : 'messages'}</p>
                        </div>
                        <button on:click={() => showBookmarkPanel = false} class="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all duration-300">
                            <i class="ri-close-line text-xl"></i>
                        </button>
                    </div>
                    <p class="text-xs text-white/20 mt-5">
                        <span class="text-white/50">
                            Remember that only you see your bookmarks.
                        </span>
                    </p>
                </div>

                <div class="p-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
                    {#if bookmarks.length === 0}
                    <div class="flex flex-col items-center justify-center py-12 text-white/30">
                        <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <i class="ri-bookmark-line text-3xl"></i>
                        </div>
                        <p class="text-sm font-medium">No bookmarks yet</p>
                        <p class="text-xs text-white/20 mt-1">Save messages to find them easily later</p>
                    </div>
                    {:else}
                    {#each bookmarks.sort((a, b) => b.timestamp - a.timestamp) as bookmark}
                    <div class="bg-[#2C2C2C] rounded-lg p-3 group hover:bg-[#363636] transition-colors duration-200">
                        <div class="flex items-start justify-between gap-2 mb-1">
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 bg-cYellow rounded-lg flex items-center justify-center text-black text-xs font-bold">
                                    {bookmark.userId.slice(0, 2).toUpperCase()}
                                </div>
                                <span class="text-sm font-medium text-white/90">{bookmark.userId}</span>
                            </div>
                        </div>
                        {#if bookmark.message.startsWith('[IMAGE]')}
                        <div class="relative pl-8">
                            <img 
                                src={decodeBase64Image(bookmark.message.slice(7))} 
                                alt="Bookmarked image" 
                                class="max-w-full w-[150px] rounded-lg object-contain"
                                on:error={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div class="hidden items-center justify-center gap-2 text-red-500 p-4 bg-red-500/10 rounded-lg w-[150px]">
                                <i class="ri-image-line text-xl"></i>
                                <span class="text-xs">Image unavailable</span>
                            </div>
                        </div>
                        {:else}
                        <p class="text-sm text-white/70 mb-2 break-words pl-8">{bookmark.message}</p>
                        {/if}
                        <button 
                            on:click={() => {
                                scrollToMessage(bookmark.messageId);
                                showBookmarkPanel = false;
                            }}
                            class="text-xs text-cYellow hover:text-cYellow/80 transition-all duration-300 flex items-center gap-1.5 ml-8"
                        >
                            <i class="ri-arrow-right-line"></i>
                            Go to message
                        </button>
                    </div>
                    {/each}
                    {/if}
                </div>
            </div>
        </div>
        {/if}

        <div class="bg-cWhiteGray border-t border-white/10 fixed bottom-0 left-0 right-0 sm:relative z-10">
            <div class="px-4 sm:px-6 py-2.5 sm:py-4">
                {#if replyingTo}
                <div class="bg-[#2C2C2C]/90 rounded-lg p-3 mb-3 flex items-center justify-between border-l-2 border-l-cYellow border border-white/5">
                    <div class="text-sm text-white/50 truncate flex items-center gap-2">
                        <i class="ri-reply-fill text-cYellow text-lg"></i>
                        <div>
                            <span class="text-cYellow font-medium">Replying to message</span>
                            <p class="truncate">{replyingTo.message}</p>
                        </div>
                    </div>
                    <button on:click={cancelReply} class="p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
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
                                    <input type="text" bind:value={emojiSearchQuery} placeholder="Search emojis..." class="w-full pl-9 pr-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20 placeholder-white/30" />
                                    <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30"></i>
                                </div>
                            </div>

                            <div class="overflow-hidden rounded-lg">
                                {#if !emojiSearchQuery}
                                    <div class="flex gap-1 mb-2 pb-2 overflow-x-auto custom-scrollbar border-b border-white/10">
                                        {#each Object.entries({
                                            'Smileys & Emotion': 'ri-emotion-happy-line',
                                            'People & Body': 'ri-user-smile-line',
                                            'Animals & Nature': 'ri-plant-line',
                                            'Food & Drink': 'ri-cup-line',
                                            'Activities': 'ri-basketball-line',
                                            'Travel & Places': 'ri-map-pin-line',
                                            'Objects': 'ri-lightbulb-line',
                                            'Symbols': 'ri-heart-3-line'
                                        }) as [category, icon]}
                                        <button class="px-3 py-2.5 text-xs whitespace-nowrap rounded-lg transition-all duration-300 flex items-center gap-2 {selectedCategory === category ? 'bg-cYellow text-black font-medium shadow-lg' : 'text-white/70 hover:bg-white/10'}" on:click={() => selectedCategory = category}>
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
                                                'Smileys & Emotion': ['ri-emotion-happy-line', emojiCategories['Smileys & Emotion']],
                                                'People & Body': ['ri-user-smile-line', emojiCategories['People & Body']],
                                                'Animals & Nature': ['ri-plant-line', emojiCategories['Animals & Nature']],
                                                'Food & Drink': ['ri-cup-line', emojiCategories['Food & Drink']],
                                                'Activities': ['ri-basketball-line', emojiCategories['Activities']],
                                                'Travel & Places': ['ri-map-pin-line', emojiCategories['Travel & Places']],
                                                'Objects': ['ri-lightbulb-line', emojiCategories['Objects']],
                                                'Symbols': ['ri-heart-3-line', emojiCategories['Symbols']]
                                            }) as [category, [icon, categoryEmojis]]}
                                                <div class="mb-4 last:mb-0">
                                                    <div class="flex items-center gap-2 mb-2">
                                                        <div class="text-xs font-medium text-white/70 flex items-center gap-1.5">
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
                                        <div class="text-center py-8 text-white/50">
                                            <i class="ri-emotion-sad-line text-3xl mb-2 block"></i>
                                            <p class="text-sm">No emojis found</p>
                                        </div>
                                        {/if}
                                    </div>
                                {/if}
                            </div>

                            <div class="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
                                <span>Click emoji to insert</span>
                                {#if selectedCategory}
                                <span>{emojiCategories[selectedCategory].length} emojis</span>
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
                                        <div class="w-full bg-black/20 rounded-lg-full h-2 overflow-hidden">
                                            <div class="h-full bg-cYellow transition-all duration-300 rounded-lg-full" style="width: {imageUploadProgress}%"></div>
                                        </div>
                                        <div class="text-sm font-medium text-white/90 min-w-[40px]">{Math.round(imageUploadProgress)}%</div>
                                    </div>
                                    <p class="text-white/70 text-sm text-center">Uploading your image...</p>
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
                            placeholder="Type a message..." 
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
                            class="w-full h-12 bg-[#2C2C2C]/90 border border-white/10 rounded-lg px-4 py-2.5 focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white/30 transition-all duration-300 text-white text-sm resize-none overflow-hidden"
                            rows="1"
                            style="min-height: 48px; max-height: 120px;"
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
{/if}