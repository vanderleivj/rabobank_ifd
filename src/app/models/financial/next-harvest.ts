import { City } from '../global/city';
import { Region } from '../global/region';
import { State } from '../global/state';

export interface NextHarvest {
  id?: string;
  culture: string;
  regionId: string;
  region?: Region;
  stateId: string;
  state?: State;
  cityId: string;
  city?: City;
  bidId: string;
  harvests: Array<Harvest>;
  isEditing?: boolean;
}

export interface Harvest {
  period: string;

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

export class NextHarvestChartValues {
  public value?: number;
  public date?: Date;
}
