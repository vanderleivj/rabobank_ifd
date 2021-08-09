import { IndexType } from './index-type';
import { Projection } from './projection';

export interface Index {
  id: string;
  indexId: string;
  index: IndexType;
  bidId: string;
  projections: Array<Projection>;
}
