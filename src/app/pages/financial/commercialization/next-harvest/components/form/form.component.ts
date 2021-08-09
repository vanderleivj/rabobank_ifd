import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Region } from 'src/app/models/global/region';
import { State } from 'src/app/models/global/state';
import { City } from 'src/app/models/global/city';
import { Harvest, NextHarvest } from 'src/app/models/financial/next-harvest';

import { RegionService } from 'src/app/services/global/region.services';
import { StateService } from 'src/app/services/global/state.services';
import { CityService } from 'src/app/services/global/city.services';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { ToastrService } from 'ngx-toastr';
import { NextHarvestService } from 'src/app/services/financial/next-harvest.service';

@Component({
  selector: 'app-commercialization-next-harvest-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCommercializationNextHarvestComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public nextHarvest?: NextHarvest;

  public itemId = '';
  nextHarvestForm = this.fb.group({});
  public regions: Region[] = [];
  public states: State[] = [];
  public cities: City[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private nextharvestService: NextHarvestService,
    private regionService: RegionService,
    private cityService: CityService,
    private stateService: StateService,
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

    if (this.nextHarvest) {
      this.itemId = `_${this.nextHarvest?.id}`;
    }

    this.loadStates();
    this.loadRegions();
    if (this.nextHarvest) {
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

  loadCities() {
    this.spinnerService.requestStarted();
    this.cityService
      .getAll()
      .subscribe((response) => {
        this.cities = response.result;
        this.spinnerService.requestEnded();
      });
  }

  addOrEdit() {
    if (this.nextHarvestForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const city = this.nextHarvestForm.get(`cityId${this.itemId}`)?.value;

    if (!city || typeof city !== 'object') {
      this.toastr.error('Cidade inválida');
      return;
    }

    const region = this.nextHarvestForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const nextHarvest: NextHarvest = {
      culture: this.nextHarvestForm.get(`culture${this.itemId}`)?.value,
      regionId: region.id,
      stateId: this.nextHarvestForm.get(`stateId${this.itemId}`)?.value,
      cityId: city.id,
      harvests: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 0; i <= 7; i++) {
      const harvest: Harvest = {
        period: this.nextHarvestForm.get(`period${i}${this.itemId}`)?.value,
        area: +this.nextHarvestForm.get(`area${i}${this.itemId}`)?.value,
        price: +this.nextHarvestForm.get(`price${i}${this.itemId}`)?.value,
        productivity: +this.nextHarvestForm.get(`productivity${i}${this.itemId}`)?.value,
        cost: +this.nextHarvestForm.get(`cost${i}${this.itemId}`)?.value,
      };

      nextHarvest.harvests.push(harvest);
    }

    if (this.nextHarvest) {

      const itemId = this.nextHarvest?.id || '0';

      this.nextharvestService.put(itemId, nextHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.nextHarvestForm.reset();
            this.loadData.emit();
          }
        });
    }
  }

  createTableForm() {
    this.nextHarvestForm.addControl(`culture${this.itemId}`, new FormControl(this.nextHarvest?.culture, [Validators.required]));
    this.nextHarvestForm.addControl(`regionId${this.itemId}`, new FormControl(this.nextHarvest?.region, [Validators.required]));
    this.nextHarvestForm.addControl(`stateId${this.itemId}`, new FormControl(this.nextHarvest?.stateId, [Validators.required]));
    this.nextHarvestForm.addControl(`cityId${this.itemId}`, new FormControl(this.nextHarvest?.city, [Validators.required]));

    this.nextHarvestForm.addControl(`period0${this.itemId}`, new FormControl(this.nextHarvest?.harvests[0]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period1${this.itemId}`, new FormControl(this.nextHarvest?.harvests[1]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period2${this.itemId}`, new FormControl(this.nextHarvest?.harvests[2]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period3${this.itemId}`, new FormControl(this.nextHarvest?.harvests[3]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period4${this.itemId}`, new FormControl(this.nextHarvest?.harvests[4]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period5${this.itemId}`, new FormControl(this.nextHarvest?.harvests[5]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period6${this.itemId}`, new FormControl(this.nextHarvest?.harvests[6]?.period, [Validators.required]));
    this.nextHarvestForm.addControl(`period7${this.itemId}`, new FormControl(this.nextHarvest?.harvests[7]?.period, [Validators.required]));

    this.nextHarvestForm.addControl(`area0${this.itemId}`, new FormControl(this.nextHarvest?.harvests[0]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area1${this.itemId}`, new FormControl(this.nextHarvest?.harvests[1]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area2${this.itemId}`, new FormControl(this.nextHarvest?.harvests[2]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area3${this.itemId}`, new FormControl(this.nextHarvest?.harvests[3]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area4${this.itemId}`, new FormControl(this.nextHarvest?.harvests[4]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area5${this.itemId}`, new FormControl(this.nextHarvest?.harvests[5]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area6${this.itemId}`, new FormControl(this.nextHarvest?.harvests[6]?.area, [Validators.required]));
    this.nextHarvestForm.addControl(`area7${this.itemId}`, new FormControl(this.nextHarvest?.harvests[7]?.area, [Validators.required]));

    this.nextHarvestForm.addControl(`price0${this.itemId}`, new FormControl(this.nextHarvest?.harvests[0]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price1${this.itemId}`, new FormControl(this.nextHarvest?.harvests[1]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price2${this.itemId}`, new FormControl(this.nextHarvest?.harvests[2]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price3${this.itemId}`, new FormControl(this.nextHarvest?.harvests[3]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price4${this.itemId}`, new FormControl(this.nextHarvest?.harvests[4]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price5${this.itemId}`, new FormControl(this.nextHarvest?.harvests[5]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price6${this.itemId}`, new FormControl(this.nextHarvest?.harvests[6]?.price, [Validators.required]));
    this.nextHarvestForm.addControl(`price7${this.itemId}`, new FormControl(this.nextHarvest?.harvests[7]?.price, [Validators.required]));

    this.nextHarvestForm.addControl(`productivity0${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[0]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity1${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[1]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity2${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[2]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity3${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[3]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity4${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[4]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity5${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[5]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity6${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[6]?.productivity, [Validators.required]));
    this.nextHarvestForm.addControl(`productivity7${this.itemId}`,
      new FormControl(this.nextHarvest?.harvests[7]?.productivity, [Validators.required]));

    this.nextHarvestForm.addControl(`cost0${this.itemId}`, new FormControl(this.nextHarvest?.harvests[0]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost1${this.itemId}`, new FormControl(this.nextHarvest?.harvests[1]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost2${this.itemId}`, new FormControl(this.nextHarvest?.harvests[2]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost3${this.itemId}`, new FormControl(this.nextHarvest?.harvests[3]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost4${this.itemId}`, new FormControl(this.nextHarvest?.harvests[4]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost5${this.itemId}`, new FormControl(this.nextHarvest?.harvests[5]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost6${this.itemId}`, new FormControl(this.nextHarvest?.harvests[6]?.cost, [Validators.required]));
    this.nextHarvestForm.addControl(`cost7${this.itemId}`, new FormControl(this.nextHarvest?.harvests[7]?.cost, [Validators.required]));
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
