import { Injectable } from '@angular/core';
import { Bid } from '../../models/bid/bid.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { urlWithQueryParams, bidUrl } from '../../models/global/url';
import { PagedResult } from 'src/app/models/common/pagedResult';
import { Pagination } from 'src/app/models/common/pagination';

@Injectable({
  providedIn: 'root'
})
export class BidService {
  constructor(private http: HttpClient) {}

  getAll(pagination: Pagination, search: string): Observable<PagedResult<Bid[]>> {
    return this.http.get<PagedResult<Bid[]>>(urlWithQueryParams(bidUrl, pagination, search));
  }

  getbid(id: string): Observable<Bid> {
    const apiUrl = `${bidUrl}/${id}`;
    return this.http.get<Bid>(apiUrl);
  }
}
