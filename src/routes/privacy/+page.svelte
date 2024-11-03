<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;

    const privacySections = [
        {
            title: "Data Collection",
            description: "We do not collect any personal information. K9Crypt operates with complete anonymity.",
            icon: "ri-database-2-fill",
            details: [
                "No IP addresses are stored",
                "No cookies are used",
                "No user tracking",
                "No personal information required"
            ]
        },
        {
            title: "Message Security",
            description: "Your messages are protected with industry-standard encryption methods.",
            icon: "ri-lock-2-fill",
            details: [
                "End-to-end encryption",
                "Messages auto-delete after 2 hours",
                "No message backups kept",
                "Secure transmission protocols"
            ]
        },
        {
            title: "Third Parties",
            description: "We do not share any information with third parties.",
            icon: "ri-share-forward-fill",
            details: [
                "No data sharing",
                "No third-party analytics",
                "No advertisements",
                "No external tracking scripts"
            ]
        },
        {
            title: "Your Rights",
            description: "You have complete control over your data and messages.",
            icon: "ri-shield-user-fill",
            details: [
                "Right to delete messages",
                "Right to remain anonymous",
                "Right to encrypted communication",
                "Right to data portability"
            ]
        }
    ];

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

<Navbar />
<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-8 animate-pulse">
            <div class="space-y-3">
                <div class="h-8 bg-cWhiteGray rounded w-64"></div>
                <div class="h-4 bg-cWhiteGray rounded w-96"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {#each Array(4) as _}
                <div class="bg-cWhiteGray border border-white/5 rounded p-6">
                    <div class="h-6 bg-cWhiteGray rounded mb-4 w-1/3"></div>
                    <div class="h-4 bg-cWhiteGray rounded mb-2"></div>
                    <div class="space-y-2 mt-4">
                        {#each Array(4) as _}
                        <div class="h-4 bg-cWhiteGray rounded w-2/3"></div>
                        {/each}
                    </div>
                </div>
                {/each}
            </div>

            <div class="bg-cWhiteGray border border-white/5 rounded p-6">
                <div class="h-6 bg-cWhiteGray rounded w-24 mb-4"></div>
                <div class="h-4 bg-cWhiteGray rounded w-72 mb-4"></div>
                <div class="flex gap-4">
                    <div class="h-4 bg-cWhiteGray rounded w-32 flex items-center"></div>
                    <div class="h-4 bg-cWhiteGray rounded w-24 flex items-center"></div>
                </div>
            </div>
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">At K9Crypt, we take your privacy seriously. Our service is built around the principle of complete anonymity and security. This policy outlines how we handle your data.</p>
            <p class="text-white/50 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {#each privacySections as section}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute top-4 right-4 opacity-5 text-4xl select-none transition-all duration-300 group-hover:opacity-15">
                    <i class="{section.icon}"></i>
                </div>
                <div class="relative z-10">
                    <h2 class="text-xl font-semibold mb-3">{section.title}</h2>
                    <p class="text-white/50 text-sm mb-4">{section.description}</p>
                    <ul class="space-y-2">
                        {#each section.details as detail}
                        <li class="flex items-center text-sm text-white/50">
                            <i class="ri-checkbox-circle-fill mr-2 text-white/80"></i>
                            {detail}
                        </li>
                        {/each}
                    </ul>
                </div>
            </div>
            {/each}
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
            <h3 class="text-lg font-semibold mb-4">Contact Us</h3>
            <p class="text-white/50 text-sm mb-4">If you have any questions about our privacy policy, please contact us:</p>
            <div class="flex gap-4">
                <a href="mailto:privacy@k9crypt.com" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-mail-fill mr-2"></i>
                    hi@k9crypt.xyz
                </a>
                <a href="https://github.com/k9crypt" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-github-fill mr-2"></i>
                    GitHub
                </a>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />