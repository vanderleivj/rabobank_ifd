import { Injectable } from '@angular/core';
import { OthersGoodRightsStock } from '../../models/patrimony/others-goods-rights-stock';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import {
  othersGoodsRightsStockUrl,
  othersGoodsRightsStockTotalQuantityUrl,
  othersGoodsRightsStockTotalAmountUrl,
  othersGoodsRightsStockSeedsUrl,
  urlWithQueryParams,
} from '../../models/global/url';
import { OwnArea } from 'src/app/models/patrimony/ownArea';
import { RentedArea } from 'src/app/models/patrimony/rentedArea';
import { Seeds } from 'src/app/models/patrimony/seeds';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class OthersGoodRightsStockService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<OthersGoodRightsStock[]>> {
    return this.http.get<PagedResult<OthersGoodRightsStock[]>>(urlWithQueryParams(othersGoodsRightsStockUrl, pagination, search, bidId));
  }

  post(data: OthersGoodRightsStock): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${othersGoodsRightsStockUrl}?`, data);
  }

  put(id: string, data: OthersGoodRightsStock): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${othersGoodsRightsStockUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${othersGoodsRightsStockUrl}/${id}`);
  }

  getSeeds(): Observable<[Seeds]> {
    return this.http.get<[Seeds]>(`${othersGoodsRightsStockSeedsUrl}`);
  }

  getTotalQuantity(): Observable<[OwnArea]> {
    return this.http.get<[OwnArea]>(`${othersGoodsRightsStockTotalQuantityUrl}`);
  }

  getTotalAmount(): Observable<[RentedArea]> {
    return this.http.get<[RentedArea]>(`${othersGoodsRightsStockTotalAmountUrl}`);
  }

}
