<script>
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    isOpen = false;
    document.body.style.overflow = '';
  }
</script>

<nav>
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <img src="https://www.upload.ee/image/16796529/k9crypt__1_.png" alt="K9Crypt Logo" class="h-8 w-8 mr-2">
        <span class="font-semibold text-gray-800 text-lg">K9Crypt</span>
      </div>
      <div class="relative">
        <button on:click={toggleMenu} class="text-gray-600 focus:outline-none">
          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        {#if isOpen}
          <button class="fixed inset-0 bg-black bg-opacity-20 z-40" on:click={closeMenu} aria-label="Close menu"></button>
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50">
            <div class="py-2">
              <a href="/" class="block px-4 py-2 text-sm text-gray-600 hover:text-black">Home</a>
              <a href="https://github.com/k9crypt" class="block px-4 py-2 text-sm text-gray-600 hover:text-black">Github</a>
              <a href="/create" class="block px-4 py-2 text-sm text-gray-600 hover:text-black">Create</a>
              <a href="/privacy" class="block px-4 py-2 text-sm text-gray-600 hover:text-black">Privacy</a>
              <hr class="border-t border-gray-300">
              <a href="mailto:hi@k9crypt.xyz" class="block px-4 py-2 text-sm text-gray-600 hover:text-black">hi@k9crypt.xyz</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>