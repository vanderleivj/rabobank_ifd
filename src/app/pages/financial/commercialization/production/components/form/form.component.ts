import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { Production, HarvestProduction } from 'src/app/models/financial/production';
import { Region } from 'src/app/models/global/region';

import { ProductionService } from 'src/app/services/financial/production.service';
import { RegionService } from 'src/app/services/global/region.services';
import { SpinnerService } from 'src/app/services/common/spinner.service';

@Component({
  selector: 'app-commercialization-production-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCommercializationProductionComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public productions?: Production;

  @Input()
  public harvests?: HarvestProduction;

  public itemId = '';
  productionForm = this.fb.group({});
  public regions: Region[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private productionService: ProductionService,
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

    if (this.productions) {
      this.itemId = `_${this.productions?.id}`;
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

  addOrEdit() {
    if (this.productionForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const region = this.productionForm.get(`regionId${this.itemId}`)?.value;

    if (!region || typeof region !== 'object') {
      this.toastr.error('Região inválido');
      return;
    }

    const productions: Production = {
      culture: this.productionForm.get(`culture${this.itemId}`)?.value,
      regionId: region.id,
      harvests: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 0; i <= 2; i++) {

      const harvest: HarvestProduction = {
        period: this.productionForm.get(`period${i}${this.itemId}`)?.value,
        area: +this.productionForm.get(`area${i}${this.itemId}`)?.value,
        price: +this.productionForm.get(`price${i}${this.itemId}`)?.value,
        productivity: +this.productionForm.get(`productivity${i}${this.itemId}`)?.value,
        cost: +this.productionForm.get(`cost${i}${this.itemId}`)?.value,
      };

      productions.harvests.push(harvest);
    }

    if (this.productions) {

      const itemId = this.productions?.id || '0';

      this.productionService.put(itemId, productions)
        .subscribe((response) => {
          if (response.code === 200) {
            this.productionForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.productionService.post(productions)
        .subscribe((response) => {
          if (response.code === 200) {
            this.productionForm.reset();
            this.isOpen = false;
            this.isOpenChange.emit(false);
            this.loadData.emit();
          }
        });
    }

  }

  createTableForm() {
    this.productionForm.addControl(`culture${this.itemId}`, new FormControl(this.productions?.culture, [Validators.required]));
    this.productionForm.addControl(`regionId${this.itemId}`, new FormControl(this.productions?.region, [Validators.required]));

    this.productionForm.addControl(`period0${this.itemId}`, new FormControl(
      this.productions?.harvests[0].period || this.projectionDate(0, 1),
      [Validators.required])
    );
    this.productionForm.addControl(`period1${this.itemId}`, new FormControl(
      this.productions?.harvests[1].period || this.projectionDate(1, 2),
      [Validators.required])
    );
    this.productionForm.addControl(`period2${this.itemId}`, new FormControl(
      this.productions?.harvests[2].period || this.projectionDate(0, 1),
      [Validators.required])
    );

    this.productionForm.addControl(`area0${this.itemId}`, new FormControl(this.productions?.harvests[0].area, [Validators.required]));
    this.productionForm.addControl(`area1${this.itemId}`, new FormControl(this.productions?.harvests[1].area, [Validators.required]));
    this.productionForm.addControl(`area2${this.itemId}`, new FormControl(this.productions?.harvests[2].area, [Validators.required]));

    this.productionForm.addControl(`price0${this.itemId}`, new FormControl(this.productions?.harvests[0].price, [Validators.required]));
    this.productionForm.addControl(`price1${this.itemId}`, new FormControl(this.productions?.harvests[1].price, [Validators.required]));
    this.productionForm.addControl(`price2${this.itemId}`, new FormControl(this.productions?.harvests[2].price, [Validators.required]));

    this.productionForm.addControl(`productivity0${this.itemId}`,
      new FormControl(this.productions?.harvests[0].productivity, [Validators.required]));
    this.productionForm.addControl(`productivity1${this.itemId}`,
      new FormControl(this.productions?.harvests[1].productivity, [Validators.required]));
    this.productionForm.addControl(`productivity2${this.itemId}`,
      new FormControl(this.productions?.harvests[2].productivity, [Validators.required]));

    this.productionForm.addControl(`cost0${this.itemId}`, new FormControl(this.productions?.harvests[0].cost, [Validators.required]));
    this.productionForm.addControl(`cost1${this.itemId}`, new FormControl(this.productions?.harvests[1].cost, [Validators.required]));
    this.productionForm.addControl(`cost2${this.itemId}`, new FormControl(this.productions?.harvests[2].cost, [Validators.required]));
  }

  projectionDate(ref1: number, ref2: number): any {
    const date = new Date();
    return `${date.getFullYear() + ref1} / ${date.getFullYear() + ref2}`;
  }

  cancelAddOrEdit() {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
