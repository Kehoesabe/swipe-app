import { SwipeTypeName } from '../lib/types';

export const swipeTypeMapping: Record<string, SwipeTypeName> = {
  // Direct Nurturer (8 combos) - High Directness + High Tangibility
  'verbalAffirmation_type6': 'directNurturer',
  'verbalAffirmation_type9': 'directNurturer',
  'qualityPresence_type6': 'directNurturer',
  'qualityPresence_type9': 'directNurturer',
  'physicalCloseness_type9': 'directNurturer',
  'supportiveActions_type6': 'directNurturer',
  'supportiveActions_type9': 'directNurturer',
  'physicalCloseness_type1': 'directNurturer',
  
  // Direct Planner (7 combos) - High Directness + Low Tangibility
  'supportiveActions_type8': 'directPlanner',
  'physicalCloseness_type8': 'directPlanner',
  'physicalCloseness_type6': 'directPlanner',
  'verbalAffirmation_type8': 'directPlanner',
  'thoughtfulGestures_type8': 'directPlanner',
  'thoughtfulGestures_type9': 'directPlanner',
  'qualityPresence_type8': 'directPlanner',
  
  // Clear Communicator (6 combos) - High Directness + Mid Tangibility
  'physicalCloseness_type2': 'clearCommunicator',
  'thoughtfulGestures_type2': 'clearCommunicator',
  'verbalAffirmation_type2': 'clearCommunicator',
  'supportiveActions_type2': 'clearCommunicator',
  'qualityPresence_type2': 'clearCommunicator',
  'sharedGrowth_type2': 'clearCommunicator',
  
  // Gentle Giver (6 combos) - Low Directness + High Tangibility
  'verbalAffirmation_type1': 'gentleGiver',
  'qualityPresence_type1': 'gentleGiver',
  'thoughtfulGestures_type1': 'gentleGiver',
  'thoughtfulGestures_type6': 'gentleGiver',
  'thoughtfulGestures_type9': 'gentleGiver',
  
  // Thoughtful Supporter (7 combos) - Low Directness + Mid Tangibility
  'qualityPresence_type4': 'thoughtfulSupporter',
  'qualityPresence_type5': 'thoughtfulSupporter',
  'verbalAffirmation_type4': 'thoughtfulSupporter',
  'verbalAffirmation_type5': 'thoughtfulSupporter',
  'physicalCloseness_type4': 'thoughtfulSupporter',
  'thoughtfulGestures_type4': 'thoughtfulSupporter',
  'thoughtfulGestures_type5': 'thoughtfulSupporter',
  
  // Harmonizer (6 combos) - Low Directness + Low Tangibility
  'physicalCloseness_type5': 'harmonizer',
  'supportiveActions_type4': 'harmonizer',
  'supportiveActions_type5': 'harmonizer',
  'sharedGrowth_type4': 'harmonizer',
  'sharedGrowth_type5': 'harmonizer',
  'thoughtfulGestures_type3': 'harmonizer',
  
  // Steady Helper (8 combos) - Mid Directness + High Tangibility
  'sharedGrowth_type1': 'steadyHelper',
  'sharedGrowth_type3': 'steadyHelper',
  'sharedGrowth_type8': 'steadyHelper',
  'supportiveActions_type1': 'steadyHelper',
  'supportiveActions_type3': 'steadyHelper',
  'qualityPresence_type3': 'steadyHelper',
  'verbalAffirmation_type3': 'steadyHelper',
  'physicalCloseness_type3': 'steadyHelper',
  
  // Strategic Partner (6 combos) - Mid Directness + Low Tangibility
  'thoughtfulGestures_type7': 'strategicPartner',
  'qualityPresence_type7': 'strategicPartner',
  'verbalAffirmation_type7': 'strategicPartner',
  'sharedGrowth_type7': 'strategicPartner',
  'physicalCloseness_type7': 'strategicPartner',
  'supportiveActions_type7': 'strategicPartner',
};

export function getSwipeType(connectionStyle: string, enneagramType: string): SwipeTypeName {
  const key = `${connectionStyle}_${enneagramType}`;
  return swipeTypeMapping[key] || 'directNurturer'; // fallback
}

export function getDisplayName(swipeType: SwipeTypeName): string {
  const names: Record<SwipeTypeName, string> = {
    directNurturer: 'Direct Nurturer',
    directPlanner: 'Direct Planner',
    clearCommunicator: 'Clear Communicator',
    gentleGiver: 'Gentle Giver',
    thoughtfulSupporter: 'Thoughtful Supporter',
    harmonizer: 'Harmonizer',
    steadyHelper: 'Steady Helper',
    strategicPartner: 'Strategic Partner',
  };
  return names[swipeType] || swipeType;
}

export function getTypeInfo(swipeType: SwipeTypeName): {
  typeNumber: number;
  typeName: string;
  directness: 'Low' | 'Mid' | 'High';
  tangibility: 'Low' | 'Mid' | 'High';
} {
  const typeInfo: Record<SwipeTypeName, {
    typeNumber: number;
    typeName: string;
    directness: 'Low' | 'Mid' | 'High';
    tangibility: 'Low' | 'Mid' | 'High';
  }> = {
    directNurturer: { typeNumber: 1, typeName: 'Direct Nurturer', directness: 'High', tangibility: 'High' },
    directPlanner: { typeNumber: 8, typeName: 'Direct Planner', directness: 'High', tangibility: 'Low' },
    clearCommunicator: { typeNumber: 3, typeName: 'Clear Communicator', directness: 'High', tangibility: 'Mid' },
    gentleGiver: { typeNumber: 4, typeName: 'Gentle Giver', directness: 'Low', tangibility: 'High' },
    thoughtfulSupporter: { typeNumber: 5, typeName: 'Thoughtful Supporter', directness: 'Low', tangibility: 'Mid' },
    harmonizer: { typeNumber: 6, typeName: 'Harmonizer', directness: 'Low', tangibility: 'Low' },
    steadyHelper: { typeNumber: 2, typeName: 'Steady Helper', directness: 'Mid', tangibility: 'High' },
    strategicPartner: { typeNumber: 7, typeName: 'Strategic Partner', directness: 'Mid', tangibility: 'Low' },
  };
  
  return typeInfo[swipeType] || {
    typeNumber: 1,
    typeName: 'Direct Nurturer',
    directness: 'High',
    tangibility: 'High'
  };
}
