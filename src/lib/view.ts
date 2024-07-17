/**
 * Retrieves the content of a message with the specified ID from the K9Crypt API.
 *
 * @param {string} id - The ID of the message to retrieve.
 * @return {Promise<string>} A Promise that resolves with the content of the message as a string.
 * @throws {Error} If the API request fails or the response is not successful.
 */
export async function viewMessage(id: string): Promise<string> {
  try {
    const response = await fetch(`https://api.k9crypt.xyz/view/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(
        `Failed to view message: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error viewing message:", error);
    throw error;
  }
}
