import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Bid } from 'src/app/models/bid/bid.model';
import { Store, select } from '@ngrx/store';
import { loadBid } from '../../actions/bid.action';
import { BidService } from 'src/app/services/bid/bid.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isImoveis = false;
  public isBensMoveisImoveis = false;
  public isClienteCollapsed = false;

  public currentProposal = 992;

  public bid$: Observable<Bid>;
  constructor(
    private router: Router,
    private store: Store<{ bid: Bid }>,
    private bidService: BidService) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
  }

  fetchBid(id: string) {
    this.bidService
      .getbid(id)
      .subscribe((item) => this.store.dispatch(loadBid(item)));
  }

  handleClienteCollapse() {
    this.isClienteCollapsed = !this.isClienteCollapsed;
  }

  previousProposal() {
    this.bid$.subscribe((bid) => {
      this.fetchBid(bid.previousProposalId ?? '');
    }).unsubscribe();
  }

  nextProposal() {
    this.bid$.subscribe((bid) => {
      this.fetchBid(bid.nextProposalId ?? '');
    }).unsubscribe();
  }

}
