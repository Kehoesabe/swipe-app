export type RootStackParamList = {
  Landing: undefined;
  DirectInput: undefined;
  Assessment: undefined;
  Results: {
    result: {
      sessionId: string;
      swipeType: string;
      swipeTypeName: string;
      primaryConnection: string;
      primaryEnneagram: string;
      detailedCombo: string;
      method: 'assessment' | 'direct_input';
      calculatedAt: Date;
      scores?: {
        connectionStyles: Record<string, number>;
        enneagramTypes: Record<string, number>;
      };
    };
  };
  FullReport: {
    result: {
      sessionId: string;
      swipeType: string;
      swipeTypeName: string;
      primaryConnection: string;
      primaryEnneagram: string;
      detailedCombo: string;
      method: 'assessment' | 'direct_input';
      calculatedAt: Date;
      scores?: {
        connectionStyles: Record<string, number>;
        enneagramTypes: Record<string, number>;
      };
    };
  };
};
