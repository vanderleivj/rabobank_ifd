import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import {
  productionUrl,
  urlWithQueryParams,
  productionLineCharsValuesUrl,
  productionResumeUrl
} from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { Production, ProductionChartValues } from 'src/app/models/financial/production';
import { ProductionResume } from 'src/app/models/financial/production-resume';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  constructor(private http: HttpClient) {}

  getAll(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<Production[]>> {
    return this.http.get<PagedResult<Production[]>>(urlWithQueryParams(productionUrl, pagination, search, bidId));
  }

  getAllResume(bidId: string): Observable<PagedResult<ProductionResume[]>> {
    return this.http.get<PagedResult<ProductionResume[]>>(urlWithQueryParams(productionResumeUrl, undefined, undefined, bidId));
  }

  post(data: Production): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${productionUrl}?`, data);
  }

  put(id: string, data: Production): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${productionUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${productionUrl}/${id}`);
  }

  getChartValues(chartType: number): Observable<[ProductionChartValues]> {
    return this.http.get<[ProductionChartValues]>(`${productionLineCharsValuesUrl}?chartType=${chartType}`);
  }
}
