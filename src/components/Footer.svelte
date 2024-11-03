<script>
    import { onMount } from "svelte";

    let isLoaded = false;

    onMount(() => {
        setTimeout(() => {
            isLoaded = true;
        }, 1500);
    });
</script>

{#if !isLoaded}
<footer class="bg-cWhiteGray border-t border-white/5 py-8 sm:py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 animate-pulse">
            <div class="col-span-1 md:col-span-2 space-y-4">
                <div class="h-8 bg-[#2C2C2C] rounded w-32"></div>
                <div class="h-20 bg-[#2C2C2C] rounded"></div>
                <div class="flex space-x-4">
                    <div class="h-8 w-8 bg-[#2C2C2C] rounded-full"></div>
                    <div class="h-8 w-8 bg-[#2C2C2C] rounded-full"></div>
                    <div class="h-8 w-8 bg-[#2C2C2C] rounded-full"></div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="h-6 bg-cWhiteGray rounded w-24"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-[#2C2C2C] rounded w-20"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-24"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-20"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-24"></div>
                </div>
            </div>

            <div class="space-y-4">
                <div class="h-6 bg-cWhiteGray rounded w-24"></div>
                <div class="space-y-2">
                    <div class="h-4 bg-[#2C2C2C] rounded w-20"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-24"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-20"></div>
                    <div class="h-4 bg-[#2C2C2C] rounded w-24"></div>
                </div>
            </div>
        </div>

        <div class="border-t border-white/5 pt-8 flex justify-center">
            <div class="h-4 bg-[#2C2C2C] rounded w-48"></div>
        </div>
    </div>
</footer>
{:else}
<footer class="bg-cWhiteGray border-t border-white/5 py-8 sm:py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="col-span-1 md:col-span-2">
                <h3 class="text-xl font-bold mb-4 text-white/80">K9Crypt</h3>
                <p class="text-white/50 text-sm mb-4 max-w-md">Secure, fast and reliable messaging platform. Send encrypted messages with confidence.</p>
                <div class="flex space-x-4">
                    <a href="https://github.com/k9crypt" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-github-fill text-xl"></i>
                    </a>
                    <a href="https://x.com/k9crypt" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-twitter-x-fill text-xl"></i>
                    </a>
                    <a href="https://discord.gg/8jyeQV7Wyd" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-discord-fill text-xl"></i>
                    </a>
                </div>
            </div>

            <div>
                <h4 class="text-base font-semibold mb-4 text-white/80">Quick Links</h4>
                <ul class="space-y-2">
                    <li><a href="/" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Home</a></li>
                    <li><a href="/about" class="text-white/50 hover:text-white text-sm transition-colors duration-300">About</a></li>
                    <li><a href="/features" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Features</a></li>
                    <li><a href="/contact" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Contact</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-base font-semibold mb-4 text-white/80">Support</h4>
                <ul class="space-y-2">
                    <li><a href="/privacy" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a></li>
                    <li><a href="/terms" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Terms of Service</a></li>
                    <li><a href="/docs" class="text-white/50 hover:text-white text-sm transition-colors duration-300">Documentation</a></li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/5 pt-8 text-center text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} K9Crypt. All rights reserved.</p>
        </div>
    </div>
</footer>
{/if}