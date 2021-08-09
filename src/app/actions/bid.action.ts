import { createAction } from '@ngrx/store';
import { Bid } from '../models/bid/bid.model';

export enum BidActionTypes {
  loadProperties = 'LOAD_PROPERTIES',
  loadBid = 'LOAD_BID',
};

export const loadBid = createAction(
  BidActionTypes.loadBid, (bid: Bid) => ({
    result: bid
  })
);
