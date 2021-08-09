import { Component, OnInit } from '@angular/core';
import { LivestockType } from 'src/app/models/patrimony/livestock';
import { currencyFormat } from '../../../helpers/formatters';

import { LivestockService } from '../../../services/patrimony/livestock.service';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Bid } from 'src/app/models/bid/bid.model';
@Component({
  selector: 'app-livestock',
  templateUrl: './livestock.component.html',
  styleUrls: ['./livestock.component.css']
})
export class LivestockComponent implements OnInit {

  totalLiveStock = 7882279.03;

  totalValueCattle = 0;
  totalCattle = 0;

  totalValueCow = 0;
  totalCow = 0;

  totalValuePig = 0;
  totalPig = 0;

  totalValueChicken = 0;
  totalChicken = 0;

  colorCattle = { color: 'rgba(31, 37, 193, 0.607843137254902)' };
  colorCow = { color: '#FBAE54' };
  colorPigs = { color: '#EA79B1' };
  colorChickens = { color: '#00BFBF' };

  public bidId = '';
  public bid$: Observable<Bid>;

  constructor(
    private livestockService: LivestockService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  loadData() {

    this.livestockService
    .getTotalLiveStock(this.bidId)
    .subscribe((totalLivestock) => {
      this.totalLiveStock = totalLivestock.totalValue;
    });

    this.livestockService
    .getTotalLiveStock(this.bidId, LivestockType.cattle)
    .subscribe((totalLivestock) => {
      this.totalCattle = totalLivestock.totalQuantity;
      this.totalValueCattle = totalLivestock.totalValue;
    });

    this.livestockService
    .getTotalLiveStock(this.bidId, LivestockType.dairyCattle)
    .subscribe((totalLivestock) => {
      this.totalCow = totalLivestock.totalQuantity;
      this.totalValueCow = totalLivestock.totalValue;
    });

    this.livestockService
    .getTotalLiveStock(this.bidId, LivestockType.pigs)
    .subscribe((totalLivestock) => {
      this.totalPig = totalLivestock.totalQuantity;
      this.totalValuePig = totalLivestock.totalValue;
    });

    this.livestockService
    .getTotalLiveStock(this.bidId, LivestockType.chickens)
    .subscribe((totalLivestock) => {
      this.totalChicken = totalLivestock.totalQuantity;
      this.totalValueChicken = totalLivestock.totalValue;
    });
  }

  getTotalLiveStock() {
    return currencyFormat(this.totalLiveStock);
  }

}
