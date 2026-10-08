# ResumeIQ Mobile Application

Cross-platform React Native + Expo mobile application for **ResumeIQ** — AI-powered career intelligence and resume analysis.

---

## 📱 Features

1. **Welcome / Onboarding**: Clean splash with value proposition and instant navigation.
2. **Dashboard / Home**: Overview of recent scans, application stats, and live backend connection badge.
3. **Resume Scanner**: Upload PDF or DOCX resume, paste Job Description, and send multipart analysis request.
4. **Analysis Result Screen**: Overall match percentage, Skill Match, Keyword Match, Experience Match, matched skills, skill gaps, and AI recommendations.
5. **Detailed Report Screen**: In-depth compatibility audit, ATS section verification, and report sharing.
6. **Applications Pipeline**: Local offline-first tracking of applications with status filter (`Applied`, `Under Review`, `Shortlisted`, `Rejected`) and detail modal.
7. **Profile & Settings**: Live FastAPI health test and dynamic computer LAN IP configuration.

---

## 🎨 Design System

Matches the existing web application:
- **Background**: `#08090D`
- **Surfaces**: `#10121A` and `#151824`
- **Primary Accent**: `#6C63FF`
- **Secondary Accent**: `#38BDF8`
- **Text**: `#F5F7FA` (Primary), `#94A3B8` (Secondary)

---

## ⚙️ Architecture & Folder Structure

```
mobile/
├── app.json
├── package.json
├── babel.config.js
├── index.js
├── App.jsx
├── config/
│   ├── api.js           # API_BASE_URL resolution & custom LAN IP override
│   └── theme.js         # Design tokens & color palette
├── services/
│   ├── api.js           # Multipart fetch for /api/resume/analyze & healthcheck
│   └── storage.js       # AsyncStorage persistence layer
├── components/
│   ├── Button.jsx       # Reusable button with variants & loading state
│   ├── Card.jsx         # Dark surface card with subtle border & elevation
│   ├── ScoreCard.jsx    # Prominent circular score & metric badges
│   ├── StatusBadge.jsx  # Status pills with color indicators
│   ├── SkillTag.jsx     # Matched and missing skill badges
│   ├── SectionHeader.jsx# Eyebrow + title header
│   ├── LoadingState.jsx # Animated spinner with informative copy
│   ├── EmptyState.jsx   # Empty placeholder state with actions
│   └── ErrorState.jsx   # Error alert banner with retry callback
├── screens/
│   ├── WelcomeScreen.jsx
│   ├── HomeScreen.jsx
│   ├── UploadScreen.jsx
│   ├── ResultScreen.jsx
│   ├── ReportScreen.jsx
│   ├── ApplicationsScreen.jsx
│   └── ProfileScreen.jsx
└── navigation/
    ├── TabNavigator.jsx  # Bottom tab navigator (Home, Scanner, Pipeline, Settings)
    └── RootNavigator.jsx # Native stack (Welcome -> MainTabs -> Result -> Report)
```

---

## 🚀 How to Run the App

### 1. Start the FastAPI Backend
From the root directory:
```bash
# Ensure dependencies are installed in your Python environment
source .venv/bin/activate
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Note: Using `--host 0.0.0.0` allows physical phones on the same local network (Wi-Fi) to reach the server.*

---

### 2. Connect a Physical Phone to the Local Backend
A physical mobile device cannot access `127.0.0.1` or `localhost`.

1. Find your computer's local Wi-Fi IP address on macOS:
   ```bash
   ipconfig getifaddr en0
   # Example output: 192.168.1.15
   ```
2. In the mobile app, go to **Settings (⚙️)**.
3. In **Backend API Configuration**, enter:
   ```
   http://YOUR_COMPUTER_IP:8000
   ```
   (e.g., `http://192.168.1.15:8000`).
4. Tap **Test Connection** — once verified, all resume scans will connect directly to your local FastAPI server.

*(Alternatively, you can set `CUSTOM_API_IP = '192.168.1.15'` in `mobile/config/api.js`).*

---

### 3. Start the Expo Mobile App
Navigate into the `mobile` folder:
```bash
cd mobile
npm install
npm start
```
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.
- Scan the QR code using the **Expo Go** app on your physical iPhone or Android phone.

