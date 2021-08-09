import { BalanceType } from './balance-type';
import { Projection } from './projection';

export interface Balance {
  id?: string;
  balanceId: string;
  balance?: BalanceType;
  control?: ControleEnum;
  bidId: string;
  projections: Array<Projection>;
  isEditingFixedLong?: boolean;
  isEditingFixedShort?: boolean;
  isEditingPassiveLong?: boolean;
  isEditingPassiveShort?: boolean;
  isEditingOthersPassive?: boolean;
}

export enum ControleEnum {
  fixedAssetLong = 1,
  fixedAssetShort = 2,
  passiveAssetLong = 3,
  passiveAssetShort = 4,
  othersPassive = 5,
}
