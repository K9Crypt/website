<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { _ } from 'svelte-i18n';

    let activeTab: 'security' | 'privacy' | 'rooms' | 'overview' = 'overview';

    const sections = [
        {
            id: 'overview',
            title: $_('features.overview.title'),
            description: $_('features.overview.description'),
            icon: "ri-apps-fill",
            content: {
                introduction: $_('features.overview.content.introduction'),
                features: [
                    {
                        title: $_('features.overview.content.features.encryption.title'),
                        description: $_('features.overview.content.features.encryption.description')
                    },
                    {
                        title: $_('features.overview.content.features.autoDelete.title'),
                        description: $_('features.overview.content.features.autoDelete.description')
                    },
                    {
                        title: $_('features.overview.content.features.anonymous.title'),
                        description: $_('features.overview.content.features.anonymous.description')
                    },
                    {
                        title: $_('features.overview.content.features.secureRooms.title'),
                        description: $_('features.overview.content.features.secureRooms.description')
                    }
                ]
            }
        },
        {
            id: 'security',
            title: $_('features.security.title'),
            description: $_('features.security.description'),
            icon: "ri-shield-keyhole-fill",
            content: {
                introduction: $_('features.security.content.introduction'),
                features: [
                    {
                        title: $_('features.security.content.features.aes.title'),
                        description: $_('features.security.content.features.aes.description')
                    },
                    {
                        title:  $_('features.security.content.features.zeroKnowledge.title'),
                        description: $_('features.security.content.features.zeroKnowledge.description')
                    },
                    {
                        title: $_('features.security.content.features.noPlaintext.title'),
                        description: $_('features.security.content.features.noPlaintext.description')
                    },
                     {
                        title: $_('features.security.content.features.secureKey.title'),
                        description: $_('features.security.content.features.secureKey.description')
                    }
                ]
            }
        },
        {
            id: 'privacy',
            title: $_('features.privacy.title'),
            description: $_('features.privacy.description'),
            icon: "ri-user-unfollow-fill",
            content: {
                introduction: $_('features.privacy.content.introduction'),
                features: [
                    {
                        title: $_('features.privacy.content.features.noRegistration.title'),
                        description: $_('features.privacy.content.features.noRegistration.description')
                    },
                    {
                        title: $_('features.privacy.content.features.noDataCollection.title'),
                        description: $_('features.privacy.content.features.noDataCollection.description')
                    },
                    {
                        title: $_('features.privacy.content.features.anonymity.title'),
                        description: $_('features.privacy.content.features.anonymity.description')
                    },
                    {
                        title: $_('features.privacy.content.features.autoDeletion.title'),
                        description: $_('features.privacy.content.features.autoDeletion.description')
                    }
                ]
            }
        },
        {
            id: 'rooms',
            title: $_('features.rooms.title'),
            description: $_('features.rooms.description'),
            icon: "ri-group-fill",
            content: {
                introduction: $_('features.rooms.content.introduction'),
                features: [
                    {
                        title: $_('features.rooms.content.features.privateRoom.title'),
                        description: $_('features.rooms.content.features.privateRoom.description')
                    },
                    {
                        title: $_('features.rooms.content.features.secureInvitations.title'),
                        description: $_('features.rooms.content.features.secureInvitations.description')
                    },
                    {
                        title: $_('features.rooms.content.features.groupEncryption.title'),
                        description: $_('features.rooms.content.features.groupEncryption.description')
                    },
                    {
                        title: $_('features.rooms.content.features.memberPrivacy.title'),
                        description: $_('features.rooms.content.features.memberPrivacy.description')
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('features.title')}</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('features.subtitle')}</p>
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
                    <i class="ri-rocket-fill text-2xl text-cYellow"></i>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold">{$_('features.readyToStart.title')}</h2>
                        <p class="text-white/50 text-sm mt-1">{$_('features.readyToStart.description')}</p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="/start" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center">
                        {$_('features.readyToStart.getStarted')}
                    </a>
                    <a href="/docs" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center">
                        {$_('features.readyToStart.learnMore')}
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<Footer />