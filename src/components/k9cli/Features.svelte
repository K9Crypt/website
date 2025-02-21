<script>
    import { _ } from 'svelte-i18n';

    const features = [
        {
            icon: "ri-terminal-box-line",
            title: $_('k9cli.features.cli.title'),
            description: $_('k9cli.features.cli.description')
        },
        {
            icon: "ri-shield-keyhole-line",
            title: $_('k9cli.features.encryption.title'),
            description: $_('k9cli.features.encryption.description')
        },
        {
            icon: "ri-command-line",
            title: $_('k9cli.features.commands.title'),
            description: $_('k9cli.features.commands.description')
        },
        {
            icon: "ri-global-line",
            title: $_('k9cli.features.crossPlatform.title'),
            description: $_('k9cli.features.crossPlatform.description')
        }
    ];
</script>

<section class="py-16 px-4">
    <div class="container mx-auto">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">{$_('k9cli.features.title')}</h2>
            <p class="text-white/50 max-w-2xl mx-auto">{$_('k9cli.features.subtitle')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {#each features as feature}
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 group hover:bg-white/5 transition-all duration-300">
                    <div class="flex items-center gap-3 mb-4">
                        <div class="w-12 h-12 flex items-center justify-center bg-cYellow/10 rounded-lg group-hover:bg-cYellow/20 transition-all duration-300">
                            <i class="{feature.icon} text-cYellow text-2xl"></i>
                        </div>
                        <h3 class="text-lg font-semibold">{feature.title}</h3>
                    </div>
                    <p class="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>