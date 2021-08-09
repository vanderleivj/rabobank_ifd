import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Bid } from 'src/app/models/bid/bid.model';
import { Pagination } from 'src/app/models/common/pagination';
import { downloadExcel, downloadPdf } from 'src/app/models/global/url';
import { ComparativeFlow, Values, ComparativeFlowViewModel, ValueViewModel } from 'src/app/models/financial/comparative-flow';

import { ComparativeFlowService } from 'src/app/services/financial/comparative-flow.service';
import { SpinnerService } from 'src/app/services/common/spinner.service';

@Component({
  selector: 'app-comparative-flow-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComparativeFlowComponent implements OnInit {

  @Output()
  quantityChange: EventEmitter<number> = new EventEmitter<number>();
  @Input()
  public quantity = 0;

  search = new FormControl('');
  downloadType = new FormControl('0');
  pagination = new Pagination();

  comparativeFlowViewModelList: ComparativeFlowViewModel[] = [];

  public isOpen = false;
  public bid$: Observable<Bid>;
  public comparativeFlow: ComparativeFlow[] = [];
  public values: Values[] = [];
  public list = [] = [
    {
      id: '',
      isEditing: true,
    }
  ];
  private bidId = '';


  constructor(
    private comparativeFlowService: ComparativeFlowService,
    private spinnerService: SpinnerService,
    private store: Store<{ bid: Bid }>) {
    this.bid$ = this.store.pipe(select('bid'));
  }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.bidId = bid.id ?? '';
      this.loadData();
    });
  }

  doDownload() {
    let url = downloadPdf;
    if (this.downloadType.value === '3') {
      url = downloadExcel;
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
    this.comparativeFlowService
      .getAll(this.bidId, this.pagination, this.search.value)
      .subscribe((response) => {
        this.comparativeFlow = response.result;;
        this.values = this.comparativeFlow[0].values;
        //console.log(this.comparativeFlow[0].values[0].type.name);
        console.log(this.comparativeFlow);
        this.pagination.count = response.count;
        this.quantityChange.emit(response.count);

        const tempArray: ComparativeFlowViewModel[] = [];

        this.comparativeFlow.forEach((flow) => {
          flow.values.forEach((flowValue) => {
            const index = tempArray.findIndex((x) => x.type.id === flowValue.type.id);
            if (index > -1) {
              tempArray[index].values.push(new ValueViewModel(flowValue.projected, flowValue.reviewed));
            } else {
              tempArray.push(new ComparativeFlowViewModel(flowValue.type, [new ValueViewModel(flowValue.projected, flowValue.reviewed)]));
            }
          });
        });
        this.comparativeFlowViewModelList = tempArray;
        console.log('TEMP_ARRAY: ', tempArray);

        this.spinnerService.requestEnded();
      });
  }

  loadEdit(id: string) {
    // this.debts.forEach(item => {
    //   if (item.id === id) {
    //     item.isEditing = true;
    //   }
    // });
  }

  cancelEdit(id: string) {
    // this.debts.forEach(item => {
    //   if (item.id === id) {
    //     item.isEditing = false;
    //   }
    // });
  }

  delete(id: string) {
    // this.debtService.delete(id)
    //   .subscribe((response) => {
    //     if (response.code === 200) {
    //       this.loadData();
    //     }
    //   });
  }

  loadAdd() {
    this.isOpen = true;
  }
}
