<script lang="ts">
  import { createMessage } from '$lib/create';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../components/Footer.svelte';
  import { checkLink } from "$lib/check";
  import { onMount } from "svelte";
  
  let status: boolean = false;
  let message = '';
  let result = '';
  let isLoading = false;
  let error = '';
  let isPageLoading = true;

  onMount(async () => {
    await checkLink("https://api.k9crypt.xyz").then((data) => {
      status = data;
    });
    setTimeout(() => {
      isPageLoading = false;
    }, 1000);
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
    } catch (err) {
      error = 'Failed to create message. Please try again.';
    } finally {
      isLoading = false;
    }
  }
  
  function copyToClipboard() {
    navigator.clipboard.writeText(`https://k9crypt.xyz/view/${result}`).then(() => {
      toast.success('Link copied to clipboard!', {
        duration: 3000,
        position: "top-right",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy link. Please try again.', {
        duration: 3000,
        position: "top-right",
      });
    });
  }

  $: viewUrl = result ? `/view/${result.split('/').pop()}` : '';
</script>

{#if isPageLoading}
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-lg flex items-center justify-center">
    <i class="ri-loader-3-line text-6xl animate-spin" style="animation: rotate 1s linear infinite;"></i>
  </div>
</section>

<style>
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
{:else if status}
<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-3xl">
    <h2 class="text-2xl font-bold text-center mb-6">Create Encrypted Message</h2>
    <div class="bg-white p-6 rounded shadow">
      <form on:submit|preventDefault={handleSubmit} class="space-y-4">
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-3">Your Message</label>
          <textarea id="message" bind:value={message} rows="4" class="w-full px-3 py-2 text-gray-700 border rounded focus:outline-none" placeholder="Enter your message here..."></textarea>
        </div>
        <button type="submit" class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 hover:bg-gray-900 text-sm disabled:opacity-50" disabled={!message || isLoading}>
          <i class="ri-send-plane-fill mr-1"></i> {isLoading ? 'Creating...' : 'Create'}
        </button>
      </form>

      {#if error}
        <p class="mt-4 text-red-500 text-sm">{error}</p>
      {/if}

      {#if result}
        <div class="mt-6 p-4 bg-gray-100 rounded">
          <h3 class="text-lg font-semibold mb-2">Your Encrypted Message Link:</h3>
          <p class="text-gray-700 break-all">{result}</p>
          <div class="mt-4 flex space-x-2">
            <a href={viewUrl} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 text-sm disabled:opacity-50">
              <i class="ri-eye-fill mr-1"></i> View
            </a>
            <button on:click={copyToClipboard} class="border border-gray-800 bg-transparent py-2 px-4 rounded transition duration-300 text-sm">
              <i class="ri-clipboard-line mr-1"></i> Copy URL
            </button>
          </div>
          <p class="mt-2 text-sm text-gray-600">Share this link with the recipient. The message will be automatically deleted after 2 hours.</p>
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
        <p class="text-center text-red-600"><i class="ri-error-warning-fill mr-1"></i> System is currently offline. Please check back later.</p>
    </div>
  </div>
</section>
{/if}