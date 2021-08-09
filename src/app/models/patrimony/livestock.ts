import { City } from '../global/city';
import { Region } from '../global/region';
import { State } from '../global/state';
import { Mode } from './enum/mode';

export interface Livestock {
  id?: string;
  livestockType: LivestockType;
  herdType: HerdType;
  quantity: number;
  weightAverage: number;
  arrobaValue: number;
  unityValue: number;
  totalValue: number;
  description: string;
  regionId: string;
  region?: Region;
  stateId: string;
  state?: State;
  cityId: string;
  city?: City;
  unitValueMode: UnitValueMode;
  isHerdReadyCommercialization: boolean;
  commercializationDate?: Date;
  justification: string;
  herdMode: Mode;
  isEditing: boolean;
  expanded?: boolean;
  bidId: string;
}

export interface TotalLivestock {
  totalQuantity: number;
  totalValue: number;
}

export enum LivestockType {
  cattle = 1,
  chickens = 2,
  pigs = 3,
  dairyCattle = 4,
}

export enum HerdType {
  cow = 1,
  chicken = 2,
  pig = 3,
  cattle = 4,
}

export enum UnitValueMode {
  defined = 1,
  arrobaPrice = 2,
}

export const unitValueModeTranslated = {
  defined: 'Definido',
  arrobaPrice: 'Calc. base no preço ahoba'
};
