import {
    db, auth,
    collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';

const cpContainer = document.getElementById('cp-rides-container');

document.getElementById('cabpool-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const from = document.getElementById('cp-from').value;
    const to = document.getElementById('cp-to').value;
    const date = document.getElementById('cp-date').value;
    const time = document.getElementById('cp-time').value;
    const seats = parseInt(document.getElementById('cp-seats').value);
    const contact = document.getElementById('cp-contact').value;

    await addDoc(collection(db, 'cabPool'), {
        from, to, date, time, seats, contact,
        passengers: [auth.currentUser.uid],
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('cabpool-form').reset();
});

function setupCPListener() {
    if (!cpContainer) return;

    const q = query(collection(db, 'cabPool'), orderBy('date', 'asc'));

    onSnapshot(q, (snapshot) => {
        cpContainer.innerHTML = '';
        const today = new Date().toISOString().split('T')[0];

        snapshot.forEach(docSnap => {
            const ride = docSnap.data();
            if (ride.date < today) return;

            const isOwner = ride.userId === auth.currentUser?.uid;
            const isPassenger = ride.passengers?.includes(auth.currentUser?.uid);
            const seatsLeft = ride.seats - (ride.passengers?.length || 0);
            const isFull = seatsLeft <= 0;

            const card = document.createElement('div');
            card.className = 'cp-card';
            card.innerHTML = `
                <h3>${ride.from} → ${ride.to}</h3>
                <p><i class="fas fa-calendar"></i> ${ride.date} at ${ride.time}</p>
                <p><i class="fas fa-users"></i> ${seatsLeft} seats left</p>
                ${isFull ? '<span class="badge badge-full">FULL</span>' : ''}
                <p><i class="fas fa-phone"></i> ${ride.contact}</p>
                <div class="cp-actions">
                    ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteRide('${docSnap.id}')">Cancel</button>` :
                    isPassenger ? '<span class="badge badge-claimed">✓ Joined</span>' :
                        isFull ? '' :
                            `<button class="btn btn-sm btn-primary" onclick="joinRide('${docSnap.id}')">Join</button>`}
                </div>
            `;
            cpContainer.appendChild(card);
        });
    });
}

window.joinRide = async (id) => {
    const docRef = doc(db, 'cabPool', id);
    onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
            const ride = docSnap.data();
            const passengers = ride.passengers || [];
            if (!passengers.includes(auth.currentUser.uid)) {
                passengers.push(auth.currentUser.uid);
                await updateDoc(docRef, { passengers });
            }
        }
    }, { once: true });
};

window.deleteRide = async (id) => {
    await deleteDoc(doc(db, 'cabPool', id));
};

if (cpContainer) setupCPListener();
export { setupCPListener };
