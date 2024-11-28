export async function sendMessage(roomId: string, userId: string, message: string): Promise<any> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId, message }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to send message: ${response.status} ${response.statusText} - ${errorText}`
            );
        }

        const data = await response.json();
        if (!data.message) {
            throw new Error("No message returned from the server.");
        }
        
        return data.message;
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error(`Error sending message: ${error}`);
    }
}

export async function getMessages(roomId: string): Promise<Array<{ sender: string, message: string }>> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/${roomId}/messages`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get messages: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.messages || [];
    } catch (error) {
        throw error;
    }
}

export async function markMessageAsRead(roomId: string, userId: string, messageId: string): Promise<void> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId, messageId }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to mark message as read: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
    } catch (error) {
        console.error("Error marking message as read:", error);
        throw new Error(`Error marking message as read: ${error}`);
    }
}

export async function reactToMessage(roomId: string, userId: string, messageId: string, emoji: string): Promise<void> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/react`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId, messageId, emoji }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to react to message: ${response.status} ${response.statusText} - ${errorText}`
            );
        }
    } catch (error) {
        console.error("Error reacting to message:", error);
        throw new Error(`Error reacting to message: ${error}`);
    }
}

export interface MessageReadEvent {
    messageId: string;
    userId: string;
    readBy: string[];
}

export interface MessageReactionEvent {
    messageId: string;
    userId: string;
    emoji: string;
    action: 'added' | 'removed';
    reactions: Record<string, string[]>;
}