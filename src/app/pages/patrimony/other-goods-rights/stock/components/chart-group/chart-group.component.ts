import { Component, OnInit } from '@angular/core';
import { OthersGoodRightsStockService } from 'src/app/services/patrimony/others-goods-rights-stock.service';

@Component({
  selector: 'app-chart-group',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupComponent implements OnInit {

  totalQuantityChartData: number[] = [0];
  totalQuantityChartLabels = [''];

  totalAmountChartData = [0];
  totalAmountChartLabels = [''];

  coffeeQuantity = [0];
  soyQuantity = [0];
  othersQuantity = [0];

  constructor(
    private othersGoodRightsStockService: OthersGoodRightsStockService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.othersGoodRightsStockService
    .getTotalQuantity()
    .subscribe((totalQuantity) => {
      this.totalQuantityChartData = totalQuantity.map((quantity) => quantity.value || 0);
      this.totalQuantityChartLabels = totalQuantity.map((quantity) => quantity.date?.toLocaleString() || '');
    });

    this.othersGoodRightsStockService
    .getTotalAmount()
    .subscribe((totalAmount) => {
      this.totalAmountChartData = totalAmount.map((amount) => amount.value || 0);
      this.totalAmountChartLabels = totalAmount.map((amount) => amount.date?.toLocaleString() || '');
    });

    /* this.othersGoodRightsStockService
    .getSeeds()
    .subscribe((seeds) => {
      this.coffeeQuantity = seeds.map((seed) => seed.coffee || 0 )
      this.soyQuantity = seeds.map((seed) => seed.soy || 0 )
      this.othersQuantity = seeds.map((seed) => seed.others || 0 )
    }) */
  }

}
