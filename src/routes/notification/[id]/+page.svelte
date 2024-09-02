<script lang="ts">
  import { page } from '$app/stores';
  import { getNotification } from '$lib/notifications';
  import { onMount } from 'svelte';

  let notification = $page.params.id;
  let notificationData: any = {};

  onMount(async () => {
    notificationData = await getNotification(notification);
  });
</script>

<section class="py-12">
  <div class="max-w-4xl mx-auto px-4">
    <h2 class="text-2xl font-bold text-center mb-3">Notification</h2>
    {#if notificationData}
      <div class="p-6 rounded-lg border-2 border-dark-green">
        <h3 class="text-xl font-semibold mb-4"><i class="ri-message-3-line mr-1"></i> {notificationData.title || 'Not found'}</h3>
        <p>{@html notificationData.description || 'Not found'}</p>
      </div>
    {:else}
      <p class="text-center">Loading...</p>
    {/if}
  </div>
</section>