import db from "./db";

export function proxyImage(url: string) {
    const encodedUrl = btoa(url);
    return `/api/image?url=${encodedUrl}`
}

export async function getPost(id: string) {
    const post = await db.collection("blog").getOne(id);
    return post;
}

export async function fetchAllPosts() {
    const posts = await db.collection("blog").getFullList({
        sort: '-created',
    });
    return posts;
}

export async function getRandomPost() {
    const posts = await db.collection("blog").getFullList({ sort: "-created" });
    const randomIndex = Math.floor(Math.random() * posts.length);
    return posts[randomIndex];
}
export async function getPopularPosts() {
    const posts = await db.collection("blog").getFullList({ sort: "-viewCount" });
    return posts;
}

export async function getRecentPosts() {
    const posts = await db.collection("blog").getFullList({ sort: "-created" });
    return posts.slice(0, 3);
}

export async function updatePostViewCount(id: string) {
    const post = await db.collection("blog").getOne(id);
    const newCount = post.viewCount + 1;
    await db.collection("blog").update(id, { viewCount: newCount });
}