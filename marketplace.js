import {
    db, auth,
    collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';
import { uploadImage } from './cloudinary.js';

const mpContainer = document.getElementById('mp-items-container');

document.getElementById('marketplace-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    const name = document.getElementById('mp-name').value;
    const category = document.getElementById('mp-category').value;
    const price = document.getElementById('mp-price').value;
    const condition = document.getElementById('mp-condition').value;
    const description = document.getElementById('mp-description').value;
    const imageFile = document.getElementById('mp-image').files[0];

    let imageUrl = '';
    if (imageFile) {
        imageUrl = await uploadImage(imageFile);
    }

    await addDoc(collection(db, 'marketplace'), {
        name, category, price, condition, description, imageUrl,
        sold: false,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date().toISOString()
    });

    btn.textContent = originalText;
    btn.disabled = false;
    document.getElementById('marketplace-form').reset();
});

function setupMPListener() {
    if (!mpContainer) return;

    const q = query(collection(db, 'marketplace'), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        mpContainer.innerHTML = '';

        snapshot.forEach(docSnap => {
            const item = docSnap.data();
            const isOwner = item.userId === auth.currentUser?.uid;
            const card = document.createElement('div');
            card.className = 'mp-card';
            card.innerHTML = `
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : ''}
                <h3>${item.name}</h3>
                <span class="badge badge-${item.category}">${item.category}</span>
                <span class="badge badge-${item.condition}">${item.condition}</span>
                ${item.sold ? '<span class="badge badge-claimed">SOLD</span>' : ''}
                <p class="mp-price">₹${item.price}</p>
                <p>${item.description}</p>
                <p class="mp-contact"><i class="fas fa-envelope"></i> ${item.userEmail}</p>
                ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteMP('${docSnap.id}')">Delete</button>` : ''}
            `;
            mpContainer.appendChild(card);
        });
    });
}

window.deleteMP = async (id) => {
    await deleteDoc(doc(db, 'marketplace', id));
};

if (mpContainer) setupMPListener();
export { setupMPListener };
