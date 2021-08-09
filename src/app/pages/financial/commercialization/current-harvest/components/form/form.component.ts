import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Harvest } from 'src/app/models/financial/harvest';
import { Region } from 'src/app/models/global/region';
import { Commercialization } from 'src/app/models/financial/Commercialization';

import { HarvestService } from 'src/app/services/financial/harvest.service';
import { RegionService } from 'src/app/services/global/region.services';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { Cost } from 'src/app/models/financial/cost';
import { HarvestIndicator } from 'src/app/models/financial/harvest-indicator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commercialization-current-harvest-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCommercializationCurrentHarvestComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public currentHarvest?: Harvest;

  @Input()
  harvestIndicator?: HarvestIndicator;

  isAutomaticDistribution = new FormControl('1');
  public itemId = '';
  public isExpanded?= false;
  public isCostExpanded?= false;
  public isAddingCommercialization = false;
  public isAddingCost = false;
  currentHarvestForm = this.fb.group({});
  public regions: Region[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private harvestService: HarvestService,
    private regionService: RegionService,
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

    if (this.currentHarvest) {
      this.itemId = `_${this.currentHarvest?.id}`;
    }

    this.loadRegions();
    this.createTableForm();
  }

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

  loadAddNewCommercialization() {
    this.isAddingCommercialization = true;
  }

  editCommercialization(commercialization: Commercialization) {
    const index = this.currentHarvest?.commercializations?.findIndex((p) => p.id === commercialization.id);
    if (index !== undefined && index !== -1 && this.currentHarvest && this.currentHarvest.commercializations) {
      this.currentHarvest.commercializations[index] = commercialization;
    }
  }

  addCommercialization(commercialization: Commercialization) {
    this.currentHarvest?.commercializations?.push(commercialization);
  }

  loadEditCommercialization(id: string) {
    this.currentHarvest?.commercializations?.forEach((item) => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  deleteCommercialization(id: string) {
    const index = this.currentHarvest?.commercializations?.findIndex((p) => p.id === id);
    if (index !== undefined && index !== -1) {
      this.currentHarvest?.commercializations?.splice(index, 1);
    }
  }

  loadAddNewCost() {
    this.isAddingCost = true;
  }

  editCost(cost: Cost) {
    const index = this.currentHarvest?.costs?.findIndex((p) => p.id === cost.id);
    if (index !== undefined && index !== -1 && this.currentHarvest && this.currentHarvest.costs) {
      this.currentHarvest.costs[index] = cost;
    }
  }

  addCost(cost: Cost) {
    this.currentHarvest?.costs?.push(cost);
  }

  loadEditCost(id: string) {
    this.currentHarvest?.costs?.forEach((item) => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  deleteCost(id: string) {
    const index = this.currentHarvest?.costs?.findIndex((p) => p.id === id);
    if (index !== undefined && index !== -1) {
      this.currentHarvest?.costs?.splice(index, 1);
    }
  }

  filterCost(cost: Cost) {
    return cost.isAutomaticDistribution === (this.isAutomaticDistribution.value === '1' ? true : false);
  }

  addOrEdit() {

    if (this.currentHarvestForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const region = this.currentHarvestForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const currentHarvest: Harvest = {
      culture: this.currentHarvestForm.get(`culture${this.itemId}`)?.value,
      regionId: region.id,
      area: +this.currentHarvestForm.get(`area${this.itemId}`)?.value,
      price: +this.currentHarvestForm.get(`price${this.itemId}`)?.value,
      productivity: +this.currentHarvestForm.get(`productivity${this.itemId}`)?.value,
      cost: +this.currentHarvestForm.get(`cost${this.itemId}`)?.value,
      commercializations: this.currentHarvest?.commercializations,
      costs: this.currentHarvest?.costs,
      bidId: this.bidId ?? '',
    };

    if (currentHarvest) {
      const currentHarvestId = this.currentHarvest?.id || '0';

      this.harvestService.put(currentHarvestId, currentHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.currentHarvestForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.harvestService.post(currentHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.currentHarvestForm.reset();
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.loadData.emit();
          }
        });
    }
  }

  expandListCostDetails() {
    this.isCostExpanded = !this.isCostExpanded;
  }

  expandListDetails() {
    this.isExpanded = !this.isExpanded;
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }

  createTableForm() {
    this.currentHarvestForm.addControl(`culture${this.itemId}`, new FormControl(this.currentHarvest?.culture, [Validators.required]));
    this.currentHarvestForm.addControl(`regionId${this.itemId}`, new FormControl(this.currentHarvest?.region, [Validators.required]));
    this.currentHarvestForm.addControl(`area${this.itemId}`, new FormControl(this.currentHarvest?.area, [Validators.required]));
    this.currentHarvestForm.addControl(`price${this.itemId}`, new FormControl(this.currentHarvest?.price, [Validators.required]));
    this.currentHarvestForm.addControl(`productivity${this.itemId}`,
      new FormControl(this.currentHarvest?.productivity, [Validators.required]));
    this.currentHarvestForm.addControl(`cost${this.itemId}`, new FormControl(this.currentHarvest?.cost, [Validators.required]));
  }

}
