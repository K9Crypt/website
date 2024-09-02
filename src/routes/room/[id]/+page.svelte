<script lang="ts">
  import { page } from '$app/stores';
  import { leaveRoom, joinRoom, checkRoom } from '$lib/room';
  import { sendMessage, getMessages } from '$lib/message';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { checkLink } from '$lib/check';
  import { goto } from '$app/navigation';
  import Error from '../../../components/Error.svelte';

  let userId: string = '';
  let message: string = '';
  let isLoading: boolean = false;
  let error: string = '';
  let messages: Array<{ userId: any; sender: string, message: string, id: string }> = [];
  let status: boolean = false;
  let isPageLoading: boolean = true;
  let pollingInterval: NodeJS.Timeout;
  let replyingTo: { message: string } | null = null;
  let roomType: string = '';
  let roomPassword: string = '';
  let isPasswordRequired: boolean = false;
  let hasJoinedRoom: boolean = false;
  let roomUsers: string[] = [];
  let filteredUsers: string[] = [];
  let showUserDropdown: boolean = false;
  let userDropdownIndex: number = -1;

  async function copyRoomId() {
    await navigator.clipboard.writeText(roomId);
    toast.success('Room ID copied to clipboard', { duration: 3000, position: 'top-right' });
  }

  async function copyMessage(msg: string) {
    await navigator.clipboard.writeText(msg);
    toast.success('Message copied to clipboard', { duration: 3000, position: 'top-right' });
  }

  async function loadRoomData() {
    try {
      const newMessages = await getMessages(roomId);
      if (JSON.stringify(newMessages) !== JSON.stringify(messages)) {
        messages = newMessages.map((msg, index) => ({ ...msg, id: `msg-${index}` }));
      }
    } catch (err) {
      error = 'Failed to load room data';
      toast.error(error);
    }
  }

  function startPolling() {
    pollingInterval = setInterval(loadRoomData, 5000);
  }

  function handleReply(msg: { message: string }) {
    if (replyingTo) {
      cancelReply();
    }
    replyingTo = msg;
    message = ``;
    setTimeout(() => document.getElementById('message-input')?.focus(), 0);
  }

  function cancelReply() {
    replyingTo = null;
  }

  onMount(async () => {
    status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
    userId = localStorage.getItem('userId') || '';
    hasJoinedRoom = localStorage.getItem('hasJoinedRoom') === 'true';

    if (!userId) {
      error = `Please enter a User ID.`;
      toast.error(error);
      isPageLoading = false;
      return;
    }

    try {
      const roomDetails = await checkRoom(roomId);
      roomType = roomDetails.type;
      roomUsers = roomDetails.users;

      if (roomType === 'private' && !hasJoinedRoom) {
        isPasswordRequired = true;
        isPageLoading = false;
        return;
      }

      hasJoinedRoom = true;
      localStorage.setItem('hasJoinedRoom', 'true');

      await loadRoomData();
      startPolling();
    } catch (err) {
      error = 'Failed to load room data';
      toast.error(error);
    } finally {
      isPageLoading = false;
    }
  });

  onDestroy(() => {
    if (pollingInterval) clearInterval(pollingInterval);
  });

  let isSendButtonDisabled: boolean = false;
  let isLeaveButtonDisabled: boolean = false;

  $: roomId = $page.params.id;
  $: isSendButtonDisabled = isLoading || !message.trim();
  $: isLeaveButtonDisabled = isLoading;

  async function handleSendMessage() {
    if (isSendButtonDisabled) return;

    isLoading = true;
    try {
      const fullMessage = replyingTo
        ? `Replying to "${replyingTo.message}": \n\n${message}`
        : message;
      await sendMessage(roomId, userId, fullMessage);
      message = '';
      replyingTo = null;
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
      sendMessage(roomId, "System", `${userId} has left the room.`);
      toast.success('Left the room successfully', { duration: 3000, position: 'top-right' });
      localStorage.removeItem('hasJoinedRoom');
      goto('/create');
    } catch (err) {
      error = 'Failed to leave room';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }

  async function handlePasswordSubmit() {
    isLoading = true;
    try {
      const result = await joinRoom(roomId, userId, roomPassword);
      toast.success(result, { duration: 3000, position: 'top-right' });
      isPasswordRequired = false;
      hasJoinedRoom = true;
      localStorage.setItem('hasJoinedRoom', 'true');
      error = '';
      roomPassword = '';
      await loadRoomData();
      startPolling();
    } catch (err) {
      hasJoinedRoom = false;
      error = 'Invalid password';
      toast.error(error);
    } finally {
      isLoading = false;
    }
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    message = input.value;
    const lastWord = message.split(/\s/).pop() || '';
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      const searchTerm = lastWord.slice(1).toLowerCase();
      filteredUsers = roomUsers.filter(user => 
        user.toLowerCase().startsWith(searchTerm) && user.toLowerCase() !== 'system'
      );
      showUserDropdown = filteredUsers.length > 0;
    } else {
      showUserDropdown = false;
      filteredUsers = [];
    }
  }

  function selectUser(user: string) {
    if (user.toLowerCase() === 'system') {
      toast.error('You cannot mention the System user.', { duration: 3000, position: 'top-right' });
      showUserDropdown = false;
      userDropdownIndex = -1;
      return;
    }
    const words = message.split(/\s/);
    words[words.length - 1] = `@${user} `;
    message = words.join(' ');
    showUserDropdown = false;
    userDropdownIndex = -1;
    setTimeout(() => {
      const input = document.getElementById('message-input') as HTMLTextAreaElement;
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);
    }, 0);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (showUserDropdown) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        userDropdownIndex = (userDropdownIndex + 1) % filteredUsers.length;
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        userDropdownIndex = (userDropdownIndex - 1 + filteredUsers.length) % filteredUsers.length;
      } else if (event.key === 'Enter' && userDropdownIndex !== -1) {
        event.preventDefault();
        selectUser(filteredUsers[userDropdownIndex]);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        showUserDropdown = false;
        userDropdownIndex = -1;
      } else if (event.key === 'Tab') {
        event.preventDefault();
        if (userDropdownIndex === -1 && filteredUsers.length > 0) {
          selectUser(filteredUsers[0]);
        } else if (userDropdownIndex !== -1) {
          selectUser(filteredUsers[userDropdownIndex]);
        }
      }
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
{:else if error === 'Please enter a User ID.'}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <div class="bg-red-100 p-3 rounded-full">
        <p class="text-center text-red-600">Please enter a User ID. Go to <a href="/join/room" class="underline">Join Room</a></p>
    </div>
  </div>
</section>
{:else if isPasswordRequired && !hasJoinedRoom}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <div class="p-3 rounded-lg">
      <p class="mb-2 text-sm">Enter a room password.</p>
      <input bind:value={roomPassword} type="password" placeholder="Room Password" class="w-full mb-4 p-2 border-2 border-dark-green rounded-lg focus:outline-none" />
      <button on:click={handlePasswordSubmit} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg disabled:opacity-50 w-full" disabled={isLoading || !roomPassword} style="opacity: {isLoading || !roomPassword ? 0.5 : 1}">
        <i class="ri-lock-line mr-1"></i> Submit Password
      </button>
      {#if error === 'Invalid password'}
      <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}
    </div>
  </div>
</section>
{:else if status}
<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
    <div>
      <h3 class="text-xl font-semibold mb-2">Messages</h3>
      <div>
        <p class="text-xs">Room ID: <button on:click={copyRoomId} class="underline">{roomId}</button></p>
      </div>
      <hr class="mb-2 mt-2" />
      <ul class="mb-4 max-h-[calc(100vh-250px)] sm:max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-350px)] lg:max-h-[calc(100vh-400px)] xl:max-h-[calc(100vh-450px)] overflow-y-auto">
        {#each messages as msg (msg.id)}
          <li class="mb-4 p-3 bg-gray-50 rounded-lg relative group">
            {#if msg.userId === "System"}
            <strong class="mr-1 text-red-500"><i class="ri-information-line"></i> {msg.userId}</strong>
            {:else}
            <strong>{msg.userId}:</strong>
            {/if}
            <p>
              {#each msg.message.split(/(\s+)/) as part}
                {#if part.trim().startsWith('@') && part.trim().length > 1}
                <span class="bg-light-green p-1 rounded">{part}</span>
                {:else if part.trim().startsWith('http://') || part.trim().startsWith('https://')}
                <a href={part.trim()} target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">
                  {part}
                </a>
                {:else}
                {part || '[Empty Message]'}
                {/if}
              {/each}
            </p>
            <div class="flex justify-end mt-2 space-x-2 md:hidden">
              <button on:click={() => handleReply(msg)} class="text-sm text-dark-green/70">
                <i class="ri-reply-line"></i> Reply
              </button>
              <button on:click={() => copyMessage(msg.message)} class="text-sm text-dark-green/70">
                <i class="ri-file-copy-line"></i> Copy
              </button>
            </div>
            <div class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
              <button on:click={() => handleReply(msg)} class="text-sm text-dark-green/70 mr-2">
                <i class="ri-reply-line"></i> Reply
              </button>
              <button on:click={() => copyMessage(msg.message)} class="text-sm text-dark-green/70">
                <i class="ri-file-copy-line"></i> Copy
              </button>
            </div>
          </li>
        {/each}
      </ul>
      {#if replyingTo}
      <div class="mb-2 p-3 border-l-2 border-gray-500 bg-gray-50 rounded-lg flex justify-between items-center">
        <p class="text-sm">
          Replying to: "{replyingTo.message.substring(0, 50)}..."
        </p>
        <button on:click={cancelReply} class="text-sm text-red-500">
          <i class="ri-close-line"></i> Cancel
        </button>
      </div>
      {/if}
      <div class="relative">
        <textarea id="message-input" bind:value={message} placeholder="Tag a user with @ or send a normal message..." class="w-full mb-4 p-2 rounded-lg border border-dark-green focus:outline-none" rows="4" on:input={handleInput} on:keydown={handleKeyDown}></textarea>
        {#if showUserDropdown}
        <div class="absolute z-10 w-full bg-white border border-dark-green rounded-lg shadow-lg max-h-40 overflow-y-auto">
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          {#each filteredUsers as user, index}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class="px-4 py-2 cursor-pointer hover:bg-gray-50 {userDropdownIndex === index ? 'bg-gray-50' : ''}" on:click={() => selectUser(user)} on:mouseenter={() => userDropdownIndex = index}>
              {user}
            </div>
          {/each}
        </div>
        {/if}
      </div>
      <div class="flex flex-col sm:flex-row sm:justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <button on:click={handleSendMessage} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg disabled:opacity-50 w-full sm:w-auto" disabled={isSendButtonDisabled} style="opacity: {isSendButtonDisabled ? 0.5 : 1}">
          <i class="ri-message-line mr-1"></i> {isLoading ? 'Sending...' : 'Send Message'}
        </button>
        <button on:click={handleLeaveRoom} class="bg-red-500 px-6 py-2 border-2 border-red-500 rounded-lg disabled:opacity-50 text-white w-full sm:w-auto" disabled={isLeaveButtonDisabled} style="opacity: {isLeaveButtonDisabled ? 0.5 : 1}">
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
<Error />
{/if}