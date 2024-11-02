<script>
    import { onMount } from "svelte";
    let isLoaded = false;
    
    const features = [
        {
            title: "No Account Needed",
            description: "K9Crypt does not require an account to use.",
            icon: "ri-user-unfollow-fill"
        },
        {
            title: "E2E Encryption",
            description: "All messages are encrypted using end-to-end encryption.",
            icon: "ri-lock-2-fill"
        },
        {
            title: "Auto-Delete",
            description: "Messages delete after 2 hours for security.",
            icon: "ri-timer-flash-fill"
        },
        {
            title: "Open Source",
            description: "K9Crypt is open source and available on GitHub.",
            icon: "ri-code-s-slash-fill"
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
        <div class="animate-pulse">
            <div class="mb-4 sm:mb-8">
                <div class="h-10 bg-cWhiteGray rounded max-w-md mb-3"></div>
                <div class="h-5 bg-cWhiteGray rounded max-w-xl"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each Array(4) as _}
                <div class="bg-cWhiteGray border border-white/5 rounded p-6 relative overflow-hidden">
                    <div class="h-6 bg-cWhiteGray rounded mb-4 w-1/3"></div>
                    <div class="h-4 bg-cWhiteGray rounded mb-2"></div>
                    <div class="h-4 bg-cWhiteGray rounded w-2/3"></div>
                </div>
                {/each}
            </div>
        </div>
        {:else}
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md text-white/80">Why Choose K9Crypt?</h2>
            <p class="text-white/50 text-sm sm:text-base">Because we offer secure and reliable messaging solutions with our passionate team.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each features as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
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
        {/if}
    </div>
</section>