<script>
    const shieldFeatures = [
        {
            title: "Free",
            description: "K9Vault allows users to encrypt their photos for free.",
            icon: "ri-user-unfollow-fill"
        },
        {
            title: "End-to-End Encryption",
            description: "User photos are end-to-end encrypted.",
            icon: "ri-lock-2-fill"
        },
        {
            title: "Local Operation",
            description: "K9Vault operates entirely on users' computers, never communicating with a 3rd party server.",
            icon: "ri-code-s-slash-fill"
        },
        {
            title: "Open Source",
            description: "K9Vault is an open source project and is published on GitHub.",
            icon: "ri-github-fill"
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">Comprehensive Security Features</h2>
            <p class="text-white/50 text-sm sm:text-base">Advanced security middleware providing robust protection for Node.js applications</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each shieldFeatures as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute top-1 right-1 font-bold opacity-5 text-4xl select-none transition-all duration-300 group-hover:opacity-15">
                    <i class="{feature.icon}"></i>
                </div>
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>