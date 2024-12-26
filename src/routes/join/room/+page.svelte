<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { joinRoom, checkRoom } from '$lib/room';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount } from 'svelte';
    import { checkLink } from '$lib/check';
    import { blockedNames } from '$lib/config/blockedNames';

    let userId = '';
    let status: boolean | null = null;
    let joinRoomId = '';
    let roomPassword = '';
    let isLoading = false;
    let error = '';
    let isPageLoading = true;
    let roomType: 'public' | 'private' = 'public';
    let isCheckingRoom = false;
    let roomDetails: any = null;
    const restrictedUsernames = [...blockedNames.blockedNames, ...blockedNames.religiousTerms].map(name => 
        name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    onMount(async () => {
        userId = localStorage.getItem('userId') || '';
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
        setTimeout(() => isPageLoading = false, 1500);
    });

    async function handleJoinRoom() {
        const normalizedUserId = userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (!userId?.trim()) {
            error = 'Please enter a username';
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        if (restrictedUsernames.includes(normalizedUserId)) {
            error = 'This username is restricted. Please choose another one.';
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        if (!joinRoomId?.trim()) {
            error = 'Please enter a room ID';
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        isLoading = true;
        error = '';

        try {
            roomDetails = await checkRoom(joinRoomId);
            if (!roomDetails) {
                error = 'Room not found. Please check the Room ID.';
                return;
            }

            roomType = roomDetails.type;

            if (roomDetails.users?.includes(userId)) {
                error = 'Username is already taken in this room. Please choose a different username.';
                return;
            }

            if (roomType === 'private' && !roomPassword?.trim()) {
                error = 'Please enter the room password';
                return;
            }

            await joinRoom(joinRoomId, userId, roomType === 'private' ? roomPassword : undefined);
            
            localStorage.setItem('userId', userId);
            localStorage.setItem(`hasJoinedRoom_${joinRoomId}`, 'true');
            
            toast.success('Joined the room successfully!', { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            
            goto(`/room/${joinRoomId}`);
        } catch (err: any) {
            if (err.message?.includes('already taken')) {
                error = 'Username is already taken in this room. Please choose a different username.';
            } else if (err.message?.includes('password')) {
                error = 'Invalid password. Please try again.';
            } else if (err.message?.includes('not found')) {
                error = 'Room not found. Please check the Room ID.';
            } else {
                error = err.message || 'Failed to join the room. Please try again.';
            }
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        } finally {
            isLoading = false;
        }
    }

    async function routeSupport() {
        await goto("/contact");
    }

    async function checkRoomType() {
        if (!joinRoomId?.trim()) {
            roomType = 'public';
            roomDetails = null;
            error = '';
            return;
        }

        isCheckingRoom = true;
        error = '';

        try {
            roomDetails = await checkRoom(joinRoomId);
            if (!roomDetails) {
                error = 'Room not found. Please check the Room ID.';
                toast.error(error, {
                    duration: 3000,
                    position: 'bottom-right',
                    style: 'background-color: #1B1B1B; color: #fff;'
                });
                roomType = 'public';
                return;
            }
            roomType = roomDetails.type;
            
            if (roomType === 'public') {
                roomPassword = '';
            }
        } catch (err: any) {
            if (err.message === 'Room not found') {
                error = 'Room not found. Please check the Room ID.';
            } else {
                error = 'Failed to check room type. Please try again.';
            }
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            roomType = 'public';
        } finally {
            isCheckingRoom = false;
        }
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
{#if isPageLoading}
<section class="py-8 sm:py-12 md:py-16 px-4 flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8 animate-pulse">
            <div class="h-8 bg-cWhiteGray rounded-lg w-64 mb-3"></div>
            <div class="h-4 bg-cWhiteGray rounded-lg w-96"></div>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6 animate-pulse">
            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded-lg w-24"></div>
                <div class="h-10 bg-cWhiteGray rounded-lg w-full"></div>
            </div>

            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded-lg w-24"></div>
                <div class="h-10 bg-cWhiteGray rounded-lg w-full"></div>
            </div>

            <div class="h-12 bg-cWhiteGray rounded-lg w-full"></div>
        </div>
    </div>
</section>
{:else}
<section class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3">Join Room</h2>
            <p class="text-white/50 text-sm">Join a secure chat room and start conversations with others.</p>
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
                <label class="block text-sm font-medium">Room ID</label>
                <div class="relative">
                    <i class="ri-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={joinRoomId} placeholder="Enter room ID" on:input={checkRoomType} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            {#if joinRoomId && roomType === 'private' && !error}
            <div class="space-y-2">
                <label class="block text-sm font-medium">Room Password</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
                <p class="text-xs text-white/50">Password required for private rooms</p>
            </div>
            {/if}

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" on:click={handleJoinRoom} disabled={userId === '' || joinRoomId === '' || restrictedUsernames.includes(userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) || (roomType === 'private' && (!roomPassword || roomPassword.length < 6)) || isLoading || isCheckingRoom }>
                {isCheckingRoom ? 'Checking room...' : (isLoading ? 'Joining...' : 'Join Room')}
            </button>
        </div>
    </div>
</section>
{/if}
{/if}

<Footer />