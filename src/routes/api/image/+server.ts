import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const encodedUrl = url.searchParams.get('url');
    
    if (!encodedUrl) {
        throw error(400, 'Missing URL parameter');
    }

    const decodedUrl = atob(encodedUrl);

    try {
        const response = await fetch(decodedUrl);
        const contentType = response.headers.get('content-type');

        return new Response(response.body, {
        headers: {
            'Content-Type': contentType || 'image/jpeg',
            'Cache-Control': 'public, max-age=3600'
        }
        });
    } catch (err) {
        throw error(500, 'Failed to fetch image');
    }
};