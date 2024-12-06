<script>
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import { quintOut } from 'svelte/easing';
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
        { href: "/updates", label: "Updates", icon: "ri-history-line" },
    ];

    const socialLinks = [
        { href: "https://github.com/k9crypt", icon: "ri-github-fill", label: "GitHub" },
        { href: "https://x.com/k9crypt", icon: "ri-twitter-x-fill", label: "Twitter" },
        { href: "https://discord.gg/8jyeQV7Wyd", icon: "ri-discord-fill", label: "Discord" },
        { href: "https://www.linkedin.com/company/k9crypt", icon: "ri-linkedin-fill", label: "LinkedIn" }
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
            {#each Array(4) as _}
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
            {#each Array(4) as _}
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
<div class="fixed inset-0 bg-[#121212] flex flex-col items-center justify-between z-[100] pb-12 pt-16" transition:fade={{ duration: 300, easing: quintOut }} on:click|self={toggleMenu}>
    <div class="absolute top-4 right-4 z-[101]" transition:fly={{ x: 20, duration: 500, easing: quintOut }}>
        <button class="text-white" on:click={toggleMenu}>
            <i class="ri-close-line text-2xl"></i>
        </button>
    </div>

    <div></div>

    <div class="flex flex-col space-y-4 relative z-[101]" transition:fly={{ y: -20, duration: 500, easing: quintOut }}>
        {#each menuItems as item, index}
        <a href={item.href} class="text-white text-2xl text-center hover:text-cYellow transition-all duration-300 opacity-0 animate-fadeIn" style="animation-delay: {index * 100}ms; animation-fill-mode: forwards;" on:click={toggleMenu}>
            {item.label}
        </a>
        {/each}
    </div>

    <div class="flex justify-center space-x-4 relative z-[50]" transition:fly={{ y: 20, duration: 500, easing: quintOut }}>
        {#each socialLinks as link, index}
        <a href={link.href} class="text-white text-xl hover:text-cYellow transition-all duration-300 opacity-0 animate-fadeIn bg-cWhiteGray py-1.5 px-2.5 rounded" style="animation-delay: {(menuItems.length + index) * 100}ms; animation-fill-mode: forwards;">
            <i class="{link.icon}"></i>
        </a>
        {/each}
    </div>
</div>
{/if}

<style>
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.5s ease-out;
    }
</style>