import {
    db, auth,
    collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';

const nearbyContainer = document.getElementById('nearby-places-container');

document.getElementById('nearby-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('nb-name').value;
    const category = document.getElementById('nb-category').value;
    const distance = document.getElementById('nb-distance').value;
    const description = document.getElementById('nb-description').value;

    await addDoc(collection(db, 'nearbyPlaces'), {
        name, category, distance, description,
        ratings: [],
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('nearby-form').reset();
});

function setupNearbyListener() {
    if (!nearbyContainer) return;

    const q = query(collection(db, 'nearbyPlaces'), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        nearbyContainer.innerHTML = '';

        snapshot.forEach(docSnap => {
            const place = docSnap.data();
            const avgRating = place.ratings?.length > 0
                ? (place.ratings.reduce((a, b) => a + b, 0) / place.ratings.length).toFixed(1)
                : 'No ratings';

            const card = document.createElement('div');
            card.className = 'nearby-card';
            card.innerHTML = `
                <h3>${place.name}</h3>
                <span class="badge badge-${place.category}">${place.category}</span>
                <p><i class="fas fa-walking"></i> ${place.distance}</p>
                <p>${place.description}</p>
                <div class="rating" data-id="${docSnap.id}">
                    ${[1, 2, 3, 4, 5].map(i => `<button data-rating="${i}">★</button>`).join('')}
                </div>
                <p class="avg-rating">Avg: ${avgRating}</p>
            `;
            nearbyContainer.appendChild(card);
        });

        document.querySelectorAll('.rating button').forEach(btn => {
            btn.addEventListener('click', async () => {
                const rating = parseInt(btn.dataset.rating);
                const docId = btn.parentElement.dataset.id;
                const docRef = doc(db, 'nearbyPlaces', docId);

                onSnapshot(docRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const newRatings = [...(data.ratings || []), rating];
                        await updateDoc(docRef, { ratings: newRatings });
                    }
                }, { once: true });
            });
        });
    });
}

if (nearbyContainer) setupNearbyListener();
export { setupNearbyListener };
