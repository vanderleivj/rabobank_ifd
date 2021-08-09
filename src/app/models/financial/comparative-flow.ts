export interface ComparativeFlow {
  id: string;
  harvestId: string;
  harvest: Harvest;
  values: Array<Values>;
  bidId: string;
  isEditing: boolean;
}

export interface Harvest {
  id: string;
  name: string;
  location: string;
  subLocation: string;
}

export interface Values {
  id: string;
  typeId: string;
  type: ValuesType;
  projected: number;
  reviewed: number;
  result: number; //projected - reviewed
}

export interface ValuesType {
  id: string;
  name: string;
}

export class ComparativeFlowChartValues {
  public value?: number;
  public date?: Date;
}

export class ComparativeFlowViewModel {
  type: ValuesType;
  values: Array<ValueViewModel>;

  constructor(type: ValuesType, values: Array<ValueViewModel>) {
    this.type = type;
    this.values = values;
  }
}

export class ValueViewModel {
  projected: number;
  reviewed: number;

  constructor(projected: number, reviewed: number) {
    this.projected = projected;
    this.reviewed = reviewed;
  }
}
