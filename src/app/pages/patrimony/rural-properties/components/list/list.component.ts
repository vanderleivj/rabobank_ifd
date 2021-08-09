import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { RuralPropertyService } from '../../../../../services/patrimony/rural-property.service';
import { RuralProperty } from '../../../../../models/patrimony/rural-property';
import { BASE_URL } from 'src/app/models/global/url';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { Pagination } from 'src/app/models/common/pagination';
import { Bid } from 'src/app/models/bid/bid.model';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rural-properties-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListRuralPropertyComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public properties: RuralProperty[] = [];
  public isOwn = true;
  public ownProperties = 0;
  public notOwnProperties = 0;

  public bid$: Observable<Bid>;
  private bidId = '';

  constructor(
    private ruralPropertyService: RuralPropertyService,
    private spinnerService: SpinnerService,
    private alertService: AlertModalService,
    private http: HttpClient,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  doDownload() {
    let url = `${BASE_URL}/rural-properties/pdf`;
    if (this.downloadType.value === '3') {
      url = `${BASE_URL}/rural-properties/excel?tipo=${this.isOwn ? '1' : '2'}&page=2&size=3`;
    }
    window.open(url, '_blank');
    this.downloadType.setValue('0');
  }

  pageChanged(page: number) {
    this.pagination.page = page;
    this.loadData();
  }

  loadData() {
    const type = this.isOwn ? '1' : '2';
    this.spinnerService.requestStarted();
    //this.ruralPropertyService
      //.getAll(this.pagination, type, this.search.value, this.bidId)
      //.subscribe((response) => {
        //this.properties = response.result;
      //});
      this.http.get<any>(`https://apm-dev-br-ifd-poc.azure-api.net/rural-properties/?bid_id=1428&tipo=${type}`)
        .subscribe(data => {
        this.properties = data.result;
        this.ownProperties = data.additionalData.own;
        this.notOwnProperties = data.additionalData.notOwn;
        this.spinnerService.requestEnded();
      });
  }

  loadAdd() {
    this.isOpen = true;
  }

  loadEdit(id: string) {
    this.properties.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
        item.expanded = false;
      }
    });
  }

  expandListDetails(id: string) {
    this.properties.forEach(item => {
      if (item.id === id) {
        item.expanded = !item.expanded;
      }
    });
  }

  delete(id: string) {
      const result$ = this.alertService.showDelete();
      result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.ruralPropertyService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

  loadOwn() {
    this.isOwn = true;
    this.loadData();
  }

  loadNotOwn() {
    this.isOwn = false;
    this.loadData();
  }
}
