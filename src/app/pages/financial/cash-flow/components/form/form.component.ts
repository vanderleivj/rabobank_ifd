import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { CashFlow } from 'src/app/models/financial/cash-flow';
import { AssetType } from 'src/app/models/financial/asset-type';

import { CashFlowService } from 'src/app/services/financial/cash-flow.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { AsseTypeService } from 'src/app/services/financial/asset-type.services';

@Component({
  selector: 'app-cash-flow-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormCashFlowComponent implements OnInit {
  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public cashFlow?: CashFlow;

  public itemId = '';
  cashFlowForm = this.fb.group({});
  public assetsType: AssetType[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private cashFlowService: CashFlowService,
    private assetTypeService: AsseTypeService,
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

    if (this.cashFlow) {
      this.itemId = `_${this.cashFlow?.id}`;
    }

    this.createTableForm();
    this.loadAssets();
  }

  searchAsset = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.assetsType.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  loadAssets() {
    this.spinnerService.requestStarted();
    this.assetTypeService
      .getAll()
      .subscribe((response) => {
        this.assetsType = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.cashFlowForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const asset = this.cashFlowForm.get(`asset${this.itemId}`)?.value;

    if (!asset || typeof asset !== 'object') {
      this.toastr.error('Projeção inválido');
      return;
    }

    const cashFlow: CashFlow = {
      assetId: asset.id,
      projections: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 1; i <= 6; i++) {
      cashFlow.projections.push({
        harvest: this.cashFlowForm.get(`projections${i}${this.itemId}`)?.value,
        value: +this.cashFlowForm.get(`projectionsValue${i}${this.itemId}`)?.value,
      });
    }

    if (this.cashFlow) {

      const itemId = this.cashFlow?.id || '0';

      this.cashFlowService.put(itemId, cashFlow)
        .subscribe((response) => {
          if (response.code === 200) {
            this.cashFlowForm.reset();
            this.loadData.emit();
          }
        });
    }
  }

  createTableForm() {
    this.cashFlowForm.addControl(`asset${this.itemId}`, new FormControl(this.cashFlow?.asset, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue1${this.itemId}`,
      new FormControl(this.cashFlow?.projections[0].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections1${this.itemId}`,
      new FormControl(this.cashFlow?.projections[0].harvest, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue2${this.itemId}`,
      new FormControl(this.cashFlow?.projections[1].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections2${this.itemId}`,
      new FormControl(this.cashFlow?.projections[1].harvest, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue3${this.itemId}`,
      new FormControl(this.cashFlow?.projections[2].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections3${this.itemId}`,
      new FormControl(this.cashFlow?.projections[2].harvest, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue4${this.itemId}`,
      new FormControl(this.cashFlow?.projections[3].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections4${this.itemId}`,
      new FormControl(this.cashFlow?.projections[3].harvest, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue5${this.itemId}`,
      new FormControl(this.cashFlow?.projections[4].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections5${this.itemId}`,
      new FormControl(this.cashFlow?.projections[4].harvest, [Validators.required]));

    this.cashFlowForm.addControl(`projectionsValue6${this.itemId}`,
      new FormControl(this.cashFlow?.projections[5].value, [Validators.required]));
    this.cashFlowForm.addControl(`projections6${this.itemId}`,
      new FormControl(this.cashFlow?.projections[5].harvest, [Validators.required]));
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
