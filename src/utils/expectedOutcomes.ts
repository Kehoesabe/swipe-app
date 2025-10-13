/* ============================================
 * Swipe Type – Validation Mapping & Scenarios
 * ============================================
 * Paste into /tests/validation/expectedOutcomes.ts
 * or similar. Designed to be consumed by
 * automated Jest/Playwright tests in Cursor.
 */

/* ---------- Types ---------- */
export type SwipeType =
  | "Direct Nurturer"
  | "Direct Planner"
  | "Clear Communicator"
  | "Gentle Giver"
  | "Thoughtful Supporter"
  | "Harmonizer"
  | "Steady Helper"
  | "Strategic Partner";

export type Direction = "up" | "right" | "left" | "down";

/* =================================================
 * Part 1: Complete 54 → 8 Mapping (authoritative)
 * =================================================
 * Key format: "<connectionStyle>_<enneagramType>"
 * Connection Styles: verbalAffirmation | qualityPresence | physicalCloseness | supportiveActions | thoughtfulGestures | sharedGrowth
 * Enneagram: type1..type9
 */
export const mapping54to8: Record<string, SwipeType> = {
  /* Direct Nurturer (8) */
  supportiveActions_type6: "Direct Nurturer",
  supportiveActions_type9: "Direct Nurturer",
  qualityPresence_type6: "Direct Nurturer",
  qualityPresence_type9: "Direct Nurturer",
  physicalCloseness_type9: "Direct Nurturer",
  sharedGrowth_type6: "Direct Nurturer",
  sharedGrowth_type9: "Direct Nurturer",
  physicalCloseness_type1: "Direct Nurturer",

  /* Thoughtful Supporter (7) */
  qualityPresence_type4: "Thoughtful Supporter",
  qualityPresence_type5: "Thoughtful Supporter",
  verbalAffirmation_type4: "Thoughtful Supporter",
  verbalAffirmation_type5: "Thoughtful Supporter",
  physicalCloseness_type4: "Thoughtful Supporter",
  thoughtfulGestures_type4: "Thoughtful Supporter",
  thoughtfulGestures_type5: "Thoughtful Supporter",

  /* Clear Communicator (6) */
  physicalCloseness_type2: "Clear Communicator",
  thoughtfulGestures_type2: "Clear Communicator",
  verbalAffirmation_type2: "Clear Communicator",
  supportiveActions_type2: "Clear Communicator",
  qualityPresence_type2: "Clear Communicator",
  sharedGrowth_type2: "Clear Communicator",

  /* Steady Helper (8) */
  sharedGrowth_type1: "Steady Helper",
  sharedGrowth_type3: "Steady Helper",
  sharedGrowth_type8: "Steady Helper",
  supportiveActions_type1: "Steady Helper",
  supportiveActions_type3: "Steady Helper",
  qualityPresence_type3: "Steady Helper",
  verbalAffirmation_type3: "Steady Helper",
  physicalCloseness_type3: "Steady Helper",

  /* Strategic Partner (6) */
  thoughtfulGestures_type7: "Strategic Partner",
  qualityPresence_type7: "Strategic Partner",
  verbalAffirmation_type7: "Strategic Partner",
  sharedGrowth_type7: "Strategic Partner",
  physicalCloseness_type7: "Strategic Partner",
  supportiveActions_type7: "Strategic Partner",

  /* Gentle Giver (6) */
  verbalAffirmation_type1: "Gentle Giver",
  verbalAffirmation_type6: "Gentle Giver",
  verbalAffirmation_type9: "Gentle Giver",
  qualityPresence_type1: "Gentle Giver",
  thoughtfulGestures_type1: "Gentle Giver",
  thoughtfulGestures_type6: "Gentle Giver",

  /* Direct Planner (7) */
  supportiveActions_type8: "Direct Planner",
  physicalCloseness_type8: "Direct Planner",
  physicalCloseness_type6: "Direct Planner",
  verbalAffirmation_type8: "Direct Planner",
  thoughtfulGestures_type8: "Direct Planner",
  thoughtfulGestures_type9: "Direct Planner",
  qualityPresence_type8: "Direct Planner",

  /* Harmonizer (6) */
  physicalCloseness_type5: "Harmonizer",
  supportiveActions_type4: "Harmonizer",
  supportiveActions_type5: "Harmonizer",
  sharedGrowth_type4: "Harmonizer",
  sharedGrowth_type5: "Harmonizer",
  thoughtfulGestures_type3: "Harmonizer",
};

/* =================================================
 * Part 2: Question Category Distribution (IDs)
 * ================================================= */
export const questionCategories = {
  connectionStyles: {
    verbalAffirmation: [1, 2, 3, 4],
    qualityPresence: [5, 6, 7, 8, 52],
    physicalCloseness: [9, 10, 11, 12, 53],
    supportiveActions: [13, 14, 15, 16, 54],
    thoughtfulGestures: [17, 18, 19, 20],
    sharedGrowth: [21, 22, 23, 24],
  },
  enneagramTypes: {
    type1: [25, 26, 27, 55],
    type2: [28, 29, 30, 57],
    type3: [31, 32, 33],
    type4: [34, 35, 36],
    type5: [37, 38, 49],
    type6: [39, 40, 41],
    type7: [42, 43, 44, 56],
    type8: [45, 46, 50],
    type9: [47, 48, 51],
  },
};

/* Reverse-coded item IDs (18 total) — must flip sign of chosen weight */
export const reverseItemIds = new Set<number>([
  4, 7, 12, 16, 19, 24, 33, 36, 41, 46, 49, 51, 52, 53, 54, 55, 56, 57,
]);

/* =================================================
 * Part 3: Test Scenarios (10 total)
 * =================================================
 * Notes
 * - expectedScores are MEANS (normalized by item count).
 * - Values rounded to 2 decimals for readability; test with epsilon (e.g., 0.01–0.05).
 * - allowedTopStyles / allowedTopEnneas handle ties deterministically in validation.
 */

type Scores = {
  connectionStyles: Record<
    keyof typeof questionCategories.connectionStyles,
    number
  >;
  enneagramTypes: Record<keyof typeof questionCategories.enneagramTypes, number>;
};

type ExpectedTop =
  | {
      topStyle: keyof typeof questionCategories.connectionStyles;
      styleScore: number;
      topEnneagram: keyof typeof questionCategories.enneagramTypes;
      enneaScore: number;
      mappingKey: string;
      primarySwipeType: SwipeType;
      styleMargin?: number;
      enneaMargin?: number;
    }
  | {
      /* Tie-friendly expectation */
      allowedTopStyles: (keyof typeof questionCategories.connectionStyles)[];
      allowedTopEnneas: (keyof typeof questionCategories.enneagramTypes)[];
      allowedSwipeTypes: SwipeType[];
      styleMargin?: number; // 0 for exact ties in our math
      enneaMargin?: number;
    };

export type TestScenario = {
  name: string;
  pattern:
    | "allUp"
    | "allDown"
    | "alternateUpDown"
    | "explicit"; // explicit => provide 'responses'
  responses?: Record<number, Direction>; // for explicit scenarios
  expectedScores: Scores;
  expectedTop: ExpectedTop;
};

/* ---------- Scenario helpers ---------- */
const round = (x: number) => Math.round(x * 100) / 100;

/* Scenarios 1–3: global patterns (implementation should generate responses internally)
   - In tests, you can synthesize responses from 'pattern'
*/

/* Scenario 1 – All YES! (UP) */
export const scenarioAllUp: TestScenario = {
  name: "All YES! (UP)",
  pattern: "allUp",
  expectedScores: {
    connectionStyles: {
      // VA: (3×+2 + 1×-2)/4 = 1.00
      verbalAffirmation: 1.0,
      // QP: (4×+2 + 1×-2)/5 = 1.20 (Q5,6,8,52=+2, Q7=-2)
      qualityPresence: 1.2,
      // PC: (4×+2 + 1×-2)/5 = 1.20 (Q9,10,11,53=+2, Q12=-2)
      physicalCloseness: 1.2,
      // SA: (4×+2 + 1×-2)/5 = 1.20 (Q13,14,15,54=+2, Q16=-2)
      supportiveActions: 1.2,
      // TG: (3×+2 + 1×-2)/4 = 1.00 (Q17,18,20=+2, Q19=-2)
      thoughtfulGestures: 1.0,
      // SG: (3×+2 + 1×-2)/4 = 1.00 (Q21,22,23=+2, Q24=-2)
      sharedGrowth: 1.0,
    },
    enneagramTypes: {
      // Types with 3F+1R => 2.00 (all +2)
      type1: 2.0,
      type2: 2.0,
      type7: 2.0,
      // Types with 2F+1R => 0.67
      type3: 0.67,
      type4: 0.67,
      type5: 0.67,
      type6: 0.67,
      type8: 0.67,
      type9: 0.67,
    },
  },
  expectedTop: {
    /* Ties on both axes */
    allowedTopStyles: ["verbalAffirmation", "thoughtfulGestures", "sharedGrowth"],
    allowedTopEnneas: ["type1", "type2", "type7"],
    allowedSwipeTypes: [
      "Gentle Guide",  // VA_type1
      "Warm Heart",    // TG/SG + type2
      "Free Spirit",   // *_type7
      "Progress Partner", // SG_type1 also maps here
    ],
    styleMargin: 0.0,
    enneaMargin: 0.0,
  },
};

/* Scenario 2 – All NO! (DOWN) */
export const scenarioAllDown: TestScenario = {
  name: "All NO! (DOWN)",
  pattern: "allDown",
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: -0.4,
      physicalCloseness: -0.4,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type7: -1.0,
      type3: -0.67,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    allowedTopStyles: ["qualityPresence", "physicalCloseness", "supportiveActions"],
    allowedTopEnneas: ["type3", "type4", "type5", "type6", "type8", "type9"],
    allowedSwipeTypes: [
      "Progress Partner",   // qualityPresence_type3
      "Deep Connector",     // qualityPresence_type4/5
      "Authentic Soul",     // thoughtfulGestures_type3 (if TG rose after local ties)
      "Watchful Guard",     // physicalCloseness_type8
      "Solid Rock",         // physicalCloseness_type9
      "Free Spirit",        // supportiveActions_type7 (if ties resolve that way)
      "Gentle Guide",       // verbalAffirmation_* (if ties resolve toward VA)
      "Warm Heart",         // qualityPresence_type2 (if ties flip)
    ],
    styleMargin: 0.0,
    enneaMargin: 0.0,
  },
};

/* Scenario 3 – Alternating YES!/NO! (odd up, even down) */
export const scenarioAlternate: TestScenario = {
  name: "Alternating UP/DOWN",
  pattern: "alternateUpDown",
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -0.5,
      qualityPresence: 1.2,
      physicalCloseness: -0.4,
      supportiveActions: 1.2,
      thoughtfulGestures: -0.5,
      sharedGrowth: -0.5,
    },
    enneagramTypes: {
      type1: 0.0,
      type2: 0.0,
      type3: 0.0,
      type4: 0.67, // tie
      type5: 0.0,
      type6: 0.0,
      type7: 0.0,
      type8: 0.67, // tie
      type9: 0.0,
    },
  },
  expectedTop: {
    allowedTopStyles: ["qualityPresence", "supportiveActions"],
    allowedTopEnneas: ["type4", "type8"],
    allowedSwipeTypes: [
      "Deep Connector",     // qualityPresence_type4
      "Watchful Guard",     // qualityPresence_type8
      "Authentic Soul",     // supportiveActions_type4
      "Watchful Guard",     // supportiveActions_type8
    ],
    styleMargin: 0.2,
    enneaMargin: 0.0,
  },
};

/* ---------- Scenario 4 – Targeted: Deep Connector ----------
   Pattern: Max qualityPresence + type4; all else DOWN.
   - QP forwards (5,6,8) = UP; reverses (7,52) = LEFT (reverse+ => +1)
   - Type4 forwards (34,35) = UP; reverse (36) = LEFT
*/
export const scenarioDeepConnector: TestScenario = {
  name: "Deep Connector (QP + type4)",
  pattern: "explicit",
  responses: {
    5: "up", 6: "up", 8: "up", 7: "left", 52: "left",
    34: "up", 35: "up", 36: "left",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: 1.4,
      physicalCloseness: -0.4,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: -0.67,
      type4: 1.0,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    topStyle: "qualityPresence",
    styleScore: 1.4,
    topEnneagram: "type4",
    enneaScore: 1.0,
    mappingKey: "qualityPresence_type4",
    primarySwipeType: "Deep Connector",
  },
};

/* ---------- Scenario 5 – Solid Rock (SA + type6) ---------- */
export const scenarioSolidRock: TestScenario = {
  name: "Solid Rock (SA + type6)",
  pattern: "explicit",
  responses: {
    // Supportive Actions: forwards UP; reverses DOWN
    13: "up", 14: "up", 15: "up", 16: "down", 54: "down",
    // Type 6: forwards UP; reverse DOWN
    39: "up", 40: "up", 41: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: -0.4,
      physicalCloseness: -0.4,
      supportiveActions: 1.6,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: -0.67,
      type4: -0.67,
      type5: -0.67,
      type6: 1.0,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    topStyle: "supportiveActions",
    styleScore: 1.6,
    topEnneagram: "type6",
    enneaScore: 1.0,
    mappingKey: "supportiveActions_type6",
    primarySwipeType: "Solid Rock",
  },
};

/* ---------- Scenario 6 – Watchful Guard (PC + type8) ---------- */
export const scenarioWatchfulGuard: TestScenario = {
  name: "Watchful Guard (PC + type8)",
  pattern: "explicit",
  responses: {
    // Physical Closeness: forwards UP; reverses DOWN
    9: "up", 10: "up", 11: "up", 12: "down", 53: "down",
    // Type 8: forwards UP; reverse DOWN
    45: "up", 50: "up", 46: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: -0.4,
      physicalCloseness: 1.6,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: -0.67,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: 1.0,
      type9: -0.67,
    },
  },
  expectedTop: {
    topStyle: "physicalCloseness",
    styleScore: 1.6,
    topEnneagram: "type8",
    enneaScore: 1.0,
    mappingKey: "physicalCloseness_type8",
    primarySwipeType: "Watchful Guard",
  },
};

/* ---------- Scenario 7 – Warm Heart (PC + type2) ---------- */
export const scenarioWarmHeart: TestScenario = {
  name: "Warm Heart (PC + type2)",
  pattern: "explicit",
  responses: {
    9: "up", 10: "up", 11: "up", 12: "down", 53: "down",
    28: "up", 29: "up", 30: "up", 57: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: -0.4,
      physicalCloseness: 1.6,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: 1.0,
      type3: -0.67,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    topStyle: "physicalCloseness",
    styleScore: 1.6,
    topEnneagram: "type2",
    enneaScore: 1.0,
    mappingKey: "physicalCloseness_type2",
    primarySwipeType: "Warm Heart",
  },
};

/* ---------- Scenario 8 – Progress Partner (SG + type3) ---------- */
export const scenarioProgressPartner: TestScenario = {
  name: "Progress Partner (SG + type3)",
  pattern: "explicit",
  responses: {
    21: "up", 22: "up", 23: "up", 24: "down",
    31: "up", 32: "up", 33: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: -0.4,
      physicalCloseness: -0.4,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: 1.6,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: 1.0,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    topStyle: "sharedGrowth",
    styleScore: 1.6,
    topEnneagram: "type3",
    enneaScore: 1.0,
    mappingKey: "sharedGrowth_type3",
    primarySwipeType: "Progress Partner",
  },
};

/* ---------- Scenario 9 – Style Blend (QP ≈ SA, tie) ---------- */
export const scenarioStyleBlend: TestScenario = {
  name: "Style Blend (QP tie SA; type3 top)",
  pattern: "explicit",
  responses: {
    // SA: forwards UP; reverses LEFT (rev => +1)
    13: "up", 14: "up", 15: "up", 16: "left", 54: "left",
    // QP: forwards UP; reverses LEFT
    5: "up", 6: "up", 8: "up", 7: "left", 52: "left",
    // Type3: forwards UP; reverse DOWN
    31: "up", 32: "up", 33: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: 1.6,
      physicalCloseness: -0.4,
      supportiveActions: 1.6,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: 1.0,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    allowedTopStyles: ["qualityPresence", "supportiveActions"],
    allowedTopEnneas: ["type3"],
    allowedSwipeTypes: [
      "Progress Partner", // both QP_type3 and SA_type3 map here
    ],
    styleMargin: 0.0,
    enneaMargin: undefined,
  },
};

/* ---------- Scenario 10 – Type Blend (type4 ≈ type5) ---------- */
export const scenarioTypeBlendDeep: TestScenario = {
  name: "Type Blend (type4 tie type5; QP top)",
  pattern: "explicit",
  responses: {
    // QP max
    5: "up", 6: "up", 8: "up", 7: "down", 52: "down",
    // Type4: forwards UP; reverse LEFT
    34: "up", 35: "up", 36: "left",
    // Type5: forwards UP; reverse LEFT
    37: "up", 38: "up", 49: "left",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: 2.0,
      physicalCloseness: -0.4,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: -0.67,
      type4: 1.67,
      type5: 1.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    allowedTopStyles: ["qualityPresence"],
    allowedTopEnneas: ["type4", "type5"],
    allowedSwipeTypes: ["Deep Connector"], // QP_type4 or QP_type5
    styleMargin: undefined, // > 0.2
    enneaMargin: 0.0,
  },
};

/* ---------- Bonus: Scenario 11 – All RIGHT (Yes) ---------- */
export const scenarioAllRight: TestScenario = {
  name: "All RIGHT (Yes)",
  pattern: "allUp", // treat as +1 everywhere; your test harness can special-case this
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: 0.5,
      qualityPresence: 0.2,
      physicalCloseness: 0.2,
      supportiveActions: 0.2,
      thoughtfulGestures: 0.5,
      sharedGrowth: 0.5,
    },
    enneagramTypes: {
      type1: 0.5,
      type2: 0.5,
      type3: 0.33,
      type4: 0.33,
      type5: 0.33,
      type6: 0.33,
      type7: 0.5,
      type8: 0.33,
      type9: 0.33,
    },
  },
  expectedTop: {
    allowedTopStyles: ["verbalAffirmation", "thoughtfulGestures", "sharedGrowth"],
    allowedTopEnneas: ["type1", "type2", "type7"],
    allowedSwipeTypes: [
      "Gentle Guide",
      "Warm Heart",
      "Free Spirit",
      "Progress Partner",
    ],
    styleMargin: 0.0,
    enneaMargin: 0.0,
  },
};

/* ---------- Bonus: Scenario 12 – Style-only QP, others DOWN ---------- */
export const scenarioStyleOnlyQP: TestScenario = {
  name: "Style-only QP high, others DOWN",
  pattern: "explicit",
  responses: {
    5: "up", 6: "up", 8: "up", 7: "down", 52: "down",
  },
  expectedScores: {
    connectionStyles: {
      verbalAffirmation: -1.0,
      qualityPresence: 2.0,
      physicalCloseness: -0.4,
      supportiveActions: -0.4,
      thoughtfulGestures: -1.0,
      sharedGrowth: -1.0,
    },
    enneagramTypes: {
      type1: -1.0,
      type2: -1.0,
      type3: -0.67,
      type4: -0.67,
      type5: -0.67,
      type6: -0.67,
      type7: -1.0,
      type8: -0.67,
      type9: -0.67,
    },
  },
  expectedTop: {
    allowedTopStyles: ["qualityPresence"],
    allowedTopEnneas: ["type3", "type4", "type5", "type6", "type8", "type9"], // tie at -0.67
    allowedSwipeTypes: [
      "Progress Partner",
      "Deep Connector",
      "Authentic Soul",
      "Watchful Guard",
    ],
    styleMargin: undefined,
    enneaMargin: 0.0,
  },
};

export const testScenarios: TestScenario[] = [
  scenarioAllUp,
  scenarioAllDown,
  scenarioAlternate,
  scenarioDeepConnector,
  scenarioSolidRock,
  scenarioWatchfulGuard,
  scenarioWarmHeart,
  scenarioProgressPartner,
  scenarioStyleBlend,
  scenarioTypeBlendDeep,
  scenarioAllRight,
  scenarioStyleOnlyQP,
];

/* =================================================
 * Part 4: Reverse-Item Impact (18 items)
 * =================================================
 * TL;DR — For these IDs, invert the chosen weight.
 * (Texts shown here should match your patched question bank.)
 */
export const reverseItems = [
  { id: 4,  category: "verbalAffirmation", impact: "YES reduces VA; NO increases", scoringNote: "Flip sign" },
  { id: 7,  category: "qualityPresence",   impact: "YES reduces QP; NO increases", scoringNote: "Flip sign" },
  { id: 12, category: "physicalCloseness", impact: "YES reduces PC; NO increases", scoringNote: "Flip sign" },
  { id: 16, category: "supportiveActions", impact: "YES reduces SA; NO increases", scoringNote: "Flip sign" },
  { id: 19, category: "thoughtfulGestures",impact: "YES reduces TG; NO increases", scoringNote: "Flip sign" },
  { id: 24, category: "sharedGrowth",      impact: "YES reduces SG; NO increases", scoringNote: "Flip sign" },
  { id: 33, category: "type3",             impact: "YES reduces T3; NO increases", scoringNote: "Flip sign" },
  { id: 36, category: "type4",             impact: "YES reduces T4; NO increases", scoringNote: "Flip sign" },
  { id: 41, category: "type6",             impact: "YES reduces T6; NO increases", scoringNote: "Flip sign" },
  { id: 46, category: "type8",             impact: "YES reduces T8; NO increases", scoringNote: "Flip sign" },
  { id: 49, category: "type5",             impact: "YES reduces T5; NO increases", scoringNote: "Flip sign" },
  { id: 51, category: "type9",             impact: "YES reduces T9; NO increases", scoringNote: "Flip sign" },
  { id: 52, category: "qualityPresence",   impact: "YES reduces QP; NO increases", scoringNote: "Flip sign" },
  { id: 53, category: "physicalCloseness", impact: "YES reduces PC; NO increases", scoringNote: "Flip sign" },
  { id: 54, category: "supportiveActions", impact: "YES reduces SA; NO increases", scoringNote: "Flip sign" },
  { id: 55, category: "type1",             impact: "YES reduces T1; NO increases", scoringNote: "Flip sign" },
  { id: 56, category: "type7",             impact: "YES reduces T7; NO increases", scoringNote: "Flip sign" },
  { id: 57, category: "type2",             impact: "YES reduces T2; NO increases", scoringNote: "Flip sign" },
];

/* =================================================
 * Part 5: Validation Helper
 * =================================================
 * Compare actual results to expected scenario, allowing for ties and float tolerance.
 */
export type ActualResult = {
  topStyle: keyof typeof questionCategories.connectionStyles;
  topStyleScore: number;
  secondStyle?: keyof typeof questionCategories.connectionStyles;
  topEnneagram: keyof typeof questionCategories.enneagramTypes;
  topEnneagramScore: number;
  secondEnneagram?: keyof typeof questionCategories.enneagramTypes;
  primarySwipeType: SwipeType;
  styleMargin?: number; // actual margin used by your scorer
  enneaMargin?: number;
  scores?: Scores;      // optional: full matrix for deeper assertions
};

export function validateTestResult(
  actual: ActualResult,
  expected: TestScenario["expectedTop"],
  eps = 0.05
): { pass: boolean; details: string } {
  const isTieMode = (expected as any).allowedTopStyles !== undefined;

  if (!isTieMode) {
    const e = expected as NonNullable<
      Extract<TestScenario["expectedTop"], { topStyle: any }>
    >;
    const styleOk =
      actual.topStyle === e.topStyle &&
      Math.abs(actual.topStyleScore - e.styleScore) <= eps;
    const enneaOk =
      actual.topEnneagram === e.topEnneagram &&
      Math.abs(actual.topEnneagramScore - e.enneaScore) <= eps;

    const key = `${e.topStyle}_${e.topEnneagram}`;
    const typeOk =
      actual.primarySwipeType === e.primarySwipeType &&
      key === e.mappingKey;

    const ok = styleOk && enneaOk && typeOk;
    return {
      pass: ok,
      details: ok
        ? "PASS"
        : `FAIL
Expected: style=${e.topStyle} (${e.styleScore}), ennea=${e.topEnneagram} (${e.enneaScore}), type=${e.primarySwipeType}
Actual:   style=${actual.topStyle} (${round(actual.topStyleScore)}), ennea=${actual.topEnneagram} (${round(
            actual.topEnneagramScore
          )}), type=${actual.primarySwipeType}`,
    };
  }

  // Tie-friendly mode
  const e = expected as NonNullable<
    Extract<TestScenario["expectedTop"], { allowedTopStyles: any }>
  >;

  const styleOk = e.allowedTopStyles.includes(actual.topStyle);
  const enneaOk = e.allowedTopEnneas.includes(actual.topEnneagram);
  const typeOk = e.allowedSwipeTypes.includes(actual.primarySwipeType);

  const ok = styleOk && enneaOk && typeOk;
  return {
    pass: ok,
    details: ok
      ? "PASS (tie-friendly)"
      : `FAIL (tie)
Allowed styles=${e.allowedTopStyles.join(
          ", "
        )} | got ${actual.topStyle}; allowed enneas=${e.allowedTopEnneas.join(
          ", "
        )} | got ${actual.topEnneagram}; allowed types=${e.allowedSwipeTypes.join(
          ", "
        )} | got ${actual.primarySwipeType}`,
  };
}
