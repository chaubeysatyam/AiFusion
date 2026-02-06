import {
    db, auth,
    collection, addDoc, doc, deleteDoc, query, onSnapshot
} from './firebase.js';

const ttContainer = document.getElementById('tt-schedule-container');
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

document.getElementById('timetable-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const subject = document.getElementById('tt-subject').value;
    const day = document.getElementById('tt-day').value;
    const time = document.getElementById('tt-time').value;
    const room = document.getElementById('tt-room').value;

    await addDoc(collection(db, 'timetable'), {
        subject, day, time, room,
        userId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
    });

    document.getElementById('timetable-form').reset();
});

function setupTimetableListener() {
    if (!ttContainer || !auth.currentUser) return;

    const q = query(collection(db, 'timetable'));

    onSnapshot(q, (snapshot) => {
        const schedule = {};
        days.forEach(d => schedule[d] = []);

        snapshot.forEach(docSnap => {
            const cls = docSnap.data();
            if (cls.userId !== auth.currentUser.uid) return;
            cls.id = docSnap.id;
            if (schedule[cls.day]) schedule[cls.day].push(cls);
        });

        days.forEach(day => {
            schedule[day].sort((a, b) => a.time.localeCompare(b.time));
        });

        ttContainer.innerHTML = days.map(day => `
            <div class="tt-day">
                <h3>${day}</h3>
                <div class="tt-classes">
                    ${schedule[day].length === 0 ? '<p class="tt-empty">No classes</p>' :
                schedule[day].map(cls => `
                            <div class="tt-class">
                                <span class="tt-time">${cls.time}</span>
                                <span class="tt-subject">${cls.subject}</span>
                                <span class="tt-room">${cls.room}</span>
                                <button class="tt-delete" onclick="deleteClass('${cls.id}')">&times;</button>
                            </div>
                        `).join('')
            }
                </div>
            </div>
        `).join('');
    });
}

window.deleteClass = async (id) => {
    await deleteDoc(doc(db, 'timetable', id));
};

if (ttContainer) setupTimetableListener();
export { setupTimetableListener };
