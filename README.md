# 🎓 Project Nexus - Campus Life Hub

> **AI-Powered Unified Campus Experience Platform**  
> Built for AI Fusion Hackathon 2026

![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Groq](https://img.shields.io/badge/Groq_AI-00D4AA?style=for-the-badge&logo=groq&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

---

## 🌐 Live Demo

### 🔗 **[https://hackthon-ai-15845.web.app](https://hackthon-ai-15845.web.app)**
## 🌐 Youtube Demo

### 🔗 **https://youtu.be/itTFllnrNuE?si=xL3QvKQDZUgniI00**

---

## 📖 About

**Project Nexus** is a comprehensive campus life management platform that unifies all essential student services into one beautiful, AI-powered application. From managing mess menus to finding study partners, from cab pooling to AI-powered email summarization - Nexus is your one-stop solution for campus life.

---

## ✨ Features

### 🤖 AI-Powered Features

| Feature | Description | AI Model |
|---------|-------------|----------|
| **📧 Mail Summarizer** | Paste any email and get instant AI-powered summary with key points, action items, priority level, and deadlines | **Groq LLaMA 3.1 8B Instant** |

### 📅 Daily Pulse

| Feature | Description |
|---------|-------------|
| **🍽️ Mess Menu** | View today's breakfast, lunch, and dinner with real-time ratings. Add menu items and rate them. |
| **📣 Announcements** | Campus-wide announcements categorized by type (Academic, Event, General, Emergency). Real-time updates. |

### 🔄 Campus Exchange

| Feature | Description |
|---------|-------------|
| **🔍 Lost & Found** | Report lost items or help others find their belongings. Upload images, mark as claimed. |
| **🛒 Marketplace** | Buy and sell used items among students. Categories: Books, Electronics, Furniture, etc. |
| **🚗 Cab Pool** | Share rides with fellow students. Real-time seat tracking, join rides, save money. |

### 📚 Academic Tools

| Feature | Description |
|---------|-------------|
| **📆 Personal Timetable** | Manage your class schedule. Add subjects by day and time. |
| **👥 Study Groups** | Create or join study groups. Find study partners for any subject. |
| **🎉 Events Calendar** | Upcoming campus events with categories (Workshop, Seminar, Cultural, Sports). |

### 🗺️ Explorer's Guide

| Feature | Description |
|---------|-------------|
| **📍 Nearby Places** | Discover local spots - Food, Cafes, Study Spots, Shopping, Fun. Rate and review places. |
| **🗺️ Interactive Campus Map** | OpenStreetMap integration with Leaflet.js. Navigate your campus easily. |

### 🔔 Real-Time Features

| Feature | Description |
|---------|-------------|
| **⚡ Live Updates** | All data syncs instantly across all users using Firestore `onSnapshot` listeners. |
| **🔔 Push Notifications** | Browser notifications when new content is added (announcements, events, etc.). |
| **🔐 Authentication** | Secure email/password authentication with Firebase Auth. |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Custom properties, glassmorphism, animations |
| **JavaScript ES6+** | Modules, async/await, modern syntax |

### Backend & Database
| Technology | Purpose |
|------------|---------|
| **Firebase Authentication** | Email/password user authentication |
| **Cloud Firestore** | Real-time NoSQL database with `onSnapshot` |
| **Cloudiary Storage** | File and image storage |
| **Firebase Hosting** | Static hosting with global CDN |

### External APIs & Services
| Service | Purpose |
|---------|---------|
| **Groq API** | LLaMA 3.1 8B for AI email summarization (ultra-fast inference) |
| **Cloudinary** | Image upload, optimization, and CDN delivery |
| **OpenStreetMap** | Free, open-source map tiles |
| **Leaflet.js** | Interactive map rendering |

---

## 🤖 AI Integration Details

### Mail Summarizer - Groq LLaMA 3.1 8B

The Mail Summarizer uses **Groq's ultra-fast inference API** with the **LLaMA 3.1 8B Instant** model for email analysis.

**AI Prompt Template:**
```
Analyze this email and provide:
1. Subject/Topic - One line
2. Summary - 2-3 sentences max
3. Key Points - Bullet points
4. Action Required - Yes/No and what action
5. Priority - High/Medium/Low
6. Deadline - If any mentioned
```

**Why Groq?**
- 🚀 Ultra-fast inference (10x faster than alternatives)
- 💰 Free tier available
- 📊 LLaMA 3.1 8B - Optimized for text understanding

---

## 📁 Project Structure

```
AI FUSION/
│
├── 📄 index.html           # Main SPA HTML file
├── 🎨 styles.css           # All CSS styles (glassmorphism, animations)
├── ⚙️ app.js               # Main app logic, auth, routing
├── 🔥 firebase.js          # Firebase initialization & exports
├── 🔑 config.js            # API keys configuration
├── 📋 .env                 # Environment variables (gitignored)
├── 📖 README.md            # This file
├── 🚫 .gitignore           # Git ignore rules
├── ☁️ firebase.json        # Firebase hosting config
│
├── 🍽️ mess.js              # Mess menu module
├── 📧 mail.js              # AI Mail summarizer (Groq)
├── 🔍 lostfound.js         # Lost & Found module  
├── 🛒 marketplace.js       # Marketplace module
├── 🚗 cabpool.js           # Cab pooling module
├── 📍 nearby.js            # Nearby places module
├── 🗺️ map.js               # Campus map (Leaflet)
├── 📆 timetable.js         # Timetable module
├── 📣 announcements.js     # Announcements module
├── 👥 studygroups.js       # Study groups module
├── 🎉 events.js            # Events module
├── 🔔 notifications.js     # Real-time notifications
└── 🖼️ cloudinary.js        # Image upload helper
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# AI/ML APIs
GROQ_API_KEY=your_groq_api_key

# Image Upload
CLOUDINARY_CLOUD_NAME=your_cloud_name

# Push Notifications
VAPID_PUBLIC_KEY=your_vapid_key
```

---

## 🚀 Deployment

### Firebase Hosting

#### Prerequisites
- Node.js v18+ installed
- Firebase CLI: `npm install -g firebase-tools`

#### Steps

```bash
# 1. Login to Firebase
firebase login

# 2. Initialize (select your project)
firebase init hosting

# 3. Deploy
firebase deploy --only hosting
```

#### Your site will be live at:
```
https://your-project-id.web.app
```

---

## 🔒 Security

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 📊 Database Collections

| Collection | Purpose | Fields |
|------------|---------|--------|
| `users` | User profiles | name, email, createdAt |
| `messMenu` | Daily menu items | name, type, meal, ratings, date |
| `announcements` | Campus announcements | title, content, category, createdAt |
| `lostFound` | Lost/found items | name, type, location, imageUrl, claimed |
| `marketplace` | Items for sale | name, price, category, condition, imageUrl |
| `cabPool` | Ride sharing | from, to, date, time, seats, passengers |
| `nearbyPlaces` | Local spots | name, category, distance, ratings |
| `timetable` | Class schedule | subject, day, time, room |
| `studyGroups` | Study groups | name, subject, members, maxMembers |
| `events` | Campus events | title, type, date, time, venue |
| `fcmTokens` | Push tokens | token, userId, createdAt |

---

## 🖼️ Screenshots

| Dashboard | Mess Menu | Mail AI |
|-----------|-----------|---------|
| All features at a glance | Today's meals with ratings | AI-powered email summary |

| Lost & Found | Marketplace | Cab Pool |
|--------------|-------------|----------|
| Report/find items | Buy & sell | Share rides |

---

## 👥 Team

**Team Name:** AI Fusion  
**Event:** AI Fusion Hackathon 2026

---

## 📄 License

MIT License - Free for educational and commercial use.

---

## 🙏 Acknowledgments

- **Firebase** by Google - Backend infrastructure
- **Groq** - Ultra-fast AI inference
- **Cloudinary** - Image management
- **OpenStreetMap** - Map tiles
- **Leaflet.js** - Map rendering
- **Font Awesome** - Icons

---

## 📞 Support

For issues or questions, please open a GitHub issue or contact the team.

---

**Made with ❤️ for AI Fusion Hackathon 2026**


