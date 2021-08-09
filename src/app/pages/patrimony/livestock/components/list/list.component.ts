import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { City } from 'src/app/models/global/city';
import { BASE_URL } from 'src/app/models/global/url';
import { HerdType, Livestock, LivestockType, UnitValueMode, unitValueModeTranslated } from 'src/app/models/patrimony/livestock';
import { AlertModalService } from 'src/app/services/common/alert-modal.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';
import { LivestockService } from 'src/app/services/patrimony/livestock.service';
import { Mode, modeTranslated } from 'src/app/models/patrimony/enum/mode';

@Component({
  selector: 'app-livestock-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListLiveStockComponent implements OnInit {

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();
  public isOpen = false;
  public isHerdReadyCommercialization = false;
  public cities: City[] = [];
  public livestocks: Livestock[] = [];

  public bidId = '';
  public bid$: Observable<Bid>;

  constructor(
    private livestockService: LivestockService,
    private spinnerService: SpinnerService,
    private alertService: AlertModalService,
    private store: Store<{ bid: Bid }>
  ) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  doDownload() {
    let url = `${BASE_URL}/rural-properties/pdf`;
    if (this.downloadType.value === '3') {
      url = `${BASE_URL}/rural-properties/excel`;
    }
    window.open(url, '_blank');
    this.downloadType.setValue('0');
  }

  pageChanged(page: number) {
    this.pagination.page = page;
    this.loadData();
  }

  loadData() {
    this.spinnerService.requestStarted();
    this.livestockService
      .getAll(this.pagination, this.search.value, this.bidId)
      .subscribe((response) => {
        this.livestocks = response.result;
        this.pagination.count = response.count;
        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    this.livestocks.forEach(item => {
      if (item.id === id) {
        item.isEditing = true;
      }
    });
  }

  expandListDetails(id: string) {
    this.livestocks.forEach(item => {
      if (item.id === id) {
        item.expanded = !item.expanded;
      }
    });
  }

  cancelEdit(id: string) {
    this.livestocks.forEach(item => {
      if (item.id === id) {
        item.isEditing = false;
      }
    });
  }

  delete(id: string) {
    const result$ = this.alertService.showDelete();
    result$.asObservable()
      .pipe(
        take(1),
        switchMap(result => result ? this.livestockService.delete(id) : EMPTY)
      )
      .subscribe(
        () => {
          this.loadData();
        }
      );
  }

  loadAdd() {
    this.isOpen = true;
  }

  translateLivestockType(livestockType: number) {
    return LivestockType[livestockType];
  }

  translateHerdType(herdType: number) {
    return HerdType[herdType];
  }

  translateHerdMode(herdMode: number) {
    if (herdMode as Mode === Mode.effective) {
      return modeTranslated.effective;
    } else {
      return modeTranslated.effective;
    }
  }

  translateUnitValueMode(valueMode: number) {
    if (valueMode as UnitValueMode === UnitValueMode.arrobaPrice) {
      return unitValueModeTranslated.arrobaPrice;
    } else {
      return unitValueModeTranslated.defined;
    }
  }
}
