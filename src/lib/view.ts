/**
 * Retrieves the content of a message with the specified ID from the K9Crypt API.
 *
 * @param {string} id - The ID of the message to retrieve.
 * @return {Promise<string>} A Promise that resolves with the content of the message as a string.
 * @throws {Error} If the API request fails or the response is not successful.
 */
export async function viewMessage(message: string): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_APP_APIURL}/view`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.text();
    return data;
  } catch (error) {
    throw error;
  }
}
