<script lang="ts">
    import { _ } from 'svelte-i18n';

    const shieldSteps = [
        {
            title: $_('k9shieldSteps.items.installation.title'),
            description: $_('k9shieldSteps.items.installation.description'),
            icon: "ri-download-cloud-line",
            step: $_('k9shieldSteps.items.installation.step')
        },
        {
            title: $_('k9shieldSteps.items.basicConfig.title'),
            description: $_('k9shieldSteps.items.basicConfig.description'),
            icon: "ri-settings-line",
            step: $_('k9shieldSteps.items.basicConfig.step')
        },
        {
            title: $_('k9shieldSteps.items.securityHeaders.title'),
            description: $_('k9shieldSteps.items.securityHeaders.description'),
            icon: "ri-shield-check-line",
            step: $_('k9shieldSteps.items.securityHeaders.step')
        },
        {
            title: $_('k9shieldSteps.items.rateLimiting.title'),
            description: $_('k9shieldSteps.items.rateLimiting.description'),
            icon: "ri-dashboard-3-line",
            step: $_('k9shieldSteps.items.rateLimiting.step')
        },
        {
            title: $_('k9shieldSteps.items.ddosProtection.title'),
            description: $_('k9shieldSteps.items.ddosProtection.description'),
            icon: "ri-shield-flash-line",
            step: $_('k9shieldSteps.items.ddosProtection.step')
        },
        {
            title: $_('k9shieldSteps.items.patternDetection.title'),
            description: $_('k9shieldSteps.items.patternDetection.description'),
            icon: "ri-radar-line",
            step: $_('k9shieldSteps.items.patternDetection.step')
        },
        {
            title: $_('k9shieldSteps.items.logging.title'),
            description: $_('k9shieldSteps.items.logging.description'),
            icon: "ri-file-chart-line",
            step: $_('k9shieldSteps.items.logging.step')
        },
        {
            title: $_('k9shieldSteps.items.errorHandling.title'),
            description: $_('k9shieldSteps.items.errorHandling.description'),
            icon: "ri-error-warning-line",
            step: $_('k9shieldSteps.items.errorHandling.step')
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('k9shieldSteps.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('k9shieldSteps.subtitle')}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each shieldSteps as step}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 relative overflow-hidden group hover:bg-cWhiteGray transition-all duration-300">
                <div class="absolute -top-3 -right-3 font-bold opacity-5 text-8xl select-none transition-all duration-300 group-hover:opacity-15">
                    {step.step}
                </div>
                <div class="relative z-10">
                    <div class="mb-2">
                        <i class="{step.icon} text-2xl text-white/50"></i>
                    </div>
                    <h4 class="text-lg font-semibold mb-2">{step.title}</h4>
                    <p class="text-white/50 text-sm leading-relaxed">{step.description}</p>
                </div>
            </div>
            {/each}
        </div>
    </div>
</section>