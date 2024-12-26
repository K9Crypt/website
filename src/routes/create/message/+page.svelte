<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { createMessage } from '$lib/create';
    import toast, { Toaster } from 'svelte-french-toast';
    import { checkLink } from '$lib/check';
    import { onMount } from "svelte";

    let message = '';
    let status: boolean | null = null;;
    let result = '';
    let isLoading = false;
    let error = '';
    let isPageLoading = true;

    onMount(async () => {
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);

        setTimeout(() => isPageLoading = false, 1000);
    });

    async function handleSubmit() {
        if (!message.trim()) {
            error = 'Please enter a message';
            return;
        }

        isLoading = true;
        error = '';

        try {
            result = await createMessage(message);
        } catch {
            error = 'Failed to create message. Please try again.';
        } finally {
            isLoading = false;
        }
    }

    async function routeSupport() {
        await goto("/contact");
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(result).then(
            () => toast.success('Encrypted message copied to clipboard.', { duration: 3000, position: "bottom-right", style: "background-color: #1B1B1B; color: #fff;" }),
            err => {
                console.error('Could not copy text: ', err);
                toast.error('Failed to copy encrypted message. Please try again.', { duration: 3000, position: "bottom-right", style: "background-color: #1B1B1B; color: #fff;" });
            }
        );
    }
</script>

<Toaster />
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
{#if isPageLoading}
<section class="py-8 sm:py-12 md:py-16 px-4 flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8 animate-pulse">
            <div class="h-8 bg-cWhiteGray rounded-lg w-64 mb-3"></div>
            <div class="h-4 bg-cWhiteGray rounded-lg w-96"></div>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6 animate-pulse">
            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded-lg w-24"></div>
                <div class="h-32 bg-cWhiteGray rounded-lg w-full"></div>
            </div>

            <div class="h-12 bg-cWhiteGray rounded-lg w-full"></div>
        </div>
    </div>
</section>
{:else}
<section class="min-h-screen flex items-center justify-center py-10 md:py-0">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3">Create Encrypted Message</h2>
            <p class="text-white/50 text-sm">Secure your message with end-to-end encryption.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium">Your Message</label>
                <textarea bind:value={message} rows="4" placeholder="Enter your message here..." class="w-full px-4 py-2.5 bg-black/20 border border-white/5 rounded-lg focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"></textarea>
            </div>

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button on:click={handleSubmit} class="w-full bg-cYellow text-black py-2.5 rounded-lg font-medium disabled:opacity-50" disabled={!message || isLoading}>
                {isLoading ? 'Encrypting...' : 'Encrypt Message'}
            </button>
        </div>

        {#if result}
        <div class="mt-6 bg-cWhiteGray rounded-lg p-4 border border-white/5">
            <h3 class="text-lg font-semibold mb-4">Encrypted Message:</h3>
            <p class="text-white/70 bg-black/20 p-3 rounded-lg border border-white/5 mb-4 break-all">{result}</p>
            <div class="flex flex-col sm:flex-row gap-4">
                <button class="w-full bg-cYellow text-black py-2.5 sm:py-2.5 px-4 rounded-lg font-medium text-sm sm:text-base" on:click={copyToClipboard}>
                    Copy
                </button>
                <button class="w-full bg-cYellow/10 border border-cYellow text-cYellow py-2.5 sm:py-2.5 px-4 rounded-lg font-medium text-sm sm:text-base" on:click={() => goto('/view/message')}>
                    View Message
                </button>
            </div>            
        </div>
        {/if}
    </div>
</section>
{/if}
{/if}

<Footer />