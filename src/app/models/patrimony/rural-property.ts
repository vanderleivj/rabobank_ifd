import { City } from '../global/city';

export class RuralProperty {
  public id?= '';
  public registration = '';
  public farmName = '';
  public type?= '1';
  public portion = 0;
  public area = 0;
  public value = 0;
  public totalValue?: number = 0;
  public cityId = '';
  public city?: City = new City();
  public isEditing?: boolean = false;
  public expanded?: boolean = false;
  public observation?: string = 'Observações: Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
  public bidId = '';
}
