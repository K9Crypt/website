<script lang="ts">
  import { goto } from '$app/navigation';
  import { createMessage } from '$lib/create';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { checkLink } from "$lib/check";
  import { onMount } from "svelte";

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
      result = await createMessage(message);
    } catch {
      error = 'Failed to create message. Please try again.';
    } finally {
      isLoading = false;
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result).then(
      () => toast.success('Encrypted message copied to clipboard.', { duration: 3000, position: "top-right" }),
      err => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy encrypted message. Please try again.', { duration: 3000, position: "top-right" });
      }
    );
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
    <h2 class="text-2xl font-bold text-center mb-6">Create Encrypted Message</h2>
    <div>
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="message" class="block text-sm font-medium mb-3">Your Message</label>
          <textarea id="message" bind:value={message} rows="4" class="w-full px-3 py-2 border-2 border-dark-green rounded-lg focus:outline-none" placeholder="Enter your message here..."></textarea>
        </div>
        <button type="submit" class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg disabled:opacity-50" disabled={!message || isLoading}>
          <i class="ri-send-plane-fill  mr-1"></i> {isLoading ? 'Encrypting...' : 'Encrypt'}
        </button>
      </form>

      {#if error}
        <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}

      {#if result}
        <div class="mt-6 p-4 border-2 border-dark-green rounded-lg">
          <h3 class="text-lg font-semibold mb-2">Your Encrypted Message:</h3>
          <div class="flex items-center mb-2">
            <div class="w-full p-2 border border-dark-green rounded-lg overflow-x-auto">
              {result}
            </div>
          </div>
          <div class="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button on:click={copyToClipboard} class="px-6 py-2 border-2 border-light-green bg-light-green rounded-lg">
              <i class="ri-clipboard-line  mr-1"></i> Copy Encrypted Message
            </button>
            <button on:click={() => goto(`/view`)} class="px-6 py-2 border-2 border-dark-green rounded-lg">
              <i class="ri-eye-fill  mr-1"></i> View Encrypted Message
            </button>
          </div>
          <p class="mt-2 text-sm text-dark-green/70">The message will be automatically deleted after 2 hours.</p>
        </div>
      {/if}
    </div>
  </div>
</section>
<Footer />
{:else}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg">
    <div class="bg-red-100 p-3 rounded-full">
        <p class="text-center text-red-600">System is currently offline. Please check back later.</p>
    </div>
  </div>
</section>
{/if}