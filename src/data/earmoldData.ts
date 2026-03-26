// Static data for the Earmolds & Amplification Coupling page — styles, materials,
// acoustic modifications, impression procedures, and clinical decision-making content.

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface EarmoldStyle {
  name: string;
  description: string;
  bestFor: string;
  hearingLossRange: string;
  occlusion: string;
  retention: string;
}

export interface EarmoldMaterial {
  name: string;
  properties: string;
  advantages: string;
  disadvantages: string;
  bestFor: string;
}

export interface VentType {
  name: string;
  diameter: string;
  lowFreqEffect: string;
  useWhen: string;
}

export interface HornType {
  name: string;
  description: string;
}

export interface DamperType {
  name: string;
  effect: string;
}

export interface ImpressionStep {
  stepNumber: number;
  title: string;
  detail: string;
}

export interface ImpressionComplication {
  problem: string;
  cause: string;
  prevention: string;
}

export interface RemakeCriterion {
  indicator: string;
  reason: string;
}

export interface VentFeedbackLimit {
  diameter: string;
  lowFreqEffect: string;
  feedbackRisk: string;
  suitableFor: string;
}

export interface VentTradeoff {
  want: string;
  cost: string;
  whenWorthIt: string;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

export const EARMOLD_STYLES: EarmoldStyle[] = [
  {
    name: 'Full Shell',
    description: 'Fills entire concha; maximum seal',
    bestFor: 'Severe-profound loss; pediatric',
    hearingLossRange: 'Moderate to profound',
    occlusion: 'High',
    retention: 'Excellent',
  },
  {
    name: 'Half Shell',
    description: 'Fills lower concha only',
    bestFor: 'Moderate-severe loss',
    hearingLossRange: 'Moderate to severe',
    occlusion: 'Moderate-High',
    retention: 'Very Good',
  },
  {
    name: 'Canal',
    description: 'Extends only into ear canal',
    bestFor: 'Mild-moderate loss',
    hearingLossRange: 'Mild to moderate',
    occlusion: 'Moderate',
    retention: 'Good',
  },
  {
    name: 'Canal Lock (Skeleton)',
    description: 'Canal portion with concha lock arm',
    bestFor: 'Mild-moderate; retention concerns',
    hearingLossRange: 'Mild to moderate',
    occlusion: 'Low-Moderate',
    retention: 'Good (with lock)',
  },
  {
    name: 'Open Dome',
    description: 'Silicone dome with venting holes',
    bestFor: 'Mild high-frequency loss',
    hearingLossRange: 'Mild (high-freq only)',
    occlusion: 'Minimal',
    retention: 'Fair',
  },
  {
    name: 'Closed Dome',
    description: 'Silicone dome without venting',
    bestFor: 'Mild-moderate loss',
    hearingLossRange: 'Mild to moderate',
    occlusion: 'Moderate',
    retention: 'Fair',
  },
  {
    name: 'Power Dome / Double Dome',
    description: 'Dual-layer dome for better seal',
    bestFor: 'Moderate loss; feedback prone',
    hearingLossRange: 'Moderate',
    occlusion: 'Moderate-High',
    retention: 'Good',
  },
  {
    name: 'CIC Shell',
    description: 'Custom completely-in-canal shell',
    bestFor: 'Mild-moderate loss; cosmetic priority',
    hearingLossRange: 'Mild to moderate',
    occlusion: 'High (but canal only)',
    retention: 'Good',
  },
  {
    name: 'Micro Mold',
    description: 'Minimal custom mold with canal tip',
    bestFor: 'Mild-moderate; comfort priority',
    hearingLossRange: 'Mild to moderate',
    occlusion: 'Low',
    retention: 'Fair-Good',
  },
];

export const MATERIALS: EarmoldMaterial[] = [
  {
    name: 'Hard Acrylic (Lucite)',
    properties: 'Rigid, non-porous, smooth',
    advantages:
      'Durable; easy to modify; hypoallergenic; precise fit',
    disadvantages:
      'Can be uncomfortable initially; may amplify vibration feedback; less forgiving of ear canal changes',
    bestFor:
      'Adults with stable ears; standard fittings; when modifications will be needed',
  },
  {
    name: 'Soft Vinyl',
    properties: 'Flexible, soft',
    advantages: 'Comfortable; good seal; absorbs some vibration',
    disadvantages:
      'Shrinks over time; harder to modify; can discolor; shorter lifespan; may cause allergic reactions',
    bestFor: 'Severe-profound loss (seal critical); active lifestyles',
  },
  {
    name: 'Silicone',
    properties: 'Soft, flexible, hypoallergenic',
    advantages:
      'Very comfortable; hypoallergenic; good seal; long-lasting',
    disadvantages:
      'Harder to modify than acrylic; cannot be built up easily',
    bestFor: 'Sensitive skin; pediatric; comfort priority',
  },
  {
    name: 'Soft Acrylic',
    properties: 'Semi-rigid, slightly flexible',
    advantages:
      'Compromise between comfort and modifiability; good seal',
    disadvantages: 'Less precise than hard acrylic',
    bestFor: 'Patients who find hard acrylic uncomfortable',
  },
];

export const VENT_TYPES: VentType[] = [
  {
    name: 'No vent',
    diameter: '0 mm',
    lowFreqEffect: 'Maximum LF gain; maximum occlusion',
    useWhen: 'Severe-profound loss; maximum gain needed',
  },
  {
    name: 'Pressure vent',
    diameter: '0.5-0.8 mm',
    lowFreqEffect: 'Minimal LF reduction; equalizes pressure',
    useWhen: 'Moderate-severe loss; comfort without sacrificing gain',
  },
  {
    name: 'Small vent',
    diameter: '1.0-1.5 mm',
    lowFreqEffect: 'Moderate LF reduction (~5-10 dB at 250 Hz)',
    useWhen: 'Moderate loss; mild occlusion complaints',
  },
  {
    name: 'Medium vent',
    diameter: '2.0-2.5 mm',
    lowFreqEffect: 'Significant LF reduction (~10-15 dB at 250 Hz)',
    useWhen: 'Mild-moderate loss; occlusion complaints',
  },
  {
    name: 'Large vent / IROS',
    diameter: '3.0+ mm',
    lowFreqEffect: 'Substantial LF reduction (~15-25 dB below 500 Hz)',
    useWhen: 'Mild loss; high-frequency emphasis needed',
  },
  {
    name: 'Open fit',
    diameter: 'Fully open',
    lowFreqEffect: 'Minimal LF amplification; natural LF hearing',
    useWhen: 'Mild high-frequency loss only',
  },
  {
    name: 'External vent (select-a-vent)',
    diameter: 'Variable, adjustable',
    lowFreqEffect: 'Adjustable LF reduction',
    useWhen: 'When optimal vent size is unknown; trial fitting',
  },
  {
    name: 'Diagonal vent',
    diameter: 'Various',
    lowFreqEffect: 'Similar to same-diameter parallel vent',
    useWhen: "When straight vent doesn't fit in canal anatomy",
  },
];

export const HORN_TYPES: HornType[] = [
  {
    name: 'Standard bore',
    description: '~2 mm constant diameter',
  },
  {
    name: 'Stepped horn',
    description: 'Two discrete diameter steps (e.g., 2 mm to 3 mm)',
  },
  {
    name: 'Continuous horn (Libby horn)',
    description: 'Gradual flare from ~2 mm to ~4 mm',
  },
];

export const DAMPER_TYPES: DamperType[] = [
  {
    name: '680-ohm damper',
    effect: 'Mild smoothing; reduces peak by ~5 dB',
  },
  {
    name: '1500-ohm damper',
    effect: 'Moderate smoothing; reduces peak by ~8-10 dB',
  },
  {
    name: '3300-ohm damper',
    effect: 'Strong smoothing; flattens response significantly',
  },
];

export const IMPRESSION_STEPS: ImpressionStep[] = [
  {
    stepNumber: 1,
    title: 'Otoscopic examination',
    detail:
      'Ensure ear canal is clear; check for perforations, active drainage, exostoses.',
  },
  {
    stepNumber: 2,
    title: 'Contraindications check',
    detail:
      'Active infection, perforated TM (unless ENT-approved), recent surgery, excessive cerumen.',
  },
  {
    stepNumber: 3,
    title: 'Place otoblock',
    detail:
      'Cotton or foam block positioned past the second bend of the ear canal, beyond the bony-cartilaginous junction (approximately 3/4 canal depth). Must be visible and firmly seated.',
  },
  {
    stepNumber: 4,
    title: 'Mix impression material',
    detail:
      'Follow manufacturer instructions for working time; mix until uniform color.',
  },
  {
    stepNumber: 5,
    title: 'Inject impression material',
    detail:
      'Start deep (at otoblock) and pull syringe back slowly as canal fills; fill concha completely for full shell; maintain steady pressure.',
  },
  {
    stepNumber: 6,
    title: 'Allow to cure',
    detail:
      'Follow manufacturer cure time (typically 3-6 minutes); have patient open/close jaw during curing for dynamic impression.',
  },
  {
    stepNumber: 7,
    title: 'Remove impression',
    detail:
      'Break seal at helix; pull down and out gently; rotate slightly if needed.',
  },
  {
    stepNumber: 8,
    title: 'Inspect impression',
    detail:
      'Check for completeness, smooth canal portion, no voids, visible otoblock at tip, no pulled areas.',
  },
  {
    stepNumber: 9,
    title: 'Inspect ear',
    detail:
      'Otoscopic check post-impression; ensure no material remains.',
  },
];

export const IMPRESSION_COMPLICATIONS: ImpressionComplication[] = [
  {
    problem: 'Incomplete canal impression',
    cause: 'Insufficient material; premature removal; poor otoblock placement',
    prevention:
      'Adequate material injection; full cure time; proper otoblock depth',
  },
  {
    problem: 'Voids or air bubbles',
    cause: 'Air trapped during injection; inconsistent injection pressure',
    prevention:
      'Inject from deepest point; maintain steady pressure; no air gaps',
  },
  {
    problem: 'Otoblock pushed too deep',
    cause: 'Excessive injection pressure; undersized otoblock',
    prevention:
      'Appropriate otoblock size; gentle injection; verify placement',
  },
  {
    problem: 'Impression material in middle ear',
    cause: 'No otoblock placed; perforated TM not identified',
    prevention:
      'Always perform otoscopy; always place otoblock; check for perforations',
  },
  {
    problem: 'Ear canal irritation',
    cause: 'Allergic reaction to impression material; rough injection',
    prevention: 'Use hypoallergenic materials; gentle technique',
  },
  {
    problem: 'Distorted impression',
    cause: 'Premature removal; jaw movement at wrong time',
    prevention: 'Full cure time; controlled jaw exercises',
  },
];

export const VENT_FEEDBACK_LIMITS: VentFeedbackLimit[] = [
  {
    diameter: '0.5-0.8 mm (pressure vent)',
    lowFreqEffect: 'Minimal — equalizes pressure only',
    feedbackRisk: 'Very low',
    suitableFor: 'Severe-profound loss; high-gain fittings',
  },
  {
    diameter: '1.0-1.5 mm (small vent)',
    lowFreqEffect: 'Moderate reduction (~5-10 dB at 250 Hz)',
    feedbackRisk: 'Low',
    suitableFor: 'Moderate-severe loss; moderate gain',
  },
  {
    diameter: '2.0-2.5 mm (medium vent)',
    lowFreqEffect: 'Significant reduction (~10-15 dB at 250 Hz)',
    feedbackRisk: 'Moderate — feedback likely at high gain',
    suitableFor: 'Mild-moderate loss; moderate gain or less',
  },
  {
    diameter: '3.0+ mm (large / IROS)',
    lowFreqEffect: 'Substantial reduction (~15-25 dB below 500 Hz)',
    feedbackRisk: 'High — usually only works with mild loss',
    suitableFor: 'Mild loss only; minimal gain needed',
  },
  {
    diameter: 'Open fit (fully open)',
    lowFreqEffect: 'Near-total LF venting; natural low-freq hearing',
    feedbackRisk: 'Highest — no seal at all',
    suitableFor: 'Mild high-frequency loss; normal low-frequency thresholds',
  },
];

export const VENT_TRADEOFFS: VentTradeoff[] = [
  {
    want: 'Less occlusion (larger vent)',
    cost: 'More feedback risk; less low-frequency gain retained',
    whenWorthIt: 'Patient has normal low-frequency thresholds and does not need LF amplification',
  },
  {
    want: 'More low-frequency gain (smaller vent)',
    cost: 'More occlusion; own voice complaints (hollow/boomy quality)',
    whenWorthIt: 'Patient needs low-frequency amplification (e.g., flat or rising audiogram with LF loss)',
  },
  {
    want: 'Less feedback (tighter seal)',
    cost: 'Smaller vent required; more occlusion; own voice issues',
    whenWorthIt: 'High-gain patients; severe+ loss; feedback cannot be managed with algorithms alone',
  },
];

export const REMAKE_CRITERIA: RemakeCriterion[] = [
  {
    indicator: 'Persistent feedback despite programming adjustment',
    reason: 'Earmold no longer seals adequately',
  },
  {
    indicator: "Pain or soreness that doesn't resolve with adjustment",
    reason: 'Poor fit; pressure points',
  },
  {
    indicator: 'Visible gap between mold and ear canal wall',
    reason: 'Ear canal shape has changed',
  },
  {
    indicator: 'Mold is loose; falls out with jaw movement',
    reason: 'Weight change, aging, or growth',
  },
  {
    indicator: 'Material degradation (yellowing, hardening, cracking)',
    reason: 'Material lifespan exceeded (especially soft vinyl)',
  },
  {
    indicator: 'More than 3 years since last impression (adults)',
    reason: 'Gradual ear canal changes',
  },
  {
    indicator: '3-6+ months since last impression (young children)',
    reason: 'Rapid growth',
  },
  {
    indicator: 'Patient reports significant change in fit',
    reason: 'Trust patient perception',
  },
];
