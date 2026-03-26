# UX Redesign Specification: Audiology Training Suite

**Version:** 1.0
**Date:** 2026-03-26
**Author:** UX Architecture Review
**Status:** Draft for Clinical Expert Review

---

## Table of Contents

1. [Current State Audit](#1-current-state-audit)
2. [Proposed Information Architecture](#2-proposed-information-architecture)
3. [Navigation Design](#3-navigation-design)
4. [Page-by-Page Redesign Plan](#4-page-by-page-redesign-plan)
5. [Follow-Up/Complaints Section Redesign](#5-follow-upcomplaint-based-adjustments-section-redesign)
6. [New: Referrals Section Spec](#6-new-referrals-section-spec)
7. [New: Earmolds Section Spec](#7-new-earmolds-section-spec)
8. [WRS/Speech Testing Update Spec](#8-wrsspeech-testing-update-spec)
9. [Homepage Redesign](#9-homepage-redesign)
10. [Implementation Priority](#10-implementation-priority)

---

## 1. Current State Audit

### 1.1 Current Top-Level Navigation Items (14 items)

The navigation in `App.tsx` (lines 223-238) defines these top-level items, all rendered as equal-weight buttons in the AppBar and as a flat list in the Drawer:

| # | Nav Label | Route | Page Component |
|---|-----------|-------|----------------|
| 1 | Home | `/` | `HomePage.tsx` |
| 2 | Tutorial | `/tutorial` | `TutorialPage.tsx` |
| 3 | Ear Anatomy | `/ear-anatomy` | `EarAnatomyPage.tsx` |
| 4 | Otoscopy | `/otoscopy` | `OtoscopyPage.tsx` |
| 5 | Patients | `/patients` | `PatientsPage.tsx` |
| 6 | Follow-Up | `/followup` | `FollowUpPage.tsx` |
| 7 | Troubleshooting | `/troubleshooting` | `TroubleshootingGuidePage.tsx` |
| 8 | Real Ear | `/real-ear-measurement` | `RealEarMeasurementPage.tsx` |
| 9 | Contour Test | `/contour-test` | `ContourTestPage.tsx` |
| 10 | Progress | `/progress` | `ProgressPage.tsx` |
| 11 | Masking Practice | `/masking-practice` | `MaskingPracticePage.tsx` |
| 12 | Speech Audiometry | `/speech-audiometry` | `SpeechAudiometryPage.tsx` |
| 13 | Custom Patients | `/custom-patients` | `CustomPatientPage.tsx` |
| 14 | Settings | `/settings` | `SettingsPage.tsx` |

Additionally, there is a footer with 9 links and a Student avatar dropdown with 2 items ("My Progress", "Help & Resources").

**Problem:** 14 top-level nav items is overwhelming. On desktop, they overflow the AppBar. On mobile, the Drawer is a long undifferentiated list. There is no grouping, no hierarchy, and no indication of where a student should start or what relates to what.

### 1.2 Duplicated/Repeated Content

| Content | Location 1 | Location 2 | Severity |
|---------|-----------|-----------|----------|
| Troubleshooting hearing aids (whistling, no sound, sound quality, own voice, loudness, noise, environmental sounds) | `FollowUpPage.tsx` Step 5: "Patient Education" section (7 accordions, lines 644-777) | `TroubleshootingGuidePage.tsx` (5 categories covering overlapping issues, lines 122-207) | **HIGH** - Nearly identical content in two places |
| Daily care instructions | `FollowUpPage.tsx` Step 2 (Physical Check) + Step 5 (Daily Care card) | `TroubleshootingGuidePage.tsx` physical comfort section | MEDIUM |
| Frequency adjustment / complaint-based adjustment content | `FollowUpPage.tsx` Step 4 (embedded in interactive wizard) | Nowhere else (this is the problem -- it's buried) | **HIGH** - Best content is hardest to find |
| PTA calculation concept | `SpeechAudiometryPage.tsx` Calculator tab | `MaskingPracticePage.tsx` (uses PTA in masking scenarios) | LOW - contextually appropriate |
| Patient selection interface | `PatientsPage.tsx` | `CustomPatientPage.tsx` | LOW - different purposes |

### 1.3 Current User Flow Analysis

```
Student arrives at Homepage
         |
         v
    14 nav items -- where to start?
         |
    +----+----+----+----+----+
    |    |    |    |    |    |
    v    v    v    v    v    v
  (14 pages, all at same level, no grouping)
```

**Where students get lost:**

1. **No learning progression.** A student seeing "Contour Test" and "Masking Practice" alongside "Tutorial" has no signal about prerequisite knowledge.
2. **Follow-up page buries the gold.** The complaint-based adjustment guidelines (lines 339-434 of `FollowUpPage.tsx`) are inside Step 4 of a 5-step interactive wizard, nested inside an "Adjustments" accordion, inside a "Volume Adjustments" sub-accordion. Students must click through 3 earlier steps to see this content. This is the hardest clinical skill and it is the most hidden content.
3. **Troubleshooting vs. Follow-Up confusion.** `TroubleshootingGuidePage` is a patient-handout generator (brand-specific, with QR codes). `FollowUpPage` Step 5 has clinician-facing troubleshooting content. These serve different audiences but appear to be the same topic from the nav labels.
4. **No referral content anywhere.** A student completing the assessment flow has no guidance on when audiometric findings require medical referral.
5. **No earmold content.** A topic central to clinical practice is entirely absent.

### 1.4 Section Ratings

| Section | Rating | Rationale |
|---------|--------|-----------|
| HomePage | **Redesign** | Unfocused; card grid doesn't guide; too many equal-weight CTAs |
| Tutorial (PTA) | **Keep** | Solid Hughson-Westlake tutorial with step-by-step pedagogy |
| Ear Anatomy | **Keep** | Good 3D model, stepper-based learning. Works well as-is |
| Otoscopy | **Keep** | Comprehensive 8-step guide with abnormal findings. Strong |
| Patients | **Keep** | Core practice mode. Needs better positioning, not redesign |
| Follow-Up | **Redesign** | Interactive wizard format buries best content. Restructure |
| Troubleshooting | **Merge** | Overlaps with Follow-Up content. Merge printable guide into Follow-Up or standalone "Patient Handouts" |
| Real Ear Measurement | **Keep** | Solid 8-step REM workflow. Niche but valuable |
| Contour Test | **Keep** | Specialized; move to subsection |
| Progress | **Keep** | Utility page. Move to avatar dropdown / settings area |
| Masking Practice | **Keep** | Excellent 20-scenario masking module. Needs better discovery |
| Speech Audiometry | **Redesign** | WRS method is outdated (see Section 8). Good structure to build on |
| Custom Patients | **Merge** | Merge into Patients page as a tab or sub-feature |
| Settings | **Keep** | Utility. Move to avatar dropdown |

---

## 2. Proposed Information Architecture

### 2.1 New Top-Level Navigation (5 items + utility)

```
[Home]   [Assessment]   [Hearing Aids]   [Clinical Reference]   [Practice]
                                                                        [Avatar: Progress/Settings]
```

### 2.2 Complete Site Map

```
HOME (/)
  - Welcome / orientation
  - Learning path overview (4-5 pathway cards)
  - Quick start for new students

ASSESSMENT (/assessment)
  |-- Pure Tone Audiometry (/assessment/pure-tone)
  |     |-- Tutorial (Hughson-Westlake procedure)
  |     |-- Masking (theory + 20-scenario practice)
  |     +-- Speech Audiometry (SRT, WRS -- UPDATED METHOD)
  |
  |-- Otoscopy (/assessment/otoscopy)
  |     +-- Full 8-step otoscopy guide (existing)
  |
  |-- Special Tests (/assessment/special-tests)
  |     |-- Contour Test / Loudness Scaling
  |     +-- (Future: OAE, ABR, Tympanometry)
  |
  +-- Referrals (/assessment/referrals)    ** NEW **
        |-- When to Refer (criteria table)
        |-- Red Flags (urgency matrix)
        |-- Acoustic Neuroma / Vestibular Schwannoma
        |-- Rollover / Retrocochlear Signs
        +-- Communicating with Patients about Referrals

HEARING AIDS (/hearing-aids)
  |-- Follow-Up Appointments (/hearing-aids/follow-up)
  |     |-- Interview & Assessment (reference/checklist)
  |     |-- Physical Inspection (reference/checklist)
  |     |-- Listening Check (reference/checklist)
  |     |-- Complaint-Based Adjustments (** PROMOTED **)
  |     |-- Patient Education & Counseling
  |     +-- Printable Follow-Up Checklist
  |
  |-- Complaint-Based Adjustments (/hearing-aids/adjustments)    ** PROMOTED **
  |     |-- By Complaint (tabbed reference -- see Section 5)
  |     |-- Frequency Adjustment Guide
  |     |-- Input-Level Gain Guide
  |     +-- Common Adjustment Patterns
  |
  |-- Troubleshooting & Patient Handouts (/hearing-aids/troubleshooting)
  |     |-- Brand-specific guide generator (existing)
  |     +-- Patient-facing troubleshooting (merged from FollowUp Step 5)
  |
  |-- Real Ear Measurement (/hearing-aids/rem)
  |     +-- Full 8-step REM workflow (existing)
  |
  +-- Earmolds & Amplification (/hearing-aids/earmolds)    ** NEW **
        |-- Types & Styles
        |-- Materials
        |-- Acoustic Modifications (venting, horn, dampers)
        |-- Impressions
        |-- Pediatric Considerations
        +-- Remake Criteria

CLINICAL REFERENCE (/reference)
  |-- Ear Anatomy (/reference/anatomy)
  |     +-- 3D model + stepper (existing)
  |
  |-- Audiogram Interpretation (/reference/audiogram)
  |     +-- (New: degree/type/configuration reference)
  |
  +-- Glossary (/reference/glossary)
        +-- (New: combined glossary from anatomy + masking + speech)

PRACTICE (/practice)
  |-- Virtual Patients (/practice/patients)
  |     |-- Pre-built patients (existing 6)
  |     +-- Custom Patients (merged -- now a tab)
  |
  +-- Quizzes & Scenarios (/practice/quizzes)
        |-- Masking Scenarios (existing 20)
        |-- Speech Audiometry Quiz (existing 5 questions)
        +-- (Future: Referral decision scenarios)

UTILITY (Avatar dropdown -- not in main nav)
  |-- My Progress (/progress)
  +-- Settings (/settings)
```

### 2.3 Content Flow: Beginner to Advanced

```
BEGINNER PATH:
  Ear Anatomy → Otoscopy → PTA Tutorial → Speech Audiometry

INTERMEDIATE PATH:
  Masking Theory + Practice → Special Tests → Virtual Patients

ADVANCED PATH:
  Hearing Aid Follow-Up → Complaint-Based Adjustments → REM → Earmolds → Referrals
```

The homepage will present these as explicit learning pathways (see Section 9).

### 2.4 Where Key Content Lives

| Content | New Location | Rationale |
|---------|-------------|-----------|
| Follow-up complaint adjustments | `/hearing-aids/adjustments` (dedicated top-level subsection) + cross-linked from Follow-Up | Most important clinical skill gets first-class location |
| Referrals | `/assessment/referrals` (new section) | Referral decisions are made during assessment, not fitting |
| Earmolds | `/hearing-aids/earmolds` (new section) | Directly related to hearing aid fitting |
| WRS (updated method) | `/assessment/pure-tone` (Speech Audiometry subsection) | Part of the assessment workflow |

---

## 3. Navigation Design

### 3.1 Component Architecture Changes

**Current:** Single flat `menuItems` array (14 items) rendered identically in AppBar, Drawer, and Footer.

**Proposed:** Grouped navigation with collapsible sections.

#### Desktop AppBar (> 960px / md breakpoint)

```
[Logo] [Home] [Assessment v] [Hearing Aids v] [Reference v] [Practice v]  [DarkMode] [Avatar v]
```

- **Assessment**, **Hearing Aids**, **Reference**, **Practice** are dropdown menus (MUI `Menu` or `Popover`)
- Each dropdown shows subsections with brief descriptions
- **Home** is a direct link (no dropdown)
- **Progress** and **Settings** move to Avatar dropdown

#### Mobile Drawer

Replace the flat list with a grouped/nested list using MUI `Collapse`:

```
HOME
---
ASSESSMENT
  Pure Tone Audiometry
  Otoscopy
  Special Tests
  Referrals
---
HEARING AIDS
  Follow-Up Appointments
  Complaint-Based Adjustments
  Troubleshooting & Handouts
  Real Ear Measurement
  Earmolds & Amplification
---
CLINICAL REFERENCE
  Ear Anatomy
  Audiogram Interpretation
  Glossary
---
PRACTICE
  Virtual Patients
  Quizzes & Scenarios
---
My Progress
Settings
```

Groups are collapsible. Default state: all collapsed, only group headers visible (5 items visible instead of 14).

#### Footer

Simplify to 5 grouped columns matching the main nav:

```
Assessment         | Hearing Aids       | Reference    | Practice         | Support
Pure Tone          | Follow-Up          | Ear Anatomy  | Virtual Patients | Help
Otoscopy           | Adjustments Guide  | Audiogram    | Quizzes          | Settings
Speech Audiometry  | Real Ear           | Glossary     |                  | GitHub
Referrals          | Earmolds           |              |                  |
```

### 3.2 Mobile vs Desktop Behavior

| Feature | Desktop (>= md) | Mobile (< md) |
|---------|-----------------|---------------|
| Primary nav | Horizontal bar with dropdown menus | Hamburger + grouped drawer |
| Dropdown behavior | Hover or click to open menu | Tap group header to expand/collapse |
| Active indicator | Underline on active group + highlighted subsection | Bold text + left border accent |
| Breadcrumbs | Show below AppBar on subsection pages | Show below AppBar, compact |
| Quick actions | Avatar dropdown always visible | Avatar in AppBar, compact |

### 3.3 Reducing Cognitive Load

1. **Grouping:** 14 items become 5 groups. Cognitive load drops from ~14 choices to ~5.
2. **Progressive disclosure:** Subsections only appear when a group is engaged.
3. **Contextual secondary nav:** When inside a group (e.g., "Hearing Aids"), show a left sidebar (desktop) or horizontal tab bar (mobile) with that group's subsections. This eliminates returning to the main nav to move between related pages.
4. **Breadcrumbs:** Add `Home > Assessment > Pure Tone Audiometry` breadcrumbs to orient students within the hierarchy.

### 3.4 Progress Indicators / Learning Path

- On the Homepage, each pathway card shows a progress ring (% of subsections visited/completed).
- In the Drawer, each group header can show a small progress badge (e.g., "3/4" subsections completed).
- The Progress page (moved to avatar dropdown) shows the full dashboard with charts.
- Tracking uses the existing `ProgressService.ts` with extended event types.

---

## 4. Page-by-Page Redesign Plan

### 4.1 HomePage (`/`)

- **Purpose:** Orient students, present learning pathways, provide quick access
- **What stays:** Hero section concept, CTA buttons
- **What changes:** Complete redesign (see Section 9)
- **What's new:** Learning pathway cards with progress, "Where to start" guidance
- **What's removed:** 6-card topic grid (replaced by pathway cards), 3-card "Quick Access" section (redundant with pathways), 4-step methodology grid (generic)

### 4.2 Tutorial / Pure Tone Audiometry (`/assessment/pure-tone`)

- **Purpose:** Teach Hughson-Westlake PTA procedure
- **What stays:** Step-by-step tutorial, tone demonstration, FAQ section
- **What changes:** Route moves from `/tutorial` to `/assessment/pure-tone`; page becomes a tabbed container
- **What's new:** Tabs for "Tutorial", "Masking", "Speech Audiometry" -- unifying the assessment sub-workflow
- **What's removed:** Nothing from the tutorial itself

### 4.3 Masking Practice (`/assessment/pure-tone` -- Masking tab)

- **Purpose:** Masking theory and 20-scenario practice
- **What stays:** All masking content and scenarios -- this is excellent as-is
- **What changes:** Route changes from `/masking-practice` to being a tab within the Pure Tone Audiometry page, OR a dedicated subsection at `/assessment/masking`
- **What's new:** Brief "Why masking matters" introduction linking from PTA tutorial
- **What's removed:** Standalone nav entry

### 4.4 Speech Audiometry (`/assessment/pure-tone` -- Speech tab OR `/assessment/speech`)

- **Purpose:** SRT, WRS, PTA cross-checks
- **What stays:** Overview, PTA-SRT relationship, calculator, quiz structure
- **What changes:** WRS presentation level method (see Section 8); route restructure
- **What's new:** Updated WRS method based on 2 kHz threshold; rollover concept (cross-link to Referrals)
- **What's removed:** Outdated WRS presentation level formula (PTA + 30-40 dB)

### 4.5 Ear Anatomy (`/reference/anatomy`)

- **Purpose:** 3D anatomy exploration and education
- **What stays:** Everything -- 7-step stepper, 3D model, glossary
- **What changes:** Route from `/ear-anatomy` to `/reference/anatomy`
- **What's new:** Nothing
- **What's removed:** Standalone top-level nav entry (moved to Reference group)

### 4.6 Otoscopy (`/assessment/otoscopy`)

- **Purpose:** Otoscopic examination training
- **What stays:** Full 8-step guide, abnormal findings, pneumatic otoscopy
- **What changes:** Route from `/otoscopy` to `/assessment/otoscopy`
- **What's new:** Nothing
- **What's removed:** Standalone top-level nav entry

### 4.7 Patients / Virtual Patients (`/practice/patients`)

- **Purpose:** Practice with virtual patient cases
- **What stays:** Patient list, filtering, testing interface, results
- **What changes:** Route from `/patients` to `/practice/patients`; absorb Custom Patients as a tab
- **What's new:** "Create Custom Patient" tab within the same page
- **What's removed:** Standalone Custom Patients nav entry

### 4.8 Custom Patients (MERGED into `/practice/patients`)

- **Purpose:** Create custom patient profiles
- **What stays:** Threshold grid editor, presets, local storage persistence
- **What changes:** Becomes a tab ("My Custom Patients") within the Patients page
- **What's new:** Nothing
- **What's removed:** Standalone page and nav entry

### 4.9 Follow-Up (`/hearing-aids/follow-up`)

- **Purpose:** Hearing aid follow-up appointment reference guide
- **What stays:** Interview questions, physical inspection checklist, listening check procedure, follow-up planning
- **What changes:** Convert from interactive step-by-step wizard to a reference/educational page with sections. Remove interactive form fields (TextFields, sliders, ratings). Keep content as read-only checklist/guide format. The workflow structure (Interview -> Physical -> Listening -> Adjustments -> Education -> Plan) remains as an organizational principle, but presented as expandable sections rather than locked sequential steps.
- **What's new:** Cross-link to dedicated Complaint-Based Adjustments page; cross-link to Referrals
- **What's removed:** Interactive form elements (TextFields, Sliders, Rating, state management); Step 5 troubleshooting content (moved to Troubleshooting page); Complaint-based adjustment content (promoted to own page)

### 4.10 Troubleshooting (`/hearing-aids/troubleshooting`)

- **Purpose:** Brand-specific troubleshooting guide generator + patient education content
- **What stays:** Brand selector, HTML guide generator, QR code links, print functionality
- **What changes:** Route from `/troubleshooting` to `/hearing-aids/troubleshooting`; absorb the patient-facing troubleshooting content from FollowUpPage Step 5 (7 accordion items)
- **What's new:** Merged "Common Issues" section from Follow-Up (whistling, no sound, sound quality, own voice, loudness, noise, environmental sounds) -- these become the clinician reference, while the guide generator makes patient-facing handouts
- **What's removed:** Content duplication with Follow-Up page

### 4.11 Real Ear Measurement (`/hearing-aids/rem`)

- **Purpose:** REM verification workflow
- **What stays:** All 8 steps, tutorial tab, reference tab
- **What changes:** Route from `/real-ear-measurement` to `/hearing-aids/rem`
- **What's new:** Nothing
- **What's removed:** Standalone top-level nav entry

### 4.12 Contour Test (`/assessment/special-tests`)

- **Purpose:** Loudness contour / scaling procedure
- **What stays:** All content -- introduction, procedure, data entry, results
- **What changes:** Route from `/contour-test` to `/assessment/special-tests` (or a tab within)
- **What's new:** Introductory framing as part of "Special Tests" section
- **What's removed:** Standalone top-level nav entry

### 4.13 Progress (`/progress` -- accessed via Avatar dropdown)

- **Purpose:** Performance dashboard
- **What stays:** All charts, tables, metrics
- **What changes:** No longer in main nav; accessed via avatar dropdown and homepage progress badges
- **What's new:** Nothing
- **What's removed:** Main nav entry (moved to Avatar dropdown)

### 4.14 Settings (`/settings` -- accessed via Avatar dropdown)

- **Purpose:** App preferences
- **What stays:** Dark mode, high contrast, font size, audiogram convention
- **What changes:** No longer in main nav; accessed via avatar dropdown
- **What's new:** Nothing
- **What's removed:** Main nav entry

---

## 5. Follow-Up/Complaint-Based Adjustments Section Redesign

### 5.1 Problem Statement

The complaint-based adjustment content in `FollowUpPage.tsx` (lines 339-434) is the most clinically valuable content in the entire application. It maps patient complaints to specific frequency and gain adjustments -- the skill students struggle with most. However, it is:

1. Buried inside Step 4 of a 5-step interactive wizard (must click through 3 previous steps)
2. Nested inside an "Adjustments" accordion, inside a "Volume Adjustments" sub-accordion
3. Mixed with interactive UI elements (sliders, checkboxes) that don't serve an educational purpose
4. Not accessible without going through the full follow-up workflow

### 5.2 Redesign: Separate Complaint-Based Adjustments Page

**Route:** `/hearing-aids/adjustments`
**Type:** Static reference/educational page (NOT an interactive wizard)
**Format:** Tabbed reference guide with accordion details

#### Tab Structure

```
[By Complaint]  [By Frequency]  [By Input Level]  [Common Patterns]
```

#### Tab 1: "By Complaint" (PRIMARY -- this is what students need most)

Format: Filterable/searchable list of patient complaints, each expanding to show what to adjust and why.

| Patient Says... | Category | What to Adjust | Why |
|----------------|----------|---------------|-----|
| "Everything sounds too loud" | Loudness | Decrease gain across all input levels, starting with loud | Over-amplification or insufficient acclimatization |
| "Sounds are tinny/sharp" | Sound Quality | Reduce gain in 2-4 kHz range; increase in 500-1000 Hz | Excessive high-frequency emphasis relative to lows |
| "Speech is muffled/unclear" | Clarity | Increase gain in 1-4 kHz range | Insufficient mid/high frequency amplification for consonant perception |
| "My own voice sounds hollow" | Own Voice | Reduce low freq gain (250-500 Hz); increase 1-2 kHz; consider venting | Occlusion effect amplifying bone-conducted own-voice energy |
| "My own voice sounds boomy" | Own Voice | Reduce low frequency gain; consider open fit | Occlusion effect; excessive low-frequency amplification |
| "People sound like they're mumbling" | Clarity | Increase mid-frequency gain for medium inputs | Insufficient gain in critical speech frequencies |
| "Aids sound robotic" | Sound Quality | Reduce gain in 2-4 kHz; increase in 500-1000 Hz | Unnatural spectral balance; over-emphasis of high mids |
| "Sounds nasal" | Sound Quality | Reduce 1-2 kHz; slight increase at 500 Hz and 3 kHz | Peak in nasal resonance frequency region |
| "Sounds harsh" | Sound Quality | Reduce 3-6 kHz; smooth transition slopes between bands | Sharp peaks in high-frequency response |
| "Sounds thin/weak" | Sound Quality | Increase 250-750 Hz | Insufficient low-frequency gain for perceived warmth |
| "Whistling/feedback" | Feedback | Check fit; reduce high-freq gain if persistent; verify earmold seal | Acoustic feedback from sound leaking back to microphone |
| "Wind noise is bothersome" | Environmental | Enable wind noise reduction; consider microphone configuration | Wind turbulence on microphone ports |
| "Phone calls are difficult" | Connectivity | Check telecoil/streaming settings; adjust phone program; verify ear-to-phone positioning | Phone coupling method may need optimization |
| "Music sounds bad" | Music | Increase bandwidth; reduce compression; consider music program | Compression and noise reduction algorithms distort musical signals |
| "Can't hear in restaurants" | Noise | Activate directional mics; noise program; reduce low-freq gain; increase SNR | Speech-in-noise difficulty is multifactorial |
| "Background noise too loud" | Noise | Enable noise reduction; verify directional mics; adjust noise program | Gain for non-speech sounds too high relative to speech |
| "I jump at sudden sounds" | Loudness | Reduce loud gain; check attack time; verify MPO | Insufficient compression for transient loud sounds |
| "Dishes/water too sharp" | Environmental | Reduce gain above 4 kHz; explain adaptation; consider "home" program | Previously inaudible high-frequency sounds now amplified |
| "Soft sounds inaudible" | Audibility | Increase soft gain (50 dB input); verify expansion settings | Insufficient gain for low-level inputs |
| "Battery drains fast" | Hardware | Check streaming time; verify Bluetooth settings; consider charger | High current draw from streaming/features |

Each row, when expanded (accordion), shows:

1. **What the patient is experiencing** -- brief explanation of the perceptual phenomenon
2. **What to adjust** -- specific frequency ranges, gain levels, or features with dB values
3. **Why this adjustment helps** -- acoustic/perceptual rationale
4. **Verification step** -- how to confirm the adjustment worked (e.g., "play speech sample, ask if clearer")
5. **Caution** -- common mistakes or over-corrections to avoid

#### Tab 2: "By Frequency"

Reference table (preserving the excellent content from FollowUpPage lines 339-366):

```
LOW FREQUENCIES (250-1000 Hz)
  Increase when: vowel difficulty, speech lacks fullness/warmth
  Decrease when: own voice boomy/hollow, traffic/rumble too loud, environmental sounds overwhelming

MID FREQUENCIES (1000-3000 Hz)
  Increase when: speech unclear/muffled, consonants hard to distinguish, women/children hard to hear
  Decrease when: speech sounds harsh/mechanical, tinny quality

HIGH FREQUENCIES (3000-8000 Hz)
  Increase when: difficulty in noise (carefully), music lacks clarity, consonant detail needed
  Decrease when: environmental sounds too sharp, harsh sibilants, paper/water/dishes too loud
```

#### Tab 3: "By Input Level"

Reference table (preserving content from FollowUpPage lines 373-434):

```
SOFT GAIN (50 dB input)
  Increase: soft speech inaudible, can't hear at distance
  Decrease: background hum too noticeable, own breathing/swallowing audible

MEDIUM GAIN (65 dB input)
  Increase: conversational speech too soft, TV too quiet
  Decrease: normal conversation too loud, listening fatigue

LOUD GAIN (80 dB input)
  Increase: music sounds compressed, can't tell medium vs. loud
  Decrease: discomfort from loud sounds, distortion at high levels
```

Includes the voice quality sub-guide (robotic, hollow, nasal, sharp, muffled, thin) from the current FollowUpPage.

#### Tab 4: "Common Patterns"

Quick-reference cards for the most frequent adjustment combinations:

- "New user acclimatization" -- systematic gain increase over weeks
- "Experienced user upgrade" -- matching perceptual expectations from previous aid
- "Noise difficulty" -- combined directional + NR + program approach
- "Own voice issues" -- venting, low-freq, occlusion effect, open fit decision tree

### 5.3 Follow-Up Page Restructure

The Follow-Up page at `/hearing-aids/follow-up` becomes a **reference/checklist guide** rather than an interactive wizard:

**Format:** Expandable sections (accordion), not locked steps. Student can jump to any section.

```
HEARING AID FOLLOW-UP APPOINTMENT GUIDE

[1. Patient Interview]
  - Key questions to ask (read-only list, not text fields)
  - What to listen for
  - Satisfaction assessment approach

[2. Physical Inspection]
  - Checklist (read-only, not interactive checkboxes)
  - What each check reveals
  - When to flag for repair

[3. Listening Check]
  - Procedure steps
  - What to listen for with stethoscope
  - How to interpret findings

[4. Adjustments]
  → "See Complaint-Based Adjustments Guide for detailed adjustment guidance"
  - Brief overview of adjustment categories
  - When to adjust vs. when to counsel for adaptation
  - Link to full Complaint-Based Adjustments page

[5. Patient Education & Counseling]
  - Care instructions summary
  - Communication strategies
  - Adaptation expectations
  → "See Troubleshooting Guide for issue-specific handouts"

[6. Follow-Up Planning]
  - Recommended follow-up intervals
  - When to schedule sooner
  - Documentation requirements

[Print Checklist]  -- links to existing follow_up_checklist.html
```

---

## 6. New: Referrals Section Spec

### 6.1 Purpose and Urgency

This section is **critically missing**. Audiology students must learn to identify audiometric patterns that indicate potentially life-threatening conditions. Acoustic neuroma (vestibular schwannoma) affects approximately 1 in 100,000 people, but many patients have their first-ever hearing test at a hearing aid appointment. Early detection dramatically improves outcomes -- small tumors can be monitored or treated with radiation, while large tumors may require invasive surgery with risk of facial nerve damage.

**Route:** `/assessment/referrals`

### 6.2 Page Structure

```
WHEN TO REFER: MEDICAL REFERRAL GUIDE FOR AUDIOLOGISTS

Tabs:
[When to Refer]  [Red Flags]  [Acoustic Neuroma]  [Communicating Referrals]
```

### 6.3 Tab 1: "When to Refer" -- Referral Criteria

#### Asymmetric Sensorineural Hearing Loss (SNHL)

**Rule:** Refer when there is an interaural asymmetry of >= 15 dB at 3 or more frequencies, OR >= 20 dB at 2 or more frequencies, in the absence of a known cause.

**Table: Referral Criteria Matrix**

| Finding | Threshold | Urgency | Referral To | Reason |
|---------|-----------|---------|-------------|--------|
| Asymmetric SNHL | >= 15 dB at 3+ frequencies | Routine (4-6 weeks) | ENT / Otologist | Rule out retrocochlear pathology (vestibular schwannoma) |
| Sudden SNHL | >= 30 dB over 3 contiguous frequencies within 72 hours | **URGENT (same day/next day)** | ENT / Emergency | Medical emergency -- steroid treatment window is hours/days |
| Unilateral tinnitus | New onset, persistent, no known cause | Priority (2-4 weeks) | ENT / Otologist | Rule out retrocochlear pathology |
| Unilateral aural fullness | Persistent, with or without hearing loss | Priority (2-4 weeks) | ENT | Rule out Meniere's, middle ear pathology, retrocochlear |
| Disproportionately poor WRS | WRS significantly worse than PTA predicts (rollover) | Routine (4-6 weeks) | ENT / Otologist | Retrocochlear sign; neural pathway compromise |
| Conductive hearing loss with no medical clearance | Air-bone gap >= 10 dB | Routine | ENT | Medical/surgical treatment may restore hearing |
| Active ear drainage | Any | **URGENT** | ENT / Primary Care | Active infection requires medical treatment |
| Otalgia (ear pain) | Persistent or severe | Priority | ENT / Primary Care | Rule out infection, TMJ, referred pain, malignancy |
| Vertigo/dizziness with hearing loss | Any combination | Priority | ENT / Neurology | Meniere's, vestibular schwannoma, stroke |
| Visible abnormality on otoscopy | Any abnormality beyond cerumen | Priority | ENT | Diagnosis and treatment |
| Pulsatile tinnitus | Any | Priority (2-4 weeks) | ENT / Vascular | Rule out vascular anomaly, glomus tumor |

#### When NOT to Refer (Avoid Unnecessary Referrals)

- Symmetric, gradual, bilateral SNHL consistent with age (presbycusis)
- Known noise-induced hearing loss with typical audiometric configuration (4 kHz notch)
- Patient already under ENT care for the current condition
- Stable long-standing conductive loss with prior medical evaluation

### 6.4 Tab 2: "Red Flags" -- Urgency-Based Triage

**Visual: Red / Yellow / Green cards**

#### RED -- Immediate/Urgent Referral (Same Day)

| Sign | Why It's Urgent | Action |
|------|----------------|--------|
| Sudden hearing loss (< 72 hours) | Steroid treatment window closes rapidly; vascular occlusion, viral damage, or autoimmune attack | Call ENT directly; fax audiogram; instruct patient to go today |
| Active ear drainage with fever | Acute infection risk; possible cholesteatoma | Refer to ENT or urgent care |
| Sudden vertigo with hearing loss and tinnitus | Possible labyrinthitis, Meniere's attack, or vascular event | Refer to ENT/ER |

#### YELLOW -- Priority Referral (Within 2-4 Weeks)

| Sign | Why It's Concerning | Action |
|------|-------------------|--------|
| Asymmetric SNHL | Could indicate vestibular schwannoma | Write referral letter; include audiogram |
| Unilateral tinnitus (new) | Retrocochlear screening needed | Document onset, character; refer to ENT |
| Pulsatile tinnitus | Vascular etiology possible | Refer to ENT; note if objective (audible to examiner) |
| WRS rollover or disproportionately poor WRS | Neural pathway compromise | Include audiogram with WRS data in referral |
| Unexplained conductive loss | Otosclerosis, ossicular chain issue | Refer for medical evaluation before fitting |

#### GREEN -- Routine Referral (4-6 Weeks)

| Sign | Reason | Action |
|------|--------|--------|
| Bilateral symmetric SNHL with tinnitus | Standard assessment but may benefit from tinnitus evaluation | Note in chart; discuss with patient; refer if bothersome |
| Cerumen impaction preventing testing | Removal needed | Refer for cerumen removal before retesting |
| Patient requesting surgical/medical opinion | Patient autonomy | Facilitate referral |

### 6.5 Tab 3: "Acoustic Neuroma / Vestibular Schwannoma"

#### What It Is

A benign (non-cancerous) tumor growing on the vestibulocochlear nerve (CN VIII), specifically the vestibular branch. It grows slowly (1-2 mm/year typically) but can compress the brainstem and adjacent cranial nerves.

#### Prevalence

- Incidence: approximately 1-2 per 100,000 per year
- Accounts for ~6-10% of all intracranial tumors
- Peak diagnosis age: 40-60 years
- Bilateral tumors associated with Neurofibromatosis Type 2 (NF2)

#### How It Presents on Audiometric Testing

**Classic audiometric profile:**
- **Unilateral or asymmetric SNHL** -- typically high-frequency sloping, but can be any configuration
- **Disproportionately poor WRS relative to PTA** -- the hallmark retrocochlear sign
- WRS may be significantly worse than expected for the degree of pure-tone loss
- **Rollover:** WRS decreases at higher presentation levels (PI-PB function shows rollover)
- May have abnormal acoustic reflexes (elevated, absent, or decaying)
- ABR may show prolonged Wave I-V interwave latency

**The WRS Red Flag:**
A patient with a PTA of 40 dB HL might be expected to have a WRS of 80-100%. If their WRS is 52%, that discrepancy is a retrocochlear warning sign. The neural pathway is compromised even though the cochlea may be relatively intact.

#### What Rollover Means

**Rollover** occurs when WRS decreases as presentation level increases beyond the optimal level. In a normal ear, WRS plateaus or stays stable as level increases. In retrocochlear pathology, WRS peaks and then drops (rolls over).

**Rollover Index (RI):**
```
RI = (PBmax - PBmin) / PBmax
```
Where PBmax = maximum WRS score, PBmin = WRS at highest tested level.

- RI > 0.45 is considered significant for retrocochlear pathology (Jerger & Jerger criteria)
- Some clinicians use RI > 0.25 as a more conservative criterion

#### Clinical Examples

**Example 1: Suspect -- Refer**
- Right ear: PTA 35 dB HL, WRS 48% at PTA+40
- Left ear: PTA 30 dB HL, WRS 96% at PTA+40
- Assessment: Right WRS disproportionately poor for degree of loss. Asymmetric SNHL. Refer for MRI with gadolinium to rule out vestibular schwannoma.

**Example 2: Not Suspicious**
- Right ear: PTA 50 dB HL, WRS 76% at PTA+40
- Left ear: PTA 45 dB HL, WRS 80% at PTA+40
- Assessment: Symmetric loss, WRS consistent with cochlear pathology. No retrocochlear red flags.

#### Diagnostic Pathway After Referral

```
Audiometric suspicion → ENT referral → MRI with gadolinium contrast
  → If tumor found:
     Small (< 1.5 cm): Watch-and-wait with serial MRI
     Medium (1.5-2.5 cm): Stereotactic radiosurgery (Gamma Knife) or surgery
     Large (> 2.5 cm): Microsurgery (middle fossa, retrosigmoid, or translabyrinthine approach)
```

### 6.6 Tab 4: "Communicating Referrals to Patients"

#### Principles

1. **Be honest but not alarming.** "The test shows a difference between your ears that we'd like a specialist to look at more closely."
2. **Normalize the referral.** "This is a routine part of thorough audiologic care."
3. **Explain the reason without diagnosing.** You are not diagnosing; you are identifying patterns that warrant further evaluation.
4. **Emphasize that early evaluation is beneficial.** "Finding things early gives us the most options."
5. **Provide clear next steps.** Who to see, when, and what to bring.

#### Example Scripts

**For asymmetric SNHL:**
> "I noticed that your hearing is different between your two ears. When we see this kind of difference, we recommend having an ear, nose, and throat specialist take a look to make sure everything is okay. Most of the time it turns out to be nothing concerning, but it's an important step. I'll send over your hearing test results so the doctor has them ready."

**For sudden hearing loss (URGENT):**
> "Based on what you're describing, this sounds like a sudden change in your hearing. This is something that needs to be seen by a doctor right away -- today or tomorrow at the latest. There are treatments that work best when started early. Let me help you get connected with [ENT/ER] right now."

**For disproportionately poor WRS:**
> "Your hearing test shows that while you can detect sounds, your ability to understand words isn't as strong as we'd expect. This can happen for different reasons, and we'd like to have a specialist do some additional testing to understand why. I'll include all of your test results in the referral."

#### What to Include in a Referral Letter

- Patient demographics
- Audiogram (AC, BC, masked thresholds)
- Speech audiometry results (SRT, WRS, presentation levels)
- Tympanometry / acoustic reflex results if available
- Specific concern prompting referral
- Duration and onset of symptoms
- Relevant history (noise exposure, medications, family history)
- Your clinical impression (not diagnosis)

---

## 7. New: Earmolds Section Spec

### 7.1 Purpose

Earmolds are fundamental to hearing aid fitting success. An inappropriate earmold can cause feedback, discomfort, poor retention, and inadequate amplification. This section provides comprehensive education on earmold types, materials, acoustic modifications, and clinical decision-making.

**Route:** `/hearing-aids/earmolds`

### 7.2 Page Structure

```
EARMOLDS & AMPLIFICATION COUPLING

Tabs:
[Types & Styles]  [Materials]  [Acoustic Modifications]  [Impressions]  [Special Populations]
```

### 7.3 Tab 1: "Types & Styles"

#### Earmold / Coupling Styles Overview

| Style | Description | Best For | Hearing Loss Range | Occlusion | Retention |
|-------|-------------|----------|-------------------|-----------|-----------|
| **Full Shell** | Fills entire concha; maximum seal | Severe-profound loss; pediatric | Moderate to profound | High | Excellent |
| **Half Shell** | Fills lower concha only | Moderate-severe loss | Moderate to severe | Moderate-High | Very Good |
| **Canal** | Extends only into ear canal | Mild-moderate loss | Mild to moderate | Moderate | Good |
| **Canal Lock (Skeleton)** | Canal portion with concha lock arm | Mild-moderate; retention concerns | Mild to moderate | Low-Moderate | Good (with lock) |
| **Open Dome** | Silicone dome with venting holes | Mild high-frequency loss | Mild (high-freq only) | Minimal | Fair |
| **Closed Dome** | Silicone dome without venting | Mild-moderate loss | Mild to moderate | Moderate | Fair |
| **Power Dome / Double Dome** | Dual-layer dome for better seal | Moderate loss; feedback prone | Moderate | Moderate-High | Good |
| **CIC Shell** | Custom completely-in-canal shell | Mild-moderate loss; cosmetic priority | Mild to moderate | High (but canal only) | Good |
| **Micro Mold** | Minimal custom mold with canal tip | Mild-moderate; comfort priority | Mild to moderate | Low | Fair-Good |

#### Selection Decision Flow

```
What is the degree of hearing loss?
  |
  +-- Mild (high-freq only) → Open dome or micro mold
  |     |-- Feedback issues? → Consider closed dome or canal mold
  |     +-- Retention issues? → Canal lock or half shell
  |
  +-- Mild-Moderate → Closed dome, canal mold, or half shell
  |     |-- Good dexterity? → Canal or skeleton
  |     +-- Poor dexterity? → Half shell or full shell
  |
  +-- Moderate-Severe → Half shell or full shell
  |     |-- Feedback? → Full shell with no vent or pressure vent
  |     +-- Occlusion complaints? → Maximum venting allowed without feedback
  |
  +-- Severe-Profound → Full shell (required for seal)
        |-- Pediatric? → Full shell, soft material, with retention lock
        +-- Adult? → Full shell, material based on preference
```

### 7.4 Tab 2: "Materials"

| Material | Properties | Advantages | Disadvantages | Best For |
|----------|-----------|------------|--------------|----------|
| **Hard Acrylic (Lucite)** | Rigid, non-porous, smooth | Durable; easy to modify; hypoallergenic; precise fit | Can be uncomfortable initially; may amplify vibration feedback; less forgiving of ear canal changes | Adults with stable ears; standard fittings; when modifications will be needed |
| **Soft Vinyl** | Flexible, soft | Comfortable; good seal; absorbs some vibration | Shrinks over time; harder to modify; can discolor; shorter lifespan; may cause allergic reactions | Severe-profound loss (seal critical); active lifestyles |
| **Silicone** | Soft, flexible, hypoallergenic | Very comfortable; hypoallergenic; good seal; long-lasting | Harder to modify than acrylic; cannot be built up easily | Sensitive skin; pediatric; comfort priority |
| **Soft acrylic** | Semi-rigid, slightly flexible | Compromise between comfort and modifiability; good seal | Less precise than hard acrylic | Patients who find hard acrylic uncomfortable |

#### Material Selection Guide

- **Default starting point:** Hard acrylic (most versatile, easiest to modify)
- **Switch to soft when:** Patient has skin sensitivity, severe-profound loss needing seal, pediatric patient, or complaints of discomfort with hard acrylic
- **Silicone when:** Allergy concerns, pediatric, or patient strongly prefers soft
- **Avoid soft vinyl when:** Long-term use expected (shrinkage) or patient has vinyl sensitivity

### 7.5 Tab 3: "Acoustic Modifications"

#### Venting

**What venting does:** A vent is a channel through the earmold that connects the ear canal to the outside air. It allows low-frequency sound (both amplified and environmental) to escape, reducing the occlusion effect and low-frequency amplification.

**Venting Rules:**

| Vent Type | Diameter | Low-Freq Effect | Use When |
|-----------|----------|-----------------|----------|
| **No vent** | 0 mm | Maximum LF gain; maximum occlusion | Severe-profound loss; maximum gain needed |
| **Pressure vent** | 0.5-0.8 mm | Minimal LF reduction; equalizes pressure | Moderate-severe loss; comfort without sacrificing gain |
| **Small vent** | 1.0-1.5 mm | Moderate LF reduction (~5-10 dB at 250 Hz) | Moderate loss; mild occlusion complaints |
| **Medium vent** | 2.0-2.5 mm | Significant LF reduction (~10-15 dB at 250 Hz) | Mild-moderate loss; occlusion complaints |
| **Large vent / IROS** | 3.0+ mm | Substantial LF reduction (~15-25 dB below 500 Hz) | Mild loss; high-frequency emphasis needed |
| **Open fit** | Fully open | Minimal LF amplification; natural LF hearing | Mild high-frequency loss only |
| **External vent (select-a-vent)** | Variable, adjustable | Adjustable LF reduction | When optimal vent size is unknown; trial fitting |
| **Diagonal vent** | Various | Similar to same-diameter parallel vent | When straight vent doesn't fit in canal anatomy |

**Key Clinical Principle:** Larger vent = less low-frequency gain = less occlusion BUT more feedback risk. The clinician must balance occlusion relief against feedback control and low-frequency amplification needs.

**IROS (Intentional Reduction of Output at Specific frequencies):** A large vent (3mm+) intentionally reduces low-frequency output. Used when the audiogram shows near-normal low-frequency hearing with high-frequency loss -- the patient needs high-frequency amplification but not low-frequency amplification.

#### Horn Effect (Libby Horn)

A horn bore is a gradually widening sound channel in the earmold tubing, increasing the diameter from the hearing aid end to the canal tip. This boosts high-frequency output (typically 2-4 kHz) by 5-10 dB, similar to an acoustic horn.

- **Standard bore:** ~2mm constant diameter
- **Stepped horn:** Two discrete diameter steps (e.g., 2mm to 3mm)
- **Continuous horn:** Gradual flare from ~2mm to ~4mm (Libby horn)

**Use when:** Additional high-frequency gain is needed beyond what programming can provide; patient needs natural high-frequency boost.

#### Acoustic Dampers

Filters placed in the earmold tubing that smooth the frequency response by damping resonance peaks (typically the ~1 kHz peak in BTE tubing).

- **680-ohm damper:** Mild smoothing; reduces peak by ~5 dB
- **1500-ohm damper:** Moderate smoothing; reduces peak by ~8-10 dB
- **3300-ohm damper:** Strong smoothing; flattens response significantly

**Use when:** Patient reports "harshness" or "ringing quality" that frequency adjustment alone doesn't resolve; the response curve shows sharp resonance peaks.

### 7.6 Tab 4: "Impressions"

#### When to Take Earmold Impressions

- New custom earmold fitting
- Remake due to poor fit, feedback, or discomfort
- Pediatric patients (every 3-6 months due to growth for young children)
- Change in ear canal shape (weight loss/gain, surgery)
- Switching from dome to custom mold
- Swim molds or musician's earplugs

#### Impression Procedure

1. **Otoscopic examination** -- ensure ear canal is clear; check for perforations, active drainage, exostoses
2. **Contraindications check:** Active infection, perforated TM (unless ENT-approved), recent surgery, excessive cerumen
3. **Place otoblock** -- cotton or foam block positioned past the second bend of the ear canal, beyond the bony-cartilaginous junction (approximately 3/4 canal depth). Must be visible and firmly seated.
4. **Mix impression material** -- follow manufacturer instructions for working time; mix until uniform color
5. **Inject impression material** -- start deep (at otoblock) and pull syringe back slowly as canal fills; fill concha completely for full shell; maintain steady pressure
6. **Allow to cure** -- follow manufacturer cure time (typically 3-6 minutes); have patient open/close jaw during curing for dynamic impression
7. **Remove impression** -- break seal at helix; pull down and out gently; rotate slightly if needed
8. **Inspect impression** -- check for completeness, smooth canal portion, no voids, visible otoblock at tip, no pulled areas
9. **Inspect ear** -- otoscopic check post-impression; ensure no material remains

#### What Can Go Wrong

| Problem | Cause | Prevention |
|---------|-------|------------|
| Incomplete canal impression | Insufficient material; premature removal; poor otoblock placement | Adequate material injection; full cure time; proper otoblock depth |
| Voids or air bubbles | Air trapped during injection; inconsistent injection pressure | Inject from deepest point; maintain steady pressure; no air gaps |
| Otoblock pushed too deep | Excessive injection pressure; undersized otoblock | Appropriate otoblock size; gentle injection; verify placement |
| Impression material in middle ear | No otoblock placed; perforated TM not identified | Always perform otoscopy; always place otoblock; check for perforations |
| Ear canal irritation | Allergic reaction to impression material; rough injection | Use hypoallergenic materials; gentle technique |
| Distorted impression | Premature removal; jaw movement at wrong time | Full cure time; controlled jaw exercises |

### 7.7 Tab 5: "Special Populations"

#### Pediatric Considerations

- **Remake frequency:** Every 3-6 months for infants/toddlers; every 6-12 months for school-age children; annually for teens
- **Material:** Soft materials preferred (silicone or soft vinyl) for safety and comfort
- **Style:** Full shell for maximum retention; consider tethering clips for young children
- **Safety:** No small parts; supervise insertion/removal for young children
- **Bilateral:** Both ears fitted simultaneously whenever possible
- **Parent education:** Demonstrate insertion, removal, cleaning, troubleshooting
- **Feedback management:** Children's smaller ears change rapidly -- feedback often means remake time
- **Color options:** Fun colors increase acceptance and wear time in older children

#### Geriatric Considerations

- **Dexterity:** Larger styles (full shell, half shell) easier to handle; consider canal lock for canal molds
- **Vision:** High-contrast molds (colored vs. clear) easier to see; tactile markers for left/right identification
- **Skin changes:** Aging ear canals may be dryer, more fragile; soft materials may be more comfortable
- **Cerumen:** Increased cerumen production common; regular cleaning schedule critical

#### Remake Criteria

When to remake an earmold:

| Indicator | Reason |
|-----------|--------|
| Persistent feedback despite programming adjustment | Earmold no longer seals adequately |
| Pain or soreness that doesn't resolve with adjustment | Poor fit; pressure points |
| Visible gap between mold and ear canal wall | Ear canal shape has changed |
| Mold is loose; falls out with jaw movement | Weight change, aging, or growth |
| Material degradation (yellowing, hardening, cracking) | Material lifespan exceeded (especially soft vinyl) |
| More than 3 years since last impression (adults) | Gradual ear canal changes |
| 3-6+ months since last impression (young children) | Rapid growth |
| Patient reports significant change in fit | Trust patient perception |

---

## 8. WRS/Speech Testing Update Spec

### 8.1 Current Method (Outdated)

The current `SpeechAudiometryPage.tsx` (lines 117-121, 339-364) uses:

```
WRS presentation level = PTA + 30-40 dB
(capped at 100 dB HL)
```

Where PTA = average of 500, 1000, and 2000 Hz.

This is referenced in:
- The "WRS Presentation Level Estimator" tool (line 340-364)
- Quiz question #4 (line 44-47): "At what level is WRS typically administered relative to PTA?" with correct answer "30-40 dB above PTA"
- The WRS overview card (line 153-158): "typically PTA + 30-40 dB"

### 8.2 Updated Method: 2 kHz Threshold-Based Presentation

**New rule:** WRS presentation level is based on the **threshold at 2000 Hz**, not the PTA.

#### Formula

```
WRS Presentation Level = Threshold at 2 kHz + 30 dB (typical starting point)
```

With considerations:
- If UCL (uncomfortable level) is known, present at halfway between SRT and UCL
- If 2 kHz threshold exceeds 70 dB HL, consider using maximum comfortable level instead
- Cap at the patient's measured or estimated UCL minus 5 dB (never exceed tolerance)

#### Why This Change

1. **Better ear separation through masking:** Using a higher presentation level (based on 2 kHz, which is often worse than PTA in sloping losses) means the stimulus is presented at a higher level. This makes it more likely to cross to the non-test ear, which means masking is more frequently needed and applied. This **better separates the ears** for independent WRS measurement.

2. **More accurate WRS for sloping losses:** For a patient with thresholds of 20/25/50/65 dB at 500/1000/2000/4000 Hz:
   - Old method: PTA = (20+25+50)/3 = 32 dB → present at 62-72 dB
   - New method: 2 kHz threshold = 50 dB → present at 80 dB
   - The higher presentation level ensures speech is above threshold across the full frequency range, giving a truer measure of word recognition ability.

3. **Clinical consensus shift:** Recent clinical practice guidelines increasingly recommend using the 2 kHz threshold or a sensation level approach to ensure adequate audibility, particularly for high-frequency sloping losses common in presbycusis.

### 8.3 Required Code Changes

#### SpeechAudiometryPage.tsx Updates

**1. Overview card (WRS description) -- line 153-158:**

Change:
```
"at a comfortable suprathreshold level, typically PTA + 30-40 dB"
```
To:
```
"at a suprathreshold level based on the 2 kHz threshold + 30 dB, ensuring adequate audibility across the speech spectrum and enabling proper ear separation through masking"
```

**2. WRS Presentation Level Estimator -- lines 339-364:**

Replace the PTA-based dropdown/estimator with a 2 kHz threshold-based version:

- Input: 2 kHz threshold (dB HL) -- dropdown or number input
- Output: Recommended WRS presentation level = 2 kHz + 30 dB
- Secondary output: Note whether masking is likely needed (if presentation level exceeds IA for the transducer being used)
- Show comparison: "Old method (PTA + 30-40): X dB" vs. "Updated method (2 kHz + 30): Y dB"

**3. Quiz Question #4 -- line 44-47:**

Change question from:
```
"At what level is WRS typically administered relative to PTA?"
Answer: "30-40 dB above PTA"
```
To:
```
"Using current clinical practice, how is the WRS presentation level determined?"
Options:
a) At the PTA level
b) 30-40 dB above PTA
c) Based on 2 kHz threshold + 30 dB
d) Always at 70 dB HL
Correct: c
Explanation: "WRS is presented based on the 2 kHz threshold + 30 dB. This approach ensures adequate audibility across the speech spectrum (particularly for sloping losses where PTA may underestimate high-frequency difficulty) and induces more appropriate masking to better separate the ears. The older PTA + 30-40 dB method remains in some references but can under-present for sloping high-frequency losses."
```

**4. New educational content -- add to PTA-SRT Relationship tab or new "WRS Method" tab:**

- Explanation of why 2 kHz was chosen (carries critical consonant energy; often the steepest part of the slope)
- Worked examples comparing old and new methods for flat vs. sloping configurations
- Masking implications: show when the higher presentation level triggers masking need
- Clinical pearl: "When in doubt, present at the patient's most comfortable level (MCL) as determined during SRT testing"

### 8.4 Clinical Examples for Updated Content

**Example 1: Sloping High-Frequency Loss**
```
Thresholds: 500 Hz: 20 dB | 1000 Hz: 25 dB | 2000 Hz: 55 dB | 4000 Hz: 70 dB

Old method: PTA = (20+25+55)/3 = 33 dB → Present at 63-73 dB
New method: 2 kHz = 55 dB → Present at 85 dB

Impact: Old method may under-present, missing true recognition difficulty.
New method ensures full audibility. At 85 dB, masking of the non-test ear
is very likely needed (especially with supra-aural phones, IA = 40 dB),
which properly separates the ears.
```

**Example 2: Flat Moderate Loss**
```
Thresholds: 500 Hz: 45 dB | 1000 Hz: 50 dB | 2000 Hz: 50 dB | 4000 Hz: 55 dB

Old method: PTA = (45+50+50)/3 = 48 dB → Present at 78-88 dB
New method: 2 kHz = 50 dB → Present at 80 dB

Impact: Methods agree closely for flat losses. Both are clinically appropriate.
```

**Example 3: Asymmetric Loss (Referral Cross-Link)**
```
Right ear 2 kHz: 60 dB → Present WRS at 90 dB
Left ear 2 kHz: 25 dB → Present WRS at 55 dB

Right ear WRS at 90 dB: 44% ← RED FLAG: disproportionately poor
Left ear WRS at 55 dB: 96%

→ This patient should be referred (see Referrals section).
The asymmetric loss combined with poor WRS suggests retrocochlear pathology.
```

---

## 9. Homepage Redesign

### 9.1 Current Homepage Problems

The current `HomePage.tsx` has three sections that are visually busy without being informative:

1. **Hero section:** Generic "Audiology Training Suite" with two buttons. Doesn't tell students what to do first.
2. **"Explore Audiology Topics" grid (6 cards):** All cards have equal visual weight. No learning sequence implied. Repeats information from the nav.
3. **"Clinical Training" section:** 4-step methodology (Learn, Select Patient, Conduct, Receive Feedback) is generic and doesn't guide actual navigation.
4. **"Quick Access to Learning Resources" (3 cards):** Overlaps with the 6-card grid above. "Core Theory" vs "Pure Tone Audiometry" -- what's the difference?

**Net result:** 6 + 3 = 9 cards on the homepage, all linking to various pages with no progression signal. Combined with 14 nav items, a new student sees ~23 different clickable destinations on first load.

### 9.2 Proposed Homepage Design

#### Section 1: Hero (Simplified)

```
-----------------------------------------
|                                       |
|     Audiology Training Suite          |
|                                       |
|     Your clinical skills companion    |
|     for audiometric assessment        |
|     and hearing aid management.       |
|                                       |
|     [Start the Learning Path]         |
|                                       |
-----------------------------------------
```

Single CTA. No secondary button. Clean and directional.

#### Section 2: Learning Pathways (4 Cards with Progress)

Four clear pathway cards, each representing a major domain. Each card shows:
- Title and brief description
- Number of modules within
- Progress indicator (ring or bar) based on completion tracking
- Single "Continue" or "Start" button

```
+-------------------+  +-------------------+  +-------------------+  +-------------------+
| FOUNDATIONS        |  | ASSESSMENT        |  | HEARING AIDS      |  | CLINICAL PRACTICE |
|                    |  |                    |  |                    |  |                    |
| Ear anatomy,      |  | Pure tone testing, |  | Follow-up, REM,   |  | Virtual patients,  |
| otoscopy, and     |  | masking, speech    |  | adjustments,      |  | masking scenarios, |
| how hearing works |  | audiometry,        |  | troubleshooting,  |  | quizzes, and      |
|                    |  | referrals          |  | earmolds          |  | clinical decisions |
|                    |  |                    |  |                    |  |                    |
| [====    ] 2/3    |  | [==      ] 1/5    |  | [        ] 0/5    |  | [===     ] 1/3    |
|                    |  |                    |  |                    |  |                    |
| [Continue]        |  | [Start]           |  | [Start]           |  | [Continue]        |
+-------------------+  +-------------------+  +-------------------+  +-------------------+
```

#### Section 3: Quick Resume (Conditional)

Only shown if student has in-progress work:

```
PICK UP WHERE YOU LEFT OFF
+-------------------------------------------------------+
| Last visited: Masking Practice (15 of 20 scenarios)   |
| [Resume]                                              |
+-------------------------------------------------------+
```

#### Section 4: What's New / Highlights (Optional)

Compact section highlighting new content:

```
NEW: Medical Referral Guide — Learn when audiometric findings require specialist referral
NEW: Earmolds & Amplification — Comprehensive guide to earmold selection and acoustics
```

#### What's Removed

- 6-card topic grid (replaced by 4 pathway cards)
- 3-card "Quick Access" section (redundant)
- 4-step methodology illustration (generic)
- Footer duplicating nav links (simplified footer with copyright and grouped links)

---

## 10. Implementation Priority

### Phase A: Navigation Restructure

**Impact:** HIGH | **Effort:** MEDIUM | **Complexity:** M

The single highest-impact change. Reduces cognitive load immediately. All existing content stays but becomes findable.

- Restructure `App.tsx` navigation from flat to grouped
- Implement dropdown menus (desktop) and collapsible groups (mobile drawer)
- Add breadcrumb component
- Update all routes to new paths
- Add redirects from old paths to new paths
- Update footer

**Estimated time to implement:** 2-3 days
**Dependencies:** None
**Success criteria:** Navigation has 5 top-level items; all existing pages are accessible; breadcrumbs show location; mobile drawer is grouped

### Phase B: New Referrals Section

**Impact:** HIGH (clinical safety) | **Effort:** MEDIUM | **Complexity:** M

Critically missing content. Potential patient safety implications. Highest clinical priority for new content.

- Create `ReferralsPage.tsx` with 4-tab structure
- Write all clinical content (referral criteria, red flags, acoustic neuroma, communication)
- Add clinical examples
- Cross-link from Speech Audiometry (WRS red flags → Referrals)

**Estimated time to implement:** 3-4 days (2 days content writing, 1-2 days implementation)
**Dependencies:** Phase A (for routing) or can be done independently with old route
**Success criteria:** Complete referral criteria table; red flag urgency matrix; acoustic neuroma education; patient communication scripts

### Phase C: New Earmolds Section

**Impact:** HIGH (educational completeness) | **Effort:** LARGE | **Complexity:** L

Major missing topic. Significant clinical content to write.

- Create `EarmoldsPage.tsx` with 5-tab structure
- Write comprehensive clinical content for all tabs
- Include decision flow diagrams (style selection, material selection, vent sizing)
- Add visual diagrams or placeholder image references for earmold types

**Estimated time to implement:** 4-5 days (3 days content, 2 days implementation)
**Dependencies:** Phase A (for routing)
**Success criteria:** All earmold types documented; material selection guide; venting rules table; impression procedure; pediatric/geriatric considerations

### Phase D: Follow-Up Content Redesign + Complaint-Based Adjustments

**Impact:** HIGH (best content gets promoted) | **Effort:** MEDIUM | **Complexity:** M

Promotes the most valuable clinical content from buried-in-wizard to first-class page.

- Create `ComplaintAdjustmentsPage.tsx` with 4-tab structure
- Extract complaint-based content from `FollowUpPage.tsx`
- Convert `FollowUpPage.tsx` from interactive wizard to reference guide
- Merge troubleshooting duplicated content into `TroubleshootingGuidePage.tsx`
- Cross-link between Follow-Up, Adjustments, and Troubleshooting

**Estimated time to implement:** 3-4 days
**Dependencies:** Phase A (for routing)
**Success criteria:** Complaint-based adjustments page accessible in max 2 clicks from nav; Follow-Up is reference/checklist format; no duplicated troubleshooting content

### Phase E: WRS Update + Speech Section

**Impact:** MEDIUM (clinical accuracy) | **Effort:** SMALL | **Complexity:** S

Focused update to existing page.

- Update WRS presentation level formula and estimator
- Update quiz question #4
- Update overview card text
- Add worked examples comparing old and new methods
- Add cross-link to Referrals for rollover/retrocochlear signs

**Estimated time to implement:** 1-2 days
**Dependencies:** Phase B (for Referrals cross-link) or can be done independently
**Success criteria:** WRS presentation uses 2 kHz threshold; quiz question updated; examples show masking implications

### Phase F: Homepage Redesign

**Impact:** MEDIUM-HIGH | **Effort:** SMALL-MEDIUM | **Complexity:** S

Best done after nav restructure so pathways align with new IA.

- Redesign `HomePage.tsx` with pathway cards
- Implement progress tracking badges on pathway cards
- Add "Pick up where you left off" section
- Remove redundant card grids
- Simplify hero section

**Estimated time to implement:** 2 days
**Dependencies:** Phase A (pathway cards must align with new nav groups); existing `ProgressService.ts`
**Success criteria:** 4 pathway cards with progress indicators; single CTA hero; no redundant content; new student has clear starting point

---

### Implementation Order Summary

```
Phase A (Navigation)  ←  Do first; enables all others
    |
    +-- Phase B (Referrals)      ← Highest clinical priority
    |
    +-- Phase C (Earmolds)       ← Can parallel with B
    |
    +-- Phase D (Follow-Up/Adjustments)  ← Can parallel with B/C
    |
    +-- Phase E (WRS Update)     ← Small; can slot anywhere after B
    |
    +-- Phase F (Homepage)       ← Do last; benefits from all others being done
```

Phases B, C, D, and E can be developed in parallel after Phase A is complete. Phase F should be last because the homepage pathways should reflect the final content structure.
