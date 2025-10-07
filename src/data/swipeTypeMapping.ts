import { SwipeTypeName } from '../lib/types';

export const swipeTypeMapping: Record<string, SwipeTypeName> = {
  // Solid Rock (8 combos)
  'verbalAffirmation_type6': 'solidRock',
  'verbalAffirmation_type9': 'solidRock',
  'qualityPresence_type6': 'solidRock',
  'qualityPresence_type9': 'solidRock',
  'physicalCloseness_type9': 'solidRock',
  'supportiveActions_type6': 'solidRock',
  'supportiveActions_type9': 'solidRock',
  'physicalCloseness_type1': 'solidRock',
  
  // Watchful Guard (7 combos)
  'supportiveActions_type8': 'watchfulGuard',
  'physicalCloseness_type8': 'watchfulGuard',
  'physicalCloseness_type6': 'watchfulGuard',
  'verbalAffirmation_type8': 'watchfulGuard',
  'thoughtfulGestures_type8': 'watchfulGuard',
  'thoughtfulGestures_type9': 'watchfulGuard',
  'qualityPresence_type8': 'watchfulGuard',
  
  // Warm Heart (6 combos)
  'physicalCloseness_type2': 'warmHeart',
  'thoughtfulGestures_type2': 'warmHeart',
  'verbalAffirmation_type2': 'warmHeart',
  'supportiveActions_type2': 'warmHeart',
  'qualityPresence_type2': 'warmHeart',
  'sharedGrowth_type2': 'warmHeart',
  
  // Gentle Guide (6 combos)
  'verbalAffirmation_type1': 'gentleGuide',
  'qualityPresence_type1': 'gentleGuide',
  'thoughtfulGestures_type1': 'gentleGuide',
  'thoughtfulGestures_type6': 'gentleGuide',
  'thoughtfulGestures_type9': 'gentleGuide',
  
  // Deep Connector (7 combos)
  'qualityPresence_type4': 'deepConnector',
  'qualityPresence_type5': 'deepConnector',
  'verbalAffirmation_type4': 'deepConnector',
  'verbalAffirmation_type5': 'deepConnector',
  'physicalCloseness_type4': 'deepConnector',
  'thoughtfulGestures_type4': 'deepConnector',
  'thoughtfulGestures_type5': 'deepConnector',
  
  // Authentic Soul (6 combos)
  'physicalCloseness_type5': 'authenticSoul',
  'supportiveActions_type4': 'authenticSoul',
  'supportiveActions_type5': 'authenticSoul',
  'sharedGrowth_type4': 'authenticSoul',
  'sharedGrowth_type5': 'authenticSoul',
  'thoughtfulGestures_type3': 'authenticSoul',
  
  // Progress Partner (8 combos)
  'sharedGrowth_type1': 'progressPartner',
  'sharedGrowth_type3': 'progressPartner',
  'sharedGrowth_type8': 'progressPartner',
  'supportiveActions_type1': 'progressPartner',
  'supportiveActions_type3': 'progressPartner',
  'qualityPresence_type3': 'progressPartner',
  'verbalAffirmation_type3': 'progressPartner',
  'physicalCloseness_type3': 'progressPartner',
  
  // Free Spirit (6 combos)
  'thoughtfulGestures_type7': 'freeSpirit',
  'qualityPresence_type7': 'freeSpirit',
  'verbalAffirmation_type7': 'freeSpirit',
  'sharedGrowth_type7': 'freeSpirit',
  'physicalCloseness_type7': 'freeSpirit',
  'supportiveActions_type7': 'freeSpirit',
};

export function getSwipeType(connectionStyle: string, enneagramType: string): SwipeTypeName {
  const key = `${connectionStyle}_${enneagramType}`;
  return swipeTypeMapping[key] || 'solidRock'; // fallback
}

export function getDisplayName(swipeType: SwipeTypeName): string {
  const names: Record<SwipeTypeName, string> = {
    solidRock: 'Solid Rock',
    watchfulGuard: 'Watchful Guard',
    warmHeart: 'Warm Heart',
    gentleGuide: 'Gentle Guide',
    deepConnector: 'Deep Connector',
    authenticSoul: 'Authentic Soul',
    progressPartner: 'Progress Partner',
    freeSpirit: 'Free Spirit',
  };
  return names[swipeType] || swipeType;
}
