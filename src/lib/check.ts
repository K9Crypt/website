import axios from "axios";

/**
 * Asynchronously checks the status of a link by making a GET request to the specified URL.
 *
 * @param {string} url - The URL of the link to check.
 * @return {Promise<boolean>} A Promise that resolves to true if the link is reachable, false otherwise.
 */
export async function checkLink(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error("Error checking link:", error);
    return false;
  }
}
