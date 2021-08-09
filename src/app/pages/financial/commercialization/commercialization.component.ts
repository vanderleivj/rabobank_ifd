import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-commercialization',
  templateUrl: './commercialization.component.html',
  styleUrls: []
})
export class CommercializationComponent implements OnInit {

  public quantity = 0;
  public isProduction = true;
  public isCurrentHarvest = false;
  public isFinancialHarvest = false;
  public isNextHarvest = false;
  constructor() { }

  ngOnInit(): void {
  }

  onChangeType(event: any) {
    const value = event.target.value;
    if (value === '1') {
      this.isProduction = true;
      this.isCurrentHarvest = false;
      this.isFinancialHarvest = false;
      this.isNextHarvest = false;
    } else if (value === '2') {
      this.isProduction = false;
      this.isCurrentHarvest = true;
      this.isFinancialHarvest = false;
      this.isNextHarvest = false;
    } else if (value === '3') {
      this.isProduction = false;
      this.isCurrentHarvest = false;
      this.isFinancialHarvest = true;
      this.isNextHarvest = false;
    } else if (value === '4') {
      this.isProduction = false;
      this.isCurrentHarvest = false;
      this.isFinancialHarvest = false;
      this.isNextHarvest = true;
    }
  }

}
