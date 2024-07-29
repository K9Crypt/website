/**
 * Creates a new room and returns the room ID.
 *
 * @param {string} userId - The ID of the user creating the room.
 * @return {Promise<string>} A promise that resolves with the room ID of the created room.
 * @throws {Error} If there is an error creating the room.
 */
export async function createRoom(userId: string): Promise<string> {
  try {
    const response = await fetch("https://api.k9crypt.xyz/room/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to create room: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.roomId;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

/**
 * Joins a room with the given room ID and user ID.
 *
 * @param {string} roomId - The ID of the room to join.
 * @param {string} userId - The ID of the user joining the room.
 * @return {Promise<string>} A promise that resolves with the message from the API.
 * @throws {Error} If there is an error joining the room.
 */
export async function joinRoom(roomId: string, userId: string): Promise<string> {
  try {
    const response = await fetch("https://api.k9crypt.xyz/room/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to join room: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error joining room:", error);
    throw error;
  }
}

/**
 * Leaves a room with the given room ID and user ID.
 *
 * @param {string} roomId - The ID of the room to leave.
 * @param {string} userId - The ID of the user leaving the room.
 * @return {Promise<string>} A promise that resolves with the message from the API.
 * @throws {Error} If there is an error leaving the room.
 */
export async function leaveRoom(roomId: string, userId: string): Promise<string> {
  try {
    const response = await fetch("https://api.k9crypt.xyz/room/leave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to leave room: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error("Error leaving room:", error);
    throw error;
  }
}