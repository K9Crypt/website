<script>
    import { _ } from 'svelte-i18n';

    const features = [
        {
            title: $_('why.features.noAccount.title'),
            description: $_('why.features.noAccount.description')
        },
        {
            title: $_('why.features.encryption.title'),
            description: $_('why.features.encryption.description')
        },
        {
            title: $_('why.features.autoDelete.title'),
            description: $_('why.features.autoDelete.description')
        },
        {
            title: $_('why.features.openSource.title'),
            description: $_('why.features.openSource.description')
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('why.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('why.subtitle')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each features as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>