import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { Bid } from 'src/app/models/bid/bid.model';
import { Analyze } from 'src/app/models/financial/analyze';
import { AccountType } from 'src/app/models/financial/account-type';

import { SpinnerService } from 'src/app/services/common/spinner.service';
import { AnalyzeService } from 'src/app/services/financial/analyze.service';
import { AnalyzeAccountTypeService } from 'src/app/services/financial/analyze-account-type.service';

@Component({
  selector: 'app-analyze-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormAnalyzeComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public analyze?: Analyze;

  public itemId = '';
  analyzeForm = this.fb.group({});
  public accountType: AccountType[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private analyzeService: AnalyzeService,
    private analyzeAccountTypeService: AnalyzeAccountTypeService,
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

    if(this.analyze) {
      this.itemId = `_${this.analyze?.id}`;
    }

    this.createTableForm();
    this.loadAnalyzeType();

    this.analyzeForm.get(`accountType${this.itemId}`)?.disable();
  }

  loadAnalyzeType() {
    this.spinnerService.requestStarted();
    this.analyzeAccountTypeService
      .getAll()
      .subscribe((response) => {
        this.accountType = response.result;
        this.spinnerService.requestEnded();
      });
  }
  addOrEdit() {
    if (this.analyzeForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const data: Analyze = {
      accountTypeId: this.analyzeForm.get(`accountType${this.itemId}`)?.value,
      projections: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 0; i <= 6; i++) {
      data.projections.push({
        harvest: this.analyzeForm.get(`projections${i}${this.itemId}`)?.value,
        value: +this.analyzeForm.get(`projectionsValue${i}${this.itemId}`)?.value,
      });
    }

    if (this.analyze) {

      const itemId = this.analyze?.id || '0';

      this.analyzeService.put(itemId, data)
        .subscribe((response) => {
          if (response.code === 200) {
            this.analyzeForm.reset();
            this.loadData.emit();
          }
        });
    }
  }

  createTableForm() {
    this.analyzeForm.addControl(`accountType${this.itemId}`, new FormControl(this.analyze?.accountType?.name, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue0${this.itemId}`,
      new FormControl(this.analyze?.projections[0].value, [Validators.required]));
    this.analyzeForm.addControl(`projections0${this.itemId}`,
      new FormControl(this.analyze?.projections[0].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue1${this.itemId}`,
      new FormControl(this.analyze?.projections[1].value, [Validators.required]));
    this.analyzeForm.addControl(`projections1${this.itemId}`,
      new FormControl(this.analyze?.projections[1].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue2${this.itemId}`,
      new FormControl(this.analyze?.projections[2].value, [Validators.required]));
    this.analyzeForm.addControl(`projections2${this.itemId}`,
      new FormControl(this.analyze?.projections[2].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue3${this.itemId}`,
      new FormControl(this.analyze?.projections[3].value, [Validators.required]));
    this.analyzeForm.addControl(`projections3${this.itemId}`,
      new FormControl(this.analyze?.projections[3].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue4${this.itemId}`,
      new FormControl(this.analyze?.projections[4].value, [Validators.required]));
    this.analyzeForm.addControl(`projections4${this.itemId}`,
      new FormControl(this.analyze?.projections[4].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue5${this.itemId}`,
      new FormControl(this.analyze?.projections[5].value, [Validators.required]));
    this.analyzeForm.addControl(`projections5${this.itemId}`,
      new FormControl(this.analyze?.projections[5].harvest, [Validators.required]));

    this.analyzeForm.addControl(`projectionsValue6${this.itemId}`,
      new FormControl(this.analyze?.projections[6].value, [Validators.required]));
    this.analyzeForm.addControl(`projections6${this.itemId}`,
      new FormControl(this.analyze?.projections[6].harvest, [Validators.required]));
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

}
