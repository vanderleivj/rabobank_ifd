import { Component, OnInit } from '@angular/core';

import { DebtService } from 'src/app/services/patrimony/debt.service';

@Component({
  selector: 'app-chart-group-debts',
  templateUrl: './chart-group.component.html',
  styleUrls: ['./chart-group.component.css']
})
export class ChartGroupDebtsComponent implements OnInit {

  allPeriodsChartData: number[] =[0];
  allPeriodsChartLabels = [''];

  shortPeriodChartData: number[] =[0];
  shortPeriodChartLabels = [''];

  longPeriodChartData: number[] =[0];
  longPeriodChartLabels = [''];

  constructor(
    private debtService: DebtService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.debtService
      .getDebtPeriod(0)
      .subscribe((values) => {
        this.allPeriodsChartData = values.map((value) => value.value || 0);
        this.allPeriodsChartLabels = values.map((value) => value.date?.toLocaleString() || '');
      });
      this.debtService
      .getDebtPeriod(1)
      .subscribe((values) => {
        this.shortPeriodChartData = values.map((value) => value.value || 0);
        this.shortPeriodChartLabels = values.map((value) => value.date?.toLocaleString() || '');
      });
      this.debtService
      .getDebtPeriod(2)
      .subscribe((values) => {
        this.longPeriodChartData = values.map((value) => value.value || 0);
        this.longPeriodChartLabels = values.map((value) => value.date?.toLocaleString() || '');
      });
  }



}
