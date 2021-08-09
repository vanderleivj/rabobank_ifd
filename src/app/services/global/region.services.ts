import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { BASE_URL } from '../../models/global/url';
import { Region } from 'src/app/models/global/region';

@Injectable({
  providedIn: 'root'
})
export class RegionService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<Region[]>> {
    const apiUrl = `${BASE_URL}/region/?page=2&size=3`;
    return this.http.get<PagedResult<Region[]>>(apiUrl);
  }
}
