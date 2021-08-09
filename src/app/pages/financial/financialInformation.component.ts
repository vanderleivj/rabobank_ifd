import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financialInformation.component.html',
  styleUrls: ['./financialInformation.component.css']
})
export class FinancialInformationComponent implements OnInit {

  public isComparative = false;
  public isCommercialization = false;
  public isCurrentAssets = false;
  public isCashFlow = false;
  public isBalanceSheet = false;
  public isAnalysis = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.router.url === '/financeiro/fluxo-comparativo') {
      this.isComparative = true;
      this.isCommercialization = false;
      this.isCurrentAssets = false;
      this.isCashFlow = false;
      this.isBalanceSheet = false;
      this.isAnalysis = false;
    } else if (this.router.url === '/financeiro/comercializacao') {
      this.isComparative = false;
      this.isCommercialization = true;
      this.isCurrentAssets = false;
      this.isCashFlow = false;
      this.isBalanceSheet = false;
      this.isAnalysis = false;
    } else if (this.router.url === '/financeiro/ativos-circulantes') {
      this.isComparative = false;
      this.isCommercialization = false;
      this.isCurrentAssets = true;
      this.isCashFlow = false;
      this.isBalanceSheet = false;
      this.isAnalysis = false;
    } else if (this.router.url === '/financeiro/fluxo-caixa-projecao') {
      this.isComparative = false;
      this.isCommercialization = false;
      this.isCurrentAssets = false;
      this.isCashFlow = true;
      this.isBalanceSheet = false;
      this.isAnalysis = false;
    } else if (this.router.url === '/financeiro/balanco-projecao') {
      this.isComparative = false;
      this.isCommercialization = false;
      this.isCurrentAssets = false;
      this.isCashFlow = false;
      this.isBalanceSheet = true;
      this.isAnalysis = false;
    } else if (this.router.url === '/financeiro/analise-premissa') {
      this.isComparative = false;
      this.isCommercialization = false;
      this.isCurrentAssets = false;
      this.isCashFlow = false;
      this.isBalanceSheet = false;
      this.isAnalysis = true;
    }
  }

}
