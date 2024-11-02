export async function sendMessage(roomId: string, userId: string, message: string): Promise<string> {
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