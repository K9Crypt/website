<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { onMount } from 'svelte';

    let isLoaded = false;

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1000);
    });

    const brandAssets = {
        banner: {
            path: "https://www.upload.ee/image/17480100/K9Crypt_Banner.png",
            description: "Official K9Crypt promotional banner showcasing our commitment to secure messaging and privacy",
        },
        logos: [
            {
                name: "K9Crypt Standard Logo",
                path: "https://www.upload.ee/image/17339403/k9crypt-logo.png",
                description: "Our flagship logo representing K9Crypt's modern approach to secure messaging and data privacy",
            },
            {
                name: "K9Crypt Icon",
                path: "https://www.upload.ee/image/17339414/k9crypt-rb.png",
                description: "Compact version of our logo, perfect for app icons, favicons, and small-scale applications",
            },
            {
                name: "K9Crypt Light Logo",
                path: "https://www.upload.ee/image/17480183/k9crypt-white.png",
                description: "White version of our logo, optimized for dark backgrounds and maintaining brand visibility",
            },
            {
                name: "K9Crypt Dark Logo",
                path: "https://www.upload.ee/image/17480187/k9crypt-black.png",
                description: "Black version of our logo, designed for light backgrounds and print materials",
            }
        ],
        colors: [
            {
                name: "Background",
                hex: "#121212",
                rgb: "rgb(18, 18, 18)",
                usage: "Main background color"
            },
            {
                name: "Accent Green",
                hex: "#b9f21b",
                rgb: "rgb(185, 242, 27)",
                usage: "Primary accent color"
            },
            {
                name: "White Gray",
                hex: "#1B1B1B",
                rgb: "rgb(27, 27, 27)",
                usage: "Container background color"
            },
            {
                name: "Light Gray",
                hex: "#2C2C2C",
                rgb: "rgb(44, 44, 44)",
                usage: "Secondary container and loading elements"
            }
        ],
        typography: {
            primary: "Poppins",
            secondary: "Cutta"
        }
    };
</script>

<Navbar />

<section class="min-h-screen py-8 sm:py-12 md:py-16 px-4">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        {#if !isLoaded}
        <div class="space-y-12 animate-pulse">
            <div class="space-y-6">
                <div class="h-8 bg-cWhiteGray rounded-lg w-64"></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="h-64 bg-cWhiteGray rounded-lg"></div>
                    <div class="h-64 bg-cWhiteGray rounded-lg"></div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="h-8 bg-cWhiteGray rounded-lg w-40"></div>
                <div class="h-80 bg-cWhiteGray rounded-lg"></div>
            </div>

            <div class="space-y-6">
                <div class="h-8 bg-cWhiteGray rounded-lg w-56"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div class="h-48 bg-cWhiteGray rounded-lg"></div>
                    <div class="h-48 bg-cWhiteGray rounded-lg"></div>
                </div>
            </div>

            <div class="space-y-6">
                <div class="h-8 bg-cWhiteGray rounded-lg w-48"></div>
                <div class="h-64 bg-cWhiteGray rounded-lg"></div>
            </div>
        </div>
        {:else}
        <div class="space-y-12">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold">Brand Assets</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {#each brandAssets.logos as logo}
                    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                        <img src={logo.path} alt={logo.name} class="w-full h-32 object-contain mb-4" />
                        <h3 class="text-xl font-semibold mb-2">{logo.name}</h3>
                        <p class="text-white/50 mb-4">{logo.description}</p>
                    </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-3xl font-bold">Banner</h2>
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                    <img src={brandAssets.banner.path} alt="K9Crypt Banner" class="w-full object-cover rounded-lg mb-4" />
                    <p class="text-white/50 mb-4">{brandAssets.banner.description}</p>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-3xl font-bold">Color Palette</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {#each brandAssets.colors as color}
                    <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                        <div class="w-full h-24 rounded-lg mb-4 border border-white/5" style="background-color: {color.hex}"></div>
                        <h3 class="font-semibold mb-2">{color.name}</h3>
                        <div class="space-y-1 text-sm text-white/50">
                            <p>HEX: {color.hex}</p>
                            <p>RGB: {color.rgb}</p>
                            <p class="mt-2">{color.usage}</p>
                        </div>
                    </div>
                    {/each}
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-3xl font-bold">Typography</h2>
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-xl mb-2">Primary Font</h3>
                            <p class="text-4xl" style="font-family: {brandAssets.typography.primary}">{brandAssets.typography.primary}</p>
                            <p class="text-sm text-white/50 mt-2">Main font used throughout the website for body text and headings</p>
                        </div>
                        <div>
                            <h3 class="text-xl mb-2">Secondary Font</h3>
                            <p class="text-4xl" style="font-family: {brandAssets.typography.secondary}">{brandAssets.typography.secondary}</p>
                            <p class="text-sm text-white/50 mt-2">Decorative font used in the promotional banner and special headings</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>

<Footer />