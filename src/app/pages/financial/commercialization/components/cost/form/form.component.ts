import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Cost } from 'src/app/models/financial/cost';

@Component({
  selector: 'app-cost-form',
  templateUrl: './form.component.html',
  styleUrls: []
})
export class FormCostComponent implements OnInit {

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  addCost: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  editCost: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  public isOpen = true;

  @Input()
  public isAutomaticDistribution = '';

  @Input()
  public cost?: Cost;

  public itemId = '';
  costForm = this.fb.group({});

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.costForm) {
      this.itemId = `_${this.cost?.id}`;
    }
    this.createTableForm();
  }

  addOrEdit() {
    const cost: Cost = {
      period: this.costForm.get(`period${this.itemId}`)?.value,
      amount: this.costForm.get(`amount${this.itemId}`)?.value,
      isAutomaticDistribution: this.isAutomaticDistribution === '1' ? true : false,
    };
    if (this.cost?.id) {
      cost.id = this.cost.id;
      this.editCost.emit(cost);
    } else {
      this.addCost.emit(cost);
    }

    this.cancelAddOrEdit();
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  createTableForm() {
    this.costForm.addControl(`period${this.itemId}`, new FormControl(this.cost?.period, [Validators.required]));
    this.costForm.addControl(`amount${this.itemId}`, new FormControl(this.cost?.amount, [Validators.required]));
  }
}
