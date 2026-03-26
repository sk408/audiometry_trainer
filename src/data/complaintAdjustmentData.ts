// Static data for the Complaint-Based Adjustments page — patient complaints,
// frequency guidelines, input level guidelines, voice quality guide, and
// common adjustment patterns.

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface ComplaintEntry {
  id: string;
  complaint: string;
  category: ComplaintCategory;
  whatPatientExperiences: string;
  whatToAdjust: string;
  why: string;
  verification: string;
  caution: string;
}

export type ComplaintCategory =
  | 'Loudness'
  | 'Sound Quality'
  | 'Clarity'
  | 'Own Voice'
  | 'Feedback'
  | 'Environmental'
  | 'Connectivity'
  | 'Music'
  | 'Noise'
  | 'Audibility'
  | 'Hardware';

export interface FrequencyGuideline {
  id: string;
  label: string;
  range: string;
  increaseWhen: string[];
  decreaseWhen: string[];
}

export interface InputLevelGuideline {
  id: string;
  label: string;
  inputLevel: string;
  increaseWhen: string[];
  decreaseWhen: string[];
}

export interface VoiceQualityEntry {
  id: string;
  quality: string;
  description: string;
  adjustment: string;
}

export interface AdjustmentPattern {
  id: string;
  title: string;
  description: string;
  symptoms: string[];
  adjustments: string[];
  verification: string[];
  timeline: string;
}

// ---------------------------------------------------------------------------
// Complaint Entries (Tab 1)
// ---------------------------------------------------------------------------

export const COMPLAINT_ENTRIES: ComplaintEntry[] = [
  {
    id: 'too-loud',
    complaint: 'Everything sounds too loud',
    category: 'Loudness',
    whatPatientExperiences:
      'Overall amplification feels excessive. Environmental sounds and speech are uncomfortably loud even at normal levels. The patient may avoid wearing the aids or reduce usage time.',
    whatToAdjust:
      'Decrease gain across all input levels, starting with loud inputs (80 dB). Reduce overall gain by 3-5 dB initially. Check MPO (Maximum Power Output) settings and lower if needed. Consider reducing gain for medium inputs (65 dB) by 2-3 dB as well.',
    why:
      'Over-amplification or insufficient acclimatization. New users are especially sensitive because the brain has adapted to reduced input. The auditory system needs time to recalibrate its loudness perception.',
    verification:
      'Present conversational speech at 65 dB SPL and ask if the loudness is comfortable. Use a loudness rating scale (1-10). Target rating of 4-5 for conversational speech.',
    caution:
      'Do not reduce gain so much that soft speech becomes inaudible. Distinguish between "too loud" due to over-amplification versus normal sounds being unfamiliar to a new user. Counsel on acclimatization before aggressive gain reduction.',
  },
  {
    id: 'tinny-sharp',
    complaint: 'Sounds are tinny/sharp',
    category: 'Sound Quality',
    whatPatientExperiences:
      'Speech and environmental sounds have an unpleasant metallic or thin quality. High-pitched sounds are over-emphasized relative to low-frequency warmth. Voices may sound artificial.',
    whatToAdjust:
      'Reduce gain in the 2000-4000 Hz range by 3-5 dB. Increase gain in the 500-1000 Hz range by 2-3 dB to restore warmth and natural balance.',
    why:
      'Excessive high-frequency emphasis relative to low frequencies creates an unnatural spectral balance. The brain perceives this imbalance as a tinny or metallic quality.',
    verification:
      'Play a speech sample (male and female voices) and ask if the sound quality has improved. Compare to unaided perception if possible.',
    caution:
      'Reducing high-frequency gain too much will hurt speech clarity. Make small adjustments (2-3 dB at a time) and recheck speech understanding after each change.',
  },
  {
    id: 'muffled-unclear',
    complaint: 'Speech is muffled/unclear',
    category: 'Clarity',
    whatPatientExperiences:
      'Words sound blurred together. The patient can hear that someone is talking but cannot make out what is being said. Consonants like /s/, /f/, /th/ are difficult to distinguish.',
    whatToAdjust:
      'Increase gain in the 1000-4000 Hz range by 3-5 dB, focusing on the 2000-3000 Hz region where most consonant energy resides. Check that the high-frequency gain matches prescriptive targets.',
    why:
      'Insufficient mid-to-high-frequency amplification reduces consonant perception. Consonants carry most of the intelligibility information in speech but have less acoustic energy than vowels.',
    verification:
      'Present a word list at conversational level and measure word recognition score before and after adjustment. Ask the patient to rate speech clarity on a 1-10 scale.',
    caution:
      'Increasing high-frequency gain too aggressively can cause tinny sound quality or feedback. Verify earmold/dome fit before increasing gain, as a poor seal can cause the same symptoms.',
  },
  {
    id: 'own-voice-hollow',
    complaint: 'My own voice sounds hollow',
    category: 'Own Voice',
    whatPatientExperiences:
      'The patient perceives their own voice as echoing, hollow, or as if speaking inside a barrel. This is distinct from boominess and is related to the occlusion effect combined with mid-frequency resonance.',
    whatToAdjust:
      'Reduce low-frequency gain at 250-500 Hz by 3-5 dB. Increase gain at 1000-2000 Hz by 2-3 dB to improve mid-frequency clarity. Consider increasing vent size or switching to a more open fitting.',
    why:
      'The occlusion effect amplifies bone-conducted own-voice energy in the ear canal. When the ear canal is sealed, low-frequency vibrations from vocal cord activity are trapped and amplified, creating a hollow resonance.',
    verification:
      'Have the patient count from 1-10 or read a passage aloud. Ask specifically if the hollow quality is reduced. Compare with the ear canal briefly opened (pull dome/mold away slightly).',
    caution:
      'Increasing vent size reduces low-frequency gain for external sounds as well. Balance own-voice comfort against audibility of low-frequency environmental sounds and speech.',
  },
  {
    id: 'own-voice-boomy',
    complaint: 'My own voice sounds boomy',
    category: 'Own Voice',
    whatPatientExperiences:
      'The patient hears excessive bass in their own voice, as if speaking into a microphone with too much bass. Their voice sounds unnaturally deep and resonant.',
    whatToAdjust:
      'Reduce low-frequency gain below 750 Hz by 3-6 dB. Consider open-fit dome or larger vent in custom mold. If using a closed dome, switch to an open or vented dome.',
    why:
      'Occlusion effect combined with excessive low-frequency amplification. The sealed ear canal acts as a resonant chamber for bone-conducted low-frequency energy from the vocal cords.',
    verification:
      'Have the patient vocalize sustained vowels (/a/, /u/) and speak naturally. Ask if the boominess is reduced while monitoring that external speech remains clear.',
    caution:
      'Open fittings provide less low-frequency gain, which may be needed for patients with low-frequency hearing loss. Verify the audiogram before switching to open fit.',
  },
  {
    id: 'mumbling',
    complaint: 'People sound like they\'re mumbling',
    category: 'Clarity',
    whatPatientExperiences:
      'Speech sounds like it lacks definition. The patient can hear voice but words are not distinct. This is especially noticeable with soft-spoken talkers or in group conversations.',
    whatToAdjust:
      'Increase mid-frequency gain (1000-3000 Hz) for medium inputs (65 dB) by 3-5 dB. Verify that the hearing aid is providing adequate gain for conversational-level speech.',
    why:
      'Insufficient gain in the critical speech frequencies at conversational input levels. The 1000-3000 Hz range contains the acoustic cues that differentiate consonants and make speech intelligible.',
    verification:
      'Present connected speech at 65 dB SPL from 1 meter. Ask the patient to repeat sentences and note accuracy. Use the HINT or QuickSIN for objective measurement.',
    caution:
      'Ensure the complaint is not actually related to auditory processing or cognitive factors. If gain adjustments do not resolve the issue, consider further audiologic or cognitive assessment.',
  },
  {
    id: 'robotic',
    complaint: 'Aids sound robotic',
    category: 'Sound Quality',
    whatPatientExperiences:
      'Speech has an unnatural, machine-like quality. Voices sound processed or digitized rather than natural. This may be more noticeable in quiet environments.',
    whatToAdjust:
      'Reduce gain in the 2000-4000 Hz range by 2-4 dB. Increase gain in the 500-1000 Hz range by 2-3 dB. Check noise reduction and frequency lowering settings -- reduce if overly aggressive.',
    why:
      'Unnatural spectral balance with over-emphasis of high-mid frequencies. Aggressive digital processing (noise reduction, frequency compression) can also strip natural voice characteristics.',
    verification:
      'Play recorded speech in quiet and ask the patient to rate naturalness. Toggle noise reduction/frequency lowering off temporarily to identify the source of the robotic quality.',
    caution:
      'Disabling noise reduction features may improve naturalness but worsen performance in noise. Make adjustments incrementally and test in multiple environments.',
  },
  {
    id: 'nasal',
    complaint: 'Sounds nasal',
    category: 'Sound Quality',
    whatPatientExperiences:
      'Speech has a nasal quality as if the speaker has a cold or is talking through their nose. This can affect both external voices and the patient\'s own voice.',
    whatToAdjust:
      'Reduce gain at 1000-2000 Hz by 2-4 dB (the nasal resonance frequency region). Apply a slight increase at 500 Hz (+2 dB) and 3000 Hz (+2 dB) to balance the spectrum around the reduced nasal band.',
    why:
      'A peak in the 1000-2000 Hz region corresponds to nasal resonance frequencies. Over-amplification in this band creates a perception similar to nasalized speech.',
    verification:
      'Present speech containing both nasal (/m/, /n/) and non-nasal sounds. Ask if non-nasal sounds still have the nasal quality after adjustment.',
    caution:
      'The 1000-2000 Hz region is critical for speech understanding. Reduce gain minimally (2-3 dB) and verify that speech intelligibility is maintained.',
  },
  {
    id: 'harsh',
    complaint: 'Sounds harsh',
    category: 'Sound Quality',
    whatPatientExperiences:
      'High-pitched sounds are grating or piercing. Sibilant sounds (/s/, /sh/) are uncomfortably sharp. Paper rustling, dishes, and keys are unpleasantly loud and sharp.',
    whatToAdjust:
      'Reduce gain in the 3000-6000 Hz range by 3-5 dB. Smooth transition slopes between frequency bands to avoid sharp spectral peaks. Check compression ratios in high-frequency channels.',
    why:
      'Sharp peaks in the high-frequency response cause specific sounds to be amplified disproportionately. Abrupt gain changes between adjacent frequency bands can also create harshness.',
    verification:
      'Present speech with sibilant-rich content (e.g., "She sells seashells"). Play environmental sounds (keys jingling, paper crumpling) and ask if harshness is reduced.',
    caution:
      'High-frequency gain is essential for consonant discrimination. Reduce only in the specific bands causing discomfort, and verify speech understanding is maintained after adjustment.',
  },
  {
    id: 'thin-weak',
    complaint: 'Sounds thin/weak',
    category: 'Sound Quality',
    whatPatientExperiences:
      'Sound lacks body and richness. Speech sounds reedy or hollow. Music and voices lack the warmth and fullness the patient expects. Low-pitched sounds are notably absent.',
    whatToAdjust:
      'Increase gain at 250-750 Hz by 3-5 dB. Verify that the fitting is not excessively open (which leaks low-frequency energy). Check that the receiver/speaker is not blocked.',
    why:
      'Insufficient low-frequency gain for perceived warmth. Open fittings inherently provide less low-frequency amplification, which can result in a thin sound quality.',
    verification:
      'Play music with prominent bass and baritone voice samples. Ask the patient if the sound has more body and fullness after adjustment.',
    caution:
      'Increasing low-frequency gain can exacerbate own-voice issues (boominess, occlusion) and may mask speech in noise. Balance warmth against clarity and own-voice comfort.',
  },
  {
    id: 'whistling-feedback',
    complaint: 'Whistling/feedback',
    category: 'Feedback',
    whatPatientExperiences:
      'A high-pitched whistling or squealing sound, especially when chewing, yawning, or when objects are near the ear (phone, hat, hand). May be intermittent or constant.',
    whatToAdjust:
      'First check physical fit -- ensure earmold/dome is properly seated and sealed. Run the hearing aid\'s feedback management/calibration system. If persistent, reduce high-frequency gain (3000-6000 Hz) by 2-4 dB. Verify earmold seal and consider remaking if chronic.',
    why:
      'Acoustic feedback occurs when amplified sound leaks from the ear canal back to the hearing aid microphone, creating a loop. The feedback frequency depends on the resonant characteristics of the leak path.',
    verification:
      'Move a hand slowly toward and away from the aided ear. If feedback occurs only with the hand very close, the system is borderline. If it occurs during normal wear, further action is needed.',
    caution:
      'Do not over-rely on feedback cancellation algorithms -- they can create artifacts. Address the physical fit first. Reducing gain should be a last resort as it reduces audibility.',
  },
  {
    id: 'wind-noise',
    complaint: 'Wind noise is bothersome',
    category: 'Environmental',
    whatPatientExperiences:
      'A loud, rushing or buffeting sound when outdoors, especially on windy days. Wind noise can completely mask speech and make the hearing aids unusable outside.',
    whatToAdjust:
      'Enable or increase the wind noise reduction algorithm. Consider microphone configuration (reduce rear microphone sensitivity). Create an outdoor program with wind noise management enabled and reduced low-frequency gain.',
    why:
      'Wind turbulence across microphone ports creates broadband low-frequency noise. Behind-the-ear (BTE) aids are more susceptible than in-the-ear (ITE) styles due to microphone placement.',
    verification:
      'If possible, test near an open window or fan. Ask the patient to report on wind noise during their next outdoor experience. Schedule a follow-up call.',
    caution:
      'Aggressive wind noise reduction can affect speech perception in wind. An outdoor program should be separate from the primary program to avoid compromising indoor performance.',
  },
  {
    id: 'phone-difficult',
    complaint: 'Phone calls are difficult',
    category: 'Connectivity',
    whatPatientExperiences:
      'Difficulty understanding speech on the phone. Sound may be too quiet, distorted, or the patient may hear feedback when holding the phone to their ear.',
    whatToAdjust:
      'Check telecoil settings and activate if available. For Bluetooth-capable aids, set up direct audio streaming. Adjust phone program gain if available. Verify ear-to-phone positioning -- the phone speaker should align with the hearing aid microphone, not the ear canal.',
    why:
      'The phone coupling method may need optimization. Traditional acoustic coupling (holding phone to ear) can cause feedback and positioning issues. Telecoil or streaming provides a direct signal path.',
    verification:
      'Make a test phone call in the clinic. Have the patient practice positioning. Verify streaming connection if using Bluetooth. Check that the phone program volume is adequate.',
    caution:
      'Telecoil may pick up electromagnetic interference in some environments. Bluetooth streaming drains the battery faster. Ensure the patient understands how to switch between programs.',
  },
  {
    id: 'music-bad',
    complaint: 'Music sounds bad',
    category: 'Music',
    whatPatientExperiences:
      'Music sounds distorted, flat, or unnatural. Instruments may sound alike. Dynamic range is compressed so soft passages and loud passages sound similar. The richness and detail of music is lost.',
    whatToAdjust:
      'Increase bandwidth (ensure high frequencies are not overly limited). Reduce compression ratios in the music program (use linear or near-linear amplification). Disable or reduce noise reduction for music program. Consider creating a dedicated music program with wider dynamic range.',
    why:
      'Compression algorithms designed for speech flatten the dynamic range of music. Noise reduction algorithms may treat musical instruments as noise and suppress them. Music has a wider frequency range and dynamic range than speech.',
    verification:
      'Play a familiar piece of music (patient\'s choice) and ask for qualitative feedback. Compare with and without the music program. Ask about specific aspects: bass, treble, instrument separation, dynamics.',
    caution:
      'A dedicated music program with reduced compression may be too loud for speech. Ensure the patient understands when to use the music program versus the default program.',
  },
  {
    id: 'restaurant-difficulty',
    complaint: 'Can\'t hear in restaurants',
    category: 'Noise',
    whatPatientExperiences:
      'Speech understanding degrades significantly in noisy environments like restaurants, cafeterias, or social gatherings. Background noise overwhelms the speech signal.',
    whatToAdjust:
      'Activate directional microphones. Enable or optimize noise reduction algorithms. Create or adjust a noise program. Reduce low-frequency gain by 3-5 dB in the noise program. Increase SNR enhancement if available.',
    why:
      'Speech-in-noise difficulty is multifactorial: reduced audibility, reduced spectral resolution (from cochlear damage), and cognitive processing limitations. Directional microphones and noise reduction help improve the signal-to-noise ratio at the hearing aid.',
    verification:
      'Use a speech-in-noise test (QuickSIN or HINT) to measure aided SNR loss. Simulate a restaurant environment with multi-talker babble at 65 dB and present target speech from the front.',
    caution:
      'Directional microphones reduce awareness of sounds from behind and to the sides. Counsel the patient about limitations and communication strategies (seating position, facing the speaker).',
  },
  {
    id: 'background-noise-loud',
    complaint: 'Background noise too loud',
    category: 'Noise',
    whatPatientExperiences:
      'Environmental sounds (traffic, HVAC, crowd noise) are distractingly loud relative to speech. The patient feels overwhelmed by non-speech sounds.',
    whatToAdjust:
      'Enable or increase noise reduction strength. Verify directional microphones are active. Adjust the noise program to reduce gain for non-speech inputs. Consider reducing low-frequency gain (250-1000 Hz) by 2-4 dB where most environmental noise energy resides.',
    why:
      'Gain for non-speech sounds is too high relative to speech. The hearing aid may be amplifying environmental noise to the same level as speech, reducing the effective signal-to-noise ratio.',
    verification:
      'Present speech at 65 dB with multi-talker babble at 60 dB. Ask the patient to rate the balance between speech and background noise. Target: speech clearly dominant over background.',
    caution:
      'Excessive noise reduction can make the listening environment sound unnatural or cause "pumping" artifacts. Maintain awareness of environmental sounds for safety (traffic, alarms).',
  },
  {
    id: 'sudden-sounds',
    complaint: 'I jump at sudden sounds',
    category: 'Loudness',
    whatPatientExperiences:
      'Unexpected loud sounds (doors closing, dishes clattering, dogs barking) cause a startle response. The patient may feel anxious about unpredictable loud sounds.',
    whatToAdjust:
      'Reduce gain for loud inputs (80 dB) by 3-5 dB. Check compression attack time -- faster attack times (1-5 ms) catch transients better. Verify MPO (Maximum Power Output) is set appropriately below the patient\'s UCL (Uncomfortable Loudness Level).',
    why:
      'Insufficient compression for transient loud sounds. If the compression attack time is too slow, brief loud sounds pass through at full gain before compression engages.',
    verification:
      'Present sudden loud sounds (hand clap, door slam simulation) and observe the patient\'s reaction. Ask for a comfort rating. The sound should be audible but not startling.',
    caution:
      'Very fast attack times can cause distortion or "pumping." Reducing MPO too much can limit the hearing aid\'s output range and clip loud speech. Balance comfort with output adequacy.',
  },
  {
    id: 'dishes-water-sharp',
    complaint: 'Dishes/water too sharp',
    category: 'Environmental',
    whatPatientExperiences:
      'Running water, clinking dishes, jingling keys, and similar high-frequency environmental sounds are uncomfortably loud or sharp. These sounds may be new to the patient.',
    whatToAdjust:
      'Reduce gain above 4000 Hz by 2-4 dB. Counsel the patient that previously inaudible high-frequency sounds are now being heard and adaptation takes 4-6 weeks. Consider a "home" program with slightly reduced high-frequency gain.',
    why:
      'Previously inaudible high-frequency sounds are now amplified. The brain needs time to recalibrate its response to these sounds. Water, dishes, and metallic sounds have dominant energy in the high frequencies.',
    verification:
      'Run water in the clinic or play recorded environmental sounds. Ask the patient to rate sharpness after adjustment. Check that speech clarity (especially /s/, /f/, /th/) is maintained.',
    caution:
      'Counseling about adaptation is often more appropriate than gain reduction for new users. Reducing high-frequency gain sacrifices consonant clarity. Consider a gradual acclimatization program.',
  },
  {
    id: 'soft-inaudible',
    complaint: 'Soft sounds inaudible',
    category: 'Audibility',
    whatPatientExperiences:
      'The patient cannot hear soft speech, distant conversation, or quiet environmental sounds. They may report that the hearing aids "don\'t seem to be doing anything" in quiet environments.',
    whatToAdjust:
      'Increase soft gain (50 dB input level) by 3-5 dB across speech frequencies (500-4000 Hz). Verify expansion settings -- if expansion threshold is set too high, soft sounds may be below the amplification threshold. Check that microphones are not blocked.',
    why:
      'Insufficient gain for low-level inputs. Expansion settings may be cutting off amplification for very soft sounds. The hearing aid may not be providing enough gain at soft input levels to bring sounds above the patient\'s threshold.',
    verification:
      'Present soft speech at 50 dB SPL from 1-2 meters. Present soft environmental sounds (clock ticking, whispered speech). Ask the patient if these are now audible without being too loud.',
    caution:
      'Increasing soft gain too much can make background noise noticeable (HVAC hum, own breathing). Balance audibility of soft speech against potential for amplifying ambient noise.',
  },
  {
    id: 'battery-drain',
    complaint: 'Battery drains fast',
    category: 'Hardware',
    whatPatientExperiences:
      'Batteries last shorter than expected (e.g., 3 days instead of 7-10). Rechargeable aids do not last through the day. The patient may be frustrated by frequent battery changes or mid-day charging.',
    whatToAdjust:
      'Assess streaming usage (Bluetooth audio/phone drains batteries significantly). Check if Bluetooth is constantly searching for devices. Review feature settings that draw extra power (e.g., tinnitus maskers, high processing modes). For rechargeable aids, verify charger function and battery health.',
    why:
      'High current draw from wireless streaming features and advanced processing. Bluetooth streaming can reduce battery life by 30-50%. Battery age and environmental factors (cold weather) also affect performance.',
    verification:
      'Review the hearing aid\'s data logging for streaming hours and usage patterns. Test battery voltage with a battery tester. For rechargeable aids, verify charge cycle and capacity.',
    caution:
      'Disabling useful features to save battery is a poor trade-off. If battery life is inadequate, consider a different battery size, switching to rechargeable, or a different aid style. Rule out defective batteries or charger before changing settings.',
  },
];

// ---------------------------------------------------------------------------
// Frequency Guidelines (Tab 2)
// ---------------------------------------------------------------------------

export const FREQUENCY_GUIDELINES: FrequencyGuideline[] = [
  {
    id: 'low-freq',
    label: 'Low Frequencies',
    range: '250-1000 Hz',
    increaseWhen: [
      'Vowel sounds are difficult to hear',
      'Speech lacks fullness or warmth',
      'Sound quality is perceived as thin or weak',
    ],
    decreaseWhen: [
      'Own voice sounds boomy or hollow',
      'Traffic and rumble sounds are too loud',
      'Environmental sounds are overwhelming',
      'Upward spread of masking reduces speech clarity',
    ],
  },
  {
    id: 'mid-freq',
    label: 'Mid Frequencies',
    range: '1000-3000 Hz',
    increaseWhen: [
      'Speech is unclear or muffled',
      'Consonants are hard to distinguish',
      'Women\'s and children\'s voices are hard to hear',
      'Words sound blurred together',
    ],
    decreaseWhen: [
      'Speech sounds harsh or mechanical',
      'Sound has a tinny quality',
      'Nasal quality is perceived',
      'Listening fatigue in conversation',
    ],
  },
  {
    id: 'high-freq',
    label: 'High Frequencies',
    range: '3000-8000 Hz',
    increaseWhen: [
      'Difficulty hearing in noise (increase carefully)',
      'Music lacks clarity and detail',
      'Consonant detail is needed (/s/, /f/, /th/ discrimination)',
      'Bird songs and high-pitched alerts are inaudible',
    ],
    decreaseWhen: [
      'Environmental sounds are too sharp (dishes, keys, water)',
      'Harsh sibilants (/s/ and /sh/ are piercing)',
      'Paper, water, and dish sounds are too loud',
      'Feedback or whistling occurs',
    ],
  },
];

// ---------------------------------------------------------------------------
// Input Level Guidelines (Tab 3)
// ---------------------------------------------------------------------------

export const INPUT_LEVEL_GUIDELINES: InputLevelGuideline[] = [
  {
    id: 'soft-gain',
    label: 'Soft Gain',
    inputLevel: '50 dB input',
    increaseWhen: [
      'Soft speech is inaudible',
      'Cannot hear speech at a distance',
      'Quiet environmental sounds are not detected',
      'Patient reports hearing aids "don\'t seem to work" in quiet',
    ],
    decreaseWhen: [
      'Background hum is too noticeable (HVAC, refrigerator)',
      'Own breathing or swallowing is audible',
      'Ambient noise in quiet rooms is distracting',
      'Circuit noise from the hearing aid is perceptible',
    ],
  },
  {
    id: 'medium-gain',
    label: 'Medium Gain',
    inputLevel: '65 dB input',
    increaseWhen: [
      'Conversational speech is too soft',
      'TV volume must be set uncomfortably high for others',
      'One-on-one conversation requires extra effort',
      'Patient frequently asks for repetition in quiet',
    ],
    decreaseWhen: [
      'Normal conversation is too loud',
      'Listening fatigue after extended conversation',
      'Patient avoids social situations due to loudness',
      'Sound quality degrades at conversational levels',
    ],
  },
  {
    id: 'loud-gain',
    label: 'Loud Gain',
    inputLevel: '80 dB input',
    increaseWhen: [
      'Music sounds compressed and lacks dynamics',
      'Cannot distinguish between medium and loud sounds',
      'Loud speech lacks clarity',
      'Dynamic range of amplified sound is too narrow',
    ],
    decreaseWhen: [
      'Discomfort from loud sounds (doors slamming, traffic)',
      'Distortion at high input levels',
      'Startle response to sudden sounds',
      'Patient removes hearing aids in loud environments',
    ],
  },
];

// ---------------------------------------------------------------------------
// Voice Quality Guide (Tab 3 sub-section)
// ---------------------------------------------------------------------------

export const VOICE_QUALITY_GUIDE: VoiceQualityEntry[] = [
  {
    id: 'vq-robotic',
    quality: 'Robotic',
    description: 'Speech sounds mechanical, processed, or digitized. Voices lack natural inflection and warmth.',
    adjustment: 'Reduce 2-4 kHz gain by 2-4 dB; increase 500-1000 Hz by 2-3 dB. Reduce noise reduction aggressiveness. Check frequency lowering settings.',
  },
  {
    id: 'vq-hollow',
    quality: 'Hollow',
    description: 'Speech echoes as if in a tunnel or barrel. The patient\'s own voice is particularly affected.',
    adjustment: 'Reduce 250-500 Hz gain by 3-5 dB; increase 1-2 kHz by 2-3 dB. Increase vent size or use open fitting to reduce occlusion effect.',
  },
  {
    id: 'vq-nasal',
    quality: 'Nasal',
    description: 'Voices sound like the speaker has a cold or is pinching their nose. Affects both external voices and own voice.',
    adjustment: 'Reduce 1-2 kHz gain by 2-4 dB; add slight boost at 500 Hz (+2 dB) and 3 kHz (+2 dB) to balance around the nasal resonance dip.',
  },
  {
    id: 'vq-sharp',
    quality: 'Sharp',
    description: 'High-pitched sounds are piercing or grating. Sibilants (/s/, /sh/) and metallic sounds are uncomfortable.',
    adjustment: 'Reduce 3-6 kHz gain by 3-5 dB. Smooth transition slopes between adjacent frequency bands. Check that compression kneepoints are not creating gain spikes.',
  },
  {
    id: 'vq-muffled',
    quality: 'Muffled',
    description: 'Speech lacks crispness and definition. Words blend together. Similar to hearing through a pillow.',
    adjustment: 'Increase 1-4 kHz gain by 3-5 dB. Check for cerumen on the receiver or blocked sound bore. Verify that the dome/mold is properly seated.',
  },
  {
    id: 'vq-thin',
    quality: 'Thin',
    description: 'Sound lacks body and richness. Low-frequency content is missing. Voices sound reedy or insubstantial.',
    adjustment: 'Increase 250-750 Hz gain by 3-5 dB. Verify that the fitting is not excessively open. Consider a more occluding dome or custom mold if low-frequency gain is needed.',
  },
];

// ---------------------------------------------------------------------------
// Common Adjustment Patterns (Tab 4)
// ---------------------------------------------------------------------------

export const ADJUSTMENT_PATTERNS: AdjustmentPattern[] = [
  {
    id: 'new-user',
    title: 'New User Acclimatization',
    description:
      'First-time hearing aid users often find the amplified sound overwhelming. A systematic, gradual increase in gain over several weeks allows the auditory system and brain to adapt to the new level of input.',
    symptoms: [
      'Everything sounds too loud',
      'Own voice is too prominent',
      'Environmental sounds are overwhelming',
      'Sound quality is "unnatural"',
      'Listening fatigue after short wearing periods',
    ],
    adjustments: [
      'Start at 80% of prescriptive target and increase by 2-3 dB every 1-2 weeks',
      'Use an acclimatization manager if available in the software',
      'Prioritize comfort over audibility in the first 2 weeks',
      'Set realistic expectations: full adaptation takes 4-12 weeks',
      'Consider a dedicated "starter" program with reduced gain',
    ],
    verification: [
      'Track daily wearing time (target: 8+ hours by week 4)',
      'Use a loudness comfort rating at each visit',
      'Monitor speech understanding improvement over time',
      'Check that gain is approaching prescriptive targets by week 6-8',
    ],
    timeline: 'Weeks 1-2: 80% target. Weeks 3-4: 90% target. Weeks 5-8: 100% target. Review at 1, 2, 4, and 8 weeks.',
  },
  {
    id: 'experienced-upgrade',
    title: 'Experienced User Upgrade',
    description:
      'Patients upgrading from older hearing aids have established perceptual expectations. The new aids may sound different even if more accurate, because the brain has adapted to the old aid\'s frequency response.',
    symptoms: [
      'New aids sound different from old aids (not necessarily worse)',
      'Speech quality has changed',
      'Environmental sounds are perceived differently',
      'Patient wants to "go back" to old aids',
      'Specific sounds are louder or softer than expected',
    ],
    adjustments: [
      'If possible, compare frequency responses of old and new aids',
      'Match the new aid\'s frequency response to the old one initially, then gradually shift toward the prescriptive target',
      'Address specific frequency regions that differ most',
      'Use real-ear measurement to quantify differences between old and new',
      'Consider a transition program that mimics the old aid\'s response',
    ],
    verification: [
      'A/B comparison with old aids (if available) for specific complaints',
      'Speech recognition testing with new aids vs. old aids',
      'Patient satisfaction survey at 2 and 4 weeks',
      'Real-ear measurement showing convergence toward prescriptive target',
    ],
    timeline: 'Week 1: Match old response. Weeks 2-4: Gradual shift toward target. Week 6: Target response. Review at 1, 3, and 6 weeks.',
  },
  {
    id: 'noise-difficulty',
    title: 'Noise Difficulty',
    description:
      'Speech-in-noise difficulty is the most common hearing aid complaint. It requires a combined approach addressing the hearing aid\'s directional system, noise reduction, programming, and patient communication strategies.',
    symptoms: [
      'Cannot understand speech in restaurants or social gatherings',
      'Background noise is overwhelming',
      'Hearing aids work well in quiet but fail in noise',
      'Patient avoids noisy social situations',
      'Complaints increase with group size',
    ],
    adjustments: [
      'Activate and optimize directional microphone system',
      'Enable or increase noise reduction algorithm strength',
      'Create a dedicated noise program with: directional mics, strong NR, reduced low-frequency gain (250-1000 Hz by 3-5 dB)',
      'If available, enable spatial noise management or binaural beamforming',
      'Consider assistive listening devices (remote microphone) for severe cases',
    ],
    verification: [
      'QuickSIN or HINT testing in aided condition',
      'Subjective rating in simulated restaurant noise',
      'Follow-up report after real-world restaurant experience',
      'Compare SNR improvement with directional on vs. off',
    ],
    timeline: 'Initial fitting: configure noise program. Week 2: assess real-world performance. Week 4: fine-tune. Consider remote microphone if SNR loss > 7 dB after optimization.',
  },
  {
    id: 'own-voice',
    title: 'Own Voice Issues',
    description:
      'Own-voice complaints (boomy, hollow, echo-like) are caused by the occlusion effect -- the amplification of bone-conducted vocal energy in a sealed ear canal. The solution involves a combination of venting, gain adjustment, and potentially changing the fitting style.',
    symptoms: [
      'Own voice sounds boomy, hollow, or echo-like',
      'Chewing sounds are amplified',
      'Patient talks more softly to compensate',
      'Symptoms improve when ear canal is opened (pulling out mold/dome)',
      'Complaints are worse with occluding fittings',
    ],
    adjustments: [
      'Increase vent size in the earmold/dome (primary intervention)',
      'Reduce low-frequency gain (250-750 Hz) by 3-6 dB',
      'Consider switching from closed to open dome or from custom mold to open fit',
      'If own-voice management feature is available, activate it',
      'Verify that the hearing loss configuration permits an open fitting (minimal low-frequency loss required)',
    ],
    verification: [
      'Have the patient vocalize sustained vowels and count aloud',
      'Compare perception with dome/mold in place vs. removed',
      'Measure occlusion effect: bone conduction in occluded vs. open ear canal',
      'Patient self-rating of own-voice naturalness (1-10)',
    ],
    timeline: 'Visit 1: adjust venting and low-frequency gain. Visit 2 (1-2 weeks): reassess. If unresolved, consider open fitting change. Final assessment at 4 weeks.',
  },
];

// ---------------------------------------------------------------------------
// All categories for filtering
// ---------------------------------------------------------------------------

export const ALL_CATEGORIES: ComplaintCategory[] = [
  'Loudness',
  'Sound Quality',
  'Clarity',
  'Own Voice',
  'Feedback',
  'Environmental',
  'Connectivity',
  'Music',
  'Noise',
  'Audibility',
  'Hardware',
];

// ---------------------------------------------------------------------------
// Category color mapping for consistent UI
// ---------------------------------------------------------------------------

export const CATEGORY_COLORS: Record<ComplaintCategory, 'error' | 'primary' | 'secondary' | 'info' | 'warning' | 'success' | 'default'> = {
  Loudness: 'error',
  'Sound Quality': 'primary',
  Clarity: 'secondary',
  'Own Voice': 'info',
  Feedback: 'warning',
  Environmental: 'success',
  Connectivity: 'info',
  Music: 'primary',
  Noise: 'warning',
  Audibility: 'secondary',
  Hardware: 'default',
};
