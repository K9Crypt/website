export async function createRoom(userId: string, type: "public" | "private", password?: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, type, password }),
        });

        const data = await response.json();
        return data.roomId;
    } catch (error) {
        throw error;
    }
}

export async function joinRoom(roomId: string, userId: string, password?: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId, password }),
        });

        const data = await response.json();
        return data.message;
    } catch (error) {
        throw error;
    }
}

export async function checkRoom(roomId: string): Promise<any> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/check/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.room;
    } catch (error) {
        throw error;
    }
}

export async function leaveRoom(roomId: string, userId: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/leave`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId }),
        });

        const data = await response.json();
        return data.message;
    } catch (error) {
        throw error;
    }
}

export async function listRooms(): Promise<any> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/list`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        return data.rooms;
    } catch (error) {
        throw error;
    }
}