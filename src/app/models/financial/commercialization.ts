export interface Commercialization {
  id?: string;
  type: string;
  buyer: string;
  boardingDate: Date;
  quantity: number;
  price: number;
  amount: number;
  isEditing?: boolean;
}
