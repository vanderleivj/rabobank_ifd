import { Region } from '../global/region';

export interface Production {
  id?: string;
  culture: string;
  regionId: string;
  region?: Region;
  harvests: Array<HarvestProduction>;
  bidId: string;
  isEditing?: boolean;
}

export interface HarvestProduction {
  period: number;

  area: number;
  areaChangeDate?: Date;
  areaChangedBy?: string;
  areaDefaultValue?: number;
  areaNewValue?: number;
  areaJustification?: string;

  price: number;
  priceChangeDate?: Date;
  priceChangedBy?: string;
  priceDefaultValue?: number;
  priceNewValue?: number;
  priceJustification?: string;

  productivity: number;
  productivityChangeDate?: Date;
  productivityChangedBy?: string;
  productivityDefaultValue?: number;
  productivityNewValue?: number;
  productivityJustification?: string;

  cost: number;
  costChangeDate?: Date;
  costChangedBy?: string;
  costDefaultValue?: number;
  costNewValue?: number;
  costJustification?: string;
}

export class ProductionChartValues {
  public value?: number;
  public date?: Date;
}
