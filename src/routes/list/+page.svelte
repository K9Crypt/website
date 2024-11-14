<script lang="ts">
import { onMount } from 'svelte';
import { listRooms, joinRoom } from '../../lib/room';
import { goto } from '$app/navigation';
import Navbar from '../../components/Navbar.svelte';
import Footer from '../../components/Footer.svelte';
import toast, { Toaster } from 'svelte-french-toast';

let rooms: any[] = [];
let error: string | null = null;
let showModal = false;
let selectedRoomId: string | null = null;
let username = '';
let isLoaded = false;
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
        console.log(rooms);
        totalRoomsCount = rooms.length;
    } catch (err) {
        error = 'Failed to fetch rooms';
    } finally {
        isLoaded = true;
    }
});

async function handleJoinRoom() {
    try {
        if (!username.trim()) {
            toast.error('Please enter a username', { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
            return;
        }
        
        const message = await joinRoom(selectedRoomId, username);
        showModal = false;
        toast.success(message, { duration: 3000, position: 'top-right', style: 'background-color: #1B1B1B; color: #fff;' });
        goto(`/room/${selectedRoomId}`);
    } catch (error) {
        console.error('Failed to join room:', error);
        alert('Failed to join room. Please try again.');
    }
}

function openJoinModal(roomId: string) {
    selectedRoomId = roomId;
    showModal = true;
}

function closeJoinModal() {
    showModal = false;
}

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
</script>

<Navbar />
<Toaster />

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-8 animate-pulse">
            <div class="mb-8">
                <div class="h-8 bg-cWhiteGray rounded w-1/3 mb-3"></div>
                <div class="h-4 bg-cWhiteGray rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-cWhiteGray rounded w-2/3"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each Array(4) as _}
                    <div class="bg-cWhiteGray border border-white/5 rounded p-6">
                        <div class="h-6 bg-cWhiteGray rounded w-3/4 mb-4"></div>
                        <div class="space-y-3">
                            <div class="h-4 bg-cWhiteGray rounded w-1/2"></div>
                            <div class="h-4 bg-cWhiteGray rounded w-2/3"></div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
        {:else if error}
        <div class="text-center py-12">
            <p class="text-red-500">{error}</p>
        </div>
        {:else if rooms.length === 0}
        <div class="text-center py-12">
            <p class="text-white/50">No rooms available.</p>
        </div>
        {:else}
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3 text-white/80">Available Rooms</h2>
            <p class="text-white/50 text-sm">Join an existing room to start chatting with others.</p>
            <p class="text-white/50 text-sm mt-2">There are currently <span class="font-bold">{totalRoomsCount}</span> rooms available.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            {#each displayedRooms as room}
            <button on:click={() => openJoinModal(room.ID)} class="bg-cWhiteGray border border-white/5 rounded p-4 sm:p-6 text-left transition-all duration-300 hover:bg-opacity-75">
                <div class="relative z-10">
                    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between mb-3 sm:mb-2">
                        <h4 class="text-base sm:text-lg font-semibold text-white/80 truncate">{room.ID}</h4>
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
                    </div>
                </div>
            </button>
            {/each}
        </div>

        {#if totalPages > 1}
        <div class="mt-8 flex justify-center items-center gap-4">
            <button on:click={prevPage} class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded px-4 py-2 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canGoPrev}>
                <i class="ri-arrow-left-line"></i>
                Previous
            </button>
            <span class="text-white/50">Page {currentPage} of {totalPages}</span>
            <button on:click={() => nextPage(1)} class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded px-4 py-2 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!canGoNext}>
                Next
                <i class="ri-arrow-right-line"></i>
            </button>
        </div>
        {/if}
        {/if}
    </div>
</section>

<Footer />

{#if showModal}
<div class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
    <div class="bg-cWhiteGray p-6 rounded w-96">
        <h3 class="text-xl font-semibold mb-4 text-white/80">Enter Username</h3>
        <input type="text" bind:value={username} placeholder="Enter your username" class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30" />
        <div class="mt-6 flex flex-col sm:flex-row gap-4 justify-center w-full">
            <button on:click={handleJoinRoom} class="flex-1 flex items-center bg-cYellow text-black py-2 px-10 rounded font-medium justify-center w-full">Join</button>
            <button on:click={closeJoinModal} class="flex-1 flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2 px-10 rounded font-medium justify-center w-full">Cancel</button>
        </div>
    </div>
</div>
{/if}