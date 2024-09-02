<script lang="ts">
  import { checkLink } from "$lib/check";
  import { onMount } from "svelte";

  let status: boolean = false;

  onMount(async () => {
    await checkLink(`${import.meta.env.VITE_APP_APIURL}`).then((data) => {
      status = data;
    });
  });
</script>

<footer class="mt-36 py-10">
  <div class="max-w-6xl mx-auto px-4">
    <div class="grid gap-8 md:grid-cols-3">
      <div>
        {#if status}
        <span class="text-xs text-green-600"><span class="animate-pulse">●</span> All Systems Online</span>
        {:else}
        <span class="text-xs text-red-500"><span class="animate-pulse">●</span> System Offline</span>
        {/if}
        <h3 class="text-lg font-bold mb-4">K9Crypt</h3>
        <p class="text-sm text-dark-green/70 mb-4">Secure and anonymous messaging platform for everyone.</p>
        <div class="flex space-x-4">
          <a href="https://twitter.com/k9crypt" class="text-dark-green/70 hover:text-dark-green">
            <i class="ri-twitter-fill text-2xl"></i>
          </a>
          <a href="https://github.com/k9crypt" class="text-dark-green/70 hover:text-dark-green">
            <i class="ri-github-fill text-2xl"></i>
          </a>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="/support" class="text-sm text-dark-green/70 hover:text-dark-green"><i class="ri-mail-line mr-1"></i> Support</a></li>
          <li><a href="/privacy" class="text-sm text-dark-green/70 hover:text-dark-green"><i class="ri-lock-2-fill mr-1"></i> Privacy Policy</a></li>
          <li><a href="https://status.k9crypt.xyz/" class="text-sm text-dark-green/70 hover:text-dark-green"><i class="ri-signal-tower-fill mr-1"></i> System Status</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-bold text-dark-green mb-4">Contact Us</h3>
        <p class="text-sm text-dark-green/70 mb-2">Have questions? Reach out to us.</p>
        <a href="mailto:support@k9crypt.com" class="text-sm text-dark-green/70 hover:text-dark-green hover:underline"><i class="ri-mail-line mr-1"></i> hi@k9crypt.xyz</a>
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-dark-green/20 text-center text-dark-green/70">
      <p class="text-sm">&copy; {new Date().getFullYear()} K9Crypt. All rights reserved.</p>
      <span class="text-xs">Developed and designed by <a href="https://github.com/unoxdevs" class="underline">UnoxDevs</a></span>
    </div>
  </div>
</footer>
