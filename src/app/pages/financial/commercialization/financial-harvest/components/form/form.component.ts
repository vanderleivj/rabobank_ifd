import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
  selector: 'app-commercialization-financial-harvest-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCommercializationFinancialHarvestComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public financialHarvest?: Harvest;

  @Input()
  harvestIndicator?: HarvestIndicator;

  isAutomaticDistribution = new FormControl('1');
  public itemId = '';
  public isExpanded?= false;
  public isCostExpanded?= false;
  public isAddingCommercialization = false;
  public isAddingCost = false;
  financialHarvestForm = this.fb.group({});
  public regions: Region[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private financialHarvestService: HarvestService,
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

    if (this.financialHarvest) {
      this.itemId = `_${this.financialHarvest?.id}`;
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
    const index = this.financialHarvest?.commercializations?.findIndex((p) => p.id === commercialization.id);
    if (index !== undefined && index !== -1 && this.financialHarvest && this.financialHarvest.commercializations) {
      this.financialHarvest.commercializations[index] = commercialization;
    }
  }

  addCommercialization(commercialization: Commercialization) {
    this.financialHarvest?.commercializations?.push(commercialization);
  }

  loadEditCommercialization(id: string) {
    this.financialHarvest?.commercializations?.forEach((item) => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  deleteCommercialization(id: string) {
    const index = this.financialHarvest?.commercializations?.findIndex((p) => p.id === id);
    if (index !== undefined && index !== -1) {
      this.financialHarvest?.commercializations?.splice(index, 1);
    }
  }

  loadAddNewCost() {
    this.isAddingCost = true;
  }

  editCost(cost: Cost) {
    const index = this.financialHarvest?.costs?.findIndex((p) => p.id === cost.id);
    if (index !== undefined && index !== -1 && this.financialHarvest && this.financialHarvest.costs) {
      this.financialHarvest.costs[index] = cost;
    }
  }

  addCost(cost: Cost) {
    this.financialHarvest?.costs?.push(cost);
  }

  loadEditCost(id: string) {
    this.financialHarvest?.costs?.forEach((item) => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  deleteCost(id: string) {
    const index = this.financialHarvest?.costs?.findIndex((p) => p.id === id);
    if (index !== undefined && index !== -1) {
      this.financialHarvest?.costs?.splice(index, 1);
    }
  }

  filterCost(cost: Cost) {
    return cost.isAutomaticDistribution === (this.isAutomaticDistribution.value === '1' ? true : false);
  }

  addOrEdit() {

    if (this.financialHarvestForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const region = this.financialHarvestForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const financialHarvest: Harvest = {
      culture: this.financialHarvestForm.get(`culture${this.itemId}`)?.value,
      regionId: region.id,
      area: +this.financialHarvestForm.get(`area${this.itemId}`)?.value,
      price: +this.financialHarvestForm.get(`price${this.itemId}`)?.value,
      productivity: +this.financialHarvestForm.get(`productivity${this.itemId}`)?.value,
      cost: +this.financialHarvestForm.get(`cost${this.itemId}`)?.value,
      commercializations: this.financialHarvest?.commercializations,
      costs: this.financialHarvest?.costs,
      bidId: this.bidId ?? '',
    };

    if (financialHarvest) {
      const financialHarvestId = this.financialHarvest?.id || '0';

      this.financialHarvestService.put(financialHarvestId, financialHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.financialHarvestForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.financialHarvestService.post(financialHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.financialHarvestForm.reset();
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
    this.financialHarvestForm.addControl(`culture${this.itemId}`, new FormControl(this.financialHarvest?.culture, [Validators.required]));
    this.financialHarvestForm.addControl(`regionId${this.itemId}`, new FormControl(this.financialHarvest?.region, [Validators.required]));
    this.financialHarvestForm.addControl(`area${this.itemId}`, new FormControl(this.financialHarvest?.area, [Validators.required]));
    this.financialHarvestForm.addControl(`price${this.itemId}`, new FormControl(this.financialHarvest?.price, [Validators.required]));
    this.financialHarvestForm.addControl(`productivity${this.itemId}`,
      new FormControl(this.financialHarvest?.productivity, [Validators.required]));
    this.financialHarvestForm.addControl(`cost${this.itemId}`, new FormControl(this.financialHarvest?.cost, [Validators.required]));
  }

}
