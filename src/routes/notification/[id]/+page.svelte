<script lang="ts">
  import Navbar from '../../../components/Navbar.svelte';
  import { page } from '$app/stores';
  import { getNotification } from '$lib/notifications';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Footer from '../../../components/Footer.svelte';

  let notification = $page.params.id;
  let notificationData: any = {};

  onMount(async () => {
    notificationData = await getNotification(notification);
  });
</script>

<Navbar />
<section class="py-12">
  <div class="max-w-4xl mx-auto px-4">
    <h2 class="text-2xl font-bold text-center mb-3">Notification</h2>
    {#if notificationData}
      <div class="p-6 rounded-lg border-2 border-dark-green dark:border-[#fafafa] mb-4">
        <h3 class="text-xl font-semibold mb-4"><i class="ri-message-3-fill mr-1"></i> {notificationData.title || 'Not found'}</h3>
        <p>{@html notificationData.description || 'Not found'}</p>
      </div>
      <button on:click={() => goto("/")} class="px-6 py-2 border-2 border-light-green dark:text-dark-green bg-light-green rounded-lg"><i class="ri-arrow-left-s-line mr-1"></i> Go Back</button>
    {:else}
      <p class="text-center">Loading...</p>
    {/if}
  </div>
</section>
<Footer />