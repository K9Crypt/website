<script lang="ts">
  import { page } from '$app/stores';
  import { leaveRoom } from '$lib/room';
  import { sendMessage, getMessages } from '$lib/message';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { checkLink } from '$lib/check';
  import { goto } from '$app/navigation';

  let userId = '';
  let message = '';
  let isLoading = false;
  let error = '';
  let messages: Array<{
    [x: string]: string; sender: string, message: string 
  }> = [];
  let status = false;
  let isPageLoading = true;
  let pollingInterval: NodeJS.Timeout;

  async function copyRoomId() {
    await navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard');
  }

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
    status = await checkLink('https://api.k9crypt.xyz');
    userId = localStorage.getItem('userId') || '';
    if (!userId) {
      error = `Please enter a User ID.`;
      return;
    }
    await loadRoomData();
    startPolling();
    setTimeout(() => isPageLoading = false, 1000);
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  let isSendButtonDisabled = false;
  let isLeaveButtonDisabled = false;

  $: roomId = $page.params.id;
  $: isSendButtonDisabled = isLoading || !message.trim();
  $: isLeaveButtonDisabled = isLoading;

  async function handleSendMessage() {
    if (isSendButtonDisabled) return;

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
    if (isLeaveButtonDisabled) return;

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
  <div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
    <div class="bg-white p-6 rounded shadow">
      <h3 class="text-xl font-semibold mb-2">Messages</h3>
      <div>
        <p class="text-xs">Room ID: <button on:click={copyRoomId} class="underline">{roomId}</button></p>
      </div>
      <hr class="mb-2 mt-2" />
      <ul class="mb-4 max-h-[calc(100vh-200px)] sm:max-h-[calc(100vh-250px)] md:max-h-[calc(100vh-300px)] lg:max-h-[calc(100vh-350px)] xl:max-h-[calc(100vh-400px)] overflow-y-auto">
        {#each messages as msg (msg.userId + msg.message)}
          <li>
            <strong>{msg.userId}:</strong>
            {#each msg.message.split(/(\s+)/) as part}
              {#if part.trim().startsWith('http://') || part.trim().startsWith('https://')}
                <a href={part.trim()} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                  {part}
                </a>
              {:else}
                {part || '[Empty Message]'}
              {/if}
            {/each}
          </li>
        {/each}
      </ul>
      <textarea bind:value={message} placeholder="Type your message..." class="w-full mb-4 p-2 border border-gray-300 rounded focus:outline-none" rows="4"></textarea>
      <div class="flex flex-col sm:flex-row justify-between items-center">
        <button on:click={handleSendMessage} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm mb-4 sm:mb-0 sm:mr-4" disabled={isSendButtonDisabled} style="opacity: {isSendButtonDisabled ? 0.5 : 1}">
          <i class="ri-message-line mr-1"></i> {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        <button on:click={handleLeaveRoom} class="bg-red-500 text-white py-2 px-6 rounded transition duration-300 hover:bg-red-600 text-sm" disabled={isLeaveButtonDisabled} style="opacity: {isLeaveButtonDisabled ? 0.5 : 1}">
          <i class="ri-logout-box-line mr-1"></i> Leave Room
        </button>
      </div>

      {#if error}
        <p class="mt-4 text-red-500 text-sm">{error}</p>
        <button on:click={() => goto('/')} class="text-red-500 text-sm underline">Go back to home</button>
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

