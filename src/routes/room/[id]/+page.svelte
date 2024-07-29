<script lang="ts">
  import { page } from '$app/stores';
  import { leaveRoom } from '$lib/room';
  import { sendMessage, getMessages } from '$lib/message';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';

  let userId = '';
  let message = '';
  let isLoading = false;
  let error = '';
  let messages: Array<{
    [x: string]: any; sender: string, message: string 
  }> = [];

  $: roomId = $page.params.id;

  let pollingInterval: NodeJS.Timeout;

  async function loadRoomData() {
    try {
      const newMessages = await getMessages(roomId);
      if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
        messages = newMessages;
      }
    } catch (err) {
      error = 'Failed to load room data';
      toast.error(error);
    }
  }

  function startPolling() {
    pollingInterval = setInterval(loadRoomData, 5000);
  }

  onMount(async () => {
    userId = localStorage.getItem('userId') || '';
    if (!userId) {
      goto('/create/room');
    } else {
      await loadRoomData();
      startPolling();
    }
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  async function handleSendMessage() {
    if (!message.trim()) return;
    isLoading = true;
    try {
      await sendMessage(roomId, userId, message);
      message = '';
      await loadRoomData();
    } catch (err) {
      error = 'Failed to send message';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }

  async function handleLeaveRoom() {
    isLoading = true;
    try {
      await leaveRoom(roomId, userId);
      toast.success('Left the room successfully');
      goto('/create/room');
    } catch (err) {
      error = 'Failed to leave room';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }
</script>

<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <div class="bg-white p-6 rounded shadow">
      <h3 class="text-xl font-semibold mb-2">Messages</h3>
      <hr class="mb-2" />
      <ul class="mb-4 max-h-60 overflow-y-auto">
        {#each messages as msg (msg.sender + msg.message)}
          <li><strong>{msg.userId}:</strong> {msg.message || '[Empty Message]'}</li>
        {/each}
      </ul>

      <textarea bind:value={message} placeholder="Type your message..." class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500" rows="4"></textarea>
      <div class="flex justify-between">
        <button on:click={handleSendMessage} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm" disabled={isLoading || !message.trim()}>
          <i class="ri-message-line mr-1"></i> {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        <button on:click={handleLeaveRoom} class="bg-red-500 text-white py-2 px-6 rounded transition duration-300 hover:bg-red-600 text-sm" disabled={isLoading}>
          <i class="ri-logout-box-line mr-1"></i> Leave Room
        </button>
      </div>

      {#if error}
        <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}
    </div>
  </div>
</section>
<Footer />
