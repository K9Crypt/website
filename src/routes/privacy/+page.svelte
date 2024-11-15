<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;
    let activeTab = 'data';

    const sections = [
        {
            id: 'data',
            title: "Data Collection",
            description: "We do not collect any personal information. K9Crypt operates with complete anonymity.",
            icon: "ri-database-2-fill",
            content: {
                introduction: "K9Crypt is built on the foundation of privacy and anonymity. We believe in providing secure communication without compromising user privacy.",
                features: [
                    {
                        title: "No Personal Data",
                        description: "We do not collect or store any personal information, including IP addresses or device data."
                    },
                    {
                        title: "No Cookies",
                        description: "Our service operates without using any cookies or tracking mechanisms."
                    },
                    {
                        title: "No User Tracking",
                        description: "We do not implement any analytics or tracking scripts to monitor user behavior."
                    },
                    {
                        title: "No Registration",
                        description: "Use our service without creating an account or providing any personal information."
                    }
                ]
            }
        },
        {
            id: 'security',
            title: "Message Security",
            description: "Your messages are protected with industry-standard encryption methods.",
            icon: "ri-lock-2-fill",
            content: {
                introduction: "We implement robust security measures to ensure your messages remain private and secure throughout their lifecycle.",
                features: [
                    {
                        title: "End-to-End Encryption",
                        description: "All messages are encrypted on your device before transmission."
                    },
                    {
                        title: "Auto-Deletion",
                        description: "Messages are automatically deleted after 2 hours for enhanced security."
                    },
                    {
                        title: "No Backups",
                        description: "We do not keep any backups or copies of your messages."
                    },
                    {
                        title: "Secure Protocol",
                        description: "All communications use secure WebSocket connections with TLS encryption."
                    }
                ]
            }
        },
        {
            id: 'third-party',
            title: "Third Parties",
            description: "We do not share any information with third parties.",
            icon: "ri-share-forward-fill",
            content: {
                introduction: "Your privacy is our priority. We operate independently and do not share any data with third parties.",
                features: [
                    {
                        title: "No Data Sharing",
                        description: "We never share or sell any information to third parties."
                    },
                    {
                        title: "No Analytics",
                        description: "We do not use third-party analytics services."
                    },
                    {
                        title: "No Ads",
                        description: "Our service is free from advertisements and tracking scripts."
                    },
                    {
                        title: "Independent Operation",
                        description: "We maintain full control over our infrastructure and services."
                    }
                ]
            }
        },
        {
            id: 'rights',
            title: "Your Rights",
            description: "You have complete control over your data and messages.",
            icon: "ri-shield-user-fill",
            content: {
                introduction: "We respect and protect your digital rights, ensuring you maintain control over your communication.",
                features: [
                    {
                        title: "Message Control",
                        description: "Delete your messages at any time before the auto-deletion period."
                    },
                    {
                        title: "Anonymity",
                        description: "Maintain your anonymity throughout your use of our service."
                    },
                    {
                        title: "Secure Communication",
                        description: "Right to encrypted, private communication without surveillance."
                    },
                    {
                        title: "Data Portability",
                        description: "Export your active messages when needed."
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">At K9Crypt, we take your privacy seriously. Our service is built around the principle of complete anonymity and security.</p>
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
                        <h2 class="text-xl sm:text-2xl font-bold">Contact Us</h2>
                        <p class="text-white/50 text-sm mt-1">Have questions about our privacy policy? We're here to help.</p>
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

                    <a href="https://github.com/k9crypt" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-github-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">GitHub</h3>
                            <p class="text-white/50 text-sm">Visit our repository</p>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />