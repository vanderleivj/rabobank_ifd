import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PagedResult } from '../../models/common/pagedResult';

import { urlWithQueryParams, analyzeUrl } from 'src/app/models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { Analyze } from 'src/app/models/financial/analyze';
import { ActionResult } from 'src/app/models/common/actionResult';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string , pagination: Pagination): Observable<PagedResult<Analyze[]>> {
    return this.http.get<PagedResult<Analyze[]>>(urlWithQueryParams(analyzeUrl, pagination, undefined, bidId));
  }

  post(data: Analyze): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${analyzeUrl}?`, data);
  }

  put(id: string, data: Analyze): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${analyzeUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${analyzeUrl}/${id}`);
  }
}
