<script>
    import { onMount } from "svelte";
    import { fade, slide } from "svelte/transition";
    import { page } from "$app/stores";
    
    let isLoaded = false;
    let isMenuOpen = false;
    let currentPath;
    
    $: currentPath = $page.url.pathname;
    
    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    const menuItems = [
        { href: "/", label: "Home", icon: "ri-home-5-line" },
        { href: "/about", label: "About", icon: "ri-information-line" },
        { href: "/blog", label: "Blog", icon: "ri-article-line" },
        { href: "/contact", label: "Support", icon: "ri-customer-service-line" },
    ];

    const socialLinks = [
        { href: "https://github.com/k9crypt", icon: "ri-github-fill", label: "GitHub" },
        { href: "https://x.com/k9crypt", icon: "ri-twitter-x-fill", label: "Twitter" },
        { href: "https://discord.gg/8jyeQV7Wyd", icon: "ri-discord-fill", label: "Discord" }
    ];
</script>

<nav class="px-8 py-4 flex items-center justify-between relative z-50">
    <div class="flex items-center space-x-8">
        {#if isLoaded}
        <a href="/"><img src="https://www.upload.ee/image/17339414/k9crypt-rb.png" alt="Logo" class="w-10 h-10" transition:fade={{ duration: 300 }}/></a>
        {:else}
        <div class="w-10 h-10 bg-cWhiteGray rounded animate-pulse"></div>
        {/if}

        {#if isLoaded}
        <div class="hidden md:flex space-x-6 text-white/50">
            {#each menuItems as item}
            <a href={item.href} class="relative px-3 py-1 group hover:text-white/100 transition-all duration-300 {item.href === currentPath ? 'text-white/100' : ''}">
                <span class="relative z-10">{item.label}</span>
                {#if item.href === currentPath}
                <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cYellow/10 to-transparent" transition:fade={{ duration: 800, delay: 200 }}></span>
                <span class="absolute left-0 bottom-0 w-full h-0.5 bg-cYellow" transition:fade={{ duration: 800, delay: 200 }}></span>
                {/if}
            </a>
            {/each}
        </div>
        {:else}
        <div class="hidden md:flex space-x-6 text-white/50 animate-pulse">
            {#each Array(5) as _}
            <div class="h-6 bg-cWhiteGray rounded w-24"></div>
            {/each}
        </div>
        {/if}
    </div>

    <div class="flex items-center space-x-2 text-white/50">
        {#if isLoaded}
        <div class="hidden md:flex space-x-2">
            {#each socialLinks as link}
            <a href={link.href} class="group">
                <i class="{link.icon} p-2.5 bg-cWhiteGray rounded group-hover:text-white/100 transition-all duration-300 cursor-pointer"></i>
            </a>
            {/each}
        </div>
        {:else}
        <div class="hidden md:flex space-x-2 animate-pulse">
            {#each Array(3) as _}
            <div class="h-10 w-10 bg-cWhiteGray rounded"></div>
            {/each}
        </div>
        {/if}

        {#if isLoaded}
        <button class="md:hidden w-10 h-10 flex items-center justify-center bg-cWhiteGray rounded" on:click={toggleMenu}>
            <i class="ri-menu-4-line text-lg text-white/50 hover:text-white/100 transition-all duration-300"></i>
        </button>
        {:else}
        <div class="md:hidden w-10 h-10 bg-cWhiteGray rounded animate-pulse"></div>
        {/if}
    </div>
</nav>

{#if isMenuOpen}
<div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-40" transition:fade={{ duration: 300 }} on:click={toggleMenu}></div>

<div class="fixed inset-y-0 right-0 w-64 bg-cWhiteGray z-50 md:hidden" transition:slide={{ duration: 300, axis: 'x' }}>
    <div class="flex flex-col h-full">
        <div class="flex items-center justify-between p-6 border-b border-white/5">
            <span class="text-lg font-medium">Menu</span>
            <button class="w-8 h-8 flex items-center justify-center rounded hover:bg-white/5 transition-all duration-300" on:click={toggleMenu}>
                <i class="ri-close-line text-lg"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto py-6">
            <div class="px-3 space-y-1">
                {#each menuItems as item}
                <a href={item.href} class="flex items-center gap-3 px-3 py-2 rounded text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300 {item.href === currentPath ? 'text-white bg-white/5' : ''}" on:click={toggleMenu}>
                    <i class="{item.icon} text-lg"></i>
                    <span>{item.label}</span>
                </a>
                {/each}
            </div>
        </div>

        <div class="p-6 border-t border-white/5">
            <div class="flex justify-center gap-4">
                {#each socialLinks as link}
                <a href={link.href} class="w-10 h-10 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-all duration-300" title={link.label}>
                    <i class="{link.icon} text-lg"></i>
                </a>
                {/each}
            </div>
        </div>
    </div>
</div>
{/if}
