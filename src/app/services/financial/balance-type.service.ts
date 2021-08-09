import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { balanceTypeUrl } from '../../models/global/url';
import { BalanceType } from 'src/app/models/financial/balance-type';

@Injectable({
  providedIn: 'root'
})
export class BalanceTypeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<BalanceType[]>> {
    return this.http.get<PagedResult<BalanceType[]>>(balanceTypeUrl);
  }
}
