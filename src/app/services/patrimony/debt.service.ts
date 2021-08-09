import { debtsDebtPeriodUrl, debtsLongShortPeriod } from './../../models/global/url';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { debtsUrl, urlWithQueryParams } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { Debt } from 'src/app/models/patrimony/debt';
import { DebtPeriod } from 'src/app/models/patrimony/debtPeriod';
import { LongShortPeriod } from 'src/app/models/patrimony/long-short-period';

@Injectable({
  providedIn: 'root'
})
export class DebtService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<Debt[]>> {
    return this.http.get<PagedResult<Debt[]>>(urlWithQueryParams(debtsUrl, pagination, search, bidId));
  }

  post(data: Debt): Observable<ActionResult> {
    return this.http.post<ActionResult>(debtsUrl, data);
  }

  put(id: string, data: Debt): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${debtsUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${debtsUrl}/${id}`);
  }

  getDebtPeriod(period: number): Observable<[DebtPeriod]> {
    return this.http.get<[DebtPeriod]>(`${debtsDebtPeriodUrl}?period=${period}`);
  }

  getLongShortPeriod(bidId: string): Observable<LongShortPeriod> {
    return this.http.get<LongShortPeriod>(`${debtsLongShortPeriod}?bid_id=${bidId}`);
  }
}
