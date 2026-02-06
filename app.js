import {
    auth, db,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged,
    collection, addDoc, doc, setDoc, getDoc
} from './firebase.js';
import './mess.js';
import './lostfound.js';
import './marketplace.js';
import './cabpool.js';
import './nearby.js';
import './timetable.js';
import './lms.js';
import './mail.js';
import './map.js';
import './announcements.js';
import './studygroups.js';
import './events.js';
import './notifications.js';

const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const authAlert = document.getElementById('auth-alert');

document.getElementById('login-tab').addEventListener('click', () => showAuthTab('login'));
document.getElementById('signup-tab').addEventListener('click', () => showAuthTab('signup'));

function showAuthTab(tab) {
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('signup-form').classList.toggle('hidden', tab !== 'signup');
    document.getElementById('login-tab').classList.toggle('active', tab === 'login');
    document.getElementById('signup-tab').classList.toggle('active', tab === 'signup');
}

function showAlert(message, type = 'error') {
    authAlert.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => authAlert.innerHTML = '', 3000);
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        showAlert(error.message);
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString()
        });
    } catch (error) {
        showAlert(error.message);
    }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
    await signOut(auth);
});

onAuthStateChanged(auth, async (user) => {
    if (user) {
        authSection.classList.add('hidden');
        appSection.classList.remove('hidden');

        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.exists() ? userDoc.data() : { name: 'User' };

        document.getElementById('user-name').textContent = userData.name || 'User';
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-avatar').textContent = (userData.name || 'U')[0].toUpperCase();
    } else {
        authSection.classList.remove('hidden');
        appSection.classList.add('hidden');
    }
});

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${item.dataset.page}`).classList.add('active');
    });
});

window.navigateTo = function (page) {
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
};
