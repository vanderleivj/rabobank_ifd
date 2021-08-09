import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-other-goods-rights',
  templateUrl: './other-goods-rights.component.html',
  styleUrls: ['./other-goods-rights.component.css']
})
export class OtherGoodsRightsComponent implements OnInit {

  public isStock = true;
  public isHarvest = false;
  public isSupplies = false;
  public isfinancialValue = false;
  public isShareholding = false;


  constructor() { }

  ngOnInit(): void {

  }

  onChangeType(event: any) {
    const value = event.target.value;
    //console.log(value)
    //console.log(event)
    if(value === 'estoques') {
      this.isStock = true;
      this.isHarvest = false;
      this.isSupplies = false;
      this.isfinancialValue = false;
      this.isShareholding = false;
    } else if (value === 'safraFormacao') {
      this.isStock = false;
      this.isHarvest = true;
      this.isSupplies = false;
      this.isfinancialValue = false;
      this.isShareholding = false;
    } else if (value === 'insumos') {
      this.isStock = false;
      this.isHarvest = false;
      this.isSupplies = true;
      this.isfinancialValue = false;
      this.isShareholding = false;
    } else if (value === 'valorFinanceiros') {
      this.isStock = false;
      this.isHarvest = false;
      this.isSupplies = false;
      this.isfinancialValue = true;
      this.isShareholding = false;
    } else if (value === 'participacaoAcionaria') {
      this.isStock = false;
      this.isHarvest = false;
      this.isSupplies = false;
      this.isfinancialValue = false;
      this.isShareholding = true;
    }


  }

}
