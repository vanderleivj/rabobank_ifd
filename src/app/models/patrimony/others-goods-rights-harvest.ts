import { City } from '../global/city';
import { Region } from '../global/region';
import { State } from '../global/state';
import { Commodity } from '../global/commodity';

export interface OthersGoodsRightsHarvest {
  id?: string;
  commodityTypeId: string;
  commodityType: Commodity;
  harvest: string;
  cultivationArea: number;
  productionCost: number;
  occurredCost: number;
  balance: number;
  features: string;
  regionId: string;
  region?: Region;
  stateId: string;
  state?: State;
  cityId: string;
  city?: City;
  totalArea: number;
  isRBB: boolean;
  isEditing: boolean;
  expanded?: boolean;
  bidId: string;
};
