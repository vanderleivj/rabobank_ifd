import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { debtTypeUrl } from '../../models/global/url';
import { DebtType } from 'src/app/models/global/debtType';

@Injectable({
  providedIn: 'root'
})
export class DebtTypeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<DebtType[]>> {
    return this.http.get<PagedResult<DebtType[]>>(debtTypeUrl);
  }
}
