import { Component, OnInit } from '@angular/core';

import { ComparativeFlowService } from 'src/app/services/financial/comparative-flow.service';

@Component({
  selector: 'app-chart-group-comparative-flow',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupComparativeFlowComponent implements OnInit {

  revenuesChartData: number [] = [0];
  revenuesChartLabels = [''];

  totalCostChartData: number [] = [0];
  totalCostChartLabels = [''];

  totalLeaseChartData: number [] = [0];
  totalLeaseChartLabels = [''];

  ebtidaChartData: number [] = [0];
  ebtidaChartLabels = [''];

  constructor(
    private comparativeFlowService: ComparativeFlowService,
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.comparativeFlowService
      .getChartValues(0)
      .subscribe((values) => {
        this.revenuesChartData = values.map((value) => value.value || 0);
        this.revenuesChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });

    this.comparativeFlowService
      .getChartValues(1)
      .subscribe((values) => {
        this.totalCostChartData = values.map((value) => value.value || 0);
        this.totalCostChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.comparativeFlowService
      .getChartValues(2)
      .subscribe((values) => {
        this.totalLeaseChartData = values.map((value) => value.value || 0);
        this.totalLeaseChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
    this.comparativeFlowService
      .getChartValues(3)
      .subscribe((values) => {
        this.ebtidaChartData = values.map((value) => value.value || 0);
        this.ebtidaChartLabels = values.map((value) => value.date?.toLocaleString() || '');
    });
  }
}
