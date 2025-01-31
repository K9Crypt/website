<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { createMessage } from '$lib/create';
    import toast, { Toaster } from 'svelte-french-toast';
    import { checkLink } from '$lib/check';
    import { onMount } from "svelte";
    import { _ } from 'svelte-i18n';

    let message = '';
    let status: boolean | null = null;;
    let result = '';
    let isLoading = false;
    let error = '';

    onMount(async () => {
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
    });

    async function handleSubmit() {
        if (!message.trim()) {
            error = $_('message.create.errors.noMessage');
            return;
        }

        isLoading = true;
        error = '';

        try {
            result = await createMessage(message);
        } catch {
            error = $_('message.create.errors.failedToCreate');
        } finally {
            isLoading = false;
        }
    }

    async function routeSupport() {
        await goto("/contact");
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(result).then(
            () => toast.success($_('message.create.copySuccess'), { duration: 3000, position: "bottom-right", style: "background-color: #1B1B1B; color: #fff;" }),
            err => {
                console.error('Could not copy text: ', err);
                toast.error($_('message.create.copyError'), { duration: 3000, position: "bottom-right", style: "background-color: #1B1B1B; color: #fff;" });
            }
        );
    }
</script>

<Toaster />
<Navbar />

{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">
            {$_('message.create.error.connectionTitle')}
        </h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">
            {$_('message.create.error.connectionDesc')}
        </p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-fill text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">
                {$_('message.create.error.serverStatus')}
            </h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">
                {$_('message.create.error.serverDesc')}
            </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>{$_('message.create.error.tryAgain')}</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2.5 px-4 sm:px-6 md:px-10 rounded-lg font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>{$_('message.create.error.support')}</button>
        </div>
    </div>
</div>
{:else}
<section class="min-h-screen flex items-center justify-center py-10 md:py-0">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3">{$_('message.create.title')}</h2>
            <p class="text-white/50 text-sm">{$_('message.create.description')}</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium">{$_('message.create.form.messageLabel')}</label>
                <textarea bind:value={message} rows="4" placeholder={$_('message.create.form.messagePlaceholder')} class="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"></textarea>
            </div>

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button on:click={handleSubmit} class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" disabled={!message || isLoading}>
                {isLoading ? $_('message.create.form.encrypting') : $_('message.create.form.encrypt')}
            </button>
        </div>

        {#if result}
        <div class="mt-6 bg-cWhiteGray rounded-lg p-4 border border-white/5">
            <h3 class="text-lg font-semibold mb-4">{$_('message.create.result.title')}</h3>
            <p class="text-white/70 bg-black/20 p-3 rounded-lg border border-white/5 mb-4 break-all">{result}</p>
            <div class="flex flex-col sm:flex-row gap-4">
                <button class="w-full bg-cYellow text-black py-2.5 sm:py-2.5 px-4 rounded-lg font-medium text-sm sm:text-base" on:click={copyToClipboard}>
                    {$_('message.create.result.copy')}
                </button>
                <button class="w-full bg-cYellow/10 border border-cYellow text-cYellow py-2.5 sm:py-2.5 px-4 rounded-lg font-medium text-sm sm:text-base" on:click={() => goto('/view/message')}>
                    {$_('message.create.result.view')}
                </button>
            </div>            
        </div>
        {/if}
    </div>
</section>
{/if}

<Footer />