<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { joinRoom, checkRoom, checkPassword } from '$lib/room';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount } from 'svelte';
    import { checkLink } from '$lib/check';

    let userId = '';
    let status: boolean | null = null;;
    let joinRoomId = '';
    let roomPassword = '';
    let isLoading = false;
    let error = '';
    let isPageLoading = true;
    let roomType: 'public' | 'private' = 'public';
    let isCheckingRoom = false;

    onMount(() => {
        userId = localStorage.getItem('userId') || '';
        status = checkLink(`${import.meta.env.VITE_APP_APIURL}`);

        setTimeout(() => isPageLoading = false, 1500);
    });

    async function handleJoinRoom() {
        if (!userId || !joinRoomId) {
            error = 'Please enter a User ID and Room ID';
            return;
        }

        if (roomType === 'private' && !roomPassword) {
            error = 'Please enter the room password';
            return;
        }

        isLoading = true;
        error = '';

        try {
            if (roomType === 'private') {
                const isPasswordValid = await checkPassword(joinRoomId, roomPassword);
                if (!isPasswordValid) {
                    error = 'Invalid password. Please try again.';
                    isLoading = false;
                    return;
                }
            }

            await joinRoom(joinRoomId, userId, roomPassword);
            localStorage.setItem('userId', userId);
            toast.success('Joined the room successfully!', { 
                duration: 3000, 
                position: 'top-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            goto(`/room/${joinRoomId}`);
        } catch (err) {
            if (err.message === 'Room not found') {
                error = 'Room not found. Please check the Room ID.';
            } else {
                error = 'Failed to join the room. Please try again.';
            }
        } finally {
            isLoading = false;
        }
    }

    async function routeSupport() {
        await goto("/contact");
    }

    async function checkRoomType() {
        if (!joinRoomId) return;
        isCheckingRoom = true;
        error = '';

        try {
            const roomDetails = await checkRoom(joinRoomId);
            roomType = roomDetails.type;
        } catch (err) {
            if (err.message === 'Room not found') {
                error = 'Room not found. Please check the Room ID.';
                roomType = 'public';
            } else {
                error = 'Failed to check room type. Please try again.';
            }
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
<section class="py-8 sm:py-12 md:py-16 px-4 flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8 animate-pulse">
            <div class="h-8 bg-cWhiteGray rounded w-64 mb-3"></div>
            <div class="h-4 bg-cWhiteGray rounded w-96"></div>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-6 animate-pulse">
            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded w-24"></div>
                <div class="h-10 bg-cWhiteGray rounded w-full"></div>
            </div>

            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded w-24"></div>
                <div class="h-10 bg-cWhiteGray rounded w-full"></div>
            </div>

            <div class="h-12 bg-cWhiteGray rounded w-full"></div>
        </div>

        <div class="mt-8 bg-cWhiteGray rounded p-4">
            <div class="flex items-start gap-3">
                <div class="w-4 h-4 bg-cWhiteGray rounded mt-1"></div>
                <div class="space-y-2 flex-1">
                    <div class="h-4 bg-cWhiteGray rounded w-32"></div>
                    <div class="space-y-1">
                        <div class="h-3 bg-cWhiteGray rounded w-full"></div>
                        <div class="h-3 bg-cWhiteGray rounded w-5/6"></div>
                        <div class="h-3 bg-cWhiteGray rounded w-4/5"></div>
                        <div class="h-3 bg-cWhiteGray rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
{:else}
<section class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3 text-white/80">Join Room</h2>
            <p class="text-white/50 text-sm">Join a secure chat room and start conversations with others.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Username</label>
                <input type="text" bind:value={userId} placeholder="Enter username" class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Room ID</label>
                <input type="text" bind:value={joinRoomId} placeholder="Enter room ID" on:input={checkRoomType} class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
            </div>

            {#if joinRoomId && roomType === 'private' && !error}
            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Room Password</label>
                <div class="relative">
                    <input type="password" bind:value={roomPassword} placeholder="Enter room password" class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
                <p class="text-xs text-white/50">Password required for private rooms</p>
            </div>
            {/if}

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button class="w-full bg-cYellow text-black py-3 rounded font-medium disabled:opacity-50" on:click={handleJoinRoom} disabled={userId === '' || joinRoomId === '' || (roomType === 'private' && roomPassword === '') || isLoading || isCheckingRoom}>
                {isCheckingRoom ? 'Checking room...' : (isLoading ? 'Joining...' : 'Join Room')}
            </button>
        </div>

        <div class="mt-8">
            <div class="bg-cWhiteGray border border-white/5 rounded p-4">
                <div class="flex items-start gap-3">
                    <i class="ri-information-fill text-cYellow mt-1"></i>
                    <div>
                        <h4 class="text-sm font-medium text-white/80 mb-1">Room Join Tips</h4>
                        <ul class="text-xs text-white/50 space-y-1">
                            <li>• Public rooms are visible to everyone</li>
                            <li>• Private rooms require a password to join</li>
                            <li>• Usernames must be unique</li>
                            <li>• Messages are automatically deleted after 2 hours</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
{/if}
{/if}

<Footer />