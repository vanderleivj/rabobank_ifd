import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { Bid } from 'src/app/models/bid/bid.model';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodsRightsSupplies } from 'src/app/models/patrimony/others-goods-rights-supplies';
import { OthersGoodsRightsSuppliesService } from 'src/app/services/patrimony/others-goods-rights-supplies.service';
import { Pagination } from 'src/app/models/common/pagination';
import { othersGoodsRightsSuppliesUrl } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';

@Component({
  selector: 'app-others-goods-rights-supplies-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public othersGoodSupplies: OthersGoodsRightsSupplies[] = [];
  public bidId = '';
  public bid$: Observable<Bid>;
  constructor(
    private othersGoodsRightsSuppliesService: OthersGoodsRightsSuppliesService,
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
    let url = `${othersGoodsRightsSuppliesUrl}`;

    if (this.downloadType.value === '1') {
      return;
    }
    if (this.downloadType.value === '2') {
      url = `${othersGoodsRightsSuppliesUrl}/pdf`;
    }
    if (this.downloadType.value === '3') {
      url = `${othersGoodsRightsSuppliesUrl}/excel?page=1&size=2`;
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
    this.othersGoodsRightsSuppliesService
      .getAll(this.pagination, this.search.value, this.bidId)
      .subscribe((response) => {
        this.othersGoodSupplies = response.result;
        this.pagination.count = response.count;
        this.spinnerService.requestEnded();
      });
  }

  loadAdd() {
    this.isOpen = true;
  }


  loadEdit(id: string) {
    this.othersGoodSupplies.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
        item.expanded = false;
      }
    });
  }

  expandListDetails(id: string) {
    this.othersGoodSupplies.forEach(item => {
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
        switchMap(result => result ? this.othersGoodsRightsSuppliesService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }
}
