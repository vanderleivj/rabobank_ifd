import { AssetType } from './asset-type';
import { Projection } from './projection';

export interface NewCurrentHarvest {
  id?: string;
  assetId: string;
  asset?: AssetType;
  current?: number;
  bidId: string;
  projections: Array<Projection>;
  isEditing?: boolean;
}

/* export interface Projection {
  harvest: string;
  value?: number;
} */
