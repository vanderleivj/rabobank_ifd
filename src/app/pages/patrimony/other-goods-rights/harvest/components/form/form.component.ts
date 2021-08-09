/* eslint-disable max-len */
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { OthersGoodsRightsHarvest } from 'src/app/models/patrimony/others-goods-rights-harvest';
import { State } from 'src/app/models/global/state';
import { Region } from 'src/app/models/global/region';
import { City } from 'src/app/models/global/city';
import { Commodity } from 'src/app/models/global/commodity';

import { OthersGoodRightsHarvestService } from 'src/app/services/patrimony/others-goods-rights-harvest.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { RegionService } from 'src/app/services/global/region.services';
import { StateService } from 'src/app/services/global/state.services';
import { CityService } from 'src/app/services/global/city.services';
import { CommodityService } from 'src/app/services/global/commodity.services';

@Component({
  selector: 'app-others-goods-rights-harvest-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormOthersGoodsRightsHarvestComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;
  @Input()
  public othersGoodsRightsHarvest?: OthersGoodsRightsHarvest;

  public itemId = '';
  public bid$: Observable<Bid>;
  public bidId = '';
  harvestForm = this.fb.group({});

  public regions: Region[] = [];
  public states: State[] = [];
  public cities: City[] = [];
  public commodities: Commodity[] = [];

  //public othersGoodsRightsHarvest: OthersGoodsRightsHarvest[] = [];

  constructor(
    private fb: FormBuilder,
    private othersGoodRightsHarvestService: OthersGoodRightsHarvestService,
    private spinnerService: SpinnerService,
    private regionService: RegionService,
    private stateService: StateService,
    private cityService: CityService,
    private commodityService: CommodityService,
    private toastr: ToastrService,
    private store: Store<{ bid: Bid }>,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.othersGoodsRightsHarvest) {
      this.itemId = `_${this.othersGoodsRightsHarvest?.id}`;
    }

    this.loadRegions();
    this.loadStates();
    this.loadCommodities();

    if (this.othersGoodsRightsHarvest) {
      this.loadCities();
    }

    this.createTableForm();
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

  loadRegions() {
    this.spinnerService.requestStarted();
    this.regionService.getAll()
      .subscribe((response) => {
        this.regions = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadStates() {
    this.spinnerService.requestStarted();
    this.stateService.getAll()
      .subscribe((response) => {
        this.states = response.result;
        this.spinnerService.requestEnded();
      });
  }

  loadCommodities() {
    this.spinnerService.requestStarted();
    this.commodityService.getAll()
      .subscribe((response) => {
        this.commodities = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.harvestForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const city = this.harvestForm.get(`cityId${this.itemId}`)?.value;

    if (!city || typeof city !== 'object') {
      this.toastr.error('Cidade inválida');
      return;
    }

    const region = this.harvestForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const othersGoodsRightsHarvest: OthersGoodsRightsHarvest = {
      commodityTypeId: this.harvestForm.get(`commodityTypeId${this.itemId}`)?.value,
      commodityType: this.harvestForm.get(`commodityType${this.itemId}`)?.value,
      harvest: this.harvestForm.get(`harvest${this.itemId}`)?.value,
      cultivationArea: +this.harvestForm.get(`cultivationArea${this.itemId}`)?.value,
      productionCost: +this.harvestForm.get(`productionCost${this.itemId}`)?.value,
      occurredCost: +this.harvestForm.get(`occurredCost${this.itemId}`)?.value,
      balance: +this.harvestForm.get(`balance${this.itemId}`)?.value,
      features: this.harvestForm.get(`features${this.itemId}`)?.value,
      regionId: region.id,
      stateId: this.harvestForm.get(`stateId${this.itemId}`)?.value,
      cityId: city.id,
      totalArea: +this.harvestForm.get(`totalArea${this.itemId}`)?.value,
      isRBB: this.harvestForm.get(`isRBB${this.itemId}`)?.value,
      isEditing: this.harvestForm.get(`isEditing${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };
    console.log(othersGoodsRightsHarvest);

    if (this.othersGoodsRightsHarvest) {

      const othersGoodsRightsHarvestId = this.othersGoodsRightsHarvest?.id || '0';

      this.othersGoodRightsHarvestService.put(othersGoodsRightsHarvestId, othersGoodsRightsHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.harvestForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.othersGoodRightsHarvestService.post(othersGoodsRightsHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.harvestForm.reset();
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
    const state = this.harvestForm.get(`stateId${this.itemId}`)?.value;
    this.spinnerService.requestStarted();
    this.cityService
      .getByState(state)
      .subscribe((response) => {
        this.cities = response.result;
        this.spinnerService.requestEnded();
      });
  }

  createTableForm() {
    this.harvestForm.addControl(`commodityTypeId${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.commodityTypeId, [Validators.required]));
    this.harvestForm.addControl(`harvest${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.harvest, [Validators.required]));
    this.harvestForm.addControl(`cultivationArea${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.cultivationArea, [Validators.required]));
    this.harvestForm.addControl(`productionCost${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.productionCost, [Validators.required]));
    this.harvestForm.addControl(`occurredCost${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.occurredCost, [Validators.required]));
    this.harvestForm.addControl(`balance${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.balance, [Validators.required]));
    this.harvestForm.addControl(`features${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.features, [Validators.required]));
    this.harvestForm.addControl(`regionId${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.region, [Validators.required]));
    this.harvestForm.addControl(`stateId${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.stateId, [Validators.required]));
    this.harvestForm.addControl(`cityId${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.city, [Validators.required]));
    this.harvestForm.addControl(`totalArea${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.totalArea, [Validators.required]));
    this.harvestForm.addControl(`isRBB${this.itemId}`, new FormControl(this.othersGoodsRightsHarvest?.isRBB, [Validators.required]));
  }

}
