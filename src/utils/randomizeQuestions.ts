// File: src/utils/randomizeQuestions.ts
// Deterministic randomization with framework window rule & optional tag clusters.

export type Direction = 'up' | 'right' | 'left' | 'down';

export interface Question {
  id: number;
  text: string;
  framework: 'connection' | 'enneagram';
  category: string;
  reverse: boolean;
  weight: { up: number; right: number; left: number; down: number };
  tags?: string[]; // e.g., ['onboarding_easy'], ['high_signal']
}

export interface RandomizeOptions {
  seed?: number;
  maxRun?: number;             // max same-framework in a row
  warmupCount?: number;        // take up to N 'onboarding_easy' first
  finaleCount?: number;        // take up to N 'high_signal' last
}

/** Mulberry32 PRNG for deterministic shuffles */
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickByTag(qs: Question[], tag: string, count: number, rng: () => number) {
  const bucket = qs.filter(q => q.tags?.includes(tag));
  return shuffle(bucket, rng).slice(0, count).map(q => q.id);
}

export function randomizeQuestions(questions: Question[], opts: RandomizeOptions = {}) {
  const seed = opts.seed ?? 42;
  const rng = mulberry32(seed);
  const maxRun = opts.maxRun ?? 2;

  const warmupIds = pickByTag(questions, 'onboarding_easy', opts.warmupCount ?? 6, rng);
  const finaleIds = pickByTag(questions, 'high_signal', opts.finaleCount ?? 6, rng);

  const byId = new Map(questions.map(q => [q.id, q]));
  const warmupSet = new Set(warmupIds);
  const finaleSet = new Set(finaleIds);

  const pool = questions
    .filter(q => !warmupSet.has(q.id) && !finaleSet.has(q.id))
    .map(q => q.id);

  const middle = shuffle(pool, rng);

  // Assemble base order: warmup → middle → finale
  const base = [...warmupIds, ...middle, ...finaleIds];

  // Enforce window rule (maxRun of same framework)
  const result: number[] = [];
  let run = 0;
  let lastFramework: Question['framework'] | null = null;

  function tryPlace(id: number) {
    const q = byId.get(id)!;
    if (lastFramework && q.framework === lastFramework) {
      if (run >= maxRun) return false;
      run += 1;
    } else {
      lastFramework = q.framework;
      run = 1;
    }
    result.push(id);
    return true;
  }

  const queue = base.slice();
  const buffer: number[] = [];

  while (queue.length) {
    const id = queue.shift()!;
    if (!tryPlace(id)) {
      buffer.push(id);
      // Try swap from buffer when stuck
      const idx = buffer.findIndex(bid => byId.get(bid)!.framework !== lastFramework);
      if (idx >= 0) {
        const [swapId] = buffer.splice(idx, 1);
        tryPlace(swapId);
      }
    }
  }
  // Flush buffer (should be empty; if not, just append)
  result.push(...buffer);

  return result.map((id, i) => ({ id, displayOrder: i + 1 }));
}


