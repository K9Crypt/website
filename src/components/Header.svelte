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
  <button on:click={() => goto('/create')} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm">
    <i class="ri-message-3-fill mr-1"></i> Create Message
  </button>
  <div class="relative inline-block">
    <span class="absolute -top-4 left-1/2 transform -translate-x-1/2 text-[0.60rem] font-bold text-white bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600 p-1 px-3 rounded">
      NEW
    </span>
    <button on:click={() => goto('/create/room')} class="bg-gray-300 py-2 px-6 rounded text-sm">
      <i class="ri-ancient-gate-fill"></i> Create Room
    </button>
  </div>
</header>