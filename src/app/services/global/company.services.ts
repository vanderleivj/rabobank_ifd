import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from 'src/app/models/common/pagedResult';

import { Company } from 'src/app/models/global/company';
import { BASE_URL } from 'src/app/models/global/url';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: HttpClient) {}


  getAll(): Observable<PagedResult<Company[]>> {
    const apiUrl = `${BASE_URL}/company/?page=2&size=3`;
    return this.http.get<PagedResult<Company[]>>(apiUrl);
  }
}
