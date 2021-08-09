import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { City } from '../../models/global/city';
import { PagedResult } from '../../models/common/pagedResult';
import { BASE_URL } from '../../models/global/url';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<City[]>> {
    const apiUrl = `${BASE_URL}/city/?page=2&size=3`;
    return this.http.get<PagedResult<City[]>>(apiUrl);
  }

  getByState(state: string): Observable<PagedResult<City[]>> {
    const apiUrl = `${BASE_URL}/city/${state}?page=2&size=3`;
    return this.http.get<PagedResult<City[]>>(apiUrl);
  }
}
