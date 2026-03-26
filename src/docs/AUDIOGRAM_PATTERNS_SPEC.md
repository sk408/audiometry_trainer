# Audiogram Patterns & Clinical Action — Implementation Specification

**Version:** 1.0
**Date:** 2026-03-26
**Companion to:** `UX_REDESIGN_SPEC.md`, `CLINICAL_DECISION_SPEC.md`
**Status:** Draft for Clinical Expert Review

---

## Table of Contents

1. [Purpose & Rationale](#1-purpose--rationale)
2. [Integration Points](#2-integration-points)
3. [Page Architecture](#3-page-architecture)
4. [Data Model](#4-data-model)
5. [Component Structure](#5-component-structure)
6. [Pattern Definitions](#6-pattern-definitions)
7. [UI Layout](#7-ui-layout)
8. [Content Review Requirements](#8-content-review-requirements)

---

## 1. Purpose & Rationale

### 1.1 Gap Analysis

Students currently have no structured way to connect audiogram configuration to clinical action. The existing pages teach individual skills in isolation:

- **Masking Practice** teaches *when* to mask, not *what the audiogram means*
- **Referrals** teaches *when to refer*, but doesn't connect referral criteria to specific audiogram shapes
- **Complaint-Based Adjustments** teaches *how to respond to complaints*, but doesn't predict which complaints a given audiogram will generate
- **Earmolds** teaches *what coupling to use*, but doesn't tie decisions to audiogram configurations

This page bridges the gap: given an audiogram, what should the student expect, plan for, and watch out for?

### 1.2 Learning Objectives

After using this page, students should be able to:

1. Identify the 12 most common audiogram configurations by name and shape
2. Predict typical patient complaints for each configuration
3. Select appropriate transducer, coupling, vent, and prescriptive approach
4. Determine when masking is needed for each pattern
5. Distinguish between complaints that require adjustment vs. counseling
6. Recognize when a pattern warrants medical referral
7. Avoid the most common student mistakes for each pattern

---

## 2. Integration Points

### 2.1 Navigation Placement

**Route:** `/reference/audiogram-patterns`

**Nav location:** Under **Reference** group in the main navigation (alongside Ear Anatomy).

```
Reference
  |-- Ear Anatomy (/reference/anatomy)
  |-- Audiogram Patterns (/reference/audiogram-patterns)    ** NEW **
```

This location is correct because the page is a reference guide, not a practice exercise or assessment tool. Students will consult it during and after other activities.

### 2.2 Files to Modify for Integration

| File | Change |
|------|--------|
| `src/App.tsx` | Add lazy import for `AudiogramPatternsPage`; add route `/reference/audiogram-patterns`; add nav entry under Reference group; add footer link; add redirect from `/reference/audiogram` (currently a placeholder in the site map) |
| `src/components/shared/Breadcrumbs.tsx` | Add `'audiogram-patterns': 'Audiogram Patterns'` to `ROUTE_LABELS` |
| `src/pages/ReferralsPage.tsx` | Add cross-link callouts from Tab 1 (referral criteria for asymmetric SNHL, sudden SNHL) linking to specific patterns |
| `src/pages/ComplaintAdjustmentsPage.tsx` | Add introductory `Alert` in Tab 1 ("By Complaint"): "Wondering which complaints to expect for a specific audiogram? See the Audiogram Patterns guide." |
| `src/pages/EarmoldsPage.tsx` | Add cross-link from Selection Decision Flow to Audiogram Patterns: "For coupling recommendations by audiogram configuration, see..." |
| `src/pages/MaskingPracticePage.tsx` | Add cross-link from masking theory section: "For pattern-specific masking guidance, see..." |
| `src/pages/HomePage.tsx` | Add Audiogram Patterns to the Reference pathway card description |
| `src/pages/ClinicalDecisionPage.tsx` | Cross-reference table links to individual patterns (see CLINICAL_DECISION_SPEC.md) |

### 2.3 Cross-Links FROM This Page

Each pattern card should deep-link to relevant content in other pages:

| Pattern Section | Links To |
|----------------|----------|
| Fitting approach → transducer | Earmolds page, Tab 1 (Types & Styles) |
| Fitting approach → vent size | Earmolds page, Tab 3 (Acoustic Modifications → Venting) |
| Masking requirements | Masking Practice page |
| Referral criteria | Referrals page, Tab 1 (When to Refer) and Tab 2 (Red Flags) |
| Adjustment vs Counseling | Clinical Decision-Making page; Complaint-Based Adjustments page |
| Common complaints | Complaint-Based Adjustments page, Tab 1 (By Complaint) |

---

## 3. Page Architecture

### 3.1 Page Layout

The page uses a **two-level navigation** approach:

1. **Top level:** Visual pattern selector (grid of audiogram thumbnails or a filterable list)
2. **Detail level:** Full pattern card with all clinical information

This differs from the tab-based pattern used in ReferralsPage and EarmoldsPage because 12 patterns would create too many tabs. Instead, the page uses a card grid with expand-on-click detail, or a sidebar list + detail panel layout.

### 3.2 Layout Options

**Option A — Accordion List (Recommended)**

Matches the ComplaintAdjustmentsPage pattern. All 12 patterns listed as accordions with search/filter. Each accordion expands to show the full clinical detail card. Familiar UI pattern for users of the existing app.

```
[Search: _______________]  [Filter: All | SNHL | Conductive | Mixed | Special]

> Flat Mild-Moderate SNHL
v Sloping High-Frequency SNHL                    ← expanded
  [Audiogram Signature]  [Typical Complaints]  [Fitting Approach]
  [Masking Requirements]  [Tradeoffs]  [Adjust vs Counsel]
  [Referral Criteria]  [Common Mistakes]  [Clinical Pearls]
> Severe-Profound Flat SNHL
> Cookie-Bite (Mid-Frequency Loss)
  ...
```

**Option B — Grid + Detail Panel**

Audiogram thumbnail cards in a grid. Click a card to open a detail panel (right-side panel on desktop, full-screen on mobile). Better for visual learners who can scan audiogram shapes quickly.

```
+-------+  +-------+  +-------+  +-------+
| Flat  |  | Slope |  | Sev-  |  | Cookie|
| Mild  |  | HF    |  | Prof  |  | Bite  |
| [img] |  | [img] |  | [img] |  | [img] |
+-------+  +-------+  +-------+  +-------+
+-------+  +-------+  +-------+  +-------+
| Rising|  | Uni-  |  | Asym  |  | Cond- |
| Loss  |  | lat   |  | SNHL  |  | uctive|
| [img] |  | [img] |  | [img] |  | [img] |
+-------+  +-------+  +-------+  +-------+
```

**Recommendation:** Start with Option A (accordion list) for consistency with the existing app. Option B can be added later as an alternative view toggle. The data model supports both layouts.

### 3.3 Tab Structure (Within Page)

The page itself has **two tabs**:

```
[By Pattern]  [Quick Reference Matrix]
```

**Tab 1: By Pattern** — The accordion list / grid described above. Full clinical detail for each pattern.

**Tab 2: Quick Reference Matrix** — A dense comparison table showing all 12 patterns side by side across key dimensions:

| Pattern | Typical Degree | Transducer | Vent | Masking? | Referral? | Top Complaint |
|---------|---------------|------------|------|----------|-----------|---------------|
| Flat Mild-Mod | Mild-Mod | Open dome / Canal | Large-Open | Rarely | No | "Too loud" |
| Sloping HF | Mild-Severe | Open dome → Closed | Medium-Open | Sometimes | If asymmetric | "Can't hear in noise" |
| ... | ... | ... | ... | ... | ... | ... |

This matrix gives students a rapid-scan overview before diving into individual patterns.

---

## 4. Data Model

### 4.1 File Location

`src/data/audiogramPatternData.ts`

Follows the established convention: static typed data file co-located with other data files (`referralData.ts`, `complaintAdjustmentData.ts`, `earmoldData.ts`).

### 4.2 Interfaces

```typescript
// ---------------------------------------------------------------------------
// Audiogram Pattern Data — static clinical content for the Audiogram Patterns
// & Clinical Action reference page.
//
// All clinical content requires SME review before publication.
// ---------------------------------------------------------------------------

// --- Types ---

export type PatternCategory = 'SNHL' | 'Conductive' | 'Mixed' | 'Special';

export type UrgencyLevel = 'none' | 'routine' | 'priority' | 'urgent';

export interface AudiogramSignature {
  /** Prose description of the shape (e.g., "Thresholds between 25-55 dB HL...") */
  description: string;
  /** Typical threshold range at key frequencies, for rendering a schematic */
  typicalThresholds: {
    250: [number, number];   // [min, max] in dB HL
    500: [number, number];
    1000: [number, number];
    2000: [number, number];
    4000: [number, number];
    8000: [number, number];
  };
  /** Whether bone conduction differs from air conduction */
  airBoneGap: boolean;
  /** Key distinguishing features (e.g., "4 kHz notch", "flat configuration") */
  distinguishingFeatures: string[];
}

export interface FittingApproach {
  transducerChoice: string;
  earmoldCoupling: string;
  ventSize: string;
  prescriptiveTarget: string;
  keyFrequencyRegions: string;
  additionalConsiderations: string[];
}

export interface MaskingGuidance {
  /** Whether masking is typically needed for this pattern */
  typicallyNeeded: boolean;
  /** Explanation of when and why */
  explanation: string;
  /** Specific scenarios where masking becomes critical */
  criticalScenarios: string[];
}

export interface TradeoffItem {
  tradeoff: string;
  explanation: string;
}

export interface AdjustVsCounselItem {
  complaint: string;
  isAdjustment: boolean;
  isCounseling: boolean;
  rationale: string;
  action: string;
}

export interface ReferralGuidance {
  /** Whether this pattern ever warrants referral */
  referralPossible: boolean;
  /** Findings that would trigger referral */
  criteria: string[];
  /** Urgency if referral is warranted */
  urgency: UrgencyLevel;
  /** Where to refer */
  referTo: string;
}

export interface StudentMistake {
  mistake: string;
  consequence: string;
  correction: string;
}

export interface ClinicalPearl {
  pearl: string;
}

export interface AudiogramPattern {
  id: string;
  name: string;
  shortName: string;
  category: PatternCategory;
  prevalence: string;
  audiogramSignature: AudiogramSignature;
  typicalComplaints: string[];
  fittingApproach: FittingApproach;
  maskingGuidance: MaskingGuidance;
  tradeoffs: TradeoffItem[];
  adjustVsCounsel: AdjustVsCounselItem[];
  referralGuidance: ReferralGuidance;
  commonMistakes: StudentMistake[];
  clinicalPearls: ClinicalPearl[];
}

// --- Quick Reference Matrix row type ---

export interface PatternQuickRef {
  patternId: string;
  typicalDegree: string;
  transducer: string;
  vent: string;
  maskingNeeded: string;
  referralNeeded: string;
  topComplaint: string;
}

// --- Category metadata ---

export interface PatternCategoryMeta {
  category: PatternCategory;
  label: string;
  color: 'primary' | 'secondary' | 'warning' | 'error' | 'success' | 'info' | 'default';
}

export const PATTERN_CATEGORIES: readonly PatternCategoryMeta[] = [
  { category: 'SNHL', label: 'Sensorineural', color: 'primary' },
  { category: 'Conductive', label: 'Conductive', color: 'warning' },
  { category: 'Mixed', label: 'Mixed', color: 'secondary' },
  { category: 'Special', label: 'Special', color: 'info' },
];

export const ALL_PATTERN_CATEGORIES: readonly PatternCategory[] =
  PATTERN_CATEGORIES.map((c) => c.category);
```

### 4.3 Constant Shape

```typescript
export const AUDIOGRAM_PATTERNS: readonly AudiogramPattern[] = [
  { id: 'flat-mild-moderate', name: 'Flat Mild-Moderate SNHL', ... },
  { id: 'sloping-hf', name: 'Sloping High-Frequency SNHL', ... },
  // ... 12 total entries
];

export const PATTERN_QUICK_REF: readonly PatternQuickRef[] = [
  { patternId: 'flat-mild-moderate', typicalDegree: 'Mild-Moderate', ... },
  // ... 12 total entries, one per pattern
];
```

---

## 5. Component Structure

### 5.1 File Location

`src/pages/AudiogramPatternsPage.tsx`

### 5.2 Component Tree

```
AudiogramPatternsPage
  ├── Page header (Typography h4, subtitle)
  ├── Tabs (By Pattern | Quick Reference Matrix)
  ├── TabPanel: By Pattern
  │   ├── Search TextField
  │   ├── Category filter Chips (All | SNHL | Conductive | Mixed | Special)
  │   ├── Results count (when filtered)
  │   └── Pattern Accordions (one per pattern)
  │       └── PatternDetailCard
  │           ├── AudiogramSignatureSection
  │           │   ├── Description (Typography)
  │           │   ├── Distinguishing features (Chip list)
  │           │   └── Air-bone gap indicator (Chip)
  │           ├── TypicalComplaintsSection
  │           │   └── Complaint list (bulleted, each links to ComplaintAdjustmentsPage)
  │           ├── FittingApproachSection
  │           │   ├── Grid: Transducer | Coupling | Vent | Prescriptive Target
  │           │   ├── Key frequency regions callout
  │           │   └── Additional considerations list
  │           ├── MaskingSection
  │           │   ├── Needed indicator (Chip: Yes/Sometimes/Rarely)
  │           │   ├── Explanation
  │           │   └── Critical scenarios (Alert boxes)
  │           ├── TradeoffsSection
  │           │   └── Tradeoff cards (Paper, 2-col grid)
  │           ├── AdjustVsCounselSection
  │           │   └── Table: Complaint | Adjust? | Counsel? | Rationale | Action
  │           ├── ReferralSection
  │           │   ├── Referral indicator (Chip: None/Routine/Priority/Urgent)
  │           │   ├── Criteria list
  │           │   └── Link to Referrals page
  │           ├── CommonMistakesSection (Alert severity="warning")
  │           │   └── Mistake cards: Mistake | Consequence | Correction
  │           └── ClinicalPearlsSection (Alert severity="info")
  │               └── Pearl list
  └── TabPanel: Quick Reference Matrix
      └── TableContainer with all 12 patterns in a comparison table
```

### 5.3 MUI Components Used

Matching the established component palette across existing pages:

| Component | Usage | Source Pattern |
|-----------|-------|---------------|
| `Container`, `Paper` | Page wrapper | All pages |
| `Tabs`, `Tab` | Two-tab layout | ReferralsPage, EarmoldsPage, ComplaintAdjustmentsPage |
| `Accordion`, `AccordionSummary`, `AccordionDetails` | Pattern list | ComplaintAdjustmentsPage Tab 1 |
| `TextField` + `InputAdornment` (Search icon) | Pattern search | ComplaintAdjustmentsPage |
| `Chip` | Category filters, status indicators | ComplaintAdjustmentsPage, ReferralsPage (urgency chips) |
| `Card`, `CardContent` | Fitting approach, tradeoff cards | EarmoldsPage, ComplaintAdjustmentsPage Tab 4 |
| `Table`, `TableContainer`, `TableHead`, `TableBody`, `TableRow`, `TableCell` | Adjust vs Counsel table, Quick Ref matrix | ReferralsPage, EarmoldsPage |
| `Alert` | Masking critical scenarios, mistakes, pearls | All pages |
| `Divider` | Section separators within detail card | All pages |
| `Box` with grid layout | Multi-column layouts | All pages |
| `List`, `ListItem`, `ListItemIcon`, `ListItemText` | Criteria lists, complaint lists | ReferralsPage |
| `Link` (react-router) | Cross-links to other pages | Throughout app |

### 5.4 State Management

```typescript
const [activeTab, setActiveTab] = useState(0);
const [searchText, setSearchText] = useState('');
const [categoryFilter, setCategoryFilter] = useState<PatternCategory | 'All'>('All');
const [expandedPattern, setExpandedPattern] = useState<string | false>(false);
```

Matches the ComplaintAdjustmentsPage state pattern exactly.

---

## 6. Pattern Definitions

Each of the 12 patterns requires the following content. All clinical content requires SME review; content labeled "can be generated" uses established clinical knowledge but should still be verified.

---

### 6.1 Flat Mild-Moderate SNHL

**Audiogram Signature:**
- Thresholds between 25-55 dB HL across all frequencies (250-8000 Hz)
- Less than 10 dB variation between adjacent frequencies
- No air-bone gap (sensorineural)
- No significant asymmetry
- Distinguishing features: "Flat configuration," "No steep slope"

**Typical Patient Complaints:**
- "Everything sounds too loud" (over-amplification at initial fit)
- "My own voice sounds hollow/boomy" (occlusion effect with closed fittings)
- "I can hear but can't understand" (if WRS is reduced)
- "Hearing aids are annoying in quiet" (amplified ambient noise)
- "TV is still too quiet" (insufficient mid-frequency gain)

**Fitting Approach:**
- Transducer: BTE with custom mold or RIC with closed dome (depending on degree)
- Coupling: Canal mold or closed dome for mild end; half shell for moderate end
- Vent: Medium vent (2-2.5 mm) for mild; small vent or pressure vent for moderate
- Prescriptive target: NAL-NL2 or DSL v5 — follow target closely as flat loss responds well to prescriptive fitting
- Key frequency regions: Even gain across 250-4000 Hz; gain roughly proportional to loss at each frequency
- Additional: Consider starting at 80% of target for new users and increasing over 2-4 weeks

**Masking Requirements:**
- Typically needed: Rarely (for symmetric flat loss)
- Explanation: With symmetric thresholds and insert earphones (IA ~70 dB), masking is rarely needed because the signal doesn't exceed IA. With supra-aural phones (IA ~40 dB), masking may be needed at moderate levels.
- Critical scenarios: If loss is moderate (50+ dB) at any frequency with supra-aural phones; always needed for bone conduction testing

**Tradeoffs:**
1. Occlusion vs. gain: More occlusion (closed fitting) provides better low-frequency gain but the patient hears their own voice amplified. More open fitting reduces occlusion but sacrifices low-frequency amplification that the flat loss needs.
2. Acclimatization speed vs. satisfaction: Starting at full target provides better audibility but may overwhelm the patient. Starting lower is more comfortable but delays benefit.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Too loud overall" (week 1) | Possibly | Yes | Acclimatization is likely; but verify MPO | Counsel on adaptation timeline (2-4 weeks); reduce gain 3-5 dB only if significantly uncomfortable |
| "Own voice is hollow" | Yes | Yes | Occlusion effect is real and addressable | Increase vent size or switch to more open coupling; counsel that some own-voice change is normal |
| "Can hear but not understand" | Yes | No | Likely insufficient mid/high frequency gain | Increase 1-3 kHz gain; verify against target; check WRS |
| "Background noise too loud" | Possibly | Yes | Flat loss means all frequencies are amplified including noise | Counsel on realistic expectations; enable noise reduction; consider directional mics |

**Referral Criteria:**
- Referral possible: Only if asymmetric, sudden onset, or WRS disproportionately poor
- Criteria: Symmetric flat mild-moderate SNHL alone does not warrant referral
- Urgency: None (unless red flags present)

**Common Student Mistakes:**
1. **Mistake:** Fitting with wide-open venting because "it's only mild-moderate." **Consequence:** Insufficient low-frequency gain; patient reports speech sounds thin. **Correction:** Flat loss needs gain across ALL frequencies including lows; vent size must balance occlusion relief against LF gain needs.
2. **Mistake:** Not counseling about acclimatization. **Consequence:** Patient returns after 3 days saying "these are too loud" and student reduces gain to below-target levels. **Correction:** Always set expectations: "Your brain needs 2-4 weeks to adjust. Wear them consistently for gradually longer periods."
3. **Mistake:** Ignoring own-voice complaints as "just adaptation." **Consequence:** Patient stops wearing aids. **Correction:** Own-voice occlusion is a real acoustic phenomenon. Address it with venting, coupling changes, or own-voice processing features — don't dismiss it.

**Clinical Pearls:**
1. Flat losses are the "easiest" to fit but the hardest to satisfy — patients hear everything louder, including things they don't want to hear. Expectation management is critical.
2. If WRS is good (>88%), the patient should do well with properly fitted aids. If WRS is below expected, investigate further before attributing complaints to the fitting.
3. The most common reason a flat mild-moderate patient returns the aids is not the fitting — it's unmet expectations. Spend as much time counseling as fitting.

---

### 6.2 Sloping High-Frequency SNHL

**Audiogram Signature:**
- Normal or near-normal thresholds (0-25 dB HL) at 250-1000 Hz
- Progressive threshold elevation at 2000-8000 Hz (typically 40-75 dB at 4000-8000 Hz)
- Slope of 15+ dB per octave in the high frequencies
- No air-bone gap
- Distinguishing features: "Sloping configuration," "Normal lows, impaired highs"

**Typical Patient Complaints:**
- "I can hear people talking but can't understand what they're saying" (consonant perception loss)
- "Women and children are harder to understand than men"
- "I do fine one-on-one but struggle in groups/noise"
- "Sounds are muffled" (loss of high-frequency detail)
- "The hearing aids whistle" (feedback with open fitting at high gain)

**Fitting Approach:**
- Transducer: RIC strongly preferred (receiver-in-canal); BTE with thin tube acceptable
- Coupling: Open dome for mild-moderate slope; closed dome or custom mold if slope is steep (>60 dB at 4 kHz)
- Vent: Open or large vent to preserve natural low-frequency hearing; only restrict venting if feedback cannot be controlled
- Prescriptive target: NAL-NL2; critical to match target in 2-4 kHz range where consonant energy lives
- Key frequency regions: 1500-4000 Hz is the critical zone; minimal or no gain below 1000 Hz
- Additional: Feedback management system must be active; frequency lowering may be needed if loss exceeds 70 dB above 3 kHz

**Masking Requirements:**
- Typically needed: Sometimes
- Explanation: Low frequencies rarely need masking (thresholds are normal, so IA is not exceeded). High frequencies may need masking if asymmetric or if testing bone conduction.
- Critical scenarios: Bone conduction at all frequencies; air conduction at 2000-4000 Hz if loss exceeds 40 dB with supra-aural phones

**Tradeoffs:**
1. Open fit naturalness vs. high-frequency gain: Open domes sound natural and avoid occlusion but limit the maximum gain achievable at high frequencies before feedback. Closing the fit increases available gain but introduces occlusion.
2. Feedback control vs. audibility: Aggressive feedback cancellation can reduce feedback but may cause artifacts (chirping, warbling). Reducing high-frequency gain eliminates feedback but defeats the purpose of the fitting.
3. Frequency lowering benefit vs. sound quality: Frequency lowering (compression or transposition) can restore high-frequency cue perception but can make sounds unnatural, especially for music and environmental sounds.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Can't understand in noise" | Possibly | Yes | This is the fundamental challenge of HF loss; aids help but don't solve it | Enable directional mics, noise program; counsel on realistic expectations for noise; suggest communication strategies |
| "Whistling/feedback" | Yes | No | Acoustic feedback is a fitting problem | Check dome fit; try closed dome or custom mold; verify feedback manager; reduce HF gain only as last resort |
| "Sounds are too sharp/tinny" | Yes | Possibly | Over-emphasis of newly audible HF sounds | Reduce 3-6 kHz by 2-3 dB; counsel on adaptation ("sounds that were inaudible will seem loud at first") |
| "My own voice is fine" | No | No | Open fit correctly preserves natural own-voice perception | This is a sign the fitting is appropriate — no action needed |

**Referral Criteria:**
- Referral possible: If asymmetric (one ear slopes significantly more than the other)
- Criteria: Interaural asymmetry >= 15 dB at 3+ frequencies; disproportionately poor WRS
- Urgency: Routine to Priority depending on degree of asymmetry
- Refer to: ENT / Otologist

**Common Student Mistakes:**
1. **Mistake:** Adding low-frequency gain "to help them hear better." **Consequence:** Occlusion effect in an ear with normal low-frequency hearing; patient hears own voice booming. **Correction:** If low-frequency hearing is normal, do NOT amplify it. The audiogram tells you where the loss is.
2. **Mistake:** Choosing a closed dome immediately because of feedback. **Consequence:** Introducing occlusion for a patient who doesn't need LF gain, creating a new problem while solving feedback. **Correction:** Try feedback management algorithms first; try a larger closed dome or custom mold with large vent only if algorithms are insufficient.
3. **Mistake:** Underfitting the 2-3 kHz region. **Consequence:** Patient still can't understand speech clearly — the most important consonant energy lives at 2-3 kHz. **Correction:** Verify with REM that gain at 2-3 kHz matches prescriptive target. This is the single most important frequency region for speech intelligibility.

**Clinical Pearls:**
1. This is the most common audiogram pattern you will see in clinical practice. Master this fitting and you'll handle 40-50% of your caseload confidently.
2. The patient's primary complaint will almost always be about speech understanding in noise, not about hearing in quiet. Aids help most in quiet-to-moderate noise; they have fundamental limitations in high noise. Setting this expectation prevents returns.
3. If the patient says "I hear fine, my spouse just mumbles," they almost certainly have a sloping HF loss. The low-frequency vowels are audible (making speech detectable) but the high-frequency consonants are lost (making speech unintelligible).

---

### 6.3 Severe-Profound Flat SNHL

**Audiogram Signature:**
- Thresholds between 70-110+ dB HL across all frequencies
- Relatively flat configuration (less than 15 dB variation)
- No significant air-bone gap
- Distinguishing features: "Severe-profound range," "Flat," "May have no measurable response at some frequencies"

**Typical Patient Complaints:**
- "I still can't hear enough" (amplification limits with severe loss)
- "Everything sounds distorted" (cochlear distortion with severe damage)
- "Feedback/whistling is constant" (high gain + tight fitting = feedback risk)
- "Battery drains very fast" (high gain = high power consumption)
- "I'm exhausted by the end of the day" (listening fatigue from effortful processing)

**Fitting Approach:**
- Transducer: BTE with custom earmold (power BTE required); RIC only if ultra-power receiver available
- Coupling: Full shell earmold required for maximum seal
- Vent: No vent or pressure vent only (0-0.8 mm); any larger vent causes feedback at the gain levels needed
- Prescriptive target: DSL v5 may be preferred for maximizing audibility; NAL-NL2 is also appropriate. Ensure MPO is set appropriately — too low clips the signal, too high causes discomfort.
- Key frequency regions: Maximize gain across entire speech range (250-4000 Hz); focus on whatever frequencies still have measurable thresholds
- Additional: Assess CI candidacy if aided WRS < 50% in best-aided condition; frequency lowering strongly recommended if no measurable hearing above 2-3 kHz; FM/remote mic system essential for noise

**Masking Requirements:**
- Typically needed: Almost always
- Explanation: With thresholds at 70+ dB, presentation levels for air conduction will exceed IA for supra-aural phones at nearly every frequency. Insert earphones (IA ~70 dB) reduce masking need but are still needed for bone conduction.
- Critical scenarios: Every frequency during air conduction with supra-aural phones; all bone conduction testing; speech audiometry at suprathreshold levels

**Tradeoffs:**
1. Maximum gain vs. feedback control: Patient needs every dB of gain, but high gain drives feedback. Full shell with no vent is essential, and even then, feedback management must be aggressive.
2. Amplification vs. CI candidacy: Continuing to push hearing aid gain may delay CI evaluation that could provide better outcomes. Students should know when to discuss CI referral.
3. Comfort vs. audibility: Full shell molds with no vent cause maximum occlusion, ear canal sweating, and discomfort. But any acoustic compromise reduces already-marginal audibility.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Still can't hear enough" | Possibly | Yes | May be at technology limits | Verify gain matches target; counsel on realistic expectations; consider CI referral if aided WRS < 50% |
| "Sounds distorted" | Possibly | Yes | Cochlear distortion cannot be fixed with gain | Check MPO; reduce gain slightly if compression is over-processing; counsel that some distortion is inherent to severe cochlear damage |
| "Feedback constantly" | Yes | No | Fitting seal problem | Check earmold fit; consider remake; verify no cracks/tubing issues; review feedback manager settings |
| "Listening is exhausting" | No | Yes | Listening effort is expected with severe loss | Counsel on breaks; recommend FM systems for extended listening; suggest visual communication supplements |

**Referral Criteria:**
- Referral possible: For CI evaluation; or if sudden, asymmetric, or progressive
- Criteria: Aided WRS < 50% best-aided → CI candidacy evaluation; sudden change in thresholds → urgent ENT
- Urgency: Routine for CI evaluation; urgent for sudden changes
- Refer to: CI center / Otologist for candidacy; ENT for sudden changes

**Common Student Mistakes:**
1. **Mistake:** Using an open dome or vented mold "because the patient complained about occlusion." **Consequence:** Catastrophic feedback; gain cannot reach target; patient hears almost nothing. **Correction:** Severe-profound loss requires full shell with minimal or no venting. Address occlusion complaints with counseling and ensure proper fit, not by opening the fitting.
2. **Mistake:** Not discussing cochlear implant candidacy. **Consequence:** Patient remains with inadequate amplification when CI could provide significantly better outcomes. **Correction:** If best-aided WRS is below 50%, the student MUST discuss CI evaluation with the patient and supervising audiologist.
3. **Mistake:** Setting MPO too low to avoid loudness complaints. **Consequence:** Signal clipping; speech peaks are cut off; intelligibility drops. **Correction:** Set MPO to the patient's measured UCL; do not arbitrarily lower it.

**Clinical Pearls:**
1. These patients are often the most motivated and compliant. They know what it's like to not hear and they depend on their aids. The fitting is technically demanding but the patient relationship is often rewarding.
2. Always assess CI candidacy as part of best practice. This is not a failure of hearing aids — it's recognizing that the technology has limits and the patient deserves the best option.
3. Remote microphone systems (FM, Roger) provide more speech-in-noise benefit for severe-profound patients than any hearing aid feature. Recommend one for every severe-profound patient.

---

### 6.4 Cookie-Bite (Mid-Frequency Loss)

**Audiogram Signature:**
- Normal or near-normal thresholds at 250-500 Hz and 4000-8000 Hz
- Depressed thresholds in the 1000-2000 Hz range (typically 40-65 dB)
- Creates a "U" or cookie-bite shape on the audiogram
- Sensorineural (no air-bone gap)
- Distinguishing features: "Mid-frequency dip," "U-shaped," "Normal lows and highs, impaired mids"

**Typical Patient Complaints:**
- "Speech sounds distorted" (loss in critical speech frequency region)
- "I can hear sounds but they don't sound right"
- "My own voice sounds strange" (complex interaction with occlusion)
- "Music sounds off-key or hollow"
- "Hearing aids make everything sound unnatural"

**Fitting Approach:**
- Transducer: RIC or BTE with custom mold
- Coupling: Canal mold or closed dome — need to deliver mid-frequency gain without amplifying already-normal lows and highs
- Vent: Medium vent to allow normal low-frequency and high-frequency hearing to pass through; venting critical to avoid over-amplifying normal regions
- Prescriptive target: NAL-NL2; the prescriptive formula will naturally prescribe gain only where needed (mid-frequencies); verify that gain at 250-500 Hz and 4000+ Hz is minimal or zero
- Key frequency regions: 750-3000 Hz is the target zone; 250-500 Hz and 4000+ Hz should receive minimal gain
- Additional: Compression ratios may need to be lower (1.2-1.5:1) in the mid-frequencies to preserve naturalness; wideband compression can distort the spectral shape

**Masking Requirements:**
- Typically needed: Depends on degree of mid-frequency loss
- Explanation: If mid-frequency thresholds exceed 40 dB with supra-aural phones, masking may be needed at those frequencies. Low and high frequencies with normal thresholds rarely need masking.
- Critical scenarios: Bone conduction at 1000-2000 Hz; air conduction at 1000-2000 Hz if loss >40 dB with supra-aural phones

**Tradeoffs:**
1. Mid-frequency gain vs. naturalness: The patient needs gain in the mid-frequencies but adding it changes the tonal quality of everything. Mid-frequency gain applied broadly sounds "robotic" or "tinny."
2. Preserving normal hearing vs. providing consistent amplification: Normal lows and highs should pass through unamplified, but hearing aid processing may alter these regions slightly. Channel-specific gain control is essential.
3. Compression accuracy vs. simplicity: Independent compression in the mid-frequency channels is needed, but too many channels with different compression ratios creates artifacts at channel boundaries.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Sounds unnatural/robotic" | Yes | Yes | Likely over-amplification in transition frequencies between normal and impaired | Check gain at 500 Hz and 3-4 kHz — should be near zero; smooth the gain curve transitions; counsel on adaptation |
| "Speech distorted" | Yes | Possibly | May need fine-tuning in 1-2 kHz range | Verify gain matches prescriptive target in the mid-frequencies specifically; adjust in 2-3 dB steps |
| "Own voice sounds weird" | Yes | Yes | Complex interaction — own voice has strong mid-frequency energy | Adjust mid-frequency gain and venting; counsel that own-voice perception changes are expected |
| "Music sounds hollow" | Possibly | Yes | Mid-frequency emphasis can change musical timbre | Consider music program with wider bandwidth and less compression; counsel on hearing aid vs. acoustic listening for music |

**Referral Criteria:**
- Referral possible: Cookie-bite patterns are occasionally hereditary; no urgent referral unless asymmetric or progressive
- Criteria: If pattern is progressive (worsening over time), refer for genetic counseling consideration
- Urgency: Routine
- Refer to: ENT / genetic counselor if progressive or family history suggests hereditary component

**Common Student Mistakes:**
1. **Mistake:** Applying broadband gain instead of frequency-specific gain. **Consequence:** Normal low-frequency and high-frequency hearing is over-amplified; patient reports "everything sounds wrong." **Correction:** Only amplify where the loss is. Verify with REM that gain at 250-500 Hz and 4000+ Hz is near zero.
2. **Mistake:** Using an open dome because low-frequency hearing is normal. **Consequence:** The open dome vents out the mid-frequency gain the patient needs. **Correction:** A closed dome or custom mold with a medium vent provides the seal needed to deliver mid-frequency gain while venting some low-frequency energy.
3. **Mistake:** Dismissing the patient's "sounds strange" complaints as adaptation. **Consequence:** Patient abandons aids. **Correction:** Cookie-bite fittings genuinely sound unusual because the gain profile is unusual. Fine-tuning is expected and multiple adjustment visits are normal.

**Clinical Pearls:**
1. Cookie-bite losses are relatively rare (~5% of sensorineural losses) and notoriously difficult to fit. Expect more follow-up visits than average. This is not a failure of the student — it's the nature of the loss.
2. These patients often report that "something isn't right" even when REM shows gain on target. Consider reducing gain to 80-90% of target in the mid-frequencies and increasing gradually. The brain needs time to adapt to the unusual amplification profile.
3. If the cookie-bite is hereditary (ask about family history), the patient may already have developed compensatory listening strategies. Work with these rather than against them.

---

### 6.5 Rising Loss (Better High Frequencies)

**Audiogram Signature:**
- Poorer thresholds at 250-1000 Hz (typically 40-65 dB HL)
- Better thresholds at 2000-8000 Hz (typically 10-30 dB HL)
- Creates a "reverse slope" or rising configuration
- Sensorineural (no air-bone gap)
- Distinguishing features: "Reverse slope," "Low-frequency loss," "Rising configuration"

**Typical Patient Complaints:**
- "I hear fine in quiet but men's voices are hard to follow" (low-frequency vowel energy carries male voice fundamental)
- "My own voice is incredibly boomy/loud" (severe occlusion effect because significant low-frequency amplification is needed)
- "Music sounds thin/tinny" (missing bass/warmth from low-frequency loss)
- "Environmental sounds are too sharp/bright" (high frequencies are near-normal but low frequencies are muffled)
- "I have a hard time with phone calls" (telephone bandwidth emphasizes mid-low frequencies)

**Fitting Approach:**
- Transducer: BTE with custom mold strongly recommended; RIC can work if receiver can deliver adequate low-frequency output
- Coupling: Full shell or half shell — need a sealed fitting to deliver low-frequency amplification without it leaking out of the ear canal
- Vent: Minimal or no vent — any vent directly undermines the low-frequency gain this patient needs. Pressure vent only if absolutely necessary for comfort.
- Prescriptive target: NAL-NL2 or DSL v5; verify that prescriptive software is not under-prescribing low-frequency gain (some algorithms de-emphasize lows); REM verification at 250-1000 Hz is critical
- Key frequency regions: 250-1000 Hz is the primary amplification target; 2000+ Hz needs little to no gain
- Additional: Own-voice processing features are essential; occlusion management is the primary fitting challenge; consider deep-canal fitting to reduce occlusion effect

**Masking Requirements:**
- Typically needed: Often for low frequencies
- Explanation: Significant low-frequency loss (50+ dB at 250-500 Hz) with supra-aural phones (IA ~40 dB) means masking is frequently needed at 250-1000 Hz. High frequencies with near-normal thresholds rarely need masking.
- Critical scenarios: Air conduction at 250-500 Hz if loss >40 dB with supra-aural phones; all bone conduction at low frequencies

**Tradeoffs:**
1. Low-frequency gain vs. occlusion: The patient needs maximum low-frequency gain, but delivering it requires a sealed fitting that maximizes occlusion. This is the central challenge — the very frequencies the patient needs amplified are the same ones that cause occlusion discomfort.
2. Sealed fit vs. comfort: Full shell with no vent is acoustically ideal but may be uncomfortable. Any vent leaks the low-frequency gain the patient depends on.
3. Natural high-frequency hearing vs. processing artifacts: High-frequency hearing is near-normal, but hearing aid processing may degrade it. Ensure high-frequency gain is near zero.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Own voice is unbearably loud/boomy" | Yes | Yes | Occlusion effect is severe and real | Consider deep-fit custom mold; activate own-voice processing; discuss trade-off honestly: "reducing occlusion means less benefit from low-frequency gain" |
| "Men's voices are still hard to understand" | Yes | No | Likely insufficient low-frequency gain | Increase gain at 250-750 Hz; verify with REM; check that vent is not too large |
| "Music sounds tinny" | Yes | Possibly | Missing low-frequency amplification for bass | Increase 250-500 Hz gain; create music program with enhanced LF; counsel that bass perception will improve with adaptation |
| "Sounds too bright/sharp" | Yes | No | High-frequency gain applied where not needed | Verify that gain above 2000 Hz is near zero; reduce if not |

**Referral Criteria:**
- Referral possible: Rising losses can be associated with Meniere's disease (fluctuating low-frequency SNHL) or other conditions
- Criteria: If loss is fluctuating, associated with episodic vertigo, or has tinnitus and aural fullness → refer for Meniere's evaluation
- Urgency: Priority if vestibular symptoms present; routine otherwise
- Refer to: ENT / Neurotology

**Common Student Mistakes:**
1. **Mistake:** Using an open fitting because "the high frequencies are normal." **Consequence:** All the low-frequency gain escapes through the vent; patient gets no benefit. **Correction:** The open fitting is for preserving normal LOW-frequency hearing. In a rising loss, the LOW frequencies are impaired. This patient needs a CLOSED fitting.
2. **Mistake:** Dismissing occlusion complaints because "the fitting has to be sealed." **Consequence:** Patient rejects aids. **Correction:** Occlusion is the #1 fitting challenge for rising loss. Use deep-fit molds, own-voice processing, and honest counseling. Don't dismiss it.
3. **Mistake:** Applying the "typical" hearing aid gain shape (more gain in highs). **Consequence:** Amplifying normal high frequencies while under-amplifying impaired low frequencies. **Correction:** Follow the prescriptive formula — it will correctly prescribe gain where the loss is, not where "hearing aid gain usually goes."

**Clinical Pearls:**
1. Rising losses are rare (~3-5% of SNHL cases) and many students have never seen one in clinic. The fitting approach is nearly the opposite of the more common sloping loss. Don't apply sloping-loss intuitions to a rising loss.
2. If the low-frequency loss fluctuates visit to visit, strongly suspect Meniere's disease and prioritize the referral. The hearing aid fitting should be secondary to the medical diagnosis.
3. Deep canal fittings (extending the mold or receiver deeper into the bony portion of the canal) can dramatically reduce occlusion effect because they bypass the vibrating cartilaginous portion. Consider this when standard fittings produce intolerable occlusion.

---

### 6.6 Unilateral Hearing Loss (One Normal Ear)

**Audiogram Signature:**
- One ear: Normal thresholds (0-20 dB HL) across all frequencies
- Other ear: Any degree/configuration of hearing loss
- Clear interaural asymmetry
- Distinguishing features: "Unilateral," "One normal ear," "Single-sided"

**Typical Patient Complaints:**
- "I can't tell where sounds are coming from" (localization deficit)
- "I can't hear people on my bad side" (head shadow effect)
- "I do fine one-on-one but struggle in groups" (loss of binaural advantage for speech in noise)
- "I'm always repositioning to put my good ear toward the speaker"
- "I feel unbalanced" (auditory spatial perception asymmetry)

**Fitting Approach:**
- Transducer: Depends on impaired ear's degree — if aidable: RIC or BTE on impaired ear. If unaidable (profound/dead ear): CROS/BiCROS system or bone-anchored hearing aid (BAHA/Osia)
- Coupling: Per degree of loss in impaired ear (see other pattern guides)
- Vent: Per degree of loss in impaired ear; normal ear remains unfitted (or receives CROS receiver)
- Prescriptive target: Monaural fitting on impaired ear; for CROS, goal is to route sound from impaired side to normal ear
- Key frequency regions: Depends on impaired ear's configuration
- Additional: CROS/BiCROS assessment if impaired ear WRS < 40%; bone-anchored device if unaidable ear and patient wants localization benefit. Counsel heavily on limitations of monaural hearing and strategies.

**Masking Requirements:**
- Typically needed: Almost always
- Explanation: Testing the impaired ear requires masking in the normal ear at nearly every frequency and for both air and bone conduction. The normal ear's sensitivity (0-20 dB) means signals cross over and produce responses from the wrong ear very easily.
- Critical scenarios: Every threshold in the impaired ear needs masking verification; bone conduction masking is essential; WRS testing of the impaired ear requires masking of the normal ear

**Tradeoffs:**
1. Conventional aid vs. CROS: A conventional aid on the impaired ear amplifies residual hearing in that ear. A CROS routes all sound from the impaired side to the normal ear. The patient must choose which approach better matches their daily life.
2. Localization vs. awareness: A CROS improves awareness of sounds from the impaired side but does NOT restore localization. Conventional aid on the impaired ear may provide some interaural timing cues if hearing is aidable.
3. Cost/complexity vs. benefit: CROS and bone-anchored systems are more expensive and complex than monaural fitting. The benefit may be marginal if the patient's primary listening situation is one-on-one in quiet.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Can't localize sounds" | No | Yes | Monaural hearing cannot localize accurately; this is a physiological limitation | Counsel on head-turning strategy and environmental awareness; discuss bone-anchored options if severe |
| "Can't hear on my bad side" | Possibly | Yes | If aidable: amplification helps. If not: CROS may help | Assess WRS in impaired ear; if aidable, fit conventionally; if not, trial CROS system |
| "Struggle in group conversation" | No | Yes | Loss of binaural squelch effect; fundamental limitation | Counsel on seating strategies; recommend remote mic for important group settings |
| "The hearing aid on my bad ear doesn't help enough" | Possibly | Yes | May need CROS/BiCROS instead | Re-evaluate aided benefit; if WRS < 40% in impaired ear, conventional aid has limited value — discuss CROS |

**Referral Criteria:**
- Referral possible: YES — unilateral SNHL always warrants investigation
- Criteria: Any unilateral SNHL without known cause (noise exposure, trauma, surgery) should be referred to rule out acoustic neuroma/vestibular schwannoma
- Urgency: Priority (2-4 weeks); urgent if sudden onset
- Refer to: ENT / Otologist for MRI with gadolinium

**Common Student Mistakes:**
1. **Mistake:** Forgetting to mask the normal ear during testing. **Consequence:** Cross-hearing produces false thresholds — the "impaired ear" appears better than it actually is because the normal ear is responding. **Correction:** Unilateral loss = masking at EVERY frequency for EVERY test type. No exceptions.
2. **Mistake:** Fitting a conventional hearing aid on a dead ear. **Consequence:** The ear has no usable hearing; the aid provides no benefit; the patient is frustrated. **Correction:** Check WRS first. If WRS < 40% even with amplification, conventional amplification is inappropriate. Discuss CROS/BiCROS or bone-anchored options.
3. **Mistake:** Not referring for medical evaluation. **Consequence:** Potentially missing a vestibular schwannoma. **Correction:** Every unilateral SNHL without a clear cause (e.g., documented noise exposure, prior surgery) requires ENT referral. This is non-negotiable.

**Clinical Pearls:**
1. Always ask "When did this start?" and "Was it sudden?" A sudden unilateral loss is a medical emergency — the patient should be seen by ENT within 24-48 hours for possible steroid treatment.
2. The head shadow effect reduces the signal reaching the impaired ear by 6-15 dB depending on frequency. Even a perfectly fitted hearing aid on the impaired side cannot overcome this in all situations. Set expectations accordingly.
3. For children with unilateral loss, classroom amplification (FM/remote mic) is more impactful than any hearing aid. The educational implications of missing one side of classroom discussion are significant. Prioritize the FM recommendation.

---

### 6.7 Asymmetric SNHL (Both Ears Affected, 15+ dB Difference at 3+ Frequencies)

**Audiogram Signature:**
- Both ears have SNHL, but thresholds differ by >= 15 dB at 3 or more frequencies
- No air-bone gap in either ear
- The poorer ear may have any configuration (flat, sloping, etc.)
- Distinguishing features: "Asymmetric," "Both ears impaired but different degrees"

**Typical Patient Complaints:**
- "One ear works much better than the other with hearing aids"
- "I feel like the sound is all coming from one side"
- "The hearing aid in my worse ear is too loud / not loud enough"
- "I can't understand speech unless I turn my good ear toward the speaker"
- "Music sounds unbalanced"

**Fitting Approach:**
- Transducer: Bilateral fitting strongly recommended; choose transducer per each ear's degree of loss independently
- Coupling: Per each ear's degree — may have open dome on better ear and closed mold on poorer ear
- Vent: Per each ear's degree — larger vent on better ear, smaller on poorer ear
- Prescriptive target: Fit each ear to prescriptive target independently; consider bilateral loudness summation (~3-6 dB bilateral advantage); balance aided output between ears for natural binaural perception
- Key frequency regions: Per each ear's configuration; pay special attention to the frequency regions where the asymmetry is greatest
- Additional: Address binaural loudness balance — patient may need different gain adjustments in each ear to achieve subjective balance. Binaural coordination features should be enabled if available. Consider CROS/BiCROS if poorer ear is unaidable.

**Masking Requirements:**
- Typically needed: Yes, frequently
- Explanation: The interaural threshold difference means that testing the poorer ear risks cross-hearing to the better ear. The larger the asymmetry, the more critical masking becomes.
- Critical scenarios: Air conduction testing of the poorer ear at frequencies where the asymmetry exceeds IA; bone conduction at all frequencies for both ears; WRS testing of the poorer ear

**Tradeoffs:**
1. Binaural balance vs. prescriptive accuracy: Setting each ear to prescriptive target may create a large loudness imbalance because the ears have different degrees of loss. The patient perceives one side as dominant. Reducing gain in the better ear to match the poorer ear sacrifices audibility. Increasing gain in the poorer ear beyond target may cause distortion.
2. Bilateral fitting vs. monaural fitting: If the poorer ear's WRS is very low (<40%), adding a hearing aid may degrade overall speech understanding (binaural interference). In rare cases, monaural fitting of the better ear alone may produce better outcomes.
3. CI candidacy for poorer ear: If the poorer ear has severe-profound loss with poor WRS, CI in that ear + hearing aid in the better ear (bimodal fitting) may be the best option.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "One side is much louder than the other" | Yes | Yes | Real perceptual difference due to asymmetric loss | Adjust bilateral balance; may need to reduce better-ear gain slightly or increase poorer-ear gain; counsel that perfect balance is difficult with asymmetric loss |
| "Worse ear's aid doesn't help" | Possibly | Yes | May have reached amplification limits for that ear | Check aided WRS in poorer ear; if < 40%, consider CROS/BiCROS; counsel on realistic expectations |
| "Sound image pulls to one side" | Yes | Yes | Interaural loudness imbalance | Use bilateral balance adjustment; counsel that spatial hearing requires two functioning ears at similar levels |
| "Can't understand in noise with both aids" | Possibly | Yes | Asymmetric input degrades binaural processing advantage | Optimize both aids; verify directional mics; counsel on fundamental binaural advantage limitations with asymmetric loss |

**Referral Criteria:**
- Referral possible: YES — asymmetric SNHL is a primary referral indicator
- Criteria: Interaural asymmetry >= 15 dB at 3+ frequencies or >= 20 dB at 2+ frequencies, in the absence of a known cause
- Urgency: Priority (2-4 weeks)
- Refer to: ENT / Otologist for MRI to rule out vestibular schwannoma

**Common Student Mistakes:**
1. **Mistake:** Fitting only the better ear. **Consequence:** Patient loses binaural benefit (localization, squelch, summation). **Correction:** Always trial bilateral fitting unless the poorer ear's WRS is so poor that it creates binaural interference.
2. **Mistake:** Not referring for medical evaluation. **Consequence:** Potentially missing vestibular schwannoma. **Correction:** Asymmetric SNHL without a known cause REQUIRES referral. Fit hearing aids if appropriate, but the referral is non-negotiable.
3. **Mistake:** Using the same programming for both ears. **Consequence:** Under-fitting one ear and over-fitting the other. **Correction:** Each ear is fitted independently to its own prescriptive target. The coupling, vent, and gain are determined by each ear's audiogram, not by the other ear.

**Clinical Pearls:**
1. Always test WRS independently in each ear with appropriate masking. The poorer ear's WRS is the single most important piece of information for determining whether bilateral fitting is appropriate.
2. If the asymmetry is progressive (getting worse over time), the referral urgency increases. Document thresholds at each visit and compare to detect progression.
3. Patients with asymmetric loss often benefit significantly from remote microphone systems because these overcome the head shadow effect and channel speech directly to both aids.

---

### 6.8 Conductive Loss (Air-Bone Gap Present)

**Audiogram Signature:**
- Air conduction thresholds elevated (25-60+ dB HL, depending on degree)
- Bone conduction thresholds normal or near-normal (0-20 dB HL)
- Air-bone gap >= 10 dB at one or more frequencies
- Gap indicates pathology in outer/middle ear rather than cochlea
- Distinguishing features: "Air-bone gap," "Normal bone conduction," "Conductive component"

**Typical Patient Complaints:**
- "Everything sounds muffled, like there's cotton in my ears"
- "I can hear my own voice very loudly" (bone conduction of own voice is normal; the relative difference is stark)
- "Sounds are quiet but not distorted" (cochlea is intact; the issue is sound transmission)
- "I hear better in noise than most people" (background noise is attenuated by the conductive component; speech through amplification reaches the intact cochlea)
- "Pressure in my ears" (if middle ear pathology involves effusion or ETD)

**Fitting Approach:**
- Transducer: First priority: MEDICAL REFERRAL. Conductive loss may be medically or surgically treatable. Only fit after medical clearance or if patient declines surgery.
- Coupling: If fitting after medical clearance — per degree of air conduction loss; bone-anchored hearing aid (BAHA/Osia) is an alternative that bypasses the conductive mechanism entirely
- Vent: If fitting with conventional aid — per air conduction thresholds; if fitting with bone-anchored device — no coupling needed (direct bone stimulation)
- Prescriptive target: Prescriptive fitting based on air conduction thresholds; the cochlea is normal, so the patient's WRS should be excellent with proper amplification
- Key frequency regions: Per the air conduction configuration; often the gap is largest at low frequencies
- Additional: Bone-anchored hearing devices bypass the conductive component entirely and are often the best option for chronic conductive loss that is not surgically correctable

**Masking Requirements:**
- Typically needed: YES — masking is critical for conductive losses
- Explanation: Bone conduction thresholds must be measured with masking to confirm they are truly normal. Without masking, bone conduction responses could be from either ear (BC IA is ~0 dB). Additionally, the air-bone gap itself changes the masking calculation — occlusion effect must be accounted for when masking with supra-aural transducers.
- Critical scenarios: ALL bone conduction testing (BC IA = 0 dB, masking is always needed); air conduction of poorer ear if bilateral and asymmetric; the masking dilemma can occur when air-bone gaps are large in both ears

**Tradeoffs:**
1. Medical/surgical treatment vs. amplification: Surgery (e.g., stapedectomy for otosclerosis, tympanoplasty for TM perforation) may restore hearing without need for amplification. But surgery has risks. The patient and ENT make this decision — the audiologist's role is to ensure the patient is informed and referred.
2. Conventional aid vs. bone-anchored device: Conventional aids amplify sound through the impaired conductive pathway. Bone-anchored devices bypass it entirely. For chronic conductive loss, bone-anchored is often superior but requires surgery.
3. Fitting before vs. after medical treatment: If the patient has treatable pathology, fitting hearing aids first creates dependency and delays treatment. But if the patient is waiting months for surgery, temporary amplification may be appropriate.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Still sounds muffled with aids" | Yes | No | Likely insufficient gain to bridge the air-bone gap | Increase overall gain; verify with REM that aided output matches prescriptive target; check for cerumen or middle ear changes |
| "Own voice is too loud with aids" | Yes | Yes | Occlusion effect is especially problematic in conductive loss | Increase vent if possible; counsel that own-voice loudness is due to normal bone conduction in the presence of muffled air conduction |
| "Ear feels full/pressure" | No | Yes (+ consider re-refer) | May be middle ear pathology, not fitting issue | Do not adjust — this is a medical symptom. Re-evaluate tympanometry; consider re-referral to ENT if aural fullness is new or worsening |
| "Hearing seems to fluctuate" | No | Yes (+ re-refer) | Fluctuating conductive loss suggests active middle ear pathology | Urgent re-referral to ENT; do not adjust aids based on fluctuating presentation — address the underlying cause |

**Referral Criteria:**
- Referral possible: YES — conductive loss REQUIRES medical evaluation before fitting
- Criteria: Any conductive hearing loss (air-bone gap >= 10 dB) without prior medical clearance must be referred to ENT
- Urgency: Routine (4-6 weeks) unless accompanied by active drainage (urgent), pain (priority), or sudden onset (urgent)
- Refer to: ENT / Otologist

**Common Student Mistakes:**
1. **Mistake:** Fitting hearing aids without medical referral/clearance. **Consequence:** Potentially treatable medical condition goes unaddressed; possible medicolegal liability. **Correction:** ALWAYS refer conductive loss for medical evaluation before fitting. The ONLY exception is if the patient has already been evaluated and cleared by ENT.
2. **Mistake:** Forgetting to account for occlusion effect in masking calculations. **Consequence:** Under-masking during bone conduction testing; false bone conduction thresholds; incorrect air-bone gap measurement. **Correction:** When masking with supra-aural headphones during BC testing, add the occlusion effect (OE) to the starting effective masking level at 250-1000 Hz. Insert earphones eliminate OE.
3. **Mistake:** Assuming the loss is permanent without checking. **Consequence:** Fitting aids for what turns out to be a temporary conductive component (e.g., middle ear effusion). **Correction:** Conductive loss can be transient. Verify the loss is stable before fitting. If uncertain, retest in 2-4 weeks.

**Clinical Pearls:**
1. Patients with conductive loss often do remarkably well with amplification because their cochlea is intact. WRS should be near 100% if adequate audibility is achieved. If WRS is poor, suspect a mixed component.
2. The "hearing better in noise" phenomenon (paracusis of Willis) is characteristic of conductive loss and can be a useful diagnostic clue. If a patient says "I hear better at parties than at home," think conductive.
3. For chronic ear conditions (e.g., chronic otitis media with draining ears), bone-anchored devices are often the best option because conventional molds can trap moisture and exacerbate the condition.

---

### 6.9 Mixed Loss (SNHL + Conductive Component)

**Audiogram Signature:**
- Air conduction thresholds elevated (often 40-80+ dB HL)
- Bone conduction thresholds also elevated but better than air (20-60 dB HL)
- Air-bone gap present (>= 10 dB at one or more frequencies)
- Both cochlear damage AND outer/middle ear pathology
- Distinguishing features: "Air-bone gap WITH elevated bone conduction," "Both components impaired"

**Typical Patient Complaints:**
- Combination of conductive and sensorineural complaints
- "Everything is very quiet AND unclear" (both volume and clarity affected)
- "Sounds are muffled and distorted"
- "I need the TV very loud and even then I miss words"
- "Ear feels full and I can't hear well" (if active middle ear pathology)

**Fitting Approach:**
- Transducer: MEDICAL REFERRAL FIRST for the conductive component. After clearance: BTE with custom mold for moderate-severe; consider bone-anchored device if conductive component is chronic
- Coupling: Per air conduction degree — typically half shell or full shell due to overall severity
- Vent: Per air conduction degree; small or no vent likely due to overall loss severity
- Prescriptive target: Fit to air conduction thresholds; note that resolving the conductive component (medically/surgically) would change the prescriptive target — the fitting may need to be revised post-treatment
- Key frequency regions: Per the air conduction configuration; gain needs are driven by the total loss (air conduction), not just the sensorineural component
- Additional: If the conductive component can be treated, the residual SNHL determines the long-term fitting needs. Post-treatment re-evaluation is essential. WRS will be limited by the sensorineural component even if the conductive component is resolved.

**Masking Requirements:**
- Typically needed: YES — critical
- Explanation: Mixed loss combines the masking challenges of both conductive and sensorineural loss. Bone conduction thresholds must be established with masking. The air-bone gap in the test ear affects masking calculations. The masking dilemma is more likely with bilateral mixed loss.
- Critical scenarios: All bone conduction testing; air conduction of the poorer ear; WRS testing; the masking dilemma may be encountered if both ears have significant air-bone gaps

**Tradeoffs:**
1. Treat conductive component first vs. fit aids now: Ideally, treat the conductive component to reveal the true sensorineural floor, then fit to the residual loss. But treatment may take months. Fitting aids to the current air conduction loss provides immediate benefit.
2. Amplification level: The total loss (air conduction) determines current gain needs, but if the conductive component resolves, the patient will be over-amplified. Plan for re-programming.
3. Bone-anchored vs. conventional: Bone-anchored devices bypass the conductive component and deliver sound directly to the cochlea. Effective for the conductive portion but still limited by the sensorineural portion.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Still too quiet" | Yes | No | Gain likely insufficient for the overall loss severity | Increase gain; verify with REM against air conduction-based targets |
| "Sounds unclear/distorted" | Possibly | Yes | Distortion is from the sensorineural component and has limits | Optimize gain; counsel that clarity is limited by the inner ear damage, which amplification cannot fully correct |
| "Ear feels full/blocked" | No | Yes (+ re-refer) | May indicate active middle ear pathology | Do not adjust hearing aids — refer back to ENT for middle ear re-evaluation |
| "Hearing fluctuates" | No | Yes (+ re-refer) | The conductive component may be changing | Re-refer to ENT; retest hearing; do not adjust aids until stable |

**Referral Criteria:**
- Referral possible: YES — mandatory for the conductive component
- Criteria: Any air-bone gap without prior medical clearance requires ENT referral
- Urgency: Per the conductive component findings (see Conductive Loss pattern); higher urgency if drainage, pain, or sudden onset
- Refer to: ENT / Otologist

**Common Student Mistakes:**
1. **Mistake:** Fitting to bone conduction thresholds instead of air conduction. **Consequence:** Dramatic under-amplification; patient hears almost nothing. **Correction:** Prescriptive fitting uses AIR conduction thresholds because the hearing aid signal travels through the air conduction pathway.
2. **Mistake:** Not re-evaluating after medical treatment. **Consequence:** Patient is over-amplified after surgery/treatment resolves the conductive component. **Correction:** Schedule re-evaluation and re-programming 4-6 weeks after medical treatment.
3. **Mistake:** Encountering the masking dilemma and giving up. **Consequence:** Bone conduction thresholds are not established; the air-bone gap is unknown; the loss type is misclassified. **Correction:** Use insert earphones to increase IA (reduces masking dilemma); use the SAL test or ABR for bone conduction estimation if masking dilemma is truly unavoidable.

**Clinical Pearls:**
1. The sensorineural component sets the ceiling for how well the patient can ever do. Even if the conductive component is completely resolved, the remaining SNHL will still require management. Help the patient understand this.
2. Mixed losses often produce the masking dilemma in clinical practice. This is the scenario where classroom masking theory meets real-world limitations. Use insert earphones whenever possible to minimize the problem.
3. A mixed loss that was previously purely conductive suggests disease progression. Document carefully and communicate the change to the referring physician.

---

### 6.10 Normal Thresholds with Poor WRS (Retrocochlear Suspicion)

**Audiogram Signature:**
- Pure tone thresholds within normal limits or mildly elevated (0-30 dB HL)
- WRS disproportionately poor for the degree of loss (e.g., WRS 50-70% with PTA of 15-25 dB)
- May show rollover (WRS decreases at higher presentation levels)
- Acoustic reflexes may be absent, elevated, or show decay
- Distinguishing features: "Normal PTA, poor WRS," "Retrocochlear pattern," "PTA-WRS discrepancy"

**Typical Patient Complaints:**
- "I can hear that someone is talking but I can't make out the words" (classic retrocochlear complaint)
- "Conversations sound garbled" (neural timing disruption)
- "I hear fine in quiet but it falls apart in any noise" (loss of binaural processing)
- "One ear seems weaker even though the test looks normal" (subjective awareness of neural compromise)
- "I have constant ringing in one ear" (tinnitus, often unilateral)

**Fitting Approach:**
- Transducer: DO NOT FIT HEARING AIDS UNTIL MEDICAL EVALUATION IS COMPLETE. This pattern requires medical referral first.
- Coupling: N/A until post-evaluation
- Vent: N/A
- Prescriptive target: N/A — hearing aids are generally not effective for retrocochlear pathology because the problem is neural, not cochlear or conductive
- Key frequency regions: N/A
- Additional: If medical evaluation is clear (no tumor, auditory processing disorder confirmed), consider auditory rehabilitation, FM/remote mic systems for noise, and communication strategies. Amplification may be trialed but expectations must be carefully managed — it will amplify the signal but cannot repair neural timing.

**Masking Requirements:**
- Typically needed: Yes, for WRS testing
- Explanation: WRS in each ear must be measured independently with masking of the non-test ear to confirm that the poor score is not a cross-hearing artifact.
- Critical scenarios: WRS testing at suprathreshold levels; rollover testing (testing at multiple presentation levels requires masking at each level)

**Tradeoffs:**
1. Further testing vs. immediate referral: Additional audiologic tests (acoustic reflex decay, ABR) can strengthen the referral, but should not delay it. If WRS is disproportionately poor, refer even without additional test results.
2. Hearing aid trial vs. no fitting: After medical clearance, a hearing aid trial may be attempted, but success rates are low for retrocochlear pathology. Setting expectations is essential.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Can hear but can't understand" | No | Yes (+ REFER) | This is the hallmark of retrocochlear pathology — REFER FIRST | Medical referral is the primary action; counsel that this pattern needs investigation; do not attempt to solve with amplification |
| "Ringing in one ear" | No | Yes (+ REFER) | Unilateral tinnitus is a referral indicator | Refer to ENT; the tinnitus evaluation is part of the retrocochlear workup |
| "Struggling in noise" | No | Yes | Neural timing disruption limits noise processing | After medical clearance: recommend FM/remote mic; communication strategies; auditory rehabilitation |

**Referral Criteria:**
- Referral possible: YES — this pattern REQUIRES referral
- Criteria: WRS disproportionately poor for PTA; rollover present; unilateral tinnitus
- Urgency: Priority (2-4 weeks); urgent if accompanied by sudden changes, vertigo, or facial nerve symptoms
- Refer to: ENT / Otologist / Neurotology for MRI with gadolinium

**Common Student Mistakes:**
1. **Mistake:** Fitting hearing aids because "the thresholds show hearing loss." **Consequence:** Aids provide no benefit because the problem is neural, not cochlear. Patient is frustrated and may not seek proper medical evaluation. **Correction:** WRS is as important as PTA. If WRS is disproportionately poor, the priority is medical referral, not amplification.
2. **Mistake:** Not performing WRS testing at multiple levels (rollover check). **Consequence:** Missing the rollover effect that is the hallmark of retrocochlear pathology. **Correction:** Test WRS at PTA+30 (or 2 kHz+30) AND at a higher level (e.g., +50 or +60). If WRS drops at the higher level, rollover is present → refer.
3. **Mistake:** Assuming normal thresholds mean normal hearing. **Consequence:** The patient's very real difficulty is dismissed. **Correction:** Normal thresholds + poor WRS = abnormal hearing. The neural pathway is compromised even though the cochlea detects sound. Take the patient seriously.

**Clinical Pearls:**
1. This is the pattern that catches acoustic neuromas / vestibular schwannomas. A student who recognizes this pattern and refers appropriately may save a patient from a life-threatening tumor growing undetected. This is why WRS is not optional.
2. The PI-PB (Performance-Intensity) function is the key diagnostic tool. In cochlear pathology, WRS improves with intensity and plateaus. In retrocochlear pathology, WRS improves, peaks, then DROPS (rolls over). The rollover index (RI) > 0.45 is the classic criterion (Jerger & Jerger).
3. Auditory neuropathy spectrum disorder (ANSD) can also produce this pattern (normal OAE, abnormal ABR, poor WRS). ANSD is a different mechanism than vestibular schwannoma but requires similar referral pathways. The audiologist's job is to identify the pattern and refer — not to differentiate between causes.

---

### 6.11 Noise-Induced Hearing Loss (4 kHz Notch)

**Audiogram Signature:**
- Normal or near-normal thresholds at 250-2000 Hz (0-25 dB HL)
- Sharp notch (dip) at 3000-4000 Hz (typically 40-65 dB HL at 4 kHz)
- Partial recovery at 6000-8000 Hz (thresholds improve above the notch)
- Bilateral and roughly symmetric (occupational noise exposure) or unilateral (acoustic trauma, firearm use)
- Sensorineural, no air-bone gap
- Distinguishing features: "4 kHz notch," "Noise notch," "Recovery above 4 kHz"

**Typical Patient Complaints:**
- "I can't hear in noisy environments" (the damaged frequencies carry consonant detail needed in noise)
- "High-pitched sounds are too loud or too sharp" (recruitment at the damaged frequencies)
- "Constant ringing/buzzing" (tinnitus is very common with NIHL)
- "I can hear most things fine but certain sounds are missing"
- "People tell me I have the TV too loud" (compensating for HF loss)

**Fitting Approach:**
- Transducer: RIC preferred; BTE with thin tube acceptable
- Coupling: Open dome or micro mold — low-frequency hearing is normal and should not be occluded
- Vent: Open or large vent — only amplify the notch region, preserve natural hearing everywhere else
- Prescriptive target: NAL-NL2; gain concentrated in the 2-6 kHz region; minimal or no gain at 250-1000 Hz
- Key frequency regions: 2000-6000 Hz is the target; the 4 kHz notch is the primary gain target
- Additional: Tinnitus management features (masking noise, notch therapy) often needed; hearing protection counseling essential to prevent further damage; recruitment means compression at the notch frequencies must be carefully managed

**Masking Requirements:**
- Typically needed: Rarely (for symmetric bilateral NIHL)
- Explanation: With symmetric thresholds and insert earphones, masking is rarely needed. If unilateral or asymmetric, masking follows standard rules.
- Critical scenarios: Bone conduction testing at 4 kHz; if asymmetric (e.g., firearm use on dominant side); WRS testing if asymmetric

**Tradeoffs:**
1. Amplification at the notch vs. recruitment: The damaged hair cells at 4 kHz often exhibit recruitment (abnormal loudness growth). Adding gain at 4 kHz helps audibility but may cause discomfort at loud levels. Compression ratio must be high enough to manage recruitment without squashing soft sounds.
2. Open fit naturalness vs. notch gain: Open fitting preserves natural low-frequency hearing but limits how much gain can be delivered at the notch before feedback. If the notch is deep (>55 dB), a more closed fitting may be needed.
3. Tinnitus management vs. pure amplification: Some patients benefit more from tinnitus masking features than from the amplification itself. The hearing aid may serve primarily as a tinnitus management device.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Still can't hear in noise" | Possibly | Yes | NIHL fundamentally impairs the consonant frequencies used in noise | Enable directional mics; noise program; counsel on hearing protection and realistic expectations |
| "Ringing/tinnitus" | Possibly | Yes | Tinnitus is common with NIHL | Enable tinnitus masker if available; refer to tinnitus program if severe; counsel on management strategies |
| "Loud sounds are painful at 4 kHz" | Yes | Yes | Recruitment | Reduce MPO at the notch frequencies; increase compression ratio; counsel that this sensitivity is part of the damage |
| "I don't think I need hearing aids, I hear fine" | No | Yes | The patient hears fine in quiet because low-frequency hearing is normal | Counsel that the difficulty is real and specific to consonant perception; hearing protection prevents worsening |

**Referral Criteria:**
- Referral possible: Typically no, if pattern is consistent with known noise exposure
- Criteria: Refer only if: the notch is asymmetric without explained cause (e.g., firearm use), the loss is progressive beyond expected NIHL progression, or there are other concerning findings (poor WRS, vestibular symptoms)
- Urgency: Routine if referred
- Refer to: ENT if atypical features; occupational health if workplace exposure

**Common Student Mistakes:**
1. **Mistake:** Adding gain at 250-1000 Hz because "the overall hearing test shows loss." **Consequence:** Occluding normal low-frequency hearing; creating unnecessary own-voice/occlusion problems. **Correction:** Only amplify where the loss is. For NIHL, that's the notch region only.
2. **Mistake:** Not counseling about hearing protection. **Consequence:** Continued noise exposure worsens the loss, widening and deepening the notch. **Correction:** Every NIHL patient needs hearing protection counseling. This is prevention, and it's as important as the fitting.
3. **Mistake:** Ignoring tinnitus. **Consequence:** The patient may be more bothered by tinnitus than by hearing difficulty. If tinnitus is not addressed, the patient may abandon the aids even if the fitting is acoustically perfect. **Correction:** Always ask about tinnitus with NIHL patients. Enable tinnitus features or refer to a tinnitus management program.

**Clinical Pearls:**
1. The 4 kHz notch with recovery at 6-8 kHz is pathognomonic for NIHL. It distinguishes NIHL from presbycusis (which shows progressive decline without recovery). If the notch is present, ask about noise exposure history.
2. Many NIHL patients are reluctant to acknowledge hearing difficulty because "I hear fine most of the time." The loss is frequency-specific and situation-specific. Validate their experience while explaining the mechanism.
3. Military veterans and hunters often have asymmetric NIHL: worse in the ear closest to the muzzle. A left-handed shooter will have worse hearing in the right ear. Ask about this — it explains the asymmetry without needing referral for vestibular schwannoma.

---

### 6.12 Presbycusis (Bilateral Sloping, Age-Related)

**Audiogram Signature:**
- Bilateral symmetric sloping SNHL
- Gradual onset over years/decades
- Typically: 15-30 dB HL at 250-1000 Hz, 40-70+ dB HL at 2000-8000 Hz
- Progressive: thresholds worsen gradually over time
- No air-bone gap; no notch (unlike NIHL)
- No recovery above 4 kHz (unlike NIHL — continues to decline)
- Distinguishing features: "Bilateral symmetric," "Age-related," "Gradual sloping," "No notch or recovery"

**Typical Patient Complaints:**
- "What?" / "Huh?" / "Can you repeat that?" (classic)
- "I hear fine, other people mumble" (denial/lack of awareness)
- "I can't follow conversation at family gatherings"
- "My spouse/children say the TV is too loud"
- "Church/meetings are impossible" (distance + reverberation)
- "I feel isolated" (social withdrawal due to communication difficulty)

**Fitting Approach:**
- Transducer: RIC strongly preferred for mild-moderate presbycusis; BTE with thin tube for mild; BTE with custom mold for severe
- Coupling: Open dome for mild; closed dome for moderate; custom mold for moderate-severe and above
- Vent: Open to medium depending on degree (see Sloping HF SNHL — similar principles)
- Prescriptive target: NAL-NL2; gradual acclimatization approach recommended for first-time users (start at 80% of target, increase over 4-6 weeks)
- Key frequency regions: 1500-4000 Hz primary; extend to 6000+ Hz if audiogram and device allow
- Additional: Acclimatization management is critical — most presbycusis patients are first-time users in their 60s-80s. Cognitive considerations for elderly patients (simplified controls, caregiver involvement, auto-programs preferred). Address realistic expectations: aids help enormously but don't restore normal hearing.

**Masking Requirements:**
- Typically needed: Rarely (bilateral symmetric)
- Explanation: Symmetric thresholds mean cross-hearing to the opposite ear produces responses at or near the true threshold. With insert earphones (IA ~70 dB), masking is rarely needed for air conduction.
- Critical scenarios: Bone conduction at all frequencies (BC IA ~0 dB); air conduction only if loss exceeds 70 dB at any frequency with insert earphones; if asymmetric component is discovered, full masking protocol required

**Tradeoffs:**
1. Acclimatization pace vs. benefit timeline: Starting at full prescriptive target provides maximum benefit immediately but overwhelms most elderly first-time users. Starting lower is more comfortable but delays benefit, and some patients may not return for the follow-up increases.
2. Feature complexity vs. usability: Modern hearing aids have many features (Bluetooth, apps, multiple programs) that are beneficial but may overwhelm elderly patients with limited technology comfort. Simplify where possible.
3. Bilateral fitting cost vs. benefit: Bilateral fitting provides clear advantages (localization, speech in noise, bilateral summation) but doubles the cost. For some elderly patients on fixed income, this is a significant barrier. Monaural fitting is better than no fitting.

**Adjust vs. Counsel Decision Guide:**

| Complaint | Adjust? | Counsel? | Rationale | Action |
|-----------|---------|----------|-----------|--------|
| "Everything is too loud" (week 1-2) | Possibly | Yes | Acclimatization is the primary issue | Counsel on 2-4 week adaptation; reduce gain by 3-5 dB only if truly uncomfortable; schedule follow-up to increase toward target |
| "Can't understand in noise" | Possibly | Yes | This is the hardest challenge for presbycusis; aids help but don't solve it | Optimize directional mics; noise program; counsel on communication strategies (face the speaker, reduce distance, reduce noise); recommend remote mic for critical situations |
| "The aids are annoying/bothersome" | Possibly | Yes | Often reflects acclimatization or unrealistic expectations | Investigate specific complaint; adjust if identifiable fitting issue; counsel on what aids can and cannot do |
| "My friend has better hearing aids" | No | Yes | Comparison shopping / unrealistic expectations | Counsel that hearing aid benefit depends on degree of loss, neural health (WRS), and consistent use — not just the brand |
| "I don't wear them, they sit in the drawer" | No | Yes | This is the #1 failure mode for presbycusis fitting | Investigate WHY; common reasons: too loud, uncomfortable, "don't need them," family pressure; address the specific barrier; re-motivate with clear benefit demonstration |

**Referral Criteria:**
- Referral possible: Typically no, for classic bilateral symmetric presbycusis
- Criteria: Refer if: sudden worsening (not gradual), asymmetric (one ear significantly worse), WRS disproportionately poor, vestibular symptoms, or other red flags
- Urgency: Varies by finding
- Refer to: ENT if atypical features

**Common Student Mistakes:**
1. **Mistake:** Starting at 100% of prescriptive target for a first-time user. **Consequence:** Patient is overwhelmed, removes aids within hours, and may refuse to try again. **Correction:** Start at 70-80% of target; increase by 5-10% at each follow-up (every 1-2 weeks) until full target is reached over 4-6 weeks.
2. **Mistake:** Not involving family/caregivers. **Consequence:** Patient goes home with no support; struggles with insertion/removal, settings, charging; stops wearing aids. **Correction:** Include a communication partner at the fitting. Demonstrate insertion/removal to both patient and partner. Provide written instructions.
3. **Mistake:** Spending all the appointment time on the fitting and none on counseling. **Consequence:** Patient has perfectly programmed aids but unrealistic expectations, leading to dissatisfaction and returns. **Correction:** Divide the appointment: 50% fitting, 50% counseling. The counseling is as important as the gain settings.

**Clinical Pearls:**
1. Presbycusis is the most common reason people seek hearing aids. You will see this pattern more than any other. Becoming excellent at presbycusis fitting and counseling is the single highest-impact skill you can develop.
2. The biggest predictor of hearing aid success is not the fitting or the technology — it's consistent daily use. A patient who wears properly fitted aids 12 hours a day will adapt and benefit. A patient who wears them 2 hours a week will not. Focus your counseling on building the wearing habit.
3. Cognitive decline and hearing loss are strongly correlated. Amplification may provide cognitive benefit beyond just better hearing. For elderly patients and families hesitant about hearing aids, this evidence can be motivating.

---

## 7. UI Layout

### 7.1 Page Header

```
AUDIOGRAM PATTERNS & CLINICAL ACTION
Connecting audiogram configurations to clinical decision-making
```

Matches existing page header pattern (Typography h4 + subtitle1, centered, primary color).

### 7.2 Tab 1: By Pattern

**Filter bar:**
```
[Search: _______________]

[All] [SNHL] [Conductive] [Mixed] [Special]     ← category filter chips

Showing 8 of 12 patterns                        ← count when filtered
```

**Each pattern accordion summary:**
```
> [Chip: SNHL] Flat Mild-Moderate SNHL                    [Chip: Most Common]
```

The accordion summary shows: category chip, pattern name, and prevalence indicator chip (if applicable).

**Each pattern accordion detail (expanded):**

```
+--- Audiogram Signature -------------------------------------------+
| Description text...                                                |
| [Chip: Flat] [Chip: No A-B Gap] [Chip: 25-55 dB HL]             |
+-------------------------------------------------------------------+

+--- Typical Complaints ---+  +--- Fitting Approach ---------------+
| - "Too loud"             |  | Transducer: Open dome / Canal      |
| - "Own voice hollow"     |  | Coupling: Canal mold / closed dome |
| - "Can hear but can't..."  | Vent: Medium (2-2.5 mm)            |
|   → See Adjustments Guide|  | Target: NAL-NL2                    |
+--------------------------+  | Key region: 250-4000 Hz            |
                              +-------------------------------------+

+--- Masking Requirements ---------+
| [Chip: Rarely Needed]            |
| Explanation text...              |
| ⚠ Critical: If 50+ dB with     |
|   supra-aural phones at any freq |
+----------------------------------+

+--- Tradeoffs -------------------------------------------------+
| +-- Card 1 ----------------+ +-- Card 2 -----------------+   |
| | Occlusion vs. Gain       | | Acclimatization vs.       |   |
| | explanation...            | | Satisfaction explanation.. |   |
| +---------------------------+ +----------------------------+   |
+---------------------------------------------------------------+

+--- Adjustment vs. Counseling Guide (Table) ---+
| Complaint | Adjust? | Counsel? | Action       |
|-----------|---------|----------|--------------|
| ...       | ...     | ...      | ...          |
+------------------------------------------------+

+--- Referral ---+
| [Chip: None]   |
| Criteria text  |
| → See Referrals|
+----------------+

⚠ COMMON MISTAKES (Alert: warning)
  1. Mistake → Consequence → Correction
  2. ...

ℹ CLINICAL PEARLS (Alert: info)
  1. Pearl text
  2. ...
```

### 7.3 Tab 2: Quick Reference Matrix

Dense comparison table with all 12 patterns:

```
+------------------------------------------------------------------+
| Pattern      | Degree   | Transducer | Vent   | Mask? | Refer? | Top Complaint        |
|--------------|----------|------------|--------|-------|--------|---------------------|
| Flat Mild-Mod| Mild-Mod | Open/Canal | Med-Lg | Rare  | No*    | "Too loud"          |
| Sloping HF   | Mild-Sev | RIC/Open   | Open   | Some  | If asym| "Can't hear in noise"|
| ...          | ...      | ...        | ...    | ...   | ...    | ...                 |
+------------------------------------------------------------------+

* Click any row to jump to the full pattern detail in Tab 1
```

Each row is clickable: clicking switches to Tab 1 and expands the corresponding accordion.

---

## 8. Content Review Requirements

### 8.1 SME Review Matrix

| Content Area | Can Be Generated | Requires SME Review | Notes |
|-------------|-----------------|--------------------|----|
| Audiogram signature descriptions | Yes | Yes — verify threshold ranges are realistic | Use standard degree classifications (Clark, 1981) |
| Typical patient complaints | Yes | Yes — verify clinical accuracy | Based on common clinical experience |
| Fitting approach: transducer/coupling/vent | Yes | **YES — critical** | Must match current best-practice guidelines |
| Prescriptive target recommendations | Yes | **YES — critical** | NAL-NL2 vs DSL v5 recommendations must be current |
| Masking guidance | Yes | **YES — critical** | Masking decisions affect diagnostic accuracy |
| Tradeoffs | Yes | Yes | Verify that tradeoffs are accurately characterized |
| Adjust vs. Counsel decisions | Partially | **YES — critical** | Incorrect guidance could harm patients |
| Referral criteria | Partially | **YES — patient safety** | Must align with AAA/ASHA guidelines; match Referrals page content |
| Common student mistakes | Partially | Yes — verify from clinical teaching experience | May need input from clinical educators |
| Clinical pearls | No — should come from experienced clinicians | **YES — must be verified clinical wisdom** | Highest educational value content |

### 8.2 Cross-Reference Verification

Before publication, verify that:

1. Referral criteria in each pattern match the criteria in `ReferralsPage` / `referralData.ts`
2. Fitting approach recommendations align with `EarmoldsPage` / `earmoldData.ts` content
3. Complaint descriptions match entries in `ComplaintAdjustmentsPage` / `complaintAdjustmentData.ts`
4. Masking guidance aligns with `MaskingPracticePage` masking rules (IA values, OE values)
5. WRS references use the updated 2 kHz threshold method (per UX_REDESIGN_SPEC.md Section 8)
6. Clinical Decision page cross-reference table (CLINICAL_DECISION_SPEC.md Section 5) accurately maps each pattern to its primary decision pathway

### 8.3 Content That Needs External References

| Content | Suggested Reference |
|---------|-------------------|
| Degree of hearing loss classifications | Clark (1981); ASHA guidelines |
| Prescriptive fitting formulas | Dillon (2012) for NAL-NL2; Scollie et al. for DSL v5 |
| Masking rules and IA values | ASHA (2005); BSA (2018); Martin & Clark |
| Referral criteria | AAA Clinical Practice Guidelines |
| Acoustic neuroma / retrocochlear signs | Jerger & Jerger (1971) for rollover; current AAA/ASHA guidelines |
| Presbycusis and cognitive decline | Lancet Commission on Dementia (2020) |
| CI candidacy criteria | NICE guidelines; FDA criteria |
