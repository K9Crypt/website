<script lang="ts">
    import { page } from "$app/stores";
    import { getPost, updatePostViewCount } from "$lib/blog";
    import { onMount } from 'svelte';
    import Navbar from "../../../components/Navbar.svelte";
    import Footer from "../../../components/Footer.svelte";
    import { _ } from 'svelte-i18n';
    
    let postId = $page.params.id;
    let post: { 
        title?: string, 
        category?: string, 
        author?: string, 
        date?: string, 
        content?: string, 
        relatedPosts?: Array<{ title: string, date: string, readTime: string }> 
    } = {};
    let readingTime = 0;

    onMount(async () => {
        await loadPost();
    });

    async function loadPost() {
        post = await getPost(postId);
        calculateReadingTime();
        
        const viewedPosts = JSON.parse(localStorage.getItem('viewedPosts') || '[]');
        if (!viewedPosts.includes(postId)) {
            await updatePostViewCount(postId);
            viewedPosts.push(postId);
            localStorage.setItem('viewedPosts', JSON.stringify(viewedPosts));
        }
    }

    function sharePost() {
        navigator.clipboard.writeText(window.location.href);
    }

    function calculateReadingTime() {
        if (post.content) {
            const wordCount = post.content.trim().split(/\s+/).length;
            readingTime = Math.ceil(wordCount / 200) + "";
        }
    }
</script>

<Navbar />

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="mb-6 border-b border-white/5 pb-6">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                {post.title}
            </h1>
            <div class="flex items-center gap-4 text-white/50 text-sm">
                <span class="flex items-center gap-2">
                    <i class="ri-user-3-fill"></i>
                    {post.author}
                </span>
                <span class="flex items-center gap-2">
                    <i class="ri-calendar-fill"></i>
                    {new Date(post.created).toLocaleDateString()}
                </span>
                <span class="flex items-center gap-2">
                    <i class="ri-time-fill"></i>
                    {$_('blog.post.readTime', { values: { minutes: readingTime } })}
                </span>
            </div>
        </div>

        <div class="prose prose-invert prose-lg max-w-none mb-12">
            {@html post.content}
        </div>

        <div class="border-t border-white/5 py-6 mb-12 flex justify-between items-center">
            <div class="flex gap-4">
                <button on:click={sharePost} class="text-white/50 hover:text-white transition-colors duration-300" title={$_('blog.post.share')}>
                    <i class="ri-link text-xl"></i>
                </button>
            </div>
            <div class="flex gap-4">
                <a href="/blog" class="text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-2">
                    <i class="ri-arrow-left-fill"></i>
                    {$_('blog.post.backToBlog')}
                </a>
            </div>
        </div>
    </div>
</section>

<Footer />