// File: src/utils/validationScenarios.ts

import { questions as QUESTIONS } from '../data/questions';
import { categoriesMap } from '../data/categoriesMap';
import { swipeTypeMapping as mapping54to8 } from '../data/swipeTypeMapping';
import { assignSwipeType, computeMeans, scoreDirection, Means } from './scoring';

export type Dir = 'up' | 'right' | 'left' | 'down';

export interface Scenario {
  name: string;
  pattern: Record<number, Dir>; // questionId -> direction
  expected: {
    means: Means;
    topStyle: string;
    topEnneagram: string;
    primarySwipeType: string;
    blend?: string | null;
  };
}

/** helper to build a constant-direction pattern for all questions */
function all(dir: Dir) {
  const p: Record<number, Dir> = {};
  QUESTIONS.forEach(q => (p[q.id] = dir));
  return p;
}

/** alternating UP/DOWN by index (1-based) */
function alternatingUpDown() {
  const p: Record<number, Dir> = {};
  QUESTIONS.forEach((q, idx) => (p[q.id] = (idx % 2 === 0 ? 'down' : 'up')));
  return p;
}

/** pattern to target a specific style & type */
function target(styleKey: keyof typeof categoriesMap.connectionStyles, typeKey: keyof typeof categoriesMap.enneagramTypes) {
  const p: Record<number, Dir> = {};
  const targetStyle = new Set(categoriesMap.connectionStyles[styleKey]);
  const targetType = new Set(categoriesMap.enneagramTypes[typeKey]);

  QUESTIONS.forEach(q => {
    const isStyle = targetStyle.has(q.id);
    const isType = targetType.has(q.id);

    if (isStyle || isType) {
      // Maximize target categories: choose UP for forward, LEFT for reverse (−1 becomes +1 after inversion)
      p[q.id] = q.reverse ? 'left' : 'up';
    } else {
      // Minimize all others: choose DOWN for forward, RIGHT for reverse
      p[q.id] = q.reverse ? 'right' : 'down';
    }
  });
  return p;
}

function evaluate(pattern: Record<number, Dir>) {
  const scores = QUESTIONS.map(q => ({
    id: q.id,
    val: scoreDirection(q, pattern[q.id]!)
  }));

  const means = computeMeans(scores);
  const { primarySwipeType, topStyle, topEnneagram, blendSwipeType } = assignSwipeType(means);
  return {
    means,
    topStyle,
    topEnneagram,
    primarySwipeType,
    blend: blendSwipeType ?? null
  };
}

export const testScenarios: Scenario[] = [
  {
    name: 'All YES! (UP)',
    pattern: all('up'),
    expected: evaluate(all('up'))
  },
  {
    name: 'All NO! (DOWN)',
    pattern: all('down'),
    expected: evaluate(all('down'))
  },
  {
    name: 'Alternating UP/DOWN',
    pattern: alternatingUpDown(),
    expected: evaluate(alternatingUpDown())
  },
  // Target each of four representative Swipe Types:
  {
    name: 'Deep Connector pattern (qualityPresence + type4)',
    pattern: target('qualityPresence', 'type4'),
    expected: evaluate(target('qualityPresence', 'type4'))
  },
  {
    name: 'Solid Rock pattern (supportiveActions + type6)',
    pattern: target('supportiveActions', 'type6'),
    expected: evaluate(target('supportiveActions', 'type6'))
  },
  {
    name: 'Watchful Guard pattern (physicalCloseness + type8)',
    pattern: target('physicalCloseness', 'type8'),
    expected: evaluate(target('physicalCloseness', 'type8'))
  },
  {
    name: 'Warm Heart pattern (thoughtfulGestures + type2)',
    pattern: target('thoughtfulGestures', 'type2'),
    expected: evaluate(target('thoughtfulGestures', 'type2'))
  },
  {
    name: 'Progress Partner pattern (sharedGrowth + type3)',
    pattern: target('sharedGrowth', 'type3'),
    expected: evaluate(target('sharedGrowth', 'type3'))
  }
];
