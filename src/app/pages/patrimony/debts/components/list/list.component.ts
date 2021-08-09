import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { Currency, Debt } from 'src/app/models/patrimony/debt';
import { LongShortPeriod } from 'src/app/models/patrimony/long-short-period';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { DebtService } from 'src/app/services/patrimony/debt.service';

import { formatDate } from '@angular/common';

@Component({
  selector: 'app-debts-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListDebtComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  public quantity = 0;

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public debts: Debt[] = [];
  public bid$: Observable<Bid>;
  public longShortPeriod: LongShortPeriod = { longPeriod: 0, shortPeriod: 0 };
  private bidId = '';
  constructor(
    private debtService: DebtService,
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
    this.debtService
      .getAll(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.debts = response.result;
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);
        this.spinnerService.requestEnded();
      });

    this.debtService
      .getLongShortPeriod(this.bidId)
      .subscribe((response) => {
        this.longShortPeriod = response;
      });
  }

  loadEdit(id: string) {
    this.debts.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  cancelEdit(id: string) {
    this.debts.forEach(item => {
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
        switchMap(result => result ? this.debtService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

  translatePaymentMethod(method: number) {
    if (method === 1) {
      return 'Anual';
    }
    return 'Mensal';
  }

  trnslateCurrency(currency: number) {
    return Currency[currency];
  }

  loadAdd() {
    this.isOpen = true;
  }

  formatDate(date: Date): string {
    const format = 'dd/MM/yyyy';
    const locale = 'en-US';
    return formatDate(date, format, locale);
  }
}
