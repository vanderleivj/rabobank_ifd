import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';
import { Index } from 'src/app/models/financial/index';

import { urlWithQueryParams, indexCashFlowUrl, indexBalanceUrl } from '../../models/global/url';


@Injectable({
  providedIn: 'root'
})
export class IndexService {
  constructor(private http: HttpClient) { }

  getAllIndexCashFlow(bidId: string): Observable<PagedResult<Index[]>> {
    return this.http.get<PagedResult<Index[]>>(urlWithQueryParams(indexCashFlowUrl, undefined, undefined, bidId));
  }

  getAllIndexBalance(bidId: string): Observable<PagedResult<Index[]>> {
    return this.http.get<PagedResult<Index[]>>(urlWithQueryParams(indexBalanceUrl, undefined, undefined, bidId));
  }
}
