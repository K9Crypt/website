export async function createRoom(userId: string, type: "public" | "private", password?: string): Promise<string> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, type, password }),
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
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/join`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ roomId, userId, password }),
        });

        if (!response.ok) {
            return 'Failed to join room';
        }

        const data = await response.json();
        return data.message || 'Joined room successfully';
    } catch (error) {
        return 'Failed to join room';
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

        if (!response.ok) {
            return 'Failed to leave room';
        }

        const data = await response.json();
        return data.message || 'Left room successfully';
    } catch (error) {
        return 'Failed to leave room';
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