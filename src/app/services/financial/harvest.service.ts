import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { harvestUrl, urlWithQueryParams, financialHarvestCharsValuesUrl, harvestIndicatorUrl } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { Harvest } from 'src/app/models/financial/harvest';
import { FinancialHarvestChartValues } from 'src/app/models/financial/financial-harvest-chart-values';
import { HarvestIndicator } from 'src/app/models/financial/harvest-indicator';

@Injectable({
  providedIn: 'root'
})
export class HarvestService {
  constructor(private http: HttpClient) { }

  getAllCurrent(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<Harvest[]>> {
    return this.http.get<PagedResult<Harvest[]>>(`${urlWithQueryParams(harvestUrl, pagination, search, bidId)}&type=1`);
  }

  getAllNext(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<Harvest[]>> {
    return this.http.get<PagedResult<Harvest[]>>(`${urlWithQueryParams(harvestUrl, pagination, search, bidId)}&type=2`);
  }

  getIndicator(id: string): Observable<HarvestIndicator> {
    return this.http.get<HarvestIndicator>(`${harvestUrl}/${id}/${harvestIndicatorUrl}`);
  }

  post(data: Harvest): Observable<ActionResult> {
    return this.http.post<ActionResult>(harvestUrl, data);
  }

  put(id: string, data: Harvest): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${harvestUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${harvestUrl}/${id}`);
  }

  /* Financial and current chart are using these method. See if they will use them and how */
  getChartValues(chartType: number): Observable<[FinancialHarvestChartValues]> {
    return this.http.get<[FinancialHarvestChartValues]>(`${financialHarvestCharsValuesUrl}?chartType=${chartType}`);
  }
}
