<script lang="ts">
    import { _ } from 'svelte-i18n';

    const shieldFeatures = [
        {
            title: $_('k9shieldFeatures.items.ddos.title'),
            description: $_('k9shieldFeatures.items.ddos.description'),
            icon: "ri-shield-flash-line"
        },
        {
            title: $_('k9shieldFeatures.items.rateLimiting.title'),
            description: $_('k9shieldFeatures.items.rateLimiting.description'),
            icon: "ri-dashboard-3-line"
        },
        {
            title: $_('k9shieldFeatures.items.ipManagement.title'),
            description: $_('k9shieldFeatures.items.ipManagement.description'),
            icon: "ri-global-line"
        },
        {
            title: $_('k9shieldFeatures.items.requestValidation.title'),
            description: $_('k9shieldFeatures.items.requestValidation.description'),
            icon: "ri-scan-line"
        },
        {
            title: $_('k9shieldFeatures.items.securityHeaders.title'),
            description: $_('k9shieldFeatures.items.securityHeaders.description'),
            icon: "ri-lock-line"
        },
        {
            title: $_('k9shieldFeatures.items.patternDetection.title'),
            description: $_('k9shieldFeatures.items.patternDetection.description'),
            icon: "ri-radar-line"
        },
        {
            title: $_('k9shieldFeatures.items.monitoring.title'),
            description: $_('k9shieldFeatures.items.monitoring.description'),
            icon: "ri-file-chart-line"
        },
        {
            title: $_('k9shieldFeatures.items.requestTracking.title'),
            description: $_('k9shieldFeatures.items.requestTracking.description'),
            icon: "ri-route-line"
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('k9shieldFeatures.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('k9shieldFeatures.subtitle')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each shieldFeatures as feature}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute top-1 right-1 font-bold opacity-5 text-4xl select-none transition-all duration-300 group-hover:opacity-15">
                    <i class="{feature.icon}"></i>
                </div>
                <div class="relative z-10">
                    <h4 class="text-lg font-semibold mb-2">{feature.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>