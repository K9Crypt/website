<script lang="ts">
    import { page } from "$app/stores";
    import { getPost, updatePostViewCount, proxyImage } from "$lib/blog";
    import { onMount } from "svelte";
    import toast, { Toaster } from 'svelte-french-toast';
    import Navbar from "../../../components/Navbar.svelte";
    import Footer from "../../../components/Footer.svelte";
    
    let postId = $page.params.id;
    let post: any = {};
    let readingTime = 0;
    let isLoading = true;

    onMount(async () => {
        await loadPost();
    });

    async function loadPost() {
        isLoading = true;
        post = await getPost(postId);
        contentReadingTime();
        
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]');
        if (!viewedPosts.includes(postId)) {
            await updatePostViewCount(postId);
            viewedPosts.push(postId);
            localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        }
        isLoading = false;
    }

    function sharePost() {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard.', { duration: 3000, position: "top-right" });
    }

    function contentReadingTime() {
        if (post.content) {
            const wordCount = post.content.trim().split(/\s+/).length;
            readingTime = Math.ceil(wordCount / 200);
        }
    }

    function formatViewCount(count: number) {
        return count > 999 ? count.toLocaleString('en-US') : count;
    }
</script>

<style>
    @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>

{#if isLoading}
<section class="flex items-center justify-center py-12 px-4">
    <div class="w-full max-w-lg flex items-center justify-center min-h-screen">
        <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
    </div>
</section>
{:else}
<Navbar />
<Toaster />
<section class="py-12">
    <div class="max-w-4xl mx-auto px-4">
        <img src={proxyImage(`${import.meta.env.VITE_APP_POCKETBASE}/api/files/blog/${postId}/${post.image}`)} alt={post.title} class="w-full h-48 object-cover rounded-lg mb-4" />
        <div>
            <h2 class="text-2xl font-bold text-center mb-3">{post.title || "Loading.."}</h2>
            <p class="text-sm mb-6 text-center">By {post.author || "Loading..."} - {readingTime} min read</p>
        </div>
        <div class="border-l-2 border-dark-green dark:border-white bg-dark-green/5 dark:bg-white/5 p-4 mb-6">
            <p class="text-sm">{@html post.content || "Loading..."}</p>
        </div>
        <hr class="border border-dark-green/10 dark:border-white/10 mb-4" />
        <div class="flex justify-between items-center">
            <div class="flex space-x-4">
                <p class="text-sm">View Count: {formatViewCount(post.viewCount) || "0"}</p>
                <p class="text-sm">Published: {new Date(post.created).toLocaleDateString() || "Loading..."}</p>
            </div>
            <button on:click={sharePost} class="px-4 py-2 bg-light-green text-[#090f00] rounded-lg">
                <i class="ri-share-line mr-2"></i>Share
            </button>
        </div>
    </div>
</section>
<Footer />
{/if}
