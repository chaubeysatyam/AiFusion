import {
    db, auth,
    collection, addDoc, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot
} from './firebase.js';

const grpContainer = document.getElementById('groups-container');

document.getElementById('group-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('grp-name').value;
    const subject = document.getElementById('grp-subject').value;
    const maxMembers = parseInt(document.getElementById('grp-max').value);
    const contact = document.getElementById('grp-contact').value;
    const description = document.getElementById('grp-desc').value;

    await addDoc(collection(db, 'studyGroups'), {
        name, subject, maxMembers, contact, description,
        members: [auth.currentUser.uid],
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('group-form').reset();
});

function setupGroupsListener() {
    if (!grpContainer) return;

    const q = query(collection(db, 'studyGroups'), orderBy('createdAt', 'desc'));

    onSnapshot(q, (snapshot) => {
        grpContainer.innerHTML = '';

        if (snapshot.empty) {
            grpContainer.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1">No study groups yet.</p>';
            return;
        }

        snapshot.forEach(docSnap => {
            const grp = docSnap.data();
            const isOwner = grp.userId === auth.currentUser?.uid;
            const isMember = grp.members?.includes(auth.currentUser?.uid);
            const isFull = grp.members?.length >= grp.maxMembers;

            const card = document.createElement('div');
            card.className = 'grp-card';
            card.innerHTML = `
                <h3>${grp.name}</h3>
                <span class="badge">${grp.subject}</span>
                <p>${grp.description}</p>
                <div class="grp-meta">
                    <span><i class="fas fa-users"></i> ${grp.members?.length || 1}/${grp.maxMembers}</span>
                    <span><i class="fas fa-phone"></i> ${grp.contact}</span>
                </div>
                <div class="grp-actions">
                    ${isOwner ? `<button class="btn btn-sm btn-danger" onclick="deleteGroup('${docSnap.id}')">Delete</button>` :
                    isMember ? '<span class="badge badge-claimed">✓ Joined</span>' :
                        isFull ? '<span class="badge badge-full">Full</span>' :
                            `<button class="btn btn-sm btn-primary" onclick="joinGroup('${docSnap.id}')">Join</button>`}
                </div>
            `;
            grpContainer.appendChild(card);
        });
    });
}

window.joinGroup = async (id) => {
    const docRef = doc(db, 'studyGroups', id);
    onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
            const grp = docSnap.data();
            const members = grp.members || [];
            if (!members.includes(auth.currentUser.uid)) {
                members.push(auth.currentUser.uid);
                await updateDoc(docRef, { members });
            }
        }
    }, { once: true });
};

window.deleteGroup = async (id) => {
    await deleteDoc(doc(db, 'studyGroups', id));
};

if (grpContainer) setupGroupsListener();
export { setupGroupsListener };
