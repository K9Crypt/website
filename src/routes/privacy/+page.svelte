<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { _ } from 'svelte-i18n';

    let activeTab = 'data';

    const sections = [
        {
            id: 'data',
            title: $_('privacyPage.dataCollection.title'),
            description: $_('privacyPage.dataCollection.description'),
            icon: "ri-database-2-fill",
            content: {
                introduction: $_('privacyPage.dataCollection.introduction'),
                features: [
                    {
                        title: $_('privacyPage.dataCollection.features.noPersonalData.title'),
                        description: $_('privacyPage.dataCollection.features.noPersonalData.description')
                    },
                    {
                        title: $_('privacyPage.dataCollection.features.noCookies.title'),
                        description: $_('privacyPage.dataCollection.features.noCookies.description')
                    },
                    {
                        title: $_('privacyPage.dataCollection.features.noUserTracking.title'),
                        description: $_('privacyPage.dataCollection.features.noUserTracking.description')
                    },
                    {
                        title: $_('privacyPage.dataCollection.features.noRegistration.title'),
                        description: $_('privacyPage.dataCollection.features.noRegistration.description')
                    }
                ]
            }
        },
        {
            id: 'security',
            title: $_('privacyPage.messageSecurity.title'),
            description: $_('privacyPage.messageSecurity.description'),
            icon: "ri-lock-2-fill",
            content: {
                introduction: $_('privacyPage.messageSecurity.introduction'),
                features: [
                    {
                        title: $_('privacyPage.messageSecurity.features.endToEndEncryption.title'),
                        description: $_('privacyPage.messageSecurity.features.endToEndEncryption.description')
                    },
                    {
                        title: $_('privacyPage.messageSecurity.features.autoDeletion.title'),
                        description: $_('privacyPage.messageSecurity.features.autoDeletion.description')
                    },
                    {
                        title: $_('privacyPage.messageSecurity.features.noBackups.title'),
                        description: $_('privacyPage.messageSecurity.features.noBackups.description')
                    },
                    {
                        title: $_('privacyPage.messageSecurity.features.secureProtocol.title'),
                        description: $_('privacyPage.messageSecurity.features.secureProtocol.description')
                    }
                ]
            }
        },
        {
            id: 'third-party',
            title: $_('privacyPage.thirdParties.title'),
            description: $_('privacyPage.thirdParties.description'),
            icon: "ri-share-forward-fill",
            content: {
                introduction: $_('privacyPage.thirdParties.introduction'),
                features: [
                    {
                        title: $_('privacyPage.thirdParties.features.noDataSharing.title'),
                        description: $_('privacyPage.thirdParties.features.noDataSharing.description')
                    },
                    {
                        title: $_('privacyPage.thirdParties.features.noAnalytics.title'),
                        description: $_('privacyPage.thirdParties.features.noAnalytics.description')
                    },
                    {
                        title: $_('privacyPage.thirdParties.features.noAds.title'),
                        description: $_('privacyPage.thirdParties.features.noAds.description')
                    },
                    {
                        title: $_('privacyPage.thirdParties.features.independentOperation.title'),
                        description: $_('privacyPage.thirdParties.features.independentOperation.description')
                    }
                ]
            }
        },
        {
            id: 'rights',
            title: $_('privacyPage.yourRights.title'),
            description: $_('privacyPage.yourRights.description'),
            icon: "ri-shield-user-fill",
            content: {
                introduction: $_('privacyPage.yourRights.introduction'),
                features: [
                    {
                        title: $_('privacyPage.yourRights.features.messageControl.title'),
                        description: $_('privacyPage.yourRights.features.messageControl.description')
                    },
                    {
                        title: $_('privacyPage.yourRights.features.anonymity.title'),
                        description: $_('privacyPage.yourRights.features.anonymity.description')
                    },
                    {
                        title: $_('privacyPage.yourRights.features.secureCommunication.title'),
                        description: $_('privacyPage.yourRights.features.secureCommunication.description')
                    },
                    {
                        title: $_('privacyPage.yourRights.features.dataPortability.title'),
                        description: $_('privacyPage.yourRights.features.dataPortability.description')
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('privacyPage.title')}</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('privacyPage.description')}</p>
            <p class="text-white/50 text-sm mt-2">{$_('privacyPage.lastUpdated')}</p>
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
                        <h2 class="text-xl sm:text-2xl font-bold">{$_('privacyPage.contactUs.title')}</h2>
                        <p class="text-white/50 text-sm mt-1">{$_('privacyPage.contactUs.description')}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:hi@k9crypt.xyz" class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-mail-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">{$_('privacyPage.contactUs.emailUs.title')}</h3>
                            <p class="text-white/50 text-sm">{$_('privacyPage.contactUs.emailUs.description')}</p>
                        </div>
                    </a>

                    <a href="https://github.com/k9crypt" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-github-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">{$_('privacyPage.contactUs.github.title')}</h3>
                            <p class="text-white/50 text-sm">{$_('privacyPage.contactUs.github.description')}</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<Footer />