import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { NewCurrentHarvest } from 'src/app/models/financial/new-current-assets';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { NewCurrentHarvestService } from 'src/app/services/financial/new-current-assets.service';

@Component({
  selector: 'app-current-assets-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListCurrentAssetsComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  public quantity = 0;

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public bid$: Observable<Bid>;
  public tableHeaders: string[] = [];
  public newCurrentHarvests: NewCurrentHarvest[] = [];
  public newCurrentHarvestsTotal: NewCurrentHarvest = {
    assetId: '',
    bidId: '',
    projections: [],
  };
  public newCurrentHarvestsAsset: NewCurrentHarvest = {
    assetId: '',
    bidId: '',
    projections: [],
  };
  private bidId = '';
  constructor(
    private newCurrentHarvestService: NewCurrentHarvestService,
    private alertService: AlertModalService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
    this.loadTotal();
    this.loadAsset();
  }

  getTotalAsset(newCurrentHarvestsAssetFlow: NewCurrentHarvest[], position: number): number {
    return newCurrentHarvestsAssetFlow.reduce((x, y) => x + y.projections[position]?.value, 0);
  }

  doDownload() {
    let url = downloadPdf;
    if (this.downloadType.value === '3') {
      url = downloadExcel;
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
    this.newCurrentHarvestService
      .getAll(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.newCurrentHarvests = response.result;
        this.tableHeaders = response.result[0]?.projections.map(p => p.harvest);
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);
        this.spinnerService.requestEnded();
      });
  }

  loadTotal() {
    this.spinnerService.requestStarted();
    this.newCurrentHarvestService
      .getTotal(this.bidId,)
      .subscribe((response) => {
        this.newCurrentHarvestsTotal = response;
        console.log(this.newCurrentHarvestsTotal);
        this.spinnerService.requestEnded();
      });
  }

  loadAsset() {
    this.spinnerService.requestStarted();
    this.newCurrentHarvestService
      .getAsset(this.bidId)
      .subscribe((response) => {
        this.newCurrentHarvestsAsset = response;
        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    this.newCurrentHarvests.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  cancelEdit(id: string) {
    this.newCurrentHarvests.forEach(item => {
      if (item.id === id) {
        item.isEditing = false;
      }
    });
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.newCurrentHarvestService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

  loadAdd() {
    this.isOpen = true;
  }
}
