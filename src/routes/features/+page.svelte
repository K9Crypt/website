<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;

    const features = [
        {
            title: "End-to-End Encryption",
            description: "Military-grade encryption ensures your messages remain private and secure.",
            icon: "ri-lock-2-fill",
            details: [
                "AES-256 encryption",
                "Zero-knowledge architecture",
                "No plaintext storage",
                "Secure key exchange"
            ]
        },
        {
            title: "Message Auto-Delete",
            description: "Messages automatically delete after 2 hours for enhanced security.",
            icon: "ri-timer-flash-fill",
            details: [
                "Configurable timers",
                "Automatic cleanup",
                "No data retention",
                "Secure deletion"
            ]
        },
        {
            title: "Anonymous Usage",
            description: "Use K9Crypt without creating an account or sharing personal information.",
            icon: "ri-user-unfollow-fill",
            details: [
                "No registration required",
                "No personal data collection",
                "Complete anonymity",
                "Private messaging"
            ]
        },
        {
            title: "Secure Rooms",
            description: "Create encrypted chat rooms for group conversations.",
            icon: "ri-group-fill",
            details: [
                "Private room creation",
                "Secure invitations",
                "Group encryption",
                "Member privacy"
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

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 animate-pulse">
                <div class="h-7 bg-white/10 rounded w-48 mb-4"></div>
                <div class="h-5 bg-white/10 rounded w-full max-w-md mb-6"></div>
                <div class="flex gap-4">
                    <div class="h-10 bg-white/10 rounded w-32"></div>
                    <div class="h-10 bg-white/10 rounded w-32"></div>
                </div>
            </div>
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Features</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Discover the powerful features that make K9Crypt the most secure messaging platform.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {#each features as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute top-4 right-4 opacity-5 text-4xl select-none transition-all duration-300 group-hover:opacity-15">
                    <i class="{feature.icon}"></i>
                </div>
                <div class="relative z-10">
                    <h2 class="text-xl font-semibold mb-3">{feature.title}</h2>
                    <p class="text-white/50 text-sm mb-4">{feature.description}</p>
                    <ul class="space-y-2">
                        {#each feature.details as detail}
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
            <h3 class="text-lg font-semibold mb-4">Ready to Get Started?</h3>
            <p class="text-white/50 text-sm mb-6">Experience the most secure messaging platform today.</p>
            <div class="flex gap-4">
                <a href="/start" class="flex items-center bg-cYellow text-black py-2 px-10 rounded font-medium">
                    Get Started
                </a>
                <a href="/contact" class="flex items-center border-2 bg-cYellow/10 border-cYellow text-cYellow py-2 px-10 rounded font-medium">
                    Learn More
                </a>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />