import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import { Bid } from 'src/app/models/bid/bid.model';
import { AssetType } from 'src/app/models/financial/asset-type';
import { NewCurrentHarvest } from 'src/app/models/financial/new-current-assets';
import { Projection } from 'src/app/models/financial/projection';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { AsseTypeService } from 'src/app/services/financial/asset-type.services';
import { NewCurrentHarvestService } from 'src/app/services/financial/new-current-assets.service';

@Component({
  selector: 'app-current-assets-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormCurrentAssetsComponent implements OnInit {

  @Output()
  public loadData: EventEmitter<any> = new EventEmitter();

  @Output()
  isOpenChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  public isOpen = true;

  @Input()
  public newCurrentHarvests?: NewCurrentHarvest;

  public itemId = '';
  newCurrentForm = this.fb.group({});
  public assetsType: AssetType[] = [];
  public bid$: Observable<Bid>;
  public bidId = '';

  constructor(
    private fb: FormBuilder,
    private newCurrentharvestService: NewCurrentHarvestService,
    private assetTypeService: AsseTypeService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>,
    private toastr: ToastrService,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
    });

    if (this.newCurrentHarvests) {
      this.itemId = `_${this.newCurrentHarvests?.id}`;
    }
    this.createTableForm();
    this.loadAssets();
  }

  searchAsset = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      map(term => term === '' ? []
        : this.assetsType.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    );

  formatter = (x: { name: string }) => x.name;

  loadAssets() {
    this.spinnerService.requestStarted();
    this.assetTypeService
      .getAll()
      .subscribe((response) => {
        this.assetsType = response.result;
        this.spinnerService.requestEnded();
      });
  }

  createTableForm() {
    this.newCurrentForm.addControl(`asset${this.itemId}`, new FormControl(this.newCurrentHarvests?.asset, [Validators.required]));
    this.newCurrentForm.addControl(`current${this.itemId}`, new FormControl(this.newCurrentHarvests?.current, [Validators.required]));

    this.newCurrentForm.addControl(`projections1${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(0, 1), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue1${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[0].value, [Validators.required]));

    this.newCurrentForm.addControl(`projections2${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(1, 2), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue2${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[1].value, [Validators.required]));

    this.newCurrentForm.addControl(`projections3${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(2, 3), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue3${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[2].value, [Validators.required]));

    this.newCurrentForm.addControl(`projections4${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(3, 4), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue4${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[3].value, [Validators.required]));

    this.newCurrentForm.addControl(`projections5${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(4, 5), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue5${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[4].value, [Validators.required]));

    this.newCurrentForm.addControl(`projections6${this.itemId}`,
      new FormControl(
        this.newCurrentHarvests?.projections[0].harvest || this.projectionDate(5, 6), [Validators.required])
    );
    this.newCurrentForm.addControl(`projectionsValue6${this.itemId}`,
      new FormControl(this.newCurrentHarvests?.projections[5].value, [Validators.required]));
  }

  projectionDate(ref1: number, ref2: number): any {
    const date = new Date();
    return `${date.getFullYear() + ref1} / ${date.getFullYear() + ref2}`;
  }

  addOrEdit() {
    if (this.newCurrentForm.invalid) {
      this.toastr.error('Preencha todos campos para salvar', 'Erro validação');
      return;
    }

    const asset = this.newCurrentForm.get(`asset${this.itemId}`)?.value;

    if (!asset || typeof asset !== 'object') {
      this.toastr.error('Projeção inválido');
      return;
    }

    const newCurrentHarvest: NewCurrentHarvest = {
      assetId: asset.id,
      current: +this.newCurrentForm.get(`current${this.itemId}`)?.value,
      projections: [],
      bidId: this.bidId ?? '',
    };

    for (let i = 1; i <= 6; i++) {
      newCurrentHarvest.projections.push({
        harvest: this.newCurrentForm.get(`projections${i}${this.itemId}`)?.value,
        value: +this.newCurrentForm.get(`projectionsValue${i}${this.itemId}`)?.value,
      });
    }

    if (this.newCurrentHarvests) {

      const itemId = this.newCurrentHarvests?.id || '0';

      this.newCurrentharvestService.put(itemId, newCurrentHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.newCurrentForm.reset();
            this.loadData.emit();
          }
        });
    } else {
      this.newCurrentharvestService.post(newCurrentHarvest)
        .subscribe((response) => {
          if (response.code === 200) {
            this.newCurrentForm.reset();
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
}
