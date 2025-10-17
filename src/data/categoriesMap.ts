// File: src/data/categoriesMap.ts

export type ConnectionStyleKey =
  | 'verbalAffirmation'
  | 'qualityPresence'
  | 'physicalCloseness'
  | 'supportiveActions'
  | 'thoughtfulGestures'
  | 'sharedGrowth';

export type EnneagramTypeKey =
  | 'type1' | 'type2' | 'type3'
  | 'type4' | 'type5' | 'type6'
  | 'type7' | 'type8' | 'type9';

export const categoriesMap = {
  connectionStyles: {
    verbalAffirmation: [1, 2, 3, 4],
    qualityPresence: [5, 6, 7, 8, 52],
    physicalCloseness: [9, 10, 11, 12, 53],
    supportiveActions: [13, 14, 15, 16, 54],
    thoughtfulGestures: [17, 18, 19, 20],
    sharedGrowth: [21, 22, 23, 24]
  } as Record<ConnectionStyleKey, number[]>,

  enneagramTypes: {
    type1: [25, 26, 27, 55],
    type2: [28, 29, 30, 57],
    type3: [31, 32, 33],
    type4: [34, 35, 36],
    type5: [37, 38, 49],
    type6: [39, 40, 41],
    type7: [42, 43, 44, 56],
    type8: [45, 46, 50],
    type9: [47, 48, 51]
  } as Record<EnneagramTypeKey, number[]>
};

export type FrameworkKey = 'connection' | 'enneagram';

export const idToCategory = (() => {
  const map = new Map<number, { framework: FrameworkKey; key: string }>();
  (Object.entries(categoriesMap.connectionStyles) as Array<[ConnectionStyleKey, number[]]>).forEach(([k, ids]) => {
    ids.forEach(id => map.set(id, { framework: 'connection', key: k }));
  });
  (Object.entries(categoriesMap.enneagramTypes) as Array<[EnneagramTypeKey, number[]]>).forEach(([k, ids]) => {
    ids.forEach(id => map.set(id, { framework: 'enneagram', key: k }));
  });
  return map;
})();




