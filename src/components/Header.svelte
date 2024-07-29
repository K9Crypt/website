<script>
  import { goto } from "$app/navigation";
</script>

<header class="max-w-4xl mx-auto px-4 py-12 text-center">
  <h1 class="text-3xl font-bold text-gray-800 mb-3">K9Crypt</h1>
  <p class="text-lg text-gray-600 mb-2">Secure and Anonymous Messaging Platform</p>
  <p class="text-gray-700 mb-6 max-w-xl mx-auto">
    Create and share encrypted messages without an account. 
    All messages are automatically deleted every 2 hours for your security.
  </p>
  <div class="flex flex-col md:flex-row justify-center gap-4">
    <button on:click={() => goto('/create')} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm">
      <i class="ri-message-3-fill mr-1"></i> Create Message
    </button>
    <button on:click={() => goto('/create/room')} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm">
      <i class="ri-add-fill mr-1"></i> Create Room
    </button>
    <button on:click={() => goto('/join/room')} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm">
      <i class="ri-door-fill mr-1"></i> Join Room
    </button>
  </div>
</header>
