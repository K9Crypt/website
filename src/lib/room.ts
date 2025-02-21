export const ROOM_LIFETIMES = {
    ONE_DAY: 24 * 60 * 60 * 1000,
    ONE_MONTH: 30 * 24 * 60 * 60 * 1000,
    ONE_YEAR: 365 * 24 * 60 * 60 * 1000,
    PERMANENT: -1
} as const;

export type RoomLifetime = typeof ROOM_LIFETIMES[keyof typeof ROOM_LIFETIMES];

export async function createRoom(
    userId: string,
    type: "public" | "private",
    password?: string,
    roomName?: string,
    lifetime: RoomLifetime = ROOM_LIFETIMES.ONE_DAY,
    category?: string
): Promise<{ roomId: string; expiresAt: string | null; category: string | null }> {
    try {
        const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, type, password, roomName, lifetime, category }),
        });

        if (!response.ok) {
            throw new Error('Failed to create room');
        }

        const data = await response.json();
        return {
            roomId: data.roomId || '',
            expiresAt: data.expiresAt || null,
            category: data.category || null
        };
    } catch (error) {
        throw error;
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

export async function listRooms(queryString: string = ''): Promise<any[]> {
    try {
        const url = queryString
          ? `${import.meta.env.VITE_APP_APIURL}/room/list?${queryString}`
          : `${import.meta.env.VITE_APP_APIURL}/room/list`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch rooms: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.rooms || [];
    } catch (error) {
        console.error("Error in listRooms:", error);
        throw error;
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