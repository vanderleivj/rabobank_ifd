import { Component, NgModule, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store,select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})

export class BidComponent implements OnInit {
  public isLogado$: any | undefined

  constructor(
    public dialog: MatDialog,
    private store: Store<{isLogado: boolean}>
  ){}

  ngOnInit(): void {
    //this.isLogado$ = this.store.source.loginReducer
    this.openDialog()
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50%',
      height: '60%',
      minWidth:'350px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {

    });
  }


}
