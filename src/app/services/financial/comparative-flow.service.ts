import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';
import { Pagination } from 'src/app/models/common/pagination';
import { ComparativeFlow, ComparativeFlowChartValues  } from 'src/app/models/financial/comparative-flow';
import { urlWithQueryParams, comparativeFlow, comparativeFlowLineCharsValuesUrl } from '../../models/global/url';

@Injectable({
  providedIn: 'root'
})
export class ComparativeFlowService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string , pagination: Pagination, search: string): Observable<PagedResult<ComparativeFlow[]>> {
    return this.http.get<PagedResult<ComparativeFlow[]>>(urlWithQueryParams(comparativeFlow, pagination, search, bidId));
  }

  getChartValues(chartType: number): Observable<[ComparativeFlowChartValues]> {
    return this.http.get<[ComparativeFlowChartValues]>(`${comparativeFlowLineCharsValuesUrl}?chartType=${chartType}`);
  }
}
