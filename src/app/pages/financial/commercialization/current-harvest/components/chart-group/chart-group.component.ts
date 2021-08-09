import { Component, OnInit } from '@angular/core';

import { HarvestService as CurrentHarvestService } from 'src/app/services/financial/harvest.service';

@Component({
  selector: 'app-chart-group-current-harvest',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupCurrentHarvestComponent implements OnInit {

  totalAreaValueChartData: number[] = [0];
  totalAreaValueChartLabels = [''];

  totalGrossRevenueChartData: number[] = [0];
  totalGrossRevenueChartLabels = [''];

  totalCostChartData: number[] = [0];
  totalCostChartLabels = [''];

  constructor(
    private currentHarvestService: CurrentHarvestService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.currentHarvestService
      .getChartValues(0)
      .subscribe((values) => {
        this.totalAreaValueChartData = values.map((value) => value.value || 0);
        this.totalAreaValueChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.currentHarvestService
      .getChartValues(1)
      .subscribe((values) => {
        this.totalGrossRevenueChartData = values.map((value) => value.value || 0);
        this.totalGrossRevenueChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.currentHarvestService
      .getChartValues(2)
      .subscribe((values) => {
        this.totalCostChartData = values.map((value) => value.value || 0);
        this.totalCostChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
  }

}
