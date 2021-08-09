import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { BASE_URL } from '../../models/global/url';
import { State } from 'src/app/models/global/state';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<State[]>> {
    const apiUrl = `${BASE_URL}/state/?page=2&size=3`;
    return this.http.get<PagedResult<State[]>>(apiUrl);
  }
}
