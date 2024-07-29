<script lang="ts">
  import { goto } from '$app/navigation';
  import { createRoom } from '$lib/room';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { onMount } from 'svelte';

  let userId = '';
  let roomId = '';
  let isLoading = false;
  let error = '';

  onMount(() => {
    userId = localStorage.getItem('userId') || '';
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
      roomId = await createRoom(userId);
      localStorage.setItem('userId', userId);
      toast.success('Room created successfully!', { duration: 3000, position: 'top-right' });
    } catch {
      error = 'Failed to create room. Please try again.';
    } finally {
      isLoading = false;
    }
  }
</script>

<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <h2 class="text-2xl font-bold text-center mb-6">Create Room</h2>
    <div class="bg-white p-6 rounded shadow">
      <p class="text-gray-700 mb-2 text-sm">Enter your User ID to create a room.</p>
      <input bind:value={userId} type="text" placeholder="User ID" class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" />
      
      <button on:click={handleCreateRoom} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm w-full mb-6" disabled={isLoading}>
        <i class="ri-add-circle-line mr-1"></i> {isLoading ? 'Creating...' : 'Create Room'}
      </button>

      {#if roomId}
        <h3 class="text-lg font-bold text-gray-800 mb-4">Your Room ID:</h3>
        <input bind:value={roomId} readonly type="text" placeholder="Room ID" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" />

        <div class="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button on:click={copyToClipboard} class="w-full sm:w-auto bg-gray-800 py-2 px-4 rounded transition duration-300 text-sm text-white">
            <i class="ri-clipboard-line mr-1"></i> Copy Room ID
          </button>
          <button on:click={() => goto(`/room/${roomId}`)} class="w-full sm:w-auto border border-gray-800 bg-transparent py-2 px-4 rounded transition duration-300 text-sm">
            <i class="ri-door-line mr-1"></i> Join Room
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
