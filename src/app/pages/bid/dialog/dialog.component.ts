import { Component, NgModule, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StoreModule } from '@ngrx/store';
import { reducer } from './ngrx'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @NgModule({
    imports:[
      StoreModule.forRoot({
        reducer
      })
    ]
  })
  public login = ''
  public senha = ''
  public message = ''

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>
  ) { }

  ngOnInit(): void {

  }

  setEmail(e:any) {
    this.login = e.target.value
  }

  setSenha(e:any) {
    this.senha = e.target.value
  }

  cancel():void {
    console.log('this.login',this.login)
    console.log('this.senha',this.senha)
    if(this.login === 'teste@rabobank.com.br' && this.senha === 'Password1'){
      this.dialogRef.close();
    }else{
      this.message = 'Login ou senha inválidos'
    }
  }
}
