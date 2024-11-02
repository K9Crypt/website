<script>
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    
    let isLoaded = false;
    let isMenuOpen = false;
    
    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }
</script>

<nav class="px-8 py-4 flex items-center justify-between">
    <div class="flex items-center space-x-8">
        {#if isLoaded}
        <img src="https://www.upload.ee/image/17339414/k9crypt-rb.png" alt="Logo" class="w-10 h-10" transition:fade={{ duration: 300 }}/>
        {:else}
        <div class="w-10 h-10 bg-cWhiteGray rounded animate-pulse"></div>
        {/if}

        {#if isLoaded}
        <div class="hidden md:flex space-x-6 text-white/50">
            <a href="/" class="relative px-3 py-1 text-white/100">
                <span class="relative z-10">Home</span>
                <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cYellow/10 to-transparent" transition:fade={{ duration: 800, delay: 200 }}></span>
                <span class="absolute left-0 bottom-0 w-full h-0.5 bg-cYellow" transition:fade={{ duration: 800, delay: 200 }}></span>
            </a>
            <a href="/about" class="relative px-3 py-1 group hover:text-white/100 transition-all duration-300">
                <span class="relative z-10">About</span>
            </a>
            <a href="/blog" class="relative px-3 py-1 group hover:text-white/100 transition-all duration-300">
                <span class="relative z-10">Blog</span>
            </a>
            <a href="/contact" class="relative px-3 py-1 group hover:text-white/100 transition-all duration-300">
                <span class="relative z-10">Support</span>
            </a>
        </div>
        {:else}
        <div class="hidden md:flex space-x-6 text-white/50 animate-pulse">
            <div class="h-6 bg-cWhiteGray rounded w-24"></div>
            <div class="h-6 bg-cWhiteGray rounded w-20"></div>
            <div class="h-6 bg-cWhiteGray rounded w-20"></div>
            <div class="h-6 bg-cWhiteGray rounded w-24"></div>
        </div>
        {/if}
    </div>

    <div class="flex items-center space-x-2 text-white/50">
        {#if isLoaded}
        <div class="hidden md:flex space-x-2">
            <a href="https://github.com/k9crypt"><i class="ri-github-fill p-2.5 bg-cWhiteGray rounded hover:text-white/100 transition-all duration-300 cursor-pointer"></i></a>
            <a href="https://x.com/k9crypt"><i class="ri-twitter-x-fill p-2.5 bg-cWhiteGray rounded hover:text-white/100 transition-all duration-300 cursor-pointer"></i></a>
            <a href="https://discord.gg/8jyeQV7Wyd"><i class="ri-discord-fill p-2.5 bg-cWhiteGray rounded hover:text-white/100 transition-all duration-300 cursor-pointer"></i></a>
        </div>
        {:else}
        <div class="hidden md:flex space-x-2 animate-pulse">
            <div class="h-10 w-10 bg-cWhiteGray rounded"></div>
            <div class="h-10 w-10 bg-cWhiteGray rounded"></div>
            <div class="h-10 w-10 bg-cWhiteGray rounded"></div>
        </div>
        {/if}

        <!-- svelte-ignore a11y_consider_explicit_label -->
        {#if isLoaded}
        <button class="md:hidden px-2 py-1 bg-cWhiteGray rounded" on:click={toggleMenu}>
            <i class="ri-menu-fill text-white/50 hover:text-white/100 transition-all duration-300"></i>
        </button>
        {:else}
        <div class="md:hidden w-8 h-8 bg-cWhiteGray rounded animate-pulse"></div>
        {/if}

    </div>
</nav>

{#if isMenuOpen}
<div class="fixed inset-0 bg-black/70 z-40" transition:fade={{ duration: 300 }} on:click={toggleMenu}></div>

<div class="fixed bottom-0 left-0 right-0 bg-cWhiteGray py-5 md:hidden px-5 rounded-t-3xl z-50" transition:slide={{ duration: 500 }}>
    {#if isLoaded}
    <a href="/" class="flex justify-between items-center w-full py-2">
        <span>Home</span>
        <i class="ri-arrow-right-s-fill"></i>
    </a>
    <a href="/about" class="flex justify-between items-center w-full py-2">
        <span>About</span>
        <i class="ri-arrow-right-s-fill"></i>
    </a>
    <a href="/blog" class="flex justify-between items-center w-full py-2">
        <span>Blog</span>
        <i class="ri-arrow-right-s-fill"></i>
    </a>
    <a href="/contact" class="flex justify-between items-center w-full py-2">
        <span>Support</span>
        <i class="ri-arrow-right-s-fill"></i>
    </a>
    {:else}
    <div class="space-y-2 animate-pulse">
        <div class="h-10 w-full bg-cWhiteGray rounded"></div>
        <div class="h-10 w-full bg-cWhiteGray rounded"></div>
        <div class="h-10 w-full bg-cWhiteGray rounded"></div>
        <div class="h-10 w-full bg-cWhiteGray rounded"></div>
    </div>
    {/if}
</div>
{/if}
