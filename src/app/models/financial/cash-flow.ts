import { AssetType } from './asset-type';
import { Projection } from './projection';

export interface CashFlow {
  id?: string;
  assetId: string;
  asset?: AssetType;
  bidId: string;
  isTotal?: boolean;
  projections: Array<Projection>;
  isEditingCost?: boolean;
  isEditingEbitda?: boolean;
  isEditingRevenue?: boolean;
}
