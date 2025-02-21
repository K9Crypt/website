<script lang="ts">
    import { page } from "$app/stores";
    import { getUpdate } from "$lib/updates";
    import { onMount } from 'svelte';
    import Navbar from "../../../components/Navbar.svelte";
    import Footer from "../../../components/Footer.svelte";
    import { _ } from 'svelte-i18n';
    
    let updateId = $page.params.id;
    let update: { 
        title?: string, 
        content?: string,
        user?: string,
        created?: string
    } = {};
    let readingTime = 0;

    onMount(async () => {
        await loadUpdate();
    });

    async function loadUpdate() {
        try {
            update = await getUpdate(updateId);
            calculateReadingTime();
        } catch (error) {
            console.error('Error loading update:', error);
        }
    }

    function shareUpdate() {
        navigator.clipboard.writeText(window.location.href);
    }

    function calculateReadingTime() {
        if (update.content) {
            const wordCount = update.content.trim().split(/\s+/).length;
            readingTime = Math.ceil(wordCount / 200) + "";
        }
    }
</script>

<div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
        <section class="py-8 sm:py-12 md:py-16 px-4">
            <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <div class="mb-6 border-b border-white/5 pb-6">
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                        {update.title}
                    </h1>
                    <div class="flex items-center gap-4 text-white/50 text-sm">
                        <span class="flex items-center gap-2">
                            <i class="ri-user-3-fill"></i>
                            {update.user}
                        </span>
                        <span class="flex items-center gap-2">
                            <i class="ri-calendar-fill"></i>
                            {new Date(update.created).toLocaleDateString()}
                        </span>
                        <span class="flex items-center gap-2">
                            <i class="ri-time-fill"></i>
                            {$_('updatesPage.post.readTime'), { values: { minutes: readingTime } }}
                        </span>
                    </div>
                </div>

                <div class="prose prose-invert max-w-none mb-12">
                    {@html update.content}
                </div>

                <div class="border-t border-white/5 py-6 mb-12 flex justify-between items-center">
                    <div class="flex gap-4">
                        <button on:click={shareUpdate} class="text-white/50 hover:text-white transition-colors duration-300">
                            <i class="ri-link text-xl"></i>
                        </button>
                    </div>
                    <div class="flex gap-4">
                        <a href="/updates" class="text-white/50 hover:text-white transition-colors duration-300 flex items-center gap-2">
                            <i class="ri-arrow-left-fill"></i>
                            {$_('updatesPage.post.backToBlog')}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <Footer />
</div>