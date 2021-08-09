import { State } from '../global/state';
import { Company } from '../global/company';

export interface OthersGoodsRightsShareholding {
  id?: string;
  companyInfoId: string;
  companyInfo?: Company;
  equityCapitalValue: number;
  capitalPortion: number;
  fullParticipationValue: number;
  grossRevenue: number;
  sourceId: string;
  source?: State;
  isBRS?: boolean;
  isEditing?: boolean;
  bidId: string;
}


