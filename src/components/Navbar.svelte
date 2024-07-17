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
          <i class="ri-menu-line text-xl mr-5 md:mr-0 lg:mr-0"></i>
        </button>
        {#if isOpen}
          <button class="fixed inset-0 bg-black bg-opacity-40 z-40" on:click={closeMenu} aria-label="Close menu"></button>
          <div class="absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-50 mr-5 md:mr-0 lg:mr-0">
            <div class="py-2">
              <a href="/" class="block px-4 py-2 text-sm text-gray-600 hover:text-black"><i class="ri-home-4-line mr-1"></i> Home</a>
              <a href="https://github.com/k9crypt" class="block px-4 py-2 text-sm text-gray-600 hover:text-black"><i class="ri-github-fill mr-1"></i> Github</a>
              <a href="/create" class="block px-4 py-2 text-sm text-gray-600 hover:text-black"><i class="ri-message-3-line mr-1"></i> Create</a>
              <a href="/privacy" class="block px-4 py-2 text-sm text-gray-600 hover:text-black"><i class="ri-lock-2-line mr-1"></i> Privacy</a>
              <hr class="border-t border-gray-300/30">
              <a href="mailto:hi@k9crypt.xyz" class="block px-4 py-2 text-sm text-gray-600 hover:text-black"><i class="ri-mail-line mr-1"></i> hi@k9crypt.xyz</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>
