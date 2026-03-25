# IMPLEMENTATION_PLAN.md — Audiometry Trainer v2.0

## Overview

This plan is organized into 7 phases. Each phase delivers working, shippable value. Phases 1-3 are foundational and must be completed in order. Phases 4-7 can be parallelized or reordered based on priorities.

**Estimated total effort**: ~120-160 tasks across all phases.

**Notation**: S = Small (< 2 hours), M = Medium (2-4 hours), L = Large (4-8 hours), XL = Extra Large (> 8 hours)

---

## Phase 1: Foundation — Build System, Architecture, and Critical Bug Fixes

**Goal**: Migrate from CRA to Vite, establish the new service architecture, fix all critical (C1-C8) bugs, and set up the testing infrastructure. After this phase, the app compiles and runs on the new build system with all crashes and data-corruption bugs eliminated.

**Dependencies**: None (this is the starting point).

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 1.1 | **Migrate from CRA to Vite** | `vite.config.ts`, `index.html`, `tsconfig.json`, `package.json`, delete `react-scripts`-specific files (`src/react-app-env.d.ts`, `src/reportWebVitals.ts`, `src/setupTests.ts`) | L | Install `vite`, `@vitejs/plugin-react`, configure `base` for GitHub Pages. Update `tsconfig.json` target to `ES2022`. Move `index.html` to root. Replace `process.env.PUBLIC_URL` with `import.meta.env.BASE_URL`. |
| 1.2 | **Update TypeScript to v5.4+** | `tsconfig.json`, `package.json` | S | Enable `strict`, set `target: "ES2022"`, `module: "ESNext"`. |
| 1.3 | **Move test/type packages to devDependencies** | `package.json` | S | Move `@testing-library/*`, `@types/*` from `dependencies` to `devDependencies`. Fixes H14. |
| 1.4 | **Set up Vitest + React Testing Library** | `vitest.config.ts`, `src/test/setup.ts`, `package.json` | M | Install `vitest`, `@testing-library/react`, `jsdom`, `@vitest/coverage-v8`. Configure test scripts. |
| 1.5 | **Set up ESLint flat config + Prettier** | `eslint.config.js`, `.prettierrc`, `package.json` | M | Remove CRA eslint config from `package.json`. Install `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`. |
| 1.6 | **Set up Husky + lint-staged** | `.husky/pre-commit`, `package.json` | S | Pre-commit: lint staged files + run affected tests. |
| 1.7 | **Create AudioEngine service** — fix C1, C5 | `src/services/audio/AudioEngine.ts` | L | Single AudioContext for entire app. Track all nodes in a `Set<AudioNode>`. `dispose()` disconnects everything. Export singleton instance. Replaces both `AudioService.ts` and eliminates `RealEarMeasurementService` audio duplication. |
| 1.8 | **Create ToneGenerator** — fix C1 bone filter leak | `src/services/audio/ToneGenerator.ts` | M | Pure tone generation with proper envelope. Bone conduction filter stored as tracked node. Pulsed tone support. |
| 1.9 | **Create NoiseGenerator** — fix H15 | `src/services/audio/NoiseGenerator.ts` | M | Narrowband noise, white noise, speech noise. All buffer sources tracked and stoppable. Replaces stubbed `playMaskingNoise`. |
| 1.10 | **Fix stale closures in TestingInterface** — fix C2 | `src/components/TestingInterface.tsx` | L | Use `useRef` for values read in timers/callbacks (`toneActive`, `patientResponse`). Fix `stopTone` dependency array. Use functional state updates for `responseCounts`. |
| 1.11 | **Fix direct state mutation** — fix C3 | `src/components/TestingInterface.tsx` | M | `handlePreviousStep`: copy session before modifying. `handleStoreThreshold`: deep copy `testSequence`. Never mutate service-owned objects. |
| 1.12 | **Fix useTheme outside ThemeProvider** — fix C4 | `src/App.tsx` | S | Move `useTheme()` call inside a child component that renders within `ThemeProvider`, or use the `appTheme` variable directly for splash screen color. |
| 1.13 | **Make RealEarMeasurementService a singleton** — fix C5 | `src/services/RealEarMeasurementService.ts` | S | Export singleton instance, not class. Use shared `AudioEngine` instead of creating own AudioContext. |
| 1.14 | **Fix calculateResults returning 0%** — fix C6 | `src/services/testing/AccuracyCalculator.ts` (new), `src/services/TestingService.ts` | M | New `AccuracyCalculator` that takes user thresholds + patient thresholds and computes real accuracy. Connect to `calculateResults`. |
| 1.15 | **Fix side effect in state updater** — fix C7 | `src/pages/RealEarMeasurementPage.tsx` | S | Move `initializeAdjustableREAR()` call outside of `setActiveStep` updater. Use `useEffect` triggered by step change. |
| 1.16 | **Replace window.innerWidth with useMediaQuery** — fix C8 | `src/pages/RealEarMeasurementPage.tsx` | S | Replace all `window.innerWidth` reads with MUI `useMediaQuery` or container-query responsive props. |
| 1.17 | **Fix duplicate 1000 Hz in frequency arrays** — fix H1 | `src/services/TestingService.ts` | S | Remove duplicate 1000 Hz entry. Proper sequence: `[1000, 2000, 3000, 4000, 6000, 8000, 500, 250]` for air. |
| 1.18 | **Fix patient audiogram validity** — fix H2 | `src/services/PatientService.ts` | M | Ensure `bone <= air` at every frequency. Generate bone first, then add air-bone gap for conductive/mixed. Add validation assertion. |
| 1.19 | **Fix singleton state bleed** — fix H3 | `src/services/TestingService.ts` | S | Reset `includeBoneConduction` and `includeAirConduction` in `startSession()`. |
| 1.20 | **Remove all `alert()` calls** — fix H6 | `src/components/EarModel3D.tsx` | S | Replace with console.error or inline error display. |
| 1.21 | **Delete CRA boilerplate** | Delete: `src/App.css`, `src/App.test.tsx`, `src/logo.svg`, `src/reportWebVitals.ts`, `src/setupTests.ts`, `src/react-app-env.d.ts`, `public/favicon - Copy.ico`, `public/logo512 - Copy.png`, `public/ComfyUI_00043_.png` | S | Clean up stray/duplicate files. |
| 1.22 | **Remove duplicate assets** — fix M17 | `src/assets/` vs `public/assets/` | S | Keep assets in `public/assets/`. Remove duplicates from `src/assets/` (except `audiogram_sample.png` which is imported). |
| 1.23 | **Strip debug logging** — fix M1, L1 | All service/component files | M | Remove all `console.log` statements. Set `debugMode = false`. Gate remaining debug logs behind `import.meta.env.DEV`. |
| 1.24 | **Write first service tests** | `src/services/testing/__tests__/HughsonWestlake.test.ts`, `src/services/patient/__tests__/PatientService.test.ts` | L | Test threshold determination, step size logic, frequency sequencing. Test patient validity (bone <= air). Establish testing patterns. |
| 1.25 | **Configure GitHub Actions CI** | `.github/workflows/ci.yml` | M | On PR: install → lint → typecheck → test → build. |

### Success Criteria
- [x] `npm run dev` starts Vite dev server
- [x] `npm run build` produces production build
- [x] `npm run test` runs Vitest with >0 passing tests
- [x] All C1-C8 critical bugs verified fixed
- [x] No `alert()` calls in codebase
- [x] No orphaned audio nodes on component unmount
- [x] CI pipeline green

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| CRA→Vite migration breaks imports | Run build after each major change; Vite has CRA compat mode |
| React 19 strict mode double-renders expose bugs | Fix bugs rather than disabling strict mode |
| Audio tests flaky in CI (no audio device) | Mock AudioContext in tests; test node creation/connection, not actual audio |

---

## Phase 2: Core Testing Experience — Hughson-Westlake Rewrite

**Goal**: Rebuild the core audiometry testing flow with correct protocol logic, clean state management, working accuracy calculation, and initial masking support. After this phase, a student can complete a full audiometry assessment and receive accurate feedback.

**Dependencies**: Phase 1 (build system, audio engine, critical fixes).

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 2.1 | **Create HughsonWestlake protocol module** | `src/services/testing/HughsonWestlake.ts` | L | Pure functions: `getNextAction(step)`, `isThresholdEstablished(responses)`, `determineThreshold(responses)`. No side effects. Thoroughly tested. |
| 2.2 | **Create TestSession service** | `src/services/testing/TestSession.ts` | L | Immutable session state. `startSession()`, `recordPresentation()`, `recordResponse()`, `getSnapshot()`. Returns new objects, never exposes mutable state. |
| 2.3 | **Create ThresholdCalculator** | `src/services/testing/ThresholdCalculator.ts` | M | Extract thresholds from completed session. Lowest level with >=2/3 ascending responses. |
| 2.4 | **Create AccuracyCalculator** | `src/services/testing/AccuracyCalculator.ts` | M | Compare user thresholds vs actual. Compute exact match, ±5 dB, ±10 dB metrics. Per-frequency, per-ear, per-type breakdowns. |
| 2.5 | **Create MaskingRules module** | `src/services/testing/MaskingRules.ts` | L | `isMaskingRequired(testEarAC, nonTestEarBC, transducer)`. `calculateMaskingLevel(nonTestEarBC, testEarBC)`. `isOvermasking(maskingLevel, testEarBC, IA)`. Interaural attenuation tables. |
| 2.6 | **Create ResponseSimulator** | `src/services/patient/ResponseSimulator.ts` | M | Deterministic (seeded) patient responses. Configurable variability, false positive rate, fatigue. Uses patient thresholds. |
| 2.7 | **Create useTestSession hook** | `src/hooks/useTestSession.ts` | M | Bridge between TestSession service and React. Handles state updates, cleanup on unmount. |
| 2.8 | **Create useAudioEngine hook** | `src/hooks/useAudioEngine.ts` | M | Bridge between AudioEngine and React. Handles AudioContext resume, cleanup on unmount, tone lifecycle. |
| 2.9 | **Decompose TestingInterface** — fix M2 | Split `src/components/TestingInterface.tsx` (2,010 lines) into: `testing/TestingWorkspace.tsx`, `testing/ControlPanel.tsx`, `testing/TonePresenter.tsx`, `testing/ProgressBar.tsx` | XL | Orchestrator pattern: `TestingWorkspace` manages session state, delegates to child components. Each child < 200 lines. |
| 2.10 | **Rebuild ControlPanel** | `src/components/testing/ControlPanel.tsx` | L | Frequency selector, level adjustment (±5, ±10), ear selector, test type toggle, masking controls. Keyboard shortcut integration. |
| 2.11 | **Rebuild GuidancePanel** | `src/components/testing/GuidancePanel.tsx` | M | Refactor existing GuidancePanel. Remove stale closure issues. Use protocol state from HughsonWestlake module. |
| 2.12 | **Rebuild PatientAvatar** | `src/components/testing/PatientAvatar.tsx` | S | Simplified from PatientImage. Cleaner animation. Remove excessive setTimeout nesting. |
| 2.13 | **Rebuild ResultsSummary** | `src/components/testing/ResultsSummary.tsx` | L | Uses new AccuracyCalculator. Shows overlay audiogram (user vs actual). Technique error analysis. Educational notes. |
| 2.14 | **Memoize Audiogram component** — fix M4 | `src/components/audiogram/Audiogram.tsx` | M | `useMemo` for `prepareChartData()`. Remove reticle flash interval (use CSS animation instead). `React.memo` wrapper. |
| 2.15 | **Fix handleAudiogramClick** — fix H16 | `src/components/audiogram/Audiogram.tsx` | S | On click: update both local state and service level via callback. |
| 2.16 | **Deduplicate TabPanel** — fix M13 | `src/components/shared/TabPanel.tsx` | S | Single shared component. Update all imports. |
| 2.17 | **Write comprehensive protocol tests** | `src/services/testing/__tests__/` | L | 30+ test cases: normal threshold determination, edge cases (no response at max, response at min), masking decisions, frequency sequencing. |
| 2.18 | **Write testing UI component tests** | `src/components/testing/__tests__/` | L | Render tests, keyboard interaction, state transitions. |

### Success Criteria
- [ ] Complete a full audiometry test on all 6 existing patients
- [ ] Accuracy calculation matches manual computation within 1%
- [ ] Hughson-Westlake protocol logic has 95% test coverage
- [ ] TestingInterface decomposed into <=5 components, each <300 lines
- [ ] Audiogram rerenders only when data changes (verified via React DevTools profiler)
- [ ] Masking rules correctly identify when masking is needed

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Protocol rewrite breaks existing UX | Keep old TestingInterface as fallback until new one verified |
| Decomposition creates prop drilling | Use custom hooks for shared state, keep component tree shallow |
| Masking logic complex to verify | Validate against published clinical examples in ASHA guidelines |

---

## Phase 3: Patient System & Progress Tracking

**Goal**: Expand the patient library, fix audiometric validity, implement deterministic patient behavior, and add persistent progress tracking. After this phase, the app has 20+ valid patients and tracks student improvement over time.

**Dependencies**: Phase 2 (testing flow must be working).

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 3.1 | **Create PatientRepository** | `src/services/patient/PatientRepository.ts` | L | Centralized patient data. 20+ patients defined as static data. Filtering by difficulty, type, tags. |
| 3.2 | **Create PatientGenerator** | `src/services/patient/PatientGenerator.ts` | L | Generate patients with constraints: bone <= air, realistic configurations, seeded randomness. Loss types: flat SNHL, sloping SNHL, rising SNHL, cookie-bite, noise-notch, conductive, mixed, asymmetric. |
| 3.3 | **Add patient metadata** | `src/data/patients.ts` | L | Case histories, chief complaints, otoscopic findings, age, gender for all 20+ patients. |
| 3.4 | **Create PatientDetail component** | `src/components/patient/PatientDetail.tsx` | M | Case history display, pre-test information review. |
| 3.5 | **Enhance PatientCard** | `src/components/patient/PatientCard.tsx` | S | Add case preview, difficulty badge, hearing loss type indicator. Remove hardcoded color mappings. |
| 3.6 | **Create PatientGrid** | `src/components/patient/PatientGrid.tsx` | M | Filterable grid with search, difficulty filter, type filter. Extracted from PatientsPage. |
| 3.7 | **Create StorageAdapter** | `src/services/progress/StorageAdapter.ts` | M | localStorage wrapper with schema versioning, migration support. JSON serialization with date handling. |
| 3.8 | **Create ProgressTracker** | `src/services/progress/ProgressTracker.ts` | L | Save session results, compute statistics, track improvement over time. |
| 3.9 | **Create Progress page** | `src/pages/ProgressPage.tsx` | L | Dashboard: overall accuracy trend (line chart), sessions completed, weakest areas, session history table. |
| 3.10 | **Create useProgress hook** | `src/hooks/useProgress.ts` | M | Bridge ProgressTracker to React. Auto-save on session complete. |
| 3.11 | **Fix PDF export** — fix M15 | `src/components/shared/PDFExporter.tsx` | M | Error handling with user feedback. Loading state. Proper page layout. |
| 3.12 | **Write patient generation tests** | `src/services/patient/__tests__/` | L | Validity assertions: bone <= air, realistic ranges, all required frequencies present. |
| 3.13 | **Write progress tracking tests** | `src/services/progress/__tests__/` | M | Save/load cycle, schema migration, statistics calculation. |

### Success Criteria
- [ ] 20+ patients available, all with valid audiograms (automated test verifies)
- [ ] Same patient produces consistent thresholds across sessions (seeded random)
- [ ] Progress page shows accuracy trend after completing 3+ sessions
- [ ] Session results persist across page reload
- [ ] PDF export produces readable report with no silent failures

---

## Phase 4: Real Ear Measurement Overhaul

**Goal**: Fix all REM-related bugs and implement patient-specific prescription targets. After this phase, the REM module is a realistic hearing aid verification trainer.

**Dependencies**: Phase 1 (audio engine). Can run in parallel with Phase 3.

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 4.1 | **Create REMSession service** | `src/services/rem/REMSession.ts` | M | Singleton session manager using shared AudioEngine. Proper cleanup. |
| 4.2 | **Create PrescriptionFormula** | `src/services/rem/PrescriptionFormula.ts` | XL | NAL-NL2 implementation: inputs = audiogram, age, gender, experience, vent type. Outputs = target gain per frequency per input level. DSL v5.0 for pediatric option. |
| 4.3 | **Fix generateTargets to use patient audiogram** — fix H4 | `src/services/rem/REMSimulator.ts` | M | Wire patient audiogram into PrescriptionFormula. Remove hardcoded lookup tables. |
| 4.4 | **Fix REM audio leaks** — fix C1 (REM-specific) | `src/services/rem/REMSimulator.ts` | M | Track panNode, buffer source. Store in service. Stop/disconnect in `stopTestSignal`. |
| 4.5 | **Fix URL blob revocation** — fix H13 | `src/pages/TroubleshootingGuidePage.tsx` | S | Revoke after download completes (use `setTimeout` or download event). |
| 4.6 | **Decompose RealEarMeasurementPage** — fix M2 | Split into: `rem/REMWorkspace.tsx`, `rem/REMChart.tsx` (keep), `rem/ProbePositioner.tsx`, `rem/GainAdjuster.tsx`, `rem/TargetOverlay.tsx`, `rem/MeasurementStepper.tsx` | XL | 1,828 lines → 6 components, each <300 lines. |
| 4.7 | **Fix eslint-disable stale closure** — fix H11 | `src/pages/RealEarMeasurementPage.tsx` | S | Fix dependency array for `initializeAdjustableREAR`. Remove eslint-disable comment. |
| 4.8 | **Fix session state race condition** — fix M6 | `src/pages/RealEarMeasurementPage.tsx` | S | Use functional form of `setSession` in all handlers. |
| 4.9 | **Fix REMChart data alignment** — fix M14 | `src/components/rem/REMChart.tsx` | M | Map data by frequency key, not array index. Handle missing frequencies. |
| 4.10 | **Write REM service tests** | `src/services/rem/__tests__/` | L | Prescription formula accuracy, measurement simulation, accuracy scoring. |

### Success Criteria
- [ ] REM targets change based on patient audiogram (not hardcoded)
- [ ] NAL-NL2 targets within ±2 dB of published reference values
- [ ] No audio leaks during REM workflow (verified in DevTools)
- [ ] REM page decomposed into <=6 components

---

## Phase 5: Educational Content & UX Polish

**Goal**: Fix all broken educational content, decompose god components, improve accessibility, and polish the UI. After this phase, every page in the app works correctly and meets accessibility standards.

**Dependencies**: Phase 1. Can run in parallel with Phases 3-4.

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 5.1 | **Fix placeholder images** — fix H5 | `src/pages/EarAnatomyPage.tsx`, `src/pages/OtoscopyPage.tsx` | S | Replace `placeholder.com` URLs with actual images from `public/assets/` or remove broken CardMedia. |
| 5.2 | **Fix broken troubleshooting guide links** — fix H12 | `src/pages/TroubleshootingGuidePage.tsx` | M | Either generate the HTML files at the expected paths or change the download to generate on-the-fly (inline the content). |
| 5.3 | **Fix quiz state reset** — fix H17 | `src/pages/EarAnatomyPage.tsx` | S | Add reset button. Clear quiz state without requiring page refresh. |
| 5.4 | **Fix glossary search display** — fix M11 | `src/pages/EarAnatomyPage.tsx` | S | Store original case, search on lowercase copy. |
| 5.5 | **Decompose EarAnatomyPage** — fix M2 | Split 4,880-line file into: `education/AnatomyOverview.tsx`, `education/AnatomyQuiz.tsx`, `education/AnatomyGlossary.tsx`, `education/AnatomyDetail.tsx`, `education/AnatomyViewer.tsx` | XL | Largest refactor. Extract each accordion/section into its own component. Move step content arrays to data files. |
| 5.6 | **Fix EarModel3D error handling** — fix H7 | `src/components/EarModel3D.tsx` | M | Use React Error Boundary instead of try/catch in useEffect. Handle Suspense-based errors from `useGLTF`. |
| 5.7 | **Fix EarModel3D infinite effect** — fix M5 | `src/components/EarModel3D.tsx` | S | Don't depend on `gltfResult` rest object. Depend on `model` only. |
| 5.8 | **Fix ContourTestForm re-render** — fix H8 | `src/components/ContourTestForm.tsx` | S | Remove `testResults.ratings` from useEffect dependency. Use functional update or stable reference. |
| 5.9 | **Fix FollowUpPage decorative sliders** — fix H9 | `src/pages/FollowUpPage.tsx` | M | Either wire sliders to state and use values, or remove them. |
| 5.10 | **Fix ContourTestService rating constraint** — fix M9 | `src/services/ContourTestService.ts` | S | Clamp `rating` to [0, 7] in `analyzeResults` and `findMCL`/`findUCL`. |
| 5.11 | **Add missing accessibility labels** — fix M12 | Multiple files | M | Add `aria-label` to glossary search. Add `aria-controls`/`id` to accordions. Add `role` attributes where needed. |
| 5.12 | **Audio cleanup on unmount** — fix M10 | `src/components/Tutorial.tsx`, `src/components/TestingInterface.tsx` | M | Add `useEffect` cleanup that calls `audioEngine.stopAll()` on unmount and patient change. |
| 5.13 | **Remove Google Fonts render-blocking** — fix L14 | `public/index.html` | S | Add `preconnect` hints. Use `font-display: swap`. Consider system font stack instead. |
| 5.14 | **Fix theme_color mismatch** — fix L13 | `public/manifest.json`, `public/index.html` | S | Align theme colors. |
| 5.15 | **Fix dead code and unused imports** — fix L2, L3, L5, L6, L7, L8, L11 | Multiple files | M | Remove dead code: unused `sampleRate`, disconnected `analyzer`, dead `determineStepSize`, duplicate imports, unused refs, unused `isMobile`, dead settings state. |
| 5.16 | **Replace array-index React keys** — fix L16 | `src/components/ContourTestResults.tsx` | S | Use `recommendation` string or stable ID as key. |
| 5.17 | **Move step content arrays to data files** | `src/data/tutorialContent.ts`, `src/data/anatomyContent.ts`, `src/data/otoscopyContent.ts` | L | Extract multi-thousand-line JSX step arrays from page components into separate data/content files. Memoize with `useMemo`. Fixes M3. |
| 5.18 | **Create shared LessonStepper component** | `src/components/education/LessonStepper.tsx` | M | Reusable stepper used by Tutorial, Contour, FollowUp, Otoscopy pages. |
| 5.19 | **Implement keyboard shortcut overlay** | `src/components/shared/KeyboardShortcuts.tsx` | M | Press `?` to show shortcuts. Context-sensitive (different in testing vs browsing). |
| 5.20 | **Write accessibility tests** | `src/test/accessibility.test.tsx` | M | axe-core checks on main pages. Keyboard navigation tests. |

### Success Criteria
- [ ] No broken images on any page
- [ ] No `placeholder.com` references in codebase
- [ ] EarAnatomyPage split into 5+ components, each <500 lines
- [ ] Lighthouse accessibility score >= 90
- [ ] All form inputs have labels
- [ ] Quiz can be reset without page refresh
- [ ] No dead code warnings from ESLint

---

## Phase 6: Performance & Build Optimization

**Goal**: Optimize bundle size, rendering performance, and add PWA support. After this phase, the app loads fast and works offline.

**Dependencies**: Phases 1-5 (all code should be stable before optimizing).

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 6.1 | **Code splitting per route** | `src/App.tsx` (router), `vite.config.ts` | M | `React.lazy()` for all page components. Suspense fallback with loading spinner. |
| 6.2 | **Lazy load 3D model viewer** | `src/components/education/AnatomyViewer.tsx` | S | Dynamic import for `@react-three/fiber`, `@react-three/drei`, `three`. Only loaded on Anatomy page. |
| 6.3 | **Lazy load PDF export** | `src/components/shared/PDFExporter.tsx` | S | Dynamic import for `jspdf`, `html2canvas`. Load on export button click. |
| 6.4 | **Lazy load charting libraries** | Chart.js registration | M | Register Chart.js components only in the modules that need them. Tree-shake unused chart types. |
| 6.5 | **Add PWA support** | `vite.config.ts`, `public/manifest.json` | M | Install `vite-plugin-pwa`. Configure service worker for asset precaching. Offline indicator. |
| 6.6 | **Optimize 3D model asset** | `public/assets/Main_ear_default.glb` | M | Compress with `gltf-pipeline` or `draco`. Target <2MB. Add loading progress indicator. |
| 6.7 | **Add image optimization** | `public/assets/*.jpg`, `*.webp` | S | Ensure all images are WebP. Add width/height attributes to prevent layout shift. |
| 6.8 | **Bundle analysis** | `vite.config.ts` | S | Install `rollup-plugin-visualizer`. Review bundle composition. Target <500KB gzipped. |
| 6.9 | **Add Lighthouse CI** | `.github/workflows/lighthouse.yml` | M | Run Lighthouse on every PR. Fail if performance < 80, accessibility < 90. |

### Success Criteria
- [ ] Initial page load (Home) < 200KB transferred (gzipped)
- [ ] 3D model page doesn't impact bundle of other pages
- [ ] App works offline after first visit (PWA service worker)
- [ ] Lighthouse performance score >= 80

---

## Phase 7: Advanced Features & Polish

**Goal**: Add features that differentiate this as a world-class training tool — advanced masking practice, custom patient builder, presentation mode, and comprehensive E2E testing. These are stretch goals that complete the product vision.

**Dependencies**: Phases 1-5 (core must be solid).

### Tasks

| # | Task | Files | Complexity | Notes |
|---|------|-------|------------|-------|
| 7.1 | **Masking practice mode** | `src/pages/MaskingPracticePage.tsx`, `src/services/testing/MaskingRules.ts` | XL | Dedicated mode for practicing masking decisions. Presents scenarios, student decides: mask or not? What level? System evaluates against clinical rules. |
| 7.2 | **Custom patient builder** | `src/pages/PatientBuilderPage.tsx` | L | Educator can set thresholds per frequency/ear/type. Validation ensures audiometric validity. Save to localStorage. |
| 7.3 | **Shareable case links** | URL parameter encoding | M | Encode patient config in URL hash. Share link generates same patient for all users. |
| 7.4 | **1000 Hz retest logic** | `src/services/testing/HughsonWestlake.ts` | M | After completing all frequencies for an ear, retest 1000 Hz. If >5 dB difference, prompt for full retest. |
| 7.5 | **Speech audiometry module** | `src/pages/SpeechAudiometryPage.tsx`, `src/services/speech/` | XL | SRT (Speech Recognition Threshold) testing. Word recognition scoring. Uses recorded speech stimuli. |
| 7.6 | **Tympanometry simulation** | `src/pages/TympanometryPage.tsx` | L | Type A, As, Ad, B, C tympanograms. Interpret results in context of audiogram. |
| 7.7 | **Presentation mode** | `src/hooks/usePresentationMode.ts` | M | Full-screen mode for lectures. Larger fonts, simplified controls, instructor notes hidden. Keyboard remote friendly. |
| 7.8 | **Settings page** | `src/pages/SettingsPage.tsx` | M | Centralized settings: theme, font size, test config, audio calibration, keyboard shortcuts. |
| 7.9 | **GitHub Actions deployment** | `.github/workflows/deploy.yml` | M | Auto-deploy to GitHub Pages on merge to main. Includes build, test, Lighthouse checks. |
| 7.10 | **E2E test suite** | `e2e/` directory with Playwright tests | L | 5 critical paths: full audiometry test, REM workflow, tutorial completion, patient selection + testing, progress tracking. |
| 7.11 | **Comprehensive component tests** | `src/**/__tests__/` | XL | Reach 60% overall coverage target. All pages render without errors. All interactive flows tested. |
| 7.12 | **XSS prevention audit** | `src/pages/TroubleshootingGuidePage.tsx` | M | Replace HTML template literal interpolation with React components or sanitize with DOMPurify. Fix security concern from code review. |

### Success Criteria
- [ ] Masking practice mode with 10+ scenarios
- [ ] Custom patients can be created, saved, and shared
- [ ] E2E tests cover the 5 critical user flows
- [ ] Overall test coverage >= 60%
- [ ] Zero XSS vulnerabilities

---

## Phase Summary

| Phase | Name | Tasks | Depends On | Key Deliverable |
|-------|------|-------|------------|-----------------|
| 1 | Foundation | 25 | — | Vite build, critical fixes, CI, first tests |
| 2 | Core Testing | 18 | Phase 1 | Working Hughson-Westlake with accurate feedback |
| 3 | Patients & Progress | 13 | Phase 2 | 20+ patients, progress tracking |
| 4 | REM Overhaul | 10 | Phase 1 | Patient-specific REM targets, no audio leaks |
| 5 | Education & UX | 20 | Phase 1 | All content working, accessible, decomposed |
| 6 | Performance | 9 | Phases 1-5 | Fast loading, PWA, optimized bundle |
| 7 | Advanced Features | 12 | Phases 1-5 | Masking practice, custom patients, E2E tests |

**Parallelism opportunity**: After Phase 1 completes, Phases 2, 4, and 5 can be worked on simultaneously by different developers. Phase 3 requires Phase 2. Phase 6 should wait for all content to stabilize.

**Recommended execution order for a single developer**: 1 → 2 → 3 → 5 → 4 → 6 → 7
