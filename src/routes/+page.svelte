<script lang="ts">
    import Navbar from "../components/Navbar.svelte";
    import Banner from "../components/Banner.svelte";
    import Why from "../components/Why.svelte";
    import Hitw from "../components/HITW.svelte";
    import Faq from "../components/Faq.svelte";
    import Footer from "../components/Footer.svelte";
    import { fade, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { onMount } from "svelte";
    import { betaWarnings } from "$lib/config/messages";

    let showBetaWarning = true;
    let warnings: any[] = [];
    let loading = true;

    onMount(async () => {
        warnings = await betaWarnings();
        loading = false;
    });
</script>

{#if showBetaWarning}
{#each warnings as warning}
<div class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" transition:fade={{ duration: 300 }}>
    <div class="bg-cWhiteGray p-8 rounded-xl max-w-lg w-full mx-4 shadow-lg" transition:scale={{ duration: 400, easing: quintOut }}>
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-white/95">Beta Version Notice</h3>
            <button on:click={() => showBetaWarning = false} class="text-white/60 hover:text-white transition-colors duration-300">
                <i class="ri-close-line text-2xl"></i>
            </button>
        </div>
        
        <div class="flex items-start gap-5 mb-8">
            <div class="w-14 h-14 bg-cYellow/15 rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="ri-error-warning-fill text-cYellow text-3xl"></i>
            </div>
            <div>
                <p class="text-white/95 mb-3">This application is currently in the beta testing phase.</p>
                <p class="text-white/70 text-sm">You may encounter some system errors or bugs during usage. If you experience any issues that prevent you from using the system, please contact us.</p>
            </div>
        </div>

        <div class="mb-6 p-4 bg-black/15 rounded">
            <h4 class="text-sm font-semibold text-white/95 mb-3">Current Known Issues:</h4>
            {#if loading}
            <div class="animate-pulse space-y-2">
                <div class="h-4 bg-white/15 rounded w-4/5"></div>
                <div class="h-4 bg-white/15 rounded w-3/5"></div>
                <div class="h-4 bg-white/15 rounded w-2/5"></div>
            </div>
            {:else}
            <ul class="text-sm text-white/70 space-y-2 list-disc list-inside">
                {@html warning.knownIssues}
            </ul>
            {/if}
        </div>
        
        <div class="flex flex-col md:flex-row gap-4">
            <button on:click={() => showBetaWarning = false} class="w-full md:flex-1 flex items-center bg-cYellow text-black py-2 px-10 rounded font-medium justify-center">
                I Understand
            </button>
            <a href="/contact" class="w-full md:flex-1 flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2 px-10 rounded font-medium justify-center">
                Contact Support
            </a>
        </div>

        <p class="text-xs text-white/50 mt-4 text-center">
            If you encounter any issues, please click the "Contact Support" button to get in touch with us.
        </p>

        <div class="text-xs text-white/50 mt-5 text-center">
            <i class="ri-information-line text-xs text-white/50"></i>
            Version <span class="underline">{warning.version}</span>
        </div>
    </div>
</div>
{/each}
{/if}

<div class:blur-sm={showBetaWarning} class="transition-all duration-300">
    <Navbar/>
    <Banner/>
    <Why/>
    <Hitw/>
    <Faq/>
    <Footer/>
</div>