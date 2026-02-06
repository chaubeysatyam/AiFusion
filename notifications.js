import { db, onSnapshot, collection, query, orderBy } from './firebase.js';

let lastNotificationTime = {};

function showNotification(title, body) {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icon.png' });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
}

function setupRealtimeNotifications() {
    const collections = [
        { name: 'announcements', emoji: '📢', titleField: 'title' },
        { name: 'events', emoji: '📅', titleField: 'title' },
        { name: 'studyGroups', emoji: '👥', titleField: 'name' },
        { name: 'lostFound', emoji: '🔍', titleField: 'name' },
        { name: 'marketplace', emoji: '🛒', titleField: 'name' },
        { name: 'cabPool', emoji: '🚗', titleField: 'from' }
    ];

    collections.forEach(col => {
        lastNotificationTime[col.name] = Date.now();

        const q = query(collection(db, col.name), orderBy('createdAt', 'desc'));

        onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data();
                    const docTime = new Date(data.createdAt).getTime();

                    if (docTime > lastNotificationTime[col.name]) {
                        showNotification(
                            `${col.emoji} New ${col.name.replace(/([A-Z])/g, ' $1').trim()}`,
                            data[col.titleField] || 'New item added'
                        );
                        lastNotificationTime[col.name] = Date.now();
                    }
                }
            });
        });
    });
}

if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

setupRealtimeNotifications();

export { showNotification };
