import { Distribution } from './distribution';

export interface OthersGoodsRightsSupplies {
  id?: string;
  supplies: string;
  totalAmount: number;
  features: string;
  distributions?: Array<Distribution>;
  isEditing?: boolean;
  expanded?: boolean;
  bidId: string;
}

