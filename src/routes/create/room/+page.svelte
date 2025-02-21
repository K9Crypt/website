<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { createRoom, ROOM_LIFETIMES, type RoomLifetime } from '$lib/room';
    import { onMount } from 'svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import { checkLink } from '$lib/check';
    import { blockedNames } from '$lib/config/blockedNames';
    import  { _ } from 'svelte-i18n';

    let selectedType: "public" | "private" = 'public';
    let selectedLifetime: RoomLifetime = ROOM_LIFETIMES.ONE_DAY;
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
    let expiresAt: string | null = null;
    let selectedCategory: string | null = null;

    const restrictedUsernames = [...blockedNames.blockedNames, ...blockedNames.religiousTerms].map(name =>
        name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    );

    const lifetimeOptions = [
        { value: ROOM_LIFETIMES.ONE_DAY, label: $_('room.create.form.oneDay') },
        { value: ROOM_LIFETIMES.ONE_MONTH, label: $_('room.create.form.oneMonth') },
        { value: ROOM_LIFETIMES.ONE_YEAR, label: $_('room.create.form.oneYear') },
        { value: ROOM_LIFETIMES.PERMANENT, label: $_('room.create.form.permanent') }
    ];

    const categoryOptions = [
        { value: null, label: $_('room.create.form.noCategory') },
        { value: 'general', label: $_('room.create.form.categories.general') },
        { value: 'software', label: $_('room.create.form.categories.software') },
        { value: 'chat', label: $_('room.create.form.categories.chat') },
        { value: 'gaming', label: $_('room.create.form.categories.gaming') },
        { value: 'support', label: $_('room.create.form.categories.support') },
        { value: 'other', label: $_('room.create.form.categories.other') }
    ];


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
            toast.success($_('room.create.copySuccess'), {
                duration: 3000,
                position: 'bottom-right',
                style: 'background-color: #1B1B1B; color: #fff;'
            });
        } catch (err) {
            toast.error($_('room.create.copyError'), {
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
            error = $_('room.create.errors.noUsername');
            return false;
        }

        if (userId.length < 3) {
            error = $_('room.create.errors.usernameTooShort');
            return false;
        }

        if (restrictedUsernames.includes(normalizedUserId)) {
            error = $_('room.create.errors.usernameRestricted');
            return false;
        }

        if (!roomName) {
            error = $_('room.create.errors.noRoomName');
            return false;
        }

        if (roomName.length < 3 || roomName.length > 50) {
            error = $_('room.create.errors.roomNameLength');
            return false;
        }

        if (selectedType === 'private') {
            if (!roomPassword) {
                error = $_('room.create.errors.noPassword');
                return false;
            }
            if (roomPassword.length < 6) {
                error = $_('room.create.errors.passwordTooShort');
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
            const result = await createRoom(
                userId,
                selectedType,
                roomPassword,
                roomName,
                selectedLifetime,
                selectedCategory || undefined
            );
            roomId = result.roomId;
            expiresAt = result.expiresAt;

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
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">{$_('room.create.error.serverStatus')}</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">{$_('room.create.error.serverDesc')}</p>
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
            <h2 class="text-3xl font-bold mb-3">{$_('room.create.title')}</h2>
            <p class="text-white/50 text-sm">{$_('room.create.description')}</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.username')}</label>
                <div class="relative">
                    <i class="ri-user-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={userId} placeholder={$_('room.create.placeholder.enterUsername')} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.roomName')}</label>
                <div class="relative">
                    <i class="ri-chat-3-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="text" bind:value={roomName} placeholder={$_('room.create.placeholder.enterRoomName')} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.category')}</label>
                <select bind:value={selectedCategory} class="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white">
                    {#each categoryOptions as option}
                        <option value={option.value}>{option.label}</option>
                    {/each}
                </select>
            </div>

            <div class="space-y-2">
                <div class="grid grid-cols-2 gap-4">
                    <button class="px-4 py-2.5 rounded-lg border {selectedType === 'public' ? 'bg-cYellow/10 border-cYellow text-cYellow' : 'border-white/5 text-white/50'} font-medium transition-all duration-300" on:click={() => selectRoomType('public')}>
                        <i class="ri-global-fill mr-2"></i>
                        {$_('room.create.form.public')}
                    </button>
                    <button class="px-4 py-2.5 rounded-lg border {selectedType === 'private' ? 'bg-cYellow/10 border-cYellow text-cYellow' : 'border-white/5 text-white/50'} font-medium" on:click={() => selectRoomType('private')}>
                        <i class="ri-lock-fill mr-2"></i>
                        {$_('room.create.form.private')}
                    </button>
                </div>
            </div>

            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.lifetime')}</label>
                <span class="text-white/50 text-xs">{$_('room.create.form.lifetimeHint')}</span>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {#each lifetimeOptions as option}
                        <button
                            class="px-4 py-2.5 rounded-lg border {selectedLifetime === option.value ? 'bg-cYellow/10 border-cYellow text-cYellow' : 'border-white/5 text-white/50'} font-medium transition-all duration-300"
                            on:click={() => selectedLifetime = option.value}
                        >
                            {option.label}
                        </button>
                    {/each}
                </div>
            </div>

            {#if showPassword}
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('room.create.form.password')}</label>
                <div class="relative">
                    <i class="ri-lock-password-line absolute left-3 top-1/2 -translate-y-1/2 text-white/50"></i>
                    <input type="password" bind:value={roomPassword} placeholder={$_('room.create.placeholder.enterPassword')} class="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"/>
                </div>
                <p class="text-xs text-white/50">{$_('room.create.form.passwordHint')}</p>
            </div>
            {/if}

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <div class="flex justify-center">
                <button class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" on:click={handleCreateRoom} disabled={isLoading || !userId || !roomName || restrictedUsernames.includes(userId.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) || (selectedType === 'private' && (!roomPassword  || roomPassword.length < 6))}>{isLoading ? $_('room.create.form.creating') : $_('room.create.form.create')}</button>
            </div>
        </div>

        {#if isRoomCreated}
        <div class="mt-6 bg-cWhiteGray rounded-lg border border-white/5 p-4">
            <h3 class="text-lg font-semibold">{$_('room.create.success.roomId')}:</h3>
            <div class="flex items-center justify-between mb-4">
                <p class="text-white text-sm">{roomId}</p>
            </div>
            {#if expiresAt}
                <p class="text-white/50 text-sm mb-4">{$_('room.create.success.expiresAt')}: {new Date(expiresAt).toLocaleString()}</p>
            {/if}
            <div class="flex flex-col sm:flex-row gap-4">
                <button class="w-full bg-cYellow text-black py-2.5 px-4 rounded-lg font-medium" on:click={copyToClipboard}>{$_('room.create.success.copy')}</button>
                <button class="w-full bg-cYellow/10 border border-cYellow text-cYellow py-2.5 px-4 rounded-lg font-medium" on:click={handleJoinRoom}>{$_('room.create.success.join')}</button>
            </div>
        </div>
        {/if}
    </div>
</section>
{/if}

<Footer />