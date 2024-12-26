<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;
    let activeTab: 'company' | 'values' | 'team' = 'company';

    const teamMembers = [
        {
            name: "Fatih Yılmaz",
            role: "Founder & CEO",
            description: "Fatih Yilmaz, founder and CEO of K9Crypt, is a technology leader who develops innovative web solutions with the user experience at the forefront.",
            socials: {
                github: "https://github.com/queaxtra",
                twitter: "https://x.com/queaxtra",
                linkedin: "https://linkedin.com/in/queaxtra",
                mail: "mailto:queaxtra@k9crypt.xyz",
            }
        },
        {
            name: "Emin Bıyıkçı",
            role: "CEO & Front-end Developer",
            description: "Emin, experienced front-end developer with a passion for creating visually appealing and user-friendly interfaces.",
            socials: {
                github: "https://github.com/eminexedev",
                mail: "mailto:emin@k9crypt.xyz",
            }
        },
        {
            name: "Patrick H.",
            role: "Full-Stack Developer",
            description: "Patrick is a skilled full-stack developer with expertise in both front-end and back-end technologies.",
            socials: {
                github: "https://github.com/dracho",
                mail: "mailto:patrick@k9crypt.xyz",
            }
        }
    ];

    const companyInfo = {
        mission: "To provide the most secure and private messaging platform while maintaining simplicity and accessibility for everyone.",
        vision: "Creating a world where private communication is a fundamental right, not a luxury.",
        values: [
            "Privacy First",
            "Security by Design",
            "User Empowerment",
            "Transparency"
        ],
        story: "Founded in June 2024, K9Crypt grew out of a simple idea: communication should be private by default. Our team of developers came together to build a platform that makes secure messaging accessible to everyone."
    };

    const sections = [
        {
            id: 'company',
            title: "Company",
            description: "Learn about K9Crypt's mission and vision",
            icon: "ri-building-fill",
            content: {
                introduction: companyInfo.story,
                features: [
                    {
                        title: "Our Mission",
                        description: companyInfo.mission
                    },
                    {
                        title: "Our Vision",
                        description: companyInfo.vision
                    },
                    {
                        title: "Privacy First",
                        description: "We believe privacy is a fundamental right, not a feature."
                    },
                    {
                        title: "Security by Design",
                        description: "Security is built into every aspect of our platform."
                    }
                ]
            }
        },
        {
            id: 'values',
            title: "Our Values",
            description: "The principles that guide our work",
            icon: "ri-heart-fill",
            content: {
                introduction: "At K9Crypt, our values shape everything we do. They guide our decisions, influence our product development, and define our company culture.",
                features: companyInfo.values.map(value => {
                    const descriptions = {
                        "Privacy First": "We prioritize user privacy in every decision we make.",
                        "Security by Design": "Security is never an afterthought, but the foundation of our platform.",
                        "User Empowerment": "We give users complete control over their communication.",
                        "Transparency": "We maintain open and honest communication with our users."
                    };
                    return {
                        title: value,
                        description: descriptions[value]
                    };
                })
            }
        },
        {
            id: 'team',
            title: "Our Team",
            description: "Meet the people behind K9Crypt",
            icon: "ri-team-fill",
            content: {
                introduction: "Our team consists of passionate individuals dedicated to making secure communication accessible to everyone.",
                members: teamMembers
            }
        },
        {
            id: 'contact',
            title: "Contact",
            description: "Get in touch with us",
            icon: "ri-customer-service-fill",
            content: {
                introduction: "Have questions, suggestions, or want to join our team? We'd love to hear from you.",
                contacts: [
                    {
                        title: "General Inquiries",
                        email: "hi@k9crypt.xyz",
                        icon: "ri-mail-fill"
                    },
                    {
                        title: "Support",
                        email: "support@k9crypt.xyz",
                        icon: "ri-customer-service-fill"
                    }
                ]
            }
        }
    ];

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

<Navbar />

<section class="min-h-screen py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-8 animate-pulse">
            <div class="space-y-3">
                <div class="h-8 bg-cWhiteGray rounded-lg w-64"></div>
                <div class="h-4 bg-cWhiteGray rounded-lg w-96"></div>
            </div>

            {#each Array(4) as _}
            <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6 space-y-4">
                <div class="h-6 bg-cWhiteGray rounded-lg w-48"></div>
                <div class="h-40 bg-cWhiteGray rounded-lg"></div>
            </div>
            {/each}
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">About K9Crypt</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Dedicated to making secure communication accessible to everyone.</p>
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
        {/if}
    </div>
</section>

<Footer />