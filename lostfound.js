import {
    db, auth,
    collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';
import { uploadImage } from './cloudinary.js';

const lfContainer = document.getElementById('lf-items-container');
let currentFilter = 'all';

document.querySelectorAll('.lf-filter-btn')?.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lf-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.type;
    });
});

document.getElementById('lost-found-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    const name = document.getElementById('lf-item-name').value;
    const type = document.getElementById('lf-type').value;
    const location = document.getElementById('lf-location').value;
    const description = document.getElementById('lf-description').value;
    const imageFile = document.getElementById('lf-image').files[0];

    let imageUrl = '';
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, 'lostFound'), {
        name, type, location, description, imageUrl,
        claimed: false,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date().toISOString()
    });

    btn.textContent = originalText;
    btn.disabled = false;
    document.getElementById('lost-found-form').reset();
});

function setupLFListener() {
    if (!lfContainer) return;

    const q = query(collection(db, 'lostFound'), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        lfContainer.innerHTML = '';

        snapshot.forEach(docSnap => {
            const item = docSnap.data();
            if (currentFilter !== 'all' && item.type !== currentFilter) return;

            const isOwner = item.userId === auth.currentUser?.uid;
            const card = document.createElement('div');
            card.className = 'lf-card';
            card.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : ''}
                <h3>${item.name}</h3>
                <span class="badge badge-${item.type}">${item.type.toUpperCase()}</span>
                ${item.claimed ? '<span class="badge badge-claimed">CLAIMED</span>' : ''}
                <p><i class="fas fa-map-marker-alt"></i> ${item.location}</p>
                <p>${item.description}</p>
                <p class="lf-contact"><i class="fas fa-envelope"></i> ${item.userEmail}</p>
                ${isOwner && !item.claimed ? `<button class="btn btn-sm btn-success" onclick="markClaimed('${docSnap.id}')">Mark Claimed</button>` : ''}
                ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteLF('${docSnap.id}')">Delete</button>` : ''}
            `;
            lfContainer.appendChild(card);
        });
    });
}

window.markClaimed = async (id) => {
    await updateDoc(doc(db, 'lostFound', id), { claimed: true });
};

window.deleteLF = async (id) => {
    await deleteDoc(doc(db, 'lostFound', id));
};

if (lfContainer) setupLFListener();
export { setupLFListener };
