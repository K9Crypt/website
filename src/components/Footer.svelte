<script>
    import { _ } from 'svelte-i18n';
</script>

<footer class="bg-cWhiteGray border-t border-white/5 py-8 sm:py-12">
    <div class="container mx-auto px-4 sm:px-6 lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div class="col-span-1 md:col-span-2">
                <h3 class="text-xl font-bold mb-4">K9Crypt</h3>
                <p class="text-white/50 text-sm mb-4 max-w-md">{$_('footer.description')}</p>
                <div class="flex space-x-4 mb-4">
                    <a href="https://github.com/k9crypt" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-github-fill text-xl"></i>
                    </a>
                    <a href="https://x.com/k9crypt" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-twitter-x-fill text-xl"></i>
                    </a>
                    <a href="https://discord.gg/8jyeQV7Wyd" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-discord-fill text-xl"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/k9crypt" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-linkedin-fill text-xl"></i>
                    </a>
                    <a href="https://bsky.app/profile/k9crypt.bsky.social" class="text-white/50 hover:text-white transition-colors duration-300">
                        <i class="ri-bluesky-fill text-xl"></i>
                    </a>
                </div>
                <div class="mt-2">
                    <iframe src="https://status.k9crypt.xyz/badge?theme=dark" width="250"  height="30" frameborder="0" scrolling="no" class="rounded-lg bg-cWhiteGray" title="K9Crypt Status Badge"></iframe>
                </div>
            </div>

            <div>
                <h4 class="text-base font-semibold mb-4">{$_('footer.quickLinks.title')}</h4>
                <ul class="space-y-2">
                    <li><a href="/" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.quickLinks.home')}</a></li>
                    <li><a href="/about" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.quickLinks.about')}</a></li>
                    <li><a href="/features" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.quickLinks.features')}</a></li>
                    <li><a href="/brand" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.quickLinks.brand')}</a></li>
                    <li><a href="/updates" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('nav.updates')}</a></li>
                    <li><a href="/blog" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('nav.blog')}</a></li>
                </ul>
            </div>

            <div>
                <h4 class="text-base font-semibold mb-4">{$_('footer.support.title')}</h4>
                <ul class="space-y-2">
                    <li><a href="/contact" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.quickLinks.contact')}</a></li>
                    <li><a href="/privacy" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.support.privacy')}</a></li>
                    <li><a href="/terms" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.support.terms')}</a></li>
                    <li><a href="https://docs.k9crypt.xyz/default-guide/k9crypt-nodejs" class="text-white/50 hover:text-white text-sm transition-colors duration-300">{$_('footer.support.docs')}</a></li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/5 pt-8 text-center text-white/50 text-sm">
            <p>{$_('footer.copyright', { values: { year: `2024 - ${new Date().getFullYear()}` } })}</p>
        </div>
    </div>
</footer>
