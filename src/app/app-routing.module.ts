import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BidComponent } from './pages/bid/bid.component';
import { FinancialInformationComponent } from './pages/financial/financialInformation.component';
import { LoginComponent } from './pages/login/login.component';
import { PatrimonialComponent } from './pages/patrimony/patrimony.component';

const routes: Routes = [
  {
    path: '',
    component: BidComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'patrimonial',
    component: PatrimonialComponent
  },
  {
    path: 'patrimonial/imoveis-rurais',
    component: PatrimonialComponent
  },
  {
    path: 'patrimonial/semoventes',
    component: PatrimonialComponent
  },
  {
    path: 'patrimonial/outros-bens-e-direito',
    component: PatrimonialComponent
  },
  {
    path: 'patrimonial/debito',
    component: PatrimonialComponent
  },
  {
    path: 'financeiro',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/fluxo-comparativo',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/comercializacao',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/ativos-circulantes',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/balanco-projecao',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/fluxo-caixa-projecao',
    component: FinancialInformationComponent
  },
  {
    path: 'financeiro/analise-premissa',
    component: FinancialInformationComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
