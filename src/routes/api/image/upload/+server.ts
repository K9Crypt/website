import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const { image } = await request.json();

        if (!image || !image.startsWith('data:image/')) {
            return new Response('Invalid image data', { status: 400 });
        }

        return json({
            success: true,
            imageUrl: image
        });
    } catch (error) {
        return new Response('Error processing image', { status: 500 });
    }
};