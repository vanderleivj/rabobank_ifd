/* eslint-disable max-len */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bid } from 'src/app/models/bid/bid.model';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodsRightsSupplies } from 'src/app/models/patrimony/others-goods-rights-supplies';
import { OthersGoodsRightsSuppliesService } from 'src/app/services/patrimony/others-goods-rights-supplies.service';

@Component({
  selector: 'app-others-goods-rights-supplies-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormOthersGoodsRightsSuppliesComponent implements OnInit {
  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public othersGoodsRightsSupplies?: OthersGoodsRightsSupplies;

  public distribution = false;
  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  suppliesForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private othersGoodsRightsSuppliesService: OthersGoodsRightsSuppliesService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.othersGoodsRightsSupplies) {
      this.itemId = `_${this.othersGoodsRightsSupplies?.id}`;
    }
    this.createTableForm();
  }

  addOrEdit() {
    if (this.suppliesForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const othersGoodsRightsSupplies: OthersGoodsRightsSupplies = {
      supplies: this.suppliesForm.get(`supplies${this.itemId}`)?.value,
      totalAmount: +this.suppliesForm.get(`totalAmount${this.itemId}`)?.value,
      features: this.suppliesForm.get(`features${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };

    if (this.othersGoodsRightsSupplies) {
      const othersGoodRightsSuppliesId =
        this.othersGoodsRightsSupplies?.id || '0';

      this.othersGoodsRightsSuppliesService
        .put(othersGoodRightsSuppliesId, othersGoodsRightsSupplies)
        .subscribe((response) => {
          if (response.code === 200) {
            this.suppliesForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.othersGoodsRightsSuppliesService
        .post(othersGoodsRightsSupplies)
        .subscribe((response) => {
          if (response.code === 200) {
            this.suppliesForm.reset();
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.loadData.emit();
          }
        });
    }
  }

  expandListDetails() {
    this.distribution = !this.distribution;
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  createTableForm() {
    this.suppliesForm.addControl(
      `supplies${this.itemId}`,
      new FormControl(this.othersGoodsRightsSupplies?.supplies, [
        Validators.required,
      ])
    );
    this.suppliesForm.addControl(
      `totalAmount${this.itemId}`,
      new FormControl(this.othersGoodsRightsSupplies?.totalAmount, [
        Validators.required,
      ])
    );
    this.suppliesForm.addControl(
      `features${this.itemId}`,
      new FormControl(this.othersGoodsRightsSupplies?.features, [
        Validators.required,
      ])
    );
  }
}
