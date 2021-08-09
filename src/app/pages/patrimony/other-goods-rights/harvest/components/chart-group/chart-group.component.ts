import { Component, OnInit } from '@angular/core';
import { OthersGoodRightsHarvestService } from 'src/app/services/patrimony/others-goods-rights-harvest.service';

@Component({
  selector: 'app-chart-group-harvest',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupHarvestComponent implements OnInit {

  totalAreaChartData = [0];
  totalAreaChartLabels = [''];

  totalBalanceChartData = [0];
  totalBalanceChartLabels = [''];

  constructor(
    private othersGoodRightsHarvestService: OthersGoodRightsHarvestService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.othersGoodRightsHarvestService
    .getTotalArea()
    .subscribe((totalArea) => {
      this.totalAreaChartData = totalArea.map((area) => area.value || 0);
      this.totalAreaChartLabels = totalArea.map((area) => area.date?.toLocaleString() || '');
    });

    this.othersGoodRightsHarvestService
    .getTotalBalance()
    .subscribe((totalBalance) => {
      this.totalBalanceChartData = totalBalance.map((balance) => balance.value || 0);
      this.totalBalanceChartLabels = totalBalance.map((balance) => balance.date?.toLocaleString() || '');
    });
  }

}
