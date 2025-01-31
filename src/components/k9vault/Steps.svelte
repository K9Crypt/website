<script lang="ts">
    import { _ } from 'svelte-i18n';

    const shieldSteps = [
        {
            title: $_('k9vault.steps.items.installation.title'),
            description: $_('k9vault.steps.items.installation.description'),
            icon: "ri-download-cloud-line",
            step: $_('k9vault.steps.items.installation.step')
        },
        {
            title: $_('k9vault.steps.items.photoEncryption.title'),
            description: $_('k9vault.steps.items.photoEncryption.description'),
            icon: "ri-image-line",
            step: $_('k9vault.steps.items.photoEncryption.step')
        },
        {
            title: $_('k9vault.steps.items.copyKey.title'),
            description: $_('k9vault.steps.items.copyKey.description'),
            icon: "ri-key-line",
            step: $_('k9vault.steps.items.copyKey.step')
        },
        {
            title: $_('k9vault.steps.items.photoDecryption.title'),
            description: $_('k9vault.steps.items.photoDecryption.description'),
            icon: "ri-lock-line",
            step: $_('k9vault.steps.items.photoDecryption.step')
        },
        {
            title: $_('k9vault.steps.items.complete.title'),
            description: $_('k9vault.steps.items.complete.description'),
            icon: "ri-check-line",
            step: $_('k9vault.steps.items.complete.step')
        }
    ];
</script>

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-4 sm:mb-8">
            <h2 class="py-1 text-2xl sm:text-3xl md:text-3xl font-bold mb-3 max-w-md">{$_('k9vault.steps.title')}</h2>
            <p class="text-white/50 text-sm sm:text-base">{$_('k9vault.steps.subtitle')}</p>
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