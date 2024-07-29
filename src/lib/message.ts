/**
 * Sends a message to a specific room with a given user ID.
 *
 * @param {string} roomId - The ID of the room to send the message to.
 * @param {string} userId - The ID of the user sending the message.
 * @param {string} message - The content of the message to be sent.
 * @return {Promise<string>} A promise that resolves with the message ID of the sent message.
 * @throws {Error} If there is an error sending the message.
 */
export async function sendMessage(roomId: string, userId: string, message: string): Promise<string> {
  try {
    const response = await fetch("https://api.k9crypt.xyz/room/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId, userId, message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
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


/**
 * Retrieves an array of messages from the specified room.
 *
 * @param {string} roomId - The ID of the room to retrieve messages from.
 * @return {Promise<Array<{ sender: string, message: string }>>} A promise that resolves to an array of objects containing the sender and message of each message in the room.
 * @throws {Error} If there is an error retrieving the messages.
 */
export async function getMessages(roomId: string): Promise<Array<{ sender: string, message: string }>> {
  try {
    const response = await fetch(`https://api.k9crypt.xyz/room/${roomId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`Failed to get messages: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.messages || [];
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}