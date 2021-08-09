import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';

import { CashFlow } from 'src/app/models/financial/cash-flow';
import {
  urlWithQueryParams,
  cashFlowCostUrl,
  cashFlowEbtidaUrl,
  cashFlowRevenueUrl,
  cashFlowUrl,
  cashFlowIndicatorUrl
} from 'src/app/models/global/url';
import { ActionResult } from 'src/app/models/common/actionResult';

@Injectable({
  providedIn: 'root'
})
export class CashFlowService {
  constructor(private http: HttpClient) { }

  getAllCost(bidId: string): Observable<PagedResult<CashFlow[]>> {
    return this.http.get<PagedResult<CashFlow[]>>(urlWithQueryParams(cashFlowCostUrl, undefined, undefined, bidId));
  }

  getAllEbtida(bidId: string): Observable<PagedResult<CashFlow[]>> {
    return this.http.get<PagedResult<CashFlow[]>>(urlWithQueryParams(cashFlowEbtidaUrl, undefined, undefined, bidId));
  }

  getAllRevenue(bidId: string): Observable<PagedResult<CashFlow[]>> {
    return this.http.get<PagedResult<CashFlow[]>>(urlWithQueryParams(cashFlowRevenueUrl, undefined, undefined, bidId));
  }

  getAllIndicator(bidId: string): Observable<PagedResult<CashFlow[]>> {
    return this.http.get<PagedResult<CashFlow[]>>(urlWithQueryParams(cashFlowIndicatorUrl, undefined, undefined, bidId));
  }

  put(id: string, data: CashFlow): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${cashFlowUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${cashFlowUrl}/${id}`);
  }
}
