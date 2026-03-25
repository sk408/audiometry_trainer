# PROJECT_SPEC.md — Audiometry Trainer v2.0

## 1. Vision & Goals

### Vision
Audiometry Trainer is a web-based clinical simulation platform that teaches audiology students and professionals how to perform, interpret, and troubleshoot audiometric assessments. It should feel like sitting at a real audiometer with a real patient — not like reading a textbook.

### Goals
1. **Clinical fidelity** — Every simulated procedure must follow published clinical standards (ASHA, BSA, AAA). A student who masters this app should be able to walk into a clinic and perform a competent evaluation.
2. **Meaningful feedback** — After every test session, the student receives actionable feedback: what they did right, what they got wrong, and *why* the correct approach matters clinically.
3. **Progressive mastery** — Content is scaffolded from foundational concepts through advanced techniques, with measurable skill progression.
4. **Technical soundness** — Zero critical bugs. Proper audio lifecycle management. Correct state handling. Tested service layer.
5. **Accessibility** — WCAG 2.1 AA compliance. The app itself must meet the accessibility standards it teaches.

### Success Metrics
- Student can complete a full Hughson-Westlake assessment and achieve >=80% threshold accuracy within 10 practice sessions
- All 8 critical bugs from the code review are resolved
- >=80% unit test coverage on services, >=60% overall
- Lighthouse accessibility score >= 90
- First meaningful paint < 2s on 4G connection

---

## 2. User Personas

### Persona 1: Maya — Audiology Graduate Student
- **Background**: 2nd-year AuD student, has completed didactic coursework, preparing for first clinical rotation
- **Goals**: Practice Hughson-Westlake procedure until it's muscle memory; understand when and how to mask; interpret audiograms confidently
- **Pain points**: Limited access to clinic equipment outside rotation hours; anxiety about making mistakes on real patients
- **Usage pattern**: 30-60 min practice sessions, 3-4 times per week; works through patient cases progressively
- **Needs**: Step-by-step guidance that fades as competence grows; immediate feedback on technique errors; variety of hearing loss configurations

### Persona 2: Dr. Patel — Practicing Audiologist
- **Background**: 8 years clinical experience, primarily hearing aid dispensing, wants to refresh on procedures
- **Goals**: Review REM verification protocols; practice with unusual audiometric configurations; stay current on best practices
- **Pain points**: Continuing education requirements; encountering rare configurations in clinic with no recent practice
- **Usage pattern**: Occasional 15-30 min sessions; skips tutorials, goes straight to advanced cases
- **Needs**: Ability to skip onboarding; complex patient cases; detailed clinical notes on each case; export/print results

### Persona 3: Professor Chen — Audiology Educator
- **Background**: University professor teaching clinical audiology courses
- **Goals**: Assign specific patient cases to students; review student performance; demonstrate procedures in lectures
- **Pain points**: Can't observe 20 students simultaneously in clinic; needs standardized training scenarios
- **Needs**: Shareable case links; student progress dashboards; ability to create custom patient profiles; presentation mode for lectures

---

## 3. Core Feature Set

### 3.1 Pure Tone Audiometry (Primary Feature)

**Current state**: Partially working. Hughson-Westlake protocol implemented but has stale closure bugs, accuracy always returns 0%, masking is stubbed.

**Target state**:
- Complete Hughson-Westlake implementation with correct 10-down/5-up bracketing
- Proper threshold determination: lowest level with 2/3 ascending responses
- Air conduction testing at 250, 500, 1000, 2000, 3000, 4000, 6000, 8000 Hz
- Bone conduction testing at 250, 500, 1000, 2000, 3000, 4000 Hz
- 1000 Hz retest for reliability check (>5 dB difference triggers retest)
- Functional masking with narrowband noise (clinical masking rules implemented)
- Interaural attenuation calculations for masking decisions
- Manual and automatic mode (automatic for learning, manual for assessment)
- Configurable starting level (default 40 dB HL)
- Pulsed and continuous tone options
- Variable tone duration (1-2 seconds) with randomized inter-stimulus intervals
- Session timer showing elapsed time
- Real-time audiogram plotting during test

**Keyboard controls**:
| Key | Action |
|-----|--------|
| Space | Present tone |
| Up/Down arrows | Adjust intensity (5 dB steps) |
| Shift+Up/Down | Adjust intensity (10 dB steps) |
| Left/Right arrows | Change frequency |
| R / L | Switch ear |
| M | Toggle masking |
| Enter | Store threshold |
| N | Next frequency |
| Escape | Cancel current tone |

### 3.2 Virtual Patient System

**Current state**: 6 hardcoded patients. Bone thresholds can exceed air thresholds (audiologically impossible). Random generation per session means same patient gives different results.

**Target state**:
- 20+ predefined patients covering all major hearing loss configurations:
  - Normal hearing (bilateral)
  - Mild/moderate/severe/profound SNHL (flat, sloping, rising, cookie-bite, noise-notch)
  - Conductive hearing loss (unilateral and bilateral)
  - Mixed hearing loss
  - Asymmetric hearing loss (requiring masking)
  - Pediatric configurations
  - Presbycusis (age-related)
- Deterministic thresholds (seeded random with patient ID, not random per session)
- Guaranteed audiometric validity: bone <= air for all frequencies
- Air-bone gaps constrained to clinically realistic ranges per loss type
- Patient metadata: age, gender, case history, otoscopic findings, chief complaint
- Difficulty rating: beginner (normal, mild SNHL), intermediate (conductive, moderate SNHL), advanced (mixed, asymmetric requiring masking)
- Response behavior modeling:
  - Response latency varies by hearing level (slower near threshold)
  - Occasional false positives (rate configurable, default 2%)
  - Occasional false negatives near threshold (rate configurable)
  - Patient fatigue simulation (response reliability decreases over time)
- Custom patient builder (for educators)

### 3.3 Audiogram Display

**Current state**: Chart.js scatter plot. Not memoized. Reticle flashes at 5 Hz causing constant re-render. Click-to-position doesn't update service.

**Target state**:
- Standard clinical audiogram layout per ASHA/BSA conventions
- Correct symbols: O (right air), X (left air), < (right bone unmasked), > (left bone unmasked), △ (right masked air), □ (left masked air), [ (right masked bone), ] (left masked bone)
- No-response symbols with downward arrows
- Color coding: Red = right ear, Blue = left ear
- Frequency axis: logarithmic, 125-8000 Hz
- Intensity axis: -10 to 120 dB HL, inverted (better hearing at top)
- Shaded regions for hearing loss classification (normal, mild, moderate, moderately severe, severe, profound)
- Interactive: click to place/move thresholds in manual mode
- Real-time reticle showing current test position (frequency + level)
- Memoized rendering — only re-render when threshold data changes
- Responsive: works on mobile (simplified labels, touch-friendly)
- Print-friendly version with white background and proper margins
- Overlay mode: show student results vs actual thresholds after test

### 3.4 Real Ear Measurement Simulation

**Current state**: Functional but with audio leaks, non-singleton service, hardcoded targets that ignore patient audiogram.

**Target state**:
- Complete REM workflow: REUR → REOR → REAR → REIG (calculated)
- RECD measurement option
- RESR (maximum output) testing
- Targets derived from patient audiogram using NAL-NL2 prescription formula
- DSL v5.0 as alternative prescription method
- Input levels: 50, 55, 60, 65, 70, 75, 80 dB SPL
- Signal types: ISTS (International Speech Test Signal), speech-weighted noise, pure tone sweep
- Probe tube positioning simulation with visual feedback
- Vent effect simulation (occluded, small, medium, large, open dome)
- Adjustable gain curves with real-time target matching
- Accuracy scoring based on clinical tolerances (±3 dB speech frequencies, ±5 dB other)
- Virtual hearing aid models with realistic gain/output characteristics

### 3.5 Contour Test (Loudness Scaling)

**Current state**: Data entry form with analysis. Functional but not interactive.

**Target state**:
- Interactive tone presentation at selected frequency
- Cox contour test protocol with 7-point loudness scale
- Visual loudness growth function plotted in real-time
- MCL and UCL determination
- Dynamic range calculation
- Recruitment detection (abnormally rapid loudness growth)
- Hyperacusis screening
- Hearing aid compression recommendations based on results

### 3.6 Educational Content

**Current state**: Large inline JSX arrays in god components. Tutorial, anatomy, otoscopy pages.

**Target state**:
- **Ear Anatomy Module**: 3D interactive model with labeled structures; quiz mode; outer/middle/inner ear sections with educational overlays
- **Otoscopy Module**: High-quality reference images of normal and pathological findings; identification quiz; clinical decision tree
- **Tutorial System**: Progressive lessons with checkpoints; theory + practice integration; spaced repetition for key concepts
- **Troubleshooting Guide**: Hearing aid troubleshooting flowcharts; brand-specific pairing instructions; printable/downloadable checklists
- **Follow-Up Protocol**: Step-by-step hearing aid follow-up procedure; validation checklists; counseling guides
- **Glossary**: Searchable clinical terminology with definitions

### 3.7 Progress Tracking & Feedback

**Current state**: Accuracy always returns 0%. No persistence of results across sessions.

**Target state**:
- Per-session results: accuracy by frequency, accuracy by ear, technique errors, time analysis
- Historical tracking: improvement over time, weakest areas, session history
- Accuracy calculation: compare user thresholds to patient thresholds with ±5 dB and ±10 dB windows
- Technique analysis: step size errors, masking errors, sequence errors, timing issues
- Feedback messages keyed to specific error types with educational context
- Achievement/milestone system (optional, non-gamified — e.g., "Completed 10 conductive cases")
- Export results as PDF report
- LocalStorage persistence with IndexedDB fallback for larger datasets

### 3.8 Settings & Configuration

**Current state**: Settings partially implemented, some state in localStorage.

**Target state**:
- Dark/light/high-contrast themes
- Font size adjustment (small/medium/large)
- Test configuration: include/exclude bone conduction, select frequency set, set starting level
- Audio calibration offset (for different headphone types)
- Keyboard shortcut customization
- Trainer mode toggle (guided vs. unguided)
- Difficulty progression: auto-advance when mastery criteria met
- All settings persisted to localStorage with schema versioning

---

## 4. Technical Architecture

### 4.1 Build System & Tooling

**Current**: Create React App (react-scripts 5), which is EOL and incompatible with React 19.

**Target**: Migrate to **Vite** with the following stack:
- **Vite 6+** — Build tool (fast HMR, ESM-native)
- **React 19** — UI framework
- **TypeScript 5.4+** — Type safety (target ES2022, strict mode)
- **Vitest** — Unit testing (compatible with Vite, Jest-API-compatible)
- **React Testing Library** — Component testing
- **Playwright** — E2E testing
- **ESLint** (flat config) + **Prettier** — Code quality
- **Husky** + **lint-staged** — Pre-commit hooks

### 4.2 State Management

**Current**: Singleton services with mutable state, React component state, localStorage. State bleeds between sessions.

**Target**:
- **React Context + useReducer** for global app state (theme, settings, user profile)
- **Component-local state** for UI-only concerns (drawer open, active tab)
- **Service layer** with immutable state returns — services return new objects, never expose mutable internals
- **Custom hooks** to bridge services and React (`useTestSession`, `useAudioEngine`, `usePatient`)
- **No external state library** — the app is not complex enough to justify Redux/Zustand overhead
- All service state reset cleanly between sessions via explicit `reset()` methods

### 4.3 Service Layer

Refactored services with clear boundaries:

```
services/
├── audio/
│   ├── AudioEngine.ts          # Web Audio API wrapper, node lifecycle management
│   ├── ToneGenerator.ts        # Pure tone generation with proper envelope
│   ├── NoiseGenerator.ts       # Masking noise (narrowband, white, pink, speech)
│   ├── AudioCalibration.ts     # dB HL to amplitude conversion with RETSPL
│   └── index.ts
├── testing/
│   ├── TestSession.ts          # Session lifecycle, immutable state
│   ├── HughsonWestlake.ts      # Protocol logic (pure function)
│   ├── ThresholdCalculator.ts  # Threshold determination from responses
│   ├── MaskingRules.ts         # When/how much to mask
│   ├── AccuracyCalculator.ts   # Compare user vs actual thresholds
│   └── index.ts
├── patient/
│   ├── PatientRepository.ts    # Patient data access
│   ├── PatientGenerator.ts     # Procedural patient generation
│   ├── ResponseSimulator.ts    # Virtual patient response behavior
│   └── index.ts
├── rem/
│   ├── REMSession.ts           # REM session management
│   ├── PrescriptionFormula.ts  # NAL-NL2, DSL v5 calculations
│   ├── REMSimulator.ts         # Measurement simulation
│   └── index.ts
├── progress/
│   ├── ProgressTracker.ts      # Session history, statistics
│   ├── StorageAdapter.ts       # localStorage/IndexedDB abstraction
│   └── index.ts
└── contour/
    ├── ContourSession.ts       # Contour test session
    ├── LoudnessAnalyzer.ts     # MCL/UCL/recruitment analysis
    └── index.ts
```

Key principles:
- Services are **classes with private state** but return **immutable snapshots**
- Services are instantiated via **factory functions**, not global singletons (enables testing)
- Audio nodes are tracked in a **Set** and cleaned up on dispose — no more orphaned nodes
- All audio operations go through a single **AudioEngine** that manages the AudioContext lifecycle

### 4.4 Component Architecture

```
components/
├── layout/
│   ├── AppShell.tsx            # AppBar, Drawer, Footer, theme provider
│   ├── PageContainer.tsx       # Standard page wrapper with responsive padding
│   └── NavigationDrawer.tsx    # Sidebar navigation
├── audiogram/
│   ├── Audiogram.tsx           # Chart rendering (memoized)
│   ├── AudiogramLegend.tsx     # Symbol legend
│   ├── AudiogramControls.tsx   # Zoom, pan, export controls
│   └── useAudiogramData.ts    # Data transformation hook
├── testing/
│   ├── TestingWorkspace.tsx    # Main testing layout (orchestrator)
│   ├── ControlPanel.tsx        # Frequency, level, ear controls
│   ├── TonePresenter.tsx       # Present tone button + keyboard handler
│   ├── PatientAvatar.tsx       # Visual patient response indicator
│   ├── GuidancePanel.tsx       # Hughson-Westlake coaching
│   ├── ProgressBar.tsx         # Test completion progress
│   └── ResultsSummary.tsx      # Post-test results
├── rem/
│   ├── REMWorkspace.tsx        # REM testing layout
│   ├── REMChart.tsx            # Measurement chart
│   ├── ProbePositioner.tsx     # Probe tube placement UI
│   ├── GainAdjuster.tsx        # Gain curve manipulation
│   └── TargetOverlay.tsx       # Prescription target display
├── education/
│   ├── LessonStepper.tsx       # Step-through lesson navigation
│   ├── QuizCard.tsx            # Quiz question component
│   ├── AnatomyViewer.tsx       # 3D model wrapper
│   └── ImageViewer.tsx         # Zoomable reference images
├── patient/
│   ├── PatientCard.tsx         # Patient selection card
│   ├── PatientGrid.tsx         # Filtered patient list
│   └── PatientDetail.tsx       # Case history display
└── shared/
    ├── TabPanel.tsx            # Shared tab panel (deduplicated)
    ├── PDFExporter.tsx         # PDF generation
    └── KeyboardShortcuts.tsx   # Global keyboard handler
```

### 4.5 Routing

```
/                           → Home (landing page)
/learn                      → Learning hub
/learn/tutorial             → Audiometry tutorial
/learn/anatomy              → Ear anatomy explorer
/learn/otoscopy             → Otoscopy guide
/learn/glossary             → Clinical glossary
/practice                   → Practice hub
/practice/patients          → Patient selection
/practice/test/:patientId   → Active audiometry test
/practice/results/:sessionId → Test results
/practice/rem               → Real ear measurement
/practice/contour           → Contour test
/tools                      → Clinical tools hub
/tools/followup             → Follow-up guide
/tools/troubleshooting      → Troubleshooting guide
/progress                   → Progress dashboard
/settings                   → App settings
```

---

## 5. Data Model

### 5.1 Patient Profile
```typescript
interface PatientProfile {
  id: string;                           // Unique identifier
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  caseHistory: CaseHistory;
  audiometricData: AudiometricData;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];                        // e.g., ['masking-required', 'asymmetric']
}

interface CaseHistory {
  chiefComplaint: string;
  medicalHistory: string[];
  noiseExposure: string;
  medications: string[];
  otoscopicFindings: OtoscopicFindings;
}

interface OtoscopicFindings {
  rightEar: string;
  leftEar: string;
  images?: string[];                     // Reference image IDs
}

interface AudiometricData {
  airConduction: ThresholdSet;
  boneConduction: ThresholdSet;
  speechRecognitionThreshold?: number;
  wordRecognitionScore?: number;
  tympanometryType?: 'A' | 'As' | 'Ad' | 'B' | 'C';
}

interface ThresholdSet {
  right: Map<Frequency, HearingLevel>;
  left: Map<Frequency, HearingLevel>;
}
```

### 5.2 Test Session
```typescript
interface TestSession {
  id: string;
  patientId: string;
  startTime: Date;
  endTime?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
  config: TestConfig;
  steps: TestStepRecord[];
  results?: TestResults;
}

interface TestConfig {
  includeAirConduction: boolean;
  includeBoneConduction: boolean;
  includeMasking: boolean;
  startingLevel: HearingLevel;
  frequencySet: Frequency[];
  trainerMode: boolean;
  toneType: 'pulsed' | 'continuous';
}

interface TestStepRecord {
  id: number;
  frequency: Frequency;
  ear: Ear;
  testType: TestType;
  presentations: Presentation[];
  threshold?: HearingLevel;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped';
}

interface Presentation {
  level: HearingLevel;
  timestamp: Date;
  responded: boolean;
  responseLatency?: number;              // ms from tone onset
  masking?: { ear: Ear; level: HearingLevel; type: string };
}
```

### 5.3 Test Results
```typescript
interface TestResults {
  sessionId: string;
  patientId: string;
  timestamp: Date;
  duration: number;                      // seconds
  userThresholds: ThresholdSet;
  actualThresholds: ThresholdSet;
  accuracy: AccuracyMetrics;
  techniqueErrors: TechniqueError[];
  educationalNotes: string[];
}

interface AccuracyMetrics {
  overall: number;                       // 0-100
  exactMatch: number;                    // % within 0 dB
  within5dB: number;                     // % within ±5 dB
  within10dB: number;                    // % within ±10 dB
  byFrequency: Map<Frequency, number>;   // Accuracy per frequency
  byEar: { right: number; left: number };
  byTestType: { air: number; bone: number };
}

interface TechniqueError {
  type: 'step_size' | 'masking_needed' | 'masking_level' | 'sequence' | 'insufficient_responses' | 'starting_level';
  frequency: Frequency;
  ear: Ear;
  description: string;
  severity: 'minor' | 'moderate' | 'critical';
}
```

### 5.4 Progress Record
```typescript
interface ProgressRecord {
  userId: string;                        // "default" for single-user mode
  sessions: SessionSummary[];
  statistics: ProgressStatistics;
  achievements: Achievement[];
  lastUpdated: Date;
}

interface SessionSummary {
  sessionId: string;
  patientId: string;
  date: Date;
  duration: number;
  overallAccuracy: number;
  hearingLossType: string;
  difficulty: string;
}

interface ProgressStatistics {
  totalSessions: number;
  totalPracticeTime: number;             // minutes
  averageAccuracy: number;
  accuracyTrend: number[];               // Last 20 sessions
  weakestFrequencies: Frequency[];
  strongestFrequencies: Frequency[];
  masteredDifficulties: string[];
}
```

---

## 6. Audio Engine Requirements

### 6.1 Core Requirements
- Single **AudioContext** for the entire application (shared across all audio features)
- All created audio nodes must be tracked and properly disconnected/stopped on cleanup
- Tone generation must use `OscillatorNode` with `GainNode` envelope (attack: 20ms, release: 20ms) to prevent clicks
- Pulsed tone: 200ms on, 200ms off (configurable)
- Stereo panning via `StereoPannerNode`: -1 (left), +1 (right)
- AudioContext must be resumed on first user gesture (browser autoplay policy)

### 6.2 Masking Noise
- Narrowband noise centered on test frequency (±1/3 octave bandwidth)
- White noise option for broadband masking
- Independent gain control from test tone
- Simultaneous presentation with test tone to contralateral ear
- Proper interaural attenuation lookup table for masking level calculations

### 6.3 Calibration
- dB HL to amplitude conversion using Reference Equivalent Threshold Sound Pressure Levels (RETSPL) per ISO 389
- Separate calibration tables for air conduction and bone conduction
- User-configurable calibration offset (for different transducer types)
- Maximum output limits to prevent hearing damage (never exceed safe listening levels through consumer headphones)
- **Disclaimer**: The app must display a prominent warning that it does not replace calibrated clinical equipment

### 6.4 Bone Conduction Simulation
- Triangle wave oscillator (reduced high-frequency harmonics)
- Low-pass filter at 4000 Hz
- Reduced amplitude factor (0.7x) relative to air conduction
- Bone conduction filter stored as class field and cleaned up properly (fixes C1)

### 6.5 REM Audio
- Sweep tone: exponential ramp 125-8000 Hz over 5 seconds
- ISTS-like stimulus: filtered noise with speech-shaped spectrum
- All buffer sources tracked and stoppable (fixes C1 — noise playing forever)

### 6.6 Lifecycle
- `AudioEngine.dispose()` must disconnect all nodes, stop all sources, and close the AudioContext
- Components must call dispose on unmount
- No orphaned audio nodes under any circumstance

---

## 7. UI/UX Requirements

### 7.1 Design System
- Material UI 6 as component library
- Custom theme with clinical/professional aesthetic:
  - Primary: deep blue (#1565C0)
  - Secondary: teal (#00897B)
  - Error: clinical red (#D32F2F)
  - Success: clinical green (#388E3C)
- Three theme modes: Light (default), Dark, High Contrast
- 8px spacing grid
- Border radius: 8px for cards, 4px for buttons
- Typography: Inter or system font stack (no Google Fonts render-blocking)

### 7.2 Responsive Design
- Mobile-first CSS with MUI breakpoints
- Three layout tiers:
  - **Desktop** (>=1024px): Full testing interface with audiogram, controls, guidance panel side-by-side
  - **Tablet** (768-1023px): Stacked layout with collapsible panels
  - **Mobile** (<768px): Single-column with tabbed navigation between audiogram/controls/guidance
- Touch-friendly controls: minimum 44x44px touch targets
- No `window.innerWidth` reads during render — use `useMediaQuery` exclusively (fixes C8)

### 7.3 Accessibility (WCAG 2.1 AA)
- All interactive elements have visible focus indicators
- Color is never the sole means of conveying information (patterns/shapes supplement color on audiogram)
- All images have descriptive alt text
- Form inputs have associated labels (fixes M12)
- ARIA attributes on custom components (accordions, tabs, sliders)
- Keyboard navigable: all features accessible without mouse
- Screen reader announcements for dynamic content (tone presented, patient responded, threshold stored)
- Minimum 4.5:1 contrast ratio for text, 3:1 for large text and UI components
- Reduced motion support: `prefers-reduced-motion` disables animations
- No `alert()` dialogs (fixes H6) — use snackbars or inline alerts

### 7.4 Navigation
- Top AppBar with responsive navigation (hamburger on mobile, full nav on desktop)
- Breadcrumb trail on nested pages
- Keyboard shortcut overlay (? key to toggle)
- Consistent back/cancel behavior — never lose work without confirmation

---

## 8. Clinical Accuracy Requirements

### 8.1 Hughson-Westlake Protocol
Per ASHA (2005) and BSA (2011) guidelines:
- Start at 1000 Hz in the better ear (or right ear if unknown)
- Present tone at 30-40 dB HL
- On response: decrease 10 dB
- On no response: increase 5 dB (10 dB during initial familiarization)
- Threshold = lowest level with responses on >=50% of ascending trials (minimum 2 of 3)
- Retest 1000 Hz — if >5 dB difference, retest until stable
- Frequency sequence: 1000 → 2000 → 3000 → 4000 → 6000 → 8000 → 500 → 250 Hz (then repeat other ear)
- Inter-stimulus interval: variable 1-3 seconds (prevent rhythmic responding)
- Tone duration: 1-2 seconds

### 8.2 Masking
Per ASHA masking guidelines:
- Required when air conduction threshold in test ear exceeds bone conduction threshold in non-test ear by the interaural attenuation value
- Interaural attenuation values:
  - Supra-aural headphones: 40 dB (all frequencies)
  - Insert earphones: 55 dB (minimum, frequency-dependent)
  - Bone conduction: 0 dB (always mask for bone conduction with asymmetry)
- Masking noise: narrowband noise centered on test frequency
- Initial masking level: non-test ear bone conduction threshold + 10 dB
- Overmasking check: masking level must not exceed test ear bone conduction threshold + interaural attenuation

### 8.3 Audiogram Conventions
- Symbols per ASHA (1990) standard
- Frequency on X-axis (logarithmic): 125-8000 Hz
- Hearing level on Y-axis (inverted): -10 to 120 dB HL
- Red = right ear, Blue = left ear
- Air conduction: connected lines
- Bone conduction: not connected (plotted at frequency position)

### 8.4 Patient Generation Validity
- Bone conduction thresholds must NEVER exceed air conduction thresholds at any frequency
- Air-bone gap for conductive component: 10-60 dB (realistic range)
- Adjacent frequency thresholds should not differ by more than 25 dB (unless noise notch pattern)
- Hearing loss configurations must match real clinical distributions

### 8.5 REM Standards
- NAL-NL2 prescription targets based on patient audiogram, age, gender, experience
- DSL v5.0 targets for pediatric cases
- Accuracy scoring: within ±3 dB at speech frequencies (1000-4000 Hz), ±5 dB elsewhere

---

## 9. Testing Requirements

### 9.1 Coverage Targets
| Layer | Target | Priority |
|-------|--------|----------|
| Service logic (HughsonWestlake, ThresholdCalculator, MaskingRules) | 95% | P0 |
| Service layer (AudioEngine, TestSession, PatientRepository) | 80% | P0 |
| Custom hooks (useTestSession, useAudioEngine) | 70% | P1 |
| Component rendering | 60% | P1 |
| E2E critical paths | 5 flows | P1 |
| Integration (service + component) | 50% | P2 |

### 9.2 Testing Strategy

**Unit tests (Vitest)**:
- All pure functions (protocol logic, threshold calculation, masking rules, accuracy)
- Service methods with mocked dependencies
- Patient generation validity checks (bone <= air, realistic ranges)
- Audio calibration calculations

**Component tests (React Testing Library)**:
- Render tests for all components
- User interaction flows (click, keyboard)
- Conditional rendering (loading, error, empty states)
- Accessibility checks (axe-core integration)

**E2E tests (Playwright)**:
- Complete test session: select patient → conduct test → view results
- REM workflow: select hearing aid → position probe → measure → match target
- Tutorial completion flow
- Settings persistence across page reload
- Mobile viewport testing

**Audio tests**:
- Mock AudioContext for unit tests
- Verify correct node creation and connection order
- Verify all nodes are cleaned up on dispose
- Verify tone parameters (frequency, duration, pan)

### 9.3 Test Infrastructure
- CI/CD pipeline runs all tests on PR
- Pre-commit hook runs affected unit tests
- Coverage reports generated on every build
- Visual regression tests for audiogram rendering (optional, P2)

---

## 10. Non-Functional Requirements

### 10.1 Performance
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 500KB gzipped (without 3D model assets)
- Audiogram re-renders: < 16ms (60fps)
- Audio latency: < 50ms from user action to tone onset
- Lazy load: 3D model viewer, PDF export, charting libraries
- Code splitting: per-route chunks

### 10.2 Browser Support
- Chrome 90+ (primary)
- Firefox 90+
- Safari 15+ (including iOS Safari)
- Edge 90+
- Web Audio API required (no fallback)
- WebGL required only for 3D anatomy module (graceful degradation to 2D images)

### 10.3 Offline Capability
- Service worker for asset caching (Vite PWA plugin)
- All patient data and educational content available offline
- Test sessions work fully offline
- Sync progress data when connection restored
- Manifest.json for installable PWA

### 10.4 Security
- No user authentication (client-only app)
- No server communication (all data in browser storage)
- HTML content rendered via React (no `dangerouslySetInnerHTML` without sanitization)
- CSP headers configured for GitHub Pages deployment
- No inline script evaluation

### 10.5 Data Persistence
- Primary: `localStorage` with JSON schema versioning
- Migration system: when schema version changes, migrate data automatically
- Maximum storage: 5MB target (well within localStorage limits)
- IndexedDB for session recordings if needed (future)
- Export: PDF reports, CSV threshold data
- Import: shared patient profiles via URL parameters (future)

### 10.6 Deployment
- GitHub Pages (existing target)
- Vite build with hash-based filenames for cache busting
- `HashRouter` (required for GitHub Pages — no server-side routing)
- Environment-aware asset paths via `import.meta.env.BASE_URL`
- Automated deployment via GitHub Actions
