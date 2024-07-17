<script lang="ts">
  import { checkLink } from "$lib/check";
  import { onMount } from "svelte";

  let status: boolean = false;

  onMount(async () => {
    await checkLink("https://api.k9crypt.xyz").then((data) => {
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
        <h3 class="text-lg font-bold text-gray-800 mb-4">K9Crypt</h3>
        <p class="text-sm text-gray-600 mb-4">Secure and anonymous messaging platform for everyone.</p>
        <div class="flex space-x-4">
          <a href="https://twitter.com/k9crypt" class="text-gray-400 hover:text-gray-600">
            <i class="ri-twitter-fill text-2xl"></i>
          </a>
          <a href="https://github.com/k9crypt" class="text-gray-400 hover:text-gray-600">
            <i class="ri-github-fill text-2xl"></i>
          </a>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
        <ul class="space-y-2">
          <li><a href="https://github.com/k9crypt" class="text-sm text-gray-600 hover:text-gray-800"><i class="ri-github-fill mr-1"></i> Github</a></li>
          <li><a href="https://twitter.com/k9crypt" class="text-sm text-gray-600 hover:text-gray-800"><i class="ri-twitter-fill mr-1"></i> Twitter</a></li>
          <li><a href="/privacy" class="text-sm text-gray-600 hover:text-gray-800"><i class="ri-lock-2-fill mr-1"></i> Privacy Policy</a></li>
          <li><a href="https://status.k9crypt.xyz/" class="text-sm text-gray-600 hover:text-gray-800"><i class="ri-signal-tower-fill mr-1"></i> System Status</a></li>
        </ul>
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-800 mb-4">Contact Us</h3>
        <p class="text-sm text-gray-600 mb-2">Have questions? Reach out to us.</p>
        <a href="mailto:support@k9crypt.com" class="text-sm text-gray-600 hover:underline"><i class="ri-mail-line mr-1"></i> hi@k9crypt.xyz</a>
      </div>
    </div>
    <div class="mt-8 pt-8 border-t border-gray-200 text-center">
      <p class="text-sm text-gray-600">&copy; {new Date().getFullYear()} K9Crypt. All rights reserved.</p>
    </div>
  </div>
</footer>
