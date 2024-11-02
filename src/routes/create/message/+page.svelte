<script lang="ts">
    import { goto } from '$app/navigation';
    import { createMessage } from '$lib/create';
    import toast, { Toaster } from 'svelte-french-toast';
    import { checkLink } from '$lib/check';
    import { onMount } from "svelte";

    let message = '';
    let status = false;
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
            () => toast.success('Encrypted message copied to clipboard.', { duration: 3000, position: "top-right", style: "background-color: #1B1B1B; color: #fff;" }),
            err => {
                console.error('Could not copy text: ', err);
                toast.error('Failed to copy encrypted message. Please try again.', { duration: 3000, position: "top-right", style: "background-color: #1B1B1B; color: #fff;" });
            }
        );
    }
</script>

{#if status === false}
<div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4 sm:px-6">
    <div class="max-w-2xl mx-auto mb-12">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-sm sm:text-base mb-6 sm:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded p-4 sm:p-6 mb-6 sm:mb-8">
            <div class="flex justify-center mb-4">
                <i class="ri-error-warning-line text-red-500 text-3xl sm:text-4xl"></i>
            </div>
            <h2 class="text-lg sm:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-sm sm:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button class="flex items-center justify-center bg-red-500 py-2 px-6 sm:px-10 rounded font-medium text-sm sm:text-base" on:click={() => window.location.reload()}>Try Again</button>
            <button class="flex items-center justify-center bg-red-500/10 border-2 border-red-500 text-red-500 py-2 px-6 sm:px-10 rounded font-medium text-sm sm:text-base" on:click={routeSupport}>Support</button>
        </div>
    </div>
</div>
{:else}
{#if isPageLoading}
<section class="py-8 sm:py-12 md:py-16 px-4 flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8 animate-pulse">
            <div class="h-8 bg-cWhiteGray rounded w-64 mb-3"></div>
            <div class="h-4 bg-cWhiteGray rounded w-96"></div>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-6 animate-pulse">
            <div class="space-y-2">
                <div class="h-4 bg-cWhiteGray rounded w-24"></div>
                <div class="h-32 bg-cWhiteGray rounded w-full"></div>
            </div>

            <div class="h-12 bg-cWhiteGray rounded w-full"></div>
        </div>

        <div class="mt-8 bg-cWhiteGray rounded border border-white/5 p-4">
            <div class="flex items-start gap-3">
                <div class="w-4 h-4 bg-cWhiteGray rounded mt-1"></div>
                <div class="space-y-2 flex-1">
                    <div class="h-4 bg-cWhiteGray rounded w-32"></div>
                    <div class="h-3 bg-cWhiteGray rounded w-full"></div>
                </div>
            </div>
        </div>
    </div>
</section>
{:else}
<Toaster />
<section class="flex items-center justify-center min-h-screen">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3 text-white/80">Create Encrypted Message</h2>
            <p class="text-white/50 text-sm">Secure your message with end-to-end encryption.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Your Message</label>
                <textarea bind:value={message} rows="4" placeholder="Enter your message here..." class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"></textarea>
            </div>

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button on:click={handleSubmit} class="w-full bg-cYellow text-black py-3 rounded font-medium disabled:opacity-50" disabled={!message || isLoading}>
                <i class="ri-lock-fill mr-1"></i> {isLoading ? 'Encrypting...' : 'Encrypt Message'}
            </button>
        </div>

        {#if result}
        <div class="mt-6 bg-cWhiteGray rounded p-4 border border-white/5">
            <h3 class="text-lg font-semibold text-white/80 mb-4">Encrypted Message:</h3>
            <p class="text-white/70 bg-black/20 p-3 rounded border border-white/5 mb-4 break-all">{result}</p>
            <div class="flex gap-4">
                <button class="w-full bg-cYellow text-black py-2 px-4 rounded font-medium" on:click={copyToClipboard}>
                    <i class="ri-file-copy-fill mr-1"></i> Copy
                </button>
                <button class="w-full bg-cYellow/10 border-2 border-cYellow text-cYellow py-2 px-4 rounded font-medium" on:click={() => goto('/view')}>
                    <i class="ri-eye-fill mr-1"></i> View Message
                </button>
            </div>
        </div>
        {/if}
        <div class="mt-8 bg-cWhiteGray rounded border border-white/5 p-4">
            <div class="flex items-start gap-3">
                <i class="ri-information-fill text-cYellow mt-1"></i>
                <div>
                    <h4 class="text-sm font-medium text-white/80 mb-1">Security Information</h4>
                    <p class="text-xs text-white/50">The encrypted message will be automatically deleted after 2 hours.</p>
                </div>
            </div>
        </div>
    </div>
</section>
{/if}
{/if}