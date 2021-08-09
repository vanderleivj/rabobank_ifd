import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';

import { City } from 'src/app/models/global/city';
import { State } from 'src/app/models/global/state';
import {
  HerdType,
  Livestock,
  LivestockType,
  UnitValueMode,
} from 'src/app/models/patrimony/livestock';
import { Mode } from 'src/app/models/patrimony/enum/mode';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { CityService } from 'src/app/services/global/city.services';
import { LivestockService } from 'src/app/services/patrimony/livestock.service';
import { Region } from 'src/app/models/global/region';
import { RegionService } from 'src/app/services/global/region.services';
import { StateService } from 'src/app/services/global/state.services';

import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Bid } from 'src/app/models/bid/bid.model';
@Component({
  selector: 'app-livestock-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormLiveStockComponent implements OnInit {
  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  public isOpen = true;

  @Input()
  public livestock?: Livestock;

  public itemId = '';
  public isHerdReadyCommercialization?= false;
  livestockForm = this.fb.group({});
  public cities: City[] = [];
  public states: State[] = [];
  public regions: Region[] = [];

  public livestockTypeOptions = [{ value: 0, title: '' }];
  public livestockHerdOptions = [{ value: 0, title: '' }];

  public bidId = '';
  public bid$: Observable<Bid>;

  public precoAtualRBB = 209.8814;

  constructor(
    private fb: FormBuilder,
    private livestockService: LivestockService,
    private cityService: CityService,
    private regionService: RegionService,
    private stateService: StateService,
    private spinnerService: SpinnerService,
    private toastr: ToastrService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
    this.loadRegions();
    this.loadLivestockTypes();
    this.loadLivestockHerd();
  }

  ngOnInit(): void {
    if (this.livestock) {
      this.itemId = `_${this.livestock?.id}`;
      this.isHerdReadyCommercialization = this.livestock?.isHerdReadyCommercialization;
    }

    this.loadStates();

    if (this.livestock) {
      this.loadCities();
    }

    this.createTableForm();

    this.livestockForm.get(`totalValue${this.itemId}`)?.disable();

    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });
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

  loadLivestockHerd() {
    this.livestockHerdOptions = [
      {
        value: HerdType.cattle,
        title: 'Gado',
      },
      {
        value: HerdType.chicken,
        title: 'Galinha',
      },
      {
        value: HerdType.cow,
        title: 'Vaca',
      },
      {
        value: HerdType.pig,
        title: 'Porco',
      },
    ];
  }

  loadLivestockTypes() {
    this.livestockTypeOptions = [
      {
        value: LivestockType.cattle,
        title: 'Gado Bovino',
      },
      {
        value: LivestockType.chickens,
        title: 'Aves',
      },
      {
        value: LivestockType.dairyCattle,
        title: 'Gado Leiteiro',
      },
      {
        value: LivestockType.pigs,
        title: 'Porcos',
      },
    ];
  }

  loadStates() {
    this.spinnerService.requestStarted();
    this.stateService.getAll().subscribe((response) => {
      this.states = response.result;
      this.spinnerService.requestEnded();
    });
  }

  loadRegions() {
    this.spinnerService.requestStarted();
    this.regionService.getAll().subscribe((response) => {
      this.regions = response.result;
      this.spinnerService.requestEnded();
    });
  }

  addOrEdit() {
    if (this.livestockForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const city = this.livestockForm.get(`cityId${this.itemId}`)?.value;

    if (!city || typeof city !== 'object') {
      this.toastr.error('Cidade inválida');
      return;
    }

    const region = this.livestockForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const livestock: Livestock = {
      livestockType: +this.livestockForm.get(`livestockType${this.itemId}`)
        ?.value as LivestockType,
      herdType: +this.livestockForm.get(`herdType${this.itemId}`)
        ?.value as HerdType,
      quantity: +this.livestockForm.get(`quantity${this.itemId}`)?.value,
      weightAverage: +this.livestockForm.get(`weightAverage${this.itemId}`)
        ?.value,
      arrobaValue: +this.livestockForm.get(`arrobaValue${this.itemId}`)?.value,
      unityValue: +this.livestockForm.get(`unityValue${this.itemId}`)?.value,
      totalValue: +this.livestockForm.get(`totalValue${this.itemId}`)?.value,
      description: this.livestockForm.get(`description${this.itemId}`)?.value,
      regionId: region.id,
      stateId: this.livestockForm.get(`stateId${this.itemId}`)?.value,
      cityId: city.id,
      unitValueMode: +this.livestockForm.get(`unitValueMode${this.itemId}`)
        ?.value as UnitValueMode,
      isHerdReadyCommercialization: this.livestockForm.get(
        `isHerdReadyCommercialization${this.itemId}`
      )?.value
        ? true
        : false,
      commercializationDate: this.livestockForm.get(
        `commercializationDate${this.itemId}`
      )?.value,
      justification: this.livestockForm.get(`justification${this.itemId}`)
        ?.value,
      herdMode: +this.livestockForm.get(`herdMode${this.itemId}`)?.value as Mode,
      isEditing: this.livestockForm.get(`isEditing${this.itemId}`)?.value,
      bidId: this.bidId ?? '',
    };

    if (this.livestock) {
      const liveStockId = this.livestock?.id || '0';

      this.livestockService
        .put(liveStockId, livestock)
        .subscribe((response) => {
          if (response.code === 200) {
            this.livestockForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.livestockService.post(livestock).subscribe((response) => {
        if (response.code === 200) {
          this.livestockForm.reset();
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

  loadHerdCommercialization() {
    this.isHerdReadyCommercialization = !this.isHerdReadyCommercialization;
  }

  loadCities() {
    const state = this.livestockForm.get(`stateId${this.itemId}`)?.value;
    this.spinnerService.requestStarted();
    this.cityService.getByState(state).subscribe((response) => {
      this.cities = response.result;
      this.spinnerService.requestEnded();
    });
  }

  createTableForm() {
    this.livestockForm.addControl(
      `livestockType${this.itemId}`,
      new FormControl(this.livestock?.livestockType, [Validators.required])
    );
    this.livestockForm.addControl(
      `herdType${this.itemId}`,
      new FormControl(this.livestock?.herdType, [Validators.required])
    );
    this.livestockForm.addControl(
      `quantity${this.itemId}`,
      new FormControl(this.livestock?.quantity, [Validators.required])
    );
    this.livestockForm.addControl(
      `weightAverage${this.itemId}`,
      new FormControl(this.livestock?.weightAverage, [Validators.required])
    );
    this.livestockForm.addControl(
      `arrobaValue${this.itemId}`,
      new FormControl(this.livestock?.arrobaValue, [Validators.required])
    );
    this.livestockForm.addControl(
      `unityValue${this.itemId}`,
      new FormControl(this.livestock?.unityValue, [Validators.required])
    );
    this.livestockForm.addControl(
      `totalValue${this.itemId}`,
      new FormControl(this.livestock?.totalValue, [Validators.required])
    );
    this.livestockForm.addControl(
      `regionId${this.itemId}`,
      new FormControl(this.livestock?.region, [Validators.required])
    );
    this.livestockForm.addControl(
      `stateId${this.itemId}`,
      new FormControl(this.livestock?.stateId, [Validators.required])
    );
    this.livestockForm.addControl(
      `cityId${this.itemId}`,
      new FormControl(this.livestock?.city, [Validators.required])
    );
    this.livestockForm.addControl(
      `description${this.itemId}`,
      new FormControl(this.livestock?.description, [Validators.required])
    );
    this.livestockForm.addControl(
      `unitValueMode${this.itemId}`,
      new FormControl(this.livestock?.unitValueMode, [Validators.required])
    );
    this.livestockForm.addControl(
      `isHerdReadyCommercialization${this.itemId}`,
      new FormControl(this.livestock?.isHerdReadyCommercialization, [
        Validators.required,
      ])
    );
    this.livestockForm.addControl(
      `commercializationDate${this.itemId}`,
      new FormControl(this.livestock?.commercializationDate, [
        Validators.required,
      ])
    );
    console.log(this.livestock?.commercializationDate);
    this.livestockForm.addControl(
      `justification${this.itemId}`,
      new FormControl(this.livestock?.justification, [Validators.required])
    );
    this.livestockForm.addControl(
      `herdMode${this.itemId}`,
      new FormControl(this.livestock?.herdMode, [Validators.required])
    );
  }
}
