/**
 * Sends a POST request to create a message on the server.
 *
 * @param {string} message - The message content to be created.
 * @return {Promise<string>} A promise that resolves with the created message data.
 */
export async function createMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to create message: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
}
