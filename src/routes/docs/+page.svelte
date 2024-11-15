<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;
    let activeTab = 'overview';

    const sections = [
        {
            id: 'overview',
            title: "System Overview",
            description: "Understanding K9Crypt's architecture and security features",
            icon: "ri-shield-keyhole-fill",
            content: {
                introduction: "K9Crypt is a state-of-the-art end-to-end encrypted messaging platform built with security and privacy at its core. The system utilizes advanced encryption standards (AES-256-GCM) and implements perfect forward secrecy.",
                features: [
                    {
                        title: "End-to-End Encryption",
                        description: "All messages are encrypted on the client-side before transmission, ensuring that only intended recipients can read the messages."
                    },
                    {
                        title: "No Account Required",
                        description: "Use the platform without creating an account, maximizing privacy and anonymity."
                    },
                    {
                        title: "Auto-Delete Messages",
                        description: "Messages are automatically deleted after 2 hours for enhanced security."
                    },
                    {
                        title: "Perfect Forward Secrecy",
                        description: "New encryption keys for each session prevent decryption of past messages if a key is compromised."
                    }
                ]
            }
        },
        {
            id: 'module',
            title: "K9Crypt Module",
            description: "Integrate K9Crypt's encryption capabilities into your own projects",
            icon: "ri-code-box-fill",
            content: {
                installation: "npm install k9crypt",
                basicUsage: `const k9crypt = require('k9crypt');

async function test() {
    const secretKey = 'VeryLongSecretKey!@#1234567890';
    const encryptor = new k9crypt(secretKey);
    const plaintext = 'Hello, World!';

    try {
        const encrypted = await encryptor.encrypt(plaintext);
        console.log('Encrypted data:', encrypted);

        const decrypted = await encryptor.decrypt(encrypted);
        console.log('Decrypted data:', decrypted);
    } catch (error) {
        console.error('Encryption error:', error);
    }
}

test();`,
                features: [
                    {
                        title: "Secure Key Generation",
                        description: "Built-in secure key generation using crypto.randomBytes"
                    },
                    {
                        title: "Multiple Encryption Algorithms",
                        description: "Support for various encryption algorithms including AES-256-GCM and AES-256-CBC"
                    },
                    {
                        title: "Automatic IV Generation",
                        description: "Secure initialization vector generation for each encryption operation"
                    }
                ]
            }
        },
        {
            id: 'rooms',
            title: "Secure Rooms",
            description: "Create and manage end-to-end encrypted chat rooms",
            icon: "ri-group-fill",
            steps: [
                {
                    title: "Room Creation",
                    description: "Create a secure room with optional password protection. Each room has its own encryption keys.",
                    details: [
                        "Generate unique room ID",
                        "Set up encryption keys",
                        "Configure optional password",
                        "Initialize secure WebSocket connection"
                    ]
                },
                {
                    title: "Joining Rooms",
                    description: "Join existing rooms securely with proper authentication and key exchange.",
                    details: [
                        "Verify room existence",
                        "Authenticate with password if required",
                        "Exchange encryption keys",
                        "Establish secure connection"
                    ]
                },
                {
                    title: "Message Security",
                    description: "All messages are encrypted end-to-end with perfect forward secrecy.",
                    details: [
                        "Client-side encryption",
                        "Secure key rotation",
                        "Message authentication",
                        "Automatic deletion after 2 hours"
                    ]
                },
                {
                    title: "Privacy Features",
                    description: "Additional privacy features to protect user data.",
                    details: [
                        "No message storage",
                        "No user tracking",
                        "No metadata collection",
                        "Secure WebSocket protocol"
                    ]
                }
            ]
        },
        {
            id: 'messages',
            title: "One-Time Messages",
            description: "Send encrypted one-time messages that self-destruct after reading",
            icon: "ri-lock-fill",
            steps: [
                {
                    title: "Message Creation",
                    description: "Create encrypted messages with advanced security features.",
                    details: [
                        "Client-side encryption",
                        "Unique message ID",
                    ]
                },
                {
                    title: "Secure Sharing",
                    description: "Share messages securely using separate channels for link and password.",
                    details: [
                        "Generate secure access link",
                        "Create separate password",
                    ]
                },
                {
                    title: "Message Access",
                    description: "Recipients can securely access and decrypt messages.",
                    details: [
                        "Verify message existence",
                        "Password authentication",
                        "Client-side decryption",
                    ]
                },
                {
                    title: "Security Measures",
                    description: "Additional security features for message protection.",
                    details: [
                        "Rate limiting",
                        "Brute force protection"
                    ]
                }
            ]
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
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Comprehensive guide to K9Crypt's features, security measures, and integration options.</p>
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

                {#if section.id === 'overview'}
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
                {/if}

                {#if section.id === 'module'}
                <div class="space-y-6">
                    <div>
                        <h3 class="text-lg font-semibold mb-3">Installation</h3>
                        <div class="bg-black/30 rounded p-3 flex items-center justify-between">
                            <code class="text-white/70">{section.content.installation}</code>
                            <button class="text-white/30 hover:text-white/50 transition-colors" title="Copy to clipboard">
                                <i class="ri-file-copy-line"></i>
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-3">Implementation Example</h3>
                        <div class="bg-black/30 rounded p-4 overflow-x-auto">
                            <pre class="text-sm"><code class="text-white/70">{section.content.basicUsage}</code></pre>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-lg font-semibold mb-3">Key Features</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {#each section.content.features as feature}
                            <div class="border border-white/5 rounded p-4">
                                <h4 class="font-medium mb-2">{feature.title}</h4>
                                <p class="text-white/50 text-sm">{feature.description}</p>
                            </div>
                            {/each}
                        </div>
                    </div>
                </div>
                {/if}

                {#if section.id === 'rooms' || section.id === 'messages'}
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each section.steps as step}
                    <div class="border border-white/5 rounded p-5">
                        <h3 class="text-lg font-semibold mb-3">{step.title}</h3>
                        <p class="text-white/70 text-sm mb-4">{step.description}</p>
                        <ul class="space-y-2">
                            {#each step.details as detail}
                            <li class="flex items-center gap-2 text-white/50 text-sm">
                                <i class="ri-checkbox-circle-fill text-cYellow"></i>
                                {detail}
                            </li>
                            {/each}
                        </ul>
                    </div>
                    {/each}
                </div>
                {/if}
            </div>
            {/if}
            {/each}

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 sm:p-8">
                <div class="flex items-center gap-3 mb-6">
                    <i class="ri-customer-service-fill text-2xl text-cYellow"></i>
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold">Need Support?</h2>
                        <p class="text-white/50 text-sm mt-1">We're here to help you with any questions or issues.</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a href="https://github.com/k9crypt" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 rounded border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-github-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">GitHub</h3>
                            <p class="text-white/50 text-sm">Report issues & contribute</p>
                        </div>
                    </a>

                    <a href="mailto:support@k9crypt.xyz" class="flex items-center gap-3 p-4 rounded border border-white/5 hover:bg-white/5 transition-all duration-300">
                        <i class="ri-mail-fill text-2xl"></i>
                        <div>
                            <h3 class="font-medium">Email Support</h3>
                            <p class="text-white/50 text-sm">Get direct assistance</p>
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