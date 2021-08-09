import { Pipe, PipeTransform } from '@angular/core';
import { OthersGoodRightsStock } from 'src/app/models/patrimony/others-goods-rights-stock';


@Pipe({ name: 'filterByInput' })
export class FilterByInput implements PipeTransform {

  transform(stocks: OthersGoodRightsStock[], search: string) {
    search = search
      .trim()
      .toLowerCase();

    if(search) {
      return stocks.filter(stock =>
        stock.state.name.toLowerCase().includes(search)
      );
    } else {
      return stocks;
    }
  }

}
