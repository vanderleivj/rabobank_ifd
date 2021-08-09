import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { OthersGoodsRightsSupplies } from '../../models/patrimony/others-goods-rights-supplies';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { othersGoodsRightsSuppliesUrl, urlWithQueryParams } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class OthersGoodsRightsSuppliesService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<OthersGoodsRightsSupplies[]>> {
    return this.http.get<PagedResult<OthersGoodsRightsSupplies[]>>(
      urlWithQueryParams(othersGoodsRightsSuppliesUrl, pagination, search, bidId)
    );
  }

  post(data: OthersGoodsRightsSupplies): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${othersGoodsRightsSuppliesUrl}?`, data);
  }

  put(id: string, data: OthersGoodsRightsSupplies): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${othersGoodsRightsSuppliesUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${othersGoodsRightsSuppliesUrl}/${id}`);
  }
}
