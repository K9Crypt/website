<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { viewMessage } from '$lib/view';
  import toast, { Toaster } from 'svelte-french-toast';
  import Footer from '../../../components/Footer.svelte';
  import { checkLink } from '$lib/check';

  let status: boolean = false;
  let message = '';
  let isLoading = true;
  let error = '';
  let isPageLoading = true;

  onMount(async () => {
    await checkLink("https://api.k9crypt.xyz").then((data) => {
      status = data;
    });

    setTimeout(() => {
      isPageLoading = false;
    }, 1000);

    const id = $page.params.id;
    if (!id) {
      error = 'Invalid message ID';
      isLoading = false;
      return;
    }

    try {
      message = await viewMessage(id);
    } catch (err) {
      error = 'Failed to decrypt message. It may have expired or been deleted.';
    } finally {
      isLoading = false;
    }
  });

  function copyToClipboard() {
    navigator.clipboard.writeText(message).then(() => {
      toast.success('Message copied to clipboard!', {
        duration: 3000,
        position: "top-right",
      });
    }, (err) => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy message. Please try again.', {
        duration: 3000,
        position: "top-right",
      });
    });
  }

  function saveMessage() {
    const blob = new Blob([message], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${$page.params.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Message saved!', {
      duration: 3000,
      position: "top-right",
    });
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
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
{:else}
{#if status}
<Toaster />
<section class="flex items-center justify-center min-h-screen py-12 px-4">
  <div class="w-full max-w-3xl">
    <h2 class="text-2xl font-bold text-center mb-6">View Encrypted Message</h2>
    <div class="bg-white p-6 rounded shadow">
      {#if isLoading}
        <p class="text-center">Loading message...</p>
      {:else if error}
        <p class="text-center">{error}</p>
      {:else}
      <h3 class="text-lg font-semibold mb-2">Decrypted Message:</h3>
      <p class="text-gray-700 break-all whitespace-pre-wrap bg-gray-100 p-4 rounded">{message}</p>
      <div class="mt-4 flex space-x-4">
        <button on:click={copyToClipboard} class="bg-gray-800 text-white py-2 px-6 rounded transition duration-300 text-sm">
          <i class="ri-clipboard-fill mr-1"></i> Copy Message
        </button>
        <button on:click={saveMessage} class="border border-gray-800 bg-transparent py-2 px-4 rounded transition duration-300 text-sm">
          <i class="ri-save-line mr-1"></i> Save Message
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-600">This message will be automatically deleted soon. Make sure to save it if needed.</p>
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
{/if}