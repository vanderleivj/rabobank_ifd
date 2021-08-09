import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OthersGoodsRightsShareholding } from '../../models/patrimony/others-goods-rights-shareholding';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { othersGoodsRightsShareholdingUrl, urlWithQueryParams } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class OthersGoodsRightsShareholdingService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<OthersGoodsRightsShareholding[]>> {
    return this.http.get<PagedResult<OthersGoodsRightsShareholding[]>>(
      urlWithQueryParams(othersGoodsRightsShareholdingUrl, pagination, search, bidId)
    );
  }

  post(data: OthersGoodsRightsShareholding): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${othersGoodsRightsShareholdingUrl}?`, data);
  }

  put(id: string, data: OthersGoodsRightsShareholding): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${othersGoodsRightsShareholdingUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${othersGoodsRightsShareholdingUrl}/${id}`);
  }
}
