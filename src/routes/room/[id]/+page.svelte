<script lang="ts">
    import { page } from '$app/stores';
    import { leaveRoom, joinRoom, checkRoom, checkPassword } from '$lib/room';
    import { sendMessage, getMessages } from '$lib/message';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { checkLink } from '$lib/check';

    let userId: string = '';
    let message: string = '';
    let isLoading = false;
    let status: boolean | null = null;
    let error = '';
    let isPageLoading = true;
    let messages: Array<{ id: string; userId: string; message: string; replyTo?: { sender: string; content: string } }> = [];
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

    $: roomId = $page.params.id;
    $: isSendButtonDisabled = isLoading || !message.trim();

    async function copyRoomId() {
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
    async function loadRoomData() {
        try {
            clearTimeout(loadTimeout);
            loadTimeout = setTimeout(async () => {
                const newMessages = await getMessages(roomId);
                if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                    messages = newMessages.map((msg, index) => ({ 
                        ...msg, 
                        id: `msg-${index}-${Date.now()}` 
                    }));
                }
            }, 300);
        } catch (err) {
            error = 'Failed to load room data';
            toast.error(error, { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        }
    }

    function startPolling() {
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

    onMount(async () => {
        try {
            userId = localStorage.getItem('userId') || '';
            hasJoinedRoom = localStorage.getItem('hasJoinedRoom') === 'true';
            status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);

            if (!userId) {
                error = 'Please enter a User ID.';
                toast.error(error, {
                    duration: 3000,
                    position: 'top-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                await goto('/start');
                return;
            }

            const roomDetails = await checkRoom(roomId);
            roomType = roomDetails.type;
            roomUsers = roomDetails.users || [];

            if (roomType === 'private' && !hasJoinedRoom) {
                isPasswordRequired = true;
                isPageLoading = false;
                return;
            }

            hasJoinedRoom = true;
            localStorage.setItem('hasJoinedRoom', 'true');
            await loadRoomData();
            startPolling();
        } catch (err) {
            error = 'Failed to initialize room';
            toast.error(error);
            await goto('/start');
        } finally {
            isPageLoading = false;
        }
    });

    onDestroy(() => {
        stopPolling();
        clearTimeout(loadTimeout);
    });

    async function handleSendMessage() {
        if (isSendButtonDisabled) return;
        
        isLoading = true;
        try {
            const fullMessage = replyingTo
                ? `Replying to "${replyingTo.message}": \n\n${message.trim()}`
                : message.trim();
                
            await sendMessage(roomId, userId, fullMessage);
            message = '';
            replyingTo = null;
            await loadRoomData();
        } catch (err) {
            error = 'Failed to send message';
            toast.error(error, { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } finally {
            isLoading = false;
            focusMessageInput();
        }
    }

    async function handleLeaveRoom() {
        if (isLoading) return;
        
        isLoading = true;
        try {
            await leaveRoom(roomId, userId);
            localStorage.removeItem('hasJoinedRoom');
            toast.success('Left the room successfully', { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            await goto('/start');
        } catch (err) {
            error = 'Failed to leave room';
            toast.error(error, { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            isLoading = false;
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
            localStorage.setItem('hasJoinedRoom', 'true');
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
            <div class="px-6 py-6 space-y-6">
                {#each Array(5) as _, i}
                <div class="flex flex-col {i % 2 === 0 ? 'items-end' : 'items-start'}">
                    <div class="animate-pulse w-full sm:w-auto">
                        {#if i % 3 === 0}
                        <div class="bg-[#2C2C2C]/80 rounded p-3 mb-2 max-w-[85%] border border-white/5">
                            <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                            <div class="h-3 bg-[#2C2C2C] rounded w-48"></div>
                        </div>
                        {/if}
                        
                        <div class="relative bg-[#2C2C2C]/80 rounded p-4 max-w-[85%] border border-white/5">
                            {#if i % 2 !== 0}
                            <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                            {/if}
                            <div class="space-y-2">
                                <div class="h-3 bg-[#2C2C2C] rounded w-full"></div>
                                <div class="h-3 bg-[#2C2C2C] rounded w-3/4"></div>
                                {#if i % 2 === 0}
                                <div class="h-3 bg-[#2C2C2C] rounded w-1/2"></div>
                                {/if}
                            </div>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>

        <div class="bg-cWhiteGray/50 backdrop-blur-md border-t border-white/10">
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
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
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
            <div class="px-3 sm:px-6 py-3 sm:py-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div class="flex items-center gap-3 sm:gap-4">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-cYellow rounded flex items-center justify-center text-black font-bold transition-all duration-300 text-sm sm:text-base">
                            {userId?.slice(0, 2).toUpperCase()}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h3 class="font-semibold flex items-center gap-2 text-base sm:text-lg truncate">
                                <span class="truncate">Room ID: {roomId}</span>
                                <button on:click={copyRoomId} class="flex-shrink-0">
                                    <i class="ri-file-copy-fill text-white/50 hover:text-cYellow transition-all duration-300 p-2 rounded hover:bg-white/10"></i>
                                </button>
                            </h3>
                            <span class="text-white/50 text-xs sm:text-sm flex items-center gap-1">
                                <i class="ri-shield-keyhole-fill"></i>
                                {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
                            </span>
                        </div>
                    </div>
                    
                    <button on:click={handleLeaveRoom} class="bg-red-500/10 text-red-500 px-4 sm:px-6 py-2 sm:py-2.5 rounded text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center sm:justify-start gap-2 font-medium w-full sm:w-auto">
                        <i class="ri-door-open-fill"></i>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>

        <div class="flex-1 overflow-y-auto bg-[#1B1B1B]/50 pb-[120px] sm:pb-0">
            <div class="px-6 py-6 space-y-6 min-h-full">
                {#each messages as message (message.id)}
                <div class="flex flex-col {message.userId === userId ? 'items-end' : 'items-start'} group animate-fadeIn">
                    {#if message.replyTo}
                        <div class="bg-[#2C2C2C]/80 rounded p-3 mb-2 max-w-[85%] text-sm text-white/50 border-l-4 border-l-cYellow border border-white/5 ">
                            <div class="font-semibold text-cYellow flex items-center gap-2 mb-1">
                                <i class="ri-reply-fill"></i>
                                <span class="text-white/90">{message.replyTo.sender}</span>
                            </div>
                            <div class="pl-6 border-l border-white/10">{message.replyTo.content}</div>
                        </div>
                    {/if}

                    <div class="relative {message.userId === userId ? 'bg-cYellow text-black' : 'bg-[#2C2C2C]/80 text-white'} rounded p-4 max-w-[85%]  border border-white/5 transform hover:scale-[1.02] transition-all duration-300">
                        <div class="absolute top-2 {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center gap-2 px-3 animate-fadeIn">
                            <button on:click={() => handleReply(message)} class="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-300">
                                <i class="ri-reply-fill"></i>
                            </button>
                            <button on:click={() => copyMessage(message.message)} class="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-all duration-300">
                                <i class="ri-file-copy-fill"></i>
                            </button>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            {#if message.userId !== userId}
                            <span class="text-sm font-medium flex items-center gap-1 {message.userId === 'System' ? 'text-cYellow' : 'text-white/70'}">
                                {#if message.userId === 'System'}
                                <i class="ri-shield-star-fill"></i>
                                {/if}
                                {message.userId}
                            </span>
                            {/if}
                            <p class="leading-relaxed whitespace-pre-wrap break-words">
                                {@html message.message.replace(/@(\w+)/g, '<span class="font-bold underline">@$1</span>')}
                            </p>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </div>

        <div class="bg-cWhiteGray border-t border-white/10 fixed bottom-0 left-0 right-0 sm:relative z-10">
            <div class="px-4 sm:px-6 py-3 sm:py-4">
                {#if replyingTo}
                <div class="bg-[#2C2C2C]/90 rounded p-3 mb-3 flex items-center justify-between border-l-4 border-l-cYellow border border-white/5 ">
                    <div class="text-sm text-white/50 truncate flex items-center gap-2">
                        <i class="ri-reply-fill text-cYellow text-lg"></i>
                        <div>
                            <span class="text-cYellow font-medium">Replying to message</span>
                            <p class="truncate text-white/80">{replyingTo.message}</p>
                        </div>
                    </div>
                    <button on:click={cancelReply} class="p-2 hover:bg-white/10 rounded text-white/50 hover:text-white transition-all duration-300">
                        <i class="ri-close-fill"></i>
                    </button>
                </div>
                {/if}

                <div class="flex gap-3 max-w-[100vw] sm:max-w-none">
                    <div class="flex-1 relative">
                        <input type="text" 
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
                            class="w-full bg-[#2C2C2C]/90 border border-white/10 rounded px-6 py-3.5 focus:outline-none focus:border-cYellow focus:ring-2 focus:ring-cYellow/20 placeholder-white/30 transition-all duration-300 text-white" />
                        
                        {#if showUserDropdown && filteredUsers.length > 0}
                        <div class="absolute bottom-full left-0 w-full bg-[#2C2C2C]/90 border border-white/10 rounded overflow-hidden mb-2 -xl animate-fadeIn">
                            {#each filteredUsers as user, index}
                            <button class="w-full px-4 py-2.5 text-left hover:bg-white/10 transition-all duration-300
                                {index === userDropdownIndex ? 'bg-white/10 text-cYellow' : 'text-white'} flex items-center gap-2" 
                                on:click={() => selectUser(user)}>
                                <i class="ri-at-fill"></i>
                                {user}
                            </button>
                            {/each}
                        </div>
                        {/if}
                    </div>
                    
                    <button on:click={handleSendMessage} disabled={isSendButtonDisabled} class="bg-cYellow text-black px-6 rounded font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transform">
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