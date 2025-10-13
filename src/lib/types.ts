export type ConnectionStyle = 
  | 'verbalAffirmation'
  | 'qualityPresence'
  | 'physicalCloseness'
  | 'supportiveActions'
  | 'thoughtfulGestures'
  | 'sharedGrowth';

export type EnneagramType = 
  | 'type1' | 'type2' | 'type3' | 'type4' | 'type5'
  | 'type6' | 'type7' | 'type8' | 'type9';

export type SwipeTypeName = 
  | 'directNurturer' | 'directPlanner' | 'clearCommunicator' | 'gentleGiver'
  | 'thoughtfulSupporter' | 'harmonizer' | 'steadyHelper' | 'strategicPartner';

export interface AssessmentResult {
  sessionId: string;
  swipeType: SwipeTypeName;
  swipeTypeName: string; // Display name
  primaryConnection: ConnectionStyle;
  primaryEnneagram: EnneagramType;
  detailedCombo: string;
  method: 'assessment' | 'direct_input';
  calculatedAt: Date;
}

export interface Question {
  id: number;
  text: string;
  framework: 'connection' | 'enneagram';
  category: string;
  reverse: boolean;
}

export interface ReportSection {
  introduction: string;
  howYouLove: string;
  whatYouNeed: string;
  yourStrengths: string;
  growthOpportunities: string;
  inConflict: string;
  adviceForPartners: string;
}

