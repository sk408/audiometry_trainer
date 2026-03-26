// Static data for the Ear Anatomy page — glossary terms, quiz questions, step labels,
// and pinna landmark definitions.

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Auricle (Pinna)',
    definition: 'The visible part of the outer ear that collects sound waves and directs them into the ear canal.'
  },
  {
    term: 'Cochlea',
    definition: 'Snail-shaped structure in the inner ear that contains the sensory organ for hearing. Converts fluid vibrations into electrical signals.'
  },
  {
    term: 'Conductive Hearing Loss',
    definition: 'Hearing loss that occurs when sound cannot efficiently travel through the outer and middle ear to the inner ear.'
  },
  {
    term: 'Endolymph',
    definition: 'Fluid found in the scala media of the cochlea and in the vestibular labyrinth. Has a unique high potassium, low sodium composition.'
  },
  {
    term: 'Eustachian Tube',
    definition: 'A tube that connects the middle ear to the back of the throat, allowing pressure equalization and drainage.'
  },
  {
    term: 'Hair Cells',
    definition: 'Sensory cells in the cochlea with hair-like projections (stereocilia) that convert mechanical vibrations into electrical signals.'
  },
  {
    term: 'Impedance Matching',
    definition: 'The process by which the middle ear transforms sound energy in air to fluid vibrations in the inner ear, preventing energy loss.'
  },
  {
    term: 'Incus',
    definition: 'The middle bone of the three ossicles in the middle ear, shaped like an anvil, connects the malleus to the stapes.'
  },
  {
    term: 'Malleus',
    definition: 'The first and largest of the three ossicles in the middle ear, shaped like a hammer, attached to the eardrum.'
  },
  {
    term: 'Organ of Corti',
    definition: 'The sensory epithelium in the cochlea containing hair cells that detect sound vibrations.'
  },
  {
    term: 'Ossicles',
    definition: 'The three tiny bones in the middle ear (malleus, incus, and stapes) that transmit sound vibrations from the eardrum to the inner ear.'
  },
  {
    term: 'Otitis Media',
    definition: 'Inflammation of the middle ear, often with fluid accumulation, causing conductive hearing loss.'
  },
  {
    term: 'Otosclerosis',
    definition: 'Abnormal bone growth in the middle ear, typically fixating the stapes footplate, causing conductive hearing loss.'
  },
  {
    term: 'Oval Window',
    definition: 'Membrane-covered opening between the middle and inner ear where the stapes footplate attaches.'
  },
  {
    term: 'Perilymph',
    definition: 'Fluid found in the scala vestibuli and scala tympani of the cochlea. Similar in composition to cerebrospinal fluid.'
  },
  {
    term: 'Round Window',
    definition: 'A membrane-covered opening between the middle ear and inner ear that allows fluid displacement in the cochlea.'
  },
  {
    term: 'Sensorineural Hearing Loss',
    definition: 'Hearing loss resulting from damage to the inner ear (cochlea) or to the nerve pathways from the inner ear to the brain.'
  },
  {
    term: 'Semicircular Canals',
    definition: 'Three loop-shaped structures in the inner ear responsible for detecting rotational movements of the head.'
  },
  {
    term: 'Stapes',
    definition: 'The third and smallest ossicle in the middle ear, shaped like a stirrup, connects the incus to the oval window.'
  },
  {
    term: 'Tonotopic Organization',
    definition: 'The spatial arrangement of the cochlea where different frequencies are processed at different locations.'
  },
  {
    term: 'Tympanic Membrane',
    definition: 'The eardrum; a thin membrane that separates the outer ear from the middle ear and vibrates in response to sound waves.'
  },
  {
    term: 'Vestibular System',
    definition: 'The sensory system in the inner ear that provides the brain with information about motion, equilibrium, and spatial orientation.'
  }
];

// ── Quiz ────────────────────────────────────────────────────────────────

export interface QuizOption {
  key: string;   // e.g. 'a', 'b', 'c', 'd'
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctKey: string;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'question1',
    question: '1. Which of the following is the main purpose of the middle ear?',
    options: [
      { key: 'a', text: 'To collect sound waves from the environment' },
      { key: 'b', text: 'To match impedance between air and fluid media' },
      { key: 'c', text: 'To convert mechanical vibrations to electrical signals' },
      { key: 'd', text: 'To detect head position and movement' }
    ],
    correctKey: 'b',
    explanation: 'b) To match impedance between air and fluid media. The middle ear overcomes the impedance mismatch problem through area ratio and lever action.'
  },
  {
    id: 'question2',
    question: '2. Which structure directly connects the middle ear to the inner ear?',
    options: [
      { key: 'a', text: 'Eustachian tube' },
      { key: 'b', text: 'Tympanic membrane (eardrum)' },
      { key: 'c', text: 'Stapes footplate at the oval window' },
      { key: 'd', text: 'Round window' }
    ],
    correctKey: 'c',
    explanation: 'c) Stapes footplate at the oval window. The stapes is the final bone in the ossicular chain, and its footplate presses against the oval window, transmitting vibrations from the middle ear to the fluid of the inner ear.'
  },
  {
    id: 'question3',
    question: '3. Which test would best identify otosclerosis?',
    options: [
      { key: 'a', text: 'Otoacoustic emissions' },
      { key: 'b', text: 'Tympanometry' },
      { key: 'c', text: 'Pure tone audiometry with bone conduction' },
      { key: 'd', text: 'Vestibular evoked myogenic potentials' }
    ],
    correctKey: 'c',
    explanation: 'c) Pure tone audiometry with bone conduction. This test would show a conductive hearing loss with an air-bone gap and often the characteristic "Carhart\'s notch" in the bone conduction threshold around 2000 Hz.'
  }
];

// ── Pinna landmarks ─────────────────────────────────────────────────────

export interface PinnaLandmark {
  id: string;
  title: string;
  simpleTerms: string;
  clinicalDescription: string;
}

export const pinnaLandmarks: PinnaLandmark[] = [
  {
    id: 'helix',
    title: 'Helix ("The Outer Rim")',
    simpleTerms: 'The helix is the curved outer edge of your ear - like the rim of a cup. If you run your finger around the top and outer edge of your ear, you\'re tracing the helix.',
    clinicalDescription: 'The outermost curved margin of the ear, running from the top attachment down to the earlobe. Forms the visible rim of the auricle and provides structural support.'
  },
  {
    id: 'antihelix',
    title: 'Antihelix ("The Inner Ridge")',
    simpleTerms: 'The antihelix is the curved ridge that runs parallel to the outer rim, like a second smaller rim inside the first one. It forms a Y-shaped ridge in the middle of your ear.',
    clinicalDescription: 'A Y-shaped cartilage ridge located in front of and roughly parallel to the helix. It separates the concha (bowl area) from the scapha and triangular fossa.'
  },
  {
    id: 'tragus',
    title: 'Tragus ("The Door Flap")',
    simpleTerms: 'The tragus is the small flap-like projection just in front of your ear canal opening. It\'s the part that you push to close your ear when you don\'t want to hear something. Think of it as a partial "door" to your ear canal.',
    clinicalDescription: 'A small, rounded cartilage projection in front of the ear canal opening that partially covers the entrance. Important for behind-the-ear hearing aid placement and acoustic coupling.'
  },
  {
    id: 'antitragus',
    title: 'Antitragus ("The Opposite Bump")',
    simpleTerms: 'The antitragus is a small bump on the lower part of your ear, opposite to the tragus. If the tragus is the "door" to your ear canal, the antitragus is like a doorstop on the other side.',
    clinicalDescription: 'A small cartilage bump opposite to the tragus, separated from it by the intertragic notch. It forms the lower boundary of the concha.'
  },
  {
    id: 'concha',
    title: 'Concha ("The Bowl")',
    simpleTerms: 'The concha is the deep bowl-shaped cavity in the center of your ear - like a seashell or soup bowl. It\'s the largest and deepest depression in your outer ear, funneling sound into your ear canal.',
    clinicalDescription: 'A deep cavity in the external ear that leads to the ear canal. It\'s bounded by the tragus (front), antihelix (back), and antitragus (below). Critical for in-the-ear hearing aid shell design.'
  },
  {
    id: 'lobule',
    title: 'Lobule ("The Earlobe")',
    simpleTerms: 'The lobule is simply what most people call the "earlobe" - the soft, fleshy bottom part of your ear where earrings are typically worn. Unlike the rest of the external ear, it contains no cartilage.',
    clinicalDescription: 'The soft, fleshy, non-cartilaginous portion at the bottom of the ear, composed of fatty tissue and skin. May serve as an anchor point for some hearing aid styles.'
  },
  {
    id: 'crusofhelix',
    title: 'Crus of Helix ("The Diving Ridge")',
    simpleTerms: 'The crus of helix is the point where the outer rim of your ear (helix) turns inward and dives into the middle of your ear, creating a horizontal ridge that divides the upper and lower parts of the bowl area.',
    clinicalDescription: 'The anterior continuation of the helix that crosses the concha horizontally, dividing it into the cymba conchae superiorly and the cavum conchae inferiorly.'
  },
  {
    id: 'cymbaconchae',
    title: 'Cymba Conchae ("The Upper Bowl")',
    simpleTerms: 'The cymba conchae is the smaller, upper portion of the bowl-like depression in your ear. It\'s the upper "pool" of the ear\'s bowl, located above the horizontal ridge (crus of helix).',
    clinicalDescription: 'The superior portion of the concha, above the crus of the helix, bounded by the antihelix posteriorly and the helix anteriorly. Important for receiver-in-canal hearing aid models.'
  },
  {
    id: 'cavumconchae',
    title: 'Cavum Conchae ("The Lower Bowl")',
    simpleTerms: 'The cavum conchae is the larger, lower portion of the bowl-like depression that leads directly to your ear canal. It\'s the main "funnel" part of your ear that captures sound and directs it inward.',
    clinicalDescription: 'The lower and larger portion of the concha, below the crus of the helix, that directly leads to the external auditory meatus. Critical for in-the-ear hearing aid fitting and acoustic performance.'
  },
  {
    id: 'meatus',
    title: 'External Auditory Meatus ("The Ear Canal Opening")',
    simpleTerms: 'The external auditory meatus is simply the opening of your ear canal - the entrance where sound travels into the canal toward your eardrum. It\'s like the doorway that connects the outer ear to the ear canal.',
    clinicalDescription: 'The aperture or opening of the external auditory canal, located at the depth of the concha. It forms the boundary between the external ear and the ear canal, and serves as a reference point for many hearing aid measurements.'
  }
];

// ── Placeholder images ──────────────────────────────────────────────────
// These should be replaced with real assets when available.

export const outerEarImg = "";
export const middleEarImg = "";
export const innerEarImg = "";
export const soundWavesImg = "";
export const hearingProcessImg = "";

// ── Step labels ─────────────────────────────────────────────────────────

export const stepLabels = [
  'Introduction to Ear Anatomy',
  'The Outer Ear',
  'Landmarks of the Pinna for Hearing Aid Fitting',
  'The Middle Ear',
  'The Inner Ear',
  'How We Hear: The Process of Sound Perception',
  'Common Hearing Disorders',
];
