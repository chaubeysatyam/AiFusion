import {
    db, auth,
    collection, addDoc, doc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';

const annContainer = document.getElementById('announcements-container');

document.getElementById('announce-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('ann-title').value;
    const category = document.getElementById('ann-category').value;
    const content = document.getElementById('ann-content').value;

    await addDoc(collection(db, 'announcements'), {
        title,
        category,
        content,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: new Date().toISOString()
    });

    document.getElementById('announce-form').reset();
});

function setupAnnouncementsListener() {
    if (!annContainer) return;

    const q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        annContainer.innerHTML = '';

        if (snapshot.empty) {
            annContainer.innerHTML = '<p style="color:var(--text-muted)">No announcements yet.</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const ann = docSnap.data();
            const isOwner = ann.userId === auth.currentUser?.uid;
            const card = document.createElement('div');
            card.className = `ann-card cat-${ann.category}`;
            card.innerHTML = `
                <div class="ann-header">
                    <span class="badge badge-${ann.category}">${ann.category.toUpperCase()}</span>
                    <span class="ann-date">${new Date(ann.createdAt).toLocaleDateString()}</span>
                </div>
                <h3>${ann.title}</h3>
                <p>${ann.content}</p>
                <div class="ann-footer">
                    <span><i class="fas fa-user"></i> ${ann.userEmail}</span>
                    ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteAnn('${docSnap.id}')">Delete</button>` : ''}
                </div>
            `;
            annContainer.appendChild(card);
        });
    });
}

window.deleteAnn = async (id) => {
    await deleteDoc(doc(db, 'announcements', id));
};

if (annContainer) setupAnnouncementsListener();
export { setupAnnouncementsListener };
