export async function createMessage(message: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message }),
        });

        const data = await response.text();
        return data;
    } catch (error) {
        throw error;
    }
}