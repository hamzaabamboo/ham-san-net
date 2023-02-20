import type { LayoutServerLoadEvent } from './$types';

/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ request }: LayoutServerLoadEvent) => {
	const preferredLanguages =
		(request.headers.get('content-language') && [request.headers.get('content-language')]) ||
		request.headers
			.get('accept-language')
			?.split(',')
			.map((l) => l.split(';')[0]);
	return {
		preferredLanguages
	};
};
