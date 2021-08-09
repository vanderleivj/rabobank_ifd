import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { Balance, ControleEnum } from 'src/app/models/financial/balance';
import { Index } from 'src/app/models/financial/index';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { BalanceService } from 'src/app/services/financial/balance.service';
import { IndexService } from 'src/app/services/financial/index.service';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-balance-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListBalanceComponent implements OnInit {
  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();

  search = new FormControl('');
  pagination = new Pagination();

  public index: Index[] = [];
  public balance: Balance[] = [];
  public fixedLong: Balance[] = []; /* control === 1 */
  public fixedShort: Balance[] = []; /* control === 2 */
  public passiveLong: Balance[] = []; /* control === 3 */
  public passiveShort: Balance[] = []; /* control === 4 */
  public othersPassive: Balance[] = []; /* control === 5 */
  public tableHeadersIndex: string[] = [];

  /* public passiveLongLength = false;
  public passiveShortLength = false; */
  public isOpen = false;

  public bid$: Observable<Bid>;
  private bidId = '';

  constructor(
    public balanceService: BalanceService,
    private spinnerService: SpinnerService,
    private alertService: AlertModalService,
    private indexService: IndexService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
    /* if(this.passiveLong.length === 0) {
      this.passiveLongLength = true;
    }
    if(this.passiveShort.length === 0) {
      this.passiveShortLength = true;
    } */
  }

  getTotal(balance: Balance[], position: number): number {
    return +balance.reduce((x, y) => x + y.projections[position]?.value, 0);
  }
  getAllTotal(balance1: Balance[], balance2: Balance[], position: number): number {
    const total1 = balance1.reduce((x, y) => x + +y.projections[position]?.value, 0);
    const total2 = balance2.reduce((x, y) => x + +y.projections[position]?.value, 0);
    const resultado = total1 + total2;
    return +resultado;
  }

  loadData() {
    this.spinnerService.requestStarted();
    this.balanceService
      .getAll(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.balance = response.result;
        console.log(this.balance);
        this.fixedLong = this.balance.filter((x) => (x.control as ControleEnum)  === ControleEnum.fixedAssetLong);
        this.fixedShort = this.balance.filter((x) => (x.control as ControleEnum)  === ControleEnum.fixedAssetShort);
        this.passiveLong = this.balance.filter((x) => (x.control as ControleEnum)  === ControleEnum.passiveAssetLong);
        this.passiveShort = this.balance.filter((x) => (x.control as ControleEnum)  === ControleEnum.passiveAssetShort);
        this.othersPassive = this.balance.filter((x) => (x.control as ControleEnum)  === ControleEnum.othersPassive);
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);
        this.spinnerService.requestEnded();
      });
    this.spinnerService.requestStarted();
    this.indexService.getAllIndexBalance(this.bidId).subscribe((response) => {
      this.index = response.result;
      this.tableHeadersIndex = response.result[0]?.projections.map(
        (p) => p.harvest
      );
      this.pagination.count = response.count;
      this.quantityChange.emit(response.count);
      this.spinnerService.requestEnded();
    });
  }

  loadEdit(id: string, type: number) {
    this.balance.forEach((item) => {
      if (item.id === id) {
        if(type === 0) {
          item.isEditingFixedLong = true;
        } else if (type === 1) {
          item.isEditingFixedShort = true;
        } else if (type === 2) {
          item.isEditingPassiveLong = true;
        } else if (type === 3) {
          item.isEditingPassiveShort = true;
        } else if (type === 4) {
          item.isEditingOthersPassive = true;
        } else {
          return;
        }
      }
    });
  }

  loadAdd() {
    this.isOpen = true;
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.balanceService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }
}
