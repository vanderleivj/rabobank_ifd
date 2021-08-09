import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-line-chart-commercialization',
  templateUrl: './line-chart-commercialization.component.html',
  styleUrls: ['./line-chart-commercialization.component.css']
})
export class LineChartCommercializationComponent implements OnInit, AfterViewInit, OnChanges  {



  @Input()
  chartData: number[] = [];

  @Input()
  chartLabels = [''];

  @Input()
  chartTitle = '';

  @Input()
  chartId = '';

  @Input()
  lightColor = '';

  @Input()
  darkColor = '';

  lineChart: Chart = new Chart('', {});
  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chartData) {
      this.renderChart();
    }
  }

  ngAfterViewInit(): void {
    this.renderChart();
  }

  renderChart() {
    this.lineChart = new Chart(this.chartId, {
      type: 'line',
      data: {
        labels: this.chartLabels,
        datasets: [{
          data: this.chartData,
          borderColor: this.darkColor,
          fill: true,
          backgroundColor: this.lightColor
        }]
      },
      options: {
        responsive: true,
        elements: {
          line: {
            tension: 0
          }
        },
        plugins: {
          legend: false,
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }],
        }
      },
    });
  }

  ngOnInit(): void {
  }



  totalValues(): string {
    let value = 0;
    if (this.chartData.length === 1) {
      value = this.chartData[0];
    } else if (this.chartData.length > 1) {
      value = this.chartData.reduce((x1, x2) => x1 + x2);
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }

}
