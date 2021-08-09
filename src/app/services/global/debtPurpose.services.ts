import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { debtTypeUrl } from '../../models/global/url';
import { DebtPurpose } from 'src/app/models/global/debtPurpose';

@Injectable({
  providedIn: 'root'
})
export class DebtPurposeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<DebtPurpose[]>> {
    return this.http.get<PagedResult<DebtPurpose[]>>(debtTypeUrl);
  }
}
