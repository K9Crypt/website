<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { joinRoom, checkRoom } from '$lib/room';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount } from 'svelte';
    import { checkLink } from '$lib/check';
    import { blockedNames } from '$lib/config/blockedNames';
    import { _ } from 'svelte-i18n';

    let userId = '';
    let status: boolean | null = null;
    let joinRoomId = '';
    let roomPassword = '';
    let isLoading = false;
    let error = '';
    let roomType: 'public' | 'private' = 'public';
    let isCheckingRoom = false;
    let roomDetails: any = null;
    const restrictedUsernames = [...blockedNames.blockedNames, ...blockedNames.religiousTerms].map(name => 
        name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    onMount(async () => {
        userId = localStorage.getItem('userId') || '';
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
    });

    async function handleJoinRoom() {
        const normalizedUserId = userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        if (!userId?.trim()) {
            error = $_('room.create.errors.noUsername');
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        if (restrictedUsernames.includes(normalizedUserId)) {
            error = $_('room.create.errors.usernameRestricted');
            toast.error(error, {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
            return;
        }

        if (!joinRoomId?.trim()) {
            error = $_('room.create.errors.noRoomName');
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
                error = $_('room.create.error.roomNotFound');
                return;
            }

            roomType = roomDetails.type;

            if (roomDetails.users?.includes(userId)) {
                error = $_('room.create.errors.usernameTaken');
                return;
            }

            if (roomType === 'private' && !roomPassword?.trim()) {
                error = $_('room.create.errors.noPassword');
                return;
            }

            await joinRoom(joinRoomId, userId, roomType === 'private' ? roomPassword : undefined);
            
            localStorage.setItem('userId', userId);
            localStorage.setItem(`hasJoinedRoom_${joinRoomId}`, 'true');
            
            toast.success($_('room.join.success'), { 
                duration: 3000, 
                position: 'bottom-right', 
                style: 'background-color: #1B1B1B; color: #fff;' 
            });
            
            goto(`/room/${joinRoomId}`);
        } catch (err: any) {
            if (err.message?.includes('already taken')) {
                error = $_('room.create.errors.usernameTaken');
            } else if (err.message?.includes('password')) {
                error = $_('room.join.errors.invalidPassword');
            } else if (err.message?.includes('not found')) {
                error = $_('room.create.error.roomNotFound');
            } else {
                error = err.message || $_('room.join.errors.failedToJoin');
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
                error = $_('room.create.error.roomNotFound');
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
                error = $_('room.create.error.roomNotFound');
            } else {
                error = $_('room.join.errors.failedToCheck');
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
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">
            {$_('room.create.error.connectionTitle')}
        </h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">
            {$_('room.create.error.connectionDesc')}
        </p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">
                {$_('room.create.error.serverStatus')}
            </h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">
                {$_('room.create.error.serverDesc')}
            </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>{$_('room.create.error.tryAgain')}</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>{$_('room.create.error.support')}</button>
        </div>
    </div>
</div>
{:else}
<section class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3">{$_('room.join.title')}</h2>
            <p class="text-white/50 text-sm">{$_('room.join.description')}</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.username')}</label>
                <div class="relative">
                    <i class="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={userId} placeholder={$_('room.create.form.username')} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.join.form.roomId')}</label>
                <div class="relative">
                    <i class="ri-hashtag absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={joinRoomId} placeholder={$_('room.join.form.roomId')} on:input={checkRoomType} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            {#if joinRoomId && roomType === 'private' && !error}
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.join.form.password')}</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="password" bind:value={roomPassword} placeholder={$_('room.join.form.password')} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
                <p class="text-xs text-white/50">{$_('room.join.form.passwordHint')}</p>
            </div>
            {/if}

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" on:click={handleJoinRoom} disabled={userId === '' || joinRoomId === '' || restrictedUsernames.includes(userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) || (roomType === 'private' && (!roomPassword || roomPassword.length < 6)) || isLoading || isCheckingRoom }>
                {isCheckingRoom ? $_('room.join.form.checkingRoom') : (isLoading ? $_('room.join.form.joining') : $_('room.join.form.joinRoom'))}
            </button>
        </div>
    </div>
</section>
{/if}

<Footer />