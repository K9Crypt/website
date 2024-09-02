<script lang="ts">
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { fetchAllNotifications } from "$lib/notifications";

  let isOpen = false;
  let notifications: any[] = [];
  let showNotifications = false;
  let showSettings = false;
  let isDarkMode = false;

  onMount(() => {
    const updateNotifications = async () => {
      notifications = await fetchAllNotifications();
      setTimeout(updateNotifications, 1000);
    };
    updateNotifications();

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      isDarkMode = true;
      document.documentElement.classList.add('dark');
    }

    document.addEventListener('click', handleOutSideClick);

    return () => {
      document.removeEventListener('click', handleOutSideClick);
    };
  });

  function handleOutSideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.notifications-menu') && !target.closest('.settings-menu')) {
      showNotifications = false;
      showSettings = false;
    }
  }

  function toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    showNotifications = !showNotifications;
    showSettings = false;
  }

  function toggleSettings(event: MouseEvent) {
    event.stopPropagation();
    showSettings = !showSettings;
    showNotifications = false;
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

  function toggleTheme() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
</script>

<nav>
  <div class="max-w-6xl mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <div class="flex items-center">
        <h1 class="font-semibold text-lg">K9Crypt</h1>
        <div class="ml-2 px-2 py-1 text-xs bg-light-green text-[#090f00] rounded-lg uppercase">Beta</div>
      </div>
      <div class="hidden md:flex space-x-4 text-sm">
        <a href="/"><i class="ri-home-4-fill mr-1"></i> Home</a>
        <a href="/create"><i class="ri-message-3-fill mr-1"></i> Create</a>
        <a href="https://github.com/k9crypt"><i class="ri-github-fill mr-1"></i> Github</a>
        <a href="https://twitter.com/k9crypt"><i class="ri-twitter-fill mr-1"></i> Twitter</a>
        <div class="relative notifications-menu">
          <button on:click={toggleNotifications} class="focus:outline-none group">
            <i class="ri-notification-fill mr-1"></i>
            <span class="text-sm">{notifications.length}</span>
          </button>
          {#if showNotifications}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#131313] border-2 border-dark-green dark:border-[#fafafa] rounded-lg shadow-lg z-50" in:fly={{ y: 10 }} on:click|stopPropagation>
              <div class="py-2 text-sm">
                {#each notifications as notification}
                  <a href="/notification/{notification.id}" class="block px-4 py-2 last:border-b-0">
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
        <div class="relative settings-menu">
          <button on:click={toggleSettings} class="focus:outline-none group">
            <i class="ri-settings-3-fill mr-1"></i>
          </button>
          {#if showSettings}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-[#131313] border-2 border-dark-green dark:border-[#fafafa] rounded-lg shadow-lg z-50" in:fly={{ y: 10 }} on:click|stopPropagation>
              <div class="py-2 text-sm">
                <div class="px-4">
                  <p class="text-xs uppercase dark:text-[#fafafa] font-semibold py-1 mb-1">Theme</p>
                  <button on:click={toggleTheme} class="flex items-center text-sm w-full mb-1">
                    {#if isDarkMode}
                      <i class="ri-sun-line mr-2"></i>
                      Light Mode
                    {:else}
                      <i class="ri-moon-line mr-2"></i>
                      Dark Mode
                    {/if}
                  </button>
                </div>
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
          <div class="fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#131313] shadow-lg z-50 px-4" in:fly={{ x: 200 }} out:fly={{ x: 200 }}>
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
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="mt-2 w-full bg-white dark:bg-[#131313] border-2 border-dark-green dark:border-[#fafafa] rounded-lg shadow-lg px-4 mb-4" in:fly={{ y: 10 }} out:fly={{ y: 10 }} on:click|stopPropagation>
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
              <button on:click={toggleSettings} class="block px-4 py-2">
                <i class="ri-settings-3-line mr-1"></i> Settings
              </button>
              {#if showSettings}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="mt-2 w-full bg-white dark:bg-[#131313] border-2 border-dark-green dark:border-[#fafafa] rounded-lg shadow-lg px-4 mb-4" in:fly={{ y: 10 }} out:fly={{ y: 10 }} on:click|stopPropagation>
                  <div class="py-2 text-sm">
                    <button on:click={toggleTheme} class="block px-4 py-2">
                      <i class="ri-moon-line mr-1"></i> 
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </div>
                </div>
              {/if}
              <hr class="border-t border-gray-300/30">
              <a href="mailto:hi@k9crypt.xyz" class="block px-4 py-2 text-sm hover:text-white/70 hover:underline"><i class="ri-mail-fill mr-1"></i> hi@k9crypt.xyz</a>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>