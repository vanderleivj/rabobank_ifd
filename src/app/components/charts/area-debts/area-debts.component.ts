import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-area-debts',
  templateUrl: './area-debts.component.html',
  styleUrls: ['./area-debts.component.css']
})
export class AreaDebtsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() titleChartValue = '';

  @Input() finame = 8227.278;
  @Input() bndes = 4771.987;
  @Input() others = 1776.228;

  @Input() chartId = '';

  chartAmount: Chart = new Chart('', {});

  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.finame
      || changes.bndes
      || changes.others) {
       this.renderChart();
    }
  }

  ngOnInit(): void {
    this.renderChart();
  }

  renderChart() {
    this.titleChartValue = `${(this.finame + this.bndes + this.others).toLocaleString().replace(',', '.')}`;
    this.chartAmount = new Chart(this.chartId, {
      type: 'doughnut',
      data: {
        labels: ['Finame', 'BNDES', 'Outros'],
        datasets: [{
          data: [this.finame, this.bndes, this.others],
          backgroundColor: [
            '#131BAA',
            '#ED9A0D',
            '#00BFBF'
          ],
          borderWidth: 0,
        }]
      },
      options: {
        cutoutPercentage: 75,
        plugins: {
          legend: false,
        }
      }
    });
  }
}
