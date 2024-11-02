<script lang="ts">
    import { onMount } from 'svelte';
    let isLoaded = false;

    const termsSections = [
        {
            title: "Service Usage",
            description: "Guidelines for using K9Crypt's messaging services.",
            icon: "ri-service-fill",
            details: [
                "Must be 13 years or older to use",
                "No illegal content or activities",
                "No spamming or automated usage",
                "No interference with service operations"
            ]
        },
        {
            title: "User Responsibilities",
            description: "Your obligations while using K9Crypt services.",
            icon: "ri-user-settings-fill",
            details: [
                "Maintain message security",
                "Report security vulnerabilities",
                "No unauthorized access attempts",
                "Responsible usage of encryption"
            ]
        },
        {
            title: "Service Changes",
            description: "Our rights regarding service modifications.",
            icon: "ri-settings-fill",
            details: [
                "Right to modify features",
                "Service availability changes",
                "Updates to terms and conditions",
                "Maintenance and improvements"
            ]
        },
        {
            title: "Limitations",
            description: "Service limitations and disclaimers.",
            icon: "ri-error-warning-fill",
            details: [
                "No guarantee of 100% uptime",
                "Force majeure circumstances",
                "Technical limitations",
                "Security best practices"
            ]
        }
    ];

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">By using K9Crypt, you agree to these terms. Please read them carefully before using our services.</p>
            <p class="text-white/50 text-sm mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {#each termsSections as section}
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
                            <i class="ri-arrow-right-s-fill mr-2 text-white/80"></i>
                            {detail}
                        </li>
                        {/each}
                    </ul>
                </div>
            </div>
            {/each}
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
            <h3 class="text-lg font-semibold mb-4">Questions About Terms?</h3>
            <p class="text-white/50 text-sm mb-4">If you have any questions about our terms of service, please reach out:</p>
            <div class="flex gap-4">
                <a href="mailto:terms@k9crypt.com" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-mail-fill mr-2"></i>
                    hi@k9crypt.xyz
                </a>
                <a href="https://discord.gg/k9crypt" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                    <i class="ri-discord-fill mr-2"></i>
                    Discord
                </a>
            </div>
        </div>
        {/if}
    </div>
</section>