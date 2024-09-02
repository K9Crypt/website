<script lang="ts">
  import { goto } from '$app/navigation';
  import { createRoom, joinRoom, leaveRoom } from '$lib/room';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { checkLink } from '$lib/check';
  import { onMount } from 'svelte';

  let userId = '';
  let roomId = '';
  let roomType: "public" | "private" = "public";
  let roomPassword = '';
  let status = false;
  let isLoading = false;
  let error = '';
  let isPageLoading = true;

  onMount(async () => {
    status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
    userId = localStorage.getItem('userId') || '';
    setTimeout(() => isPageLoading = false, 1000);
  });

  async function copyToClipboard() {
    navigator.clipboard.writeText(roomId).then(
      () => toast.success('Room ID copied to clipboard.', { duration: 3000, position: 'top-right' }),
      err => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy room ID. Please try again.', { duration: 3000, position: 'top-right' });
      }
    );
  }

  async function handleCreateRoom() {
    if (!userId) {
      error = 'Please enter a User ID';
      return;
    }
    isLoading = true;
    error = '';

    try {
      roomId = await createRoom(userId, roomType, roomPassword);
      localStorage.setItem('userId', userId);
      toast.success('Room created successfully!', { duration: 3000, position: 'top-right' });
    } catch (err) {
      if (err.message === 'Invalid user ID') {
        error = 'Invalid User ID. Please try again.';
      } else if (err.message === 'Room creation failed') {
        error = 'Failed to create room. Please try again.';
      } else {
        error = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      isLoading = false;
    }
  }

  async function handleJoinRoom() {
    if (!userId || !roomId) {
      error = 'Please enter a User ID and Room ID';
      return;
    }
    isLoading = true;
    error = '';

    try {
      const message = await joinRoom(roomId, userId, roomPassword);
      toast.success(message, { duration: 3000, position: 'top-right' });
      goto(`/room/${roomId}`);
    } catch (err) {
      if (err.message === 'Invalid room ID') {
        error = 'Invalid Room ID. Please try again.';
      } else if (err.message === 'Invalid password') {
        error = 'Invalid password. Please try again.';
      } else {
        error = 'Failed to join room. Please try again.';
      }
    } finally {
      isLoading = false;
    }
  }

  async function handleLeaveRoom() {
    if (!userId || !roomId) {
      error = 'Please enter a User ID and Room ID';
      return;
    }
    isLoading = true;
    error = '';

    try {
      const message = await leaveRoom(roomId, userId);
      toast.success(message, { duration: 3000, position: 'top-right' });
      roomId = '';
    } catch (err) {
      if (err.message === 'Invalid room ID') {
        error = 'Invalid Room ID. Please try again.';
      } else {
        error = 'Failed to leave room. Please try again.';
      }
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isPageLoading}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg flex items-center justify-center">
    <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
  </div>
</section>

<style>
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
{:else if status}
<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Create Room</h2>
    <div>
      <p class="mb-2 text-sm">Enter your User ID to create a room.</p>
      <input bind:value={userId} type="text" placeholder="User ID" class="w-full mb-4 p-2 border-2 border-dark-green rounded-lg focus:outline-none" />
      
      <p class="mb-2 text-sm">Enter a room type.</p>
      <select bind:value={roomType} class="w-full mb-4 p-2 border-2 border-dark-green rounded-lg focus:outline-none">
        <option value="public">Public</option>
        <option value="private">Private</option>
      </select>

      {#if roomType === 'private'}
      <p class="mb-2 text-sm">Enter a room password.</p>
      <input bind:value={roomPassword} type="password" placeholder="Room Password" class="w-full mb-4 p-2 border-2 border-dark-green rounded-lg focus:outline-none" />
      {/if}

      <button on:click={handleCreateRoom} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg disabled:opacity-50" disabled={isLoading}>
        <i class="ri-add-circle-line  mr-1"></i> {isLoading ? 'Creating...' : 'Create Room'}
      </button>

      {#if roomId}
      <h3 class="text-lg font-bold mb-4 mt-4">Your Room ID:</h3>
      <input bind:value={roomId} readonly type="text" placeholder="Room ID" class="w-full p-2 rounded-lg border-2 border-dark-green focus:outline-none" />

      <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button on:click={copyToClipboard} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg disabled:opacity-50">
          <i class="ri-clipboard-line  mr-1"></i> Copy Room ID
        </button>
        <button on:click={handleJoinRoom} class="px-6 py-2 border-2 border-dark-green rounded-lg">
          <i class="ri-door-line  mr-1"></i> Join Room
        </button>
      </div>
      {/if}

      {#if error}
      <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}
    </div>
  </div>
</section>
<Footer />
{:else}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <div class="bg-red-100 p-3 rounded-full">
        <p class="text-center text-red-600">System is currently offline. Please check back later.</p>
    </div>
  </div>
</section>
{/if}