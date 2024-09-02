<script lang="ts">
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { fetchAllNotifications } from "$lib/notifications";

  let isOpen = false;
  let notifications: any[] = [];
  let showNotifications = false;

  onMount(async () => {
    const updateNotifications = async () => {
      notifications = await fetchAllNotifications();
      setTimeout(updateNotifications, 1000);
    };
    updateNotifications();
  });

  function toggleNotifications() {
    showNotifications = !showNotifications;
  }

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
        <img src="https://www.upload.ee/image/16942775/k9crypt.png" alt="K9Crypt Logo" class="h-8 w-8 mr-2">
        <span class="font-semibold text-lg">K9Crypt</span>
      </div>
      <div class="hidden md:flex space-x-4 text-sm">
        <a href="/"><i class="ri-home-4-line mr-1"></i> Home</a>
        <a href="/create"><i class="ri-message-3-line mr-1"></i> Create</a>
        <a href="https://github.com/k9crypt"><i class="ri-github-line mr-1"></i> Github</a>
        <a href="https://twitter.com/k9crypt"><i class="ri-twitter-line mr-1"></i> Twitter</a>
        <div class="relative">
          <button on:click={toggleNotifications} class="focus:outline-none group">
            <i class="ri-notification-line mr-1"></i>
            <span class="text-sm">{notifications.length}</span>
          </button>
          {#if showNotifications}
            <div class="absolute top-full right-0 mt-2 w-64 bg-white border-2 border-dark-green rounded-lg shadow-lg z-50" in:fly={{ y: 10 }}>
              <div class="py-2 text-sm">
                {#each notifications as notification}
                  <a href="/notification/{notification.id}" class="block px-4 py-2 border-b border-dark-green last:border-b-0">
                    <p class="font-semibold mb-1">
                      {notification.title.length > 20
                        ? notification.title.slice(0, 20) + '...'
                        : notification.title}
                    </p>
                    <p>
                      {@html notification.description.length > 50
                        ? notification.description.slice(0, 50) + '...'
                        : notification.description}
                    </p>
                  </a>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
      <div class="md:hidden relative">
        <button on:click={toggleMenu} class="focus:outline-none">
          <i class="ri-menu-line text-xl"></i>
        </button>
        {#if isOpen}
          <button class="fixed inset-0 bg-black bg-opacity-40 z-40" on:click={closeMenu} aria-label="Close menu"></button>
          <div class="fixed inset-y-0 right-0 w-64 bg-white shadow-lg z-50 px-4" in:fly={{ x: 200 }} out:fly={{ x: 200 }}>
            <div class="flex justify-end p-4">
              <button on:click={closeMenu} class="focus:outline-none">
                <i class="ri-close-line text-xl"></i>
              </button>
            </div>
            <div class="py-2 text-sm">
              <a href="/" class="block px-4 py-2"><i class="ri-home-4-line mr-1"></i> Home</a>
              <a href="/create" class="block px-4 py-2"><i class="ri-message-3-line mr-1"></i> Create</a>
              <a href="https://github.com/k9crypt" class="block px-4 py-2"><i class="ri-github-fill mr-1"></i> Github</a>
              <a href="https://twitter.com/k9crypt" class="block px-4 py-2"><i class="ri-twitter-fill mr-1"></i> Twitter</a>
              <button on:click={toggleNotifications} class="block px-4 py-2">
                <i class="ri-notification-line mr-1"></i>
                <span class="text-sm">{notifications.length}</span>
              </button>
              {#if showNotifications}
                <div class="mt-2 w-full bg-white border-2 border-dark-green rounded-lg shadow-lg px-4 mb-4" transition:fly={{ y: 10 }}>
                  <div class="py-2 text-sm">
                    {#each notifications as notification}
                      <a href="/notification/{notification.id}" class="block py-2 border-b border-dark-green last:border-b-0">
                        <p class="font-semibold mb-1">
                          {notification.title.length > 20
                            ? notification.title.slice(0, 20) + '...'
                            : notification.title}
                        </p>
                        <p>
                          {@html notification.description.length > 50
                            ? notification.description.slice(0, 50) + '...'
                            : notification.description}
                        </p>
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}
              <hr class="border-t border-gray-300/30">
              <a href="mailto:hi@k9crypt.xyz" class="block px-4 py-2 text-sm"><i class="ri-mail-line mr-1"></i> hi@k9crypt.xyz</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>
