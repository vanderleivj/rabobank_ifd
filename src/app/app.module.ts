/* eslint-disable max-len */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';

import { bidReducer } from './reducers/bid.reducer';
import { reducer } from './pages/bid/dialog/ngrx'
import { NgxbootstrapModule } from './ngxbootstrap/ngxbootstrap.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AreaComponent } from './components/charts/area/area.component';
import { LineChartComponent } from './components/charts/line-chart/line-chart.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DeleteModalComponent } from './components/modal/delete/delete-modal.component';

import { BidComponent } from './pages/bid/bid.component';
import { ListBidComponent } from './pages/bid/components/list/list.component';

import { PatrimonialComponent } from './pages/patrimony/patrimony.component';

/* Imoveis Rurais */
import { RuralPropertyComponent } from './pages/patrimony/rural-properties/rural-properties.component';
import { FormRuralPropertyComponent } from './pages/patrimony/rural-properties/components/form/form.component';
import { ListRuralPropertyComponent } from './pages/patrimony/rural-properties/components/list/list.component';
/* Semoventes */
import { LivestockComponent } from './pages/patrimony/livestock/livestock.component';
import { LivestockCardComponent } from './pages/patrimony/livestock/components/livestock-card/livestock-card.component';
import { ListLiveStockComponent } from './pages/patrimony/livestock/components/list/list.component';
import { FormLiveStockComponent } from './pages/patrimony/livestock/components/form/form.component';
/* Outros bens e direitos Principal */
import { OtherGoodsRightsComponent } from './pages/patrimony/other-goods-rights/other-goods-rights.component';
import { AreaGoodsRightsComponent } from './components/charts/area-goods-rights/area-goods-rights.component';
/* OBD -estoques */
import { StockComponent } from './pages/patrimony/other-goods-rights/stock/stock.component';
import { ChartGroupComponent } from './pages/patrimony/other-goods-rights/stock/components/chart-group/chart-group.component';
import { FormOtherGoodsRightsStockComponent } from './pages/patrimony/other-goods-rights/stock/components/form/form.component';
import { ListOtherGoodsRightsStockComponent } from './pages/patrimony/other-goods-rights/stock/components/list/list.component';
/* OBD - Insumos */
import { SuppliesComponent } from './pages/patrimony/other-goods-rights/supplies/supplies.component';
import { ListComponent } from './pages/patrimony/other-goods-rights/supplies/componenets/list/list.component';
import { FormOthersGoodsRightsSuppliesComponent } from './pages/patrimony/other-goods-rights/supplies/componenets/form/form.component';
/* OBD - Participação acionaria */
import { ShareholdingComponent } from './pages/patrimony/other-goods-rights/shareholding/shareholding.component';
import { ListShareholdingComponent } from './pages/patrimony/other-goods-rights/shareholding/components/list/list.component';
import { FormOthersGoodsRightsShareholdingComponent } from './pages/patrimony/other-goods-rights/shareholding/components/form/form.component';
/* OBD - Valor financeiro (ativo) */
import { FinancialComponent } from './pages/patrimony/other-goods-rights/financial/financial.component';
import { ListOthersGoodsRightsFinancialComponent } from './pages/patrimony/other-goods-rights/financial/components/list/list.component';
import { FormOthersGoodsRightsFinancialComponent } from './pages/patrimony/other-goods-rights/financial/components/form/form.component';
/* OBD - Safra formação */
import { HarvestComponent } from './pages/patrimony/other-goods-rights/harvest/harvest.component';
import { ChartGroupHarvestComponent } from './pages/patrimony/other-goods-rights/harvest/components/chart-group/chart-group.component';
import { ListHarvestComponent } from './pages/patrimony/other-goods-rights/harvest/components/list/list.component';
import { FormOthersGoodsRightsHarvestComponent } from './pages/patrimony/other-goods-rights/harvest/components/form/form.component';
import { ChartGroupDebtsComponent } from './pages/patrimony/debts/components/chart-group/chart-group.component';

// Debts
import { DebtsComponent } from './pages/patrimony/debts/debts.component';
import { ListDebtComponent } from './pages/patrimony/debts/components/list/list.component';
import { FormDebtComponent } from './pages/patrimony/debts/components/form/form.component';
import { AreaDebtsComponent } from './components/charts/area-debts/area-debts.component';

//Financial
import { FinancialInformationComponent } from './pages/financial/financialInformation.component';

//Financial - Comparative Flow
import { ComparativeFlowComponent } from './pages/financial/comparative-flow/comparative-flow.component';
import { ListComparativeFlowComponent } from './pages/financial/comparative-flow/components/list/list.component';
import { ChartGroupComparativeFlowComponent } from './pages/financial/comparative-flow/components/chart-group/chart-group.component';
import { LineChartComparativeFlowComponent } from './components/charts/line-chart-comparative-flow/line-chart-comparative-flow.component';

import { CurrentAssetsComponent } from './pages/financial/current-assets/current-assets.component';
import { ListCurrentAssetsComponent } from './pages/financial/current-assets/components/list/list.component';

//Financial
import { CommercializationComponent } from './pages/financial/commercialization/commercialization.component';

//Commercialzization
import { FormCommercializationComponent } from './pages/financial/commercialization/components/commercialization/form/form.component';

//Commercialzization
import { FormCostComponent } from './pages/financial/commercialization/components/cost/form/form.component';

//Financial - Current Harvest
import { CommercializationCurrentHarvestComponent } from './pages/financial/commercialization/current-harvest/current-harvest.component';
import { ListCommercializationCurrentHarvestComponent } from './pages/financial/commercialization/current-harvest/components/list/list.component';
import { FormCommercializationCurrentHarvestComponent } from './pages/financial/commercialization/current-harvest/components/form/form.component';
import { ChartGroupCurrentHarvestComponent } from './pages/financial/commercialization/current-harvest/components/chart-group/chart-group.component';

//Financial - Next Harvest
import { CommercializationNextHarvestComponent } from './pages/financial/commercialization/next-harvest/next-harvest.component';
import { ListComercializationNextHarvestComponent } from './pages/financial/commercialization/next-harvest/components/list/list.component';
import { FormCommercializationNextHarvestComponent } from './pages/financial/commercialization/next-harvest/components/form/form.component';
import { ChartGroupNextHarvestComponent } from './pages/financial/commercialization/next-harvest/components/chart-group/chart-group.component';

//Financial - Financial Harvest
import { CommercializationFinancialHarvestComponent } from './pages/financial/commercialization/financial-harvest/financial-harvest.component';
import { ListComercializationFinancialHarvestComponent } from './pages/financial/commercialization/financial-harvest/components/list/list.component';
import { FormCommercializationFinancialHarvestComponent } from './pages/financial/commercialization/financial-harvest/components/form/form.component';
import { ChartGroupFinancialHarvestComponent } from './pages/financial/commercialization/financial-harvest/components/chart-group/chart-group.component';

//Financial - Production
import { CommercializationProductionComponent } from './pages/financial/commercialization/production/production.component';
import { ListCommercializationProductionComponent } from './pages/financial/commercialization/production/components/list/list.component';
import { ChartGroupProductionComponent } from './pages/financial/commercialization/production/components/chart-group/chart-group.component';
import { FormCommercializationProductionComponent } from './pages/financial/commercialization/production/components/form/form.component';

//Cash Flow
import { CashFlowComponent } from './pages/financial/cash-flow/cash-flow.component';
import { ListCashFlowComponent } from './pages/financial/cash-flow/components/list/list.component';
import { FormCashFlowComponent } from './pages/financial/cash-flow/components/form/form.component';

//Balance
import { BalanceComponent } from './pages/financial/balance/balance.component';
import { ListBalanceComponent } from './pages/financial/balance/components/list/list.component';
import { FormBalanceComponent } from './pages/financial/balance/components/form/form.component';

//Anlyze
import { AnalyzeComponent } from './pages/financial/analyze/analyze.component';
import { ListAnalyzeComponent } from './pages/financial/analyze/components/list/list.component';
import { FormAnalyzeComponent } from './pages/financial/analyze/components/form/form.component';

import { LineChartFinancialHarvestComponent } from './components/charts/line-chart-financial-harvest/line-chart-financial-harvest.component';
import { LineChartCommercializationComponent } from './components/charts/line-chart-commercialization/line-chart-commercialization.component';
import { FormCurrentAssetsComponent } from './pages/financial/current-assets/components/form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './pages/bid/dialog/dialog.component';



//import { FilterByInput } from './pages/patrimony/other-goods-rights/stock/components/list/filterByInput.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    RuralPropertyComponent,
    ListRuralPropertyComponent,
    FormRuralPropertyComponent,
    PatrimonialComponent,
    HeaderComponent,
    AreaComponent,
    LineChartComponent,
    SpinnerComponent,
    BidComponent,
    ListBidComponent,
    LivestockComponent,
    ListLiveStockComponent,
    FormLiveStockComponent,
    LivestockCardComponent,
    OtherGoodsRightsComponent,
    ListOtherGoodsRightsStockComponent,
    FormOtherGoodsRightsStockComponent,
    ListShareholdingComponent,
    ListOthersGoodsRightsFinancialComponent,
    AreaGoodsRightsComponent,
    StockComponent,
    ChartGroupComponent,
    SuppliesComponent,
    ListComponent,
    ShareholdingComponent,
    FinancialComponent,
    HarvestComponent,
    ListHarvestComponent,
    ChartGroupHarvestComponent,
    FormOthersGoodsRightsHarvestComponent,
    FormOthersGoodsRightsSuppliesComponent,
    FormOthersGoodsRightsFinancialComponent,
    FormOthersGoodsRightsShareholdingComponent,
    DebtsComponent,
    ListDebtComponent,
    FormDebtComponent,
    FinancialInformationComponent,
    ComparativeFlowComponent,
    ListComparativeFlowComponent,
    CurrentAssetsComponent,
    ListCurrentAssetsComponent,
    CommercializationComponent,
    FormCommercializationComponent,
    FormCostComponent,
    CommercializationCurrentHarvestComponent,
    ListCommercializationCurrentHarvestComponent,
    CommercializationFinancialHarvestComponent,
    ListComercializationFinancialHarvestComponent,
    CommercializationNextHarvestComponent,
    ListComercializationNextHarvestComponent,
    CommercializationProductionComponent,
    ListCommercializationProductionComponent,
    AreaDebtsComponent,
    ChartGroupDebtsComponent,
    FormCommercializationCurrentHarvestComponent,
    FormCommercializationNextHarvestComponent,
    FormCommercializationFinancialHarvestComponent,
    LineChartFinancialHarvestComponent,
    ChartGroupFinancialHarvestComponent,
    ChartGroupProductionComponent,
    LineChartCommercializationComponent,
    ChartGroupNextHarvestComponent,
    FormCommercializationProductionComponent,
    ChartGroupCurrentHarvestComponent,
    FormCurrentAssetsComponent,
    CashFlowComponent,
    ListCashFlowComponent,
    BalanceComponent,
    ListBalanceComponent,
    AnalyzeComponent,
    ListAnalyzeComponent,
    FormBalanceComponent,
    LineChartComparativeFlowComponent,
    ChartGroupComparativeFlowComponent,
    FormCashFlowComponent,
    FormAnalyzeComponent,
    DialogComponent,
  ],
  imports: [
    StoreModule.forRoot({
      bid: bidReducer,
      loginReducer: reducer
    }),
    NgxbootstrapModule,
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ChartsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatInputModule
  ],
  entryComponents: [
    DeleteModalComponent,
  ],
  exports: [
    NgxbootstrapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
