<script lang="ts">
    import { _ } from 'svelte-i18n';
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';

    let activeTab: 'company' | 'values' | 'team' | 'contact' = 'company';

    const sections = [
        {
            id: 'company',
            title: $_('about.tabs.company'),
            description: $_('about.company.description'),
            icon: "ri-building-fill",
            content: {
                introduction: $_('about.company.introduction'),
                features: [
                    {
                        title: $_('about.company.features.mission.title'),
                        description: $_('about.company.features.mission.description')
                    },
                    {
                        title: $_('about.company.features.vision.title'),
                        description: $_('about.company.features.vision.description')
                    },
                    {
                        title: $_('about.company.features.privacy.title'),
                        description: $_('about.company.features.privacy.description')
                    },
                    {
                        title: $_('about.company.features.security.title'),
                        description: $_('about.company.features.security.description')
                    }
                ]
            }
        },
        {
            id: 'values',
            title: $_('about.tabs.values'),
            description: $_('about.values.description'),
            icon: "ri-heart-fill",
            content: {
                introduction: $_('about.values.introduction'),
                features: [
                    {
                        title: $_('about.values.items.privacy.title'),
                        description: $_('about.values.items.privacy.description')
                    },
                    {
                        title: $_('about.values.items.security.title'),
                        description: $_('about.values.items.security.description')
                    },
                    {
                        title: $_('about.values.items.empowerment.title'),
                        description: $_('about.values.items.empowerment.description')
                    },
                    {
                        title: $_('about.values.items.transparency.title'),
                        description: $_('about.values.items.transparency.description')
                    }
                ]
            }
        },
        {
            id: 'team',
            title: $_('about.tabs.team'),
            description: $_('about.team.description'),
            icon: "ri-team-fill",
            content: {
                introduction: $_('about.team.introduction'),
                members: [
                    {
                        name: $_('about.team.members.fatih.name'),
                        role: $_('about.team.members.fatih.role'),
                        description: $_('about.team.members.fatih.description'),
                        socials: {
                            github: "https://github.com/queaxtra",
                            twitter: "https://x.com/queaxtra",
                            linkedin: "https://linkedin.com/in/queaxtra",
                            mail: "mailto:queaxtra@k9crypt.xyz",
                        }
                    },
                    {
                        name: $_('about.team.members.emin.name'),
                        role: $_('about.team.members.emin.role'),
                        description: $_('about.team.members.emin.description'),
                        socials: {
                            github: "https://github.com/eminexedev",
                            mail: "mailto:emin@k9crypt.xyz",
                        }
                    }
                ]
            }
        },
        {
            id: 'contact',
            title: $_('about.tabs.contact'),
            description: $_('about.contact.description'),
            icon: "ri-customer-service-fill",
            content: {
                introduction: $_('about.contact.introduction'),
                contacts: [
                    {
                        title: $_('about.contact.types.general.title'),
                        email: $_('about.contact.types.general.email'),
                        icon: "ri-mail-fill"
                    },
                    {
                        title: $_('about.contact.types.support.title'),
                        email: $_('about.contact.types.support.email'),
                        icon: "ri-customer-service-fill"
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{$_('about.title')}</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">{$_('about.subtitle')}</p>
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

                {#if section.id !== 'team' && section.id !== 'contact'}
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
                {/if}

                {#if section.id === 'team'}
                <div class="space-y-6">
                    <p class="text-white/80 leading-relaxed">{section.content.introduction}</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#each section.content.members as member}
                        <div class="border border-white/5 rounded-lg p-6">
                            <h3 class="text-xl font-semibold mb-1">{member.name}</h3>
                            <p class="text-white/70 text-sm mb-3">{member.role}</p>
                            <p class="text-white/50 text-sm mb-4">{member.description}</p>
                            <div class="flex gap-4">
                                {#if member.socials.github}
                                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-white transition-colors duration-300">
                                    <i class="ri-github-fill text-xl"></i>
                                </a>
                                {/if}
                                {#if member.socials.twitter}
                                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-white transition-colors duration-300">
                                    <i class="ri-twitter-x-fill text-xl"></i>
                                </a>
                                {/if}
                                {#if member.socials.linkedin}
                                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" class="text-white/50 hover:text-white transition-colors duration-300">
                                    <i class="ri-linkedin-fill text-xl"></i>
                                </a>
                                {/if}
                                {#if member.socials.mail}
                                <a href={member.socials.mail} class="text-white/50 hover:text-white transition-colors duration-300">
                                    <i class="ri-mail-fill text-xl"></i>
                                </a>
                                {/if}
                            </div>
                        </div>
                        {/each}
                    </div>
                </div>
                {/if}

                {#if section.id === 'contact'}
                <div class="space-y-6">
                    <p class="text-white/80 leading-relaxed">{section.content.introduction}</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {#each section.content.contacts as contact}
                        <a href="mailto:{contact.email}" class="flex items-center gap-3 p-4 rounded-lg border border-white/5 hover:bg-white/5 transition-all duration-300">
                            <i class="{contact.icon} text-2xl"></i>
                            <div>
                                <h3 class="font-medium">{contact.title}</h3>
                                <p class="text-white/50 text-sm">{contact.email}</p>
                            </div>
                        </a>
                        {/each}
                    </div>
                </div>
                {/if}
            </div>
            {/if}
            {/each}
        </div>
    </div>
</section>

<Footer />