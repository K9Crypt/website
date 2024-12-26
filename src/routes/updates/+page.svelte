<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchAllUpdates, getPopularUpdates, getRecentUpdates } from '$lib/updates';
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";

    let isLoaded = false;
    let allUpdates: any[] = [];
    let displayedUpdates: any[] = [];
    let currentFilter: 'all' | 'popular' | 'recent' = 'all';

    onMount(async () => {
        setTimeout(async () => {
            await loadUpdates();
            isLoaded = true;
        }, 1500);
    });

    async function loadUpdates() {
        allUpdates = await fetchAllUpdates();
        displayedUpdates = allUpdates;
    }

    async function filterUpdates(filter: 'all' | 'popular' | 'recent') {
        currentFilter = filter;
        isLoaded = false;
        
        if (filter === 'all') {
            displayedUpdates = allUpdates;
        } else if (filter === 'popular') {
            displayedUpdates = await getPopularUpdates();
        } else if (filter === 'recent') {
            displayedUpdates = await getRecentUpdates();
        }
        
        isLoaded = true;
    }

    function titleShortener(title: string, maxLength: number = 50): string {
        if (title.length <= maxLength) return title;
        return title.substr(0, maxLength) + '...';
    }

    function contentShortener(content: string, maxLength: number = 100): string {
        if (content.length <= maxLength) return content;
        return content.substr(0, maxLength) + '...';
    }
</script>

<div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
        <section class="py-8 sm:py-12 md:py-16 px-4">
            <div class="container mx-auto px-4 sm:px-6 lg:px-10">
                {#if !isLoaded}
                <div class="space-y-8 animate-pulse">
                    <div class="space-y-3">
                        <div class="h-8 bg-cWhiteGray rounded-lg w-64"></div>
                        <div class="h-4 bg-cWhiteGray rounded-lg w-96"></div>
                    </div>
                    
                    <div class="flex gap-4 overflow-x-auto py-2.5">
                        {#each Array(3) as _}
                        <div class="h-10 w-24 bg-cWhiteGray rounded-lg flex-shrink-0"></div>
                        {/each}
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {#each Array(6) as _}
                        <div class="bg-cWhiteGray border border-white/5 rounded-lg overflow-hidden">
                            <div class="h-48 bg-cWhiteGray"></div>
                            <div class="p-6 space-y-4">
                                <div class="h-4 bg-cWhiteGray rounded-lg w-24"></div>
                                <div class="h-6 bg-cWhiteGray rounded-lg w-3/4"></div>
                                <div class="h-4 bg-cWhiteGray rounded-lg w-full"></div>
                                <div class="flex gap-2">
                                    <div class="h-4 bg-cWhiteGray rounded-lg w-16"></div>
                                    <div class="h-4 bg-cWhiteGray rounded-lg w-16"></div>
                                </div>
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
                {:else}
                <div>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Updates & News</h1>
                    <p class="text-white/50 text-sm sm:text-base max-w-3xl">Stay updated with the latest news, security tips, and feature updates from K9Crypt.</p>
                </div>
                
                <div class="mb-8">
                    <div class="flex gap-4 overflow-x-auto py-2.5">
                        <div class="flex justify-center space-x-4 mt-6">
                            <button on:click={() => filterUpdates('all')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'all' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">All</button>
                            <button on:click={() => filterUpdates('popular')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'popular' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">Popular</button>
                            <button on:click={() => filterUpdates('recent')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'recent' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">Recent</button>
                        </div>
                    </div>
                </div>

                {#if displayedUpdates.length === 0}
                <div class="text-center py-12">
                    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-8">
                        <i class="ri-article-fill text-4xl text-white/50 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">No Updates Found</h3>
                        <p class="text-white/50">There are no updates available at the moment. Please check back later.</p>
                    </div>
                </div>
                {:else}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each displayedUpdates as update}
                    <article class="bg-cWhiteGray border border-white/5 rounded-lg overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                        <div class="p-6">
                            <h2 class="text-xl font-semibold mb-3 transition-colors duration-300">
                                {titleShortener(update.title)}
                            </h2>
                            
                            <p class="text-white/50 text-sm mb-4">
                                {@html contentShortener(update.content)}
                            </p>
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm">{update.user}</span>
                                    <span class="text-white/50 text-sm">•</span>
                                    <span class="text-white/50 text-sm">{new Date(update.created).toLocaleDateString()}</span>
                                </div>
                                
                                <button on:click={() => goto(`/updates/${update.id}`)} class="text-cYellow">
                                    Read More
                                    <i class="ri-arrow-right-fill ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                    {/each}
                </div>
                {/if}
                {/if}
            </div>
        </section>
    </main>
    <Footer />
</div>