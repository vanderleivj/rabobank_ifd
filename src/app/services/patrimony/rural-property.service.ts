import { Injectable } from '@angular/core';
import { RuralProperty } from '../../models/patrimony/rural-property';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { ActionResult } from '../../models/common/actionResult';
import { Area } from '../../models/patrimony/area';
import { OwnArea } from '../../models/patrimony/ownArea';
import { RentedArea } from '../../models/patrimony/rentedArea';
import { Pagination } from 'src/app/models/common/pagination';
import { ruralPropertyUrl, ruralPropertyAreaUrl, ruralPropertyOwnAreaUrl, ruralPropertyRentedAreaUrl } from '../../models/global/url';

@Injectable({
  providedIn: 'root'
})
export class RuralPropertyService {
  constructor(private http: HttpClient) { }

  getAll(pagination: Pagination, type: string, search: string, bidId: string): Observable<PagedResult<RuralProperty[]>> {
    const apiUrl = `${ruralPropertyUrl}?search=${search}&tipo=${type}&page=${pagination.page}&size=${pagination.pageSize}&bid_id=${bidId}`;
    return this.http.get<PagedResult<RuralProperty[]>>(apiUrl);
  }

  post(data: RuralProperty): Observable<ActionResult> {
    return this.http.post<ActionResult>(`${ruralPropertyUrl}?`, data);
  }

  put(id: string, data: RuralProperty): Observable<ActionResult> {
    return this.http.put<ActionResult>(`${ruralPropertyUrl}/${id}`, data);
  }

  delete(id: string): Observable<ActionResult> {
    return this.http.delete<ActionResult>(`${ruralPropertyUrl}/${id}`);
  }

  getArea(bidId: string): Observable<Area> {
    return this.http.get<Area>(`${ruralPropertyAreaUrl}?bid_id=${bidId}`);
  }

  getOwnAreas(bidId: string): Observable<[OwnArea]> {
    return this.http.get<[OwnArea]>(`${ruralPropertyOwnAreaUrl}?bid_id=${bidId}`);
  }

  getRentedAreas(bidId: string): Observable<[RentedArea]> {
    return this.http.get<[RentedArea]>(`${ruralPropertyRentedAreaUrl}?bid_id=${bidId}`);
  }
}
