<script>
  import { goto } from "$app/navigation";
</script>

<header class="flex flex-col items-center justify-center py-28">
  <div class="max-w-4xl mx-auto px-4 text-center">
    <h1 class="text-5xl font-bold mb-6">Your Messages, Only Yours!</h1>
    <p class="text-lg mb-6">Securely share your thoughts with the world, knowing that your messages are only accessible to you.</p>
  </div>
  <div class="flex justify-center space-x-4">
    <button on:click={() => goto("/create")} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg">Get Started</button>
    <button on:click={() => goto("/support")} class="px-6 py-2 border-2 border-dark-green rounded-lg">Support</button>
  </div>
</header>
