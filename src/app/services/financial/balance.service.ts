import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { Pagination } from 'src/app/models/common/pagination';
import { Balance } from 'src/app/models/financial/balance';

import { urlWithQueryParams, balanceCashFlowUrl, balanceUrl } from '../../models/global/url';


@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<Balance[]>> {
    return this.http.get<PagedResult<Balance[]>>(urlWithQueryParams(balanceCashFlowUrl, pagination, search, bidId));
  }

  post(data: Balance): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${balanceCashFlowUrl}?`, data);
  }

  put(id: string, data: Balance): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${balanceUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${balanceCashFlowUrl}/${id}`);
  }
}
