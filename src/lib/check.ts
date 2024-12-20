import axios from "axios";

export async function checkLink(url: string): Promise<boolean> {
    try {
        const response = await axios.get(url);
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        return false;
    }
}