<script lang="ts">
    import { onMount } from 'svelte';
    import { fetchAllPosts, getPopularPosts, getRecentPosts, proxyImage } from "$lib/blog";
    import { goto } from "$app/navigation";
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { _ } from 'svelte-i18n';

    let allPosts: any[] = [];
    let displayedPosts: any[] = [];
    let selectedCategory = "All";
    let currentFilter: 'all' | 'popular' | 'recent' = 'all';

    onMount(async () => {
        await loadPosts();
    });

    async function loadPosts() {
        allPosts = await fetchAllPosts();
        displayedPosts = allPosts;
    }

    async function filterPosts(filter: 'all' | 'popular' | 'recent') {
        currentFilter = filter;
        
        if (filter === 'all') {
            displayedPosts = allPosts;
        } else if (filter === 'popular') {
            displayedPosts = await getPopularPosts();
        } else if (filter === 'recent') {
            displayedPosts = await getRecentPosts();
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

    function getImageUrl(post: any) {
        return proxyImage(`${import.meta.env.VITE_APP_POCKETBASE}/api/files/blog/${post.id}/${post.image}`);
    }
</script>

<Navbar />

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div>
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('blog.title')}</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('blog.description')}</p>
        </div>
        
        <div class="mb-8">
            <div class="flex gap-4 overflow-x-auto py-2.5">
                <div class="flex justify-center space-x-4 mt-6">
                    <button on:click={() => filterPosts('all')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'all' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('blog.filters.all')}</button>
                    <button on:click={() => filterPosts('popular')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'popular' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('blog.filters.popular')}</button>
                    <button on:click={() => filterPosts('recent')} class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex-shrink-0 {currentFilter === 'recent' ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-cWhiteGray'}">{$_('blog.filters.recent')}</button>
                </div>
            </div>
        </div>

        {#if displayedPosts.length === 0}
        <div class="text-center py-12">
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-8">
                <i class="ri-article-fill text-4xl text-white/50 mb-4"></i>
                <h3 class="text-xl font-semibold mb-2">{$_('blog.noPosts.title')}</h3>
                <p class="text-white/50">{$_('blog.noPosts.description')}</p>
            </div>
        </div>
        {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each displayedPosts.filter(post => selectedCategory === 'All' || post.category === selectedCategory) as post}
            <article class="bg-cWhiteGray border border-white/5 rounded-lg overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="relative h-48 overflow-hidden">
                    <img src={getImageUrl(post)} alt={titleShortener(post.title)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div class="absolute top-4 left-4">
                        <span class="bg-cYellow text-black px-3 py-1 rounded-lg text-xs font-medium">
                            {post.category}
                        </span>
                    </div>
                </div>
                
                <div class="p-6">
                    <div class="flex items-center gap-4 text-sm text-white/50 mb-3">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                    </div>
                    
                    <h2 class="text-xl font-semibold mb-3 transition-colors duration-300">{titleShortener(post.title)}</h2>
                    
                    <p class="text-white/50 text-sm mb-4">{@html contentShortener(post.content)}</p>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="text-sm">{post.author}</span>
                            <span class="text-white/50 text-sm">•</span>
                            <span class="text-white/50 text-sm">{new Date(post.created).toLocaleDateString()}</span>
                        </div>
                        
                        <button on:click={() => goto(`/blog/${post.id}`)} class="text-cYellow">
                            {$_('blog.readMore')}
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

<Footer />