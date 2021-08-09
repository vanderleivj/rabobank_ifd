import { Component, Input, OnInit } from '@angular/core';
import { currencyFormat } from '../../../../../helpers/formatters';
@Component({
  selector: 'app-livestock-card',
  templateUrl: './livestock-card.component.html',
  styleUrls: ['./livestock-card.component.css']
})
export class LivestockCardComponent implements OnInit {

  @Input()
  title = '';

  @Input()
  imageFile = '';

  @Input()
  totalValue = 0;

  @Input()
  totalLivestock = 0;

  @Input()
  colorLivestock: any;

  constructor() { }

  ngOnInit(): void {
  }

  totalValueFormatted() {
    return currencyFormat(this.totalValue);
  }

}
