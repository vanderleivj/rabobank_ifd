import { createReducer, on } from '@ngrx/store';
import { loadBid } from '../actions/bid.action';

export const INITIAL_STATE = {

};

export const bidReducer = createReducer(
  INITIAL_STATE,
  on(loadBid, (state, action) => action.result)
);
