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
<div class="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4" transition:fade={{ duration: 300 }}>
    <div class="bg-gradient-to-b from-cWhiteGray to-cWhiteGray/80 border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl" transition:scale={{ duration: 400, easing: quintOut }}>
        <div class="flex justify-between items-center mb-8">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-cYellow/20 rounded-lg flex items-center justify-center">
                    <i class="ri-tools-fill text-cYellow text-2xl"></i>
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-white/95">Beta Version</h3>
                    <p class="text-white/50 text-sm">Early Access Release</p>
                </div>
            </div>
            <button on:click={() => showBetaWarning = false} class="hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                <i class="ri-close-line text-2xl text-white/60 hover:text-white"></i>
            </button>
        </div>
        
        <div class="space-y-6">
            <div class="bg-black/20 rounded-lg p-5 border border-white/5">
                <div class="flex items-start gap-4">
                    <i class="ri-information-line text-cYellow text-xl mt-0.5"></i>
                    <div>
                        <p class="text-white/90 font-medium mb-2">Important Notice</p>
                        <p class="text-white/70 text-sm leading-relaxed">This application is currently in beta testing phase. You may encounter bugs or system errors during usage. We appreciate your patience and feedback as we work to improve the experience.</p>
                    </div>
                </div>
            </div>

            <div class="bg-black/20 rounded-lg p-5 border border-white/5">
                <p class="text-sm font-semibold text-white/90 mb-4">Known Issues:</p>
                {#if loading}
                <div class="animate-pulse space-y-3">
                    {#each Array(3) as _}
                        <div class="h-4 bg-white/10 rounded-lg"></div>
                    {/each}
                </div>
                {:else}
                <ul class="text-sm text-white/70 space-y-2 list-none">
                    {@html warning.knownIssues}
                </ul>
                {/if}
            </div>
        </div>

        <div class="mt-8 space-y-4">
            <div class="flex flex-col sm:flex-row gap-3">
                <button on:click={() => showBetaWarning = false} class="flex-1 bg-cYellow hover:bg-cYellow/90 text-black py-2.5 px-6 rounded-lg font-medium transition-all duration-300">I Understand</button>
                <a href="/contact" class="flex-1 bg-cYellow/10 border border-cYellow text-cYellow py-2.5 px-6 rounded-lg font-medium text-center transition-all duration-300">Report an Issue</a>
            </div>
            
            <div class="text-center">
                <p class="text-xs text-white/40">
                    Version <span class="text-white/60 font-medium">{warning.version}</span>
                </p>
            </div>
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