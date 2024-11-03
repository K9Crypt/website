<script lang="ts">
    import { page } from '$app/stores';
    import { leaveRoom, joinRoom, checkRoom } from '$lib/room';
    import { sendMessage, getMessages } from '$lib/message';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { checkLink } from '$lib/check';

    let userId: string = '';
    let message: string = '';
    let isLoading = false;
    let status: boolean | null = null;;
    let error = '';
    let isPageLoading = true;
    let messages: any[] = [];
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

    let isSendButtonDisabled = false;
    let isLeaveButtonDisabled = false;

    $: roomId = $page.params.id;
    $: isSendButtonDisabled = isLoading || !message.trim();
    $: isLeaveButtonDisabled = isLoading;

    async function copyRoomId() {
        await navigator.clipboard.writeText(roomId);
        toast.success('Room ID copied to clipboard', { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
    }

    async function copyMessage(msg: string) {
        await navigator.clipboard.writeText(msg);
        toast.success('Message copied to clipboard', { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
    }

    async function loadRoomData() {
        try {
            const newMessages = await getMessages(roomId);
            if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
                messages = newMessages.map((msg, index) => ({ ...msg, id: `msg-${index}` }));
            }
        } catch {
            error = 'Failed to load room data';
            toast.error(error);
        }
    }

    function startPolling() {
        pollingInterval = setInterval(loadRoomData, 5000);
    }

    function handleReply(msg: { message: string }) {
        replyingTo = msg;
        message = '';
        setTimeout(() => document.getElementById('message-input')?.focus(), 0);
    }

    function cancelReply() {
        replyingTo = null;
    }

    onMount(async () => {
        userId = localStorage.getItem('userId') || '';
        hasJoinedRoom = localStorage.getItem('hasJoinedRoom') === 'true';
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);

        if (!userId) {
            error = `Please enter a User ID.`;
            toast.error(error);
            isPageLoading = false;
            return;
        }

        try {
            const roomDetails = await checkRoom(roomId);
            roomType = roomDetails.type;
            roomUsers = roomDetails.users;

            if (roomType === 'private' && !hasJoinedRoom) {
                isPasswordRequired = true;
                isPageLoading = false;
                return;
            }

            hasJoinedRoom = true;
            localStorage.setItem('hasJoinedRoom', 'true');

            await loadRoomData();
            startPolling();
        } catch {
            error = 'Failed to load room data';
            toast.error(error);
        } finally {
            isPageLoading = false;
        }
    });

    onDestroy(() => {
        if (pollingInterval) clearInterval(pollingInterval);
    });

    async function routeSupport() {
        await goto('/support');
    }

    async function handleSendMessage() {
        if (isSendButtonDisabled) return;
        isLoading = true;
        try {
            const fullMessage = replyingTo
                ? `Replying to "${replyingTo.message}": \n\n${message}`
                : message;
            await sendMessage(roomId, userId, fullMessage);
            message = '';
            replyingTo = null;
            await loadRoomData();
        } catch {
            error = 'Failed to send message';
            toast.error(error);
        } finally {
            isLoading = false;
        }
    }

    async function handleLeaveRoom() {
        if (isLeaveButtonDisabled) return;
        isLoading = true;
        try {
            await leaveRoom(roomId, userId);
            sendMessage(roomId, "System", `${userId} has left the room.`);
            toast.success('Left the room successfully', { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
            localStorage.removeItem('hasJoinedRoom');
            goto('/start');
        } catch {
            error = 'Failed to leave room';
            toast.error(error);
        } finally {
            isLoading = false;
        }
    }

    async function handlePasswordSubmit() {
        isLoading = true;
        try {
            await joinRoom(roomId, userId, roomPassword);
            toast.success('Joined the room', { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
            isPasswordRequired = false;
            hasJoinedRoom = true;
            localStorage.setItem('hasJoinedRoom', 'true');
            roomPassword = '';
            await loadRoomData();
            startPolling();
        } catch {
            error = 'Invalid password';
            toast.error(error);
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
                user.toLowerCase().startsWith(searchTerm) && user.toLowerCase() !== 'system'
            );
            showUserDropdown = filteredUsers.length > 0;
        } else {
            showUserDropdown = false;
            filteredUsers = [];
        }
    }

    function selectUser(user: string) {
        const words = message.split(/\s/);
        words[words.length - 1] = `@${user} `;
        message = words.join(' ');
        showUserDropdown = false;
        setTimeout(() => {
            const input = document.getElementById('message-input') as HTMLTextAreaElement;
            input?.focus();
            input?.setSelectionRange(input.value.length, input.value.length);
        }, 0);
    }

    function handleKeyDown(event: KeyboardEvent) {
        if (showUserDropdown) {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                userDropdownIndex = (userDropdownIndex + 1) % filteredUsers.length;
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                userDropdownIndex = (userDropdownIndex - 1 + filteredUsers.length) % filteredUsers.length;
            } else if (event.key === 'Enter' && userDropdownIndex !== -1) {
                event.preventDefault();
                selectUser(filteredUsers[userDropdownIndex]);
            } else if (event.key === 'Escape') {
                event.preventDefault();
                showUserDropdown = false;
            } else if (event.key === 'Tab' && filteredUsers.length > 0) {
                event.preventDefault();
                selectUser(filteredUsers[userDropdownIndex === -1 ? 0 : userDropdownIndex]);
            }
        }
    }
</script>

<Toaster />
{#if status === false && status !== null}
<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 sm:px-6">
    <div class="max-w-2xl mx-auto mb-12">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-sm sm:text-base mb-6 sm:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded p-4 sm:p-6 mb-6 sm:mb-8">
            <div class="flex justify-center mb-4">
                <i class="ri-error-warning-line text-red-500 text-3xl sm:text-4xl"></i>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-sm sm:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="flex items-center justify-center bg-red-500 py-2 px-6 sm:px-10 rounded font-medium text-sm sm:text-base" on:click={() => window.location.reload()}>Try Again</button>
            <button class="flex items-center justify-center bg-red-500/10 border-2 border-red-500 text-red-500 py-2 px-6 sm:px-10 rounded font-medium text-sm sm:text-base" on:click={routeSupport}>Support</button>
        </div>
    </div>
</div>
{:else}
{#if isPageLoading}
<div class="fixed inset-0 flex items-center justify-center">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-5xl">
        <div class="bg-cWhiteGray border border-white/5 rounded h-[calc(100vh-200px)] flex flex-col">
            <div class="p-4 border-b border-white/5 flex items-center justify-between animate-pulse">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-[#2C2C2C] rounded-full"></div>
                    <div>
                        <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                        <div class="h-3 bg-[#2C2C2C] rounded w-16"></div>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-[#2C2C2C] rounded"></div>
                    <div class="w-24 h-8 bg-[#2C2C2C] rounded"></div>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                {#each Array(5) as _, i}
                <div class="flex flex-col {i % 2 === 0 ? 'items-end' : 'items-start'}">
                    <div class="animate-pulse">
                        <div class="relative {i % 2 === 0 ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]'} rounded p-3 max-w-md">
                            {#if i % 2 !== 0}
                            <div class="h-4 bg-[#2C2C2C] rounded w-24 mb-2"></div>
                            {/if}
                            <div class="space-y-2">
                                <div class="h-3 bg-[#2C2C2C] rounded w-full"></div>
                                <div class="h-3 bg-[#2C2C2C] rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/each}
            </div>

            <div class="p-4 border-t border-white/5 animate-pulse">
                <div class="flex items-center gap-2">
                    <div class="flex-1 h-10 bg-[#2C2C2C] rounded"></div>
                    <div class="w-10 h-10 bg-[#2C2C2C] rounded"></div>
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

            <button on:click={handlePasswordSubmit} disabled={isLoading || !roomPassword} class="w-full bg-cYellow text-black py-2 rounded font-medium hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{isLoading ? 'Joining...' : 'Join Room'}</button>
        </div>
    </div>
</div>
{:else}
<div class="fixed inset-0 flex items-center justify-center">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-5xl">
        <div class="bg-cWhiteGray border border-white/5 rounded h-[calc(100vh-200px)] flex flex-col">
            <div class="p-4 border-b border-white/5 flex items-center justify-between flex-wrap gap-2">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-cYellow rounded-full flex items-center justify-center text-black font-bold">
                        {userId?.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 class="font-semibold">Room ID: {roomId}</h3>
                        <span class="text-white/50 text-sm">{roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room</span>
                    </div>
                </div>
                
                <div class="flex items-center gap-3">
                    <button on:click={copyRoomId} class="py-2"><i class="ri-file-copy-fill text-white/50"></i></button>
                    <button on:click={handleLeaveRoom} disabled={isLeaveButtonDisabled} class="bg-red-500/10 text-red-500 px-4 py-2 rounded">Leave Room</button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-4">
                {#each messages as message (message.id)}
                <div class="flex flex-col {message.userId === userId ? 'items-end' : 'items-start'} group">
                    {#if message.replyTo}
                        <div class="bg-[#2C2C2C] rounded p-2 mb-2 max-w-full sm:max-w-md text-sm text-white/50">
                            <div class="font-semibold text-cYellow">{message.replyTo.sender}</div>
                            <div>{message.replyTo.content}</div>
                        </div>
                    {/if}

                    <div class="relative {message.userId === userId ? 'bg-cYellow text-black' : 'bg-[#2C2C2C] text-white'} rounded p-3 max-w-full sm:max-w-md">
                        <div class="absolute top-0 {message.userId === userId ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} hidden group-hover:flex items-center gap-2 px-3">
                            <button on:click={() => handleReply(message)} class="text-white/50 hover:text-white transition-all duration-300">
                                <i class="ri-reply-fill"></i>
                             </button>
                             <button on:click={() => copyMessage(message.message)} class="text-white/50 hover:text-white transition-all duration-300">
                                <i class="ri-file-copy-fill"></i>
                            </button>
                        </div>

                        <div class="flex flex-col gap-1">
                            {#if message.userId !== userId}
                            <span class="text-sm text-white/50">
                                {#if message.userId === 'System'}
                                <i class="ri-shield-star-fill"></i>
                                {/if}
                                {message.userId}
                            </span>
                            {/if}
                            <p>{message.message}</p>
                        </div>
                    </div>
                </div>
                {/each}
            </div>

            <div class="p-4 border-t border-white/5">
                {#if replyingTo}
                <div class="bg-[#2C2C2C] rounded p-2 mb-2 flex items-center justify-between">
                    <div class="text-sm text-white/50 truncate">
                        <span class="text-cYellow">Replying to message</span>
                        <p class="truncate">{replyingTo.message}</p>
                    </div>
                    <button on:click={cancelReply} class="text-white/50">
                        <i class="ri-close-fill"></i>
                    </button>
                </div>
                {/if}

                <div class="flex flex-col sm:flex-row gap-2">
                    <input type="text" id="message-input" bind:value={message} placeholder="Type a message..." on:input={handleInput} on:keydown={handleKeyDown} class="flex-1 bg-[#2C2C2C] border border-white/5 rounded px-3 py-2 sm:px-4 sm:py-2 focus:outline-none focus:border-cYellow placeholder-white/30" />
                    <button on:click={handleSendMessage} disabled={isSendButtonDisabled} class="bg-cYellow text-black px-3 py-1.5 rounded font-medium hover:bg-opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[40px] sm:min-h-[unset]">
                        <i class="ri-send-plane-2-fill text-lg sm:text-xl"></i>
                    </button>
                </div>

                {#if showUserDropdown && filteredUsers.length > 0}
                <div class="flex flex-col bg-[#2C2C2C] border border-white/5 rounded overflow-hidden mt-4">
                    {#each filteredUsers as user, index}
                    <button class="w-full px-4 py-2 text-left hover:bg-[#2C2C2C] {index === userDropdownIndex ? 'bg-[#2C2C2C]' : ''}" on:click={() => selectUser(user)}>{user}</button>
                    {/each}
                </div>
                {/if}
            </div>
        </div>
    </div>
</div>
{/if}
{/if}
{/if}