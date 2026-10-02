# AcademiaSync — Dynamic Academic & Habit Scheduler

> **Module 2 PRD Implementation**: An advanced, constraint-based scheduling engine wrapped in a modern, dark-glassmorphic cross-platform Web & Native App interface.

---

## 🌟 Key Features & Engine Architecture

### 1. ⚡ The "Unexpected Holiday" Management Engine
* **Instant Hours Reclamation**: Reclaims standard blocked hours (e.g., 9:00 AM – 4:00 PM college block) with one tap.
* **Interactive Start Prompt**: Asks *"What time will you start your learning blocks today?"* and dynamically populates newly freed time windows with high-priority topics (e.g., DSA Sheets, AI/ML concepts).
* **Weekly Report Sync**: Automatically logs reclaimed study volume into progress tracking.

### 2. 🌴 Vacation Mode & Schedule Blackouts
* **Multi-Day Pause**: Define multi-day vacation blackout ranges (e.g., family trips, college events).
* **Two Reallocation Modes**:
  - **Freeze & Shift**: Pushes flexible study tasks to dates immediately following the trip.
  - **Front-Load & Compress**: Spreads displaced study hours before and after the trip to guarantee fixed exam deadlines.

### 3. 🔄 Missed Block Cascading Engine
* **Automatic Rescheduling**: Expired or missed study blocks are auto-cascaded into available slots across a rolling **3 to 5 day window**.
* **Daily Hour Cap Safety**: Enforces maximum daily study hour limits (e.g., 6 hrs/day max) and flags overloaded days.

### 4. 🎯 Goal, Deadline & Event Routing
* **Exam Mode (Reverse-Engineered Pacing)**: Inputs target exam dates and back-calculates daily topic review volume to guarantee syllabus completion.
* **Assignment Mode (Sudden Preemption)**: High-priority urgent submissions (e.g. 48h deadline) preempt lower-priority habit blocks, pushing lower-priority tasks into future cascade slots.
* **Subject Boosting**: Manual allocation overrides (*"Allocate +4 hrs for Data Structures this week"*).
* **Tentative (Soft) Events**: Reserves tentative event blocks while maintaining a shadow schedule of backup learning tasks ready to activate if the event is skipped.

---

## 🔔 Native Alarms, Notifications & Cloud Web Sync

* **Web Audio API Synth Alarms**: Synthesizes audio alarm alerts (**Cyber Chime**, **Classic Beep**, **Urgent Siren**) directly via Web Audio API without needing external audio files.
* **Desktop OS Notifications**: Native background notification integration (`Notification.requestPermission()`).
* **Standalone PWA Support**: Installable as a native standalone app on Windows, macOS, Android, and iOS via Service Worker (`sw.js`) and Manifest (`manifest.json`).
* **Cloud Web Sync**: Real-time cloud payload sync and JSON app data export for cross-device synchronization between native app and online web views.

---

## ⚙️ Tech Stack

* **Framework**: React + Vite
* **Styling**: Vanilla CSS Design System with dark glassmorphism, Google Fonts (`Outfit` & `Inter`), and custom micro-animations.
* **Iconography**: Lucide React
* **PWA & Audio**: Service Worker API, Web Audio API, Desktop Notifications API.

---

## 🛠️ Quick Start

```bash
# Clone the repository
git clone https://github.com/Prayanshuchourasia-01/AcademiaSync.git

# Navigate into project directory
cd AcademiaSync

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📅 Simulated Reference Date Controller

AcademiaSync includes a built-in **System Reference Date Bar** at the top of the interface. This allows you to simulate and test schedule behavior, missed block cascades, countdowns, and historical reports relative to any configured target date!

---

## 📜 License

MIT License © 2026 AcademiaSync Team

---

## ⚡ v1.0.0 Feature Suite & Streak Recovery Complete
- Data Export & JSON Backup Modal (`dataExportEngine.js`)
- Weighted GPA Estimator & Target Grade Calculator (`gpaCalculator.js`)
- Web Audio Synthesized Chimes & Focus Timer Presets (`soundEffectsEngine.js`)
- Daily Study Streak & Flame Consistency Badge (`habitTracker.js`)
- iCalendar (.ics RFC 5545) Schedule Export (`icsExportEngine.js`)
- Subject Management Modal & Custom Color Themes (`subjectThemes.js`)
- Workload Heatmap & Peak Productivity Slot Calculator (`analyticsEngine.js`)
- Global Keyboard Hotkeys Listener (`shortcutEngine.js`)
- Chronotype Energy-Level Matching Engine (`energySchedulerEngine.js`)
- Dynamic Application Theme Engine (`themeEngine.js`)
- Peer Schedule Link Sharing Modal (`peerShareEngine.js`)
- Exam Urgency & Panic Index Calculator (`urgencyEngine.js`)
- Ambient White Noise Synthesizer (`ambientAudioEngine.js`)
- Offline PWA Caching & Service Worker (`sw.js`, `manifest.json`)
