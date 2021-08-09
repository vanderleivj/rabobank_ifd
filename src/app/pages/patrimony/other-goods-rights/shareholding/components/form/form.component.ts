/* eslint-disable max-len */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { OthersGoodsRightsShareholding } from 'src/app/models/patrimony/others-goods-rights-shareholding';
import { State } from 'src/app/models/global/state';
import { Company } from 'src/app/models/global/company';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { OthersGoodsRightsShareholdingService } from 'src/app/services/patrimony/others-goods-rights-shareholding.service';
import { StateService } from 'src/app/services/global/state.services';
import { CompanyService } from 'src/app/services/global/company.services';

@Component({
  selector: 'app-others-goods-rights-shareholding-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormOthersGoodsRightsShareholdingComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public othersGoodsRightsShareholding?: OthersGoodsRightsShareholding;

  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  shareholdingForm = this.fb.group({});
  public states: State[] = [];
  public companies: Company[] = [];

  constructor(
    private fb: FormBuilder,
    private othersGoodsRightsShareholdingService: OthersGoodsRightsShareholdingService,
    private stateService: StateService,
    private companyService: CompanyService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private store: Store<{ bid: Bid }>,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.othersGoodsRightsShareholding) {
      this.itemId = `_${this.othersGoodsRightsShareholding?.id}`;
    }
    this.loadStates();
    this.loadCompanies();

    this.createTableForm();
  }

  searchCompany = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.companies.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  loadStates() {
    this.spinnerService.requestStarted();
    this.stateService.getAll()
      .subscribe((response) => {
        this.states = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadCompanies() {
    this.spinnerService.requestStarted();
    this.companyService.getAll()
      .subscribe((response) => {
        this.companies = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.shareholdingForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const company = this.shareholdingForm.get(`companyId${this.itemId}`)?.value;

    if (!company || typeof company !== 'object') {
      this.toastr.error('Empresa inválida');
      return;
    }

    const shareholdingData: OthersGoodsRightsShareholding = {
      companyInfoId: company.id,
      equityCapitalValue: +this.shareholdingForm.get(`equityCapitalValue${this.itemId}`)?.value,
      capitalPortion: +this.shareholdingForm.get(`capitalPortion${this.itemId}`)?.value,
      fullParticipationValue: +this.shareholdingForm.get(`fullParticipationValue${this.itemId}`)?.value,
      grossRevenue: +this.shareholdingForm.get(`grossRevenue${this.itemId}`)?.value,
      sourceId: this.shareholdingForm.get(`sourceId${this.itemId}`)?.value,
      source: this.shareholdingForm.get(`source${this.itemId}`)?.value,
      isBRS: this.shareholdingForm.get(`isBRS${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };

    if (this.othersGoodsRightsShareholding) {

      const shareholdingId = this.othersGoodsRightsShareholding?.id || '0';

      this.othersGoodsRightsShareholdingService.put(shareholdingId, shareholdingData)
        .subscribe((response) => {
          if (response.code === 200) {
            this.shareholdingForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.othersGoodsRightsShareholdingService.post(shareholdingData)
        .subscribe((response) => {
          if (response.code === 200) {
            this.shareholdingForm.reset();
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
    this.shareholdingForm.addControl(`companyId${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.companyInfo, [Validators.required]));
    this.shareholdingForm.addControl(`equityCapitalValue${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.equityCapitalValue, [Validators.required]));
    this.shareholdingForm.addControl(`capitalPortion${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.capitalPortion, [Validators.required]));
    this.shareholdingForm.addControl(`fullParticipationValue${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.fullParticipationValue, [Validators.required]));
    this.shareholdingForm.addControl(`grossRevenue${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.grossRevenue, [Validators.required]));
    this.shareholdingForm.addControl(`sourceId${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.sourceId, [Validators.required]));
    this.shareholdingForm.addControl(`isBRS${this.itemId}`, new FormControl(this.othersGoodsRightsShareholding?.isBRS, [Validators.required]));
  }

}
