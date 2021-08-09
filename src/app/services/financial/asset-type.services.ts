import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/common/pagedResult';
import { assetTypeUrl } from '../../models/global/url';
import { AssetType } from 'src/app/models/financial/asset-type';

@Injectable({
  providedIn: 'root'
})
export class AsseTypeService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PagedResult<AssetType[]>> {
    return this.http.get<PagedResult<AssetType[]>>(assetTypeUrl);
  }
}
