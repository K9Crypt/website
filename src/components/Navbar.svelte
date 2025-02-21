<script lang="ts">
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

    $: menuItems = [
        { href: "/", label: $_('nav.home') },
        { href: "/about", label: $_('nav.about') },
        {
            label: $_('nav.products.title'),
            isDropdown: true,
            items: [
                { href: "/products/k9shield", label: $_('nav.products.k9shield') },
                { href: "/products/k9vault", label: $_('nav.products.k9vault') },
                { href: "/products/k9cli", label: $_('nav.products.k9cli') }
            ]
        },
        {
            label: $_('nav.actions.title'),
            isDropdown: true,
            items: [
                { href: "/create/room", label: $_('nav.actions.createRoom') },
                { href: "/join/room", label: $_('nav.actions.joinRoom') },
                { href: "/list", label: $_('nav.actions.listRooms') },
                { href: "/create/message", label: $_('nav.actions.createMessage') },
                { href: "/view/message", label: $_('nav.actions.viewMessage') }
            ]
        }
    ];

    const languages = [
        { code: 'tr', name: 'Türkçe' },
        { code: 'en', name: 'English' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'ru', name: 'Русский' },
        { code: 'es', name: 'Español' }
    ];

    function switchLanguage(langCode: string) {
        locale.set(langCode);
        localStorage.setItem('preferred-locale', langCode);
    }

    let activeDropdowns = {
        Products: false,
        Actions: false,
        Language: false
    };

    let isAnyDropdownOpen = false;

    function toggleDropdown(label: string) {
        activeDropdowns[label] = !activeDropdowns[label];
        Object.keys(activeDropdowns).forEach(key => {
            if (key !== label) {
                activeDropdowns[key] = false;
            }
        });

        isAnyDropdownOpen = Object.values(activeDropdowns).some(isOpen => isOpen);
    }
    function handleClickOutside(event: string) {
        const target = event.target;
        if (!target.closest('.dropdown-container')) {
            Object.keys(activeDropdowns).forEach(key => {
                activeDropdowns[key] = false;
            });
            isAnyDropdownOpen = false;
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
                    <div class="px-3 py-2 bg-cWhiteGray rounded-lg border border-white/10 group-hover:bg-white/10 transition-all duration-300">
                        <i class="{link.icon} text-white/50 group-hover:text-white group-hover:scale-110 transition-all duration-300"></i>
                    </div>
                </a>
            {/each}

            <div class="relative dropdown-container ml-1">
                <button
                    on:click={() => toggleDropdown('Language')}
                    class="group relative flex items-center space-x-1.5 px-3 py-2 bg-cWhiteGray border border-white/10 rounded-lg hover:bg-white/10 transition-all duration-300"
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

{#if isAnyDropdownOpen}
    <div class="fixed inset-0 bg-black/50 z-40" transition:fade={{duration: 200}}></div>
{/if}

{#if isMenuOpen}
    <div class="fixed inset-0 bg-black/90 backdrop-blur-lg flex flex-col z-[100]" 
         transition:fade={{ duration: 300, easing: quintOut }} 
         on:click|self={toggleMenu}>
        
        <div class="flex justify-between items-center px-6 py-4 border-b border-white/10">
            <a href="/" class="flex items-center space-x-3">
                <img src="https://www.upload.ee/image/17339414/k9crypt-rb.png" alt="Logo" class="w-8 h-8"/>
                <span class="text-white font-bold text-xl">K9Crypt</span>
            </a>
            <button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all" on:click={toggleMenu}>
                <i class="ri-close-line text-xl text-white"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto py-6 px-4">
            <div class="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                {#each menuItems as item, index}
                    {#if !item.isDropdown}
                        <a href={item.href}
                           class="group p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
                           style="animation-delay: {index * 50}ms"
                           on:click={toggleMenu}>
                            <div class="flex items-center justify-between">
                                <span class="text-white text-lg">{item.label}</span>
                                <i class="ri-arrow-right-line text-white/50 group-hover:translate-x-1 transition-transform"></i>
                            </div>
                        </a>
                    {:else}
                        <div class="bg-white/5 rounded-lg p-4">
                            <h3 class="text-white/80 font-medium mb-3 px-2">{item.label}</h3>
                            <div class="space-y-2">
                                {#each item.items as subItem}
                                    <a href={subItem.href}
                                       class="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/10 transition-all group"
                                       on:click={toggleMenu}>
                                        <i class="ri-arrow-right-s-line text-white/50 group-hover:text-cYellow"></i>
                                        <span class="text-white/80 group-hover:text-white">{subItem.label}</span>
                                    </a>
                                {/each}
                            </div>
                        </div>
                    {/if}
                {/each}
            </div>
        </div>

        <div class="border-t border-white/10 py-6 px-4">
            <div class="flex flex-wrap justify-center gap-3">
                {#each socialLinks as link}
                    <a href={link.href}
                       target="_blank"
                       rel="noopener noreferrer"
                       class="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all">
                        <i class="{link.icon} text-white/80"></i>
                        <span class="text-white/80 text-sm">{link.label}</span>
                    </a>
                {/each}
            </div>
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