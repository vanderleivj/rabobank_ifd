import { Component, OnInit } from '@angular/core';

import { NextHarvestService } from 'src/app/services/financial/next-harvest.service';

@Component({
  selector: 'app-chart-group-next-harvest',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupNextHarvestComponent implements OnInit {

  totalRevenueChartData: number [] = [0];
  totalRevenueChartLabels = [''];

  totalCostChartData: number [] = [0];
  totalCostChartLabels = [''];

  totalLeaseChartData: number [] = [0];
  totalLeaseChartLabels = [''];

 ebtidaChartData: number [] = [0];
 ebtidaChartLabels = [''];


  constructor(
    private nextHarvestService: NextHarvestService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.nextHarvestService
      .getChartValues(0)
      .subscribe((values) => {
        this.totalRevenueChartData = values.map((value) => value.value || 0);
        this.totalRevenueChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.nextHarvestService
      .getChartValues(1)
      .subscribe((values) => {
        this.totalCostChartData = values.map((value) => value.value || 0);
        this.totalCostChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.nextHarvestService
      .getChartValues(2)
      .subscribe((values) => {
        this.totalLeaseChartData = values.map((value) => value.value || 0);
        this.totalLeaseChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.nextHarvestService
      .getChartValues(3)
      .subscribe((values) => {
        this.ebtidaChartData = values.map((value) => value.value || 0);
        this.ebtidaChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
  }


}
