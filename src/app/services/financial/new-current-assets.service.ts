import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { newCurrentHarvest, newCurrentHarvestAsset, newCurrentHarvestTotal, urlWithQueryParams } from '../../models/global/url';
import { Pagination } from 'src/app/models/common/pagination';
import { NewCurrentHarvest } from 'src/app/models/financial/new-current-assets';

@Injectable({
  providedIn: 'root'
})
export class NewCurrentHarvestService {
  constructor(private http: HttpClient) { }

  getAll(bidId: string, pagination: Pagination, search: string): Observable<PagedResult<NewCurrentHarvest[]>> {
    return this.http.get<PagedResult<NewCurrentHarvest[]>>(urlWithQueryParams(newCurrentHarvest, pagination, search, bidId));
  }

  getTotal(bidId: string): Observable<NewCurrentHarvest> {
    return this.http.get<NewCurrentHarvest>(urlWithQueryParams(newCurrentHarvestTotal, undefined, undefined, bidId));
  }

  getAsset(bidId: string): Observable<NewCurrentHarvest> {
    return this.http.get<NewCurrentHarvest>(urlWithQueryParams(newCurrentHarvestAsset, undefined, undefined, bidId));
  }

  post(data: NewCurrentHarvest): Observable<ActionResult> {
    return this.http.post<ActionResult>(newCurrentHarvest, data);
  }

  put(id: string, data: NewCurrentHarvest): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${newCurrentHarvest}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${newCurrentHarvest}/${id}`);
  }
}
