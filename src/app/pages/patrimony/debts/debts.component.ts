import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: []
})
export class DebtsComponent implements OnInit {

  public quantity = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
