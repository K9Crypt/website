<script>
    import { _ } from 'svelte-i18n';
</script>

<div class="text-center py-12 px-6 space-y-6">
    <h1 class="text-4xl font-bold mb-2">{$_('k9cli.banner.title')}</h1>
    <p class="text-white/50 mb-4 font-light max-w-2xl mx-auto">{$_('k9cli.banner.description')}</p>

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="https://www.npmjs.com/package/k9cli" target="_blank" 
           class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center">
            {$_('k9cli.banner.npmPackage')}
        </a>
        <a href="https://github.com/K9Crypt/k9cli" target="_blank" 
           class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center">
            {$_('k9cli.banner.github')}
        </a>
    </div>
</div>