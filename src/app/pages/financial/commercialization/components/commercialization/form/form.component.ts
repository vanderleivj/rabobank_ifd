import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Commercialization } from 'src/app/models/financial/Commercialization';

@Component({
  selector: 'app-commercialization-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormCommercializationComponent implements OnInit {

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  addCommercialization: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  editCommercialization: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public isOpen = true;

  @Input()
  public commercialization?: Commercialization;

  public itemId = '';
  public isExpanded?= false;
  public isCostExpanded?= false;
  commercializationForm = this.fb.group({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.commercialization) {
      this.itemId = `_${this.commercialization?.id}`;
    }
    this.createTableForm();
  }


  addOrEdit() {
    const commercialization: Commercialization = {
      type: this.commercializationForm.get(`type${this.itemId}`)?.value,
      buyer: this.commercializationForm.get(`buyer${this.itemId}`)?.value,
      boardingDate: this.commercializationForm.get(`boardingDate${this.itemId}`)?.value,
      quantity: +this.commercializationForm.get(`quantity${this.itemId}`)?.value,
      price: +this.commercializationForm.get(`price${this.itemId}`)?.value,
      amount: +this.commercializationForm.get(`amount${this.itemId}`)?.value,
    };
    if (this.commercialization?.id) {
      commercialization.id = this.commercialization.id;
      this.editCommercialization.emit(commercialization);
    } else {
      this.addCommercialization.emit(commercialization);
    }

    this.cancelAddOrEdit();
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  createTableForm() {
    this.commercializationForm.addControl(`type${this.itemId}`, new FormControl(this.commercialization?.type, [Validators.required]));
    this.commercializationForm.addControl(`buyer${this.itemId}`, new FormControl(this.commercialization?.buyer, [Validators.required]));
    this.commercializationForm.addControl(`boardingDate${this.itemId}`,
      new FormControl(this.commercialization?.boardingDate, [Validators.required]));
    this.commercializationForm.addControl(`quantity${this.itemId}`,
      new FormControl(this.commercialization?.quantity, [Validators.required]));
    this.commercializationForm.addControl(`price${this.itemId}`, new FormControl(this.commercialization?.price, [Validators.required]));
    this.commercializationForm.addControl(`amount${this.itemId}`, new FormControl(this.commercialization?.amount, [Validators.required]));
  }
}
