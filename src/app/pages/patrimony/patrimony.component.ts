import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-patrimony',
  templateUrl: './patrimony.component.html',
  styleUrls: ['./patrimony.component.css']
})
export class PatrimonialComponent implements OnInit {

  public isProperties = false;
  public isAssets = false;
  public isLivestock = false;
  public isOthersGoods = false;
  public isDebts = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.router.url === '/patrimonial/imoveis-rurais') {
      this.isProperties = true;
      this.isAssets = false;
      this.isLivestock = false;
      this.isOthersGoods = false;
      this.isDebts = false;
    } else if (this.router.url === '/patrimonial/semoventes') {
      this.isLivestock = true;
      this.isAssets = false;
      this.isProperties = false;
      this.isOthersGoods = false;
      this.isDebts = false;
    } else if (this.router.url === '/patrimonial/bens-moveis-imoveis') {
      this.isAssets = true;
      this.isProperties = false;
      this.isLivestock = false;
      this.isOthersGoods = false;
      this.isDebts = false;
    } else if (this.router.url === '/patrimonial/outros-bens-e-direito') {
      this.isAssets = false;
      this.isProperties = false;
      this.isLivestock = false;
      this.isOthersGoods = true;
      this.isDebts = false;
    } else if (this.router.url === '/patrimonial/debito') {
      this.isAssets = false;
      this.isProperties = false;
      this.isLivestock = false;
      this.isOthersGoods = false;
      this.isDebts = true;
    }
  }

}
