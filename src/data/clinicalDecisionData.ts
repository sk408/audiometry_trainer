/**
 * Clinical Decision-Making Data — framework content, decision trees, scenarios,
 * and tradeoff communication guides.
 *
 * All clinical content sourced from CLINICAL_DECISION_SPEC.md.
 * All clinical content requires SME review before publication.
 */

// ---------------------------------------------------------------------------
// Core Framework
// ---------------------------------------------------------------------------

export type DecisionCategory = 'adjust' | 'counsel' | 'refer';

export interface DecisionCategoryInfo {
  id: DecisionCategory;
  label: string;
  icon: string;
  color: string;
  definition: string;
  centralQuestion: string;
  examples: string[];
}

export interface CategoryDiscriminator {
  question: string;
  ifYes: DecisionCategory;
  explanation: string;
}

// ---------------------------------------------------------------------------
// Adjustment Decision Tree
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Counseling Decision Tree
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Referral Decision Tree
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Audiogram Cross-Reference
// ---------------------------------------------------------------------------

export interface AudiogramDecisionMapping {
  patternId: string;
  patternName: string;
  primaryPathway: DecisionCategory;
  secondaryPathway: DecisionCategory | null;
  rationale: string;
  keyDecisionPoint: string;
}

// ---------------------------------------------------------------------------
// Clinical Scenarios
// ---------------------------------------------------------------------------

export interface ClinicalScenario {
  id: string;
  title: string;
  patientDescription: string;
  audiogramSummary: string;
  complaint: string;
  timeContext: string;
  additionalInfo: string;
  correctDecision: DecisionCategory;
  secondaryDecision: DecisionCategory | null;
  reasoning: string;
  actionPlan: string[];
  commonWrongAnswer: DecisionCategory;
  whyWrongAnswerIsWrong: string;
}

// ---------------------------------------------------------------------------
// Tradeoff Communication
// ---------------------------------------------------------------------------

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

// ===========================================================================
// CONSTANTS
// ===========================================================================

// ---------------------------------------------------------------------------
// Section 1: Core Framework
// ---------------------------------------------------------------------------

export const DECISION_CATEGORIES: readonly DecisionCategoryInfo[] = [
  {
    id: 'adjust',
    label: 'Adjust',
    icon: 'Tune',
    color: 'primary',
    definition: 'Change the hearing aid settings to better match the patient\u2019s needs.',
    centralQuestion: 'Is this a fitting problem?',
    examples: [
      'Feedback (whistling) during normal activities',
      'Poor speech clarity that maps to a gain/compression parameter',
      'Wrong vent or coupling causing occlusion',
      'Sound quality complaint tied to a specific frequency region',
    ],
  },
  {
    id: 'counsel',
    label: 'Counsel',
    icon: 'RecordVoiceOver',
    color: 'success',
    definition: 'Change the patient\u2019s understanding or expectations about what hearing aids can do.',
    centralQuestion: 'Is this an expectation problem?',
    examples: [
      '"Too loud" in the first 1\u20132 weeks (acclimatization)',
      '"Can\'t hear in noise" when fitting is on target (fundamental limitation)',
      '"My old aids were better" when old aids were under-fit',
      'Comparing to unaided normal hearing',
    ],
  },
  {
    id: 'refer',
    label: 'Refer',
    icon: 'LocalHospital',
    color: 'error',
    definition: 'Send the patient elsewhere for medical or specialist evaluation.',
    centralQuestion: 'Is this a medical problem?',
    examples: [
      'Asymmetric SNHL requiring MRI to rule out vestibular schwannoma',
      'Sudden hearing loss (\u2264 72 hours) \u2014 medical emergency',
      'Conductive loss with air-bone gap needing ENT clearance',
      'Aided WRS < 50% \u2014 cochlear implant candidacy evaluation',
    ],
  },
];

export const CATEGORY_DISCRIMINATORS: readonly CategoryDiscriminator[] = [
  {
    question: 'Can I change a hearing aid parameter to address this?',
    ifYes: 'adjust',
    explanation: 'The hearing aid is technically capable of being changed to improve the situation.',
  },
  {
    question: 'Is the patient expecting something hearing aids cannot do?',
    ifYes: 'counsel',
    explanation: 'The limitation is fundamental (physics, biology), not a fitting choice.',
  },
  {
    question: 'Is there a finding that suggests pathology I cannot treat?',
    ifYes: 'refer',
    explanation: 'Medical intervention may be needed.',
  },
  {
    question: 'Is the patient in the normal adaptation period and the complaint is typical?',
    ifYes: 'counsel',
    explanation: 'Time and consistent use will resolve this.',
  },
  {
    question: 'Have I already adjusted for this complaint and it\u2019s not resolved?',
    ifYes: 'counsel',
    explanation: 'May need to shift from adjust to counsel, or from counsel to refer.',
  },
];

export const FITTING_PROBLEM_INDICATORS: readonly string[] = [
  'The complaint maps to a specific parameter (gain, compression, output, vent, coupling)',
  'The complaint appeared or changed after a fitting change',
  'The complaint is consistent (happens every time in the same situation)',
  'REM shows deviation from prescriptive target in the relevant frequency region',
];

export const EXPECTATION_PROBLEM_INDICATORS: readonly string[] = [
  'The complaint is about something hearing aids fundamentally cannot do (restore normal hearing, eliminate all background noise)',
  'The patient is comparing to unaided normal hearing or to someone else\u2019s experience',
  'The complaint is in the first 2\u20134 weeks and is about "loudness" or "strangeness" (acclimatization)',
  'The complaint persists despite technically correct fitting (REM on target)',
  'The patient says "my old aids were better" when the old aids were under-fit',
];

export const MEDICAL_PROBLEM_INDICATORS: readonly string[] = [
  'Audiometric findings that match referral criteria (asymmetry, sudden change, air-bone gap, poor WRS)',
  'Symptoms beyond hearing (pain, drainage, vertigo, facial numbness)',
  'Progressive worsening not explained by aging',
  'Findings inconsistent with the hearing aid fitting (i.e., the complaint isn\u2019t about the aids)',
];

export interface CombinationInfo {
  combination: string;
  description: string;
  example: string;
}

export const COMMON_COMBINATIONS: readonly CombinationInfo[] = [
  {
    combination: 'Adjust + Counsel',
    description: 'Most common combination. Adjust the fitting AND counsel on expectations.',
    example: 'Reduce gain for loudness complaint AND counsel on acclimatization.',
  },
  {
    combination: 'Refer + Fit',
    description: 'Referral needed but hearing aids are also appropriate.',
    example: 'Asymmetric SNHL \u2014 refer for MRI but proceed with bilateral fitting.',
  },
  {
    combination: 'Refer + Counsel',
    description: 'Referral needed; hearing aids are NOT appropriate yet.',
    example: 'Conductive loss \u2014 refer for medical eval; counsel that treatment may restore hearing.',
  },
  {
    combination: 'All Three',
    description: 'Adjust current fitting, counsel on realistic expectations, AND refer for additional evaluation.',
    example: 'Patient with progressive asymmetric loss and complaints about current fitting.',
  },
];

// ---------------------------------------------------------------------------
// Section 2: Adjustment Decision Tree
// ---------------------------------------------------------------------------

export const ADJUSTMENT_CRITERIA: readonly AdjustmentCriterion[] = [
  {
    criterion: 'The complaint maps to a specific adjustable parameter',
    explanation: 'You can identify which gain, compression, output, vent, or coupling change would address the issue.',
  },
  {
    criterion: 'The patient\u2019s audiogram and WRS support the adjustment',
    explanation: 'The ear can benefit from the change (i.e., the limitation isn\u2019t neural).',
  },
  {
    criterion: 'The adjustment does not violate prescriptive targets without good reason',
    explanation: 'Deviating from NAL-NL2 or DSL targets should be a conscious, documented choice.',
  },
  {
    criterion: 'The complaint is not in the first 1\u20132 weeks of a new fitting',
    explanation: 'Acclimatization-period complaints often resolve on their own.',
  },
];

export const INFORMATION_BEFORE_ADJUSTING: readonly { information: string; whyItMatters: string }[] = [
  { information: 'Current hearing aid settings (gain, compression, output, features)', whyItMatters: 'Need baseline to know what to change' },
  { information: 'Prescriptive target vs. current output (REM if available)', whyItMatters: 'Determines whether the aid is already on target or deviating' },
  { information: 'Patient\u2019s audiogram (current \u2014 have thresholds changed?)', whyItMatters: 'Loss may have changed since last fitting; adjusting to old audiogram is wrong' },
  { information: 'Duration of use (hours/day, days since fitting)', whyItMatters: 'Short use may indicate acclimatization issue, not fitting issue' },
  { information: 'Specific situation where complaint occurs', whyItMatters: 'Adjustments should target the problematic situation, not change everything' },
  { information: 'Previous adjustments made', whyItMatters: 'Avoid ping-ponging between settings; track what\u2019s been tried' },
  { information: 'WRS (is speech understanding reasonable for the loss?)', whyItMatters: 'If WRS is poor, no adjustment will fix clarity complaints' },
];

export const ADJUSTMENT_PRIORITIZATION: readonly AdjustmentPrioritization[] = [
  {
    priority: 1,
    category: 'Safety / Medical concerns',
    rationale: 'Patient safety first; medical issues may explain other complaints',
    examples: ['Pain', 'Sudden change', 'Vertigo', 'Drainage'],
  },
  {
    priority: 2,
    category: 'Basic audibility',
    rationale: 'If the patient can\u2019t hear, no other adjustment matters',
    examples: ['"I can\u2019t hear at all"', '"Everything is too quiet"'],
  },
  {
    priority: 3,
    category: 'Loudness tolerance',
    rationale: 'If sounds are painfully loud, the patient will stop wearing the aids',
    examples: ['"Loud sounds hurt"', '"I jump at every noise"'],
  },
  {
    priority: 4,
    category: 'Feedback',
    rationale: 'Feedback is distracting and socially embarrassing; prevents consistent use',
    examples: ['"Whistling"', '"Squealing when I hug someone"'],
  },
  {
    priority: 5,
    category: 'Speech clarity',
    rationale: 'The primary goal of amplification; address after audibility and comfort',
    examples: ['"Can\u2019t understand speech"', '"People mumble"'],
  },
  {
    priority: 6,
    category: 'Sound quality',
    rationale: 'Important for satisfaction but not for basic function',
    examples: ['"Tinny"', '"Hollow"', '"Robotic"'],
  },
  {
    priority: 7,
    category: 'Comfort / cosmetic',
    rationale: 'Address last; these are lower-impact on function',
    examples: ['"Ear feels full"', '"Don\u2019t like how it looks"'],
  },
];

export const WHEN_NOT_TO_ADJUST: readonly WhenNotToAdjust[] = [
  {
    situation: 'Patient is in the first 1\u20132 weeks of a new fitting and complaints are about loudness or "strangeness"',
    reason: 'Acclimatization in progress; the brain needs time to adapt',
    whatToDo: 'Counsel on timeline; reduce gain only if truly intolerable; schedule follow-up in 1\u20132 weeks',
  },
  {
    situation: 'REM shows gain is on prescriptive target and the complaint is about "clarity" in noise',
    reason: 'Hearing aids have fundamental limits in noise; the fitting is correct',
    whatToDo: 'Counsel on noise limitations; recommend communication strategies; consider remote mic',
  },
  {
    situation: 'The patient\u2019s WRS is poor (<50%) and they complain about speech understanding',
    reason: 'The limiting factor is neural/cochlear, not the hearing aid',
    whatToDo: 'Counsel that amplification improves detection but cannot restore neural processing; consider CI evaluation if appropriate',
  },
  {
    situation: 'The complaint changes each visit (different complaint every time)',
    reason: 'Pattern suggests unrealistic expectations or psychological factors',
    whatToDo: 'Shift to counseling; explore underlying concerns; consider referral to support services',
  },
  {
    situation: 'The patient is comparing to unaided normal hearing',
    reason: 'No hearing aid matches normal hearing; the comparison is unrealistic',
    whatToDo: 'Counsel on what amplification can and cannot do; focus on demonstrating benefit vs. unaided, not vs. normal',
  },
  {
    situation: 'A family member is complaining but the patient is satisfied',
    reason: 'The patient\u2019s perception is primary; family concerns may be about the family member\u2019s expectations',
    whatToDo: 'Counsel the family member; demonstrate aided benefit; offer communication strategies for both parties',
  },
];

// ---------------------------------------------------------------------------
// Section 3: Counseling Decision Tree
// ---------------------------------------------------------------------------

export const ADAPTATION_TIMELINE: readonly AdaptationTimeline[] = [
  {
    phase: 'Initial shock',
    timeframe: 'Days 1\u20133',
    whatToExpect: 'Everything sounds loud, sharp, or strange. Own voice may sound different. Environmental sounds (traffic, fan, fridge) are suddenly noticeable.',
    whenToIntervene: 'Only if the patient is in physical discomfort or refuses to wear the aids at all. Minor loudness complaints are normal.',
  },
  {
    phase: 'Adjustment',
    timeframe: 'Days 3\u201314',
    whatToExpect: 'Loudness perception begins normalizing. Some sounds still seem "too much." Hearing fatigue is common. Patient may need breaks.',
    whenToIntervene: 'If complaints are WORSENING rather than improving, or if a specific sound is consistently problematic (feedback, specific noise).',
  },
  {
    phase: 'Integration',
    timeframe: 'Weeks 2\u20136',
    whatToExpect: 'Amplified sound begins to feel normal. Speech understanding improves as the brain adapts. Patient starts wearing aids all day.',
    whenToIntervene: 'If there is no improvement after 4 weeks of consistent use, the fitting may need adjustment. Schedule a follow-up.',
  },
  {
    phase: 'Settled',
    timeframe: 'Weeks 6+',
    whatToExpect: 'The patient considers the aids "part of life." Removing them feels like losing hearing again. Sound quality complaints stabilize.',
    whenToIntervene: 'Remaining complaints at this point are legitimate fitting issues or realistic-expectation counseling targets.',
  },
];

export const REALISTIC_EXPECTATIONS: readonly RealisticExpectation[] = [
  {
    expectation: '"I should hear like I used to"',
    reality: 'Hearing aids amplify sound; they don\u2019t restore normal hearing. Neural processing, frequency resolution, and temporal resolution are all reduced by SNHL.',
    howToExplain: '"Hearing aids are like glasses for your ears \u2014 they help a lot, but just as reading glasses don\u2019t give you 20-year-old eyes, hearing aids work with the hearing you have now. They make sounds louder and clearer, but they work through your hearing system, which has changed."',
  },
  {
    expectation: '"I should understand everyone in every situation"',
    reality: 'Background noise degrades speech understanding for everyone, and more so for people with hearing loss. No hearing aid eliminates background noise.',
    howToExplain: '"Even people with perfect hearing struggle to understand in very noisy places. Hearing aids help a lot in moderate noise, but very noisy environments like busy restaurants are challenging for everyone. Let\u2019s talk about some strategies that help beyond what the hearing aids do."',
  },
  {
    expectation: '"The hearing aids should be invisible"',
    reality: 'Modern aids are small, but they are not invisible. Some configurations (BTE with custom mold) are larger. Size is often a function of clinical need.',
    howToExplain: '"We\u2019ve come a long way \u2014 most people won\u2019t notice your hearing aids. But for your hearing loss, we need [specific style] to give you the best hearing. Let\u2019s focus on what sounds good rather than what looks good, and I think you\u2019ll find most people notice your hearing aid less than you think."',
  },
  {
    expectation: '"I should hear perfectly on the phone"',
    reality: 'Telephone coupling depends on aid style, phone model, and coupling method. Some combinations work better than others.',
    howToExplain: '"Phone calls take a bit of practice. Let\u2019s try a few different approaches \u2014 [streaming/telecoil/acoustic] \u2014 and find what works best with your phone."',
  },
  {
    expectation: '"My old aids were better"',
    reality: 'Often false memory; the old aids were typically under-fit and the patient adapted to reduced input. New aids at prescriptive target feel "too loud."',
    howToExplain: '"Your previous aids may have been set at a lower level than your hearing actually needs. These are set to give you more of the sounds you\u2019ve been missing. Give it two weeks \u2014 most patients tell me these are better once they adjust."',
  },
];

export const COUNSELING_WHEN_APPROPRIATE: readonly string[] = [
  'The patient is in the normal acclimatization window (first 2\u20134 weeks) and the complaint is about loudness, sound quality, or "strangeness"',
  'The fitting is verified correct by REM and the complaint is about a fundamental limitation of amplification',
  'The patient\u2019s WRS explains their difficulty (poor WRS = poor clarity regardless of fitting)',
  'The complaint is about a social/emotional aspect of hearing loss (stigma, isolation, frustration) rather than a technical fitting issue',
  'The patient is comparing to normal hearing or to another person\u2019s experience',
];

export const COUNSELING_STRATEGIES: readonly CounselingStrategy[] = [
  {
    scenario: 'Setting initial expectations at the fitting',
    approach: 'Frame aids as a tool, not a cure; set a timeline for adaptation',
    exampleScript: '"These hearing aids are going to make a real difference. The first few days may feel a bit strange \u2014 sounds you haven\u2019t heard in a while will seem loud. That\u2019s normal and it gets better. Let\u2019s plan to check in next week to see how you\u2019re doing."',
  },
  {
    scenario: 'Responding to "these don\u2019t work"',
    approach: 'Validate the frustration; investigate specifics; demonstrate benefit',
    exampleScript: '"I hear you \u2014 that\u2019s frustrating. Let\u2019s figure out exactly what\u2019s happening. Can you tell me about the specific situation where they aren\u2019t working? ... [After investigation] Let me show you something \u2014 let\u2019s take them out for a moment ... [remove aids, speak at same level] ... Now put them back in. Can you hear the difference? The aids are doing a lot \u2014 let\u2019s fine-tune them so they do even more."',
  },
  {
    scenario: 'Addressing adaptation resistance',
    approach: 'Normalize the experience; provide a structured wearing schedule',
    exampleScript: '"What you\u2019re experiencing is very normal. Your brain is relearning how to process sounds it hasn\u2019t heard clearly in years. I recommend starting with 4\u20136 hours a day in quiet environments, then gradually increasing. By the end of the second week, try wearing them all day. Each day gets easier."',
  },
  {
    scenario: 'Managing family expectations',
    approach: 'Include family in the conversation; educate about realistic improvements',
    exampleScript: '"You\u2019re right that [patient name] can hear better with the aids, but hearing aids don\u2019t make hearing perfect. In noisy places, even with the best aids, speech can be hard to follow. Here are some things that will help both of you: face each other when talking, reduce background noise when possible, and get their attention before starting a conversation."',
  },
];

export const THERAPEUTIC_TRIAL_STEPS: readonly string[] = [
  'At the fitting, explain the trial concept and set a specific duration (e.g., "Let\u2019s agree that you\u2019ll wear these for at least 3 weeks before we decide how well they\u2019re working")',
  'Provide a wearing schedule (gradually increase hours per day)',
  'Ask the patient to keep a brief log of situations where aids helped and where they didn\u2019t',
  'Schedule a follow-up at the end of the trial to review the log and make adjustments based on real-world experience rather than first impressions',
];

// ---------------------------------------------------------------------------
// Section 4: Referral Decision Tree
// ---------------------------------------------------------------------------

export const REFERRAL_PATHWAYS: readonly ReferralPathway[] = [
  {
    type: 'medical',
    subtype: 'Sudden SNHL',
    criteria: ['\u2265 30 dB over 3 frequencies within 72 hours'],
    urgency: 'urgent',
    referTo: 'ENT / Emergency',
    whatToInclude: ['Audiogram', 'Onset time', 'Symptom description'],
  },
  {
    type: 'medical',
    subtype: 'Active ear drainage with fever',
    criteria: ['Visible drainage', 'Elevated temperature'],
    urgency: 'urgent',
    referTo: 'ENT / Urgent Care',
    whatToInclude: ['Otoscopy findings', 'Temperature', 'Duration'],
  },
  {
    type: 'medical',
    subtype: 'Sudden vertigo with hearing loss',
    criteria: ['Acute onset vertigo', 'Concurrent hearing change'],
    urgency: 'urgent',
    referTo: 'ENT / ER',
    whatToInclude: ['Audiogram', 'Balance symptoms', 'Timeline'],
  },
  {
    type: 'medical',
    subtype: 'Asymmetric SNHL',
    criteria: ['\u2265 15 dB at 3+ frequencies without known cause'],
    urgency: 'priority',
    referTo: 'ENT / Otologist',
    whatToInclude: ['Audiogram with masked thresholds', 'WRS both ears'],
  },
  {
    type: 'medical',
    subtype: 'Unilateral tinnitus (new onset)',
    criteria: ['New onset', 'Unilateral presentation'],
    urgency: 'priority',
    referTo: 'ENT / Otologist',
    whatToInclude: ['Duration', 'Character (pulsatile?)', 'Associated symptoms'],
  },
  {
    type: 'medical',
    subtype: 'Pulsatile tinnitus',
    criteria: ['Tinnitus synchronous with heartbeat'],
    urgency: 'priority',
    referTo: 'ENT / Vascular',
    whatToInclude: ['Whether objective or subjective', 'Associated symptoms'],
  },
  {
    type: 'medical',
    subtype: 'Conductive loss without medical clearance',
    criteria: ['Air-bone gap present', 'No prior ENT evaluation'],
    urgency: 'routine',
    referTo: 'ENT',
    whatToInclude: ['Audiogram with BC thresholds', 'Tympanometry if available'],
  },
  {
    type: 'medical',
    subtype: 'Pain (otalgia) persistent or severe',
    criteria: ['Persistent ear pain', 'Severe intensity'],
    urgency: 'priority',
    referTo: 'ENT / Primary Care',
    whatToInclude: ['Location', 'Duration', 'Associated symptoms'],
  },
  {
    type: 'audiological',
    subtype: 'CI candidacy evaluation',
    criteria: ['Aided WRS < 50% best-aided condition'],
    urgency: 'routine',
    referTo: 'CI center / Otologist',
    whatToInclude: ['Audiogram', 'Aided and unaided WRS', 'Hearing aid history'],
  },
  {
    type: 'audiological',
    subtype: 'Vestibular assessment',
    criteria: ['Persistent vertigo / balance difficulty'],
    urgency: 'routine',
    referTo: 'Vestibular audiologist / ENT',
    whatToInclude: ['Symptom description', 'Audiogram', 'Duration and triggers'],
  },
  {
    type: 'audiological',
    subtype: 'Tinnitus management program',
    criteria: ['Severe tinnitus impacting daily life'],
    urgency: 'routine',
    referTo: 'Tinnitus specialist / psychologist',
    whatToInclude: ['Tinnitus characteristics', 'Impact on daily life', 'Audiogram'],
  },
  {
    type: 'audiological',
    subtype: 'APD evaluation',
    criteria: ['Auditory processing complaints with normal audiogram'],
    urgency: 'routine',
    referTo: 'Audiologist specializing in APD',
    whatToInclude: ['Audiogram', 'Specific processing complaints', 'Cognitive screening if available'],
  },
];

export const CLINICAL_RED_FLAGS: readonly RedFlagItem[] = [
  { sign: 'Sudden hearing loss (< 72 hours)', urgency: 'urgent', action: 'This is a medical emergency \u2014 refer same day' },
  { sign: 'Acute vertigo with hearing loss and/or tinnitus', urgency: 'urgent', action: 'Refer to ENT / ER immediately' },
  { sign: 'Active ear drainage with fever or pain', urgency: 'urgent', action: 'Refer to ENT / Urgent Care' },
  { sign: 'Unilateral pulsatile tinnitus', urgency: 'urgent', action: 'Refer to ENT / Vascular for evaluation' },
  { sign: 'Facial weakness or numbness with hearing changes', urgency: 'urgent', action: 'Refer to ENT / ER immediately' },
];

export const URGENCY_COMMUNICATION: readonly UrgencyCommunication[] = [
  {
    urgency: 'urgent',
    approach: 'Direct but calm. State the need clearly. Help make the appointment NOW.',
    exampleScript: '"I want to get you seen by a specialist today. This kind of sudden change responds best to treatment when it\u2019s caught early. Let me call the office right now and see if we can get you in."',
    pitfalls: [
      'Don\u2019t say "emergency" (triggers panic)',
      'Don\u2019t diagnose ("you might have a tumor")',
      'Don\u2019t minimize ("it\u2019s probably nothing but...")',
    ],
  },
  {
    urgency: 'priority',
    approach: 'Reassuring but action-oriented. Set a timeline.',
    exampleScript: '"Your hearing test shows a difference between your ears that I\u2019d like a specialist to check. Most of the time this turns out to be nothing serious, but it\u2019s important to get it looked at in the next few weeks. I\u2019ll send over your results with a referral."',
    pitfalls: [
      'Don\u2019t over-reassure ("I\u2019m sure it\u2019s fine")',
      'Don\u2019t delay without reason',
      'Don\u2019t leave the patient without a clear next step',
    ],
  },
  {
    urgency: 'routine',
    approach: 'Informational. Frame as thoroughness, not concern.',
    exampleScript: '"Part of a thorough hearing evaluation is making sure there\u2019s nothing else going on. I\u2019d like to have an ENT doctor take a look, just as a routine step. There\u2019s no rush, but let\u2019s get it scheduled."',
    pitfalls: [
      'Don\u2019t make it sound optional if it\u2019s clinically indicated',
      'Don\u2019t burden the patient with worst-case scenarios',
    ],
  },
];

export const REFERRAL_INFORMATION_CHECKLIST: readonly string[] = [
  'Patient demographics and contact information',
  'Audiogram (air, bone, masked thresholds at all tested frequencies)',
  'Speech audiometry (SRT, WRS, presentation levels, masking if used)',
  'Tympanometry and acoustic reflex results (if available)',
  'The specific clinical concern prompting the referral',
  'Duration and onset of symptoms (sudden vs. gradual)',
  'Relevant history (noise exposure, ototoxic medications, family history, prior evaluations)',
  'Your clinical impression (NOT a diagnosis \u2014 describe the findings and your concern)',
];

// ---------------------------------------------------------------------------
// Section 5: Audiogram Cross-Reference
// ---------------------------------------------------------------------------

export const AUDIOGRAM_DECISION_MAPPINGS: readonly AudiogramDecisionMapping[] = [
  {
    patternId: 'flat-mild-moderate',
    patternName: 'Flat Mild\u2013Moderate SNHL',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Straightforward fitting with good WRS; acclimatization is the main challenge',
    keyDecisionPoint: 'Acclimatization management vs. technical adjustment',
  },
  {
    patternId: 'sloping-hf',
    patternName: 'Sloping HF SNHL',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Open vs. closed fitting decisions; noise expectations need managing',
    keyDecisionPoint: 'Open vs. closed fitting; noise expectation management',
  },
  {
    patternId: 'severe-profound',
    patternName: 'Severe\u2013Profound Flat',
    primaryPathway: 'adjust',
    secondaryPathway: 'refer',
    rationale: 'CI candidacy if aided WRS < 50%; complex fitting requiring verification',
    keyDecisionPoint: 'CI candidacy if aided WRS < 50%',
  },
  {
    patternId: 'cookie-bite',
    patternName: 'Cookie-Bite',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Spectral naturalness is challenging; multiple follow-ups expected',
    keyDecisionPoint: 'Spectral naturalness; multiple follow-ups expected',
  },
  {
    patternId: 'rising',
    patternName: 'Rising Loss',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Occlusion management is the primary fitting challenge',
    keyDecisionPoint: 'Occlusion management is THE challenge',
  },
  {
    patternId: 'unilateral',
    patternName: 'Unilateral HL',
    primaryPathway: 'refer',
    secondaryPathway: 'counsel',
    rationale: 'ALWAYS refer for etiology workup; counsel on monaural listening limits',
    keyDecisionPoint: 'ALWAYS refer for etiology; counsel on monaural limits',
  },
  {
    patternId: 'asymmetric',
    patternName: 'Asymmetric SNHL',
    primaryPathway: 'refer',
    secondaryPathway: 'adjust',
    rationale: 'ALWAYS refer for MRI; fit bilaterally if appropriate',
    keyDecisionPoint: 'ALWAYS refer for MRI; fit bilaterally if appropriate',
  },
  {
    patternId: 'conductive',
    patternName: 'Conductive Loss',
    primaryPathway: 'refer',
    secondaryPathway: null,
    rationale: 'MUST refer before fitting; medical/surgical treatment may resolve the loss',
    keyDecisionPoint: 'MUST refer before fitting; medical/surgical treatment may resolve',
  },
  {
    patternId: 'mixed',
    patternName: 'Mixed Loss',
    primaryPathway: 'refer',
    secondaryPathway: 'adjust',
    rationale: 'Refer for conductive component; fit to air conduction after medical clearance',
    keyDecisionPoint: 'Refer for conductive component; fit after clearance',
  },
  {
    patternId: 'normal-poor-wrs',
    patternName: 'Normal PTA, Poor WRS',
    primaryPathway: 'refer',
    secondaryPathway: 'counsel',
    rationale: 'MUST refer for retrocochlear workup; do NOT fit aids',
    keyDecisionPoint: 'MUST refer for retrocochlear workup; do NOT fit aids',
  },
  {
    patternId: 'nihl',
    patternName: 'NIHL (4 kHz Notch)',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Tinnitus management often needed alongside fitting; hearing protection counseling',
    keyDecisionPoint: 'Tinnitus management; hearing protection counseling',
  },
  {
    patternId: 'presbycusis',
    patternName: 'Presbycusis',
    primaryPathway: 'adjust',
    secondaryPathway: 'counsel',
    rationale: 'Acclimatization is the primary challenge; family involvement essential',
    keyDecisionPoint: 'Acclimatization is the primary challenge; family involvement essential',
  },
];

// ---------------------------------------------------------------------------
// Section 6: Clinical Scenarios
// ---------------------------------------------------------------------------

export const CLINICAL_SCENARIOS: readonly ClinicalScenario[] = [
  {
    id: 'scenario-1',
    title: 'New Patient, Flat Mild Loss, "Too Loud" After 1 Week',
    patientDescription: '68-year-old female, first-time hearing aid user',
    audiogramSummary: 'Bilateral flat mild-moderate SNHL (PTA 40 dB HL bilateral), WRS 92% bilateral',
    complaint: '"Everything is too loud. The refrigerator, the air conditioning, my own chewing. I\u2019ve been wearing them about 4 hours a day."',
    timeContext: '1 week post-fitting',
    additionalInfo: 'REM shows gain within 3 dB of NAL-NL2 target across all frequencies. Patient was started at 90% of target.',
    correctDecision: 'counsel',
    secondaryDecision: 'adjust',
    reasoning: 'This is classic acclimatization. The patient is hearing sounds she hasn\u2019t heard in years (refrigerator, AC) because her hearing loss developed gradually. The fitting is technically correct (REM on target). She\u2019s only wearing them 4 hours/day and it\u2019s only been 1 week.',
    actionPlan: [
      'Validate her experience: "What you\u2019re experiencing is completely normal. Your brain is rediscovering sounds it hasn\u2019t heard clearly in years."',
      'Provide a wearing schedule: "Try to increase by 1\u20132 hours each day. By week 3, aim for all waking hours."',
      'Reassure with a timeline: "Most patients tell me that by weeks 2\u20133, these sounds fade into the background."',
      'Minor adjustment only if she\u2019s truly unable to tolerate: reduce overall gain by 2\u20133 dB with a plan to increase at next visit.',
      'Schedule follow-up in 1\u20132 weeks.',
    ],
    commonWrongAnswer: 'adjust',
    whyWrongAnswerIsWrong: 'Reducing gain significantly at this stage creates a below-target fitting that the patient adapts to \u2014 she\u2019ll need even more time to reach her actual prescriptive target later. The brain adapts to what it\u2019s given. Give it the right target and let it adapt. Minor reduction (2\u20133 dB) is acceptable; major reduction (5\u201310 dB) undermines the fitting.',
  },
  {
    id: 'scenario-2',
    title: 'Sloping Loss, "Whistling When I Hug Someone"',
    patientDescription: '55-year-old male, wearing aids for 6 months',
    audiogramSummary: 'Bilateral sloping HF SNHL (PTA 35 dB, 4 kHz at 65 dB), WRS 88% bilateral',
    complaint: '"The aids whistle every time I hug my wife or put on a hat. It\u2019s embarrassing."',
    timeContext: '6 months post-fitting; otherwise happy with aids',
    additionalInfo: 'Currently fitted with open domes on RIC devices. Feedback management is enabled.',
    correctDecision: 'adjust',
    secondaryDecision: null,
    reasoning: 'This is a clear fitting problem. Feedback occurs when amplified sound leaks from the ear canal back to the microphone. The open dome provides insufficient seal when external pressure changes (hugging, hat). This is not an expectation problem (hugging shouldn\u2019t cause whistling) and not a medical problem. It\u2019s a solvable acoustic issue.',
    actionPlan: [
      'Try closed domes: these provide better seal while maintaining some openness for low-frequency naturalness.',
      'If closed domes resolve feedback: done. Counsel that some minimal feedback in extreme situations (pressing directly on the receiver) is normal.',
      'If closed domes are insufficient: custom mold with medium vent. This is more sealed but still allows natural low-frequency perception.',
      'Do NOT reduce high-frequency gain as the first response \u2014 this sacrifices the speech clarity benefit the patient has been enjoying for 6 months.',
      'Verify that feedback management algorithm is set to maximum effective level.',
    ],
    commonWrongAnswer: 'counsel',
    whyWrongAnswerIsWrong: 'While some feedback in extreme situations is expected, regular feedback during normal activities (hugging) indicates a coupling problem that can and should be solved. Telling a patient to avoid hugging is not acceptable clinical practice. Fix the fitting.',
  },
  {
    id: 'scenario-3',
    title: 'Asymmetric Loss, One Ear Much Worse',
    patientDescription: '52-year-old male, came in for routine hearing test',
    audiogramSummary: 'Right ear: sloping SNHL, PTA 55 dB. Left ear: mild flat SNHL, PTA 25 dB. Asymmetry of 20\u201335 dB at 1\u20134 kHz. WRS: Right 64%, Left 96%.',
    complaint: '"I don\u2019t think I hear as well on the right side."',
    timeContext: 'First visit; no prior hearing evaluation',
    additionalInfo: 'No history of noise exposure, ear surgery, or known cause for asymmetry. No vestibular symptoms.',
    correctDecision: 'refer',
    secondaryDecision: 'adjust',
    reasoning: 'Asymmetric SNHL of \u2265 15 dB at 3+ frequencies, without a known cause, meets referral criteria for MRI to rule out vestibular schwannoma. The WRS asymmetry (64% vs. 96%) further strengthens the referral indication. However, the hearing loss itself is aidable in both ears, so proceeding with bilateral fitting while the referral is being processed is appropriate.',
    actionPlan: [
      'REFER: Write a priority referral to ENT/otologist for MRI with gadolinium. Include full audiogram, WRS results, and the specific concern (asymmetric SNHL, disproportionately poor right WRS).',
      'COUNSEL: Explain the referral calmly: "I noticed that your hearing is different between your two ears, and I\u2019d like a specialist to take a closer look. Most of the time this turns out to be nothing concerning, but it\u2019s an important step."',
      'FIT: Proceed with bilateral hearing aid fitting. The referral does not preclude amplification \u2014 the patient has hearing loss that affects daily life.',
      'FOLLOW UP: Contact the patient to confirm the referral appointment was made.',
    ],
    commonWrongAnswer: 'adjust',
    whyWrongAnswerIsWrong: 'Fitting hearing aids without investigating the cause of the asymmetry misses a potential vestibular schwannoma. The referral is non-negotiable. "I\u2019ll fit the aids and we\u2019ll monitor" is not appropriate when referral criteria are clearly met.',
  },
  {
    id: 'scenario-4',
    title: 'Frustrated That Aids Don\u2019t Help in Noise',
    patientDescription: '72-year-old female, wearing aids for 2 years',
    audiogramSummary: 'Bilateral sloping HF SNHL (PTA 45 dB, 4 kHz at 70 dB), WRS 76% bilateral (consistent with cochlear loss)',
    complaint: '"These hearing aids are useless at restaurants. I spent a lot of money and I still can\u2019t hear in noise. I want to return them."',
    timeContext: '2 years of consistent use; 3 prior adjustment visits; aids are well-fitted (REM on target)',
    additionalInfo: 'Current aids have directional microphones, noise reduction, and a "restaurant" program. All features are enabled and functioning.',
    correctDecision: 'counsel',
    secondaryDecision: null,
    reasoning: 'The fitting is correct. The features are enabled. The patient has been using the aids successfully for 2 years in most situations. The complaint is specifically about high-noise environments (restaurants). This is a fundamental limitation of amplification: in high noise, SNR is poor, and hearing aids cannot create speech signal where there is none. The patient\u2019s expectations exceed what the technology can deliver.',
    actionPlan: [
      'VALIDATE: "I understand your frustration. Restaurant noise is the #1 challenge for hearing aid users \u2014 you\u2019re not alone."',
      'DEMONSTRATE: Show the patient what the aids ARE doing by removing them briefly in a quiet setting.',
      'EXPLAIN: "In very noisy places, even people with normal hearing struggle. The noise level in some restaurants exceeds 85 dB \u2014 that drowns out speech for everyone."',
      'STRATEGIZE: Offer concrete strategies: sit at quieter tables, choose less noisy restaurants, use the remote microphone, face the speaker, reduce distance.',
      'RECOMMEND: A remote microphone system is the single most effective tool for noise. If the patient doesn\u2019t have one, this is the time to recommend it.',
      'Do NOT return the aids \u2014 the patient benefits from them in most situations.',
    ],
    commonWrongAnswer: 'adjust',
    whyWrongAnswerIsWrong: 'The aids are already on target and all noise features are enabled. Further gain increases in noise won\u2019t help \u2014 the noise is amplified along with the speech. Aggressive noise reduction can reduce noise awareness but degrades speech quality. The fundamental issue is SNR, not fitting.',
  },
  {
    id: 'scenario-5',
    title: 'Elderly Patient, Good Word Scores, Just Wants Volume',
    patientDescription: '83-year-old male, lives alone, came at daughter\u2019s request',
    audiogramSummary: 'Bilateral mild flat SNHL (PTA 30 dB HL), WRS 96% bilateral (excellent)',
    complaint: '"The TV is a little quiet sometimes. My daughter thinks I need hearing aids. I hear fine."',
    timeContext: 'First visit',
    additionalInfo: 'Patient is independent, active, cognitively sharp. Admits to asking people to repeat occasionally but says "that\u2019s normal at my age."',
    correctDecision: 'counsel',
    secondaryDecision: 'adjust',
    reasoning: 'This is a counseling-first scenario. The patient has a genuine hearing loss (mild SNHL is still a loss), and the WRS confirms the cochlea can benefit from amplification. However, the patient\u2019s motivation is low \u2014 he\u2019s here because his daughter asked, not because he perceives a significant problem. Forcing hearing aids on an unwilling patient leads to rejection.',
    actionPlan: [
      'VALIDATE: "You\u2019re right that some of what you\u2019re experiencing is common. Your hearing test does show a mild change, and your ability to understand speech is excellent."',
      'EDUCATE: "The research shows that even mild hearing loss can lead to listening fatigue and can contribute to cognitive changes over time. Addressing it early, when it\u2019s mild, gives the best results."',
      'DEMONSTRATE: If available, do a brief amplified listening demo.',
      'RESPECT AUTONOMY: "I\u2019d recommend trying hearing aids, but it\u2019s your decision. Here\u2019s what I suggest: a 30-day trial so you can experience them in your daily life with no commitment."',
      'INVOLVE FAMILY: With permission, include the daughter in the discussion.',
      'Don\u2019t push hard. Plant the seed. The patient may return in 6\u201312 months when the loss has progressed.',
    ],
    commonWrongAnswer: 'adjust',
    whyWrongAnswerIsWrong: 'Fitting hearing aids on an unmotivated patient leads to "drawer aids" \u2014 aids that sit unused. The audiogram alone does not dictate treatment. The patient\u2019s readiness, motivation, and self-perceived difficulty are equally important. A mild loss with excellent WRS in a patient who doesn\u2019t feel impaired is a counseling case, not a fitting case.',
  },
  {
    id: 'scenario-6',
    title: 'Conductive Loss Discovered During Routine Visit',
    patientDescription: '45-year-old female, came in reporting gradual hearing difficulty',
    audiogramSummary: 'Right ear: air conduction PTA 45 dB, bone conduction PTA 10 dB (35 dB air-bone gap). Left ear: normal hearing. Tympanometry: Type As (reduced compliance) right ear.',
    complaint: '"Things sound muffled on my right side. I think I need a hearing aid."',
    timeContext: 'First visit; no prior hearing evaluation',
    additionalInfo: 'No history of ear infection, surgery, or trauma. No pain or drainage. Family history of otosclerosis (mother had stapedectomy).',
    correctDecision: 'refer',
    secondaryDecision: 'counsel',
    reasoning: 'A significant air-bone gap (35 dB) with Type As tympanometry and family history of otosclerosis strongly suggests a medically treatable condition. The patient MUST be referred to ENT before any hearing aid fitting. Surgical intervention (stapedectomy) may resolve or significantly improve the hearing loss, making amplification unnecessary.',
    actionPlan: [
      'REFER: Write a routine referral to ENT. Include audiogram with bone conduction, tympanometry, and family history of otosclerosis.',
      'COUNSEL: "Your hearing test shows that the inner part of your ear is working well, but something is preventing sound from getting through efficiently. This type of hearing loss is often treatable \u2014 sometimes even with a minor procedure. I want you to see an ear specialist who can look into this."',
      'Do NOT fit a hearing aid. The conductive component may be surgically correctable.',
      'FOLLOW UP: Schedule a return visit after ENT evaluation to reassess and discuss options based on the specialist\u2019s findings.',
    ],
    commonWrongAnswer: 'adjust',
    whyWrongAnswerIsWrong: 'Fitting a hearing aid for an uninvestigated conductive loss is clinically inappropriate. The air-bone gap indicates the cochlea is largely intact and the problem is mechanical. Medical or surgical treatment could restore hearing to near-normal levels. Proceeding directly to amplification bypasses a potentially curative intervention and delays appropriate care.',
  },
];

// ---------------------------------------------------------------------------
// Section 7: Tradeoff Communication
// ---------------------------------------------------------------------------

export const TRADEOFF_SCENARIOS: readonly TradeoffScenario[] = [
  {
    id: 'occlusion-vs-open',
    tradeoff: 'Occlusion vs. Open Fit',
    clinicalContext: 'Patient with sloping HF loss; currently open dome',
    plainLanguageExplanation: 'Open fittings keep own-voice natural but limit low-frequency amplification. Closed fittings provide fuller sound but make own-voice louder.',
    exampleScript: '"Right now your hearing aids are completely open \u2014 that keeps your own voice sounding natural and your ears feeling comfortable. The tradeoff is that we can\u2019t give you as much volume in the low-pitched sounds. We could switch to a tighter fitting, which would give you more fullness to sounds, but your own voice would sound louder and more \u2018echoey\u2019 to you. Which matters more to you \u2014 natural own-voice or fuller sound?"',
    sharedDecisionQuestion: 'Would you rather sounds feel natural, even if a bit thin, or fuller, even if your own voice is louder?',
  },
  {
    id: 'gain-vs-feedback',
    tradeoff: 'Gain vs. Feedback',
    clinicalContext: 'Patient requesting more volume; near feedback threshold',
    plainLanguageExplanation: 'More gain means better audibility but increases feedback risk. Finding the sweet spot is key.',
    exampleScript: '"I can increase the volume to help you hear better in some situations, but if I go too high, you\u2019ll start hearing a whistling sound \u2014 that\u2019s the hearing aid feeding back. Think of it like turning up a microphone near a speaker. We need to find the sweet spot: enough volume to help you hear clearly, but not so much that it whistles."',
    sharedDecisionQuestion: 'If I increase the volume a little and there\u2019s occasional whistling when you put on a hat or lean against something, is that an acceptable trade for better hearing?',
  },
  {
    id: 'clarity-vs-naturalness',
    tradeoff: 'Clarity vs. Naturalness',
    clinicalContext: 'Patient with HF SNHL; adjusting high-frequency gain',
    plainLanguageExplanation: 'More high-frequency gain improves consonant clarity but can sound "tinny." Less gain sounds more natural but speech is less crisp.',
    exampleScript: '"I can make speech crisper and clearer by turning up the high-pitched sounds. This helps with consonants \u2014 the sounds that separate \u2018cat\u2019 from \u2018hat.\u2019 The downside is that sounds may feel sharper or more \u2018tinny\u2019 until your brain adjusts. Some people prefer a more natural, mellow sound even if it\u2019s a bit less clear. What would you prefer: sharper clarity or more natural sound?"',
    sharedDecisionQuestion: 'What\u2019s more important to you right now \u2014 understanding every word, or having sounds feel natural and comfortable?',
  },
  {
    id: 'noise-reduction',
    tradeoff: 'Noise Reduction Aggressiveness',
    clinicalContext: 'Patient in varied listening environments; adjusting noise reduction settings',
    plainLanguageExplanation: 'Aggressive noise reduction improves comfort in noise but may muffle soft speech. Gentle settings preserve more speech but let through more noise.',
    exampleScript: '"Your hearing aids can reduce background noise, which helps in noisy places. But the more aggressively we reduce noise, the more the hearing aid has to guess what\u2019s noise and what\u2019s speech \u2014 and sometimes it guesses wrong. An aggressive setting makes quiet places very comfortable but may muffle some soft voices. A gentle setting lets more speech through but also lets more noise through. What sounds better to you?"',
    sharedDecisionQuestion: 'Do you spend more time in noisy places where you want maximum noise reduction, or in quiet places where you want to catch every soft sound?',
  },
];

export const SHARED_DECISION_STEPS: readonly string[] = [
  'Present the finding. "Your hearing test shows X."',
  'Explain the options. "We can approach this two ways: A or B."',
  'Describe each option\u2019s benefits and drawbacks. "A gives you this, but costs you that. B gives you the opposite."',
  'Ask about the patient\u2019s priorities. "Which of these matters more in your daily life?"',
  'Make a recommendation if asked. "Based on what you\u2019ve told me, I\u2019d suggest starting with A, and we can always try B if it doesn\u2019t work out."',
  'Implement and follow up. "Let\u2019s try this for two weeks and see how it goes."',
];

export const TRADEOFF_PRINCIPLES: readonly string[] = [
  'Name both sides honestly. "We can do X, but it means less of Y." Don\u2019t hide the downside.',
  'Use analogies. Patients understand tradeoffs in other domains (car with better gas mileage has less horsepower).',
  'Quantify when possible. "This change will make your own voice sound more natural, but you\u2019ll hear about 10% less volume in low-pitched sounds."',
  'Present it as a choice, not a prescription. "Here are your options. Let\u2019s figure out which one works best for your life."',
  'Acknowledge that both options are valid. "There\u2019s no wrong choice here \u2014 it depends on what matters most to you."',
];

export const DOCUMENTATION_TIPS: readonly DocumentationTip[] = [
  {
    category: 'Clinical decision rationale',
    whatToDocument: ['Why you chose to adjust, counsel, or refer', 'What clinical findings drove the decision'],
    example: '"Patient presents with sloping HF SNHL with 22 dB interaural asymmetry at 2\u20134 kHz. Referral to ENT for MRI recommended per AAA guidelines. Bilateral fitting initiated concurrently."',
  },
  {
    category: 'Patient-reported outcome',
    whatToDocument: ['What the patient said, in their words', 'Specific situations described'],
    example: '"Patient reports: \u2018The hearing aids work great at home but restaurants are still impossible.\u2019 \u2014 2-year user, REM on target, all features optimized."',
  },
  {
    category: 'Tradeoff discussion',
    whatToDocument: ['What options were presented', 'What the patient chose and why'],
    example: '"Discussed open vs. closed dome. Patient prefers open for own-voice naturalness despite reduced LF gain. Will monitor feedback."',
  },
  {
    category: 'Action plan',
    whatToDocument: ['What was done', 'What was deferred', 'What needs follow-up'],
    example: '"Reduced overall gain by 3 dB for acclimatization comfort. Plan to increase to target at 2-week follow-up. Referred to ENT for asymmetry evaluation \u2014 priority."',
  },
  {
    category: 'Follow-up needs',
    whatToDocument: ['What to check next time', 'Outstanding referrals', 'Pending adjustments'],
    example: '"Follow-up in 2 weeks: 1) Increase gain toward target. 2) Confirm ENT referral was made. 3) Assess acclimatization progress."',
  },
];

// ---------------------------------------------------------------------------
// Table of Contents
// ---------------------------------------------------------------------------

export interface TocSection {
  id: string;
  label: string;
  shortLabel: string;
}

export const TOC_SECTIONS: readonly TocSection[] = [
  { id: 'section-1', label: 'The Core Framework', shortLabel: 'Core Framework' },
  { id: 'section-2', label: 'Adjustment Decision Tree', shortLabel: 'Adjustments' },
  { id: 'section-3', label: 'Counseling Decision Tree', shortLabel: 'Counseling' },
  { id: 'section-4', label: 'Referral Decision Tree', shortLabel: 'Referrals' },
  { id: 'section-5', label: 'Audiogram-Specific Guidance', shortLabel: 'By Audiogram' },
  { id: 'section-6', label: 'Common Clinical Scenarios', shortLabel: 'Scenarios' },
  { id: 'section-7', label: 'Tradeoff Communication', shortLabel: 'Tradeoffs' },
];
