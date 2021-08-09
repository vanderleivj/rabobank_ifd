import { City } from '../global/city';
import { Region } from '../global/region';
import { State } from '../global/state';
import { Distribution } from './distribution';
import { Mode } from './enum/mode';

export interface OthersGoodRightsStock {
  id?: string;
  stockType: StockType;
  quantity: number;
  price: number;
  totalValue: number;
  regionId: string;
  region?: Region;
  stateId?: string;
  state?: State;
  cityId?: string;
  city?: City;
  mode: Mode;
  observation: string;
  distributions?: Array<Distribution>;
  isEditing?: boolean;
  expanded?: boolean;
  bidId: string;
}

export enum StockType {
  coffee = 0,
  soy = 1,
}
