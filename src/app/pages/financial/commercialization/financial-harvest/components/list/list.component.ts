import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { Harvest } from 'src/app/models/financial/harvest';
import { HarvestIndicator } from 'src/app/models/financial/harvest-indicator';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { HarvestService } from 'src/app/services/financial/harvest.service';

@Component({
  selector: 'app-commercialization-financial-harvest-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListComercializationFinancialHarvestComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  public quantity = 0;

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public bid$: Observable<Bid>;
  public financialHarvest: Harvest[] = [];
  public harvestIndicator: HarvestIndicator = {
    price: 0,
    quantity: 0,
    totalCost: 0,
    productivity: 0,
    cost: 0,
  };
  private bidId = '';
  constructor(
    private harvestService: HarvestService,
    private spinnerService: SpinnerService,
    private alertService: AlertModalService,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  loadIndicator(id: string) {
    this.spinnerService.requestStarted();
    this.harvestService.getIndicator(id)
      .subscribe((response) => {
        this.harvestIndicator = response;
        this.spinnerService.requestEnded();
      });
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
    this.harvestService
      .getAllNext(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.financialHarvest = response.result;
        console.log(this.financialHarvest);
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);
        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    this.financialHarvest.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
        this.loadIndicator(item.id);
      }
    });
  }

  cancelEdit(id: string) {
    this.financialHarvest.forEach(item => {
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
        switchMap(result => result ? this.harvestService.delete(id) : EMPTY)
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
