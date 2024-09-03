<script lang="ts">
    import { onMount } from "svelte";
    import { fetchAllPosts, getPopularPosts, getRecentPosts, proxyImage } from "$lib/blog";
    import { goto } from "$app/navigation";
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";

    let allPosts: any[] = [];
    let displayedPosts: any[] = [];
    let currentFilter: 'all' | 'popular' | 'recent' = 'all';
    let isLoading = true;

    onMount(async () => {
        await loadPosts();
    });

    
    async function loadPosts() {
      isLoading = true;
      allPosts = await fetchAllPosts();
      displayedPosts = allPosts;
      isLoading = false;
    }
    
    async function filterPosts(filter: 'all' | 'popular' | 'recent') {
      currentFilter = filter;
      isLoading = true;
      if (filter === 'all') {
        displayedPosts = allPosts;
      } else if (filter === 'popular') {
        displayedPosts = await getPopularPosts();
      } else if (filter === 'recent') {
        displayedPosts = await getRecentPosts();
      }
      isLoading = false;
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

<style>
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

<Navbar />
<header class="flex flex-col items-center justify-center py-28">
    <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-5xl font-bold mb-6">K9Crypt Blog</h1>
        <p class="text-lg mb-6">Discover, read, and share knowledge with the world.</p>
        <div class="flex justify-center space-x-4 mb-8">
            <button on:click={() => filterPosts('all')} class="px-4 py-2 rounded-lg {currentFilter === 'all' ? 'bg-dark-green dark:bg-white text-white dark:text-[#090f00]' : 'bg-transparent border border-dark-green dark:border-white'}">All</button>
            <button on:click={() => filterPosts('popular')} class="px-4 py-2 rounded-lg {currentFilter === 'popular' ? 'bg-dark-green dark:bg-white text-white dark:text-[#090f00]' : 'bg-transparent border border-dark-green dark:border-white'}">Popular</button>
            <button on:click={() => filterPosts('recent')} class="px-4 py-2 rounded-lg {currentFilter === 'recent' ? 'bg-dark-green dark:bg-white text-white dark:text-[#090f00]' : 'bg-transparent border border-dark-green dark:border-white'}">Recent</button>
        </div>
    </div>
</header>

<main class="max-w-6xl mx-auto px-4">
  {#if isLoading}
  <section class="flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-lg flex items-center justify-center">
      <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
    </div>
  </section>
  {:else}
  <section>
    <h2 class="text-3xl font-bold mb-6">
      {#if currentFilter === 'all'}
      All Posts
      {:else if currentFilter === 'popular'}
      Popular Posts
      {:else}
      Recent Posts
      {/if}
    </h2>
    {#if displayedPosts.length === 0}
    <p class="text-lg">No posts available.</p>
    {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each displayedPosts as post}
      <div class="p-4 rounded-lg border-2 border-dark-green dark:border-white hover:shadow-lg transition-shadow duration-300">
        <img src={proxyImage(`${import.meta.env.VITE_APP_POCKETBASE}/api/files/blog/${post.id}/${post.image}`)} alt={post.title} class="w-full h-48 object-cover rounded-lg mb-4" />
        <h3 class="text-xl font-bold mb-2">{titleShortener(post.title)}</h3>
        <p class="text-sm mb-4">{@html contentShortener(post.content)}</p>
        <div class="flex justify-between items-center">
          {#if currentFilter === 'popular'}
          <span class="text-sm">Views: {post.viewCount}</span>
          {/if}
          <button on:click={() => goto("/blog/" + post.id)} class="px-4 py-2 border-2 border-light-green dark:text-[#090f00] bg-light-green rounded-lg">Read More</button>
        </div>
      </div>
      {/each}
    </div>
    {/if}
  </section>
  {/if}
</main>

<Footer />
