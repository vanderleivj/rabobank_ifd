import { Region } from '../global/region';
import { Commercialization } from './Commercialization';
import { Cost } from './cost';

export interface Harvest {
  id?: string;
  culture: string;
  regionId: string;
  region?: Region;
  area: number;
  price: number;
  productivity: number;
  cost: number;
  useassumptions?: boolean;
  costs?: Array<Cost>;
  commercializations?: Array<Commercialization>;
  bidId: string;
  harvestType?: HarvestType;
  isEditing?: boolean;
  isExpanded?: boolean;
}

export enum HarvestType {
  current = 1,
  toBeFinanced = 2,
}
