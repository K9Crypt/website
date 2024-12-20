import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: "K9Crypt - Secure Messaging Platform",
				short_name: "K9Crypt",
				description: "Secure and private messaging platform",
				theme_color: "#1B1B1B",
				background_color: "#1B1B1B",
				display: "standalone",
				scope: "/",
				start_url: "/",
				orientation: "portrait-primary",
				icons: [
					{
						src: "https://www.upload.ee/image/16942773/Logo.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any"
					},
					{
						src: "https://www.upload.ee/image/16942773/Logo.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "maskable"
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
				runtimeCaching: [
					{
						handler: 'NetworkFirst',
						urlPattern: new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
						options: {
							cacheName: 'google-fonts-cache',
							expiration: {
								maxEntries: 10,
								maxAgeSeconds: 60 * 60 * 24 * 365
							}
						}
					},
					{
						handler: 'NetworkFirst',
						urlPattern: new RegExp('https://upload.ee/(.*)'),
						options: {
							cacheName: 'images-cache',
							expiration: {
								maxEntries: 50,
								maxAgeSeconds: 60 * 60 * 24 * 30
							}
						}
					}
				]
			}
		})
	]
});
