import db from "./db";

export async function fetchAllUpdates() {
    const updates = await db.collection("updates").getFullList({
        sort: '-created',
    });
    return updates;
}

export async function getUpdate(id: string) {
    const update = await db.collection("updates").getOne(id);
    return update;
}

export async function getRecentUpdates() {
    const updates = await db.collection("updates").getList(1, 5, {
        sort: '-created',
    });
    return updates.items;
}

export async function getPopularUpdates() {
    const updates = await db.collection("updates").getFullList({ sort: "-viewCount" });
    return updates;
}