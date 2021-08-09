import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { nextHarvestUrl, urlWithQueryParams, nextHarvestLineCharsValuesUrl } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { NextHarvest, NextHarvestChartValues } from 'src/app/models/financial/next-harvest';

@Injectable({
  providedIn: 'root'
})
export class NextHarvestService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string , pagination: Pagination, search: string): Observable<PagedResult<NextHarvest[]>> {
    return this.http.get<PagedResult<NextHarvest[]>>(urlWithQueryParams(nextHarvestUrl, pagination, search, bidId));
  }

  post(data: NextHarvest): Observable<ActionResult> {
    return this.http.post<ActionResult>(nextHarvestUrl, data);
  }

  put(id: string, data: NextHarvest): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${nextHarvestUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${nextHarvestUrl}/${id}`);
  }

  getChartValues(chartType: number): Observable<[NextHarvestChartValues]> {
    return this.http.get<[NextHarvestChartValues]>(`${nextHarvestLineCharsValuesUrl}?chartType=${chartType}`);
  }
}
