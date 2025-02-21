<script>
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { _ } from 'svelte-i18n';

    let contacts = [
        {
            title: $_('contact.social.github.title'),
            description: $_('contact.social.github.description'),
            link: "https://github.com/k9crypt"
        },
        {
            title: $_('contact.social.twitter.title'),
            description: $_('contact.social.twitter.description'),
            link: "https://x.com/k9crypt"
        },
        {
            title: $_('contact.social.telegram.title'),
            description: $_('contact.social.telegram.description'),
            link: "https://t.me/k9crypt"
        },
        {
            title: $_('contact.social.discord.title'),
            description: $_('contact.social.discord.description'),
            link: "https://discord.gg/8jyeQV7Wyd"
        }
    ];
</script>

<Navbar />
<section class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <div class="max-w-2xl mx-auto mb-12">
            <h1 class="text-4xl font-bold mb-4">{$_('contact.title')}</h1>
            <p class="text-white/50 text-base mb-8">{$_('contact.description')}</p>
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
    </div>
</section>