import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { OthersGoodRightsStock, StockType } from 'src/app/models/patrimony/others-goods-rights-stock';
import { State } from 'src/app/models/global/state';
import { City } from 'src/app/models/global/city';
import { Region } from 'src/app/models/global/region';

import { OthersGoodRightsStockService } from 'src/app/services/patrimony/others-goods-rights-stock.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { RegionService } from 'src/app/services/global/region.services';
import { StateService } from 'src/app/services/global/state.services';
import { CityService } from 'src/app/services/global/city.services';

@Component({
  selector: 'app-others-goods-rights-stock-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormOtherGoodsRightsStockComponent implements OnInit {
  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public isOwn = true;

  @Input()
  public othersGoodRightsStock?: OthersGoodRightsStock;

  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  stockForm = this.fb.group({});
  public regions: Region[] = [];
  public states: State[] = [];
  public cities: City[] = [];

  public stockTypeOptions = [{ value: 0, title: '' }];

  public precoAtualRBB = 209.8814;

  constructor(private fb: FormBuilder,
    private othersGoodRightsStockService: OthersGoodRightsStockService,
    private regionService: RegionService,
    private cityService: CityService,
    private stateService: StateService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private store: Store<{ bid: Bid }>,
  ) {
    this.loadStockTypes();
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.othersGoodRightsStock) {
      this.itemId = `_${this.othersGoodRightsStock?.id}`;
    }

    if (this.othersGoodRightsStock) {
      this.loadCities();
    }

    this.loadStates();
    this.loadRegions();
    this.createTableForm();

    this.stockForm.get(`totalValue${this.itemId}`)?.disable();

    this.formOnChange();
  }

  searchCity = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.cities.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  searchRegion = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.regions.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  formOnChange() {
    this.stockForm.get(`quantity${this.itemId}`)?.valueChanges.subscribe(val => {
      this.calculateTotal(val, undefined);
    });
    this.stockForm.get(`price${this.itemId}`)?.valueChanges.subscribe(val => {
      this.calculateTotal(undefined, val);
    });
  }

  calculateTotal(quantity?: number, price?: number) {
    let total = 0;

    if (quantity) {
      const quantityForm = this.stockForm.get(`price${this.itemId}`)?.value ?? 0;
      total = quantity * quantityForm;
    } else if (price) {
      const priceForm = this.stockForm.get(`quantity${this.itemId}`)?.value ?? 0;
      total = priceForm * price;
    }
    this.stockForm.get(`totalValue${this.itemId}`)?.setValue(total);
  }

  loadStockTypes() {
    this.stockTypeOptions = [
      {
        value: StockType.coffee,
        title: 'Café',
      },
      {
        value: StockType.soy,
        title: 'Soja',
      }
    ];
  }

  loadStates() {
    this.spinnerService.requestStarted();
    this.stateService.getAll()
      .subscribe((response) => {
        this.states = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadRegions() {
    this.spinnerService.requestStarted();
    this.regionService.getAll()
      .subscribe((response) => {
        this.regions = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.stockForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const city = this.stockForm.get(`cityId${this.itemId}`)?.value;

    if (!city || typeof city !== 'object') {
      this.toastr.error('Cidade inválida');
      return;
    }

    const region = this.stockForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const othersGoodRightsStock: OthersGoodRightsStock = {
      stockType: +this.stockForm.get(`stockType${this.itemId}`)?.value,
      quantity: +this.stockForm.get(`quantity${this.itemId}`)?.value,
      price: +this.stockForm.get(`price${this.itemId}`)?.value,
      totalValue: +this.stockForm.get(`totalValue${this.itemId}`)?.value,
      mode: +this.stockForm.get(`mode${this.itemId}`)?.value,
      observation: this.stockForm.get(`observation${this.itemId}`)?.value,
      stateId: this.stockForm.get(`stateId${this.itemId}`)?.value,
      regionId: region.id,
      cityId: city.id,
      bidId: this.bidId ?? '',
    };

    if (this.othersGoodRightsStock) {

      const othersGoodRightsStockId = this.othersGoodRightsStock?.id || '0';

      this.othersGoodRightsStockService.put(othersGoodRightsStockId, othersGoodRightsStock)
        .subscribe((response) => {
          if (response.code === 200) {
            this.stockForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.othersGoodRightsStockService.post(othersGoodRightsStock)
        .subscribe((response) => {
          if (response.code === 200) {
            this.stockForm.reset();
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

  loadCities() {
    this.spinnerService.requestStarted();
    this.cityService
      .getAll()
      .subscribe((response) => {
        this.cities = response.result;
        this.spinnerService.requestEnded();
      });
  }

  translateStockType(stockType: number) {
    return StockType[stockType];
  }

  createTableForm() {
    this.stockForm.addControl(`stockType${this.itemId}`, new FormControl(this.othersGoodRightsStock?.stockType, [Validators.required]));
    this.stockForm.addControl(`quantity${this.itemId}`, new FormControl(this.othersGoodRightsStock?.quantity, [Validators.required]));
    this.stockForm.addControl(`price${this.itemId}`, new FormControl(this.othersGoodRightsStock?.price, [Validators.required]));
    this.stockForm.addControl(`totalValue${this.itemId}`, new FormControl(this.othersGoodRightsStock?.totalValue, [Validators.required]));
    this.stockForm.addControl(`regionId${this.itemId}`, new FormControl(this.othersGoodRightsStock?.region, [Validators.required]));
    this.stockForm.addControl(`stateId${this.itemId}`, new FormControl(this.othersGoodRightsStock?.stateId, [Validators.required]));
    this.stockForm.addControl(`cityId${this.itemId}`, new FormControl(this.othersGoodRightsStock?.city, [Validators.required]));
    this.stockForm.addControl(`mode${this.itemId}`, new FormControl(this.othersGoodRightsStock?.mode, [Validators.required]));
    this.stockForm.addControl(`observation${this.itemId}`, new FormControl(this.othersGoodRightsStock?.observation, [Validators.required]));
  }
}
