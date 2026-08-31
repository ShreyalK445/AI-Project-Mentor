# AI Project Mentor 🤖

**Academic Guidance Platform** — A modern, neon-themed onboarding and project-management web app that helps students build their academic profile, submit project ideas, and get personalized AI-powered guidance.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)

---

## ✨ Features

- **Student Profile Setup** — Capture full name, department, academic year, technical skills, and academic interests.
- **Project Submission** — Submit project title, category, description, objective, and see auto-linked selected technologies.
- **Review & Complete** — A clean summary screen to review all entered details before finishing onboarding.
- **Dashboard** — Post-onboarding welcome screen showing project title, category, skills, and status at a glance.
- **AI Mentor Assistant Card** — Persistent sidebar widget offering quick access to AI guidance.
- **Live Session Indicator, Notifications & Avatar** — Header utilities for a realistic workspace feel.
- **Weather Widget** — Small ambient sidebar widget showing local weather.
- **Fully Responsive** — Includes a slide-in mobile sidebar with hamburger menu, swipe-to-open gesture, and overlay dismiss.
- **Neon / Cyberpunk UI Theme** — Custom glowing borders, gradients, and glassmorphism-inspired cards built entirely with CSS (no UI framework dependency).

---

## 🛠️ Tech Stack

| Layer       | Technology         |
|-------------|---------------------|
| Framework   | React 18 (Functional Components + Hooks) |
| Build Tool  | Vite                |
| Styling     | Plain CSS (`App.css`) with custom properties, gradients, and clip-paths |
| Fonts       | Inter, Orbitron (Google Fonts) |
| State       | React `useState` / `useRef` (no external state library) |

---

## 📂 Project Structure

```
AI-Project-Mentor/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx        # Main application component (all pages/logic)
│   │   ├── App.css         # Complete neon-themed styling
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/AI-Project-Mentor.git

# Navigate into the frontend folder
cd AI-Project-Mentor/frontend

# Install dependencies
npm install
```

### Run the Development Server

```bash
npm run dev
```

The app will start on `http://localhost:5173` (or the next available port, e.g. `5174`, if 5173 is busy). Open the URL shown in your terminal in a browser.

### Build for Production

```bash
npm run build
```

The optimized production build will be output to the `dist/` folder.

---

## 🧭 App Flow

1. **Student Profile** → Enter name, department, academic year, and select technical skills.
2. **Project Submission** → Describe your project idea, category, objective, and see your selected tech stack.
3. **Review & Complete** → Confirm all details, then click **Complete Onboarding**.
4. **Dashboard** → View your finalized profile and project summary.

At any point, use the sidebar (or hamburger menu on mobile) to jump between sections.

---

## 📱 Mobile Experience

On smaller screens, the sidebar is hidden by default and can be opened by:
- Tapping the **hamburger icon** (top-left), or
- **Swiping right** from the left edge of the screen

Tap the **✕** button or the dark overlay to close it.

---

## 🎨 Design Notes

The UI uses a dark, neon cyberpunk aesthetic:
- Purple/magenta and cyan gradient accents throughout buttons, borders, and glowing icons
- Custom hexagon/octagon `clip-path` shapes for icons and step indicators
- Soft background glow orbs and a subtle grid overlay for depth
- Fully custom form elements (inputs, selects, textareas) styled to match the theme

---

## 🙋 Need Help?

The **"Get AI Assistance"** button in the sidebar is a placeholder for future AI Mentor chat/assistant integration — a great starting point to wire up an AI chatbot or guidance engine.

---

## 📄 License

This project is open for personal and academic use. Add your preferred license here (e.g. MIT) if distributing publicly.

---

## 🙌 Author

Built with ❤️ as an academic project mentoring platform concept.