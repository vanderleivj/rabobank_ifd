import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { Production, HarvestProduction } from 'src/app/models/financial/production';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { ProductionService } from 'src/app/services/financial/production.service';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { ProductionResume } from 'src/app/models/financial/production-resume';

@Component({
  selector: 'app-comercialization-production-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListCommercializationProductionComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  public quantity = 0;

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public bid$: Observable<Bid>;
  public productions: Production[] = [];
  public productionResume: ProductionResume[] = [];
  public list = [] = [
    {
      id: '',
      isEditing: true,
    }
  ];
  public currentDate?: number;
  private date?: Date;
  private bidId = '';
  constructor(
    private productionService: ProductionService,
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
    this.productionService
      .getAll(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.productions = response.result;
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);
        this.spinnerService.requestEnded();
      });

    this.spinnerService.requestStarted();
    this.productionService
      .getAllResume(this.bidId)
      .subscribe((response) => {
        this.productionResume = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    this.productions.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  cancelEdit(id: string) {
    this.productions.forEach(item => {
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
        switchMap(result => result ? this.productionService.delete(id) : EMPTY)
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


  getDate(date: number, index: number) {
    this.date = new Date(date);
    const realDate = this.date.getFullYear();
    this.currentDate = realDate - index;
    return `${this.currentDate} / ${realDate - (index + 1)}`;
  }
}
