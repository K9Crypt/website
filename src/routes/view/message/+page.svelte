<script lang="ts">
    import Navbar from '../../../components/Navbar.svelte';
    import Footer from '../../../components/Footer.svelte';
    import { goto } from '$app/navigation';
    import { viewMessage } from '$lib/view';
    import { checkLink } from '$lib/check';
    import toast, { Toaster } from 'svelte-french-toast';
    import { onMount } from "svelte";

    let message = '';
    let result = '';
    let isLoading = false;
    let error = '';
    let status: boolean | null = null;
    let isPageLoading = true;

    onMount(async () => {
        status = await checkLink(`${import.meta.env.VITE_APP_APIURL}`);
        setTimeout(() => isPageLoading = false, 1000);
    });

    async function routeSupport() {
        await goto("/contact");
    }

    async function handleSubmit() {
        if (!message.trim()) {
            error = 'Please enter a message';
            return;
        }

        isLoading = true;
        error = '';

        try {
            result = await viewMessage(message);
        } catch {
            error = 'Failed to decrypt message. Please try again.';
        } finally {
            isLoading = false;
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(result).then(
        () => toast.success('Decrypted message copied to clipboard.', { duration: 3000, position: "top-right", style: 'background-color: #1B1B1B; color: #fff;' }),
        err => {
            console.error('Could not copy text: ', err);
            toast.error('Failed to copy decrypted message. Please try again.', { duration: 3000, position: "top-right", style: 'background-color: #1B1B1B; color: #fff;' });
        }
        );
    }

    function downloadResult() {
        const blob = new Blob([result], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decrypted.txt';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('File downloaded successfully.', { duration: 3000, position: "top-right", style: 'background-color: #1B1B1B; color: #fff;' });
    }
</script>

<Toaster />
<Navbar />
{#if status === false && status !== null}
<div class="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-2xl mx-auto">
        <h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-red-500 text-center">Connection Error</h1>
        <p class="text-white/50 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 text-center">Unable to connect to the server. Please check your connection and try again.</p>
                
        <div class="bg-red-500/10 border border-red-500/20 rounded p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <div class="flex justify-center mb-3 sm:mb-4">
                <i class="ri-error-warning-line text-red-500 text-2xl sm:text-3xl md:text-4xl"></i>
            </div>
            <h2 class="text-base sm:text-lg md:text-xl font-semibold text-red-500 mb-2 text-center">Server Status: Offline</h2>
            <p class="text-red-500 text-xs sm:text-sm md:text-base text-center">The server is currently unavailable. Our team has been notified and is working on resolving the issue.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500 py-2 px-4 sm:px-6 md:px-10 rounded font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-600" on:click={() => window.location.reload()}>Try Again</button>
            <button class="w-full sm:w-auto flex items-center justify-center bg-red-500/10 border border-red-500 text-red-500 py-2 px-4 sm:px-6 md:px-10 rounded font-medium text-sm md:text-base transition-all duration-300 hover:bg-red-500/20" on:click={routeSupport}>Support</button>
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
<section class="min-h-screen flex items-center justify-center py-10 md:py-0">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10 max-w-2xl">
        <div class="mb-8">
            <h2 class="text-3xl font-bold mb-3 text-white/80">Decrypt Message</h2>
            <p class="text-white/50 text-sm">View your encrypted message securely.</p>
        </div>

        <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-6">
            <div class="space-y-2">
                <label class="block text-sm font-medium text-white/80">Encrypted Message</label>
                <textarea bind:value={message} rows="4" placeholder="Enter encrypted message here..." class="w-full px-4 py-2 bg-black/20 border border-white/5 rounded focus:outline-none focus:border-cYellow text-white placeholder:text-white/30"></textarea>
            </div>

            {#if error}
            <p class="text-red-500 text-sm">{error}</p>
            {/if}

            <button on:click={handleSubmit} class="w-full bg-cYellow text-black py-3 rounded font-medium disabled:opacity-50" disabled={!message || isLoading}>
                <i class="ri-lock-unlock-fill mr-1"></i> {isLoading ? 'Decrypting...' : 'Decrypt Message'}
            </button>
        </div>

        {#if result}
        <div class="mt-6 bg-cWhiteGray rounded p-4 border border-white/5">
            <h3 class="text-lg font-semibold text-white/80 mb-4">Decrypted Message:</h3>
            <p class="text-white/70 bg-black/20 p-3 rounded border border-white/5 mb-4 break-all">{result}</p>
            <div class="flex flex-col sm:flex-row gap-4">
                <button class="w-full bg-cYellow text-black py-3 sm:py-2 px-4 rounded font-medium text-sm sm:text-base" on:click={copyToClipboard}>
                    <i class="ri-file-copy-fill mr-1"></i> Copy
                </button>
                <button class="w-full bg-cYellow/10 border border-cYellow text-cYellow py-3 sm:py-2 px-4 rounded font-medium text-sm sm:text-base" on:click={downloadResult}>
                    <i class="ri-download-2-fill mr-1"></i> Download
                </button>
            </div>
        </div>

        {/if}
        <div class="mt-8 bg-cWhiteGray rounded border border-white/5 p-4">
            <div class="flex items-start gap-3">
                <i class="ri-information-fill text-cYellow mt-1"></i>
                <div>
                    <h4 class="text-sm font-medium text-white/80 mb-1">Security Information</h4>
                    <p class="text-xs text-white/50">The decrypted message will be automatically deleted after 2 hours.</p>
                </div>
            </div>
        </div>
    </div>
</section>
{/if}
{/if}

<Footer />