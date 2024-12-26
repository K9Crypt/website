<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { checkLink } from "$lib/check";

    let status: boolean | null = null;
    let isLoaded = false;

    onMount(async () => {
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });

    async function routeSupport() {
        await goto("/contact");
    }

    let steps = [
        {
            title: "Create Room",
            description: "Create a new room and invite your friends to join you.",
            link: "/create/room"
        },
        {
            title: "Join Room",
            description: "Join an existing room and start sending messages.",
            link: "/join/room"
        },
        {
            title: "Create Encrypted Message",
            description: "Create an encrypted message and share it with people.",
            link: "/create/message"
        },
        {
            title: "Decrypt Message",
            description: "Decrypt the message you encrypted or the encrypted message.",
            link: "/view/message"
        },
        {
            title: "List of Rooms",
            description: "View all the rooms.",
            link: "/list"
        }
    ];
</script>

<Navbar />
{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>Try Again</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>Support</button>
        </div>
    </div>
</div>
{:else}
<section class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        {#if !isLoaded}
        <div class="animate-pulse">
            <div class="max-w-2xl mx-auto mb-12">
                <div class="h-12 bg-cWhiteGray rounded-lg max-w-2xl mx-auto mb-4"></div>
                <div class="h-6 bg-cWhiteGray rounded-lg max-w-xl mx-auto"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {#each Array(5) as _, i}
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 h-40"></div>
                {/each}
            </div>
        </div>
        {:else}
        <div class="max-w-2xl mx-auto mb-12">
            <h1 class="text-4xl font-bold mb-4">Where Do You Want to Go?</h1>
            <p class="text-white/50 text-base mb-8">Let's help you find your way back to the right destination.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {#each steps as step, index}
            <a href={step.link} class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute -top-3 -right-3 font-bold opacity-5 text-8xl select-none transition-all duration-300 group-hover:opacity-15">
                    {index + 1}
                </div>
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{step.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </div>
            </a>
            {/each}
        </div>
        {/if}
    </div>
</section>
{/if}

<Footer />