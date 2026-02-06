import {
    db, auth,
    collection, addDoc, doc, updateDoc, query, where, onSnapshot
} from './firebase.js';

let currentMeal = 'breakfast';
const menuContainer = document.getElementById('menu-items-container');
let unsubscribe = null;

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

document.querySelectorAll('.meal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentMeal = tab.dataset.meal;
        setupMenuListener();
    });
});

document.getElementById('add-menu-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('menu-item-name').value;
    const type = document.getElementById('menu-item-type').value;

    await addDoc(collection(db, 'messMenu'), {
        name,
        type,
        meal: currentMeal,
        date: getTodayDate(),
        ratings: [],
        createdBy: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('menu-item-name').value = '';
});

function setupMenuListener() {
    if (!menuContainer) return;
    if (unsubscribe) unsubscribe();

    const q = query(
        collection(db, 'messMenu'),
        where('date', '==', getTodayDate()),
        where('meal', '==', currentMeal)
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
        menuContainer.innerHTML = '';

        if (snapshot.empty) {
            menuContainer.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1">No items added for this meal yet.</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const item = docSnap.data();
            const avgRating = item.ratings.length > 0
                ? (item.ratings.reduce((a, b) => a + b, 0) / item.ratings.length).toFixed(1)
                : 'No ratings';

            const card = document.createElement('div');
            card.className = 'menu-item-card';
            card.innerHTML = `
                <h3>${item.name}</h3>
                <span class="badge badge-${item.type}">${item.type === 'veg' ? '🟢 Veg' : '🔴 Non-Veg'}</span>
                <div class="rating" data-id="${docSnap.id}">
                    ${[1, 2, 3, 4, 5].map(i => `<button data-rating="${i}">★</button>`).join('')}
                </div>
                <p class="avg-rating">Avg: ${avgRating} ${typeof avgRating === 'number' ? '⭐' : ''}</p>
            `;
            menuContainer.appendChild(card);
        });

        document.querySelectorAll('.rating button').forEach(btn => {
            btn.addEventListener('click', async () => {
                const rating = parseInt(btn.dataset.rating);
                const docId = btn.parentElement.dataset.id;
                const docRef = doc(db, 'messMenu', docId);

                onSnapshot(docRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const newRatings = [...data.ratings, rating];
                        await updateDoc(docRef, { ratings: newRatings });
                    }
                });
            });
        });
    });
}

if (menuContainer) setupMenuListener();
export { setupMenuListener };
