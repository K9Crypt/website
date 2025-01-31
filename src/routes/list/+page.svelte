<script lang="ts">
    import { onMount } from 'svelte';
    import { listRooms } from '../../lib/room';
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import toast, { Toaster } from 'svelte-french-toast';
    import { _ } from 'svelte-i18n';

    let rooms: any[] = [];
    let error: string | null = null;
    let totalRoomsCount = 0;
    let currentPage = 1;
    let roomsPerPage = 10;

    $: totalPages = Math.ceil(totalRoomsCount / roomsPerPage);
    $: displayedRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
    $: canGoNext = currentPage * roomsPerPage < totalRoomsCount;
    $: canGoPrev = currentPage > 1;

    onMount(async () => {
        try {
            rooms = await listRooms();
            totalRoomsCount = rooms.length;
        } catch (err) {
            error = $_('room.create.error.connectionDesc');
        }
    });

    function nextPage(direction: number) {
        if (direction === 1 && currentPage * roomsPerPage < totalRoomsCount) {
            currentPage++;
        } else if (direction === -1 && currentPage > 1) {
            currentPage--;
        }
    }

    function prevPage() {
        nextPage(-1);
    }

    function copy(text: string) {
        navigator.clipboard.writeText(text);
        toast.success($_('room.create.copySuccess'), { 
            duration: 2000, 
            position: 'bottom-right',
            style: 'background-color: #1B1B1B; color: #fff;'
        });
    }
</script>

<Navbar />
<Toaster />

<div class="flex flex-col min-h-screen">
    <section class="flex-grow py-8 sm:py-12 md:py-16 px-4">
        <div class="container mx-auto px-4 sm:px-6 lg:px-10">
            {#if error}
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
                        <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">{error}</p>
                    </div>

                    <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>{$_('room.create.error.tryAgain')}</button>
                </div>
            </div>
            {:else if rooms.length === 0}
            <div class="flex flex-col items-center justify-center min-h-[60vh]">
                <div class="text-center bg-white/5 p-8 rounded-lg mb-6 w-96">
                    <div class="mb-4 text-white/30">
                        <i class="ri-team-fill text-6xl"></i>
                    </div>
                    <p class="text-white/50 text-xl font-medium">{$_('list.noRooms')}</p>
                    <p class="text-white/30 text-sm mt-2">{$_('list.noActiveRooms')}</p>
                </div>
            </div>
            {:else}
            <div class="mb-8">
                <h2 class="text-3xl font-bold mb-3">{$_('list.availableRooms')}</h2>
                <p class="text-white/50 text-sm">{$_('list.activeRoomsList')}</p>
                <p class="text-white/50 text-sm mt-2">{$_('list.totalRooms', { values: { total: totalRoomsCount } })}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each displayedRooms as room}
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-4 sm:p-6 text-left">
                    <div class="relative z-10">
                        <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between mb-3 sm:mb-2">
                            <div class="space-y-1">
                                <h3 class="text-lg sm:text-xl font-bold truncate">{room.roomName || 'Unnamed Room'}</h3>
                                <p class="text-sm sm:text-base text-white/50 truncate">ID: {room.id}</p>
                            </div>
                            <div class="flex items-center gap-3">
                                <span class="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
                                    <i class="ri-user-fill text-base sm:text-lg"></i>
                                    {room.userCount || 0}
                                </span>
                                <span class="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
                                    <i class="{room.type === 'private' ? 'ri-lock-fill' : 'ri-lock-unlock-fill'} text-base sm:text-lg"></i>
                                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                                </span>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center gap-2 text-white/50">
                                <i class="ri-calendar-event-fill text-base sm:text-lg"></i>
                                <p class="text-xs sm:text-sm">{new Date(room.createdAt).toLocaleString()}</p>
                            </div>
                            {#if room.lastActivity}
                            <div class="flex items-center gap-2 text-white/50">
                                <i class="ri-timer-fill text-base sm:text-lg"></i>
                                <p class="text-xs sm:text-sm">{new Date(room.lastActivity).toLocaleString()}</p>
                            </div>
                            {/if}
                            <hr class="border border-white/10" />
                            <div class="items-center gap-3">
                                <button on:click={() => copy(room.roomName)} class="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
                                    <i class="ri-file-copy-line text-base sm:text-lg"></i>
                                    <span class="text-xs sm:text-sm">{$_('list.copyRoomName')}</span>
                                </button>
                                <button on:click={() => copy(room.id)} class="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors">
                                    <i class="ri-file-copy-line text-base sm:text-lg"></i>
                                    <span class="text-xs sm:text-sm">{$_('list.copyRoomId')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {/each}
            </div>

            {#if totalPages > 1}
            <div class="mt-8 flex justify-center items-center gap-4">
                <button on:click={prevPage} class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded-lg px-4 py-2.5 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canGoPrev}>
                    <i class="ri-arrow-left-fill"></i>
                    {$_('list.previous')}
                </button>
                <span class="text-white/50">{$_('list.page', { values: { current: currentPage, total: totalPages } })}</span>
                <button on:click={() => nextPage(1)} class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded-lg px-4 py-2.5 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canGoNext}>
                    {$_('list.next')}
                    <i class="ri-arrow-right-fill"></i>
                </button>
            </div>
            {/if}
            {/if}
        </div>
    </section>

    <Footer />
</div>