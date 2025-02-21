<script lang="ts">
    import Navbar from '../../components/Navbar.svelte';
    import Footer from '../../components/Footer.svelte';
    import { _ } from 'svelte-i18n';

    const brandAssets = {
        banner: {
            path: "https://www.upload.ee/image/17480100/K9Crypt_Banner.png",
            description: $_('brand.banner.description'),
        },
        logos: [
            {
                name: $_('brand.logos.standard.name'),
                path: "https://www.upload.ee/image/17339403/k9crypt-logo.png",
                description: $_('brand.logos.standard.description'),
            },
            {
                name: $_('brand.logos.icon.name'),
                path: "https://www.upload.ee/image/17339414/k9crypt-rb.png",
                description: $_('brand.logos.icon.description'),
            },
            {
                name: $_('brand.logos.light.name'),
                path: "https://www.upload.ee/image/17480183/k9crypt-white.png",
                description: $_('brand.logos.light.description'),
            },
            {
                name: $_('brand.logos.dark.name'),
                path: "https://www.upload.ee/image/17480187/k9crypt-black.png",
                description: $_('brand.logos.dark.description'),
            }
        ],
        colors: [
            {
                name: $_('brand.colors.background.name'),
                hex: "#121212",
                rgb: "rgb(18, 18, 18)",
                usage: $_('brand.colors.background.usage')
            },
            {
                name: $_('brand.colors.accent.name'),
                hex: "#b9f21b",
                rgb: "rgb(185, 242, 27)",
                usage: $_('brand.colors.accent.usage')
            },
            {
                name: $_('brand.colors.whiteGray.name'),
                hex: "#1B1B1B",
                rgb: "rgb(27, 27, 27)",
                usage: $_('brand.colors.whiteGray.usage')
            },
            {
                name: $_('brand.colors.lightGray.name'),
                hex: "#2C2C2C",
                rgb: "rgb(44, 44, 44)",
                usage: $_('brand.colors.lightGray.usage')
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
        <div class="space-y-12">
            <div class="space-y-6">
                <h2 class="text-3xl font-bold">{$_('brand.title')}</h2>
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
                <h2 class="text-3xl font-bold">{$_('brand.banner.title')}</h2>
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                    <img src={brandAssets.banner.path} alt="K9Crypt Banner" class="w-full object-cover rounded-lg mb-4" />
                    <p class="text-white/50 mb-4">{brandAssets.banner.description}</p>
                </div>
            </div>

            <div class="space-y-6">
                <h2 class="text-3xl font-bold">{$_('brand.colors.title')}</h2>
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
                <h2 class="text-3xl font-bold">{$_('brand.typography.title')}</h2>
                <div class="bg-cWhiteGray border border-white/5 rounded-lg p-6">
                    <div class="space-y-4">
                        <div>
                            <h3 class="text-xl mb-2">{$_('brand.typography.primary.title')}</h3>
                            <p class="text-4xl" style="font-family: {brandAssets.typography.primary}">{brandAssets.typography.primary}</p>
                            <p class="text-sm text-white/50 mt-2">{$_('brand.typography.primary.description')}</p>
                        </div>
                        <div>
                            <h3 class="text-xl mb-2">{$_('brand.typography.secondary.title')}</h3>
                            <p class="text-4xl" style="font-family: {brandAssets.typography.secondary}">{brandAssets.typography.secondary}</p>
                            <p class="text-sm text-white/50 mt-2">{$_('brand.typography.secondary.description')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<Footer />