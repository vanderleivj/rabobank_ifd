import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { Bid } from 'src/app/models/bid/bid.model';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodRightsStock, StockType } from 'src/app/models/patrimony/others-goods-rights-stock';
import { OthersGoodRightsStockService } from 'src/app/services/patrimony/others-goods-rights-stock.service';
import { Mode } from 'src/app/models/patrimony/enum/mode';
import { Pagination } from 'src/app/models/common/pagination';
import { othersGoodsRightsStockUrl } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';

@Component({
  selector: 'app-others-goods-rights-stock-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListOtherGoodsRightsStockComponent implements OnInit {

  filter = '';
  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public othersGood: OthersGoodRightsStock[] = [];
  public bidId = '';
  public bid$: Observable<Bid>;
  constructor(
    private otherGoodsRightsService: OthersGoodRightsStockService,
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
    let url = `${othersGoodsRightsStockUrl}`;

    if (this.downloadType.value === '1') {
      return;
    }
    if (this.downloadType.value === '2') {
      url = `${othersGoodsRightsStockUrl}/pdf`;
    }
    if (this.downloadType.value === '3') {
      url = `${othersGoodsRightsStockUrl}/excel?page=1&size=2`;
    }
    window.open(url, '_blank');
    this.downloadType.setValue('0');
  }

  pageChanged(page: number) {
    this.pagination.page = page;
    this.loadData();
  };

  loadData() {
    this.spinnerService.requestStarted();
    this.otherGoodsRightsService
      .getAll(this.pagination, this.search.value, this.bidId)
      .subscribe((response) => {
        this.othersGood = response.result;
        console.log(this.othersGood);
        this.spinnerService.requestEnded();
      });
  }

  loadAdd() {
    this.isOpen = true;
  }

  translateMode(mode: number) {
    return Mode[mode];
  }

  loadEdit(id: string) {
    this.othersGood.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  translateStockType(stockType: number) {
    return StockType[stockType];
  }

  expandListDetails(id: string) {
    this.othersGood.forEach(item => {
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
        switchMap(result => result ? this.otherGoodsRightsService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

}
