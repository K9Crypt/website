<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { createRoom } from '$lib/room';
    import { onMount } from 'svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import { checkLink } from '$lib/check';
    import { blockedNames } from '$lib/config/blockedNames';

    let selectedType: "public" | "private" = 'public';
    let showPassword = false;
    let status: boolean | null = null;
    let userId = '';
    let roomId = '';
    let roomPassword = '';
    let isLoading = false;
    let error = '';
    let isRoomCreated = false;
    let isValidating = false;
    let roomName = '';
    const restrictedUsernames = [...blockedNames.blockedNames, ...blockedNames.religiousTerms].map(name => 
        name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    onMount(async () => {
        try {
            isValidating = true;
            userId = (localStorage.getItem('userId') || '').trim();
            status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
        } catch (err) {
            status = false;
            toast.error('Failed to initialize. Please try again.', {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        } finally {
            isValidating = false;
        }
    });

    function selectRoomType(type: "public" | "private") {
        selectedType = type;
        showPassword = type === 'private';
        if (type === 'public') {
            roomPassword = '';
            error = '';
        }
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Room ID copied to clipboard.', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err) {
            toast.error('Failed to copy room ID. Please try again.', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        }
    }

    async function routeSupport() {
        await goto("/contact");
    }

    function validateInputs(): boolean {
        userId = userId.trim();
        roomPassword = roomPassword.trim();
        roomName = roomName.trim();
        
        const normalizedUserId = userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (!userId) {
            error = 'Please enter a username';
            return false;
        }

        if (userId.length < 3) {
            error = 'Username must be at least 3 characters long';
            return false;
        }

        if (restrictedUsernames.includes(normalizedUserId)) {
            error = 'This username is restricted. Please choose another one.';
            return false;
        }

        if (!roomName) {
            error = 'Please enter a room name';
            return false;
        }

        if (roomName.length < 3 || roomName.length > 50) {
            error = 'Room name must be between 3 and 50 characters';
            return false;
        }

        if (selectedType === 'private') {
            if (!roomPassword) {
                error = 'Please enter a room password';
                return false;
            }
            if (roomPassword.length < 6) {
                error = 'Room password must be at least 6 characters long';
                return false;
            }
        }

        return true;
    }

    async function handleCreateRoom() {
        if (isLoading) return;
        
        error = '';
        
        if (!validateInputs()) {
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        isLoading = true;

        try {
            roomId = await createRoom(userId, selectedType, roomPassword, roomName);
            
            localStorage.setItem('userId', userId);
            localStorage.setItem(`hasJoinedRoom_${roomId}`, 'true');
            
            isRoomCreated = true;
            error = '';
            
            toast.success('Room created successfully!', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } catch (err: any) {
            error = err.message;
            toast.error(error, { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
        } finally {
            isLoading = false;
        }
    }

    async function handleJoinRoom() {
        await goto(`/join/room`);
    }
</script>

<Toaster />
<Navbar />
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
<section class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3">Create a Room</h2>
            <p class="text-white/50 text-sm">Set up a secure chat room and start conversations with others.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium">Username</label>
                <div class="relative">
                    <i class="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={userId} placeholder="Enter username" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium">Room Name</label>
                <div class="relative">
                    <i class="ri-chat-3-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={roomName} placeholder="Enter room name" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                    <button class="px-4 py-2.5 rounded-lg border {selectedType === 'public' ? 'bg-cYellow/10 border-cYellow text-cYellow' : 'border-white/5 text-white/50'} font-medium transition-all duration-300" on:click={() => selectRoomType('public')}>
                        <i class="ri-global-fill mr-2"></i>
                        Public
                    </button>
                    <button class="px-4 py-2.5 rounded-lg border {selectedType === 'private' ? 'bg-cYellow/10 border-cYellow text-cYellow' : 'border-white/5 text-white/50'} font-medium" on:click={() => selectRoomType('private')}>
                        <i class="ri-lock-fill mr-2"></i>
                        Private
                    </button>
                </div>
            </div>

            {#if showPassword}
            <div class="space-y-2">
                <label class="block text-sm font-medium">Room Password</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password (min. 6 characters)" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"/>
                </div>
                <p class="text-xs text-white/50">Password must be at least 6 characters long.</p>
            </div>
            {/if}

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <div class="flex justify-center">
                <button class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" on:click={handleCreateRoom} disabled={isLoading || !userId || !roomName || restrictedUsernames.includes(userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) || (selectedType === 'private' && (!roomPassword  || roomPassword.length < 6))}>{isLoading ? 'Creating...' : 'Create Room'}</button>
            </div>
        </div>

        {#if isRoomCreated}
        <div class="mt-6 bg-cWhiteGray rounded-lg border border-white/5 p-4">
            <h3 class="text-lg font-semibold">Room ID:</h3>
            <div class="flex items-center justify-between mb-4">
                <p class="text-white text-sm">{roomId}</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-4">
                <button class="w-full bg-cYellow text-black py-2.5 px-4 rounded-lg font-medium" on:click={copyToClipboard}>Copy</button>
                <button class="w-full bg-cYellow/10 border border-cYellow text-cYellow py-2.5 px-4 rounded-lg font-medium" on:click={handleJoinRoom}>Join Room</button>
            </div>
        </div>
        {/if}
    </div>
</section>
{/if}

<Footer />