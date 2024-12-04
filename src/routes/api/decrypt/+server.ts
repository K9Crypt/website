import { json } from '@sveltejs/kit';
import k9crypt from 'k9crypt';
import type { RequestEvent } from '@sveltejs/kit';

const secretKey = import.meta.env.VITE_APP_SECRET_KEY;
const encryptor = new k9crypt(secretKey);

export async function POST({ request }: RequestEvent) {
    try {
        const body = await request.json();
        const { messages } = body;

        if (!Array.isArray(messages)) {
            return json({ 
                success: false, 
                error: 'Invalid input: messages should be an array' 
            }, { status: 400 });
        }

        const decryptedMessages = await Promise.all(
            messages.map(async (msg) => ({
                ...msg,
                message: await encryptor.decrypt(msg.message)
            }))
        );

        return json({
            success: true,
            messages: decryptedMessages
        });
    } catch (error) {
        console.error('Decryption error:', error);
        return json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}