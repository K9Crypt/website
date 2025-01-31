<script lang="ts">
    import { _ } from 'svelte-i18n';
</script>

<div class="text-center py-12 px-6 space-y-4">
    <h1 class="text-4xl font-bold mb-2">{$_('k9vault.banner.title')}</h1>
    <p class="text-white/50 mb-4 font-light">{$_('k9vault.banner.description')}</p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://github.com/K9Crypt/k9vault" target="_blank" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center">
            {$_('k9vault.banner.buttons.getStarted')}
        </a>
        <a href="https://github.com/K9Crypt/k9vault/releases" target="_blank" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center">
            {$_('k9vault.banner.buttons.download')}
        </a>
    </div>
</div>
