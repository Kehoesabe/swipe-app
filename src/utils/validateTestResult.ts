// File: src/utils/validateTestResult.ts

export interface ExpectedResult {
  primarySwipeType: string;
  topStyle: string;
  topEnneagram: string;
  means: {
    connection: Record<string, number>;
    enneagram: Record<string, number>;
  };
  blend?: string | null;
}

export function nearlyEqual(a: number, b: number, eps = 1e-6) {
  return Math.abs(a - b) <= eps;
}

export function diffMeans(
  actual: ExpectedResult['means'],
  expected: ExpectedResult['means'],
  eps = 1e-6
) {
  const diffs: string[] = [];
  for (const [k, v] of Object.entries(expected.connection)) {
    if (!nearlyEqual(actual.connection[k], v, eps)) diffs.push(`connection.${k}: got ${actual.connection[k]}, expected ${v}`);
  }
  for (const [k, v] of Object.entries(expected.enneagram)) {
    if (!nearlyEqual(actual.enneagram[k], v, eps)) diffs.push(`enneagram.${k}: got ${actual.enneagram[k]}, expected ${v}`);
  }
  return diffs;
}

export function validateTestResult(actual: ExpectedResult, expected: ExpectedResult) {
  const errors: string[] = [];

  if (actual.primarySwipeType !== expected.primarySwipeType) {
    errors.push(`primarySwipeType mismatch: got "${actual.primarySwipeType}", expected "${expected.primarySwipeType}"`);
  }
  if (actual.topStyle !== expected.topStyle) {
    errors.push(`topStyle mismatch: got "${actual.topStyle}", expected "${expected.topStyle}"`);
  }
  if (actual.topEnneagram !== expected.topEnneagram) {
    errors.push(`topEnneagram mismatch: got "${actual.topEnneagram}", expected "${expected.topEnneagram}"`);
  }

  errors.push(...diffMeans(actual.means, expected.means));

  const pass = errors.length === 0;
  return { pass, errors };
}




