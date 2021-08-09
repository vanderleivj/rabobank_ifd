import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  titleChartValue = '';

  @Input()
  ownArea = 0;

  @Input()
  leseadArea = 0;

  @Input()
  chartId = '';

  chart: Chart = new Chart('', {});
  constructor() { }

  ngAfterViewInit(): void {
    this.renderChart();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownArea || changes.leseadArea) {
      this.renderChart();
    }
  }

  ngOnInit(): void {
  }

  renderChart() {
    this.titleChartValue = `${(this.ownArea + this.leseadArea).toLocaleString().replace(',', '.')}`;
    this.chart = new Chart(this.chartId, {
      type: 'doughnut',
      data: {
        labels: ['Area própria (ha)', 'Área arrendada (ha)'],
        datasets: [{
          data: [this.ownArea, this.leseadArea],
          backgroundColor: [
            '#131BAA',
            '#ED9A0D',
          ],
          borderWidth: 0,
        }]
      },
      options: {
        cutoutPercentage: 65,
        plugins: {
          legend: false,
        },
        // title: {
        //   display: true,
        //   text: `${this.dataChart.reduce((data1, data2) => data1 + data2)} (HA) Área Total`,
        // }
      },
    });
  }

  calcPercent(value: number) {
    if (value > 0) {
      return `${((value * 100) / (this.ownArea + this.leseadArea)).toFixed(2)}%`;
    }
    return '0%';
  }

}
