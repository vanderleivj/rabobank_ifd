import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Pagination } from 'src/app/models/common/pagination';
import { Bid } from 'src/app/models/bid/bid.model';
import { CashFlow } from 'src/app/models/financial/cash-flow';
import { Index } from 'src/app/models/financial/index';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { CashFlowService } from 'src/app/services/financial/cash-flow.service';
import { IndexService } from 'src/app/services/financial/index.service';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';

@Component({
  selector: 'app-cash-flow-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListCashFlowComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();

  public cashFlowCost: CashFlow[] = [];
  public cashFlowEbitda: CashFlow[] = [];
  public cashFlowRevenue: CashFlow[] = [];
  public cashFlowIndicator: CashFlow[] = [];
  public index: Index[] = [];
  public tableHeaders: string[] = [];
  public tableHeadersIndex: string[] = [];
  paginationCost = new Pagination();
  paginationEbitda = new Pagination();
  paginationRevenue = new Pagination();

  public isOpen = false;
  public isGrossRevenueOpen = false;
  public isTotalCostOpen = false;
  public isEbitdaOpen = false;

  public bid$: Observable<Bid>;
  private bidId = '';

  constructor(
    private cashFlowService: CashFlowService,
    private spinnerService: SpinnerService,
    private alertService: AlertModalService,
    private indexService: IndexService,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  getTotal(cashFlow: CashFlow[], position: number): number {
    return cashFlow.reduce((x, y) => x + y.projections[position]?.value, 0);
  }

  loadData() {
    this.spinnerService.requestStarted();
    this.cashFlowService
      .getAllCost(this.bidId)
      .subscribe((response) => {
        this.cashFlowCost = response.result;
        this.paginationCost.count = response.count;
        this.spinnerService.requestEnded();
      });

      this.spinnerService.requestStarted();
      this.cashFlowService
      .getAllEbtida(this.bidId)
      .subscribe((response) => {
        this.cashFlowEbitda = response.result;
        this.paginationEbitda.count = response.count;
        this.spinnerService.requestEnded();
      });

      this.spinnerService.requestStarted();
      this.cashFlowService
      .getAllRevenue(this.bidId)
      .subscribe((response) => {
        this.cashFlowRevenue = response.result;
        this.paginationRevenue.count = response.count;
        this.tableHeaders = response.result[0]?.projections.map(p => p.harvest);
        this.spinnerService.requestEnded();
      });

    this.spinnerService.requestStarted();
    this.cashFlowService
      .getAllIndicator(this.bidId)
      .subscribe((response) => {
        this.cashFlowIndicator = response.result;
        this.spinnerService.requestEnded();
      });

    this.spinnerService.requestStarted();
    this.indexService
      .getAllIndexCashFlow(this.bidId)
      .subscribe((response) => {
        this.index = response.result;
        this.tableHeadersIndex = response.result[0]?.projections.map(p => p.harvest);
        this.spinnerService.requestEnded();
      });
  }

  loadEditRevenue(id: string) {
    this.cashFlowRevenue.forEach(item => {
      if (item.id === id) {
        item.isEditingRevenue = true;
      }
    });
  }

  loadEditCost(id: string) {
    this.cashFlowCost.forEach(item => {
      if (item.id === id) {
        item.isEditingCost = true;
      }
    });
  }

  loadEditEbitda(id: string) {
    this.cashFlowEbitda.forEach(item => {
      if (item.id === id) {
        item.isEditingEbitda = true;
      }
    });
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.cashFlowService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

  showMore(type: number) {
    if (type === 0) {
      this.isGrossRevenueOpen = !this.isGrossRevenueOpen;
    } else if (type === 1) {
      this.isTotalCostOpen = !this.isTotalCostOpen;
    } else if (type === 2) {
      this.isEbitdaOpen = !this.isEbitdaOpen;
    } else {
      return;
    }
  }
}
