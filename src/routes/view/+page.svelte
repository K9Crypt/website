<script lang="ts">
  import { viewMessage } from '$lib/view';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../components/Footer.svelte';
  import { checkLink } from "$lib/check";
  import { onMount } from "svelte";
  import Error from '../../components/Error.svelte';

  let status = false;
  let message = '';
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
      result = await viewMessage(message);
    } catch {
      error = 'Failed to decrypt message. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result).then(
      () => toast.success('Decrypted message copied to clipboard.', { duration: 3000, position: "top-right" }),
      err => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy decrypted message. Please try again.', { duration: 3000, position: "top-right" });
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
    toast.success('File downloaded successfully.', { duration: 3000, position: "top-right" });
  }
</script>

{#if isPageLoading}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg flex items-center justify-center">
    <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
  </div>
</section>

<style>
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
{:else if status}
<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-3xl">
    <h2 class="text-2xl font-bold text-center mb-6">Decrypt Encrypted Message</h2>
    <div>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="message" class="block text-sm font-medium  mb-3">Encrypted Message</label>
          <textarea id="message" bind:value={message} rows="4" class="w-full px-3 py-2 rounded-lg border-2 border-dark-green bg-transparent dark:border-white focus:outline-none placeholder:text-black/50 placeholder:dark:text-white/50" placeholder="Enter your message here..."></textarea>
        </div>
        <button type="submit" class="px-6 py-2 border-2 border-light-green bg-light-green text-[#090f00] rounded-lg disabled:opacity-50" disabled={!message || isLoading}>
          <i class="ri-send-plane-fill  mr-1"></i> {isLoading ? 'Decrypting...' : 'Decrypt'}
        </button>
      </form>

      {#if error}
        <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}

      {#if result}
        <div class="mt-6 p-4 rounded-lg border-2 border-dark-green dark:border-white">
          <h3 class="text-lg font-semibold mb-2">Your Decrypted Message:</h3>
          <div class="flex items-center space-x-2 mb-2">
            <div class="flex-grow p-2 border border-dark-green dark:border-white rounded-lg overflow-x-auto">
              {result}
            </div>
          </div>
          <div class="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button on:click={copyToClipboard} class="px-6 py-2 border-2 border-light-green text-[#090f00] bg-light-green rounded-lg">
              <i class="ri-clipboard-line  mr-1"></i> Copy Decrypted Message
            </button>
            <button on:click={downloadResult} class="px-6 py-2 border-2 border-dark-green dark:border-white rounded-lg">
              <i class="ri-download-2-fill  mr-1"></i> Download Decrypted Message
            </button>
          </div>
          <p class="mt-2 text-sm">The message will be automatically deleted after 2 hours.</p>
        </div>
      {/if}
    </div>
  </div>
</section>
<Footer />
{:else}
<Error />
{/if}