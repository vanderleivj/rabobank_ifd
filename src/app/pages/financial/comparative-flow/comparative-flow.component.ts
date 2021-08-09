import { Component, OnInit } from '@angular/core';
import { Bid } from 'src/app/models/bid/bid.model';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-comparative-flow',
  templateUrl: './comparative-flow.component.html',
  styleUrls: []
})
export class ComparativeFlowComponent implements OnInit {

  public quantity = 0;
  public bid$: Observable<Bid>;

  constructor(
    private store: Store<{ bid: Bid }>,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
    });
  }
}
