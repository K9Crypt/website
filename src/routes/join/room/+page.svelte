<script lang="ts">
  import { goto } from '$app/navigation';
  import { joinRoom } from '$lib/room';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { checkLink } from '$lib/check';
  import { onMount } from 'svelte';

  let userId = '';
  let status = false;
  let joinRoomId = '';
  let isLoading = false;
  let error = '';
  let isPageLoading = true;

  onMount(async () => {
    status = await checkLink("https://api.k9crypt.xyz");
    userId = localStorage.getItem('userId') || '';
    setTimeout(() => isPageLoading = false, 1000);
  });

  async function handleJoinRoom() {
    if (!userId || !joinRoomId) {
      error = 'Please enter both User ID and Room ID';
      return;
    }
    isLoading = true;
    error = '';

    try {
      await joinRoom(joinRoomId, userId);
      localStorage.setItem('userId', userId);
      toast.success('Joined room successfully!', { duration: 3000, position: 'top-right' });
      goto(`/room/${joinRoomId}`);
    } catch {
      error = 'Failed to join room. Please try again.';
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
    <h2 class="text-2xl font-bold text-center mb-6">Join Room</h2>
    <div class="bg-white p-6 rounded shadow">
      <p class="text-gray-700 mb-2 text-sm">Enter your User ID to create a room.</p>
      <input bind:value={userId} type="text" placeholder="User ID" class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" />
      <p class="text-gray-700 mb-2 text-sm">Enter the Room ID to join a room.</p>
      <input bind:value={joinRoomId} type="text" placeholder="Room ID" class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" />
      
      <button on:click={handleJoinRoom} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm w-full mb-6" disabled={isLoading}>
        <i class="ri-door-line mr-1"></i> {isLoading ? 'Joining...' : 'Join Room'}
      </button>

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
        <p class="text-center text-red-600"><i class="ri-error-warning-fill mr-1"></i> System is currently offline. Please check back later.</p>
    </div>
  </div>
</section>
{/if}