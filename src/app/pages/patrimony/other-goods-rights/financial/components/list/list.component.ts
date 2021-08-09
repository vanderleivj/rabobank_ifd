import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodsRightsFinancial } from 'src/app/models/patrimony/others-goods-rights-financial';
import { OthersGoodsRightsFinancialService } from 'src/app/services/patrimony/others-goods-rights-financial.service';
import { Pagination } from 'src/app/models/common/pagination';
import { othersGoodsRightsFinancialUrl } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { Bid } from 'src/app/models/bid/bid.model';

@Component({
  selector: 'app-others-goods-rights-financial-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListOthersGoodsRightsFinancialComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public othersGoodFinancial: OthersGoodsRightsFinancial[] = [];

  public bidId = '';
  public bid$: Observable<Bid>;
  constructor(
    private othersGoodsRightsFinancialService: OthersGoodsRightsFinancialService,
    private alertService: AlertModalService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  doDownload() {
    let url = `${othersGoodsRightsFinancialUrl}`;

    if (this.downloadType.value === '1') {
      return;
    }
    if (this.downloadType.value === '2') {
      url = `${othersGoodsRightsFinancialUrl}/pdf`;
    }
    if (this.downloadType.value === '3') {
      url = `${othersGoodsRightsFinancialUrl}/excel?page=1&size=2`;
    }
    window.open(url, '_blank');
    this.downloadType.setValue('0');
  }

  pageChanged(page: number) {
    this.pagination.page = page;
    this.loadData();
  }

  loadData() {
    this.spinnerService.requestStarted();
    this.othersGoodsRightsFinancialService
      .getAll(this.pagination, this.search.value, this.bidId)
      .subscribe((response) => {
        this.othersGoodFinancial = response.result;
        console.log(this.othersGoodFinancial);
        this.spinnerService.requestEnded();
      });
  }

  loadAdd() {
    this.isOpen = true;
  }

  loadEdit(id: string) {
    this.othersGoodFinancial.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
        item.expanded = false;
      }
    });
  }

  expandListDetails(id: string) {
    this.othersGoodFinancial.forEach(item => {
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
        switchMap(result => result ? this.othersGoodsRightsFinancialService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }
}
