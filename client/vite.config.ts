import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';
import type { UserConfig } from 'vite';

// const supportedExtensions = ['png', 'jpg', 'jpeg'];

const config: UserConfig = {
	plugins: [
		sveltekit(),
		imagetools({
			removeMetadata: true
		})
		// SvelteKitPWA()
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
};

export default config;
