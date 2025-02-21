<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchAllUpdates, getPopularUpdates, getRecentUpdates } from '$lib/updates';
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { _ } from 'svelte-i18n';

    let allUpdates: any[] = [];
    let displayedUpdates: any[] = [];
    let currentFilter: 'all' | 'popular' | 'recent' = 'all';

    onMount(async () => {
        await loadUpdates();
    });

    async function loadUpdates() {
        allUpdates = await fetchAllUpdates();
        displayedUpdates = allUpdates;
    }

    async function filterUpdates(filter: 'all' | 'popular' | 'recent') {
        currentFilter = filter;
        
        if (filter === 'all') {
            displayedUpdates = allUpdates;
        } else if (filter === 'popular') {
            displayedUpdates = await getPopularUpdates();
        } else if (filter === 'recent') {
            displayedUpdates = await getRecentUpdates();
        }
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
                <div>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('updatesPage.title')}</h1>
                    <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('updatesPage.description')}</p>
                </div>
                
                <div class="mb-8">
                    <div class="flex gap-4 overflow-x-auto py-2.5">
                        <div class="flex justify-center space-x-4 mt-6">
                            <button on:click={() => filterUpdates('all')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'all' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('updatesPage.filters.all')}</button>
                            <button on:click={() => filterUpdates('popular')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'popular' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('updatesPage.filters.popular')}</button>
                            <button on:click={() => filterUpdates('recent')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'recent' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('updatesPage.filters.recent')}</button>
                        </div>
                    </div>
                </div>

                {#if displayedUpdates.length === 0}
                <div class="text-center py-12">
                    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-8">
                        <i class="ri-article-fill text-4xl text-white/50 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">{$_('updatesPage.noUpdates.title')}</h3>
                        <p class="text-white/50">{$_('updatesPage.noUpdates.description')}</p>
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
                                    {$_('updatesPage.readMore')}
                                    <i class="ri-arrow-right-fill ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </article>
                    {/each}
                </div>
                {/if}
            </div>
        </section>
    </main>
    <Footer />
</div>