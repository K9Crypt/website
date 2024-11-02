<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;

    const sections = [
        {
            title: "K9Crypt Module",
            description: "Learn how to use the K9Crypt encryption module in your projects.",
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

test();`
            }
        },
        {
            title: "Creating & Managing Rooms",
            description: "Learn how to create and manage secure chat rooms.",
            icon: "ri-group-fill",
            steps: [
                {
                    title: "Create a Room",
                    description: "Click the 'Create Room' button on the homepage or navigate to /create/room.",
                },
                {
                    title: "Room Settings",
                    description: "Set your room name and optional password for added security.",
                },
                {
                    title: "Invite Members",
                    description: "Share the generated room link with others. If you set a password, share it securely.",
                },
                {
                    title: "Start Chatting",
                    description: "Once members join, you can start secure conversations. Messages auto-delete after 2 hours.",
                }
            ]
        },
        {
            title: "Encrypted Messages",
            description: "Learn how to create and decrypt secure messages.",
            icon: "ri-lock-fill",
            steps: [
                {
                    title: "Create Message",
                    description: "Navigate to /create/message and enter your message content.",
                },
                {
                    title: "Get Link & Password",
                    description: "System generates a secure link and password for your message.",
                },
                {
                    title: "Share Securely",
                    description: "Share the link and password separately for maximum security.",
                },
                {
                    title: "Decrypt Message",
                    description: "Recipients use the link and password to decrypt and view the message.",
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

<section class="py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-8 animate-pulse">
            <div class="space-y-3">
                <div class="h-8 bg-cWhiteGray rounded w-64"></div>
                <div class="h-4 bg-cWhiteGray rounded w-96"></div>
            </div>

            {#each Array(3) as _}
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 space-y-4">
                <div class="h-6 bg-cWhiteGray rounded w-48"></div>
                <div class="h-40 bg-cWhiteGray rounded"></div>
            </div>
            {/each}
        </div>
        {:else}
        <div class="mb-8 sm:mb-12">
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Documentation</h1>
            <p class="text-white/50 text-sm sm:text-base max-w-3xl">Learn how to use K9Crypt's features and encryption module.</p>
        </div>

        <div class="space-y-8">
            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <div class="flex items-center gap-2 mb-4">
                    <i class="{sections[0].icon} text-xl"></i>
                    <h2 class="text-xl font-semibold">{sections[0].title}</h2>
                </div>
                <p class="text-white/50 text-sm mb-6">{sections[0].description}</p>
                
                <div class="space-y-4">
                    <div>
                        <h3 class="text-lg font-medium mb-2">Installation</h3>
                        <div class="bg-black/30 rounded p-3">
                            <code class="text-white/50">{sections[0].content.installation}</code>
                        </div>
                    </div>
                    
                    <div>
                        <h3 class="text-lg font-medium mb-2">Basic Usage</h3>
                        <div class="bg-black/30 rounded p-3">
                            <pre><code class="text-white/50">{sections[0].content.basicUsage}</code></pre>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <div class="flex items-center gap-2 mb-4">
                    <i class="{sections[1].icon} text-xl"></i>
                    <h2 class="text-xl font-semibold">{sections[1].title}</h2>
                </div>
                <p class="text-white/50 text-sm mb-6">{sections[1].description}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each sections[1].steps as step, i}
                    <div class="border border-white/5 rounded p-4 relative">
                        <h4 class="text-lg font-medium mb-2">{step.title}</h4>
                        <p class="text-white/50 text-sm">{step.description}</p>
                    </div>
                    {/each}
                </div>
            </div>

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <div class="flex items-center gap-2 mb-4">
                    <i class="{sections[2].icon} text-xl"></i>
                    <h2 class="text-xl font-semibold">{sections[2].title}</h2>
                </div>
                <p class="text-white/50 text-sm mb-6">{sections[2].description}</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {#each sections[2].steps as step, i}
                    <div class="border border-white/5 rounded p-4 relative">
                        <h4 class="text-lg font-medium mb-2">{step.title}</h4>
                        <p class="text-white/50 text-sm">{step.description}</p>
                    </div>
                    {/each}
                </div>
            </div>

            <div class="bg-cWhiteGray border border-white/5 rounded p-6 hover:bg-cWhiteGray transition-all duration-300">
                <h3 class="text-lg font-semibold mb-4">Need More Help?</h3>
                <p class="text-white/50 text-sm mb-4">If you need additional assistance or have questions, feel free to reach out:</p>
                <div class="flex gap-4">
                    <a href="https://github.com/k9crypt" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-github-fill mr-2"></i>
                        GitHub Issues
                    </a>
                    <a href="mailto:support@k9crypt.xyz" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-mail-fill mr-2"></i>
                        Email Support
                    </a>
                    <a href="https://discord.gg/k9crypt" class="flex items-center text-sm text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-discord-fill mr-2"></i>
                        Discord Community
                    </a>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />