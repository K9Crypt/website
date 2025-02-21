<script lang="ts">
    import Navbar from "../../components/Navbar.svelte";
    import Footer from "../../components/Footer.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { checkLink } from "$lib/check";
    import { _ } from "svelte-i18n";

    let status: boolean | null = null;

    onMount(async () => {
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
    });

    async function routeSupport() {
        await goto("/contact");
    }

    $: roomSteps = [
        {
            title: $_('startPage.steps.0.title'),
            description: $_('startPage.steps.0.description'),
            link: "/create/room"
        },
        {
            title: $_('startPage.steps.1.title'),
            description: $_('startPage.steps.1.description'),
            link: "/join/room"
        },
         {
            title: $_('startPage.steps.4.title'),
            description: $_('startPage.steps.4.description'),
            link: "/list"
        }
    ];

    $: messageSteps = [
        {
            title: $_('startPage.steps.2.title'),
            description: $_('startPage.steps.2.description'),
            link: "/create/message"
        },
        {
            title: $_('startPage.steps.3.title'),
            description: $_('startPage.steps.3.description'),
            link: "/view/message"
        },
    ];

    $: combinedSteps = [...roomSteps, ...messageSteps];
</script>

<Navbar />
{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">{$_('startPage.connectionError.title')}</h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">{$_('startPage.connectionError.description')}</p>

        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">{$_('startPage.connectionError.serverStatus')}</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">{$_('startPage.connectionError.serverDescription')}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>{$_('startPage.connectionError.tryAgainButton')}</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>{$_('startPage.connectionError.supportButton')}</button>
        </div>
    </div>
</div>
{:else}
<section class="min-h-screen flex items-center justify-center px-4 py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <div class="max-w-2xl mx-auto mb-12">
            <h1 class="text-4xl font-bold mb-4">{$_('startPage.mainContent.title')}</h1>
            <p class="text-white/50 text-base mb-8">{$_('startPage.mainContent.description')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6 hidden md:block">
                <h2 class="text-2xl font-semibold mb-4">{$_('startPage.roomSectionTitle')}</h2>
                {#each roomSteps as step, index}
                <a href={step.link} class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300 block">
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

            <div class="space-y-6 hidden md:block">
                <h2 class="text-2xl font-semibold mb-4">{$_('startPage.messageSectionTitle')}</h2>
                {#each messageSteps as step, index}
                <a href={step.link} class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300 block">
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

            <div class="space-y-6 md:hidden">
                {#each combinedSteps as step, index}
                    <a href={step.link} class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300 block">
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
        </div>
    </div>
</section>
{/if}

<Footer />