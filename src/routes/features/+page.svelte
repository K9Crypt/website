<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;
    let activeTab: 'security' | 'privacy' | 'rooms' | 'overview' = 'overview';

    const sections = [
        {
            id: 'overview',
            title: "Overview",
            description: "Key features of K9Crypt",
            icon: "ri-apps-fill",
            content: {
                introduction: "K9Crypt combines powerful security features with ease of use to provide the most secure messaging experience.",
                features: [
                    {
                        title: "End-to-End Encryption",
                        description: "Military-grade encryption ensures your messages remain private and secure."
                    },
                    {
                        title: "Message Auto-Delete",
                        description: "Messages automatically delete after 2 hours for enhanced security."
                    },
                    {
                        title: "Anonymous Usage",
                        description: "Use K9Crypt without creating an account or sharing personal information."
                    },
                    {
                        title: "Secure Rooms",
                        description: "Create encrypted chat rooms for group conversations."
                    }
                ]
            }
        },
        {
            id: 'security',
            title: "Security",
            description: "Advanced encryption features",
            icon: "ri-shield-keyhole-fill",
            content: {
                introduction: "Our security features are designed to provide the highest level of protection for your communications.",
                features: [
                    {
                        title: "AES-256 Encryption",
                        description: "Industry-standard encryption algorithm for maximum security."
                    },
                    {
                        title: "Zero-Knowledge Architecture",
                        description: "We can't read your messages - only you and your recipients can."
                    },
                    {
                        title: "No Plaintext Storage",
                        description: "Messages are never stored in readable format on our servers."
                    },
                    {
                        title: "Secure Key Exchange",
                        description: "Advanced key exchange protocols ensure secure communication."
                    }
                ]
            }
        },
        {
            id: 'privacy',
            title: "Privacy",
            description: "Your privacy is our priority",
            icon: "ri-user-unfollow-fill",
            content: {
                introduction: "We've built K9Crypt with privacy at its core, ensuring your personal information stays private.",
                features: [
                    {
                        title: "No Registration Required",
                        description: "Use the platform without creating an account."
                    },
                    {
                        title: "No Personal Data Collection",
                        description: "We don't collect or store any personal information."
                    },
                    {
                        title: "Complete Anonymity",
                        description: "Your identity remains private throughout your usage."
                    },
                    {
                        title: "Auto Message Deletion",
                        description: "Messages are automatically deleted after 2 hours."
                    }
                ]
            }
        },
        {
            id: 'rooms',
            title: "Secure Rooms",
            description: "Group messaging features",
            icon: "ri-group-fill",
            content: {
                introduction: "Create and manage secure rooms for private group conversations with complete encryption.",
                features: [
                    {
                        title: "Private Room Creation",
                        description: "Create encrypted rooms for secure group chats."
                    },
                    {
                        title: "Secure Invitations",
                        description: "Invite members using encrypted invitation links."
                    },
                    {
                        title: "Group Encryption",
                        description: "All group messages are end-to-end encrypted."
                    },
                    {
                        title: "Member Privacy",
                        description: "Group members remain anonymous to each other."
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Features</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Discover the powerful features that make K9Crypt the most secure messaging platform.</p>
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
                        <h2 class="text-xl sm:text-2xl font-bold">Ready to Get Started?</h2>
                        <p class="text-white/50 text-sm mt-1">Experience the most secure messaging platform today.</p>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row gap-4">
                    <a href="/start" class="flex items-center bg-cYellow text-black py-2.5 px-10 rounded-lg font-medium justify-center">
                        Get Started
                    </a>
                    <a href="/docs" class="flex items-center border bg-cYellow/10 border-cYellow text-cYellow py-2.5 px-10 rounded-lg font-medium justify-center">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />