import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { loadBid } from 'src/app/actions/bid.action';
import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { BidService } from 'src/app/services/bid/bid.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';

@Component({
  selector: 'app-bid-list',
  templateUrl: './list.component.html',
  styleUrls: []
})
export class ListBidComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public bids: Bid[] = [];
  public bid$: Observable<Bid>;
  constructor(
    private router: Router,
    private bidService: BidService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.loadData();
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
    this.bidService
      .getAll(this.pagination, this.search.value)
      .subscribe((response) => {
        this.bids = response.result;
        this.pagination.count = response.count;
        this.spinnerService.requestEnded();
      });
  }

  selectProposal(id: string) {
    this.bidService
      .getbid(id)
      .subscribe((item) => this.store.dispatch(loadBid(item)));
    this.router.navigate(['patrimonial/imoveis-rurais']);
  }
}
