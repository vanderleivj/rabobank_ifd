import { Distribution } from './distribution';
export interface OthersGoodsRightsFinancial {
  id?: string;
  asset: string;
  totalAmount: number;
  discounts: number;
  discountsTotalAmount: number;
  features: string;
  distributions?: Array<Distribution>;
  isEditing?: boolean;
  expanded?: boolean;
  bidId: string;
};
