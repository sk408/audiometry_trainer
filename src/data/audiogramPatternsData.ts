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
  description: string;
  typicalThresholds: {
    250: [number, number];
    500: [number, number];
    1000: [number, number];
    2000: [number, number];
    4000: [number, number];
    8000: [number, number];
  };
  airBoneGap: boolean;
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
  typicallyNeeded: boolean;
  explanation: string;
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
  referralPossible: boolean;
  criteria: string[];
  urgency: UrgencyLevel;
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

// ---------------------------------------------------------------------------
// Pattern Definitions — 12 patterns
// ---------------------------------------------------------------------------

export const AUDIOGRAM_PATTERNS: readonly AudiogramPattern[] = [
  // =========================================================================
  // 6.1 Flat Mild-Moderate SNHL
  // =========================================================================
  {
    id: 'flat-mild-moderate',
    name: 'Flat Mild-Moderate SNHL',
    shortName: 'Flat Mild-Mod',
    category: 'SNHL',
    prevalence: 'Common',
    audiogramSignature: {
      description: 'Thresholds between 25-55 dB HL across all frequencies (250-8000 Hz) with less than 10 dB variation between adjacent frequencies. No air-bone gap (sensorineural). No significant asymmetry.',
      typicalThresholds: {
        250: [25, 45],
        500: [25, 50],
        1000: [30, 55],
        2000: [30, 55],
        4000: [30, 55],
        8000: [25, 50],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Flat configuration', 'No steep slope'],
    },
    typicalComplaints: [
      '"Everything sounds too loud" (over-amplification at initial fit)',
      '"My own voice sounds hollow/boomy" (occlusion effect with closed fittings)',
      '"I can hear but can\'t understand" (if WRS is reduced)',
      '"Hearing aids are annoying in quiet" (amplified ambient noise)',
      '"TV is still too quiet" (insufficient mid-frequency gain)',
    ],
    fittingApproach: {
      transducerChoice: 'BTE with custom mold or RIC with closed dome (depending on degree)',
      earmoldCoupling: 'Canal mold or closed dome for mild end; half shell for moderate end',
      ventSize: 'Medium vent (2-2.5 mm) for mild; small vent or pressure vent for moderate',
      prescriptiveTarget: 'NAL-NL2 or DSL v5 — follow target closely as flat loss responds well to prescriptive fitting',
      keyFrequencyRegions: 'Even gain across 250-4000 Hz; gain roughly proportional to loss at each frequency',
      additionalConsiderations: [
        'Consider starting at 80% of target for new users and increasing over 2-4 weeks',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: false,
      explanation: 'With symmetric thresholds and insert earphones (IA ~70 dB), masking is rarely needed because the signal doesn\'t exceed IA. With supra-aural phones (IA ~40 dB), masking may be needed at moderate levels.',
      criticalScenarios: [
        'If loss is moderate (50+ dB) at any frequency with supra-aural phones',
        'Always needed for bone conduction testing',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Occlusion vs. gain',
        explanation: 'More occlusion (closed fitting) provides better low-frequency gain but the patient hears their own voice amplified. More open fitting reduces occlusion but sacrifices low-frequency amplification that the flat loss needs.',
      },
      {
        tradeoff: 'Acclimatization speed vs. satisfaction',
        explanation: 'Starting at full target provides better audibility but may overwhelm the patient. Starting lower is more comfortable but delays benefit.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Too loud overall" (week 1)',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Acclimatization is likely; but verify MPO',
        action: 'Counsel on adaptation timeline (2-4 weeks); reduce gain 3-5 dB only if significantly uncomfortable',
      },
      {
        complaint: '"Own voice is hollow"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Occlusion effect is real and addressable',
        action: 'Increase vent size or switch to more open coupling; counsel that some own-voice change is normal',
      },
      {
        complaint: '"Can hear but not understand"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Likely insufficient mid/high frequency gain',
        action: 'Increase 1-3 kHz gain; verify against target; check WRS',
      },
      {
        complaint: '"Background noise too loud"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Flat loss means all frequencies are amplified including noise',
        action: 'Counsel on realistic expectations; enable noise reduction; consider directional mics',
      },
    ],
    referralGuidance: {
      referralPossible: false,
      criteria: ['Symmetric flat mild-moderate SNHL alone does not warrant referral'],
      urgency: 'none',
      referTo: 'N/A (unless red flags present: asymmetric, sudden onset, or disproportionately poor WRS)',
    },
    commonMistakes: [
      {
        mistake: 'Fitting with wide-open venting because "it\'s only mild-moderate"',
        consequence: 'Insufficient low-frequency gain; patient reports speech sounds thin',
        correction: 'Flat loss needs gain across ALL frequencies including lows; vent size must balance occlusion relief against LF gain needs.',
      },
      {
        mistake: 'Not counseling about acclimatization',
        consequence: 'Patient returns after 3 days saying "these are too loud" and student reduces gain to below-target levels',
        correction: 'Always set expectations: "Your brain needs 2-4 weeks to adjust. Wear them consistently for gradually longer periods."',
      },
      {
        mistake: 'Ignoring own-voice complaints as "just adaptation"',
        consequence: 'Patient stops wearing aids',
        correction: 'Own-voice occlusion is a real acoustic phenomenon. Address it with venting, coupling changes, or own-voice processing features — don\'t dismiss it.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Flat losses are the "easiest" to fit but the hardest to satisfy — patients hear everything louder, including things they don\'t want to hear. Expectation management is critical.' },
      { pearl: 'If WRS is good (>88%), the patient should do well with properly fitted aids. If WRS is below expected, investigate further before attributing complaints to the fitting.' },
      { pearl: 'The most common reason a flat mild-moderate patient returns the aids is not the fitting — it\'s unmet expectations. Spend as much time counseling as fitting.' },
    ],
  },

  // =========================================================================
  // 6.2 Sloping High-Frequency SNHL
  // =========================================================================
  {
    id: 'sloping-hf',
    name: 'Sloping High-Frequency SNHL',
    shortName: 'Sloping HF',
    category: 'SNHL',
    prevalence: 'Most Common',
    audiogramSignature: {
      description: 'Normal or near-normal thresholds (0-25 dB HL) at 250-1000 Hz with progressive threshold elevation at 2000-8000 Hz (typically 40-75 dB at 4000-8000 Hz). Slope of 15+ dB per octave in the high frequencies. No air-bone gap.',
      typicalThresholds: {
        250: [0, 20],
        500: [5, 25],
        1000: [10, 25],
        2000: [25, 50],
        4000: [40, 70],
        8000: [50, 75],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Sloping configuration', 'Normal lows, impaired highs'],
    },
    typicalComplaints: [
      '"I can hear people talking but can\'t understand what they\'re saying" (consonant perception loss)',
      '"Women and children are harder to understand than men"',
      '"I do fine one-on-one but struggle in groups/noise"',
      '"Sounds are muffled" (loss of high-frequency detail)',
      '"The hearing aids whistle" (feedback with open fitting at high gain)',
    ],
    fittingApproach: {
      transducerChoice: 'RIC strongly preferred (receiver-in-canal); BTE with thin tube acceptable',
      earmoldCoupling: 'Open dome for mild-moderate slope; closed dome or custom mold if slope is steep (>60 dB at 4 kHz)',
      ventSize: 'Open or large vent to preserve natural low-frequency hearing; only restrict venting if feedback cannot be controlled',
      prescriptiveTarget: 'NAL-NL2; critical to match target in 2-4 kHz range where consonant energy lives',
      keyFrequencyRegions: '1500-4000 Hz is the critical zone; minimal or no gain below 1000 Hz',
      additionalConsiderations: [
        'Feedback management system must be active',
        'Frequency lowering may be needed if loss exceeds 70 dB above 3 kHz',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'Low frequencies rarely need masking (thresholds are normal, so IA is not exceeded). High frequencies may need masking if asymmetric or if testing bone conduction.',
      criticalScenarios: [
        'Bone conduction at all frequencies',
        'Air conduction at 2000-4000 Hz if loss exceeds 40 dB with supra-aural phones',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Open fit naturalness vs. high-frequency gain',
        explanation: 'Open domes sound natural and avoid occlusion but limit the maximum gain achievable at high frequencies before feedback. Closing the fit increases available gain but introduces occlusion.',
      },
      {
        tradeoff: 'Feedback control vs. audibility',
        explanation: 'Aggressive feedback cancellation can reduce feedback but may cause artifacts (chirping, warbling). Reducing high-frequency gain eliminates feedback but defeats the purpose of the fitting.',
      },
      {
        tradeoff: 'Frequency lowering benefit vs. sound quality',
        explanation: 'Frequency lowering (compression or transposition) can restore high-frequency cue perception but can make sounds unnatural, especially for music and environmental sounds.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Can\'t understand in noise"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'This is the fundamental challenge of HF loss; aids help but don\'t solve it',
        action: 'Enable directional mics, noise program; counsel on realistic expectations for noise; suggest communication strategies',
      },
      {
        complaint: '"Whistling/feedback"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Acoustic feedback is a fitting problem',
        action: 'Check dome fit; try closed dome or custom mold; verify feedback manager; reduce HF gain only as last resort',
      },
      {
        complaint: '"Sounds are too sharp/tinny"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Over-emphasis of newly audible HF sounds',
        action: 'Reduce 3-6 kHz by 2-3 dB; counsel on adaptation ("sounds that were inaudible will seem loud at first")',
      },
      {
        complaint: '"My own voice is fine"',
        isAdjustment: false,
        isCounseling: false,
        rationale: 'Open fit correctly preserves natural own-voice perception',
        action: 'This is a sign the fitting is appropriate — no action needed',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Interaural asymmetry >= 15 dB at 3+ frequencies',
        'Disproportionately poor WRS',
      ],
      urgency: 'routine',
      referTo: 'ENT / Otologist',
    },
    commonMistakes: [
      {
        mistake: 'Adding low-frequency gain "to help them hear better"',
        consequence: 'Occlusion effect in an ear with normal low-frequency hearing; patient hears own voice booming',
        correction: 'If low-frequency hearing is normal, do NOT amplify it. The audiogram tells you where the loss is.',
      },
      {
        mistake: 'Choosing a closed dome immediately because of feedback',
        consequence: 'Introducing occlusion for a patient who doesn\'t need LF gain, creating a new problem while solving feedback',
        correction: 'Try feedback management algorithms first; try a larger closed dome or custom mold with large vent only if algorithms are insufficient.',
      },
      {
        mistake: 'Underfitting the 2-3 kHz region',
        consequence: 'Patient still can\'t understand speech clearly — the most important consonant energy lives at 2-3 kHz',
        correction: 'Verify with REM that gain at 2-3 kHz matches prescriptive target. This is the single most important frequency region for speech intelligibility.',
      },
    ],
    clinicalPearls: [
      { pearl: 'This is the most common audiogram pattern you will see in clinical practice. Master this fitting and you\'ll handle 40-50% of your caseload confidently.' },
      { pearl: 'The patient\'s primary complaint will almost always be about speech understanding in noise, not about hearing in quiet. Aids help most in quiet-to-moderate noise; they have fundamental limitations in high noise.' },
      { pearl: 'If the patient says "I hear fine, my spouse just mumbles," they almost certainly have a sloping HF loss. The low-frequency vowels are audible but the high-frequency consonants are lost.' },
    ],
  },

  // =========================================================================
  // 6.3 Severe-Profound Flat SNHL
  // =========================================================================
  {
    id: 'severe-profound-flat',
    name: 'Severe-Profound Flat SNHL',
    shortName: 'Severe-Profound',
    category: 'SNHL',
    prevalence: 'Less Common',
    audiogramSignature: {
      description: 'Thresholds between 70-110+ dB HL across all frequencies with relatively flat configuration (less than 15 dB variation). No significant air-bone gap. May have no measurable response at some frequencies.',
      typicalThresholds: {
        250: [70, 100],
        500: [75, 105],
        1000: [75, 110],
        2000: [80, 110],
        4000: [80, 110],
        8000: [80, 110],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Severe-profound range', 'Flat', 'May have no measurable response at some frequencies'],
    },
    typicalComplaints: [
      '"I still can\'t hear enough" (amplification limits with severe loss)',
      '"Everything sounds distorted" (cochlear distortion with severe damage)',
      '"Feedback/whistling is constant" (high gain + tight fitting = feedback risk)',
      '"Battery drains very fast" (high gain = high power consumption)',
      '"I\'m exhausted by the end of the day" (listening fatigue from effortful processing)',
    ],
    fittingApproach: {
      transducerChoice: 'BTE with custom earmold (power BTE required); RIC only if ultra-power receiver available',
      earmoldCoupling: 'Full shell earmold required for maximum seal',
      ventSize: 'No vent or pressure vent only (0-0.8 mm); any larger vent causes feedback at the gain levels needed',
      prescriptiveTarget: 'DSL v5 may be preferred for maximizing audibility; NAL-NL2 also appropriate. Ensure MPO is set appropriately — too low clips the signal, too high causes discomfort.',
      keyFrequencyRegions: 'Maximize gain across entire speech range (250-4000 Hz); focus on frequencies with measurable thresholds',
      additionalConsiderations: [
        'Assess CI candidacy if aided WRS < 50% in best-aided condition',
        'Frequency lowering strongly recommended if no measurable hearing above 2-3 kHz',
        'FM/remote mic system essential for noise',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'With thresholds at 70+ dB, presentation levels for air conduction will exceed IA for supra-aural phones at nearly every frequency. Insert earphones (IA ~70 dB) reduce masking need but are still needed for bone conduction.',
      criticalScenarios: [
        'Every frequency during air conduction with supra-aural phones',
        'All bone conduction testing',
        'Speech audiometry at suprathreshold levels',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Maximum gain vs. feedback control',
        explanation: 'Patient needs every dB of gain, but high gain drives feedback. Full shell with no vent is essential, and even then, feedback management must be aggressive.',
      },
      {
        tradeoff: 'Amplification vs. CI candidacy',
        explanation: 'Continuing to push hearing aid gain may delay CI evaluation that could provide better outcomes. Students should know when to discuss CI referral.',
      },
      {
        tradeoff: 'Comfort vs. audibility',
        explanation: 'Full shell molds with no vent cause maximum occlusion, ear canal sweating, and discomfort. But any acoustic compromise reduces already-marginal audibility.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Still can\'t hear enough"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'May be at technology limits',
        action: 'Verify gain matches target; counsel on realistic expectations; consider CI referral if aided WRS < 50%',
      },
      {
        complaint: '"Sounds distorted"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Cochlear distortion cannot be fixed with gain',
        action: 'Check MPO; reduce gain slightly if compression is over-processing; counsel that some distortion is inherent to severe cochlear damage',
      },
      {
        complaint: '"Feedback constantly"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Fitting seal problem',
        action: 'Check earmold fit; consider remake; verify no cracks/tubing issues; review feedback manager settings',
      },
      {
        complaint: '"Listening is exhausting"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Listening effort is expected with severe loss',
        action: 'Counsel on breaks; recommend FM systems for extended listening; suggest visual communication supplements',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Aided WRS < 50% best-aided condition — CI candidacy evaluation',
        'Sudden change in thresholds — urgent ENT',
      ],
      urgency: 'routine',
      referTo: 'CI center / Otologist for candidacy; ENT for sudden changes',
    },
    commonMistakes: [
      {
        mistake: 'Using an open dome or vented mold "because the patient complained about occlusion"',
        consequence: 'Catastrophic feedback; gain cannot reach target; patient hears almost nothing',
        correction: 'Severe-profound loss requires full shell with minimal or no venting. Address occlusion complaints with counseling and ensure proper fit, not by opening the fitting.',
      },
      {
        mistake: 'Not discussing cochlear implant candidacy',
        consequence: 'Patient remains with inadequate amplification when CI could provide significantly better outcomes',
        correction: 'If best-aided WRS is below 50%, the student MUST discuss CI evaluation with the patient and supervising audiologist.',
      },
      {
        mistake: 'Setting MPO too low to avoid loudness complaints',
        consequence: 'Signal clipping; speech peaks are cut off; intelligibility drops',
        correction: 'Set MPO to the patient\'s measured UCL; do not arbitrarily lower it.',
      },
    ],
    clinicalPearls: [
      { pearl: 'These patients are often the most motivated and compliant. They know what it\'s like to not hear and they depend on their aids. The fitting is technically demanding but the patient relationship is often rewarding.' },
      { pearl: 'Always assess CI candidacy as part of best practice. This is not a failure of hearing aids — it\'s recognizing that the technology has limits and the patient deserves the best option.' },
      { pearl: 'Remote microphone systems (FM, Roger) provide more speech-in-noise benefit for severe-profound patients than any hearing aid feature. Recommend one for every severe-profound patient.' },
    ],
  },

  // =========================================================================
  // 6.4 Cookie-Bite (Mid-Frequency Loss)
  // =========================================================================
  {
    id: 'cookie-bite',
    name: 'Cookie-Bite (Mid-Frequency Loss)',
    shortName: 'Cookie-Bite',
    category: 'SNHL',
    prevalence: 'Rare (~5%)',
    audiogramSignature: {
      description: 'Normal or near-normal thresholds at 250-500 Hz and 4000-8000 Hz with depressed thresholds in the 1000-2000 Hz range (typically 40-65 dB). Creates a "U" or cookie-bite shape. Sensorineural (no air-bone gap).',
      typicalThresholds: {
        250: [5, 20],
        500: [10, 25],
        1000: [40, 60],
        2000: [45, 65],
        4000: [10, 25],
        8000: [5, 20],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Mid-frequency dip', 'U-shaped', 'Normal lows and highs, impaired mids'],
    },
    typicalComplaints: [
      '"Speech sounds distorted" (loss in critical speech frequency region)',
      '"I can hear sounds but they don\'t sound right"',
      '"My own voice sounds strange" (complex interaction with occlusion)',
      '"Music sounds off-key or hollow"',
      '"Hearing aids make everything sound unnatural"',
    ],
    fittingApproach: {
      transducerChoice: 'RIC or BTE with custom mold',
      earmoldCoupling: 'Canal mold or closed dome — need to deliver mid-frequency gain without amplifying already-normal lows and highs',
      ventSize: 'Medium vent to allow normal low-frequency and high-frequency hearing to pass through; venting critical to avoid over-amplifying normal regions',
      prescriptiveTarget: 'NAL-NL2; prescriptive formula will naturally prescribe gain only where needed (mid-frequencies); verify that gain at 250-500 Hz and 4000+ Hz is minimal or zero',
      keyFrequencyRegions: '750-3000 Hz is the target zone; 250-500 Hz and 4000+ Hz should receive minimal gain',
      additionalConsiderations: [
        'Compression ratios may need to be lower (1.2-1.5:1) in the mid-frequencies to preserve naturalness',
        'Wideband compression can distort the spectral shape',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'If mid-frequency thresholds exceed 40 dB with supra-aural phones, masking may be needed at those frequencies. Low and high frequencies with normal thresholds rarely need masking.',
      criticalScenarios: [
        'Bone conduction at 1000-2000 Hz',
        'Air conduction at 1000-2000 Hz if loss >40 dB with supra-aural phones',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Mid-frequency gain vs. naturalness',
        explanation: 'The patient needs gain in the mid-frequencies but adding it changes the tonal quality of everything. Mid-frequency gain applied broadly sounds "robotic" or "tinny."',
      },
      {
        tradeoff: 'Preserving normal hearing vs. consistent amplification',
        explanation: 'Normal lows and highs should pass through unamplified, but hearing aid processing may alter these regions slightly. Channel-specific gain control is essential.',
      },
      {
        tradeoff: 'Compression accuracy vs. simplicity',
        explanation: 'Independent compression in the mid-frequency channels is needed, but too many channels with different compression ratios creates artifacts at channel boundaries.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Sounds unnatural/robotic"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Likely over-amplification in transition frequencies between normal and impaired',
        action: 'Check gain at 500 Hz and 3-4 kHz — should be near zero; smooth the gain curve transitions; counsel on adaptation',
      },
      {
        complaint: '"Speech distorted"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'May need fine-tuning in 1-2 kHz range',
        action: 'Verify gain matches prescriptive target in the mid-frequencies specifically; adjust in 2-3 dB steps',
      },
      {
        complaint: '"Own voice sounds weird"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Complex interaction — own voice has strong mid-frequency energy',
        action: 'Adjust mid-frequency gain and venting; counsel that own-voice perception changes are expected',
      },
      {
        complaint: '"Music sounds hollow"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Mid-frequency emphasis can change musical timbre',
        action: 'Consider music program with wider bandwidth and less compression; counsel on hearing aid vs. acoustic listening for music',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'If pattern is progressive (worsening over time), refer for genetic counseling consideration',
      ],
      urgency: 'routine',
      referTo: 'ENT / genetic counselor if progressive or family history suggests hereditary component',
    },
    commonMistakes: [
      {
        mistake: 'Applying broadband gain instead of frequency-specific gain',
        consequence: 'Normal low-frequency and high-frequency hearing is over-amplified; patient reports "everything sounds wrong"',
        correction: 'Only amplify where the loss is. Verify with REM that gain at 250-500 Hz and 4000+ Hz is near zero.',
      },
      {
        mistake: 'Using an open dome because low-frequency hearing is normal',
        consequence: 'The open dome vents out the mid-frequency gain the patient needs',
        correction: 'A closed dome or custom mold with a medium vent provides the seal needed to deliver mid-frequency gain while venting some low-frequency energy.',
      },
      {
        mistake: 'Dismissing the patient\'s "sounds strange" complaints as adaptation',
        consequence: 'Patient abandons aids',
        correction: 'Cookie-bite fittings genuinely sound unusual because the gain profile is unusual. Fine-tuning is expected and multiple adjustment visits are normal.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Cookie-bite losses are relatively rare (~5% of sensorineural losses) and notoriously difficult to fit. Expect more follow-up visits than average. This is not a failure of the student — it\'s the nature of the loss.' },
      { pearl: 'These patients often report that "something isn\'t right" even when REM shows gain on target. Consider reducing gain to 80-90% of target in the mid-frequencies and increasing gradually.' },
      { pearl: 'If the cookie-bite is hereditary (ask about family history), the patient may already have developed compensatory listening strategies. Work with these rather than against them.' },
    ],
  },

  // =========================================================================
  // 6.5 Rising Loss (Better High Frequencies)
  // =========================================================================
  {
    id: 'rising-loss',
    name: 'Rising Loss (Better High Frequencies)',
    shortName: 'Rising Loss',
    category: 'SNHL',
    prevalence: 'Rare (~3-5%)',
    audiogramSignature: {
      description: 'Poorer thresholds at 250-1000 Hz (typically 40-65 dB HL) with better thresholds at 2000-8000 Hz (typically 10-30 dB HL). Creates a "reverse slope" or rising configuration. Sensorineural (no air-bone gap).',
      typicalThresholds: {
        250: [45, 65],
        500: [40, 60],
        1000: [35, 55],
        2000: [15, 35],
        4000: [10, 30],
        8000: [10, 25],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Reverse slope', 'Low-frequency loss', 'Rising configuration'],
    },
    typicalComplaints: [
      '"I hear fine in quiet but men\'s voices are hard to follow" (low-frequency vowel energy carries male voice fundamental)',
      '"My own voice is incredibly boomy/loud" (severe occlusion effect)',
      '"Music sounds thin/tinny" (missing bass/warmth from low-frequency loss)',
      '"Environmental sounds are too sharp/bright" (high frequencies are near-normal but low frequencies are muffled)',
      '"I have a hard time with phone calls" (telephone bandwidth emphasizes mid-low frequencies)',
    ],
    fittingApproach: {
      transducerChoice: 'BTE with custom mold strongly recommended; RIC can work if receiver can deliver adequate low-frequency output',
      earmoldCoupling: 'Full shell or half shell — need a sealed fitting to deliver low-frequency amplification',
      ventSize: 'Minimal or no vent — any vent directly undermines the low-frequency gain this patient needs. Pressure vent only if absolutely necessary for comfort.',
      prescriptiveTarget: 'NAL-NL2 or DSL v5; verify that prescriptive software is not under-prescribing low-frequency gain; REM verification at 250-1000 Hz is critical',
      keyFrequencyRegions: '250-1000 Hz is the primary amplification target; 2000+ Hz needs little to no gain',
      additionalConsiderations: [
        'Own-voice processing features are essential',
        'Occlusion management is the primary fitting challenge',
        'Consider deep-canal fitting to reduce occlusion effect',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'Significant low-frequency loss (50+ dB at 250-500 Hz) with supra-aural phones (IA ~40 dB) means masking is frequently needed at 250-1000 Hz. High frequencies with near-normal thresholds rarely need masking.',
      criticalScenarios: [
        'Air conduction at 250-500 Hz if loss >40 dB with supra-aural phones',
        'All bone conduction at low frequencies',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Low-frequency gain vs. occlusion',
        explanation: 'The patient needs maximum low-frequency gain, but delivering it requires a sealed fitting that maximizes occlusion. The very frequencies the patient needs amplified are the same ones that cause occlusion discomfort.',
      },
      {
        tradeoff: 'Sealed fit vs. comfort',
        explanation: 'Full shell with no vent is acoustically ideal but may be uncomfortable. Any vent leaks the low-frequency gain the patient depends on.',
      },
      {
        tradeoff: 'Natural high-frequency hearing vs. processing artifacts',
        explanation: 'High-frequency hearing is near-normal, but hearing aid processing may degrade it. Ensure high-frequency gain is near zero.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Own voice is unbearably loud/boomy"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Occlusion effect is severe and real',
        action: 'Consider deep-fit custom mold; activate own-voice processing; discuss trade-off honestly: "reducing occlusion means less benefit from low-frequency gain"',
      },
      {
        complaint: '"Men\'s voices are still hard to understand"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Likely insufficient low-frequency gain',
        action: 'Increase gain at 250-750 Hz; verify with REM; check that vent is not too large',
      },
      {
        complaint: '"Music sounds tinny"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Missing low-frequency amplification for bass',
        action: 'Increase 250-500 Hz gain; create music program with enhanced LF; counsel that bass perception will improve with adaptation',
      },
      {
        complaint: '"Sounds too bright/sharp"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'High-frequency gain applied where not needed',
        action: 'Verify that gain above 2000 Hz is near zero; reduce if not',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'If loss is fluctuating, associated with episodic vertigo, or has tinnitus and aural fullness — refer for Meniere\'s evaluation',
      ],
      urgency: 'priority',
      referTo: 'ENT / Neurotology',
    },
    commonMistakes: [
      {
        mistake: 'Using an open fitting because "the high frequencies are normal"',
        consequence: 'All the low-frequency gain escapes through the vent; patient gets no benefit',
        correction: 'The open fitting is for preserving normal LOW-frequency hearing. In a rising loss, the LOW frequencies are impaired. This patient needs a CLOSED fitting.',
      },
      {
        mistake: 'Dismissing occlusion complaints because "the fitting has to be sealed"',
        consequence: 'Patient rejects aids',
        correction: 'Occlusion is the #1 fitting challenge for rising loss. Use deep-fit molds, own-voice processing, and honest counseling. Don\'t dismiss it.',
      },
      {
        mistake: 'Applying the "typical" hearing aid gain shape (more gain in highs)',
        consequence: 'Amplifying normal high frequencies while under-amplifying impaired low frequencies',
        correction: 'Follow the prescriptive formula — it will correctly prescribe gain where the loss is, not where "hearing aid gain usually goes."',
      },
    ],
    clinicalPearls: [
      { pearl: 'Rising losses are rare (~3-5% of SNHL cases) and many students have never seen one in clinic. The fitting approach is nearly the opposite of the more common sloping loss. Don\'t apply sloping-loss intuitions to a rising loss.' },
      { pearl: 'If the low-frequency loss fluctuates visit to visit, strongly suspect Meniere\'s disease and prioritize the referral. The hearing aid fitting should be secondary to the medical diagnosis.' },
      { pearl: 'Deep canal fittings (extending the mold or receiver deeper into the bony portion of the canal) can dramatically reduce occlusion effect because they bypass the vibrating cartilaginous portion.' },
    ],
  },

  // =========================================================================
  // 6.6 Unilateral Hearing Loss
  // =========================================================================
  {
    id: 'unilateral',
    name: 'Unilateral Hearing Loss (One Normal Ear)',
    shortName: 'Unilateral',
    category: 'Special',
    prevalence: 'Moderate',
    audiogramSignature: {
      description: 'One ear with normal thresholds (0-20 dB HL) across all frequencies; the other ear with any degree/configuration of hearing loss. Clear interaural asymmetry.',
      typicalThresholds: {
        250: [0, 15],
        500: [0, 15],
        1000: [0, 20],
        2000: [0, 20],
        4000: [0, 20],
        8000: [0, 20],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Unilateral', 'One normal ear', 'Single-sided'],
    },
    typicalComplaints: [
      '"I can\'t tell where sounds are coming from" (localization deficit)',
      '"I can\'t hear people on my bad side" (head shadow effect)',
      '"I do fine one-on-one but struggle in groups" (loss of binaural advantage)',
      '"I\'m always repositioning to put my good ear toward the speaker"',
      '"I feel unbalanced" (auditory spatial perception asymmetry)',
    ],
    fittingApproach: {
      transducerChoice: 'Depends on impaired ear\'s degree — if aidable: RIC or BTE. If unaidable (profound/dead ear): CROS/BiCROS system or bone-anchored hearing aid (BAHA/Osia)',
      earmoldCoupling: 'Per degree of loss in impaired ear (see other pattern guides)',
      ventSize: 'Per degree of loss in impaired ear; normal ear remains unfitted (or receives CROS receiver)',
      prescriptiveTarget: 'Monaural fitting on impaired ear; for CROS, goal is to route sound from impaired side to normal ear',
      keyFrequencyRegions: 'Depends on impaired ear\'s configuration',
      additionalConsiderations: [
        'CROS/BiCROS assessment if impaired ear WRS < 40%',
        'Bone-anchored device if unaidable ear and patient wants localization benefit',
        'Counsel heavily on limitations of monaural hearing and strategies',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'Testing the impaired ear requires masking in the normal ear at nearly every frequency and for both air and bone conduction. The normal ear\'s sensitivity means signals cross over very easily.',
      criticalScenarios: [
        'Every threshold in the impaired ear needs masking verification',
        'Bone conduction masking is essential',
        'WRS testing of the impaired ear requires masking of the normal ear',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Conventional aid vs. CROS',
        explanation: 'A conventional aid amplifies residual hearing in the impaired ear. A CROS routes all sound from the impaired side to the normal ear. The patient must choose which approach better matches their daily life.',
      },
      {
        tradeoff: 'Localization vs. awareness',
        explanation: 'A CROS improves awareness of sounds from the impaired side but does NOT restore localization. Conventional aid may provide some interaural timing cues if hearing is aidable.',
      },
      {
        tradeoff: 'Cost/complexity vs. benefit',
        explanation: 'CROS and bone-anchored systems are more expensive and complex. The benefit may be marginal if the primary listening situation is one-on-one in quiet.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Can\'t localize sounds"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Monaural hearing cannot localize accurately; physiological limitation',
        action: 'Counsel on head-turning strategy and environmental awareness; discuss bone-anchored options if severe',
      },
      {
        complaint: '"Can\'t hear on my bad side"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'If aidable: amplification helps. If not: CROS may help',
        action: 'Assess WRS in impaired ear; if aidable, fit conventionally; if not, trial CROS system',
      },
      {
        complaint: '"Struggle in group conversation"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Loss of binaural squelch effect; fundamental limitation',
        action: 'Counsel on seating strategies; recommend remote mic for important group settings',
      },
      {
        complaint: '"Hearing aid on my bad ear doesn\'t help enough"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'May need CROS/BiCROS instead',
        action: 'Re-evaluate aided benefit; if WRS < 40% in impaired ear, discuss CROS',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Any unilateral SNHL without known cause should be referred to rule out acoustic neuroma/vestibular schwannoma',
      ],
      urgency: 'priority',
      referTo: 'ENT / Otologist for MRI with gadolinium',
    },
    commonMistakes: [
      {
        mistake: 'Forgetting to mask the normal ear during testing',
        consequence: 'Cross-hearing produces false thresholds — the "impaired ear" appears better than it actually is',
        correction: 'Unilateral loss = masking at EVERY frequency for EVERY test type. No exceptions.',
      },
      {
        mistake: 'Fitting a conventional hearing aid on a dead ear',
        consequence: 'The ear has no usable hearing; the aid provides no benefit; the patient is frustrated',
        correction: 'Check WRS first. If WRS < 40% even with amplification, conventional amplification is inappropriate. Discuss CROS/BiCROS or bone-anchored options.',
      },
      {
        mistake: 'Not referring for medical evaluation',
        consequence: 'Potentially missing a vestibular schwannoma',
        correction: 'Every unilateral SNHL without a clear cause requires ENT referral. This is non-negotiable.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Always ask "When did this start?" and "Was it sudden?" A sudden unilateral loss is a medical emergency — the patient should be seen by ENT within 24-48 hours for possible steroid treatment.' },
      { pearl: 'The head shadow effect reduces the signal reaching the impaired ear by 6-15 dB depending on frequency. Even a perfectly fitted hearing aid cannot overcome this in all situations.' },
      { pearl: 'For children with unilateral loss, classroom amplification (FM/remote mic) is more impactful than any hearing aid. Prioritize the FM recommendation.' },
    ],
  },

  // =========================================================================
  // 6.7 Asymmetric SNHL
  // =========================================================================
  {
    id: 'asymmetric-snhl',
    name: 'Asymmetric SNHL (Both Ears, 15+ dB Difference)',
    shortName: 'Asymmetric SNHL',
    category: 'SNHL',
    prevalence: 'Moderate',
    audiogramSignature: {
      description: 'Both ears have SNHL, but thresholds differ by >= 15 dB at 3 or more frequencies. No air-bone gap in either ear. The poorer ear may have any configuration.',
      typicalThresholds: {
        250: [15, 40],
        500: [15, 45],
        1000: [20, 50],
        2000: [25, 60],
        4000: [30, 70],
        8000: [35, 75],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Asymmetric', 'Both ears impaired but different degrees'],
    },
    typicalComplaints: [
      '"One ear works much better than the other with hearing aids"',
      '"I feel like the sound is all coming from one side"',
      '"The hearing aid in my worse ear is too loud / not loud enough"',
      '"I can\'t understand speech unless I turn my good ear toward the speaker"',
      '"Music sounds unbalanced"',
    ],
    fittingApproach: {
      transducerChoice: 'Bilateral fitting strongly recommended; choose transducer per each ear\'s degree independently',
      earmoldCoupling: 'Per each ear\'s degree — may have open dome on better ear and closed mold on poorer ear',
      ventSize: 'Per each ear\'s degree — larger vent on better ear, smaller on poorer ear',
      prescriptiveTarget: 'Fit each ear independently; consider bilateral loudness summation (~3-6 dB); balance aided output between ears',
      keyFrequencyRegions: 'Per each ear\'s configuration; pay special attention to frequency regions where asymmetry is greatest',
      additionalConsiderations: [
        'Address binaural loudness balance — may need different gain in each ear for subjective balance',
        'Binaural coordination features should be enabled if available',
        'Consider CROS/BiCROS if poorer ear is unaidable',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'The interaural threshold difference means testing the poorer ear risks cross-hearing to the better ear. The larger the asymmetry, the more critical masking becomes.',
      criticalScenarios: [
        'Air conduction of the poorer ear at frequencies where asymmetry exceeds IA',
        'Bone conduction at all frequencies for both ears',
        'WRS testing of the poorer ear',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Binaural balance vs. prescriptive accuracy',
        explanation: 'Setting each ear to prescriptive target may create a large loudness imbalance. Reducing gain in the better ear sacrifices audibility. Increasing gain in the poorer ear beyond target may cause distortion.',
      },
      {
        tradeoff: 'Bilateral vs. monaural fitting',
        explanation: 'If the poorer ear\'s WRS is very low (<40%), adding a hearing aid may degrade overall speech understanding (binaural interference). In rare cases, monaural fitting of the better ear alone may produce better outcomes.',
      },
      {
        tradeoff: 'CI candidacy for poorer ear',
        explanation: 'If the poorer ear has severe-profound loss with poor WRS, CI in that ear + hearing aid in the better ear (bimodal fitting) may be the best option.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"One side is much louder than the other"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Real perceptual difference due to asymmetric loss',
        action: 'Adjust bilateral balance; may need to reduce better-ear gain slightly or increase poorer-ear gain; counsel that perfect balance is difficult with asymmetric loss',
      },
      {
        complaint: '"Worse ear\'s aid doesn\'t help"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'May have reached amplification limits for that ear',
        action: 'Check aided WRS in poorer ear; if < 40%, consider CROS/BiCROS; counsel on realistic expectations',
      },
      {
        complaint: '"Sound image pulls to one side"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Interaural loudness imbalance',
        action: 'Use bilateral balance adjustment; counsel that spatial hearing requires two functioning ears at similar levels',
      },
      {
        complaint: '"Can\'t understand in noise with both aids"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Asymmetric input degrades binaural processing advantage',
        action: 'Optimize both aids; verify directional mics; counsel on fundamental binaural advantage limitations',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Interaural asymmetry >= 15 dB at 3+ frequencies or >= 20 dB at 2+ frequencies, without known cause',
      ],
      urgency: 'priority',
      referTo: 'ENT / Otologist for MRI to rule out vestibular schwannoma',
    },
    commonMistakes: [
      {
        mistake: 'Fitting only the better ear',
        consequence: 'Patient loses binaural benefit (localization, squelch, summation)',
        correction: 'Always trial bilateral fitting unless the poorer ear\'s WRS is so poor that it creates binaural interference.',
      },
      {
        mistake: 'Not referring for medical evaluation',
        consequence: 'Potentially missing vestibular schwannoma',
        correction: 'Asymmetric SNHL without a known cause REQUIRES referral. Fit hearing aids if appropriate, but the referral is non-negotiable.',
      },
      {
        mistake: 'Using the same programming for both ears',
        consequence: 'Under-fitting one ear and over-fitting the other',
        correction: 'Each ear is fitted independently to its own prescriptive target. The coupling, vent, and gain are determined by each ear\'s audiogram.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Always test WRS independently in each ear with appropriate masking. The poorer ear\'s WRS is the single most important piece of information for determining whether bilateral fitting is appropriate.' },
      { pearl: 'If the asymmetry is progressive (getting worse over time), the referral urgency increases. Document thresholds at each visit and compare to detect progression.' },
      { pearl: 'Patients with asymmetric loss often benefit significantly from remote microphone systems because these overcome the head shadow effect.' },
    ],
  },

  // =========================================================================
  // 6.8 Conductive Loss
  // =========================================================================
  {
    id: 'conductive',
    name: 'Conductive Loss (Air-Bone Gap Present)',
    shortName: 'Conductive',
    category: 'Conductive',
    prevalence: 'Moderate',
    audiogramSignature: {
      description: 'Air conduction thresholds elevated (25-60+ dB HL). Bone conduction thresholds normal or near-normal (0-20 dB HL). Air-bone gap >= 10 dB at one or more frequencies. Gap indicates outer/middle ear pathology.',
      typicalThresholds: {
        250: [30, 60],
        500: [30, 55],
        1000: [25, 50],
        2000: [25, 50],
        4000: [25, 45],
        8000: [20, 40],
      },
      airBoneGap: true,
      distinguishingFeatures: ['Air-bone gap', 'Normal bone conduction', 'Conductive component'],
    },
    typicalComplaints: [
      '"Everything sounds muffled, like there\'s cotton in my ears"',
      '"I can hear my own voice very loudly" (bone conduction of own voice is normal)',
      '"Sounds are quiet but not distorted" (cochlea is intact)',
      '"I hear better in noise than most people" (paracusis of Willis)',
      '"Pressure in my ears" (if middle ear pathology involves effusion or ETD)',
    ],
    fittingApproach: {
      transducerChoice: 'First priority: MEDICAL REFERRAL. Conductive loss may be medically/surgically treatable. Only fit after medical clearance.',
      earmoldCoupling: 'After medical clearance — per degree of air conduction loss; bone-anchored hearing aid (BAHA/Osia) is an alternative',
      ventSize: 'Per air conduction thresholds; bone-anchored device needs no coupling (direct bone stimulation)',
      prescriptiveTarget: 'Prescriptive fitting based on air conduction thresholds; cochlea is normal, so WRS should be excellent with proper amplification',
      keyFrequencyRegions: 'Per the air conduction configuration; often the gap is largest at low frequencies',
      additionalConsiderations: [
        'Bone-anchored hearing devices bypass the conductive component entirely',
        'Often the best option for chronic conductive loss not surgically correctable',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'Bone conduction thresholds must be measured with masking to confirm they are truly normal. Without masking, BC responses could be from either ear (BC IA is ~0 dB). Occlusion effect must be accounted for in masking with supra-aural transducers.',
      criticalScenarios: [
        'ALL bone conduction testing (BC IA = 0 dB, masking always needed)',
        'Air conduction of poorer ear if bilateral and asymmetric',
        'The masking dilemma can occur when air-bone gaps are large in both ears',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Medical/surgical treatment vs. amplification',
        explanation: 'Surgery (e.g., stapedectomy, tympanoplasty) may restore hearing without amplification. But surgery has risks. The patient and ENT make this decision.',
      },
      {
        tradeoff: 'Conventional aid vs. bone-anchored device',
        explanation: 'Conventional aids amplify through the impaired conductive pathway. Bone-anchored devices bypass it entirely. For chronic conductive loss, bone-anchored is often superior but requires surgery.',
      },
      {
        tradeoff: 'Fitting before vs. after medical treatment',
        explanation: 'Fitting hearing aids first creates dependency and delays treatment. But if the patient is waiting months for surgery, temporary amplification may be appropriate.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Still sounds muffled with aids"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Likely insufficient gain to bridge the air-bone gap',
        action: 'Increase overall gain; verify with REM; check for cerumen or middle ear changes',
      },
      {
        complaint: '"Own voice is too loud with aids"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Occlusion effect is especially problematic in conductive loss',
        action: 'Increase vent if possible; counsel that own-voice loudness is due to normal bone conduction in the presence of muffled air conduction',
      },
      {
        complaint: '"Ear feels full/pressure"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'May be middle ear pathology, not fitting issue',
        action: 'Do not adjust — this is a medical symptom. Re-evaluate tympanometry; consider re-referral to ENT',
      },
      {
        complaint: '"Hearing seems to fluctuate"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Fluctuating conductive loss suggests active middle ear pathology',
        action: 'Urgent re-referral to ENT; do not adjust aids based on fluctuating presentation',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Any conductive hearing loss (air-bone gap >= 10 dB) without prior medical clearance must be referred to ENT',
      ],
      urgency: 'routine',
      referTo: 'ENT / Otologist (urgent if active drainage, pain, or sudden onset)',
    },
    commonMistakes: [
      {
        mistake: 'Fitting hearing aids without medical referral/clearance',
        consequence: 'Potentially treatable medical condition goes unaddressed; possible medicolegal liability',
        correction: 'ALWAYS refer conductive loss for medical evaluation before fitting. The ONLY exception is if the patient has already been evaluated and cleared by ENT.',
      },
      {
        mistake: 'Forgetting to account for occlusion effect in masking calculations',
        consequence: 'Under-masking during BC testing; false bone conduction thresholds; incorrect air-bone gap measurement',
        correction: 'When masking with supra-aural headphones during BC testing, add the occlusion effect (OE) to starting effective masking level at 250-1000 Hz. Insert earphones eliminate OE.',
      },
      {
        mistake: 'Assuming the loss is permanent without checking',
        consequence: 'Fitting aids for what turns out to be a temporary conductive component (e.g., middle ear effusion)',
        correction: 'Conductive loss can be transient. Verify the loss is stable before fitting. If uncertain, retest in 2-4 weeks.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Patients with conductive loss often do remarkably well with amplification because their cochlea is intact. WRS should be near 100%. If WRS is poor, suspect a mixed component.' },
      { pearl: 'The "hearing better in noise" phenomenon (paracusis of Willis) is characteristic of conductive loss and can be a useful diagnostic clue.' },
      { pearl: 'For chronic ear conditions (e.g., chronic otitis media with draining ears), bone-anchored devices are often the best option because conventional molds can trap moisture.' },
    ],
  },

  // =========================================================================
  // 6.9 Mixed Loss
  // =========================================================================
  {
    id: 'mixed-loss',
    name: 'Mixed Loss (SNHL + Conductive Component)',
    shortName: 'Mixed Loss',
    category: 'Mixed',
    prevalence: 'Moderate',
    audiogramSignature: {
      description: 'Air conduction thresholds elevated (often 40-80+ dB HL). Bone conduction also elevated but better than air (20-60 dB HL). Air-bone gap present (>= 10 dB). Both cochlear damage AND outer/middle ear pathology.',
      typicalThresholds: {
        250: [45, 80],
        500: [45, 75],
        1000: [40, 70],
        2000: [40, 70],
        4000: [40, 75],
        8000: [40, 70],
      },
      airBoneGap: true,
      distinguishingFeatures: ['Air-bone gap WITH elevated bone conduction', 'Both components impaired'],
    },
    typicalComplaints: [
      '"Everything is very quiet AND unclear" (both volume and clarity affected)',
      '"Sounds are muffled and distorted"',
      '"I need the TV very loud and even then I miss words"',
      '"Ear feels full and I can\'t hear well" (if active middle ear pathology)',
    ],
    fittingApproach: {
      transducerChoice: 'MEDICAL REFERRAL FIRST for the conductive component. After clearance: BTE with custom mold for moderate-severe; consider bone-anchored device',
      earmoldCoupling: 'Per air conduction degree — typically half shell or full shell due to overall severity',
      ventSize: 'Per air conduction degree; small or no vent likely due to overall loss severity',
      prescriptiveTarget: 'Fit to air conduction thresholds; resolving the conductive component would change the prescriptive target — fitting may need revision post-treatment',
      keyFrequencyRegions: 'Per the air conduction configuration; gain needs driven by total loss (air conduction)',
      additionalConsiderations: [
        'If conductive component can be treated, residual SNHL determines long-term fitting needs',
        'Post-treatment re-evaluation is essential',
        'WRS will be limited by the sensorineural component even if conductive component is resolved',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'Mixed loss combines masking challenges of both conductive and sensorineural loss. The air-bone gap in the test ear affects masking calculations. The masking dilemma is more likely with bilateral mixed loss.',
      criticalScenarios: [
        'All bone conduction testing',
        'Air conduction of the poorer ear',
        'WRS testing',
        'The masking dilemma may be encountered with bilateral mixed loss',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Treat conductive component first vs. fit aids now',
        explanation: 'Ideally, treat the conductive component to reveal the true sensorineural floor, then fit to residual loss. But treatment may take months. Fitting aids to current air conduction loss provides immediate benefit.',
      },
      {
        tradeoff: 'Amplification level management',
        explanation: 'Total loss determines current gain needs, but if the conductive component resolves, the patient will be over-amplified. Plan for re-programming.',
      },
      {
        tradeoff: 'Bone-anchored vs. conventional',
        explanation: 'Bone-anchored devices bypass the conductive component and deliver sound directly to the cochlea. Effective for the conductive portion but still limited by the sensorineural portion.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Still too quiet"',
        isAdjustment: true,
        isCounseling: false,
        rationale: 'Gain likely insufficient for the overall loss severity',
        action: 'Increase gain; verify with REM against air conduction-based targets',
      },
      {
        complaint: '"Sounds unclear/distorted"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Distortion is from the sensorineural component and has limits',
        action: 'Optimize gain; counsel that clarity is limited by inner ear damage',
      },
      {
        complaint: '"Ear feels full/blocked"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'May indicate active middle ear pathology',
        action: 'Do not adjust hearing aids — refer back to ENT for middle ear re-evaluation',
      },
      {
        complaint: '"Hearing fluctuates"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'The conductive component may be changing',
        action: 'Re-refer to ENT; retest hearing; do not adjust aids until stable',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'Any air-bone gap without prior medical clearance requires ENT referral',
      ],
      urgency: 'routine',
      referTo: 'ENT / Otologist (higher urgency if drainage, pain, or sudden onset)',
    },
    commonMistakes: [
      {
        mistake: 'Fitting to bone conduction thresholds instead of air conduction',
        consequence: 'Dramatic under-amplification; patient hears almost nothing',
        correction: 'Prescriptive fitting uses AIR conduction thresholds because the hearing aid signal travels through the air conduction pathway.',
      },
      {
        mistake: 'Not re-evaluating after medical treatment',
        consequence: 'Patient is over-amplified after surgery/treatment resolves the conductive component',
        correction: 'Schedule re-evaluation and re-programming 4-6 weeks after medical treatment.',
      },
      {
        mistake: 'Encountering the masking dilemma and giving up',
        consequence: 'Bone conduction thresholds are not established; the loss type is misclassified',
        correction: 'Use insert earphones to increase IA; use SAL test or ABR for bone conduction estimation if masking dilemma is truly unavoidable.',
      },
    ],
    clinicalPearls: [
      { pearl: 'The sensorineural component sets the ceiling for how well the patient can ever do. Even if the conductive component is completely resolved, the remaining SNHL will still require management.' },
      { pearl: 'Mixed losses often produce the masking dilemma in clinical practice. Use insert earphones whenever possible to minimize the problem.' },
      { pearl: 'A mixed loss that was previously purely conductive suggests disease progression. Document carefully and communicate the change to the referring physician.' },
    ],
  },

  // =========================================================================
  // 6.10 Normal Thresholds with Poor WRS (Retrocochlear Suspicion)
  // =========================================================================
  {
    id: 'retrocochlear',
    name: 'Normal Thresholds with Poor WRS (Retrocochlear Suspicion)',
    shortName: 'Retrocochlear',
    category: 'Special',
    prevalence: 'Rare',
    audiogramSignature: {
      description: 'Pure tone thresholds within normal limits or mildly elevated (0-30 dB HL). WRS disproportionately poor for the degree of loss (e.g., WRS 50-70% with PTA of 15-25 dB). May show rollover. Acoustic reflexes may be absent, elevated, or show decay.',
      typicalThresholds: {
        250: [0, 20],
        500: [5, 25],
        1000: [5, 25],
        2000: [10, 30],
        4000: [10, 30],
        8000: [10, 25],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Normal PTA, poor WRS', 'Retrocochlear pattern', 'PTA-WRS discrepancy'],
    },
    typicalComplaints: [
      '"I can hear that someone is talking but I can\'t make out the words" (classic retrocochlear complaint)',
      '"Conversations sound garbled" (neural timing disruption)',
      '"I hear fine in quiet but it falls apart in any noise" (loss of binaural processing)',
      '"One ear seems weaker even though the test looks normal" (subjective neural compromise awareness)',
      '"I have constant ringing in one ear" (tinnitus, often unilateral)',
    ],
    fittingApproach: {
      transducerChoice: 'DO NOT FIT HEARING AIDS UNTIL MEDICAL EVALUATION IS COMPLETE. This pattern requires medical referral first.',
      earmoldCoupling: 'N/A until post-evaluation',
      ventSize: 'N/A',
      prescriptiveTarget: 'N/A — hearing aids are generally not effective for retrocochlear pathology (neural problem, not cochlear)',
      keyFrequencyRegions: 'N/A',
      additionalConsiderations: [
        'If medical evaluation is clear, consider auditory rehabilitation, FM/remote mic systems, and communication strategies',
        'Amplification may be trialed but expectations must be carefully managed — it cannot repair neural timing',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: true,
      explanation: 'WRS in each ear must be measured independently with masking of the non-test ear to confirm the poor score is not a cross-hearing artifact.',
      criticalScenarios: [
        'WRS testing at suprathreshold levels',
        'Rollover testing (testing at multiple presentation levels requires masking at each level)',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Further testing vs. immediate referral',
        explanation: 'Additional audiologic tests (acoustic reflex decay, ABR) can strengthen the referral, but should not delay it. If WRS is disproportionately poor, refer even without additional test results.',
      },
      {
        tradeoff: 'Hearing aid trial vs. no fitting',
        explanation: 'After medical clearance, a hearing aid trial may be attempted, but success rates are low for retrocochlear pathology. Setting expectations is essential.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Can hear but can\'t understand"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Hallmark of retrocochlear pathology — REFER FIRST',
        action: 'Medical referral is the primary action; counsel that this pattern needs investigation; do not attempt to solve with amplification',
      },
      {
        complaint: '"Ringing in one ear"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Unilateral tinnitus is a referral indicator',
        action: 'Refer to ENT; tinnitus evaluation is part of the retrocochlear workup',
      },
      {
        complaint: '"Struggling in noise"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Neural timing disruption limits noise processing',
        action: 'After medical clearance: recommend FM/remote mic; communication strategies; auditory rehabilitation',
      },
    ],
    referralGuidance: {
      referralPossible: true,
      criteria: [
        'WRS disproportionately poor for PTA',
        'Rollover present',
        'Unilateral tinnitus',
      ],
      urgency: 'priority',
      referTo: 'ENT / Otologist / Neurotology for MRI with gadolinium',
    },
    commonMistakes: [
      {
        mistake: 'Fitting hearing aids because "the thresholds show hearing loss"',
        consequence: 'Aids provide no benefit because the problem is neural, not cochlear. Patient may not seek proper medical evaluation.',
        correction: 'WRS is as important as PTA. If WRS is disproportionately poor, the priority is medical referral, not amplification.',
      },
      {
        mistake: 'Not performing WRS testing at multiple levels (rollover check)',
        consequence: 'Missing the rollover effect that is the hallmark of retrocochlear pathology',
        correction: 'Test WRS at PTA+30 AND at a higher level (e.g., +50 or +60). If WRS drops at the higher level, rollover is present — refer.',
      },
      {
        mistake: 'Assuming normal thresholds mean normal hearing',
        consequence: 'The patient\'s very real difficulty is dismissed',
        correction: 'Normal thresholds + poor WRS = abnormal hearing. The neural pathway is compromised even though the cochlea detects sound.',
      },
    ],
    clinicalPearls: [
      { pearl: 'This is the pattern that catches acoustic neuromas / vestibular schwannomas. A student who recognizes this pattern and refers appropriately may save a patient from a life-threatening tumor.' },
      { pearl: 'The PI-PB function is the key diagnostic tool. In retrocochlear pathology, WRS peaks then DROPS (rolls over). Rollover index > 0.45 is the classic criterion (Jerger & Jerger).' },
      { pearl: 'Auditory neuropathy spectrum disorder (ANSD) can also produce this pattern (normal OAE, abnormal ABR, poor WRS). The audiologist\'s job is to identify the pattern and refer — not to differentiate between causes.' },
    ],
  },

  // =========================================================================
  // 6.11 Noise-Induced Hearing Loss (4 kHz Notch)
  // =========================================================================
  {
    id: 'noise-induced',
    name: 'Noise-Induced Hearing Loss (4 kHz Notch)',
    shortName: 'NIHL',
    category: 'SNHL',
    prevalence: 'Common',
    audiogramSignature: {
      description: 'Normal or near-normal thresholds at 250-2000 Hz (0-25 dB HL). Sharp notch at 3000-4000 Hz (typically 40-65 dB at 4 kHz). Partial recovery at 6000-8000 Hz. Bilateral and roughly symmetric (occupational) or unilateral (acoustic trauma). No air-bone gap.',
      typicalThresholds: {
        250: [0, 15],
        500: [5, 20],
        1000: [5, 20],
        2000: [10, 25],
        4000: [40, 65],
        8000: [20, 40],
      },
      airBoneGap: false,
      distinguishingFeatures: ['4 kHz notch', 'Noise notch', 'Recovery above 4 kHz'],
    },
    typicalComplaints: [
      '"I can\'t hear in noisy environments" (damaged frequencies carry consonant detail)',
      '"High-pitched sounds are too loud or too sharp" (recruitment at damaged frequencies)',
      '"Constant ringing/buzzing" (tinnitus is very common with NIHL)',
      '"I can hear most things fine but certain sounds are missing"',
      '"People tell me I have the TV too loud" (compensating for HF loss)',
    ],
    fittingApproach: {
      transducerChoice: 'RIC preferred; BTE with thin tube acceptable',
      earmoldCoupling: 'Open dome or micro mold — low-frequency hearing is normal and should not be occluded',
      ventSize: 'Open or large vent — only amplify the notch region, preserve natural hearing elsewhere',
      prescriptiveTarget: 'NAL-NL2; gain concentrated in the 2-6 kHz region; minimal or no gain at 250-1000 Hz',
      keyFrequencyRegions: '2000-6000 Hz is the target; the 4 kHz notch is the primary gain target',
      additionalConsiderations: [
        'Tinnitus management features (masking noise, notch therapy) often needed',
        'Hearing protection counseling essential to prevent further damage',
        'Recruitment means compression at notch frequencies must be carefully managed',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: false,
      explanation: 'With symmetric thresholds and insert earphones, masking is rarely needed. If unilateral or asymmetric, masking follows standard rules.',
      criticalScenarios: [
        'Bone conduction testing at 4 kHz',
        'If asymmetric (e.g., firearm use on dominant side)',
        'WRS testing if asymmetric',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Amplification at the notch vs. recruitment',
        explanation: 'The damaged hair cells at 4 kHz often exhibit recruitment (abnormal loudness growth). Adding gain helps audibility but may cause discomfort at loud levels. Compression ratio must be carefully set.',
      },
      {
        tradeoff: 'Open fit naturalness vs. notch gain',
        explanation: 'Open fitting preserves natural low-frequency hearing but limits gain at the notch before feedback. If the notch is deep (>55 dB), a more closed fitting may be needed.',
      },
      {
        tradeoff: 'Tinnitus management vs. pure amplification',
        explanation: 'Some patients benefit more from tinnitus masking features than from the amplification itself. The hearing aid may serve primarily as a tinnitus management device.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Still can\'t hear in noise"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'NIHL fundamentally impairs consonant frequencies used in noise',
        action: 'Enable directional mics; noise program; counsel on hearing protection and realistic expectations',
      },
      {
        complaint: '"Ringing/tinnitus"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Tinnitus is common with NIHL',
        action: 'Enable tinnitus masker if available; refer to tinnitus program if severe; counsel on management strategies',
      },
      {
        complaint: '"Loud sounds are painful at 4 kHz"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Recruitment',
        action: 'Reduce MPO at notch frequencies; increase compression ratio; counsel that this sensitivity is part of the damage',
      },
      {
        complaint: '"I don\'t think I need hearing aids, I hear fine"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Patient hears fine in quiet because low-frequency hearing is normal',
        action: 'Counsel that the difficulty is real and specific to consonant perception; hearing protection prevents worsening',
      },
    ],
    referralGuidance: {
      referralPossible: false,
      criteria: [
        'Refer only if: notch is asymmetric without explained cause, loss is progressive beyond expected NIHL progression, or other concerning findings (poor WRS, vestibular symptoms)',
      ],
      urgency: 'none',
      referTo: 'ENT if atypical features; occupational health if workplace exposure',
    },
    commonMistakes: [
      {
        mistake: 'Adding gain at 250-1000 Hz because "the overall hearing test shows loss"',
        consequence: 'Occluding normal low-frequency hearing; creating unnecessary occlusion problems',
        correction: 'Only amplify where the loss is. For NIHL, that\'s the notch region only.',
      },
      {
        mistake: 'Not counseling about hearing protection',
        consequence: 'Continued noise exposure worsens the loss, widening and deepening the notch',
        correction: 'Every NIHL patient needs hearing protection counseling. This is prevention, and it\'s as important as the fitting.',
      },
      {
        mistake: 'Ignoring tinnitus',
        consequence: 'Patient may be more bothered by tinnitus than by hearing difficulty. If tinnitus is not addressed, patient may abandon aids.',
        correction: 'Always ask about tinnitus with NIHL patients. Enable tinnitus features or refer to a tinnitus management program.',
      },
    ],
    clinicalPearls: [
      { pearl: 'The 4 kHz notch with recovery at 6-8 kHz is pathognomonic for NIHL. It distinguishes NIHL from presbycusis (which shows progressive decline without recovery).' },
      { pearl: 'Many NIHL patients are reluctant to acknowledge hearing difficulty because "I hear fine most of the time." Validate their experience while explaining the mechanism.' },
      { pearl: 'Military veterans and hunters often have asymmetric NIHL: worse in the ear closest to the muzzle. A left-handed shooter will have worse hearing in the right ear.' },
    ],
  },

  // =========================================================================
  // 6.12 Presbycusis (Bilateral Sloping, Age-Related)
  // =========================================================================
  {
    id: 'presbycusis',
    name: 'Presbycusis (Bilateral Sloping, Age-Related)',
    shortName: 'Presbycusis',
    category: 'SNHL',
    prevalence: 'Most Common',
    audiogramSignature: {
      description: 'Bilateral symmetric sloping SNHL with gradual onset. Typically 15-30 dB HL at 250-1000 Hz, 40-70+ dB at 2000-8000 Hz. Progressive: thresholds worsen gradually over time. No air-bone gap, no notch, no recovery above 4 kHz.',
      typicalThresholds: {
        250: [15, 30],
        500: [15, 30],
        1000: [20, 35],
        2000: [35, 55],
        4000: [45, 70],
        8000: [55, 75],
      },
      airBoneGap: false,
      distinguishingFeatures: ['Bilateral symmetric', 'Age-related', 'Gradual sloping', 'No notch or recovery'],
    },
    typicalComplaints: [
      '"What?" / "Huh?" / "Can you repeat that?" (classic)',
      '"I hear fine, other people mumble" (denial/lack of awareness)',
      '"I can\'t follow conversation at family gatherings"',
      '"My spouse/children say the TV is too loud"',
      '"Church/meetings are impossible" (distance + reverberation)',
      '"I feel isolated" (social withdrawal due to communication difficulty)',
    ],
    fittingApproach: {
      transducerChoice: 'RIC strongly preferred for mild-moderate; BTE with thin tube for mild; BTE with custom mold for severe',
      earmoldCoupling: 'Open dome for mild; closed dome for moderate; custom mold for moderate-severe and above',
      ventSize: 'Open to medium depending on degree (see Sloping HF SNHL — similar principles)',
      prescriptiveTarget: 'NAL-NL2; gradual acclimatization recommended for first-time users (start at 80% of target, increase over 4-6 weeks)',
      keyFrequencyRegions: '1500-4000 Hz primary; extend to 6000+ Hz if audiogram and device allow',
      additionalConsiderations: [
        'Acclimatization management is critical — most presbycusis patients are first-time users in their 60s-80s',
        'Cognitive considerations for elderly patients (simplified controls, caregiver involvement, auto-programs preferred)',
        'Address realistic expectations: aids help enormously but don\'t restore normal hearing',
      ],
    },
    maskingGuidance: {
      typicallyNeeded: false,
      explanation: 'Symmetric thresholds mean cross-hearing produces responses at or near the true threshold. With insert earphones (IA ~70 dB), masking is rarely needed for air conduction.',
      criticalScenarios: [
        'Bone conduction at all frequencies (BC IA ~0 dB)',
        'Air conduction only if loss exceeds 70 dB at any frequency with insert earphones',
        'If asymmetric component is discovered, full masking protocol required',
      ],
    },
    tradeoffs: [
      {
        tradeoff: 'Acclimatization pace vs. benefit timeline',
        explanation: 'Starting at full target provides maximum benefit immediately but overwhelms most elderly first-time users. Starting lower is more comfortable but delays benefit, and some patients may not return for follow-up increases.',
      },
      {
        tradeoff: 'Feature complexity vs. usability',
        explanation: 'Modern hearing aids have many features (Bluetooth, apps, multiple programs) that are beneficial but may overwhelm elderly patients with limited technology comfort.',
      },
      {
        tradeoff: 'Bilateral fitting cost vs. benefit',
        explanation: 'Bilateral fitting provides clear advantages (localization, speech in noise, summation) but doubles the cost. For elderly patients on fixed income, monaural fitting is better than no fitting.',
      },
    ],
    adjustVsCounsel: [
      {
        complaint: '"Everything is too loud" (week 1-2)',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Acclimatization is the primary issue',
        action: 'Counsel on 2-4 week adaptation; reduce gain by 3-5 dB only if truly uncomfortable; schedule follow-up to increase toward target',
      },
      {
        complaint: '"Can\'t understand in noise"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Hardest challenge for presbycusis; aids help but don\'t solve it',
        action: 'Optimize directional mics; noise program; counsel on communication strategies; recommend remote mic for critical situations',
      },
      {
        complaint: '"The aids are annoying/bothersome"',
        isAdjustment: true,
        isCounseling: true,
        rationale: 'Often reflects acclimatization or unrealistic expectations',
        action: 'Investigate specific complaint; adjust if identifiable fitting issue; counsel on what aids can and cannot do',
      },
      {
        complaint: '"My friend has better hearing aids"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'Comparison shopping / unrealistic expectations',
        action: 'Counsel that benefit depends on degree of loss, neural health (WRS), and consistent use — not just the brand',
      },
      {
        complaint: '"I don\'t wear them, they sit in the drawer"',
        isAdjustment: false,
        isCounseling: true,
        rationale: 'This is the #1 failure mode for presbycusis fitting',
        action: 'Investigate WHY; address the specific barrier; re-motivate with clear benefit demonstration',
      },
    ],
    referralGuidance: {
      referralPossible: false,
      criteria: [
        'Refer if: sudden worsening (not gradual), asymmetric, WRS disproportionately poor, vestibular symptoms, or other red flags',
      ],
      urgency: 'none',
      referTo: 'ENT if atypical features',
    },
    commonMistakes: [
      {
        mistake: 'Starting at 100% of prescriptive target for a first-time user',
        consequence: 'Patient is overwhelmed, removes aids within hours, and may refuse to try again',
        correction: 'Start at 70-80% of target; increase by 5-10% at each follow-up (every 1-2 weeks) until full target is reached over 4-6 weeks.',
      },
      {
        mistake: 'Not involving family/caregivers',
        consequence: 'Patient goes home with no support; struggles with insertion/removal; stops wearing aids',
        correction: 'Include a communication partner at the fitting. Demonstrate insertion/removal to both patient and partner. Provide written instructions.',
      },
      {
        mistake: 'Spending all appointment time on fitting and none on counseling',
        consequence: 'Patient has perfectly programmed aids but unrealistic expectations, leading to dissatisfaction and returns',
        correction: 'Divide the appointment: 50% fitting, 50% counseling. The counseling is as important as the gain settings.',
      },
    ],
    clinicalPearls: [
      { pearl: 'Presbycusis is the most common reason people seek hearing aids. Becoming excellent at presbycusis fitting and counseling is the single highest-impact skill you can develop.' },
      { pearl: 'The biggest predictor of hearing aid success is not the fitting or technology — it\'s consistent daily use. Focus your counseling on building the wearing habit.' },
      { pearl: 'Cognitive decline and hearing loss are strongly correlated. Amplification may provide cognitive benefit beyond just better hearing. For hesitant patients and families, this evidence can be motivating.' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Quick Reference Matrix
// ---------------------------------------------------------------------------

export const PATTERN_QUICK_REF: readonly PatternQuickRef[] = [
  { patternId: 'flat-mild-moderate', typicalDegree: 'Mild-Moderate', transducer: 'BTE/RIC + closed dome', vent: 'Medium-Large', maskingNeeded: 'Rarely', referralNeeded: 'No', topComplaint: '"Too loud"' },
  { patternId: 'sloping-hf', typicalDegree: 'Mild-Severe', transducer: 'RIC + open dome', vent: 'Open', maskingNeeded: 'Sometimes', referralNeeded: 'If asymmetric', topComplaint: '"Can\'t hear in noise"' },
  { patternId: 'severe-profound-flat', typicalDegree: 'Severe-Profound', transducer: 'Power BTE + full shell', vent: 'None/Pressure', maskingNeeded: 'Almost always', referralNeeded: 'CI eval if WRS <50%', topComplaint: '"Still can\'t hear enough"' },
  { patternId: 'cookie-bite', typicalDegree: 'Moderate (mids)', transducer: 'RIC/BTE + canal mold', vent: 'Medium', maskingNeeded: 'Depends on degree', referralNeeded: 'If progressive', topComplaint: '"Sounds unnatural"' },
  { patternId: 'rising-loss', typicalDegree: 'Moderate (lows)', transducer: 'BTE + full/half shell', vent: 'Minimal/None', maskingNeeded: 'Often (low freq)', referralNeeded: 'If fluctuating (Meniere\'s)', topComplaint: '"Own voice is boomy"' },
  { patternId: 'unilateral', typicalDegree: 'Varies', transducer: 'CROS/BiCROS or per degree', vent: 'Per impaired ear', maskingNeeded: 'Almost always', referralNeeded: 'YES (rule out schwannoma)', topComplaint: '"Can\'t localize sounds"' },
  { patternId: 'asymmetric-snhl', typicalDegree: 'Varies (asymmetric)', transducer: 'Bilateral, per ear', vent: 'Per each ear', maskingNeeded: 'Yes, frequently', referralNeeded: 'YES (rule out schwannoma)', topComplaint: '"One side louder"' },
  { patternId: 'conductive', typicalDegree: 'Mild-Moderate', transducer: 'REFER FIRST; BAHA option', vent: 'Per AC degree', maskingNeeded: 'YES (critical)', referralNeeded: 'YES (mandatory)', topComplaint: '"Sounds muffled"' },
  { patternId: 'mixed-loss', typicalDegree: 'Moderate-Severe', transducer: 'REFER FIRST; BTE + mold', vent: 'Small/None', maskingNeeded: 'YES (critical)', referralNeeded: 'YES (mandatory)', topComplaint: '"Quiet AND unclear"' },
  { patternId: 'retrocochlear', typicalDegree: 'Normal/Mild PTA', transducer: 'DO NOT FIT — refer', vent: 'N/A', maskingNeeded: 'Yes (WRS testing)', referralNeeded: 'YES (URGENT)', topComplaint: '"Hear but can\'t understand"' },
  { patternId: 'noise-induced', typicalDegree: 'Mild-Moderate (notch)', transducer: 'RIC + open dome', vent: 'Open/Large', maskingNeeded: 'Rarely (if symmetric)', referralNeeded: 'No (if typical)', topComplaint: '"Can\'t hear in noise"' },
  { patternId: 'presbycusis', typicalDegree: 'Mild-Severe (sloping)', transducer: 'RIC + open/closed dome', vent: 'Open-Medium', maskingNeeded: 'Rarely (if symmetric)', referralNeeded: 'No (if classic)', topComplaint: '"People mumble"' },
];
