/**
 * Sends a POST request to create a message on the server.
 *
 * @param {string} message - The message content to be created.
 * @return {Promise<string>} A promise that resolves with the created message data.
 */
export async function createMessage(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.k9crypt.xyz/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to create message: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
}
