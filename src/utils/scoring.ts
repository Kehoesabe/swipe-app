// File: src/utils/scoring.ts
// Enhanced scoring with normalization, blend rule and centroid tie-break.

import { questions as QUESTIONS } from '../data/questions';
import { categoriesMap } from '../data/categoriesMap';
import { swipeTypeMapping as mapping54to8 } from '../data/swipeTypeMapping';
import centroidsJson from '../data/centroids.json';

export type Dir = 'up' | 'right' | 'left' | 'down';

export interface Question {
  id: number;
  text: string;
  framework: 'connection' | 'enneagram';
  category: string;
  reverse: boolean;
  weight: { up: number; right: number; left: number; down: number };
}

export type Means = {
  connection: Record<string, number>;
  enneagram: Record<string, number>;
};

const BLEND_MARGIN = 0.20; // within 0.20 → show blend message
const TIEBREAK_MARGIN = 0.05; // if both frameworks have ties within this, use centroid nearest match

export function scoreDirection(q: Question, dir: Dir): number {
  const base = q.weight[dir];
  return q.reverse ? -base : base;
}

export function computeMeans(scored: Array<{ id: number; val: number }>): Means {
  const connKeys = Object.keys(categoriesMap.connectionStyles);
  const ennKeys = Object.keys(categoriesMap.enneagramTypes);

  const connSum: Record<string, number> = Object.fromEntries(connKeys.map(k => [k, 0]));
  const connCount: Record<string, number> = Object.fromEntries(connKeys.map(k => [k, 0]));
  const ennSum: Record<string, number> = Object.fromEntries(ennKeys.map(k => [k, 0]));
  const ennCount: Record<string, number> = Object.fromEntries(ennKeys.map(k => [k, 0]));

  const idTo = new Map<number, { framework: 'connection'|'enneagram'; key: string }>();
  (Object.entries(categoriesMap.connectionStyles)).forEach(([k, ids]) => ids.forEach(id => idTo.set(id, { framework: 'connection', key: k })));
  (Object.entries(categoriesMap.enneagramTypes)).forEach(([k, ids]) => ids.forEach(id => idTo.set(id, { framework: 'enneagram', key: k })));

  scored.forEach(({ id, val }) => {
    const meta = idTo.get(id);
    if (!meta) return;
    if (meta.framework === 'connection') {
      connSum[meta.key] += val;
      connCount[meta.key] += 1;
    } else {
      ennSum[meta.key] += val;
      ennCount[meta.key] += 1;
    }
  });

  const connection: Record<string, number> = {};
  const enneagram: Record<string, number> = {};

  for (const k of connKeys) {
    const c = connCount[k] || 1;
    connection[k] = connSum[k] / c; // normalized mean
  }
  for (const k of ennKeys) {
    const c = ennCount[k] || 1;
    enneagram[k] = ennSum[k] / c; // normalized mean
  }

  return { connection, enneagram };
}

function topTwo(record: Record<string, number>) {
  const entries = Object.entries(record).sort((a, b) => b[1] - a[1]);
  const [firstK, firstV] = entries[0];
  const [secondK, secondV] = entries[1];
  return {
    first: { key: firstK, val: firstV },
    second: { key: secondK, val: secondV },
    margin: firstV - secondV
  };
}

function nearestCentroid(styleKey: string, typeKey: string): string {
  // Build a 15-d normalized vector from current winners
  const labels = centroidsJson.labels;
  const vecCon = labels.connection.map(k => (k === styleKey ? 1 : 0));
  const vecEnn = labels.enneagram.map(k => (k === typeKey ? 1 : 0));
  const vec = [...vecCon, ...vecEnn];

  function dist(a: number[], b: number[]) {
    let s = 0;
    for (let i = 0; i < a.length; i++) {
      const d = a[i] - b[i];
      s += d * d;
    }
    return Math.sqrt(s);
  }

  let best = { type: '', d: Number.POSITIVE_INFINITY };
  for (const c of centroidsJson.centroids) {
    const cv = [...c.connection, ...c.enneagram];
    const d = dist(vec, cv);
    if (d < best.d) best = { type: c.swipeType, d };
  }
  return best.type;
}

export function assignSwipeType(means: Means) {
  const connTop = topTwo(means.connection);
  const ennTop = topTwo(means.enneagram);

  const primaryKey = `${connTop.first.key}_${ennTop.first.key}`;
  let primarySwipeType = mapping54to8[primaryKey];

  // Fallback to centroid if missing or both margins razor-thin
  if (!primarySwipeType || (connTop.margin < TIEBREAK_MARGIN && ennTop.margin < TIEBREAK_MARGIN)) {
    primarySwipeType = nearestCentroid(connTop.first.key, ennTop.first.key);
  }

  // Blend rule: if either framework margin < BLEND_MARGIN, show secondary
  let blendSwipeType: string | undefined;
  if (connTop.margin < BLEND_MARGIN) {
    const key2 = `${connTop.second.key}_${ennTop.first.key}`;
    blendSwipeType = mapping54to8[key2];
  }
  if (!blendSwipeType && ennTop.margin < BLEND_MARGIN) {
    const key3 = `${connTop.first.key}_${ennTop.second.key}`;
    blendSwipeType = mapping54to8[key3];
  }

  return {
    primarySwipeType,
    blendSwipeType,
    topStyle: connTop.first.key,
    topEnneagram: ennTop.first.key,
    margins: { style: connTop.margin, enneagram: ennTop.margin }
  };
}

// Convenience end-to-end:
// answers: map of questionId -> direction
export function scoreAssessment(answers: Record<number, Dir>) {
  const scored = QUESTIONS.map(q => ({
    id: q.id,
    val: scoreDirection(q as any, answers[q.id]!)
  }));
  const means = computeMeans(scored);
  const assignment = assignSwipeType(means);
  return { means, ...assignment };
}

// computeMeans is already exported above
