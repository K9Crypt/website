<script>
    import { onMount } from "svelte";
    import { fade, fly, slide } from "svelte/transition";
    import { quintOut } from 'svelte/easing';
    import { page } from "$app/stores";
    import { _, locale } from "svelte-i18n";
    
    let isMenuOpen = false;
    let currentPath;
    
    $: currentPath = $page.url.pathname;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    const menuItems = [
        { href: "/", label: $_('nav.home') },
        { href: "/about", label: $_('nav.about') },
        { href: "/blog", label: $_('nav.blog') },
        { href: "/updates", label: $_('nav.updates') },
        {
            label: $_('nav.products.title'),
            isDropdown: true,
            items: [
                { href: "/products/k9shield", label: $_('nav.products.k9shield') },
                { href: "/products/k9vault", label: $_('nav.products.k9vault') }
            ]
        },
        {
            label: $_('nav.actions.title'),
            isDropdown: true,
            items: [
                { href: "/create/room", label: $_('nav.actions.createRoom') },
                { href: "/join/room", label: $_('nav.actions.joinRoom') },
                { href: "/create/message", label: $_('nav.actions.createMessage') },
                { href: "/view/message", label: $_('nav.actions.viewMessage') },
                { href: "/list", label: $_('nav.actions.listRooms') }
            ]
        }
    ];

    const languages = [
        { code: 'tr', name: 'Türkçe' },
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'ru', name: 'Русский' }
    ];

    function switchLanguage(langCode) {
        locale.set(langCode);
        localStorage.setItem('preferred-locale', langCode);
    }

    let activeDropdowns = {
        Products: false,
        Actions: false
    };

    function toggleDropdown(label) {
        activeDropdowns[label] = !activeDropdowns[label];
        Object.keys(activeDropdowns).forEach(key => {
            if (key !== label) {
                activeDropdowns[key] = false;
            }
        });
    }

    function handleClickOutside(event) {
        const target = event.target;
        if (!target.closest('.dropdown-container')) {
            Object.keys(activeDropdowns).forEach(key => {
                activeDropdowns[key] = false;
            });
        }
    }

    onMount(() => {
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    });

    const socialLinks = [
        { href: "https://github.com/k9crypt", icon: "ri-github-fill", label: "GitHub" },
        { href: "https://x.com/k9crypt", icon: "ri-twitter-x-fill", label: "Twitter" },
        { href: "https://discord.gg/8jyeQV7Wyd", icon: "ri-discord-fill", label: "Discord" },
        { href: "https://bsky.app/profile/k9crypt.bsky.social", icon: "ri-bluesky-fill", label: "Bluesky" },
        { href: "https://www.linkedin.com/company/k9crypt", icon: "ri-linkedin-fill", label: "LinkedIn" }
    ];
</script>

<nav class="px-8 py-4 flex items-center justify-between relative z-50">
    <div class="flex items-center space-x-8">
        <a href="/" class="relative">
            <div class="absolute inset-0 bg-cYellow/20 blur-lg rounded-full"></div>
            <img src="https://www.upload.ee/image/17339414/k9crypt-rb.png" alt="Logo" class="w-10 h-10 relative" transition:fade={{ duration: 300 }} />
        </a>

        <div class="hidden md:flex space-x-6 text-white/50">
            {#each menuItems as item}
                {#if item.isDropdown}
                    <div class="relative dropdown-container">
                        <button on:click={() => toggleDropdown(item.label)} class="flex items-center space-x-2 px-3 py-1 group hover:text-white/100 transition-all duration-300">
                            <span>{item.label}</span>
                            <i class="ri-arrow-down-s-line transition-transform duration-300 {activeDropdowns[item.label] ? 'rotate-180' : ''}"></i>
                        </button>
                                
                        {#if activeDropdowns[item.label]}
                            <div 
                                class="absolute top-full left-0 mt-2 w-48 bg-cWhiteGray border border-white/10 rounded-lg shadow-lg py-2.5 z-50" 
                                in:slide={{ duration: 200, delay: 0, axis: 'y' }} 
                                out:slide={{ duration: 200, axis: 'y' }} 
                                on:click|self={() => toggleDropdown(item.label)}
                            >
                                {#each item.items as subItem}
                                    <a href={subItem.href} class="flex items-center space-x-2 px-4 py-2.5 hover:text-white transition-all duration-300">
                                        <span>{subItem.label}</span>
                                    </a>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {:else}
                    <a href={item.href} class="relative px-3 py-1 group hover:text-white/100 transition-all duration-300 {item.href === currentPath ? 'text-white/100' : ''}">
                        <span>{item.label}</span>
                        {#if item.href === currentPath}
                            <span class="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-cYellow/10 to-transparent" transition:fade={{ duration: 800, delay: 200 }}></span>
                            <span class="absolute left-0 bottom-0 w-full h-0.5 bg-cYellow" transition:fade={{ duration: 800, delay: 200 }}></span>
                        {/if}
                    </a>
                {/if}
            {/each}
        </div>
    </div>

    <div class="flex items-center space-x-2 text-white/50">
        <div class="hidden md:flex items-center space-x-3">
            {#each socialLinks as link}
                <a 
                    href={link.href} 
                    class="group relative"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <div class="px-3 py-2 bg-cWhiteGray rounded-lg group-hover:bg-white/10 transition-all duration-300">
                        <i class="{link.icon} text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    </div>
                </a>
            {/each}

            <div class="relative dropdown-container ml-1">
                <button 
                    on:click={() => toggleDropdown('Language')} 
                    class="group relative flex items-center space-x-1.5 px-3 py-2 bg-cWhiteGray rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                    <i class="ri-global-line text-white/50 group-hover:text-white transition-all duration-300"></i>
                    <i class="ri-arrow-down-s-line text-white/50 group-hover:text-white transition-transform duration-300 {activeDropdowns['Language'] ? 'rotate-180' : ''}"></i>
                </button>
                
                {#if activeDropdowns['Language']}
                    <div 
                        class="absolute top-full right-0 mt-2 w-36 bg-cWhiteGray border border-white/10 rounded-lg shadow-lg overflow-hidden"
                        in:slide={{ duration: 200, delay: 0, axis: 'y' }}
                        out:slide={{ duration: 200, axis: 'y' }}
                    >
                        {#each languages as lang}
                            <button
                                on:click={() => {
                                    switchLanguage(lang.code);
                                    toggleDropdown('Language');
                                }}
                                class="w-full text-left px-4 py-2.5 text-white/50 hover:text-white transition-all duration-300 flex items-center space-x-2"
                            >
                                <span class="text-sm">{lang.name}</span>
                            </button>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>

        <button class="md:hidden w-10 h-10 flex items-center justify-center bg-cWhiteGray rounded-lg" on:click={toggleMenu}>
            <i class="ri-menu-4-line text-lg text-white/50 hover:text-white/100 transition-all duration-300"></i>
        </button>
    </div>
</nav>

{#if isMenuOpen}
    <div class="fixed inset-0 bg-black flex flex-col items-center justify-between z-[100] pb-12 pt-16 overflow-y-auto" transition:fade={{ duration: 400, easing: quintOut }} on:click|self={toggleMenu}>
        <div class="absolute top-6 right-6 z-[101]" transition:fly={{ x: 20, duration: 600, easing: quintOut }}>
            <button class="text-white/80 hover:text-white bg-white/5 hover:bg-white/20 p-3 rounded-lg transition-all duration-300 backdrop-blur-md shadow-lg" 
                    on:click={toggleMenu}>
                <i class="ri-close-line text-xl"></i>
            </button>
        </div>

        <div class="flex flex-col space-y-8 relative z-[101] w-full px-8 max-w-md mx-auto" transition:fly={{ y: -20, duration: 500, easing: quintOut }}>
            {#each menuItems as item, index}
                {#if !item.isDropdown}
                    <a href={item.href} 
                       class="text-white/90 text-lg font-medium text-center hover:text-cYellow transition-all duration-300 opacity-0 animate-fadeIn py-4 relative group backdrop-blur-sm hover:backdrop-blur-lg rounded-lg hover:bg-white/5" 
                       style="animation-delay: {index * 100}ms; animation-fill-mode: forwards;" 
                       on:click={toggleMenu}>
                        <span class="relative inline-block">
                            {item.label}
                            <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cYellow to-cYellow/50 group-hover:w-full transition-all duration-300"></span>
                        </span>
                    </a>
                {/if}
            {/each}

            {#each menuItems as item}
                {#if item.isDropdown}
                    <div class="border-t border-white/10 pt-6 mt-2 backdrop-blur-sm rounded-lg p-4">
                        <h3 class="text-white/50 text-lg font-medium uppercase tracking-wider mb-6 text-center">{item.label}</h3>
                        <div class="grid gap-4">
                            {#each item.items as subItem, subIndex}
                                <a href={subItem.href} 
                                   class="text-white/80 text-lg font-medium text-center hover:text-cYellow transition-all duration-300 opacity-0 animate-fadeIn flex items-center justify-center gap-2 py-3 px-4 rounded-lg hover:bg-white/5 group" 
                                   style="animation-delay: {(menuItems.length + subIndex) * 100}ms; animation-fill-mode: forwards;" 
                                   on:click={toggleMenu}>
                                    <span class="relative">
                                        {subItem.label}
                                        <span class="absolute bottom-0 left-0 w-0 h-px bg-cYellow/50 group-hover:w-full transition-all duration-300"></span>
                                    </span>
                                </a>
                            {/each}
                        </div>
                    </div>
                {/if}
            {/each}
        </div>

        <div class="flex justify-center gap-4 relative z-[50] mt-12 px-6 flex-wrap" 
             transition:fly={{ y: 20, duration: 500, easing: quintOut }}>
            {#each socialLinks as link, index}
                <a href={link.href} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="text-white/80 hover:text-white text-lg transition-all duration-300 opacity-0 animate-fadeIn bg-white/5 hover:bg-white/20 p-4 rounded-lg backdrop-blur-sm hover:scale-110 hover:-translate-y-1" 
                   style="animation-delay: {(menuItems.length + menuItems.find(item => item.isDropdown)?.items.length + index) * 100}ms; animation-fill-mode: forwards;">
                    <i class={link.icon}></i>
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