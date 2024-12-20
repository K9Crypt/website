export async function createRoom(
    userId: string,
    type: "public" | "private",
    password?: string,
    roomName?: string
): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, type, password, roomName }), // Include roomName in body
        });

        if (!response.ok) {
            return '';
        }

        const data = await response.json();
        return data.roomId || '';
    } catch (error) {
        return '';
    }
}

export async function joinRoom(roomId: string, userId: string, password?: string): Promise<string> {
    const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, userId, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error);
    }
    
    return data.message || 'Joined room successfully';
}

export async function checkRoom(roomId: string): Promise<any> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/check/${roomId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            return { type: 'public', users: [] };
        }

        const data = await response.json();
        return data.room || { type: 'public', users: [] };
    } catch (error) {
        return { type: 'public', users: [] };
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
        return data.message || 'Left room successfully';
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

        if (!response.ok) {
            return [];
        }

        const data = await response.json();
        return data.rooms || [];
    } catch (error) {
        return [];
    }
}

export async function checkPassword(roomId: string, password: string): Promise<boolean> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId: "temp-check", password }),
        });

        if (!response.ok) {
            return false;
        }

        const data = await response.json();
        return !data.error;
    } catch (error) {
        return false;
    }
}