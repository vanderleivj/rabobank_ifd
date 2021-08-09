import { Injectable } from '@angular/core';
import { OthersGoodsRightsHarvest } from '../../models/patrimony/others-goods-rights-harvest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import {
  othersGoodsRightsHarvestUrl,
  othersGoodsRightsHarvestTotalAreaUrl,
  othersGoodsRightsHarvestTotalBalanceUrl,
  urlWithQueryParams,
} from '../../models/global/url';

import { OwnArea } from 'src/app/models/patrimony/ownArea'; //lembrar de modificar ou configurar para Area
import { RentedArea } from 'src/app/models/patrimony/rentedArea';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class OthersGoodRightsHarvestService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, search: string, bidId: string): Observable<PagedResult<OthersGoodsRightsHarvest[]>> {
    return this.http.get<PagedResult<OthersGoodsRightsHarvest[]>>(
      urlWithQueryParams(othersGoodsRightsHarvestUrl, pagination, search, bidId)
    );
  }

  post(data: OthersGoodsRightsHarvest): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${othersGoodsRightsHarvestUrl}?`, data);
  }

  put(id: string, data: OthersGoodsRightsHarvest): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${othersGoodsRightsHarvestUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${othersGoodsRightsHarvestUrl}/${id}`);
  }

  getTotalArea(): Observable<[OwnArea]> {
    return this.http.get<[OwnArea]>(`${othersGoodsRightsHarvestTotalAreaUrl}`);
  }

  getTotalBalance(): Observable<[RentedArea]> {
    return this.http.get<[RentedArea]>(`${othersGoodsRightsHarvestTotalBalanceUrl}`);
  }
}
