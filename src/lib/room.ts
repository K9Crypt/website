
/**
  * Creates a new room with the specified `userId` and `type`.
  * @param userId The ID of the user creating the room.
  * @param type The type of room to create, either `"public"` or `"private"`.
  * @param password The password for the room, if `type` is `"private"`. Not required if `type` is `"public"`.
  * @returns A Promise that resolves with the ID of the created room.
  * @throws {Error} If there is an error creating the room.
  */
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
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to create room: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.roomId;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

/**
  * Joins a room with the specified room ID and user ID.
  *
  * @param {string} roomId - The ID of the room to join.
  * @param {string} userId - The ID of the user joining the room.
  * @param {string} [password] - The password for the room (required for private rooms).
  * @return {Promise<string>} A promise that resolves with the message from the API.
  * @throws {Error} If there is an error joining the room.
  */
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
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to join room: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
}

/**
 * Checks if a room exists and retrieves its details.
 *
 * @param {string} roomId - The ID of the room to check.
 * @return {Promise<any>} A promise that resolves with the room details if the room exists.
 * @throws {Error} If there is an error checking the room or if the room does not exist.
 */
export async function checkRoom(roomId: string): Promise<any> {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/room/check/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to check room: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.room;
  } catch (error) {
    console.error("Error checking room:", error);
    throw error;
  }
}

/**
  * Leaves a room with the specified room ID and user ID.
  *
  * @param {string} roomId - The ID of the room to leave.
  * @param {string} userId - The ID of the user leaving the room.
  * @return {Promise<string>} A promise that resolves with the message from the API.
  * @throws {Error} If there is an error leaving the room.
  */
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
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to leave room: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error leaving room:", error);
    throw error;
  }
}