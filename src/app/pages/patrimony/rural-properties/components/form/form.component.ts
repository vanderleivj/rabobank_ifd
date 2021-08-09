import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { RuralPropertyService } from '../../../../../services/patrimony/rural-property.service';
import { CityService } from '../../../../../services/global/city.services';
import { RuralProperty } from '../../../../../models/patrimony/rural-property';
import { City } from 'src/app/models/global/city';
import { SpinnerService } from 'src/app/services/common/spinner.service';

@Component({
  selector: 'app-rural-properties-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormRuralPropertyComponent implements OnInit {


  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public isOwn = true;

  @Input()
  public ruralProperty?: RuralProperty;

  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  propertiesForm = this.fb.group({});
  public cities: City[] = [];
  constructor(private fb: FormBuilder,
    private ruralPropertyService: RuralPropertyService,
    private cityService: CityService,
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

    if (this.ruralProperty) {
      this.itemId = `_${this.ruralProperty?.id}`;
    }
    this.loadCities();
    this.createTableForm();

    this.propertiesForm.get(`totalValue${this.itemId}`)?.disable();
    this.formOnChange();
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.cities.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  formOnChange() {
    this.propertiesForm.get(`value${this.itemId}`)?.valueChanges.subscribe(val => {
      this.calculateTotal(val, undefined);
    });
    this.propertiesForm.get(`area${this.itemId}`)?.valueChanges.subscribe(val => {
      this.calculateTotal(undefined, val);
    });
  }

  calculateTotal(value?: number, area?: number) {
    let total = 0;

    if (value) {
      const areaForm = this.propertiesForm.get(`area${this.itemId}`)?.value ?? 0;
      total = value * areaForm;
    } else if (area) {
      const valueForm = this.propertiesForm.get(`value${this.itemId}`)?.value ?? 0;
      total = valueForm * area;
    }
    this.propertiesForm.get(`totalValue${this.itemId}`)?.setValue(total);
  }

  addOrEdit() {
    if (this.propertiesForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const city = this.propertiesForm.get(`cityId${this.itemId}`)?.value;

    if (!city || typeof city !== 'object') {
      this.toastr.error('Cidade inválido');
      return;
    }

    const property: RuralProperty = {
      registration: this.propertiesForm.get(`registration${this.itemId}`)?.value,
      farmName: this.propertiesForm.get(`farmName${this.itemId}`)?.value,
      cityId: city.id,
      portion: +this.propertiesForm.get(`portion${this.itemId}`)?.value,
      area: +this.propertiesForm.get(`area${this.itemId}`)?.value,
      value: +this.propertiesForm.get(`value${this.itemId}`)?.value,
      totalValue: +this.propertiesForm.get(`totalValue${this.itemId}`)?.value,
      type: this.isOwn ? '1' : '2',
      bidId: this.bidId ?? '',
    };

    if (this.ruralProperty) {

      const ruralPropertyId = this.ruralProperty?.id || '0';

      this.ruralPropertyService.put(ruralPropertyId, property)
        .subscribe((response) => {
          if (response.code === 200) {
            this.propertiesForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.ruralPropertyService.post(property)
        .subscribe((response) => {
          if (response.code === 200) {
            this.propertiesForm.reset();
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.loadData.emit();
          }
        });
    }
  }

  cancelAddOrEdit() {
    this.isOpenChange.emit(false);
  }

  loadCities() {
    this.spinnerService.requestStarted();
    this.cityService
      .getAll()
      .subscribe((response) => {
        this.cities = response.result;
        this.spinnerService.requestEnded();
      });
  }

  createTableForm() {
    this.propertiesForm.addControl(`registration${this.itemId}`, new FormControl(this.ruralProperty?.registration, [Validators.required]));
    this.propertiesForm.addControl(`farmName${this.itemId}`, new FormControl(this.ruralProperty?.farmName, [Validators.required]));
    this.propertiesForm.addControl(`cityId${this.itemId}`, new FormControl(this.ruralProperty?.city, [Validators.required]));
    this.propertiesForm.addControl(`portion${this.itemId}`, new FormControl(this.ruralProperty?.portion, [Validators.required]));
    this.propertiesForm.addControl(`area${this.itemId}`, new FormControl(this.ruralProperty?.area, [Validators.required]));
    this.propertiesForm.addControl(`value${this.itemId}`, new FormControl(this.ruralProperty?.value, [Validators.required]));
    this.propertiesForm.addControl(`totalValue${this.itemId}`, new FormControl(this.ruralProperty?.totalValue, [Validators.required]));
  }
}
