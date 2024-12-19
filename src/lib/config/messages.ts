import db from "$lib/db";

export async function betaWarnings() {
    const posts = await db.collection("warnings").getFullList();
    return posts;
}