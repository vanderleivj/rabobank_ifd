import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OthersGoodsRightsFinancial } from '../../models/patrimony/others-goods-rights-financial';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { othersGoodsRightsFinancialUrl, urlWithQueryParams, } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';


@Injectable({
  providedIn: 'root'
})
export class OthersGoodsRightsFinancialService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<OthersGoodsRightsFinancial[]>> {
    return this.http.get<PagedResult<OthersGoodsRightsFinancial[]>>(
      urlWithQueryParams(othersGoodsRightsFinancialUrl, pagination, search, bidId)
    );
  }

  post(data: OthersGoodsRightsFinancial): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${othersGoodsRightsFinancialUrl}?`, data);
  }

  put(id: string, data: OthersGoodsRightsFinancial): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${othersGoodsRightsFinancialUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${othersGoodsRightsFinancialUrl}/${id}`);
  }
}
