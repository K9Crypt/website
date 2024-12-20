<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;
    let activeTab = 'usage';

    const sections = [
        {
            id: 'usage',
            title: "Service Usage",
            description: "Guidelines for using K9Crypt's messaging services.",
            icon: "ri-service-fill",
            content: {
                introduction: "K9Crypt is designed to provide secure and private messaging services. To maintain the integrity and security of our platform, users must adhere to these usage guidelines.",
                features: [
                    {
                        title: "Age Requirement",
                        description: "Users must be 13 years or older to use K9Crypt's services."
                    },
                    {
                        title: "Legal Usage",
                        description: "No illegal content, activities, or violation of applicable laws."
                    },
                    {
                        title: "Fair Usage",
                        description: "No spamming, automated usage, or abuse of the service."
                    },
                    {
                        title: "Service Integrity",
                        description: "No interference with service operations or security measures."
                    }
                ]
            }
        },
        {
            id: 'responsibilities',
            title: "User Responsibilities",
            description: "Your obligations while using K9Crypt services.",
            icon: "ri-user-settings-fill",
            content: {
                introduction: "Users of K9Crypt have certain responsibilities to maintain the security and integrity of the service. These responsibilities help ensure a safe environment for all users.",
                features: [
                    {
                        title: "Security Practices",
                        description: "Maintain message security and follow recommended encryption practices."
                    },
                    {
                        title: "Vulnerability Reporting",
                        description: "Report any security vulnerabilities or bugs to our team."
                    },
                    {
                        title: "Access Control",
                        description: "No unauthorized access attempts or sharing of access credentials."
                    },
                    {
                        title: "Responsible Usage",
                        description: "Use encryption features responsibly and ethically."
                    }
                ]
            }
        },
        {
            id: 'changes',
            title: "Service Changes",
            description: "Our rights regarding service modifications.",
            icon: "ri-settings-fill",
            content: {
                introduction: "K9Crypt reserves the right to modify, update, or change aspects of our service to maintain quality and security. We strive to communicate significant changes to our users.",
                features: [
                    {
                        title: "Feature Modifications",
                        description: "Right to add, modify, or remove features as needed."
                    },
                    {
                        title: "Service Availability",
                        description: "May change service availability or access methods."
                    },
                    {
                        title: "Terms Updates",
                        description: "Right to update terms and conditions with notice."
                    },
                    {
                        title: "System Maintenance",
                        description: "Perform necessary maintenance and improvements."
                    }
                ]
            }
        },
        {
            id: 'limitations',
            title: "Limitations",
            description: "Service limitations and disclaimers.",
            icon: "ri-error-warning-fill",
            content: {
                introduction: "While we strive to provide the best possible service, there are certain limitations and disclaimers users should be aware of when using K9Crypt.",
                features: [
                    {
                        title: "Service Uptime",
                        description: "No guarantee of 100% service uptime or availability."
                    },
                    {
                        title: "Force Majeure",
                        description: "Not liable for circumstances beyond our control."
                    },
                    {
                        title: "Technical Constraints",
                        description: "Service subject to technical and operational limitations."
                    },
                    {
                        title: "Security Measures",
                        description: "Users must follow security best practices for optimal protection."
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
                <div class="h-8 bg-cWhiteGray rounded w-64"></div>
                <div class="h-4 bg-cWhiteGray rounded w-96"></div>
            </div>

            {#each Array(4) as _}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-4">
                <div class="h-6 bg-cWhiteGray rounded w-48"></div>
                <div class="h-40 bg-cWhiteGray rounded"></div>
            </div>
            {/each}
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">By using K9Crypt, you agree to these terms. Please read them carefully before using our services.</p>
            <p class="text-white/50 text-sm mt-2">Last updated: 15.11.2024</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8">
            {#each sections as section}
            <button class="w-full sm:w-auto flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 text-sm font-medium {activeTab === section.id ? 'bg-cYellow text-black' : 'bg-cWhiteGray text-white/50 hover:bg-white/10'}" on:click={() => activeTab = section.id}>
                <i class={section.icon}></i>
                {section.title}
            </button>
            {/each}
        </div>

        <div class="space-y-8">
            {#each sections as section}
            {#if activeTab === section.id}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 sm:p-8">
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
                        <div class="border border-white/5 rounded p-4">
                            <h3 class="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p class="text-white/50 text-sm">{feature.description}</p>
                        </div>
                        {/each}
                    </div>
                </div>
            </div>
            {/if}
            {/each}

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="ri-customer-service-fill text-2xl text-cYellow"></i>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold">Questions About Terms?</h2>
                        <p class="text-white/50 text-sm mt-1">We're here to help you understand our terms of service.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a href="mailto:hi@k9crypt.xyz" class="flex items-center gap-3 p-4 rounded border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-mail-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">Email Us</h3>
                            <p class="text-white/50 text-sm">hi@k9crypt.xyz</p>
                        </div>
                    </a>

                    <a href="https://discord.gg/k9crypt" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-discord-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">Discord</h3>
                            <p class="text-white/50 text-sm">Join our community</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />