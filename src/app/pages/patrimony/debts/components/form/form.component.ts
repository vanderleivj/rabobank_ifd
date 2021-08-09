import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { Debt } from 'src/app/models/patrimony/debt';
import { DebtType } from 'src/app/models/global/debtType';
import { Bank } from 'src/app/models/global/bank';
import { DebtPurpose } from 'src/app/models/global/debtPurpose';
import { DebtService } from 'src/app/services/patrimony/debt.service';
import { DebtTypeService } from 'src/app/services/global/debtType.services';
import { BankService } from 'src/app/services/global/bank.services';
import { DebtPurposeService } from 'src/app/services/global/debtPurpose.services';
import { Bid } from 'src/app/models/bid/bid.model';
import { LongShortPeriod } from 'src/app/models/patrimony/long-short-period';

@Component({
  selector: 'app-debt-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormDebtComponent implements OnInit {
  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  public isOpen = true;

  @Input()
  public longShortPeriod: LongShortPeriod = { longPeriod: 0, shortPeriod: 0 };

  @Input()
  public debt?: Debt;

  public itemId = '';
  debtForm = this.fb.group({});
  public banks: Bank[] = [];
  public debtTypes: DebtType[] = [];
  public debtPurposes: DebtPurpose[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';
  constructor(private fb: FormBuilder,
    private debtService: DebtService,
    private bankService: BankService,
    private debtTypeService: DebtTypeService,
    private debtPurposeService: DebtPurposeService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>,
    private toastr: ToastrService,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.debt) {
      this.itemId = `_${this.debt?.id}`;
    }

    this.loadbanks();
    this.loadDebtTypes();
    this.loadDebtPurposes();
    this.createTableForm();
  }

  searchBank = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.banks.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchDebtType = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.debtTypes.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchDebtPurpose = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.debtPurposes.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  loadbanks() {
    this.spinnerService.requestStarted();
    this.bankService.getAll()
      .subscribe((response) => {
        this.banks = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadDebtTypes() {
    this.spinnerService.requestStarted();
    this.debtTypeService.getAll()
      .subscribe((response) => {
        this.debtTypes = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadDebtPurposes() {
    this.spinnerService.requestStarted();
    this.debtPurposeService.getAll()
      .subscribe((response) => {
        this.debtPurposes = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.debtForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const bank = this.debtForm.get(`bankId${this.itemId}`)?.value;

    if (!bank || typeof bank !== 'object') {
      this.toastr.error('Banco inválido');
      return;
    }

    const debtType = this.debtForm.get(`debtTypeId${this.itemId}`)?.value;

    if (!debtType || typeof debtType !== 'object') {
      this.toastr.error('Tipo debito inválido');
      return;
    }

    const debtPurpose = this.debtForm.get(`debtPurposeId${this.itemId}`)?.value;

    if (!debtPurpose || typeof debtPurpose !== 'object') {
      this.toastr.error('Proposito inválido');
      return;
    }

    const debt: Debt = {
      bankId: bank.id,
      debtTypeId: debtType.id,
      debtPurposeId: debtPurpose.id,
      description: this.debtForm.get(`description${this.itemId}`)?.value,
      instalment: +this.debtForm.get(`instalment${this.itemId}`)?.value,
      finalDate: this.debtForm.get(`finalDate${this.itemId}`)?.value,
      paymentMethod: +this.debtForm.get(`paymentMethod${this.itemId}`)?.value,
      interest: +this.debtForm.get(`interest${this.itemId}`)?.value,
      currency: +this.debtForm.get(`currency${this.itemId}`)?.value,
      totalValue: +this.debtForm.get(`totalValue${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };

    if (this.debt) {

      const debtId = this.debt?.id || '0';

      this.debtService.put(debtId, debt)
        .subscribe((response) => {
          if (response.code === 200) {
            this.debtForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.debtService.post(debt)
        .subscribe((response) => {
          if (response.code === 200) {
            this.debtForm.reset();
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.loadData.emit();
          }
        });
    }
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  createTableForm() {
    this.debtForm.addControl(`bankId${this.itemId}`, new FormControl(this.debt?.bank, [Validators.required]));
    this.debtForm.addControl(`debtTypeId${this.itemId}`, new FormControl(this.debt?.debtType, [Validators.required]));
    this.debtForm.addControl(`debtPurposeId${this.itemId}`, new FormControl(this.debt?.debtPurpose, [Validators.required]));
    this.debtForm.addControl(`description${this.itemId}`, new FormControl(this.debt?.description, [Validators.required]));
    this.debtForm.addControl(`instalment${this.itemId}`, new FormControl(this.debt?.instalment, [Validators.required]));
    this.debtForm.addControl(`finalDate${this.itemId}`, new FormControl(this.debt?.finalDate, [Validators.required]));
    this.debtForm.addControl(`paymentMethod${this.itemId}`, new FormControl(this.debt?.paymentMethod, [Validators.required]));
    this.debtForm.addControl(`interest${this.itemId}`, new FormControl(this.debt?.interest, [Validators.required]));
    this.debtForm.addControl(`currency${this.itemId}`, new FormControl(this.debt?.currency, [Validators.required]));
    this.debtForm.addControl(`totalValue${this.itemId}`, new FormControl(this.debt?.totalValue, [Validators.required]));
  }
}
