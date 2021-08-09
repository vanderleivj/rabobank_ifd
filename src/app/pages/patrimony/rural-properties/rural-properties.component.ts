import { Component, OnInit } from '@angular/core';
import { Bid } from 'src/app/models/bid/bid.model';
import { RuralPropertyService } from '../../../services/patrimony/rural-property.service';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rural-properties',
  templateUrl: './rural-properties.component.html',
  styleUrls: ['./rural-properties.component.css']
})
export class RuralPropertyComponent implements OnInit {

  ownAreaChartData: number[] = [0];
  ownAreaChartLabels = [''];

  leasedAreaChartData = [0];
  leasedAreaChartLabels = [''];

  leseadArea = 0;
  ownArea = 0;

  public bid$: Observable<Bid>;

  constructor(
    private ruralPropertyService: RuralPropertyService,
    private store: Store<{ bid: Bid }>,
  ) {
    this.bid$ = this.store.pipe(select('bid'));
   }

  ngOnInit(): void {
    this.bid$.subscribe((bid) => {
      this.loadData(bid.id ?? '');
    });
  }

  loadData(bidId: string) {
    this.ruralPropertyService
    .getOwnAreas(bidId)
    .subscribe((ownAreas) => {
      this.ownAreaChartData = ownAreas.map((ownArea) => ownArea.value || 0);
      this.ownAreaChartLabels = ownAreas.map((ownArea) => ownArea.date?.toLocaleString() || '');
    });

    this.ruralPropertyService
    .getRentedAreas(bidId)
    .subscribe((rentedAreas) => {
      this.leasedAreaChartData = rentedAreas.map((rentedArea) => rentedArea.value || 0);
      this.leasedAreaChartLabels = rentedAreas.map((rentedArea) => rentedArea.date?.toLocaleString() || '');
    });

    this.ruralPropertyService
    .getArea(bidId)
    .subscribe((area) => {
      this.leseadArea = area.rentedArea || 0;
      this.ownArea = area.ownArea || 0;
    });

  }

}
