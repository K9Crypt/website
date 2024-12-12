<script lang="ts">
    import { page } from '$app/stores';
    import { leaveRoom, joinRoom, checkRoom, checkPassword } from '$lib/room';
    import { sendMessage, getMessages, markMessageAsRead, reactToMessage } from '$lib/message';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { emojis } from '$lib/emojis';
    import { fade, scale } from 'svelte/transition';
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
    let selectedCategory = '';
    let messagesContainer: HTMLDivElement;
    let shouldAutoScroll = true;
    let showCopyPopup = false;

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
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err) {
            toast.error('Failed to copy room ID', { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
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
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err) {
            toast.error('Failed to copy message', { 
                duration: 3000, 
                position: 'top-right', 
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
            const newMessages = await getMessages(roomId);
            if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                messages = newMessages.map(msg => {
                    const existingMessage = messages.find(m => m.id === msg.id);
                    let readBy = msg.readBy || [];
                    
                    if (!readBy.includes(userId) && msg.userId !== userId) {
                        markMessageAsRead(roomId, userId, msg.id).catch(err => {
                            console.error('Error marking message as read:', err);
                        });
                        readBy.push(userId);
                    }
                    
                    return { 
                        ...msg, 
                        id: msg.id || existingMessage?.id || `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        readBy: readBy,
                        reactions: msg.reactions || existingMessage?.reactions || {}
                    };
                });
            }
        } catch (err) {
            error = 'Failed to load room data';
            toast.error(error, { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
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
                position: 'top-right',
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
        replyingTo = msg;
        message = '';
        focusMessageInput();
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
                    position: 'top-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                goto('/join/room');
                return;
            }

            if (!userId) {
                toast.error('Please enter a username.', {
                    duration: 3000,
                    position: 'top-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                goto('/join/room');
                return;
            }

            const roomDetails = await checkRoom(roomId);
            roomType = roomDetails.type;
            roomUsers = roomDetails.users || [];

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

    async function handleSendMessage() {
        if (isSendButtonDisabled) return;
        
        isLoading = true;
        const fullMessage = replyingTo
            ? `Replying to "${replyingTo.message}": \n\n${message.trim()}`
            : message.trim();

        await sendMessage(roomId, userId, fullMessage);
        
        message = '';
        replyingTo = null;
        
        await loadRoomData();
        isLoading = false;
    }

    async function handleLeaveRoom() {
        try {
            const roomId = $page.params.id;
            localStorage.removeItem(`hasJoinedRoom_${roomId}`);
            await leaveRoom(roomId, userId);
            toast.success('Left the room successfully!', {
                duration: 3000,
                position: 'top-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            goto('/join/room');
        } catch (err) {
            console.error('Error leaving room:', err);
            toast.error('Failed to leave room. Please try again.', {
                duration: 3000,
                position: 'top-right',
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
                    position: 'top-right', 
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
                position: 'top-right', 
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
                position: 'top-right', 
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
        window.open('https://github.com/k9crypt/website', '_blank');
    }
</script>

<Toaster />

{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2 px-4 sm:px-6 md:px-10 rounded font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>Try Again</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2 px-4 sm:px-6 md:px-10 rounded font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>Support</button>
        </div>
    </div>
</div>
{:else}
{#if isPageLoading}
<div class="fixed inset-0">
    <div class="h-screen flex flex-col">
        <div class="bg-cWhiteGray/50 backdrop-blur-md border-b border-white/10">
            <div class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-[#2C2C2C] rounded animate-pulse"></div>
                        <div class="min-w-0 flex-1">
                            <div class="h-5 sm:h-6 bg-[#2C2C2C] rounded w-32 sm:w-48 mb-2 animate-pulse"></div>
                            <div class="h-4 bg-[#2C2C2C] rounded w-24 sm:w-32 animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div class="w-full sm:w-auto h-10 bg-[#2C2C2C] rounded animate-pulse"></div>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50">
            <div class="px-6 py-6 space-y-6 min-h-full">
                {#each Array(5) as _, i}
                <div class="flex flex-col {i % 2 === 0 ? 'items-end' : 'items-start'} animate-fadeIn">
                    {#if i % 3 === 0}
                    <div class="bg-[#2C2C2C]/80 rounded p-3 mb-2 max-w-[85%] text-sm text-white/50 border-l-2 border-l-cYellow border border-white/5 relative">
                        <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                        <div class="h-3 bg-[#2C2C2C] rounded w-48"></div>
                    </div>
                    {/if}
                    
                    <div class="{i % 2 === 0 ? 'bg-cYellow/20 text-white rounded-l-lg rounded-tr-lg' : 'bg-[#2C2C2C] text-white rounded-r-lg rounded-tl-lg'} p-4 max-w-[350px] w-fit border border-white/5 relative">
                        {#if i % 2 !== 0}
                        <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                        {/if}
                        <div class="flex flex-col gap-2">
                            {#if i % 2 !== 0}
                            <div class="h-3 bg-[#2C2C2C] rounded w-24 opacity-50"></div>
                            {/if}
                            <div class="h-3 bg-[#2C2C2C] rounded w-full"></div>
                            <div class="h-3 bg-[#2C2C2C] rounded w-3/4"></div>
                            {#if i % 2 === 0}
                            <div class="h-3 bg-[#2C2C2C] rounded w-1/2"></div>
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
                    <div class="flex-1 h-[52px] bg-[#2C2C2C] rounded animate-pulse"></div>
                    <div class="w-[52px] h-[52px] bg-[#2C2C2C] rounded animate-pulse"></div>
                </div>
            </div>
        </div>
    </div>
</div>
{:else}
{#if isPasswordRequired}
<div class="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
    <div class="bg-cWhiteGray border border-white/5 rounded p-6 w-full max-w-md">
        <h3 class="text-xl font-bold mb-4">Enter Room Password</h3>
        <p class="text-white/50 text-sm mb-6">This is a private room. Please enter the password to join.</p>
        
        <div class="space-y-4">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Password</label>
                <div class="relative">
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white/30 transition-all duration-300 text-white" />
                </div>
                {#if error}
                <p class="text-xs text-red-500">{error}</p>
                {/if}
            </div>

            <button on:click={handlePasswordSubmit} disabled={isLoading || !roomPassword} class="w-full bg-cYellow text-black py-2 rounded font-medium hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Joining...' : 'Join Room'}</button>
        </div>
    </div>
</div>
{:else}
<div class="fixed inset-0">
    <div class="h-screen flex flex-col">
        <div class="bg-cWhiteGray border-b border-white/10">
            <div class="px-4 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-11 sm:h-11 bg-cYellow rounded flex items-center justify-center text-black font-bold transition-all duration-300 text-sm sm:text-base">
                            {userId?.slice(0, 2).toUpperCase()}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="font-semibold flex items-center gap-2 text-base sm:text-lg truncate">
                                <span class="truncate">Room ID: {roomId}</span>
                                <button on:click={toggleCopyPopup} class="flex-shrink-0 hover:scale-105 active:scale-95">
                                    <i class="ri-file-copy-fill text-white/50 hover:text-cYellow transition-all duration-300 p-1.5 rounded hover:bg-white/10"></i>
                                </button>
                            </h3>
                            <span class="text-white/50 text-xs sm:text-sm flex items-center gap-1.5">
                                <i class="ri-shield-keyhole-fill"></i>
                                {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
                            </span>
                        </div>
                    </div>
                    
                    <button on:click={handleLeaveRoom} class="bg-red-500/10 text-red-500 px-4 sm:px-5 py-2 rounded text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start gap-2 w-full sm:w-auto hover:bg-red-500/20 active:scale-95 transition-all duration-300">
                        <i class="ri-door-open-fill"></i>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>

        {#if showCopyPopup}
        <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50" transition:fade={{ duration: 200 }}>
            <div class="bg-cWhiteGray p-6 rounded-lg max-w-md w-full mx-4" transition:scale={{ duration: 300, easing: quintOut, start: 0.95 }}>
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-semibold text-white/90">Copy Room ID</h3>
                    <button on:click={toggleCopyPopup} class="text-white/50 hover:text-white transition-all duration-300">
                        <i class="ri-close-line text-xl"></i>
                    </button>
                </div>
                
                <div class="flex flex-col gap-4 mb-4">
                    <input type="text" value={roomId} readonly class="flex-1 px-4 py-2 bg-black/20 border border-white/5 rounded text-white" />
                    <button on:click={copyRoomIdWithPopup} class="flex items-center bg-cYellow text-black py-2 px-10 rounded font-medium justify-center w-full">Copy</button>
                </div>
                
                <p class="text-white/50 text-sm">You need to enter this Room ID in the <a href="/join/room" class="underline">join/room</a> section after providing your username.</p>
            </div>
        </div>
        {/if}

        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50 pb-[120px] sm:pb-0" bind:this={messagesContainer} on:scroll={handleScroll}>
            <div class="px-4 sm:px-6 py-6 space-y-6 min-h-full">
                {#each messages as message (message.id)}
                <div class="flex flex-col {message.userId === userId ? 'items-end' : 'items-start'} group animate-fadeIn">
                    {#if message.replyTo}
                    <div class="bg-[#2C2C2C]/80 rounded p-2 mb-2 max-w-[85%] text-sm text-white/50 border-l-2 border-l-cYellow border border-white/5 relative">
                        <div class="font-medium text-cYellow flex items-center gap-1.5 mb-1">
                            <i class="ri-reply-fill text-sm"></i>
                            <span class="text-white/90 text-sm">{message.replyTo.sender}</span>
                        </div>
                        <div class="pl-4 border-l border-white/10 text-sm opacity-75">{message.replyTo.content}</div>
                    </div>
                    {/if}

                    <div class="relative group">
                        <div class="{message.userId === userId ? 'bg-cYellow text-black rounded-l-lg rounded-tr-lg' : 'bg-[#2C2C2C] text-white rounded-r-lg rounded-tl-lg'} py-2 px-3.5 relative max-w-[350px] w-fit shadow-sm">
                            <div class="flex flex-col gap-1.5">
                                {#if message.userId !== userId}
                                <span class="text-xs font-medium flex items-center gap-1.5 {message.userId === 'System' ? 'text-cYellow' : 'opacity-75'}">
                                    {#if message.userId === 'System'}
                                    <i class="ri-shield-star-fill text-sm"></i>
                                    {/if}
                                    {message.userId}
                                </span>
                                {/if}
                                <p class="leading-relaxed whitespace-pre-wrap break-words text-sm">{@html message?.message?.replace(/@(\w+)/g, '<span class="font-bold underline">@$1</span>') || ''}</p>
                                
                                {#if message.readBy && message.readBy.length > 1}
                                <div class="text-[10px] opacity-50 flex items-center gap-0.5 mt-0.5">
                                    <i class="ri-check-double-fill"></i> 
                                    Read by {message.readBy.filter(id => id !== message.userId).length} users
                                </div>
                                {/if}
                            </div>
                        </div>

                        <div class="absolute top-1/2 -translate-y-1/2 {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center gap-1 px-1.5 animate-fadeIn">
                            <button on:click={() => handleReply(message)} class="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-reply-fill text-sm"></i>
                            </button>
                            <button on:click={() => copyMessage(message.message)} class="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-file-copy-fill text-sm"></i>
                            </button>
                            <button bind:this={emojiButtonRef} on:click={(e) => toggleEmojiPicker(message.id, e)} class="p-1.5 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                                <i class="ri-emotion-line text-sm"></i>
                            </button>
                        </div>

                        {#if showEmojiPicker && activeMessageId === message.id}
                        <div bind:this={emojiPickerRef} class="absolute {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} bg-[#2C2C2C]/95 backdrop-blur-sm rounded shadow-xl border border-white/10 p-2.5 z-50 animate-fadeIn" style="top: 0; margin-top: 8px; margin-bottom: 10px;">
                            <div class="flex gap-1">
                                {#each commonEmojis as emoji}
                                <button on:click={() => handleReaction(message.id, emoji)} class="p-2 hover:bg-white/10 rounded transition-all duration-300 hover:scale-105 active:scale-95 {message.reactions?.[emoji]?.includes(userId) ? message.userId === userId ? 'bg-cYellow text-black' : 'bg-white/10' : ''}">
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
                        <div class="flex items-center gap-1 bg-[#2C2C2C] rounded px-2 py-0.5 text-sm hover:bg-[#363636] transition-colors duration-200">
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

        <div class="bg-cWhiteGray border-t border-white/10 fixed bottom-0 left-0 right-0 sm:relative z-10">
            <div class="px-4 sm:px-6 py-3 sm:py-4">
                {#if replyingTo}
                <div class="bg-[#2C2C2C]/90 rounded p-3 mb-3 flex items-center justify-between border-l-2 border-l-cYellow border border-white/5">
                    <div class="text-sm text-white/50 truncate flex items-center gap-2">
                        <i class="ri-reply-fill text-cYellow text-lg"></i>
                        <div>
                            <span class="text-cYellow font-medium">Replying to message</span>
                            <p class="truncate text-white/80">{replyingTo.message}</p>
                        </div>
                    </div>
                    <button on:click={cancelReply} class="p-1.5 hover:bg-white/10 rounded text-white/50 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">
                        <i class="ri-close-fill text-lg"></i>
                    </button>
                </div>
                {/if}

                <div class="flex gap-2 max-w-[100vw] sm:max-w-none">
                    <div class="relative">
                        <button bind:this={inputEmojiButtonRef} on:click={() => showInputEmojiPicker = !showInputEmojiPicker} class="w-12 h-12 bg-[#2C2C2C]/90 border border-white/10 rounded focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 transition-all duration-300 text-white hover:bg-[#2C2C2C] flex items-center justify-center flex-shrink-0">
                            <i class="ri-emotion-line text-xl"></i>
                        </button>

                        {#if showInputEmojiPicker}
                        <div bind:this={inputEmojiPickerRef} class="absolute bottom-full left-0 mb-2 bg-[#2C2C2C]/95 backdrop-blur-sm rounded shadow-xl border border-white/10 p-3 z-50 animate-fadeIn w-[320px]">
                            <div class="mb-3">
                                <div class="relative">
                                    <input type="text" bind:value={emojiSearchQuery} placeholder="Search emojis..." class="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded text-sm focus:outline-none focus:border-cYellow focus:ring-1 focus:ring-cYellow/20 placeholder-white/30" />
                                    <i class="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-white/30"></i>
                                </div>
                            </div>

                            <div class="overflow-hidden rounded">
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
                                        <button class="px-3 py-2 text-xs whitespace-nowrap rounded transition-all duration-300 flex items-center gap-2 {selectedCategory === category ? 'bg-cYellow text-black font-medium shadow-lg' : 'text-white/70 hover:bg-white/10'}" on:click={() => selectedCategory = category}>
                                            <i class={icon}></i>
                                            <span class="hidden sm:inline">{category}</span>
                                        </button>
                                        {/each}
                                    </div>

                                    <div class="overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                                        {#if selectedCategory}
                                            <div class="grid grid-cols-8 gap-1.5">
                                                {#each emojiCategories[selectedCategory] as emoji}
                                                    <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
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
                                                            <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
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
                                            <button on:click={() => handleInputEmojiClick(emoji)} class="p-2 hover:bg-white/10 rounded transition-all duration-300 hover:scale-105 active:scale-95 text-lg hover:shadow-lg hover:shadow-black/5">
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

                    <div class="flex-1 relative">
                        <textarea 
                            id="message-input" 
                            bind:value={message} 
                            placeholder="Type a message..." 
                            on:input={handleInput} 
                            on:keydown={(e) => {
                                handleKeyDown(e);
                                if (e.key === 'Enter' && !e.shiftKey && !isSendButtonDisabled) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }} 
                            class="w-full h-12 bg-[#2C2C2C]/90 border border-white/10 rounded px-4 py-3 focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white/30 transition-all duration-300 text-white text-sm resize-none"
                            rows="1"
                            style="min-height: 48px; max-height: 120px;"
                        ></textarea>
                        
                        {#if showUserDropdown && filteredUsers.length > 0}
                        <div class="absolute bottom-full left-0 w-full bg-[#2C2C2C]/90 border border-white/10 rounded overflow-hidden mb-2 shadow-xl animate-fadeIn">
                            {#each filteredUsers as user, index}
                            <button class="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-all duration-300 text-sm
                                {index === userDropdownIndex ? 'bg-white/10 text-cYellow' : 'text-white'} flex items-center gap-2" 
                                on:click={() => selectUser(user)}>
                                <i class="ri-at-fill"></i>
                                {user}
                            </button>
                            {/each}
                        </div>
                        {/if}
                    </div>
                    
                    <button on:click={handleSendMessage} disabled={isSendButtonDisabled} class="w-12 h-12 bg-cYellow text-black rounded font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center hover:scale-105 active:scale-95 disabled:hover:scale-100 flex-shrink-0">
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