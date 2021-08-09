import { Component, Input, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-area-goods-rights',
  templateUrl: './area-goods-rights.component.html',
  styleUrls: ['./area-goods-rights.component.css']
})
export class AreaGoodsRightsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() titleQuantityChartValue = '';
  @Input() titleCashChartValue = '';

  @Input() soyQuantity = 779.009;
  @Input() soyCash = 0;

  @Input() coffeeQuantity = 478.119;
  @Input() coffeeCash = 0;

  @Input() othersQuantity = 133.992;
  @Input() othersCash = 0;

  @Input() chartId = '';

  chartQuantity: Chart = new Chart('', {});
  chartCash: Chart = new Chart('', {});

  constructor() { }


  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.soyQuantity
      || changes.coffeeQuantity
      || changes.othersQuantity
      || changes.soyCash
      || changes.coffeeCash
      || changes.othersCash) {
      this.renderChart();
    }
  }
  ngOnInit(): void {
    this.renderChart();
  }

  renderChart() {
    this.titleQuantityChartValue = `${(this.soyQuantity + this.coffeeQuantity + this.othersQuantity).toLocaleString().replace(',', '.')}`;
    this.titleCashChartValue = `${(this.soyCash + this.coffeeCash + this.othersCash).toLocaleString().replace(',', '.')}`;
    this.chartQuantity = new Chart(this.chartId, {
      type: 'doughnut',
      data: {
        labels: ['Soja em Grãos', 'Grão de café', 'Outros'],
        datasets: [{
          data: [this.soyQuantity, this.coffeeQuantity, this.othersQuantity],
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
    this.chartCash = new Chart(this.chartId, {
      type: 'doughnut',
      data: {
        labels: ['Soja em R$', 'Grão de R$', 'Outros em R$'],
        datasets: [{
          data: [this.soyCash, this.coffeeCash, this.othersCash],
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
          legend: true,
        }
      }
    });
  }
}
