import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Balance } from 'src/app/models/financial/balance';
import { BalanceType } from 'src/app/models/financial/balance-type';

import { BalanceService } from 'src/app/services/financial/balance.service';
import { BalanceTypeService } from 'src/app/services/financial/balance-type.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';

@Component({
  selector: 'app-balance-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormBalanceComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public balance?: Balance;

  public itemId = '';
  balanceForm = this.fb.group({});
  public balanceType: BalanceType[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private balanceService: BalanceService,
    private balanceTypeService: BalanceTypeService,
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

    if (this.balance) {
      this.itemId = `_${this.balance?.id}`;
    }

    this.createTableForm();
    this.loadBalance();
  }

  searchBalance = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.balanceType.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  loadBalance() {
    this.spinnerService.requestStarted();
    this.balanceTypeService
      .getAll()
      .subscribe((response) => {
        this.balanceType = response.result;
        console.log(this.balanceType);
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.balanceForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const balance = this.balanceForm.get(`balance${this.itemId}`)?.value;

    if (!balance || typeof balance !== 'object') {
      this.toastr.error('Balanço inválido');
      return;
    }

    const data: Balance = {
      balanceId: balance.id,
      projections: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 0; i <= 5; i++) {
      data.projections.push({
        harvest: this.balanceForm.get(`projections${i}${this.itemId}`)?.value,
        value: +this.balanceForm.get(`projectionsValue${i}${this.itemId}`)?.value,
      });
    }
    console.log(data);

    if (this.balance) {

      const itemId = this.balance?.id || '0';

      this.balanceService.put(itemId, data)
        .subscribe((response) => {
          if (response.code === 200) {
            this.balanceForm.reset();
            this.loadData.emit();
          }
        });
    }
  }

  createTableForm() {
    this.balanceForm.addControl(`balance${this.itemId}`, new FormControl(this.balance?.balance, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue0${this.itemId}`,
      new FormControl(this.balance?.projections[0].value, [Validators.required]));
    this.balanceForm.addControl(`projections0${this.itemId}`,
      new FormControl(this.balance?.projections[0].harvest, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue1${this.itemId}`,
      new FormControl(this.balance?.projections[1].value, [Validators.required]));
    this.balanceForm.addControl(`projections1${this.itemId}`,
      new FormControl(this.balance?.projections[1].harvest, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue2${this.itemId}`,
      new FormControl(this.balance?.projections[2].value, [Validators.required]));
    this.balanceForm.addControl(`projections2${this.itemId}`,
      new FormControl(this.balance?.projections[2].harvest, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue3${this.itemId}`,
      new FormControl(this.balance?.projections[3].value, [Validators.required]));
    this.balanceForm.addControl(`projections3${this.itemId}`,
      new FormControl(this.balance?.projections[3].harvest, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue4${this.itemId}`,
      new FormControl(this.balance?.projections[4].value, [Validators.required]));
    this.balanceForm.addControl(`projections4${this.itemId}`,
      new FormControl(this.balance?.projections[4].harvest, [Validators.required]));

    this.balanceForm.addControl(`projectionsValue5${this.itemId}`,
      new FormControl(this.balance?.projections[5].value, [Validators.required]));
    this.balanceForm.addControl(`projections5${this.itemId}`,
      new FormControl(this.balance?.projections[5].harvest, [Validators.required]));
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

}
