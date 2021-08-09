import { AccountType } from './account-type';
import { Projection } from './projection';

export interface Analyze {
  id?: string;
  accountTypeId: string;
  accountType?: AccountType;
  bidId: string;
  projections: Array<Projection>;
  isEditing?: boolean;
}
