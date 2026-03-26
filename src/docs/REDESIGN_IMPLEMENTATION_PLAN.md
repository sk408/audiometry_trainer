# Redesign Implementation Plan

**Version:** 1.0
**Date:** 2026-03-26
**Companion to:** `UX_REDESIGN_SPEC.md`

---

## Table of Contents

- [Phase A: Navigation Restructure](#phase-a-navigation-restructure)
- [Phase B: Referrals Section](#phase-b-referrals-section)
- [Phase C: Earmolds Section](#phase-c-earmolds-section)
- [Phase D: Follow-Up & Complaint-Based Adjustments Redesign](#phase-d-follow-up--complaint-based-adjustments-redesign)
- [Phase E: WRS Update & Speech Section](#phase-e-wrs-update--speech-section)
- [Phase F: Homepage Redesign](#phase-f-homepage-redesign)

---

## Phase A: Navigation Restructure

**Complexity:** M
**Dependencies:** None (first phase)
**Success Criteria:**
- Navigation shows 5 grouped top-level items instead of 14 flat items
- Desktop: dropdown menus with subsections
- Mobile: collapsible grouped drawer
- Breadcrumbs on all subsection pages
- Old routes redirect to new routes (no broken bookmarks)
- Footer reorganized into grouped columns

### Files to Modify

#### 1. `src/App.tsx` (Major Changes)

**Current state:** Lines 223-238 define a flat `menuItems` array of 14 items. Lines 325-376 render a flat drawer list. Lines 398-411 render all 14 items as AppBar buttons. Lines 467-481 define flat routes.

**Changes required:**

a) **Replace `menuItems` with grouped navigation structure:**

```typescript
interface NavGroup {
  label: string;
  icon: React.ReactNode;
  basePath: string;
  children: { label: string; path: string; icon: React.ReactNode }[];
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

type NavEntry = NavGroup | NavItem;

const navigation: NavEntry[] = [
  { label: 'Home', icon: <HomeIcon />, path: '/' },
  {
    label: 'Assessment', icon: <HearingIcon />, basePath: '/assessment',
    children: [
      { label: 'Pure Tone Audiometry', path: '/assessment/pure-tone', icon: <HearingOutlined /> },
      { label: 'Masking Practice', path: '/assessment/masking', icon: <Shield /> },
      { label: 'Speech Audiometry', path: '/assessment/speech', icon: <RecordVoiceOver /> },
      { label: 'Otoscopy', path: '/assessment/otoscopy', icon: <ZoomIn /> },
      { label: 'Special Tests', path: '/assessment/special-tests', icon: <VolumeUp /> },
      { label: 'Referrals', path: '/assessment/referrals', icon: <Warning /> },
    ]
  },
  {
    label: 'Hearing Aids', icon: <HearingDisabled />, basePath: '/hearing-aids',
    children: [
      { label: 'Follow-Up Appointments', path: '/hearing-aids/follow-up', icon: <Assignment /> },
      { label: 'Complaint-Based Adjustments', path: '/hearing-aids/adjustments', icon: <Tune /> },
      { label: 'Troubleshooting & Handouts', path: '/hearing-aids/troubleshooting', icon: <Help /> },
      { label: 'Real Ear Measurement', path: '/hearing-aids/rem', icon: <Biotech /> },
      { label: 'Earmolds & Amplification', path: '/hearing-aids/earmolds', icon: <Hearing /> },
    ]
  },
  {
    label: 'Reference', icon: <MenuBook />, basePath: '/reference',
    children: [
      { label: 'Ear Anatomy', path: '/reference/anatomy', icon: <ViewInAr /> },
    ]
  },
  {
    label: 'Practice', icon: <School />, basePath: '/practice',
    children: [
      { label: 'Virtual Patients', path: '/practice/patients', icon: <Person /> },
      { label: 'Quizzes & Scenarios', path: '/practice/quizzes', icon: <Quiz /> },
    ]
  },
];
```

b) **Replace AppBar button rendering (lines 398-411) with dropdown menus:**

- For each `NavGroup`, render a `Button` that opens a `Menu` or `Popover`
- Menu items show each child with icon and label
- For `NavItem` (Home), render a direct `Link` button
- Add `Warning` icon import for Referrals

c) **Replace Drawer content (lines 325-376) with collapsible groups:**

- Use MUI `List` with `Collapse` for each group
- Group header shows label + expand/collapse icon
- Children render as indented `ListItem` components
- Add "My Progress" and "Settings" at the bottom, separated by `Divider`

d) **Update Routes (lines 467-481):**

```tsx
<Routes>
  {/* Home */}
  <Route path="/" element={<HomePage />} />

  {/* Assessment */}
  <Route path="/assessment/pure-tone" element={<TutorialPage />} />
  <Route path="/assessment/masking" element={<MaskingPracticePage />} />
  <Route path="/assessment/speech" element={<SpeechAudiometryPage />} />
  <Route path="/assessment/otoscopy" element={<OtoscopyPage />} />
  <Route path="/assessment/special-tests" element={<ContourTestPage />} />
  <Route path="/assessment/referrals" element={<ReferralsPage />} />

  {/* Hearing Aids */}
  <Route path="/hearing-aids/follow-up" element={<FollowUpPage />} />
  <Route path="/hearing-aids/adjustments" element={<ComplaintAdjustmentsPage />} />
  <Route path="/hearing-aids/troubleshooting" element={<TroubleshootingGuidePage />} />
  <Route path="/hearing-aids/rem" element={<RealEarMeasurementPage />} />
  <Route path="/hearing-aids/earmolds" element={<EarmoldsPage />} />

  {/* Reference */}
  <Route path="/reference/anatomy" element={<EarAnatomyPage />} />

  {/* Practice */}
  <Route path="/practice/patients" element={<PatientsPage />} />
  <Route path="/practice/quizzes" element={<QuizzesPage />} />

  {/* Utility */}
  <Route path="/progress" element={<ProgressPage />} />
  <Route path="/settings" element={<SettingsPage />} />

  {/* Redirects from old routes */}
  <Route path="/tutorial" element={<Navigate to="/assessment/pure-tone" replace />} />
  <Route path="/masking-practice" element={<Navigate to="/assessment/masking" replace />} />
  <Route path="/speech-audiometry" element={<Navigate to="/assessment/speech" replace />} />
  <Route path="/otoscopy" element={<Navigate to="/assessment/otoscopy" replace />} />
  <Route path="/contour-test" element={<Navigate to="/assessment/special-tests" replace />} />
  <Route path="/ear-anatomy" element={<Navigate to="/reference/anatomy" replace />} />
  <Route path="/patients" element={<Navigate to="/practice/patients" replace />} />
  <Route path="/custom-patients" element={<Navigate to="/practice/patients" replace />} />
  <Route path="/followup" element={<Navigate to="/hearing-aids/follow-up" replace />} />
  <Route path="/troubleshooting" element={<Navigate to="/hearing-aids/troubleshooting" replace />} />
  <Route path="/real-ear-measurement" element={<Navigate to="/hearing-aids/rem" replace />} />
</Routes>
```

e) **Update Avatar dropdown menu (lines 418-447):**

- Add "Settings" as a menu item alongside "My Progress"
- Remove "Help & Resources" (or keep as tertiary)

f) **Update Footer (lines 486-534):**

- Replace flat link list with grouped columns (5 columns matching nav groups)
- Keep copyright

#### 2. New Component: `src/components/shared/Breadcrumbs.tsx`

**New file.** Renders breadcrumb trail based on current route.

```typescript
// Maps route segments to display labels
const ROUTE_LABELS: Record<string, string> = {
  'assessment': 'Assessment',
  'pure-tone': 'Pure Tone Audiometry',
  'masking': 'Masking Practice',
  'speech': 'Speech Audiometry',
  'otoscopy': 'Otoscopy',
  'special-tests': 'Special Tests',
  'referrals': 'Referrals',
  'hearing-aids': 'Hearing Aids',
  'follow-up': 'Follow-Up Appointments',
  'adjustments': 'Complaint-Based Adjustments',
  'troubleshooting': 'Troubleshooting & Handouts',
  'rem': 'Real Ear Measurement',
  'earmolds': 'Earmolds & Amplification',
  'reference': 'Reference',
  'anatomy': 'Ear Anatomy',
  'practice': 'Practice',
  'patients': 'Virtual Patients',
  'quizzes': 'Quizzes & Scenarios',
};
```

Uses MUI `Breadcrumbs` component. Rendered below AppBar in `App.tsx`, hidden on the homepage.

#### 3. New Component: `src/components/shared/NavDropdown.tsx`

**New file.** Desktop dropdown menu for navigation groups.

- Receives a `NavGroup` prop
- Renders a `Button` that opens a `Menu`
- Menu items are `MenuItem` components with icons and labels, each a `Link` to the child path
- Active state: button appears highlighted when any child route is active

#### 4. New Component: `src/components/shared/NavDrawer.tsx`

**New file.** Refactored mobile drawer with collapsible groups.

- Extracts drawer logic from `App.tsx` into a dedicated component
- Each `NavGroup` renders as a collapsible section (MUI `List` + `Collapse`)
- Footer items (Progress, Settings) render below a divider

#### 5. `src/pages/PatientsPage.tsx` (Minor Change)

**Change:** Add a tab for "My Custom Patients" that renders the content currently in `CustomPatientPage.tsx`.

- Import and embed `CustomPatientPage` content as a tab
- Or: Add a "Create Custom" button that opens a dialog/panel with the custom patient editor

#### 6. Update Internal Links

All pages that use `RouterLink` or `Link` to navigate to other pages need updated paths:

- `src/pages/HomePage.tsx` — all card links (lines 82, 93, 123, 149, 176, 199, 225, 249, 294, 299, etc.)
- `src/pages/FollowUpPage.tsx` — any cross-links
- `src/pages/SpeechAudiometryPage.tsx` — any cross-links
- Footer links in `App.tsx`

### Files to Create

| File | Purpose | Complexity |
|------|---------|-----------|
| `src/components/shared/Breadcrumbs.tsx` | Route-aware breadcrumb component | S |
| `src/components/shared/NavDropdown.tsx` | Desktop dropdown menu for nav groups | S |
| `src/components/shared/NavDrawer.tsx` | Refactored grouped mobile drawer | S |

### Files to Delete

| File | Reason |
|------|--------|
| `src/pages/CustomPatientPage.tsx` | Content merged into PatientsPage (can defer to Phase D if preferred) |

### Content Requirements

- **SME needed:** No (purely structural/navigation changes)
- **Content to write:** Breadcrumb labels only (provided above)

---

## Phase B: Referrals Section

**Complexity:** M
**Dependencies:** Phase A (for routing) -- but can be built independently with a temporary route
**Success Criteria:**
- Complete referral criteria table with specific dB/frequency thresholds
- Red flag urgency matrix (red/yellow/green) with actionable next steps
- Acoustic neuroma/vestibular schwannoma education with audiometric examples
- Rollover explanation with clinical examples
- Patient communication scripts for different referral scenarios
- Cross-links from Speech Audiometry page (WRS red flags)

### Files to Create

#### 1. `src/pages/ReferralsPage.tsx` (NEW -- Primary deliverable)

**Structure:** 4-tab page using MUI `Tabs` pattern (same as `SpeechAudiometryPage.tsx`).

**Tab 1: "When to Refer"**
- Referral Criteria Matrix table (11 rows from spec Section 6.3)
- "When NOT to Refer" section
- Each table row: Finding | Threshold | Urgency | Referral To | Reason

**Tab 2: "Red Flags"**
- Three color-coded sections using MUI `Alert` or colored `Paper`:
  - `severity="error"` (Red -- Urgent)
  - `severity="warning"` (Yellow -- Priority)
  - `severity="success"` (Green -- Routine)
- Each section contains a table with Sign | Why | Action columns

**Tab 3: "Acoustic Neuroma / Vestibular Schwannoma"**
- Educational prose sections:
  - What It Is (anatomy, growth rate)
  - Prevalence (statistics)
  - Audiometric Profile (detailed list of typical findings)
  - Rollover explanation with formula (RI = (PBmax - PBmin) / PBmax)
  - Clinical Examples (3 worked examples with audiometric data)
  - Diagnostic Pathway (flowchart-style description)

**Tab 4: "Communicating Referrals"**
- Communication principles (5 numbered items)
- Example scripts (3 scenarios in `Paper` or `Alert` blocks)
- Referral letter contents checklist

**Estimated lines of code:** ~500-700 (mostly JSX with clinical content)

#### 2. `src/data/referralData.ts` (NEW -- Data file)

**Purpose:** Centralize referral criteria, red flag data, and clinical examples as typed constants.

```typescript
export interface ReferralCriterion {
  finding: string;
  threshold: string;
  urgency: 'urgent' | 'priority' | 'routine';
  referTo: string;
  reason: string;
}

export interface RedFlag {
  sign: string;
  why: string;
  action: string;
}

export interface ClinicalExample {
  title: string;
  rightEar: { pta: number; wrs: number; wrsLevel: number };
  leftEar: { pta: number; wrs: number; wrsLevel: number };
  assessment: string;
  shouldRefer: boolean;
}

export const REFERRAL_CRITERIA: ReferralCriterion[] = [ /* ... */ ];
export const RED_FLAGS: { urgent: RedFlag[]; priority: RedFlag[]; routine: RedFlag[] } = { /* ... */ };
export const CLINICAL_EXAMPLES: ClinicalExample[] = [ /* ... */ ];
export const COMMUNICATION_SCRIPTS: { scenario: string; script: string }[] = [ /* ... */ ];
```

### Files to Modify

#### 1. `src/App.tsx`

- Add lazy import for `ReferralsPage`
- Add route: `<Route path="/assessment/referrals" element={<ReferralsPage />} />`

#### 2. `src/pages/SpeechAudiometryPage.tsx`

- Add cross-link from WRS section to Referrals page
- In the WRS interpretation guide (Tab 4, lines 310-365), add an `Alert` below the WRS ranges table:
  ```
  "When WRS is disproportionately poor relative to PTA, consider retrocochlear pathology.
   See the Medical Referral Guide for detailed criteria."
  [Link to /assessment/referrals]
  ```

### Content Requirements

| Content | Source | SME Review Needed? |
|---------|--------|--------------------|
| Referral criteria thresholds (dB values, frequency counts) | Clinical guidelines (AAA, ASHA) | **YES -- critical for accuracy** |
| Acoustic neuroma prevalence statistics | Published literature | YES -- verify currency |
| Rollover index formula and criteria | Jerger & Jerger (1971); current references | YES |
| Patient communication scripts | Best practice / clinical consensus | YES -- tone review |
| Red flag urgency classifications | Clinical guidelines | **YES -- patient safety** |
| Clinical examples (audiometric data) | Can be generated; must be realistic | YES -- plausibility check |

**Note:** All clinical content in the Referrals section should be reviewed by a subject matter expert (audiologist or otologist) before publication. Incorrect referral criteria could result in missed diagnoses (if too lax) or unnecessary patient anxiety and healthcare costs (if too aggressive).

---

## Phase C: Earmolds Section

**Complexity:** L
**Dependencies:** Phase A (for routing)
**Success Criteria:**
- Complete earmold type/style comparison table with selection guidance
- Material comparison with clinical decision guide
- Venting rules with acoustic effects (dB reduction by vent size)
- Horn effect and damper documentation
- Impression procedure with complication prevention
- Pediatric and geriatric special considerations
- Remake criteria table

### Files to Create

#### 1. `src/pages/EarmoldsPage.tsx` (NEW -- Primary deliverable)

**Structure:** 5-tab page using MUI `Tabs`.

**Tab 1: "Types & Styles"**
- Earmold styles table (9 rows from spec Section 7.3)
- Selection decision flow as nested lists or flowchart description
- Each style: Description | Best For | HL Range | Occlusion Level | Retention Level

**Tab 2: "Materials"**
- Materials comparison table (4 rows from spec Section 7.4)
- Material selection guide (prose with bullet points)
- Clinical tips for material switching decisions

**Tab 3: "Acoustic Modifications"**
- **Venting subsection:**
  - Vent types table (8 rows from spec Section 7.5)
  - Key clinical principle callout
  - IROS explanation
- **Horn Effect subsection:**
  - Standard vs. stepped vs. continuous bore
  - When to use
- **Acoustic Dampers subsection:**
  - Three damper types with smoothing characteristics
  - When to use

**Tab 4: "Impressions"**
- When to take impressions (bulleted list)
- 9-step procedure (ordered list with detailed steps)
- "What Can Go Wrong" table (6 rows with Problem | Cause | Prevention)
- Contraindications alert

**Tab 5: "Special Populations"**
- **Pediatric Considerations** card/section
  - Remake frequency, material, style, safety, color
- **Geriatric Considerations** card/section
  - Dexterity, vision, skin changes, cerumen
- **Remake Criteria** table (8 indicators with reasons)

**Estimated lines of code:** ~600-900

#### 2. `src/data/earmoldData.ts` (NEW -- Data file)

```typescript
export interface EarmoldStyle {
  name: string;
  description: string;
  bestFor: string;
  hearingLossRange: string;
  occlusionLevel: 'minimal' | 'low' | 'moderate' | 'high';
  retentionLevel: 'fair' | 'good' | 'very good' | 'excellent';
}

export interface EarmoldMaterial {
  name: string;
  properties: string;
  advantages: string[];
  disadvantages: string[];
  bestFor: string;
}

export interface VentType {
  name: string;
  diameter: string;
  lowFreqEffect: string;
  useWhen: string;
}

export interface ImpressionStep {
  step: number;
  title: string;
  details: string;
}

export interface ImpressionComplication {
  problem: string;
  cause: string;
  prevention: string;
}

export const EARMOLD_STYLES: EarmoldStyle[] = [ /* ... */ ];
export const MATERIALS: EarmoldMaterial[] = [ /* ... */ ];
export const VENT_TYPES: VentType[] = [ /* ... */ ];
export const IMPRESSION_STEPS: ImpressionStep[] = [ /* ... */ ];
export const IMPRESSION_COMPLICATIONS: ImpressionComplication[] = [ /* ... */ ];
```

### Files to Modify

#### 1. `src/App.tsx`

- Add lazy import for `EarmoldsPage`
- Add route: `<Route path="/hearing-aids/earmolds" element={<EarmoldsPage />} />`

### Content Requirements

| Content | Source | SME Review Needed? |
|---------|--------|--------------------|
| Earmold style descriptions and selection criteria | Textbook reference (e.g., Dillon, Valente) | YES |
| Material properties and comparison | Manufacturer data + clinical experience | YES |
| Vent size to acoustic effect (dB values) | Published data (e.g., Killion, Lybarger) | **YES -- dB values must be accurate** |
| Horn effect frequency boost values | Libby (1982), manufacturer data | YES |
| Damper ohm values and effects | Published data | YES |
| Impression procedure | Standard clinical protocol | YES -- verify step sequence |
| Pediatric remake frequency | AAA Pediatric Amplification Guidelines | YES |
| Remake criteria | Clinical consensus | YES |

---

## Phase D: Follow-Up & Complaint-Based Adjustments Redesign

**Complexity:** M
**Dependencies:** Phase A (for routing)
**Success Criteria:**
- Dedicated Complaint-Based Adjustments page accessible in max 2 clicks from nav
- Adjustments page has 4 tabs: By Complaint, By Frequency, By Input Level, Common Patterns
- "By Complaint" tab has 20+ complaint entries with expand-for-detail format
- Follow-Up page converted from interactive wizard to reference/checklist guide
- No duplicated troubleshooting content between Follow-Up and Troubleshooting pages
- All existing clinical content preserved (nothing lost)

### Files to Create

#### 1. `src/pages/ComplaintAdjustmentsPage.tsx` (NEW -- Primary deliverable)

**Structure:** 4-tab page.

**Content source:** Extracted and expanded from `FollowUpPage.tsx` lines 314-571 (Step 4: Adjustments) and lines 573-797 (Step 5: Patient Education troubleshooting accordions).

**Tab 1: "By Complaint"**
- 20+ complaint entries from spec Section 5.2, Tab 1
- Each entry is an `Accordion`:
  - Summary: complaint text + category chip
  - Details: What patient experiences | What to adjust (specific dB and frequency ranges) | Why | Verification | Caution
- Optional: search/filter at top of list

**Tab 2: "By Frequency"**
- Content extracted from `FollowUpPage.tsx` lines 339-371 (Frequency Adjustment Guidelines)
- Reformatted as three cards (Low, Mid, High) with increase/decrease guidance

**Tab 3: "By Input Level"**
- Content extracted from `FollowUpPage.tsx` lines 373-434 (Input-Level Gain Adjustment Guidelines)
- Three cards (Soft, Medium, Loud) with sub-details
- Voice quality sub-guide (robotic, hollow, nasal, sharp, muffled, thin) prominently placed

**Tab 4: "Common Patterns"**
- Content extracted from `FollowUpPage.tsx` lines 419-429 (Common Adjustment Patterns)
- Expanded into pattern cards:
  - New user acclimatization
  - Experienced user upgrade
  - Noise difficulty
  - Own voice issues
  - Each card: Symptoms → Adjustments → Verification → Timeline

**Estimated lines of code:** ~500-700

#### 2. `src/data/complaintAdjustmentData.ts` (NEW -- Data file)

```typescript
export interface ComplaintEntry {
  id: string;
  complaint: string;        // "Everything sounds too loud"
  category: 'loudness' | 'clarity' | 'sound_quality' | 'own_voice' | 'feedback' |
            'environmental' | 'noise' | 'connectivity' | 'music' | 'hardware';
  whatPatientExperiences: string;
  whatToAdjust: string;     // Specific frequency ranges and dB values
  why: string;              // Acoustic/perceptual rationale
  verification: string;     // How to confirm adjustment worked
  caution: string;          // Common mistakes to avoid
}

export const COMPLAINT_ENTRIES: ComplaintEntry[] = [ /* 20+ entries */ ];

export interface AdjustmentPattern {
  name: string;
  description: string;
  symptoms: string[];
  adjustments: string[];
  verification: string;
  timeline: string;
}

export const ADJUSTMENT_PATTERNS: AdjustmentPattern[] = [ /* ... */ ];
```

### Files to Modify

#### 1. `src/pages/FollowUpPage.tsx` (Major Rewrite)

**Current:** 1,080 lines. Interactive 5-step wizard with TextFields, Sliders, Ratings, Checkboxes, and complex state management (lines 59-86).

**Target:** ~400-500 lines. Static reference/checklist guide with expandable sections.

**Changes:**

a) **Remove all interactive state:**
- Remove `useState` for: `satisfactionRating`, `selectedProgram`, `followUpTimeframe`, `features`, `followUpData`, `gainAdjustments`
- Remove `handleInputChange`, `handleNext`, `handleBack`, `handleReset` functions
- Remove the `Stepper` component and sequential step enforcement

b) **Convert to accordion-based reference:**
```tsx
<Accordion defaultExpanded>
  <AccordionSummary>1. Patient Interview</AccordionSummary>
  <AccordionDetails>
    {/* Read-only list of questions to ask and what to listen for */}
  </AccordionDetails>
</Accordion>
<Accordion>
  <AccordionSummary>2. Physical Inspection</AccordionSummary>
  <AccordionDetails>
    {/* Read-only checklist */}
  </AccordionDetails>
</Accordion>
{/* ... etc. */}
```

c) **Replace Step 4 (Adjustments) with cross-link:**
```tsx
<Accordion>
  <AccordionSummary>4. Adjustments</AccordionSummary>
  <AccordionDetails>
    <Alert severity="info">
      For detailed complaint-based adjustment guidance, see the
      <Link to="/hearing-aids/adjustments">Complaint-Based Adjustments Guide</Link>.
    </Alert>
    {/* Brief overview of when to adjust vs. counsel for adaptation */}
  </AccordionDetails>
</Accordion>
```

d) **Remove Step 5 troubleshooting content (7 accordions, lines 644-777):**
- This content moves to `TroubleshootingGuidePage.tsx`
- Replace with a cross-link:
  ```
  "For patient troubleshooting guides and handouts, see the
   Troubleshooting & Handouts page."
  ```

e) **Keep and simplify:**
- Interview question list (as read-only items, not TextFields)
- Physical inspection checklist (as read-only list, not interactive checkboxes)
- Listening check procedure steps
- Patient education cards (Daily Care, Usage Tips, Communication Strategies)
- Follow-up planning intervals (as reference, not RadioGroup)
- Print checklist link

#### 2. `src/pages/TroubleshootingGuidePage.tsx` (Moderate Changes)

**Changes:**

a) **Absorb troubleshooting content from FollowUpPage:**
Add a new section (above or below the existing brand-specific guide generator) with the 7 clinician-facing troubleshooting categories currently in FollowUpPage Step 5:
- Whistling or Feedback
- No Sound
- Sound Quality Issues
- Own Voice Perception Issues
- Loudness/Sound Tolerance Issues
- Hearing in Noisy Situations
- Environmental Sounds Issues

b) **Organize into two sections:**
- "Clinician Reference" -- the 7 categories above (for the student/clinician)
- "Patient Handout Generator" -- the existing brand-specific guide generator (for giving to patients)

c) **Cross-link to Complaint-Based Adjustments:**
Add links from troubleshooting items to the corresponding complaint entries in the Adjustments page.

#### 3. `src/App.tsx`

- Add lazy import for `ComplaintAdjustmentsPage`
- Add route: `<Route path="/hearing-aids/adjustments" element={<ComplaintAdjustmentsPage />} />`

### Content Requirements

| Content | Source | SME Review Needed? |
|---------|--------|--------------------|
| Complaint entries (20+) | Extracted from FollowUpPage + expanded | YES -- verify adjustment recommendations |
| Frequency adjustment dB values | Existing content (already in FollowUpPage) | Already reviewed |
| Input-level gain guidance | Existing content (already in FollowUpPage) | Already reviewed |
| Voice quality sub-guide | Existing content (already in FollowUpPage) | Already reviewed |
| Common adjustment patterns | Expanded from existing 5 patterns | YES -- verify new patterns |
| Verification steps for each complaint | New content | **YES -- SME must provide** |
| Caution notes for each complaint | New content | **YES -- SME must provide** |

---

## Phase E: WRS Update & Speech Section

**Complexity:** S
**Dependencies:** Phase B (Referrals cross-link) -- can be done independently if cross-link is omitted initially
**Success Criteria:**
- WRS presentation level uses 2 kHz threshold + 30 dB (not PTA + 30-40 dB)
- WRS Presentation Level Estimator updated with 2 kHz input
- Quiz question #4 updated with new method
- Overview card text updated
- Clinical examples show comparison of old vs. new method
- Cross-link to Referrals for rollover/retrocochlear signs

### Files to Modify

#### 1. `src/pages/SpeechAudiometryPage.tsx` (Focused Updates)

**Change 1: WRS overview card text (line 153-158)**

Old:
```tsx
<Typography variant="body2" color="text.secondary">
  The percentage of monosyllabic words correctly repeated at a
  comfortable suprathreshold level, typically PTA + 30-40 dB.
  Assesses speech clarity, not just audibility.
</Typography>
```

New:
```tsx
<Typography variant="body2" color="text.secondary">
  The percentage of monosyllabic words correctly repeated at a
  suprathreshold level. Current practice sets presentation level
  at the 2 kHz threshold + 30 dB, ensuring audibility across the
  speech spectrum and enabling proper ear separation through masking.
</Typography>
```

**Change 2: WRS Presentation Level Estimator (lines 117-121, 339-364)**

Replace PTA-based estimator with 2 kHz threshold-based:

```tsx
// Replace ptaInput state
const [twoKHzInput, setTwoKHzInput] = useState('');

// Replace estimatedWRSLevel computation
const estimatedWRSLevel = useMemo(() => {
  const twoKHz = parseFloat(twoKHzInput);
  if (isNaN(twoKHz)) return null;
  const level = Math.min(twoKHz + 30, 100);
  const oldMethodPta = twoKHz; // Simplified; show note that PTA would differ
  return { level, twoKHz, cap: level >= 100 };
}, [twoKHzInput]);
```

Update the estimator UI:
- Label: "2 kHz Threshold (dB HL)" instead of "PTA (dB HL)"
- Output: "Present WRS at approximately X dB HL"
- Add comparison note: "Using the older PTA+30-40 method, this would be approximately Y-Z dB HL"
- Add masking note: "At this presentation level, masking of the non-test ear is [likely/unlikely] needed with [insert/supra-aural] earphones"

**Change 3: Quiz question #4 (line 44-47)**

Replace:
```typescript
{ id: 4, question: 'At what level is WRS typically administered relative to PTA?',
  options: ['At the PTA level', '10-20 dB above PTA', '30-40 dB above PTA', '50-60 dB above PTA'],
  correctIndex: 2,
  explanation: 'WRS is measured at a suprathreshold level, typically PTA + 30-40 dB...' },
```

With:
```typescript
{ id: 4, question: 'Using current clinical practice, how is the WRS presentation level determined?',
  options: [
    'At the PTA level',
    '30-40 dB above PTA',
    'Based on the 2 kHz threshold + 30 dB',
    'Always at 70 dB HL'
  ],
  correctIndex: 2,
  explanation: 'Current practice sets WRS presentation level at the 2 kHz threshold + 30 dB. This ensures adequate audibility across the speech spectrum (particularly for sloping losses where PTA may underestimate high-frequency difficulty) and induces more appropriate masking to better separate the ears. The older PTA + 30-40 dB method may under-present for sloping high-frequency losses.' },
```

**Change 4: Add WRS red flag cross-link**

In the WRS Guide tab (renderWRS function), after the WRS ranges table, add:

```tsx
<Alert severity="warning" sx={{ mt: 2 }}>
  <Typography variant="subtitle2" fontWeight="bold">Clinical Red Flag</Typography>
  <Typography variant="body2">
    When WRS is disproportionately poor relative to the degree of hearing loss
    (e.g., WRS of 50% with a PTA of 35 dB), consider retrocochlear pathology.
    See the <Link to="/assessment/referrals">Medical Referral Guide</Link> for
    detailed referral criteria, rollover testing, and acoustic neuroma education.
  </Typography>
</Alert>
```

**Change 5: Add clinical examples (optional new tab or section)**

Add 3 worked examples comparing old vs. new WRS presentation methods:
- Sloping high-frequency loss (methods diverge significantly)
- Flat moderate loss (methods agree)
- Asymmetric loss with referral cross-link

These can be added as an `Accordion` within the existing WRS Guide tab, or as a new 6th tab "Clinical Examples".

### Content Requirements

| Content | Source | SME Review Needed? |
|---------|--------|--------------------|
| 2 kHz threshold method rationale | Clinical guidelines, recent literature | **YES -- verify this matches the owner's clinical practice** |
| Formula (2 kHz + 30 dB) | Owner's stated method | YES -- confirm exact formula |
| Masking implications text | Clinical masking rules | YES |
| Quiz question wording | Generated; clinically accurate | YES -- verify options and explanation |
| Clinical examples (3) | Generated; must be realistic | YES -- plausibility check |

---

## Phase F: Homepage Redesign

**Complexity:** S
**Dependencies:** Phase A (routes must be finalized); ideally after all other phases for accurate pathway content
**Success Criteria:**
- 4 pathway cards with clear domain labels
- Progress indicators on each pathway card
- Single hero CTA ("Start the Learning Path")
- "Pick up where you left off" section (conditional)
- No redundant card grids
- New student has unambiguous starting point

### Files to Modify

#### 1. `src/pages/HomePage.tsx` (Complete Rewrite)

**Current:** ~499 lines with 3 sections (hero, 6-card grid, 3-card grid, 4-step methodology, footer).

**Target:** ~250-350 lines with 3-4 sections.

**Section 1: Simplified Hero**

```tsx
<Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: { xs: 5, md: 8 }, textAlign: 'center' }}>
  <Container maxWidth="md">
    <HearingOutlined sx={{ fontSize: { xs: 40, md: 60 }, mb: 2 }} />
    <Typography variant="h3" component="h1" fontWeight="bold">
      Audiology Training Suite
    </Typography>
    <Typography variant="h6" sx={{ mt: 2, opacity: 0.9 }}>
      Your clinical skills companion for audiometric assessment and hearing aid management.
    </Typography>
    <Button variant="contained" color="secondary" size="large"
      component={RouterLink} to="/assessment/pure-tone" sx={{ mt: 4 }}>
      Start the Learning Path
    </Button>
  </Container>
</Box>
```

**Section 2: Learning Pathway Cards**

4 cards in a responsive grid:

```tsx
const PATHWAYS = [
  {
    title: 'Foundations',
    description: 'Ear anatomy, otoscopy, and how hearing works',
    icon: <ViewInAr />,
    color: 'secondary',
    modules: [
      { label: 'Ear Anatomy', path: '/reference/anatomy' },
      { label: 'Otoscopy', path: '/assessment/otoscopy' },
    ],
    startPath: '/reference/anatomy',
  },
  {
    title: 'Assessment',
    description: 'Pure tone testing, masking, speech audiometry, and referrals',
    icon: <HearingOutlined />,
    color: 'primary',
    modules: [
      { label: 'Pure Tone Audiometry', path: '/assessment/pure-tone' },
      { label: 'Masking Practice', path: '/assessment/masking' },
      { label: 'Speech Audiometry', path: '/assessment/speech' },
      { label: 'Referrals', path: '/assessment/referrals' },
      { label: 'Special Tests', path: '/assessment/special-tests' },
    ],
    startPath: '/assessment/pure-tone',
  },
  {
    title: 'Hearing Aids',
    description: 'Follow-up, adjustments, troubleshooting, REM, and earmolds',
    icon: <HearingDisabled />,
    color: 'warning',
    modules: [
      { label: 'Follow-Up', path: '/hearing-aids/follow-up' },
      { label: 'Adjustments', path: '/hearing-aids/adjustments' },
      { label: 'Troubleshooting', path: '/hearing-aids/troubleshooting' },
      { label: 'Real Ear Measurement', path: '/hearing-aids/rem' },
      { label: 'Earmolds', path: '/hearing-aids/earmolds' },
    ],
    startPath: '/hearing-aids/follow-up',
  },
  {
    title: 'Clinical Practice',
    description: 'Virtual patients, masking scenarios, and clinical decision quizzes',
    icon: <School />,
    color: 'success',
    modules: [
      { label: 'Virtual Patients', path: '/practice/patients' },
      { label: 'Quizzes & Scenarios', path: '/practice/quizzes' },
    ],
    startPath: '/practice/patients',
  },
];
```

Each card renders:
- Icon + title + description
- Module count (e.g., "5 modules")
- Progress indicator (using `ProgressService`)
- "Start" or "Continue" button based on progress

**Section 3: Pick Up Where You Left Off (Conditional)**

```tsx
{lastVisited && (
  <Container maxWidth="md" sx={{ py: 3 }}>
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">Pick up where you left off</Typography>
        <Typography variant="body1">{lastVisited.label}</Typography>
      </Box>
      <Button component={RouterLink} to={lastVisited.path} variant="outlined">Resume</Button>
    </Paper>
  </Container>
)}
```

Requires tracking last-visited page in `ProgressService` or `localStorage`.

**Section 4: What's New (Optional)**

Simple list of new content additions. Can be hardcoded or driven by a small data array.

**What's removed:**
- 6-card "Explore Audiology Topics" grid (lines 101-258)
- "Clinical Training" section with 4-step methodology (lines 260-354)
- "Quick Access to Learning Resources" 3-card grid (lines 356-435)

#### 2. `src/services/ProgressService.ts` (Minor Enhancement)

**Add:** `setLastVisited(path: string, label: string)` and `getLastVisited()` methods.

- Store in localStorage under a new key (e.g., `audiometryTrainer_lastVisited`)
- Called from each page's `useEffect` on mount

#### 3. `src/hooks/useProgress.ts` (Minor Enhancement)

**Add:** Hook to get pathway progress stats (modules visited out of total for each pathway).

- Uses `ProgressService` data
- Returns: `{ foundations: { visited: 2, total: 3 }, assessment: { visited: 1, total: 5 }, ... }`

### Files to Create

No new files needed (all changes are modifications to existing files).

### Content Requirements

| Content | Source | SME Review Needed? |
|---------|--------|--------------------|
| Pathway names and descriptions | Derived from IA (spec Section 2) | No |
| Module lists per pathway | Derived from IA | No |
| "What's New" entries | Based on phases completed | No |

---

## Cross-Phase Dependencies Diagram

```
Phase A (Navigation)
  |
  +---> Phase B (Referrals)
  |       |
  |       +---> Phase E (WRS Update) -- needs Referral cross-link
  |
  +---> Phase C (Earmolds)
  |
  +---> Phase D (Follow-Up/Adjustments)
  |
  +---> Phase F (Homepage) -- best done last
```

**Parallelizable:** B + C + D can all proceed simultaneously after A.
**E** can parallel with B if the cross-link is added later.
**F** should wait for all content to be in place.

---

## Testing Strategy

### Per-Phase Testing

| Phase | Testing Focus |
|-------|--------------|
| A | All old routes redirect correctly; all pages render at new routes; dropdown menus open/close; drawer groups expand/collapse; breadcrumbs show correct trail; mobile and desktop breakpoints; no console errors |
| B | All 4 tabs render; tables display correctly; clinical examples have correct audiometric math; cross-links to/from Speech Audiometry work; responsive layout |
| C | All 5 tabs render; tables display correctly; impression procedure steps are complete; responsive layout |
| D | Complaint-Based Adjustments page: all 20+ entries render and expand; Follow-Up page: no interactive elements remain, all sections expandable; Troubleshooting page: absorbed content renders; no content lost vs. current |
| E | WRS estimator uses 2 kHz input; quiz question #4 has updated correct answer; cross-link to Referrals works; old PTA method mentioned for comparison |
| F | 4 pathway cards render; progress indicators update; "Pick up where you left off" appears after visiting a page; single hero CTA; no redundant card grids |

### Integration Testing

After all phases:
- Navigate every route from the sitemap
- Verify all cross-links between sections work
- Check that no content was lost (compare against current page content inventory)
- Test responsive behavior at mobile (< 600px), tablet (600-960px), desktop (> 960px) breakpoints
- Test dark mode, high contrast mode, and all font size settings
- Verify old bookmarked routes redirect correctly

---

## Content Audit Checklist (Post-Implementation)

Before launch, verify no clinical content was lost:

- [ ] PTA tutorial (Hughson-Westlake procedure) -- all steps present
- [ ] Masking theory (IA values, OE, AC/BC rules, EML) -- all content present
- [ ] Masking scenarios (20) -- all scenarios functional
- [ ] Speech audiometry (SRT, WRS, PTA cross-checks, quiz) -- updated with new WRS method
- [ ] Ear anatomy (7 steps, 3D model, glossary) -- all present
- [ ] Otoscopy (8 steps, abnormal findings, pneumatic) -- all present
- [ ] Follow-Up interview questions -- preserved as reference
- [ ] Follow-Up physical inspection checklist -- preserved as reference
- [ ] Follow-Up listening check procedure -- preserved as reference
- [ ] Frequency adjustment guidelines -- moved to Adjustments page
- [ ] Input-level gain guidelines -- moved to Adjustments page
- [ ] Voice quality sub-guide (6 entries) -- moved to Adjustments page
- [ ] Common adjustment patterns (5) -- moved to Adjustments page
- [ ] Patient education cards (Daily Care, Usage Tips, Communication) -- preserved in Follow-Up
- [ ] Troubleshooting: Whistling/Feedback -- in Troubleshooting page
- [ ] Troubleshooting: No Sound -- in Troubleshooting page
- [ ] Troubleshooting: Sound Quality -- in Troubleshooting page
- [ ] Troubleshooting: Own Voice -- in Troubleshooting page
- [ ] Troubleshooting: Loudness/Sound Tolerance -- in Troubleshooting page
- [ ] Troubleshooting: Hearing in Noise -- in Troubleshooting page
- [ ] Troubleshooting: Environmental Sounds -- in Troubleshooting page
- [ ] Brand-specific guide generator (Jabra, Rexton, Philips) -- in Troubleshooting page
- [ ] REM 8-step workflow -- all present
- [ ] Contour test procedure -- all present
- [ ] Progress dashboard -- all charts and metrics present
- [ ] Custom patient editor -- merged into Patients page
- [ ] Settings (dark mode, high contrast, font size, audiogram convention) -- all present
- [ ] **NEW: Referral criteria table** -- clinically reviewed
- [ ] **NEW: Red flag urgency matrix** -- clinically reviewed
- [ ] **NEW: Acoustic neuroma education** -- clinically reviewed
- [ ] **NEW: Patient communication scripts** -- clinically reviewed
- [ ] **NEW: Earmold types and styles** -- clinically reviewed
- [ ] **NEW: Earmold materials guide** -- clinically reviewed
- [ ] **NEW: Acoustic modifications (venting, horn, dampers)** -- clinically reviewed
- [ ] **NEW: Impression procedure** -- clinically reviewed
- [ ] **NEW: Pediatric/geriatric considerations** -- clinically reviewed
- [ ] **NEW: 20+ complaint-based adjustment entries** -- clinically reviewed
