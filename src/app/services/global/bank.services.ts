import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { bankUrl } from '../../models/global/url';
import { Bank } from 'src/app/models/global/bank';

@Injectable({
  providedIn: 'root'
})
export class BankService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<Bank[]>> {
    return this.http.get<PagedResult<Bank[]>>(bankUrl);
  }
}
