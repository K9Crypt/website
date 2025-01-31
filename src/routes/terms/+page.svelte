<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { _ } from 'svelte-i18n';

    let activeTab = 'usage';

    const sections = [
        {
            id: 'usage',
            title: $_('termsPage.serviceUsage.title'),
            description: $_('termsPage.serviceUsage.description'),
            icon: "ri-service-fill",
            content: {
                introduction: $_('termsPage.serviceUsage.introduction'),
                features: [
                    {
                        title: $_('termsPage.serviceUsage.features.ageRequirement.title'),
                        description: $_('termsPage.serviceUsage.features.ageRequirement.description')
                    },
                    {
                        title: $_('termsPage.serviceUsage.features.legalUsage.title'),
                        description: $_('termsPage.serviceUsage.features.legalUsage.description')
                    },
                    {
                        title: $_('termsPage.serviceUsage.features.fairUsage.title'),
                        description: $_('termsPage.serviceUsage.features.fairUsage.description')
                    },
                    {
                        title: $_('termsPage.serviceUsage.features.serviceIntegrity.title'),
                        description: $_('termsPage.serviceUsage.features.serviceIntegrity.description')
                    }
                ]
            }
        },
        {
            id: 'responsibilities',
            title: $_('termsPage.userResponsibilities.title'),
            description: $_('termsPage.userResponsibilities.description'),
            icon: "ri-user-settings-fill",
            content: {
                introduction: $_('termsPage.userResponsibilities.introduction'),
                features: [
                    {
                        title: $_('termsPage.userResponsibilities.features.securityPractices.title'),
                        description: $_('termsPage.userResponsibilities.features.securityPractices.description')
                    },
                    {
                         title: $_('termsPage.userResponsibilities.features.vulnerabilityReporting.title'),
                        description: $_('termsPage.userResponsibilities.features.vulnerabilityReporting.description')
                    },
                    {
                        title: $_('termsPage.userResponsibilities.features.accessControl.title'),
                        description: $_('termsPage.userResponsibilities.features.accessControl.description')
                    },
                    {
                        title: $_('termsPage.userResponsibilities.features.responsibleUsage.title'),
                        description: $_('termsPage.userResponsibilities.features.responsibleUsage.description')
                    }
                ]
            }
        },
        {
            id: 'changes',
            title:  $_('termsPage.serviceChanges.title'),
            description: $_('termsPage.serviceChanges.description'),
            icon: "ri-settings-fill",
            content: {
                introduction: $_('termsPage.serviceChanges.introduction'),
                features: [
                    {
                        title: $_('termsPage.serviceChanges.features.featureModifications.title'),
                        description: $_('termsPage.serviceChanges.features.featureModifications.description')
                    },
                    {
                        title: $_('termsPage.serviceChanges.features.serviceAvailability.title'),
                        description: $_('termsPage.serviceChanges.features.serviceAvailability.description')
                    },
                    {
                        title: $_('termsPage.serviceChanges.features.termsUpdates.title'),
                        description: $_('termsPage.serviceChanges.features.termsUpdates.description')
                    },
                     {
                        title: $_('termsPage.serviceChanges.features.systemMaintenance.title'),
                        description: $_('termsPage.serviceChanges.features.systemMaintenance.description')
                    }
                ]
            }
        },
        {
            id: 'limitations',
            title: $_('termsPage.limitations.title'),
            description: $_('termsPage.limitations.description'),
            icon: "ri-error-warning-fill",
            content: {
                introduction: $_('termsPage.limitations.introduction'),
                features: [
                    {
                        title: $_('termsPage.limitations.features.serviceUptime.title'),
                        description: $_('termsPage.limitations.features.serviceUptime.description')
                    },
                    {
                        title: $_('termsPage.limitations.features.forceMajeure.title'),
                        description: $_('termsPage.limitations.features.forceMajeure.description')
                    },
                    {
                        title: $_('termsPage.limitations.features.technicalConstraints.title'),
                        description: $_('termsPage.limitations.features.technicalConstraints.description')
                    },
                    {
                         title: $_('termsPage.limitations.features.securityMeasures.title'),
                        description: $_('termsPage.limitations.features.securityMeasures.description')
                    }
                ]
            }
        }
    ];
</script>

<Navbar />

<section class="min-h-screen py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('termsPage.title')}</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('termsPage.description')}</p>
            <p class="text-white/50 text-sm mt-2">{$_('termsPage.lastUpdated')}</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
            {#each sections as section}
            <button class="w-full sm:w-auto flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-medium {activeTab === section.id ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-white/10'}" on:click={() => activeTab = section.id}>
                <i class={section.icon}></i>
                {section.title}
            </button>
            {/each}
        </div>

        <div class="space-y-8">
            {#each sections as section}
            {#if activeTab === section.id}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="{section.icon} text-2xl text-cYellow"></i>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold">{section.title}</h2>
                        <p class="text-white/50 text-sm mt-1">{section.description}</p>
                    </div>
                </div>

                <div class="space-y-6">
                    <p class="text-white/80 leading-relaxed">{section.content.introduction}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each section.content.features as feature}
                        <div class="border border-white/5 rounded-lg p-4">
                            <h3 class="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p class="text-white/50 text-sm">{feature.description}</p>
                        </div>
                        {/each}
                    </div>
                </div>
            </div>
            {/if}
            {/each}

            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="ri-customer-service-fill text-2xl text-cYellow"></i>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold">{$_('termsPage.questionsAboutTerms.title')}</h2>
                        <p class="text-white/50 text-sm mt-1">{$_('termsPage.questionsAboutTerms.description')}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:hi@k9crypt.xyz" class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-mail-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">{$_('termsPage.questionsAboutTerms.emailUs.title')}</h3>
                            <p class="text-white/50 text-sm">{$_('termsPage.questionsAboutTerms.emailUs.description')}</p>
                        </div>
                    </a>

                    <a href="https://discord.gg/k9crypt" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-discord-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">{$_('termsPage.questionsAboutTerms.discord.title')}</h3>
                            <p class="text-white/50 text-sm">{$_('termsPage.questionsAboutTerms.discord.description')}</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<Footer />