import db from "./db";

export async function getNotification(id: string) {
    const notification = await db.collection("notifications").getOne(id);
    return notification;
}

export async function fetchAllNotifications() {
    const notifications = await db.collection("notifications").getFullList({ sort: "-created" });
    return notifications;
}