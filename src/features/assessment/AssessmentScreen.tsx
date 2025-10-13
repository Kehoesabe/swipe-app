// src/features/assessment/AssessmentScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from '../../ui/Screen';
import Progress from '../../ui/Progress';
import AssessmentCard from './AssessmentCard';
import { Spacing } from '../../theme/tokens';
import { questions } from '../../data/questions'; // existing file in repo
import { scoreResponse } from '../../utils/scoring'; // your enhanced scoring.ts
import type { Question } from '../../types/assessment';

export default function AssessmentScreen({ onDone }: { onDone: () => void }) {
  const [idx, setIdx] = React.useState(0);

  const handleCommit = (dir: 'up'|'right'|'left'|'down') => {
    const q: Question = questions[idx];
    scoreResponse(q, dir); // accumulates internally in your scorer; or replace with dispatch
    const next = idx + 1;
    if (next < questions.length) setIdx(next);
    else onDone();
  };

  const q = questions[idx];

  return (
    <Screen>
      <View style={styles.top}><Progress current={idx+1} total={questions.length} /></View>
      <View style={styles.center}>
        <AssessmentCard text={q.text} onCommit={handleCommit} />
      </View>
      {/* Optional: render 4-button pad for accessibility here */}
    </Screen>
  );
}
const styles = StyleSheet.create({
  top: { paddingHorizontal: Spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});


