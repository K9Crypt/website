<script>
    import { _ } from 'svelte-i18n';
</script>

<div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center space-y-6 max-w-2xl mx-auto">
        <div class="relative">
            <h1 class="text-6xl sm:text-8xl font-bold relative z-10">{$_('errorPage.title')}</h1>
        </div>

        <div class="space-y-4">
            <h2 class="text-2xl sm:text-3xl font-semibold">{$_('errorPage.subtitle')}</h2>
            <p class="text-white/50 text-sm sm:text-base max-w-md mx-auto">
                {$_('errorPage.description')}
            </p>
        </div>

       <div class="flex gap-4 justify-center">
            <a href="/" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium">{$_('errorPage.goHome')}</a>
            <a href="/contact" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium">{$_('errorPage.support')}</a>
        </div>
    </div>
</div>