/**
 * Static data and typed constants for the Referrals page.
 *
 * All clinical content sourced from UX_REDESIGN_SPEC.md sections 6.3-6.6.
 */

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

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

export interface CommunicationScript {
  scenario: string;
  urgency: 'urgent' | 'priority' | 'routine';
  script: string;
}

// ---------------------------------------------------------------------------
// Referral Criteria Matrix (11 entries)
// ---------------------------------------------------------------------------

export const REFERRAL_CRITERIA: readonly ReferralCriterion[] = [
  {
    finding: 'Asymmetric SNHL',
    threshold: '\u2265 15 dB at 3+ frequencies',
    urgency: 'routine',
    referTo: 'ENT / Otologist',
    reason: 'Rule out retrocochlear pathology (vestibular schwannoma)',
  },
  {
    finding: 'Sudden SNHL',
    threshold: '\u2265 30 dB over 3 contiguous frequencies within 72 hours',
    urgency: 'urgent',
    referTo: 'ENT / Emergency',
    reason: 'Medical emergency \u2014 steroid treatment window is hours/days',
  },
  {
    finding: 'Unilateral tinnitus',
    threshold: 'New onset, persistent, no known cause',
    urgency: 'priority',
    referTo: 'ENT / Otologist',
    reason: 'Rule out retrocochlear pathology',
  },
  {
    finding: 'Unilateral aural fullness',
    threshold: 'Persistent, with or without hearing loss',
    urgency: 'priority',
    referTo: 'ENT',
    reason: "Rule out Meniere's, middle ear pathology, retrocochlear",
  },
  {
    finding: 'Disproportionately poor WRS',
    threshold: 'WRS significantly worse than PTA predicts (rollover)',
    urgency: 'routine',
    referTo: 'ENT / Otologist',
    reason: 'Retrocochlear sign; neural pathway compromise',
  },
  {
    finding: 'Conductive hearing loss with no medical clearance',
    threshold: 'Air-bone gap \u2265 10 dB',
    urgency: 'routine',
    referTo: 'ENT',
    reason: 'Medical/surgical treatment may restore hearing',
  },
  {
    finding: 'Active ear drainage',
    threshold: 'Any',
    urgency: 'urgent',
    referTo: 'ENT / Primary Care',
    reason: 'Active infection requires medical treatment',
  },
  {
    finding: 'Otalgia (ear pain)',
    threshold: 'Persistent or severe',
    urgency: 'priority',
    referTo: 'ENT / Primary Care',
    reason: 'Rule out infection, TMJ, referred pain, malignancy',
  },
  {
    finding: 'Vertigo/dizziness with hearing loss',
    threshold: 'Any combination',
    urgency: 'priority',
    referTo: 'ENT / Neurology',
    reason: "Meniere's, vestibular schwannoma, stroke",
  },
  {
    finding: 'Visible abnormality on otoscopy',
    threshold: 'Any abnormality beyond cerumen',
    urgency: 'priority',
    referTo: 'ENT',
    reason: 'Diagnosis and treatment',
  },
  {
    finding: 'Pulsatile tinnitus',
    threshold: 'Any',
    urgency: 'priority',
    referTo: 'ENT / Vascular',
    reason: 'Rule out vascular anomaly, glomus tumor',
  },
] as const;

// ---------------------------------------------------------------------------
// When NOT to Refer
// ---------------------------------------------------------------------------

export const WHEN_NOT_TO_REFER: readonly string[] = [
  'Symmetric, gradual, bilateral SNHL consistent with age (presbycusis)',
  'Known noise-induced hearing loss with typical audiometric configuration (4 kHz notch)',
  'Patient already under ENT care for the current condition',
  'Stable long-standing conductive loss with prior medical evaluation',
] as const;

// ---------------------------------------------------------------------------
// Red Flags grouped by urgency tier
// ---------------------------------------------------------------------------

export const RED_FLAGS: {
  urgent: readonly RedFlag[];
  priority: readonly RedFlag[];
  routine: readonly RedFlag[];
} = {
  urgent: [
    {
      sign: 'Sudden hearing loss (< 72 hours)',
      why: 'Steroid treatment window closes rapidly; vascular occlusion, viral damage, or autoimmune attack',
      action: 'Call ENT directly; fax audiogram; instruct patient to go today',
    },
    {
      sign: 'Active ear drainage with fever',
      why: 'Acute infection risk; possible cholesteatoma',
      action: 'Refer to ENT or urgent care',
    },
    {
      sign: 'Sudden vertigo with hearing loss and tinnitus',
      why: "Possible labyrinthitis, Meniere's attack, or vascular event",
      action: 'Refer to ENT/ER',
    },
  ],
  priority: [
    {
      sign: 'Asymmetric SNHL',
      why: 'Could indicate vestibular schwannoma',
      action: 'Write referral letter; include audiogram',
    },
    {
      sign: 'Unilateral tinnitus (new)',
      why: 'Retrocochlear screening needed',
      action: 'Document onset, character; refer to ENT',
    },
    {
      sign: 'Pulsatile tinnitus',
      why: 'Vascular etiology possible',
      action: 'Refer to ENT; note if objective (audible to examiner)',
    },
    {
      sign: 'WRS rollover or disproportionately poor WRS',
      why: 'Neural pathway compromise',
      action: 'Include audiogram with WRS data in referral',
    },
    {
      sign: 'Unexplained conductive loss',
      why: 'Otosclerosis, ossicular chain issue',
      action: 'Refer for medical evaluation before fitting',
    },
  ],
  routine: [
    {
      sign: 'Bilateral symmetric SNHL with tinnitus',
      why: 'Standard assessment but may benefit from tinnitus evaluation',
      action: 'Note in chart; discuss with patient; refer if bothersome',
    },
    {
      sign: 'Cerumen impaction preventing testing',
      why: 'Removal needed',
      action: 'Refer for cerumen removal before retesting',
    },
    {
      sign: 'Patient requesting surgical/medical opinion',
      why: 'Patient autonomy',
      action: 'Facilitate referral',
    },
  ],
} as const;

// ---------------------------------------------------------------------------
// Clinical Examples (3)
// ---------------------------------------------------------------------------

export const CLINICAL_EXAMPLES: readonly ClinicalExample[] = [
  {
    title: 'Example 1: Suspect \u2014 Refer',
    rightEar: { pta: 35, wrs: 48, wrsLevel: 75 },
    leftEar: { pta: 30, wrs: 96, wrsLevel: 70 },
    assessment:
      'Right WRS disproportionately poor for degree of loss. Asymmetric SNHL. Refer for MRI with gadolinium to rule out vestibular schwannoma.',
    shouldRefer: true,
  },
  {
    title: 'Example 2: Not Suspicious',
    rightEar: { pta: 50, wrs: 76, wrsLevel: 90 },
    leftEar: { pta: 45, wrs: 80, wrsLevel: 85 },
    assessment:
      'Symmetric loss, WRS consistent with cochlear pathology. No retrocochlear red flags.',
    shouldRefer: false,
  },
  {
    title: 'Example 3: Rollover \u2014 Refer',
    rightEar: { pta: 40, wrs: 88, wrsLevel: 80 },
    leftEar: { pta: 40, wrs: 64, wrsLevel: 80 },
    assessment:
      'Left ear WRS of 64% is disproportionately poor relative to a PTA of 40 dB HL. Left ear showed rollover on PI-PB function testing (PBmax 72% at 70 dB HL, PBmin 52% at 90 dB HL; RI = 0.28). Refer for retrocochlear evaluation.',
    shouldRefer: true,
  },
] as const;

// ---------------------------------------------------------------------------
// Communication Scripts (3 scenarios)
// ---------------------------------------------------------------------------

export const COMMUNICATION_SCRIPTS: readonly CommunicationScript[] = [
  {
    scenario: 'Asymmetric SNHL',
    urgency: 'routine',
    script:
      "I noticed that your hearing is different between your two ears. When we see this kind of difference, we recommend having an ear, nose, and throat specialist take a look to make sure everything is okay. Most of the time it turns out to be nothing concerning, but it's an important step. I'll send over your hearing test results so the doctor has them ready.",
  },
  {
    scenario: 'Sudden hearing loss (URGENT)',
    urgency: 'urgent',
    script:
      "Based on what you're describing, this sounds like a sudden change in your hearing. This is something that needs to be seen by a doctor right away \u2014 today or tomorrow at the latest. There are treatments that work best when started early. Let me help you get connected with an ENT or the ER right now.",
  },
  {
    scenario: 'Disproportionately poor WRS',
    urgency: 'routine',
    script:
      "Your hearing test shows that while you can detect sounds, your ability to understand words isn't as strong as we'd expect. This can happen for different reasons, and we'd like to have a specialist do some additional testing to understand why. I'll include all of your test results in the referral.",
  },
] as const;

// ---------------------------------------------------------------------------
// Communication Principles
// ---------------------------------------------------------------------------

export const COMMUNICATION_PRINCIPLES: readonly { principle: string; example: string }[] = [
  {
    principle: 'Be honest but not alarming.',
    example:
      '"The test shows a difference between your ears that we\'d like a specialist to look at more closely."',
  },
  {
    principle: 'Normalize the referral.',
    example: '"This is a routine part of thorough audiologic care."',
  },
  {
    principle: 'Explain the reason without diagnosing.',
    example:
      'You are not diagnosing; you are identifying patterns that warrant further evaluation.',
  },
  {
    principle: 'Emphasize that early evaluation is beneficial.',
    example: '"Finding things early gives us the most options."',
  },
  {
    principle: 'Provide clear next steps.',
    example: 'Who to see, when, and what to bring.',
  },
] as const;

// ---------------------------------------------------------------------------
// Referral Letter Contents Checklist
// ---------------------------------------------------------------------------

export const REFERRAL_LETTER_CONTENTS: readonly string[] = [
  'Patient demographics',
  'Audiogram (AC, BC, masked thresholds)',
  'Speech audiometry results (SRT, WRS, presentation levels)',
  'Tympanometry / acoustic reflex results if available',
  'Specific concern prompting referral',
  'Duration and onset of symptoms',
  'Relevant history (noise exposure, medications, family history)',
  'Your clinical impression (not diagnosis)',
] as const;
