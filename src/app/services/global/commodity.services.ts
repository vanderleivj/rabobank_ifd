import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PagedResult } from 'src/app/models/common/pagedResult';
import { Commodity } from '../../models/global/commodity';
import { BASE_URL } from 'src/app/models/global/url';

@Injectable({
  providedIn: 'root'
})
export class CommodityService {

  constructor(private http: HttpClient)
  {}

  getAll(): Observable<PagedResult<Commodity[]>> {
    const apiUrl = `${BASE_URL}/commodity/?page=2&size=3`;
    return this.http.get<PagedResult<Commodity[]>>(apiUrl);
  }
}
