# Clinical Decision-Making — Implementation Specification

**Version:** 1.0
**Date:** 2026-03-26
**Companion to:** `UX_REDESIGN_SPEC.md`, `AUDIOGRAM_PATTERNS_SPEC.md`
**Status:** Draft for Clinical Expert Review

---

## Table of Contents

1. [Purpose & Rationale](#1-purpose--rationale)
2. [Integration Points](#2-integration-points)
3. [Page Architecture](#3-page-architecture)
4. [Data Model](#4-data-model)
5. [Component Structure](#5-component-structure)
6. [Section Content Specifications](#6-section-content-specifications)
7. [UI Layout](#7-ui-layout)
8. [Content Review Requirements](#8-content-review-requirements)

---

## 1. Purpose & Rationale

### 1.1 Gap Analysis

The app currently teaches individual clinical skills well — masking, adjustments, referrals, earmolds — but never teaches the **meta-skill** of clinical decision-making: how to take a clinical finding and decide what to DO with it.

Students currently face these unsupported decisions:

| Situation | Student's Question | Where They Can Find Help Now |
|-----------|-------------------|------------------------------|
| Patient says "too loud" after 3 days | Adjust or counsel? | Nowhere explicit — ComplaintAdjustmentsPage gives adjustments but doesn't say "wait first" |
| Audiogram shows asymmetry | Refer or fit? | ReferralsPage says when to refer, but doesn't guide "refer AND fit" vs "refer THEN fit" |
| Patient unhappy after 2 follow-ups | Keep adjusting or counsel expectations? | Nowhere — no framework for when to stop adjusting |
| Multiple complaints at one visit | Which to address first? | Nowhere — no prioritization guidance |
| Finding is borderline (e.g., 14 dB asymmetry) | Refer? Monitor? Ignore? | Nowhere — referral criteria are binary, not graded |

This page provides the decision framework that connects all the other pages. It is the "clinical reasoning" layer that sits above the individual skill pages.

### 1.2 Learning Objectives

After using this page, students should be able to:

1. Classify any clinical finding as primarily a fitting problem, expectation problem, or medical problem
2. Apply a structured decision process to determine the appropriate response (adjust, counsel, refer, or combination)
3. Prioritize multiple complaints at a single appointment
4. Know when to STOP adjusting and shift to counseling
5. Communicate tradeoffs to patients in plain language using a shared decision-making model
6. Handle common clinical scenarios with confidence
7. Document clinical decisions appropriately

---

## 2. Integration Points

### 2.1 Navigation Placement

**Route:** `/reference/clinical-decisions`

**Nav location:** Under **Reference** group in the main navigation.

```
Reference
  |-- Ear Anatomy (/reference/anatomy)
  |-- Audiogram Patterns (/reference/audiogram-patterns)
  |-- Clinical Decision-Making (/reference/clinical-decisions)    ** NEW **
```

This is a reference/framework page, not a practice exercise. It provides the reasoning model that students apply when using the Assessment and Hearing Aids sections.

### 2.2 Files to Modify for Integration

| File | Change |
|------|--------|
| `src/App.tsx` | Add lazy import for `ClinicalDecisionPage`; add route `/reference/clinical-decisions`; add nav entry under Reference group; add footer link |
| `src/components/shared/Breadcrumbs.tsx` | Add `'clinical-decisions': 'Clinical Decision-Making'` to `ROUTE_LABELS` |
| `src/pages/ComplaintAdjustmentsPage.tsx` | Add `Alert` at top of page: "Not sure whether to adjust or counsel? See the Clinical Decision-Making guide for a framework." |
| `src/pages/ReferralsPage.tsx` | Add `Alert` in Tab 1: "For a framework on when referral is the right response vs. adjusting or counseling, see Clinical Decision-Making." |
| `src/pages/EarmoldsPage.tsx` | Add cross-link from Tab 1 (Selection Decision Flow): "For how earmold decisions connect to the broader fitting strategy, see Clinical Decision-Making." |
| `src/pages/AudiogramPatternsPage.tsx` | Each pattern's "Adjust vs. Counsel" section links to this page's framework. Section 5 cross-reference table links back to individual patterns. |
| `src/pages/HomePage.tsx` | Add Clinical Decision-Making to the Reference pathway card |

### 2.3 Cross-Links FROM This Page

| Section | Links To |
|---------|----------|
| Adjustment Decision Tree | ComplaintAdjustmentsPage (for specific adjustment guidance) |
| Counseling Decision Tree | ComplaintAdjustmentsPage Tab 4 (Common Patterns: "New user acclimatization") |
| Referral Decision Tree | ReferralsPage (full referral criteria, red flags, communication scripts) |
| Audiogram-Specific Guidance | AudiogramPatternsPage (per-pattern clinical action) |
| Tradeoff Communication | EarmoldsPage Tab 3 (venting tradeoffs); ComplaintAdjustmentsPage (frequency tradeoffs) |
| Clinical Scenarios | Relevant pages per scenario (varies) |

---

## 3. Page Architecture

### 3.1 Page Layout

The page uses a **multi-section scrollable layout** rather than tabs, because the content builds sequentially — later sections reference earlier ones. A persistent sidebar table of contents (desktop) or a top-level jump menu (mobile) provides navigation within the page.

This is different from the tab pattern used in ReferralsPage, EarmoldsPage, and ComplaintAdjustmentsPage. Tabs are ideal for independent parallel content; this page's content is hierarchical and sequential.

### 3.2 Section Structure

```
CLINICAL DECISION-MAKING
A framework for responding to any clinical finding

Table of Contents (sidebar on desktop / collapsible on mobile):
  1. The Core Framework
  2. Adjustment Decision Tree
  3. Counseling Decision Tree
  4. Referral Decision Tree
  5. Audiogram-Specific Decision Guidance
  6. Common Clinical Scenarios
  7. The Tradeoff Communication Framework

[Section 1: The Core Framework]
  ...
[Section 2: Adjustment Decision Tree]
  ...
[Section 3: Counseling Decision Tree]
  ...
[Section 4: Referral Decision Tree]
  ...
[Section 5: Audiogram-Specific Decision Guidance]
  ...
[Section 6: Common Clinical Scenarios]
  ...
[Section 7: The Tradeoff Communication Framework]
  ...
```

### 3.3 Alternative: Tab Layout

If the sequential nature proves less important than quick access to individual sections, the page can use a 7-tab layout matching the other pages. The data model supports both approaches. Recommended approach: start with the scrollable layout and add tabs later if user testing shows students want to jump to specific sections frequently.

---

## 4. Data Model

### 4.1 File Location

`src/data/clinicalDecisionData.ts`

### 4.2 Interfaces

```typescript
// ---------------------------------------------------------------------------
// Clinical Decision-Making Data — framework content, decision trees, scenarios,
// and tradeoff communication guides.
//
// All clinical content requires SME review before publication.
// ---------------------------------------------------------------------------

// --- Core Framework ---

export type DecisionCategory = 'adjust' | 'counsel' | 'refer';

export interface DecisionCategoryInfo {
  id: DecisionCategory;
  label: string;
  icon: string;             // MUI icon name
  color: string;            // MUI palette color
  definition: string;
  centralQuestion: string;
  examples: string[];
}

export interface CategoryDiscriminator {
  question: string;
  ifYes: DecisionCategory;
  explanation: string;
}

// --- Adjustment Decision Tree ---

export interface AdjustmentCriterion {
  criterion: string;
  explanation: string;
}

export interface AdjustmentPrioritization {
  priority: number;
  category: string;
  rationale: string;
  examples: string[];
}

export interface WhenNotToAdjust {
  situation: string;
  reason: string;
  whatToDo: string;
}

// --- Counseling Decision Tree ---

export interface AdaptationTimeline {
  phase: string;
  timeframe: string;
  whatToExpect: string;
  whenToIntervene: string;
}

export interface CounselingStrategy {
  scenario: string;
  approach: string;
  exampleScript: string;
}

export interface RealisticExpectation {
  expectation: string;
  reality: string;
  howToExplain: string;
}

// --- Referral Decision Tree ---

export type ReferralUrgency = 'urgent' | 'priority' | 'routine';
export type ReferralType = 'medical' | 'audiological';

export interface ReferralPathway {
  type: ReferralType;
  subtype: string;
  criteria: string[];
  urgency: ReferralUrgency;
  referTo: string;
  whatToInclude: string[];
}

export interface RedFlagItem {
  sign: string;
  urgency: ReferralUrgency;
  action: string;
}

export interface UrgencyCommunication {
  urgency: ReferralUrgency;
  approach: string;
  exampleScript: string;
  pitfalls: string[];
}

// --- Audiogram Cross-Reference ---

export interface AudiogramDecisionMapping {
  patternId: string;        // matches AudiogramPattern.id from audiogramPatternData.ts
  patternName: string;
  primaryPathway: DecisionCategory;
  secondaryPathway: DecisionCategory | null;
  rationale: string;
  keyDecisionPoint: string;
}

// --- Clinical Scenarios ---

export interface ClinicalScenario {
  id: string;
  title: string;
  patientDescription: string;
  audiogramSummary: string;
  complaint: string;
  timeContext: string;       // e.g., "1 week post-fit", "3 months of use"
  additionalInfo: string;
  correctDecision: DecisionCategory;
  secondaryDecision: DecisionCategory | null;
  reasoning: string;
  actionPlan: string[];
  commonWrongAnswer: DecisionCategory;
  whyWrongAnswerIsWrong: string;
}

// --- Tradeoff Communication ---

export interface TradeoffScenario {
  id: string;
  tradeoff: string;
  clinicalContext: string;
  plainLanguageExplanation: string;
  exampleScript: string;
  sharedDecisionQuestion: string;
}

export interface DocumentationTip {
  category: string;
  whatToDocument: string[];
  example: string;
}
```

### 4.3 Constant Shape

```typescript
export const DECISION_CATEGORIES: readonly DecisionCategoryInfo[] = [
  { id: 'adjust', label: 'Adjust', icon: 'Tune', color: 'primary', ... },
  { id: 'counsel', label: 'Counsel', icon: 'RecordVoiceOver', color: 'success', ... },
  { id: 'refer', label: 'Refer', icon: 'LocalHospital', color: 'error', ... },
];

export const CATEGORY_DISCRIMINATORS: readonly CategoryDiscriminator[] = [ ... ];

export const ADJUSTMENT_CRITERIA: readonly AdjustmentCriterion[] = [ ... ];
export const ADJUSTMENT_PRIORITIZATION: readonly AdjustmentPrioritization[] = [ ... ];
export const WHEN_NOT_TO_ADJUST: readonly WhenNotToAdjust[] = [ ... ];

export const ADAPTATION_TIMELINE: readonly AdaptationTimeline[] = [ ... ];
export const COUNSELING_STRATEGIES: readonly CounselingStrategy[] = [ ... ];
export const REALISTIC_EXPECTATIONS: readonly RealisticExpectation[] = [ ... ];

export const REFERRAL_PATHWAYS: readonly ReferralPathway[] = [ ... ];
export const RED_FLAGS: readonly RedFlagItem[] = [ ... ];
export const URGENCY_COMMUNICATION: readonly UrgencyCommunication[] = [ ... ];

export const AUDIOGRAM_DECISION_MAPPINGS: readonly AudiogramDecisionMapping[] = [ ... ];

export const CLINICAL_SCENARIOS: readonly ClinicalScenario[] = [ ... ];

export const TRADEOFF_SCENARIOS: readonly TradeoffScenario[] = [ ... ];
export const DOCUMENTATION_TIPS: readonly DocumentationTip[] = [ ... ];
```

---

## 5. Component Structure

### 5.1 File Location

`src/pages/ClinicalDecisionPage.tsx`

### 5.2 Component Tree

```
ClinicalDecisionPage
  ├── Page header (Typography h4, subtitle)
  ├── Desktop: Sidebar TOC (sticky Box with anchor links)
  │   Mobile: Collapsible TOC at top (Accordion)
  ├── Section 1: CoreFrameworkSection
  │   ├── Three-column card layout (Adjust | Counsel | Refer)
  │   │   └── Each card: icon, label, definition, central question, examples
  │   ├── "How to Tell Them Apart" discriminator checklist
  │   │   └── List of questions with Yes → category mapping
  │   └── Summary flow diagram (text-based, not image)
  ├── Divider
  ├── Section 2: AdjustmentDecisionTreeSection
  │   ├── "When a complaint is clearly a fitting issue" (criteria cards)
  │   ├── "Information needed before adjusting" (checklist)
  │   ├── "How to prioritize multiple complaints" (prioritized table)
  │   └── "When NOT to adjust" (Alert severity="warning" with table)
  ├── Divider
  ├── Section 3: CounselingDecisionTreeSection
  │   ├── Adaptation timeline (Table or stepper)
  │   ├── Realistic expectations (comparison cards: Expectation vs Reality)
  │   ├── "When counseling alone is appropriate" (criteria list)
  │   ├── Communication strategies (Card list with example scripts)
  │   └── "The therapeutic trial concept" (Paper callout)
  ├── Divider
  ├── Section 4: ReferralDecisionTreeSection
  │   ├── Medical referrals (Table with urgency chips)
  │   ├── Audiological referrals (Table)
  │   ├── Red flags (three-tier Alert: urgent/priority/routine)
  │   ├── Urgency communication guide (Script cards per urgency level)
  │   └── Referral information checklist
  ├── Divider
  ├── Section 5: AudiogramDecisionGuidanceSection
  │   ├── Cross-reference table (pattern → primary pathway → key decision)
  │   └── Each row links to AudiogramPatternsPage
  ├── Divider
  ├── Section 6: ClinicalScenariosSection
  │   ├── Scenario cards (interactive: student guesses before reveal)
  │   │   └── Each: description → [Adjust] [Counsel] [Refer] buttons → reveal
  │   └── "Worked examples" (non-interactive: show reasoning step by step)
  ├── Divider
  └── Section 7: TradeoffCommunicationSection
      ├── How to explain tradeoffs (principles list)
      ├── Example scripts (Card list with scenario + script + shared-decision Q)
      ├── Shared decision-making model (stepper or flow)
      └── Documentation tips (Table)
```

### 5.3 MUI Components Used

| Component | Usage | Source Pattern |
|-----------|-------|---------------|
| `Container`, `Paper` | Page wrapper | All pages |
| `Card`, `CardContent` | Framework cards, scenario cards, tradeoff scripts | EarmoldsPage, ComplaintAdjustmentsPage |
| `Table`, `TableContainer`, `TableHead`, `TableBody`, `TableRow`, `TableCell` | Prioritization table, cross-reference table, timeline table | ReferralsPage, EarmoldsPage |
| `Alert` | Red flags, when-not-to-adjust warnings, clinical pearls | All pages |
| `Chip` | Urgency indicators, decision category tags | ReferralsPage (urgency chips) |
| `List`, `ListItem`, `ListItemIcon`, `ListItemText` | Criteria lists, checklists | ReferralsPage |
| `Divider` | Section separators | All pages |
| `Box` with grid layout | Multi-column card layouts | All pages |
| `Accordion`, `AccordionSummary`, `AccordionDetails` | Mobile TOC; collapsible scenario details | ComplaintAdjustmentsPage |
| `Button`, `ButtonGroup` | Scenario answer selection (Adjust/Counsel/Refer) | New pattern for interactive scenarios |
| `Link` (react-router) | Cross-links to other pages | Throughout app |
| `Typography` with `id` attribute | Section headings for anchor navigation | New pattern for scrollable TOC |

### 5.4 State Management

```typescript
const [scenarioAnswers, setScenarioAnswers] = useState<Record<string, DecisionCategory | null>>({});
const [scenarioRevealed, setScenarioRevealed] = useState<Record<string, boolean>>({});
const [tocExpanded, setTocExpanded] = useState(false);  // mobile only
```

Minimal state — the page is primarily a reference document. The only interactive element is the clinical scenario section where students can guess the correct decision before seeing the answer.

---

## 6. Section Content Specifications

### 6.1 Section 1: The Core Framework

#### Three Responses

```
+-- ADJUST --+  +-- COUNSEL --+  +-- REFER --+
| [Tune]     |  | [Voice]     |  | [Hospital]|
|            |  |             |  |           |
| Change     |  | Change the  |  | Send the  |
| the hearing|  | patient's   |  | patient   |
| aid        |  | understanding|  | elsewhere |
| settings   |  | or          |  | for       |
|            |  | expectations|  | evaluation|
| "Is this a |  | "Is this an |  | "Is this  |
|  fitting   |  |  expectation|  |  a medical|
|  problem?" |  |  problem?"  |  |  problem?"|
+------------+  +-------------+  +-----------+
```

Each card includes:
- **Definition:** One sentence describing the response
- **Central question:** The question the clinician asks to determine if this is the right response
- **Examples:** 3-4 concrete examples

#### The Central Question: Fitting Problem, Expectation Problem, or Medical Problem?

Present as a decision checklist:

| Ask Yourself... | If Yes → | Explanation |
|----------------|----------|-------------|
| Can I change a hearing aid parameter to address this? | ADJUST | The hearing aid is technically capable of being changed to improve the situation |
| Is the patient expecting something hearing aids cannot do? | COUNSEL | The limitation is fundamental (physics, biology), not a fitting choice |
| Is there a finding that suggests pathology I cannot treat? | REFER | Medical intervention may be needed |
| Is the patient in the normal adaptation period and the complaint is typical? | COUNSEL | Time and consistent use will resolve this |
| Have I already adjusted for this complaint and it's not resolved? | RE-EVALUATE | May need to shift from adjust to counsel, or from counsel to refer |

#### How to Tell Them Apart

**Fitting problem indicators:**
- The complaint maps to a specific parameter (gain, compression, output, vent, coupling)
- The complaint appeared or changed after a fitting change
- The complaint is consistent (happens every time in the same situation)
- REM shows deviation from prescriptive target in the relevant frequency region

**Expectation problem indicators:**
- The complaint is about something hearing aids fundamentally cannot do (restore normal hearing, eliminate all background noise)
- The patient is comparing to unaided normal hearing or to someone else's experience
- The complaint is in the first 2-4 weeks and is about "loudness" or "strangeness" (acclimatization)
- The complaint persists despite technically correct fitting (REM on target)
- The patient says "my old aids were better" when the old aids were under-fit

**Medical problem indicators:**
- Audiometric findings that match referral criteria (asymmetry, sudden change, air-bone gap, poor WRS)
- Symptoms beyond hearing (pain, drainage, vertigo, facial numbness)
- Progressive worsening not explained by aging
- Findings inconsistent with the hearing aid fitting (i.e., the complaint isn't about the aids)

#### Combinations Are Common

```
+------------------+
| ADJUST + COUNSEL |  Most common combination. Adjust the fitting AND
|                  |  counsel on expectations. Example: reduce gain for
|                  |  loudness complaint AND counsel on acclimatization.
+------------------+

+------------------+
| REFER + FIT      |  Referral needed but hearing aids are also appropriate.
|                  |  Example: asymmetric SNHL — refer for MRI but
|                  |  proceed with bilateral fitting.
+------------------+

+------------------+
| REFER + COUNSEL  |  Referral needed; hearing aids are NOT appropriate yet.
|                  |  Example: conductive loss — refer for medical eval;
|                  |  counsel that treatment may restore hearing.
+------------------+

+------------------+
| ALL THREE        |  Adjust current fitting, counsel on realistic
|                  |  expectations, AND refer for additional evaluation.
|                  |  Example: patient with progressive asymmetric loss
|                  |  and complaints about current fitting.
+------------------+
```

---

### 6.2 Section 2: Adjustment Decision Tree

#### When a Complaint is Clearly a Fitting Issue

A complaint is clearly a fitting issue when ALL of the following are true:

1. The complaint maps to a specific adjustable parameter
2. The patient's audiogram and WRS support the adjustment (i.e., the ear can benefit from the change)
3. The adjustment does not violate prescriptive targets without good reason
4. The complaint is not in the first 1-2 weeks of a new fitting (acclimatization window)

#### Information Needed Before Adjusting

Before making any adjustment, the clinician should know:

| Information | Why It Matters |
|-------------|---------------|
| Current hearing aid settings (gain, compression, output, features) | Need baseline to know what to change |
| Prescriptive target vs. current output (REM if available) | Determines whether the aid is already on target or deviating |
| Patient's audiogram (current — have thresholds changed?) | Loss may have changed since last fitting; adjusting to old audiogram is wrong |
| Duration of use (hours/day, days since fitting) | Short use may indicate acclimatization issue, not fitting issue |
| Specific situation where complaint occurs | Adjustments should target the problematic situation, not change everything |
| Previous adjustments made | Avoid ping-ponging between settings; track what's been tried |
| WRS (is speech understanding reasonable for the loss?) | If WRS is poor, no adjustment will fix clarity complaints |

#### How to Prioritize Multiple Complaints

When a patient presents with multiple complaints at one visit:

| Priority | Category | Rationale | Examples |
|----------|----------|-----------|---------|
| 1 | Safety/Medical concerns | Patient safety first; medical issues may explain other complaints | Pain, sudden change, vertigo, drainage |
| 2 | Basic audibility | If the patient can't hear, no other adjustment matters | "I can't hear at all," "Everything is too quiet" |
| 3 | Loudness tolerance | If sounds are painfully loud, the patient will stop wearing the aids | "Loud sounds hurt," "I jump at every noise" |
| 4 | Feedback | Feedback is distracting and socially embarrassing; prevents consistent use | "Whistling," "Squealing when I hug someone" |
| 5 | Speech clarity | The primary goal of amplification; address after audibility and comfort | "Can't understand speech," "People mumble" |
| 6 | Sound quality | Important for satisfaction but not for basic function | "Tinny," "Hollow," "Robotic" |
| 7 | Comfort/cosmetic | Address last; these are lower-impact on function | "Ear feels full," "Don't like how it looks" |

**Clinical principle:** Address no more than 2-3 complaints per visit. Making too many changes at once makes it impossible to determine what helped and what didn't. Tell the patient: "Let's focus on the two things that bother you most today. We'll address the others at your next visit."

#### When NOT to Adjust

| Situation | Reason | What to Do Instead |
|-----------|--------|-------------------|
| Patient is in the first 1-2 weeks of a new fitting and complaints are about loudness or "strangeness" | Acclimatization in progress; the brain needs time to adapt | Counsel on timeline; reduce gain only if truly intolerable; schedule follow-up in 1-2 weeks |
| REM shows gain is on prescriptive target and the complaint is about "clarity" in noise | Hearing aids have fundamental limits in noise; the fitting is correct | Counsel on noise limitations; recommend communication strategies; consider remote mic |
| The patient's WRS is poor (<50%) and they complain about speech understanding | The limiting factor is neural/cochlear, not the hearing aid | Counsel that amplification improves detection but cannot restore neural processing; consider CI evaluation if appropriate |
| The complaint changes each visit (different complaint every time) | Pattern suggests unrealistic expectations or psychological factors | Shift to counseling; explore underlying concerns; consider referral to support services |
| The patient is comparing to unaided normal hearing | No hearing aid matches normal hearing; the comparison is unrealistic | Counsel on what amplification can and cannot do; focus on demonstrating benefit vs. unaided, not vs. normal |
| A family member is complaining but the patient is satisfied | The patient's perception is primary; family concerns may be about the family member's expectations | Counsel the family member; demonstrate aided benefit; offer communication strategies for both parties |

---

### 6.3 Section 3: Counseling Decision Tree

#### Adaptation Period: What Is Normal

| Phase | Timeframe | What to Expect | When to Intervene |
|-------|-----------|---------------|-------------------|
| Initial shock | Days 1-3 | Everything sounds loud, sharp, or strange. Own voice may sound different. Environmental sounds (traffic, fan, fridge) are suddenly noticeable. | Only if the patient is in physical discomfort or refuses to wear the aids at all. Minor loudness complaints are normal. |
| Adjustment | Days 3-14 | Loudness perception begins normalizing. Some sounds still seem "too much." Hearing fatigue is common. Patient may need breaks. | If complaints are WORSENING rather than improving, or if a specific sound is consistently problematic (feedback, specific noise). |
| Integration | Weeks 2-6 | Amplified sound begins to feel normal. Speech understanding improves as the brain adapts. Patient starts wearing aids all day. | If there is no improvement after 4 weeks of consistent use, the fitting may need adjustment. Schedule a follow-up. |
| Settled | Weeks 6+ | The patient considers the aids "part of life." Removing them feels like losing hearing again. Sound quality complaints stabilize. | Remaining complaints at this point are legitimate fitting issues or realistic-expectation counseling targets. |

**Critical distinction:** A complaint that is IMPROVING over the first 2-4 weeks is normal adaptation. A complaint that is STATIC or WORSENING is likely a fitting issue. Always ask: "Has this gotten better, worse, or stayed the same since you first noticed it?"

#### Realistic Expectations

| Patient Expectation | Reality | How to Explain |
|--------------------|---------|---------------|
| "I should hear like I used to" | Hearing aids amplify sound; they don't restore normal hearing. Neural processing, frequency resolution, and temporal resolution are all reduced by SNHL. | "Hearing aids are like glasses for your ears — they help a lot, but just as reading glasses don't give you 20-year-old eyes, hearing aids work with the hearing you have now. They make sounds louder and clearer, but they work through your hearing system, which has changed." |
| "I should understand everyone in every situation" | Background noise degrades speech understanding for everyone, and more so for people with hearing loss. No hearing aid eliminates background noise. | "Even people with perfect hearing struggle to understand in very noisy places. Hearing aids help a lot in moderate noise, but very noisy environments like busy restaurants are challenging for everyone. Let's talk about some strategies that help beyond what the hearing aids do." |
| "The hearing aids should be invisible" | Modern aids are small, but they are not invisible. Some configurations (BTE with custom mold) are larger. Size is often a function of clinical need. | "We've come a long way — most people won't notice your hearing aids. But for your hearing loss, we need [specific style] to give you the best hearing. Let's focus on what sounds good rather than what looks good, and I think you'll find most people are noticing your hearing aid less than you think." |
| "I should hear perfectly on the phone" | Telephone coupling depends on aid style, phone model, and coupling method. Some combination work better than others. | "Phone calls take a bit of practice. Let's try a few different approaches — [streaming/telecoil/acoustic] — and find what works best with your phone." |
| "My old aids were better" | Often false memory; the old aids were typically under-fit and the patient adapted to reduced input. New aids at prescriptive target feel "too loud." | "Your previous aids may have been set at a lower level than your hearing actually needs. These are set to give you more of the sounds you've been missing. Give it two weeks — most patients tell me these are better once they adjust." |

#### When Counseling Alone Is Appropriate

Counseling alone (no adjustment) is the right response when:

1. The patient is in the normal acclimatization window (first 2-4 weeks) and the complaint is about loudness, sound quality, or "strangeness"
2. The fitting is verified correct by REM and the complaint is about a fundamental limitation of amplification
3. The patient's WRS explains their difficulty (poor WRS = poor clarity regardless of fitting)
4. The complaint is about a social/emotional aspect of hearing loss (stigma, isolation, frustration) rather than a technical fitting issue
5. The patient is comparing to normal hearing or to another person's experience

#### Communication Strategies

| Scenario | Approach | Example Script |
|----------|---------|----------------|
| Setting initial expectations at the fitting | Frame aids as a tool, not a cure; set a timeline for adaptation | "These hearing aids are going to make a real difference. The first few days may feel a bit strange — sounds you haven't heard in a while will seem loud. That's normal and it gets better. Let's plan to check in next week to see how you're doing." |
| Responding to "these don't work" | Validate the frustration; investigate specifics; demonstrate benefit | "I hear you — that's frustrating. Let's figure out exactly what's happening. Can you tell me about the specific situation where they aren't working? ... [After investigation] Let me show you something — let's take them out for a moment ... [remove aids, speak at same level] ... Now put them back in. Can you hear the difference? The aids are doing a lot — let's fine-tune them so they do even more." |
| Addressing adaptation resistance | Normalize the experience; provide a structured wearing schedule | "What you're experiencing is very normal. Your brain is relearning how to process sounds it hasn't heard clearly in years. I recommend starting with 4-6 hours a day in quiet environments, then gradually increasing. By the end of the second week, try wearing them all day. Each day gets easier." |
| Managing family expectations | Include family in the conversation; educate about realistic improvements | "You're right that [patient name] can hear better with the aids, but hearing aids don't make hearing perfect. In noisy places, even with the best aids, speech can be hard to follow. Here are some things that will help both of you: face each other when talking, reduce background noise when possible, and get their attention before starting a conversation." |

#### The Therapeutic Trial Concept

A **therapeutic trial** is a structured period (typically 2-4 weeks) during which the patient wears the hearing aids consistently in their daily environments before any judgment about benefit is made.

**Why it matters:** Many patients form an opinion about hearing aids within the first 2 hours. This is too soon. The brain needs sustained exposure to re-calibrate auditory processing. A therapeutic trial ensures the patient gives the aids a fair chance.

**How to implement:**
1. At the fitting, explain the trial concept and set a specific duration (e.g., "Let's agree that you'll wear these for at least 3 weeks before we decide how well they're working")
2. Provide a wearing schedule (gradually increase hours per day)
3. Ask the patient to keep a brief log of situations where aids helped and where they didn't
4. Schedule a follow-up at the end of the trial to review the log and make adjustments based on real-world experience rather than first impressions

---

### 6.4 Section 4: Referral Decision Tree

#### Medical Referrals (ENT / Otolaryngology)

| Criteria | Urgency | Refer To | What to Include |
|----------|---------|----------|----------------|
| Sudden SNHL (>= 30 dB over 3 frequencies within 72 hours) | URGENT (same day) | ENT / Emergency | Audiogram, onset time, symptom description |
| Active ear drainage with fever | URGENT | ENT / Urgent Care | Otoscopy findings, temperature, duration |
| Sudden vertigo with hearing loss | URGENT | ENT / ER | Audiogram, balance symptoms, timeline |
| Asymmetric SNHL (>= 15 dB at 3+ freq) | PRIORITY (2-4 weeks) | ENT / Otologist | Audiogram with masked thresholds, WRS both ears |
| Unilateral tinnitus (new onset) | PRIORITY | ENT / Otologist | Duration, character (pulsatile?), associated symptoms |
| Pulsatile tinnitus | PRIORITY | ENT / Vascular | Whether objective or subjective, associated symptoms |
| Conductive loss without medical clearance | ROUTINE (4-6 weeks) | ENT | Audiogram with BC thresholds, tympanometry if available |
| Pain (otalgia) persistent or severe | PRIORITY | ENT / Primary Care | Location, duration, associated symptoms |

**Cross-reference:** Full referral criteria table is in the Referrals page (`/assessment/referrals`). Link to it rather than duplicating.

#### Audiological Referrals

| Criteria | Referral Type | Refer To |
|----------|-------------|----------|
| Aided WRS < 50% best-aided condition | CI candidacy evaluation | CI center / Otologist |
| Persistent vertigo / balance difficulty | Vestibular assessment | Vestibular audiologist / ENT |
| Severe tinnitus impacting daily life | Tinnitus management program | Tinnitus specialist / psychologist |
| Auditory processing complaints with normal audiogram | APD evaluation | Audiologist specializing in APD |

#### Red Flags Requiring URGENT Referral

Present as a highly visible callout (Alert severity="error"):

```
STOP AND REFER IMMEDIATELY if any of these are present:
- Sudden hearing loss (< 72 hours) — this is a medical emergency
- Acute vertigo with hearing loss and/or tinnitus
- Active ear drainage with fever or pain
- Unilateral pulsatile tinnitus
- Facial weakness or numbness with hearing changes
```

#### How to Communicate Urgency Without Causing Panic

| Urgency Level | Communication Approach | Example Script | Pitfalls to Avoid |
|--------------|----------------------|----------------|-------------------|
| URGENT | Direct but calm. State the need clearly. Help make the appointment NOW. | "I want to get you seen by a specialist today. This kind of sudden change responds best to treatment when it's caught early. Let me call the office right now and see if we can get you in." | Don't say "emergency" (triggers panic). Don't diagnose ("you might have a tumor"). Don't minimize ("it's probably nothing but..."). |
| PRIORITY | Reassuring but action-oriented. Set a timeline. | "Your hearing test shows a difference between your ears that I'd like a specialist to check. Most of the time this turns out to be nothing serious, but it's important to get it looked at in the next few weeks. I'll send over your results with a referral." | Don't over-reassure ("I'm sure it's fine"). Don't delay without reason. Don't leave the patient without a clear next step. |
| ROUTINE | Informational. Frame as thoroughness, not concern. | "Part of a thorough hearing evaluation is making sure there's nothing else going on. I'd like to have an ENT doctor take a look, just as a routine step. There's no rush, but let's get it scheduled." | Don't make it sound optional if it's clinically indicated. Don't burden the patient with worst-case scenarios. |

#### What Information to Include in a Referral

Checklist format (matches existing ReferralsPage Tab 4 content):

1. Patient demographics and contact information
2. Audiogram (air, bone, masked thresholds at all tested frequencies)
3. Speech audiometry (SRT, WRS, presentation levels, masking if used)
4. Tympanometry and acoustic reflex results (if available)
5. The specific clinical concern prompting the referral
6. Duration and onset of symptoms (sudden vs. gradual)
7. Relevant history (noise exposure, ototoxic medications, family history, prior evaluations)
8. Your clinical impression (NOT a diagnosis — describe the findings and your concern)

---

### 6.5 Section 5: Audiogram-Specific Decision Guidance

This section provides a cross-reference table linking each audiogram pattern (from `AUDIOGRAM_PATTERNS_SPEC.md`) to its most likely decision pathway.

| Audiogram Pattern | Primary Decision Pathway | Secondary | Key Decision Point | Link |
|-------------------|------------------------|-----------|-------------------|------|
| Flat Mild-Moderate SNHL | Adjust + Counsel | — | Acclimatization management vs. technical adjustment | → Patterns guide |
| Sloping HF SNHL | Adjust + Counsel | — | Open vs. closed fitting; noise expectation management | → Patterns guide |
| Severe-Profound Flat | Adjust + Counsel + Refer (CI?) | Refer | CI candidacy if aided WRS < 50% | → Patterns guide |
| Cookie-Bite | Adjust + Counsel | — | Spectral naturalness; multiple follow-ups expected | → Patterns guide |
| Rising Loss | Adjust + Counsel | — | Occlusion management is THE challenge | → Patterns guide |
| Unilateral HL | Refer + Counsel | Adjust | ALWAYS refer for etiology; counsel on monaural limits | → Patterns guide |
| Asymmetric SNHL | Refer + Adjust | — | ALWAYS refer for MRI; fit bilaterally if appropriate | → Patterns guide |
| Conductive Loss | Refer | Adjust (after clearance) | MUST refer before fitting; medical/surgical treatment may resolve | → Patterns guide |
| Mixed Loss | Refer + Adjust | Counsel | Refer for conductive component; fit to air conduction after clearance | → Patterns guide |
| Normal PTA, Poor WRS | Refer | Counsel | MUST refer for retrocochlear workup; do NOT fit aids | → Patterns guide |
| NIHL (4 kHz Notch) | Adjust + Counsel | — | Tinnitus management; hearing protection counseling | → Patterns guide |
| Presbycusis | Adjust + Counsel | — | Acclimatization is the primary challenge; family involvement essential | → Patterns guide |

**Note:** Each row links to the corresponding pattern in the Audiogram Patterns guide for full clinical detail.

---

### 6.6 Section 6: Common Clinical Scenarios (Worked Examples)

Each scenario is presented as an interactive card. The student reads the scenario, selects their answer (Adjust / Counsel / Refer), and then sees the expert reasoning.

#### Scenario 1: New Patient, Flat Mild Loss, "Too Loud" After 1 Week

**Patient:** 68-year-old female, first-time hearing aid user
**Audiogram:** Bilateral flat mild-moderate SNHL (PTA 40 dB HL bilateral)
**WRS:** 92% bilateral
**Complaint:** "Everything is too loud. The refrigerator, the air conditioning, my own chewing. I've been wearing them about 4 hours a day."
**Time context:** 1 week post-fitting
**Additional info:** REM shows gain within 3 dB of NAL-NL2 target across all frequencies. Patient was started at 90% of target.

**Correct decision:** COUNSEL (primarily) + possible minor ADJUST

**Reasoning:** This is classic acclimatization. The patient is hearing sounds she hasn't heard in years (refrigerator, AC) because her hearing loss developed gradually. The fitting is technically correct (REM on target). She's only wearing them 4 hours/day and it's only been 1 week.

**Action plan:**
1. Validate her experience: "What you're experiencing is completely normal. Your brain is rediscovering sounds it hasn't heard clearly in years."
2. Provide a wearing schedule: "Try to increase by 1-2 hours each day. By week 3, aim for all waking hours."
3. Reassure with a timeline: "Most patients tell me that by weeks 2-3, these sounds fade into the background."
4. Minor adjustment only if she's truly unable to tolerate: reduce overall gain by 2-3 dB with a plan to increase at next visit.
5. Schedule follow-up in 1-2 weeks.

**Common wrong answer:** ADJUST (reduce gain significantly)

**Why it's wrong:** Reducing gain significantly at this stage creates a below-target fitting that the patient adapts to — she'll need even more time to reach her actual prescriptive target later. The brain adapts to what it's given. Give it the right target and let it adapt. Minor reduction (2-3 dB) is acceptable; major reduction (5-10 dB) undermines the fitting.

---

#### Scenario 2: Patient with Sloping Loss, "Whistling When I Hug Someone"

**Patient:** 55-year-old male, wearing aids for 6 months
**Audiogram:** Bilateral sloping HF SNHL (PTA 35 dB, 4 kHz at 65 dB)
**WRS:** 88% bilateral
**Complaint:** "The aids whistle every time I hug my wife or put on a hat. It's embarrassing."
**Time context:** 6 months post-fitting; otherwise happy with aids
**Additional info:** Currently fitted with open domes on RIC devices. Feedback management is enabled.

**Correct decision:** ADJUST

**Reasoning:** This is a clear fitting problem. Feedback occurs when amplified sound leaks from the ear canal back to the microphone. The open dome provides insufficient seal when external pressure changes (hugging, hat). This is not an expectation problem (hugging shouldn't cause whistling) and not a medical problem. It's a solvable acoustic issue.

**Action plan:**
1. Try closed domes: these provide better seal while maintaining some openness for low-frequency naturalness.
2. If closed domes resolve feedback: done. Counsel that some minimal feedback in extreme situations (pressing directly on the receiver) is normal.
3. If closed domes are insufficient: custom mold with medium vent. This is more sealed but still allows natural low-frequency perception.
4. Do NOT reduce high-frequency gain as the first response — this sacrifices the speech clarity benefit the patient has been enjoying for 6 months.
5. Verify that feedback management algorithm is set to maximum effective level.

**Common wrong answer:** COUNSEL ("feedback during hugging is normal, just avoid pressing on them")

**Why it's wrong:** While some feedback in extreme situations is expected, regular feedback during normal activities (hugging) indicates a coupling problem that can and should be solved. Telling a patient to avoid hugging is not acceptable clinical practice. Fix the fitting.

---

#### Scenario 3: Patient with Asymmetric Loss, One Ear Much Worse

**Patient:** 52-year-old male, came in for routine hearing test
**Audiogram:** Right ear: sloping SNHL, PTA 55 dB. Left ear: mild flat SNHL, PTA 25 dB. Asymmetry of 20-35 dB at 1-4 kHz.
**WRS:** Right ear 64% at 2kHz+30 dB. Left ear 96% at 2kHz+30 dB.
**Complaint:** "I don't think I hear as well on the right side."
**Time context:** First visit; no prior hearing evaluation
**Additional info:** No history of noise exposure, ear surgery, or known cause for asymmetry. No vestibular symptoms.

**Correct decision:** REFER (priority) + ADJUST (bilateral fitting appropriate concurrently)

**Reasoning:** Asymmetric SNHL of >= 15 dB at 3+ frequencies, without a known cause, meets referral criteria for MRI to rule out vestibular schwannoma. The WRS asymmetry (64% vs. 96%) further strengthens the referral indication. However, the hearing loss itself is aidable in both ears, so proceeding with bilateral fitting while the referral is being processed is appropriate.

**Action plan:**
1. REFER: Write a priority referral to ENT/otologist for MRI with gadolinium. Include full audiogram, WRS results, and the specific concern (asymmetric SNHL, disproportionately poor right WRS).
2. COUNSEL: Explain the referral calmly: "I noticed that your hearing is different between your two ears, and I'd like a specialist to take a closer look. Most of the time this turns out to be nothing concerning, but it's an important step."
3. FIT: Proceed with bilateral hearing aid fitting. The referral does not preclude amplification — the patient has hearing loss that affects daily life.
4. FOLLOW UP: Contact the patient to confirm the referral appointment was made.

**Common wrong answer:** ADJUST only (fit hearing aids without referring)

**Why it's wrong:** Fitting hearing aids without investigating the cause of the asymmetry misses a potential vestibular schwannoma. The referral is non-negotiable. "I'll fit the aids and we'll monitor" is not appropriate when referral criteria are clearly met.

---

#### Scenario 4: Patient Frustrated That Aids Don't Help in Noise

**Patient:** 72-year-old female, wearing aids for 2 years
**Audiogram:** Bilateral sloping HF SNHL (PTA 45 dB, 4 kHz at 70 dB)
**WRS:** 76% bilateral (consistent with cochlear loss at this degree)
**Complaint:** "These hearing aids are useless at restaurants. I spent a lot of money and I still can't hear in noise. I want to return them."
**Time context:** 2 years of consistent use; 3 prior adjustment visits; aids are well-fitted (REM on target)
**Additional info:** Current aids have directional microphones, noise reduction, and a "restaurant" program. All features are enabled and functioning.

**Correct decision:** COUNSEL (primarily)

**Reasoning:** The fitting is correct. The features are enabled. The patient has been using the aids successfully for 2 years in most situations. The complaint is specifically about high-noise environments (restaurants). This is a fundamental limitation of amplification: in high noise, SNR is poor, and hearing aids cannot create speech signal where there is none. The patient's expectations exceed what the technology can deliver.

**Action plan:**
1. VALIDATE: "I understand your frustration. Restaurant noise is the #1 challenge for hearing aid users — you're not alone."
2. DEMONSTRATE: Show the patient what the aids ARE doing by removing them briefly in a quiet setting. "Even though restaurants are hard, think about how much better conversations are at home, on the phone, at the store."
3. EXPLAIN: "In very noisy places, even people with normal hearing struggle. The noise level in some restaurants exceeds 85 dB — that drowns out speech for everyone."
4. STRATEGIZE: Offer concrete strategies: sit at quieter tables, choose less noisy restaurants, use the remote microphone (recommend one if not already using), face the speaker, reduce distance.
5. RECOMMEND: A remote microphone system is the single most effective tool for noise. If the patient doesn't have one, this is the time to recommend it.
6. Do NOT return the aids — the patient benefits from them in most situations. The restaurant problem is real, but returning aids won't solve it.

**Common wrong answer:** ADJUST (increase gain, change noise program settings)

**Why it's wrong:** The aids are already on target and all noise features are enabled. Further gain increases in noise won't help — the noise is amplified along with the speech. Aggressive noise reduction can reduce noise awareness but degrades speech quality. The fundamental issue is SNR, not fitting.

---

#### Scenario 5: Elderly Patient, Good Word Scores, Just Wants Volume

**Patient:** 83-year-old male, lives alone, came at daughter's request
**Audiogram:** Bilateral mild flat SNHL (PTA 30 dB HL)
**WRS:** 96% bilateral (excellent)
**Complaint:** "The TV is a little quiet sometimes. My daughter thinks I need hearing aids. I hear fine."
**Time context:** First visit
**Additional info:** Patient is independent, active, cognitively sharp. Admits to asking people to repeat occasionally but says "that's normal at my age."

**Correct decision:** COUNSEL (primarily) + ADJUST (if patient is willing)

**Reasoning:** This is a counseling-first scenario. The patient has a genuine hearing loss (mild SNHL is still a loss), and the WRS confirms the cochlea can benefit from amplification. However, the patient's motivation is low — he's here because his daughter asked, not because he perceives a significant problem. Forcing hearing aids on an unwilling patient leads to rejection.

**Action plan:**
1. VALIDATE: "You're right that some of what you're experiencing is common. Your hearing test does show a mild change, and your ability to understand speech is excellent."
2. EDUCATE: "The research shows that even mild hearing loss can lead to listening fatigue and can contribute to cognitive changes over time. Addressing it early, when it's mild, gives the best results."
3. DEMONSTRATE: If available, do a brief amplified listening demo. Let the patient experience what amplification sounds like in a controlled setting.
4. RESPECT AUTONOMY: "I'd recommend trying hearing aids, but it's your decision. Here's what I suggest: a 30-day trial so you can experience them in your daily life with no commitment."
5. INVOLVE FAMILY: With permission, include the daughter in the discussion. Her observations may illuminate situations the patient isn't aware of (e.g., TV volume, missed doorbell, phone difficulty).
6. Don't push hard. Plant the seed. The patient may return in 6-12 months when the loss has progressed or when a specific situation motivates them.

**Common wrong answer:** ADJUST (fit hearing aids immediately because the audiogram shows loss)

**Why it's wrong:** Fitting hearing aids on an unmotivated patient leads to "drawer aids" — aids that sit unused. The audiogram alone does not dictate treatment. The patient's readiness, motivation, and self-perceived difficulty are equally important. A mild loss with excellent WRS in a patient who doesn't feel impaired is a counseling case, not a fitting case — unless the patient becomes willing after the conversation.

---

### 6.7 Section 7: The Tradeoff Communication Framework

#### How to Explain Tradeoffs in Plain Language

**Principles:**

1. **Name both sides honestly.** "We can do X, but it means less of Y." Don't hide the downside.
2. **Use analogies.** Patients understand tradeoffs in other domains (car with better gas mileage has less horsepower; bigger phone screen means bigger phone).
3. **Quantify when possible.** "This change will make your own voice sound more natural, but you'll hear about 10% less volume in low-pitched sounds."
4. **Present it as a choice, not a prescription.** "Here are your options. Let's figure out which one works best for your life."
5. **Acknowledge that both options are valid.** "There's no wrong choice here — it depends on what matters most to you."

#### Example Scripts

**Occlusion vs. Open Fit:**
> "Right now your hearing aids are completely open — that keeps your own voice sounding natural and your ears feeling comfortable. The tradeoff is that we can't give you as much volume in the low-pitched sounds. We could switch to a tighter fitting, which would give you more fullness to sounds, but your own voice would sound louder and more 'echoey' to you. Which matters more to you — natural own-voice or fuller sound?"

**Shared decision question:** "Would you rather sounds feel natural, even if a bit thin, or fuller, even if your own voice is louder?"

---

**Gain vs. Feedback:**
> "I can increase the volume to help you hear better in some situations, but if I go too high, you'll start hearing a whistling sound — that's the hearing aid feeding back. Think of it like turning up a microphone near a speaker. We need to find the sweet spot: enough volume to help you hear clearly, but not so much that it whistles."

**Shared decision question:** "If I increase the volume a little and there's occasional whistling when you put on a hat or lean against something, is that an acceptable trade for better hearing?"

---

**Clarity vs. Naturalness:**
> "I can make speech crisper and clearer by turning up the high-pitched sounds. This helps with consonants — the sounds that separate 'cat' from 'hat.' The downside is that sounds may feel sharper or more 'tinny' until your brain adjusts. Some people prefer a more natural, mellow sound even if it's a bit less clear. What would you prefer: sharper clarity or more natural sound?"

**Shared decision question:** "What's more important to you right now — understanding every word, or having sounds feel natural and comfortable?"

---

**Noise Reduction Aggressiveness:**
> "Your hearing aids can reduce background noise, which helps in noisy places. But the more aggressively we reduce noise, the more the hearing aid has to guess what's noise and what's speech — and sometimes it guesses wrong. An aggressive setting makes quiet places very comfortable but may muffle some soft voices. A gentle setting lets more speech through but also lets more noise through. What sounds better to you?"

**Shared decision question:** "Do you spend more time in noisy places where you want maximum noise reduction, or in quiet places where you want to catch every soft sound?"

---

#### Shared Decision-Making Model

The shared decision-making process for hearing aid tradeoffs follows these steps:

1. **Present the finding.** "Your hearing test shows X."
2. **Explain the options.** "We can approach this two ways: A or B."
3. **Describe each option's benefits and drawbacks.** "A gives you this, but costs you that. B gives you the opposite."
4. **Ask about the patient's priorities.** "Which of these matters more in your daily life?"
5. **Make a recommendation if asked.** "Based on what you've told me, I'd suggest starting with A, and we can always try B if it doesn't work out."
6. **Implement and follow up.** "Let's try this for two weeks and see how it goes."

#### Documentation Tips

| Category | What to Document | Example |
|----------|-----------------|---------|
| Clinical decision rationale | Why you chose to adjust, counsel, or refer | "Patient presents with sloping HF SNHL with 22 dB interaural asymmetry at 2-4 kHz. Referral to ENT for MRI recommended per AAA guidelines. Bilateral fitting initiated concurrently." |
| Patient-reported outcome | What the patient said, in their words | "Patient reports: 'The hearing aids work great at home but restaurants are still impossible.' — 2-year user, REM on target, all features optimized." |
| Tradeoff discussion | What options were presented and what the patient chose | "Discussed open vs. closed dome. Patient prefers open for own-voice naturalness despite reduced LF gain. Will monitor feedback." |
| Action plan | What was done, what was deferred, what needs follow-up | "Reduced overall gain by 3 dB for acclimatization comfort. Plan to increase to target at 2-week follow-up. Referred to ENT for asymmetry evaluation — priority." |
| Follow-up needs | What to check next time | "Follow-up in 2 weeks: 1) Increase gain toward target. 2) Confirm ENT referral was made. 3) Assess acclimatization progress." |

---

## 7. UI Layout

### 7.1 Page Header

```
CLINICAL DECISION-MAKING
A framework for responding to any clinical finding

When you encounter a finding, ask: Is this a fitting problem, an expectation problem, or a medical problem?
```

Typography h4 + subtitle1 + body2 tagline. Centered. Primary color.

### 7.2 Table of Contents (Desktop Sidebar)

```
+-------------------+
| IN THIS GUIDE     |
|                   |
| 1. Core Framework |
| 2. Adjustments    |
| 3. Counseling     |
| 4. Referrals      |
| 5. By Audiogram   |
| 6. Scenarios      |
| 7. Tradeoffs      |
+-------------------+
```

Sticky sidebar (`position: sticky; top: 80px`), visible only on desktop (`>= md`). Uses anchor links (`#section-1`, `#section-2`, etc.). Active section highlighted based on scroll position (Intersection Observer).

On mobile: collapsible `Accordion` at top of page. Collapses when a section is selected.

### 7.3 Core Framework Section

Three equal-width cards in a row (desktop) or stacked (mobile):

```
+-- ADJUST -----------+  +-- COUNSEL ----------+  +-- REFER -----------+
| [Tune icon]         |  | [Voice icon]        |  | [Hospital icon]    |
| Change the hearing  |  | Change the patient's|  | Send the patient   |
| aid settings        |  | understanding       |  | for evaluation     |
|                     |  |                     |  |                    |
| "Is this a fitting  |  | "Is this an         |  | "Is this a medical |
|  problem?"          |  |  expectation         |  |  problem?"         |
|                     |  |  problem?"          |  |                    |
| Examples:           |  | Examples:           |  | Examples:          |
| - Feedback          |  | - "Too loud" week 1 |  | - Asymmetric SNHL  |
| - Poor clarity      |  | - "Can't hear in    |  | - Sudden loss      |
| - Wrong vent        |  |   noise" (on target)|  | - Air-bone gap     |
+---------------------+  +---------------------+  +--------------------+
```

Below the cards: the discriminator checklist in a `Paper` component.

### 7.4 Decision Tree Sections (2, 3, 4)

Each section uses a consistent internal layout:

```
[Section heading with icon]
[Brief introduction paragraph]

+--- Primary content (tables, lists, cards) ---+
|                                               |
+-----------------------------------------------+

⚠ WARNING callout (Alert severity="warning")
  "When NOT to [action]" content

ℹ TIP callout (Alert severity="info")
  Clinical pearl or key principle
```

### 7.5 Audiogram Cross-Reference (Section 5)

Dense table with clickable rows:

```
+--------------------------------------------------------------------+
| Pattern        | Primary Path | Key Decision Point    | →           |
|----------------|-------------|----------------------|-------------|
| Flat Mild-Mod  | Adj+Counsel | Acclimatization mgmt | → Patterns  |
| Sloping HF     | Adj+Counsel | Open vs closed       | → Patterns  |
| ...            | ...         | ...                  | ...         |
+--------------------------------------------------------------------+
```

Each row has an `ArrowForward` icon that links to the pattern's page in the Audiogram Patterns guide.

### 7.6 Clinical Scenarios (Section 6)

Interactive cards with a reveal mechanism:

**Before answer:**
```
+-- Scenario 1: "Too Loud" After 1 Week ---------------------------------+
|                                                                          |
| 68F, first-time user, bilateral flat mild-moderate SNHL, PTA 40 dB,    |
| WRS 92%. Wearing aids 4 hrs/day for 1 week. REM on target at 90%.      |
| "Everything is too loud — the fridge, the AC, my chewing."              |
|                                                                          |
| What is the primary response?                                            |
|                                                                          |
| [ADJUST]    [COUNSEL]    [REFER]                                        |
+--------------------------------------------------------------------------+
```

**After answer (correct):**
```
+-- Scenario 1: "Too Loud" After 1 Week ------ ✓ CORRECT ----------------+
|                                                                          |
| [scenario text...]                                                       |
|                                                                          |
| CORRECT: COUNSEL (primarily) + possible minor ADJUST                     |
|                                                                          |
| Reasoning: This is classic acclimatization. The fitting is technically   |
| correct (REM on target). She's only 1 week in and wearing 4 hrs/day.   |
|                                                                          |
| Action plan:                                                             |
| 1. Validate her experience                                               |
| 2. Provide wearing schedule (increase by 1-2 hrs/day)                   |
| 3. Reassure: "By weeks 2-3 these sounds fade into background"          |
| 4. Minor gain reduction (2-3 dB) only if truly intolerable             |
| 5. Schedule follow-up in 1-2 weeks                                      |
|                                                                          |
| ⚠ Common mistake: Reducing gain significantly. This creates a          |
| below-target fitting that delays adaptation further.                     |
+--------------------------------------------------------------------------+
```

### 7.7 Tradeoff Communication (Section 7)

Script cards with a distinct visual treatment:

```
+-- Occlusion vs. Open Fit ------------------------------------------------+
| Context: Patient with sloping HF loss; currently open dome               |
|                                                                           |
| "Right now your hearing aids are completely open — that keeps your own    |
|  voice sounding natural and your ears feeling comfortable. The tradeoff   |
|  is that we can't give you as much volume in the low-pitched sounds..."  |
|                                                                           |
| ❓ Ask the patient:                                                      |
| "Would you rather sounds feel natural, even if a bit thin, or fuller,   |
|  even if your own voice is louder?"                                      |
+--------------------------------------------------------------------------+
```

Each script card uses a `FormatQuote` icon and italic text for the script body (matching ReferralsPage Tab 4 communication scripts pattern).

---

## 8. Content Review Requirements

### 8.1 SME Review Matrix

| Content Area | Can Be Generated | Requires SME Review | Notes |
|-------------|-----------------|--------------------|----|
| Core Framework (adjust/counsel/refer categories) | Yes | Yes — verify completeness and accuracy | Framework is standard in audiology education |
| Discriminator questions ("how to tell them apart") | Yes | **YES — critical** | Incorrect categorization could lead to wrong clinical action |
| Adjustment decision criteria | Yes | **YES — critical** | Must align with clinical best practice |
| Complaint prioritization order | Partially | **YES — critical** | Safety prioritization must be verified; order may vary by clinical setting |
| "When NOT to adjust" guidance | Partially | **YES — critical** | Over-adjusting can harm patient outcomes |
| Adaptation timeline phases | Yes | Yes | Verify timeframes match current clinical evidence |
| Realistic expectations content | Yes | Yes | Verify analogies and explanations are accurate |
| Communication scripts | No — should come from clinical educators | **YES — critical** | Scripts must be clinically appropriate, culturally sensitive, and non-paternalistic |
| Counseling strategies | Partially | **YES — critical** | Must balance motivation with patient autonomy |
| Referral criteria and urgency levels | Yes (from existing Referrals page) | **YES — patient safety** | Must match ReferralsPage content exactly; cross-verify |
| Red flag list | Yes (from existing Referrals page) | **YES — patient safety** | Must be complete and accurate |
| Audiogram cross-reference table | Yes (from Audiogram Patterns spec) | Yes | Must accurately map patterns to decision pathways |
| Clinical scenarios | No — ideally from clinical teaching faculty | **YES — critical** | Scenarios must be realistic; correct answers must be defensible; wrong-answer explanations must be accurate |
| Tradeoff communication scripts | No — should come from experienced clinicians | **YES — critical** | Scripts must be honest, non-manipulative, and respectful of patient autonomy |
| Documentation tips | Yes | Yes | Must align with clinical documentation standards (SOAP format, regulatory requirements) |

### 8.2 Cross-Reference Verification

Before publication, verify that:

1. All referral criteria match the Referrals page (`/assessment/referrals` / `referralData.ts`)
2. All red flags are identical to those in the Referrals page
3. All adjustment guidance is consistent with the Complaint-Based Adjustments page (`/hearing-aids/adjustments` / `complaintAdjustmentData.ts`)
4. All audiogram pattern references match the Audiogram Patterns page (AUDIOGRAM_PATTERNS_SPEC.md)
5. All earmold/coupling references are consistent with the Earmolds page (`/hearing-aids/earmolds` / `earmoldData.ts`)
6. Masking guidance references are consistent with the Masking Practice page
7. WRS references use the updated 2 kHz threshold method (per UX_REDESIGN_SPEC.md Section 8)

### 8.3 Scenarios: Quality Requirements

Each clinical scenario must meet these criteria:

1. **Realistic:** The audiometric data, patient demographics, and complaint must be clinically plausible
2. **Unambiguous:** The correct answer must be clearly defensible by clinical standards
3. **Educational:** The wrong-answer explanation must teach WHY the wrong answer is wrong, not just that it IS wrong
4. **Representative:** The scenario set should cover all three decision categories (adjust, counsel, refer) as primary answers
5. **Varied:** Scenarios should span different audiogram patterns, patient ages, experience levels, and complaint types
6. **Non-trivial:** The "obvious" answer should not always be correct — some scenarios should have counterintuitive correct answers to promote deeper reasoning

### 8.4 Integration Testing

Before publication, verify these user flows:

1. Student on Complaint-Based Adjustments page → clicks "Not sure whether to adjust or counsel?" alert → lands on Clinical Decision page Section 1
2. Student on Referrals page → clicks clinical decision framework link → lands on Clinical Decision page Section 4
3. Student on Clinical Decision page → clicks audiogram pattern in cross-reference table → lands on correct pattern in Audiogram Patterns page
4. Student on Audiogram Patterns page → clicks "See Clinical Decision-Making guide" in Adjust vs Counsel section → lands on Clinical Decision page Section 1
5. Student on Clinical Decision page → reads scenario with referral → clicks referral criteria link → lands on Referrals page Tab 1
