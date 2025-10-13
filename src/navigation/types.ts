export type RootStackParamList = {
  Landing: undefined;
  DirectInput: undefined;
  Assessment: undefined;
  Results: {
    typeNumber: number;
    typeName: string;
    directness: 'Low' | 'Mid' | 'High';
    tangibility: 'Low' | 'Mid' | 'High';
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
  // Admin screens
  AdminDashboard: undefined;
  AdminPurchases: undefined;
  AdminPurchaseDetail: {
    purchaseId: string;
  };
};
