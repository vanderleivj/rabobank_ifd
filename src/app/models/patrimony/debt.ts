/* eslint-disable @typescript-eslint/naming-convention */
import { Bank } from '../global/bank';
import { DebtPurpose } from '../global/debtPurpose';
import { DebtType } from '../global/debtType';

export interface Debt {
  id?: string;
  bankId: string;
  bank?: Bank;
  debtTypeId: string;
  debtType?: DebtType;
  debtPurposeId: string;
  debtPurpose?: DebtPurpose;
  description: string;
  instalment: number;
  finalDate: Date;
  paymentMethod: PaymentMethod;
  interest: number;
  currency: Currency;
  totalValue: number;
  shortTerm?: number;
  longTerm?: number;
  isEditing?: boolean;
  bidId: string;
}

export enum PaymentMethod {
  method1 = 1,
  method2 = 2,
}

export enum Currency {
  R$ = 1,
  US$ = 2,
  EUR = 3,
}
