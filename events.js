import {
    db, auth,
    collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';

const evtContainer = document.getElementById('events-container');

document.getElementById('event-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('evt-title').value;
    const type = document.getElementById('evt-type').value;
    const date = document.getElementById('evt-date').value;
    const time = document.getElementById('evt-time').value;
    const venue = document.getElementById('evt-venue').value;
    const description = document.getElementById('evt-desc').value;

    await addDoc(collection(db, 'events'), {
        title, type, date, time, venue, description,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('event-form').reset();
});

function setupEventsListener() {
    if (!evtContainer) return;

    const q = query(collection(db, 'events'), orderBy('date', 'asc'));

    onSnapshot(q, (snapshot) => {
        evtContainer.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];
        let hasUpcoming = false;

        snapshot.forEach(docSnap => {
            const evt = docSnap.data();
            if (evt.date < today) return;
            hasUpcoming = true;

            const isOwner = evt.userId === auth.currentUser?.uid;
            const card = document.createElement('div');
            card.className = `evt-card type-${evt.type}`;
            card.innerHTML = `
                <div class="evt-date-box">
                    <span class="evt-day">${new Date(evt.date).getDate()}</span>
                    <span class="evt-month">${new Date(evt.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div class="evt-details">
                    <span class="badge badge-${evt.type}">${evt.type}</span>
                    <h3>${evt.title}</h3>
                    <p><i class="fas fa-clock"></i> ${evt.time} | <i class="fas fa-map-marker-alt"></i> ${evt.venue}</p>
                    <p class="evt-desc">${evt.description}</p>
                    ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteEvent('${docSnap.id}')">Delete</button>` : ''}
                </div>
            `;
            evtContainer.appendChild(card);
        });

        if (!hasUpcoming) {
            evtContainer.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1">No upcoming events.</p>';
        }
    });
}

window.deleteEvent = async (id) => {
    await deleteDoc(doc(db, 'events', id));
};

if (evtContainer) setupEventsListener();
export { setupEventsListener };
