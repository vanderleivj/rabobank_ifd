import { Injectable } from '@angular/core';
import { Livestock, LivestockType, TotalLivestock } from '../../models/patrimony/livestock';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { liveStockUrl, liveStockTotalUrl, urlWithQueryParams } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class LivestockService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<Livestock[]>> {
    return this.http.get<PagedResult<Livestock[]>>(urlWithQueryParams(liveStockUrl, pagination, search, bidId));
  }

  post(data: Livestock): Observable<ActionResult> {
    return this.http.post<ActionResult>(liveStockUrl, data);
  }

  put(id: string, data: Livestock): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${liveStockUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${liveStockUrl}/${id}`);
  }

  getTotalLiveStock(bidId: string, type?: LivestockType): Observable<TotalLivestock> {
    return this.http.get<TotalLivestock>(`${liveStockTotalUrl}?=${type}&bid_id=${bidId}`);
  }
}
