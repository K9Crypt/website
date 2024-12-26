<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { onMount } from "svelte";

    let isLoaded = false;

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });

    let contacts = [
        {
            title: "GitHub",
            description: "Open source code and issues.",
            link: "https://github.com/k9crypt"
        },
        {
            title: "X (Twitter)",
            description: "Follow us for updates and news.",
            link: "https://x.com/k9crypt"
        },
        {
            title: "Telegram",
            description: "Chat with us and get support.",
            link: "https://t.me/k9crypt"
        },
        {
            title: "Discord",
            description: "Join our community and get support.",
            link: "https://discord.gg/8jyeQV7Wyd"
        }
    ];
</script>

<Navbar />
<section class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        {#if !isLoaded}
        <div class="animate-pulse">
            <div class="max-w-2xl mx-auto mb-12">
                <div class="h-12 bg-cWhiteGray rounded-lg max-w-2xl mx-auto mb-4"></div>
                <div class="h-6 bg-cWhiteGray rounded-lg max-w-xl mx-auto"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {#each Array(4) as _, i}
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 h-40"></div>
                {/each}
            </div>
        </div>
        {:else}
        <div class="max-w-2xl mx-auto mb-12">
            <h1 class="text-4xl font-bold mb-4">Get in Touch</h1>
            <p class="text-white/50 text-base mb-8">Need help or want to chat? Reach out to us.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {#each contacts as contact, index}
            <a href={contact.link} class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute -top-3 -right-3 font-bold opacity-5 text-8xl select-none transition-all duration-300 group-hover:opacity-15">
                    {index + 1}
                </div>
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{contact.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{contact.description}</p>
                </div>
            </a>
            {/each}
        </div>
        {/if}
    </div>
</section>

<Footer />