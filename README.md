# Audiometry Trainer

A professional web-based clinical simulation platform for audiometry training. Designed for audiology students and professionals, it simulates standard audiometric procedures with clinical fidelity, interactive practice, and meaningful feedback.

**Live demo**: [https://sk408.github.io/audiometry_trainer](https://sk408.github.io/audiometry_trainer)

## Features

### Core Clinical Modules

- **Pure Tone Audiometry** — Full Hughson-Westlake procedure (10-down/5-up bracketing) with 23 virtual patients covering normal hearing through profound loss, conductive, mixed, asymmetric, noise-induced, and presbycusis configurations
- **Masking Practice** — Dedicated masking decision training: interaural attenuation rules for AC (>=40 dB supra-aural), BC (always when ABG >=10 dB), effective masking level calculation, scored clinical scenarios
- **Speech Audiometry** — Educational module covering SRT, WRS, PTA-SRT agreement, WRS interpretation guide, interactive PTA calculator, and clinical decision-making quiz
- **Real Ear Measurement (REM)** — Hearing aid verification simulation with patient-specific NAL-NL2 and DSL v5.0 prescription targets, probe positioning, gain adjustment, accuracy scoring
- **Contour Test** — Loudness scaling with Cox 7-point scale, MCL/UCL determination, dynamic range and recruitment analysis

### Educational Content

- **Ear Anatomy** — Interactive 3D model (Three.js), step-by-step outer/middle/inner ear exploration, glossary, knowledge quizzes
- **Otoscopy** — Reference images of normal and pathological findings, identification practice
- **Tutorial System** — Progressive step-through lessons on audiometric fundamentals
- **Troubleshooting Guide** — Hearing aid troubleshooting flowcharts and checklists

### Patient System

- **23 Virtual Patients** — Clinically valid audiograms (bone <= air enforced), deterministic thresholds, case histories, difficulty ratings (beginner/intermediate/advanced)
- **Custom Patient Builder** — Create, edit, delete custom patients with per-frequency/per-ear threshold entry, audiogram preview, validation, audiometric presets, localStorage persistence
- **Patient Filtering** — Search and filter by difficulty, hearing loss type, tags

### Progress Tracking

- **Session History** — Accuracy tracking per session with per-frequency and per-ear breakdown
- **Improvement Trends** — Line charts showing accuracy over time, weakest areas identification
- **Masking Practice Scores** — Separate tracking for masking decision accuracy

### Settings & Configuration

- **Appearance** — Light, dark, and high-contrast themes; adjustable font size
- **Audiogram Conventions** — ASHA or BSA symbol standards
- **Test Configuration** — Air/bone conduction toggles, starting level, pulsed/continuous tones, frequency display range
- **Masking Protocol** — Hood plateau method or formula-based preference
- **Data Management** — Clear progress data, clear custom patients, reset all settings

### Technical Features

- **PWA** — Installable, works offline via service worker
- **Code Splitting** — Route-based lazy loading, dynamic imports for 3D model/PDF/charting libraries
- **Responsive** — Mobile-first design with MUI breakpoints (desktop, tablet, mobile layouts)
- **Accessible** — WCAG 2.1 AA: aria-labels, keyboard navigation, focus indicators, high-contrast mode
- **Keyboard Shortcuts** — Space (present tone), arrows (intensity/frequency), R/L (ear), M (masking), Enter (store threshold)

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19, TypeScript 5.4+ |
| Build | Vite 8, ESM-native |
| UI | Material UI 6, Emotion |
| 3D | React Three Fiber 9, Three.js, Drei |
| Charts | Chart.js 4, Recharts |
| Audio | Web Audio API (custom AudioEngine) |
| Testing | Vitest, React Testing Library |
| Routing | React Router 7 (HashRouter for GitHub Pages) |
| PWA | vite-plugin-pwa, Workbox |
| Deploy | GitHub Pages via `gh-pages` |

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
git clone https://github.com/sk408/audiometry_trainer.git
cd audiometry_trainer
npm install
```

### Development

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run test         # Run all tests (Vitest)
npm run test:watch   # Watch mode
npm run build        # Production build (TypeScript check + Vite)
npm run preview      # Preview production build locally
```

### Deployment

```bash
npm run deploy       # Build and deploy to GitHub Pages
```

## Clinical Standards

This application follows published clinical guidelines:

- **Hughson-Westlake Protocol** — Per ASHA (2005) and BSA (2011): 10 dB down on response, 5 dB up on no response, threshold at lowest level with >=2/3 ascending responses
- **Masking Rules** — Per ASHA guidelines: AC masking when test ear AC - non-test ear BC >= interaural attenuation (40 dB supra-aural, 55 dB insert, 0 dB bone); initial masking = non-test ear BC + 10 dB safety factor
- **Audiogram Symbols** — ASHA (1990) standard: O/X for right/left AC, </> for right/left unmasked BC, red=right, blue=left
- **REM Targets** — NAL-NL2 prescription formula (inputs: audiogram, age, gender, experience, vent type); DSL v5.0 for pediatric
- **Patient Validity** — Bone conduction thresholds never exceed air conduction; air-bone gaps within clinically realistic ranges

> **Disclaimer**: This application is an educational training tool and does not replace calibrated clinical audiometric equipment.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── anatomy/      # Ear anatomy viewer, quiz, glossary
│   ├── audiogram/    # Audiogram chart rendering
│   ├── education/    # Lesson stepper, quiz cards
│   ├── patient/      # Patient cards, grid, detail
│   ├── rem/          # REM chart and workspace
│   ├── shared/       # TabPanel, PDF exporter, keyboard shortcuts
│   └── testing/      # Testing workspace, control panel, results
├── data/             # Static data (anatomy content, patient data)
├── hooks/            # Custom React hooks
├── interfaces/       # TypeScript type definitions
├── pages/            # Route-level page components
├── services/         # Business logic (audio, testing, patient, REM, progress)
└── test/             # Test setup and utilities
```

## License

Custom Open Source License — see [LICENSE](./LICENSE). Open for educational use; original author retains commercial rights.

## Acknowledgments

- American Speech-Language-Hearing Association (ASHA) for audiometry guidelines
- British Society of Audiology (BSA) for recommended procedures
- National Acoustic Laboratories for NAL-NL2 prescription formula
- Audiology educators and students who provided feedback during development
