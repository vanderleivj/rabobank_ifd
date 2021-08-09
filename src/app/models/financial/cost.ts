export interface Cost {
  id?: string;
  period: string;
  amount: number;
  isAutomaticDistribution?: boolean;
  isEditing?: boolean;
}
