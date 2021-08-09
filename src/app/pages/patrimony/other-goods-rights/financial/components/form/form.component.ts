/* eslint-disable max-len */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { OthersGoodsRightsFinancial } from 'src/app/models/patrimony/others-goods-rights-financial';
import { OthersGoodsRightsFinancialService } from 'src/app/services/patrimony/others-goods-rights-financial.service';
import { Bid } from 'src/app/models/bid/bid.model';

@Component({
  selector: 'app-others-goods-rights-financial-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormOthersGoodsRightsFinancialComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public othersGoodsRightsFinancial?: OthersGoodsRightsFinancial;

  public distribution = false;
  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  financialForm = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private othersGoodsRightsFinancialService: OthersGoodsRightsFinancialService,
    private store: Store<{ bid: Bid }>,
    private toastr: ToastrService,
    ) {
      this.bid$ = this.store.pipe(select('bid'));
    }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.othersGoodsRightsFinancial) {
      this.itemId = `_${this.othersGoodsRightsFinancial?.id}`;
    }
    this.createTableForm();
  }

  addOrEdit() {
    if (this.financialForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const financialData: OthersGoodsRightsFinancial = {
      asset: this.financialForm.get(`asset${this.itemId}`)?.value,
      totalAmount: +this.financialForm.get(`totalAmount${this.itemId}`)?.value,
      discounts: +this.financialForm.get(`discounts${this.itemId}`)?.value,
      discountsTotalAmount: +this.financialForm.get(`discountsTotalAmount${this.itemId}`)?.value,
      features: this.financialForm.get(`features${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };

    if (this.othersGoodsRightsFinancial) {

      const financialId = this.othersGoodsRightsFinancial?.id || '0';

      this.othersGoodsRightsFinancialService.put(financialId, financialData)
        .subscribe((response) => {
          if (response.code === 200) {
            this.financialForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.othersGoodsRightsFinancialService.post(financialData)
        .subscribe((response) => {
          if (response.code === 200) {
            this.financialForm.reset();
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
    this.financialForm.addControl(`asset${this.itemId}`, new FormControl(this.othersGoodsRightsFinancial?.asset, [Validators.required]));
    this.financialForm.addControl(`totalAmount${this.itemId}`, new FormControl(this.othersGoodsRightsFinancial?.totalAmount, [Validators.required]));
    this.financialForm.addControl(`discounts${this.itemId}`, new FormControl(this.othersGoodsRightsFinancial?.discounts, [Validators.required]));
    this.financialForm.addControl(`discountsTotalAmount${this.itemId}`, new FormControl(this.othersGoodsRightsFinancial?.discountsTotalAmount, [Validators.required]));
    this.financialForm.addControl(`features${this.itemId}`, new FormControl(this.othersGoodsRightsFinancial?.features, [Validators.required]));
  }

}
