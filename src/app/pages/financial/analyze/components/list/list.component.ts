import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Pagination } from 'src/app/models/common/pagination';
import { Bid } from 'src/app/models/bid/bid.model';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { Analyze } from 'src/app/models/financial/analyze';
import { AnalyzeService } from 'src/app/services/financial/analyze.service';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';

@Component({
  selector: 'app-analyze-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListAnalyzeComponent implements OnInit {

  pagination = new Pagination();
  public analysis: Analyze[] = [];
  public tableHeaders: string[] = ['', '', '', '', '', '', ''];
  public isOpen = false;
  public bid$: Observable<Bid>;
  private bidId = '';

  constructor(
    private analyzeService: AnalyzeService,
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

  pageChanged(page: number) {
    this.pagination.page = page;
    this.loadData();
  }

  loadData() {
    this.spinnerService.requestStarted();
    this.analyzeService
      .getAll(this.bidId, this.pagination)
      .subscribe((response) => {
        this.analysis = response.result;
        this.tableHeaders = response.result[0]?.projections?.map(p => p.harvest);
        this.pagination.count = response.count;
        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    this.analysis.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.analyzeService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }
}
