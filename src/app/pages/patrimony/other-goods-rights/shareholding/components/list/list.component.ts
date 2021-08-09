import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { Bid } from 'src/app/models/bid/bid.model';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodsRightsShareholding } from 'src/app/models/patrimony/others-goods-rights-shareholding';
import { OthersGoodsRightsShareholdingService } from 'src/app/services/patrimony/others-goods-rights-shareholding.service';
import { Pagination } from 'src/app/models/common/pagination';
import { othersGoodsRightsShareholdingUrl } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';

@Component({
  selector: 'app-others-goods-rights-shareholding-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListShareholdingComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public isEditing = false;
  public othersGoodShareholding: OthersGoodsRightsShareholding[] = [];
  public bidId = '';
  public bid$: Observable<Bid>;
  constructor(
    private othersGoodsRightsShareholdingService: OthersGoodsRightsShareholdingService,
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
    let url = `${othersGoodsRightsShareholdingUrl}`;

    if (this.downloadType.value === '1') {
      return;
    }
    if (this.downloadType.value === '2') {
      url = `${othersGoodsRightsShareholdingUrl}/pdf`;
    }
    if (this.downloadType.value === '3') {
      url = `${othersGoodsRightsShareholdingUrl}/excel?page=1&size=2`;
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
    this.othersGoodsRightsShareholdingService
      .getAll(this.pagination, this.search.value, this.bidId)
      .subscribe((response) => {
        this.othersGoodShareholding = response.result;
        console.log(this.othersGoodShareholding);
        this.spinnerService.requestEnded();
      });
  }

  loadAdd() {
    this.isOpen = true;
  }

  loadEdit(id: string) {
    this.othersGoodShareholding.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
        /*  item.expanded = false; */
      }
    });
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.othersGoodsRightsShareholdingService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }
}
