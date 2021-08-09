import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { analyzeAccountTypeUrl } from '../../models/global/url';
import { AccountType } from 'src/app/models/financial/account-type';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeAccountTypeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<AccountType[]>> {
    return this.http.get<PagedResult<AccountType[]>>(analyzeAccountTypeUrl);
  }
}
