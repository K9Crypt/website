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
    let roomTypeFilter: 'public' | 'private' | '' = '';
    let sortOption: 'users' | 'messages' | 'newest' | 'activity' | '' = '';
    let minUsersFilter = '';


	$: totalPages = Math.ceil(totalRoomsCount / roomsPerPage);
	$: displayedRooms = rooms.slice((currentPage - 1) * roomsPerPage, currentPage * roomsPerPage);
	$: canGoNext = currentPage * roomsPerPage < totalRoomsCount;
	$: canGoPrev = currentPage > 1;

	function formatRemainingTime(expiresAt: string | null, isPermanent: boolean): string {
		if (isPermanent) return $_('list.remainingTime.permanent');
		if (!expiresAt) return $_('list.remainingTime.expired');

		const now = new Date().getTime();
		const expiry = new Date(expiresAt).getTime();
		const remaining = expiry - now;

		if (remaining <= 0) return $_('list.remainingTime.expired');

		const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
		const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

		let timeString = [];

		if (days > 0) timeString.push(`${days}d`);
		if (hours > 0) timeString.push(`${hours}h`);
		if (minutes > 0 || timeString.length === 0) timeString.push(`${minutes}m`);

		return timeString.join(' ');
	}

    async function fetchRooms() {
        try {
            const queryParams = new URLSearchParams();
            if (roomTypeFilter) queryParams.append('type', roomTypeFilter);
            if (sortOption) queryParams.append('sort', sortOption);
            if (minUsersFilter) queryParams.append('minUsers', minUsersFilter);
            queryParams.append('page', currentPage.toString());
            queryParams.append('limit', roomsPerPage.toString());

            const queryString = queryParams.toString();
            rooms = await listRooms(queryString);
            totalRoomsCount = rooms.length;
        } catch (err) {
            error = $_('room.create.error.connectionDesc');
        }
    }

	onMount(fetchRooms);

    $: {
        if (roomTypeFilter || sortOption || minUsersFilter || currentPage) {
          fetchRooms();
        }
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
						<h1
							class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center"
						>
							{$_('room.create.error.connectionTitle')}
						</h1>
						<p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">
							{$_('room.create.error.connectionDesc')}
						</p>

						<div
							class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8"
						>
							<div class="flex justify-center mb-3 sm:mb-4">
								<i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl" />
							</div>
							<h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">
								{$_('room.create.error.serverStatus')}
							</h2>
							<p class="text-red-500 text-xs sm:text-sm md:text-base text-center">{error}</p>
						</div>

						<button
							class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600"
							on:click={() => window.location.reload()}
						>
							{$_('room.create.error.tryAgain')}
						</button>
					</div>
				</div>
			{:else if rooms.length === 0}
				<div class="flex flex-col items-center justify-center min-h-[60vh]">
					<div class="text-center bg-white/5 p-8 rounded-lg mb-6 w-96">
						<div class="mb-4 text-white/30">
							<i class="ri-team-fill text-6xl" />
						</div>
						<p class="text-white/50 text-xl font-medium">{$_('list.noRooms')}</p>
						<p class="text-white/30 text-sm mt-2">{$_('list.noActiveRooms')}</p>
					</div>
				</div>
			{:else}
				<div class="mb-8">
					<h2 class="text-3xl font-bold mb-3">{$_('list.availableRooms')}</h2>
					<p class="text-white/50 text-sm">{$_('list.activeRoomsList')}</p>
					<p class="text-white/50 text-sm mt-2">
						{$_('list.totalRooms', { values: { total: totalRoomsCount } })}
					</p>
				</div>

                <div class="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label for="roomType" class="block text-sm font-medium text-white/70">{$_('list.roomType')}</label>
                        <select id="roomType" bind:value={roomTypeFilter} class="mt-1 block w-full bg-cWhiteGray border border-white/5 rounded-md shadow-sm py-2 px-3 text-sm text-white/50 focus:outline-none focus:ring-2 focus:ring-cYellow focus:border-cYellow">
                            <option value="">{$_('list.all')}</option>
                            <option value="public">{$_('list.public')}</option>
                            <option value="private">{$_('list.private')}</option>
                        </select>
                    </div>
                    <div>
                        <label for="sortOption" class="block text-sm font-medium text-white/70">{$_('list.sortBy')}</label>
                        <select id="sortOption" bind:value={sortOption} class="mt-1 block w-full bg-cWhiteGray border border-white/5 rounded-md shadow-sm py-2 px-3 text-sm text-white/50 focus:outline-none focus:ring-2 focus:ring-cYellow focus:border-cYellow">
                            <option value="">{$_('list.none')}</option>
                            <option value="users">{$_('list.users')}</option>
                            <option value="messages">{$_('list.messages')}</option>
                            <option value="newest">{$_('list.newest')}</option>
                            <option value="activity">{$_('list.activity')}</option>
                        </select>
                    </div>
                    <div>
                        <label for="minUsers" class="block text-sm font-medium text-white/70">{$_('list.minUsers')}</label>
                        <input type="number" id="minUsers" bind:value={minUsersFilter} min="1" class="mt-1 block w-full bg-cWhiteGray border border-white/5 rounded-md shadow-sm py-2 px-3 text-sm text-white/50 focus:outline-none focus:ring-2 focus:ring-cYellow focus:border-cYellow" placeholder="1" />
                    </div>
                </div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					{#each displayedRooms as room}
						<div class="bg-cWhiteGray border border-white/5 rounded-lg p-4 sm:p-6 text-left">
							<div class="relative z-10">
								<div
									class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between mb-3 sm:mb-2"
								>
									<div class="space-y-1">
										<h3 class="text-lg sm:text-xl font-bold truncate">{room.roomName || 'Unnamed Room'}</h3>
                                        <p class="text-sm sm:text-base text-white/50 truncate">ID: {room.id}</p>
									</div>
									<div class="flex items-center gap-3">
										<span class="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
											<i class="ri-user-fill text-base sm:text-lg" />
											{room.userCount || 0}
										</span>
										<span class="flex items-center gap-1.5 text-white/50 text-xs sm:text-sm">
											<i
												class="{room.type === 'private'
													? 'ri-lock-fill'
													: 'ri-lock-unlock-fill'} text-base sm:text-lg"
											/>
											{room.type.charAt(0).toUpperCase() + room.type.slice(1)}
										</span>
									</div>
								</div>
								<div class="space-y-2">
									<div class="flex items-center gap-2 text-white/50">
										<i class="ri-calendar-event-fill text-base sm:text-lg" />
										<p class="text-xs sm:text-sm">{new Date(room.createdAt).toLocaleString()}</p>
									</div>
									{#if room.lastActivity}
										<div class="flex items-center gap-2 text-white/50">
											<i class="ri-timer-fill text-base sm:text-lg" />
											<p class="text-xs sm:text-sm">{new Date(room.lastActivity).toLocaleString()}</p>
										</div>
									{/if}
									<div class="flex items-center justify-between gap-2 text-white/50">
										<div class="flex items-center gap-2">
											<i class="ri-hourglass-fill text-base sm:text-lg" />
											<p class="text-xs sm:text-sm">{formatRemainingTime(room.expiresAt, room.isPermanent)}</p>
										</div>
										{#if !room.isPermanent && room.expiresAt}
											<p class="text-xs text-white/30">
												{new Date(room.expiresAt).toLocaleDateString()}
											</p>
										{/if}
									</div>
									<hr class="border border-white/10" />
									<div class="flex flex-col gap-2">
										<button
											on:click={() => copy(room.roomName)}
											class="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
										>
											<i class="ri-file-copy-line text-base sm:text-lg" />
											<span class="text-xs sm:text-sm">{$_('list.copyRoomName')}</span>
										</button>
										<button
											on:click={() => copy(room.id)}
											class="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
										>
											<i class="ri-file-copy-line text-base sm:text-lg" />
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
						<button
							on:click={prevPage}
							class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded-lg px-4 py-2.5 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!canGoPrev}
						>
							<i class="ri-arrow-left-fill" />
							{$_('list.previous')}
						</button>
						<span class="text-white/50"
							>{$_('list.page', { values: { current: currentPage, total: totalPages } })}</span
						>
						<button
							on:click={() => nextPage(1)}
							class="flex items-center gap-2 bg-cWhiteGray border border-white/5 rounded-lg px-4 py-2.5 text-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!canGoNext}
						>
							{$_('list.next')}
							<i class="ri-arrow-right-fill" />
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</section>

	<Footer />
</div>