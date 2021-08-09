import { Pagination } from '../common/pagination';

export const BASE_URL = 'https://apirbb.l3.com.br/api/';

export const queryParams = (pagination?: Pagination, search?: string, bidId?: string) => {
  let queryParams = '';

  if (pagination) {
    queryParams = `?page=${pagination.page}&size=${pagination.pageSize}`;
  }

  if (search) {
    if (queryParams === '') {
      queryParams = `?search=${search}`;
    } else {
      queryParams = `${queryParams}&search=${search}`;
    }
  }

  if (bidId) {
    if (queryParams === '') {
      queryParams = `?bid_id=${bidId}`;
    } else {
      queryParams = `${queryParams}&bid_id=${bidId}`;
    }
  }

  return queryParams;
};

export const urlWithQueryParams = (
  url: string,
  pagination?: Pagination,
  search?: string,
  bidId?: string) => `${url}${queryParams(pagination, search, bidId)}`;

// ToDo: move to a global path.
export const downloadPdf = `${BASE_URL}/rural-properties/pdf`;
export const downloadExcel = `${BASE_URL}/rural-properties/excel`;

export const bidUrl = `${BASE_URL}/bid`;

export const ruralPropertyUrl = `${BASE_URL}/rural-properties`;
export const ruralPropertyAreaUrl = `${ruralPropertyUrl}/area`;
export const ruralPropertyOwnAreaUrl = `${ruralPropertyUrl}/ownAreaValues`;
export const ruralPropertyRentedAreaUrl = `${ruralPropertyUrl}/rentedAreaValues`;

export const liveStockUrl = `${BASE_URL}/livestocks`;
export const liveStockTotalUrl = `${liveStockUrl}/total`;

export const othersGoodsRightsUrl = `${BASE_URL}/others-goods-rights-`;

export const othersGoodsRightsStockUrl = `${othersGoodsRightsUrl}stock`;
export const othersGoodsRightsStockTotalQuantityUrl = `${othersGoodsRightsStockUrl}/totalQuantity`;
export const othersGoodsRightsStockTotalAmountUrl = `${othersGoodsRightsStockUrl}/totalAmount`;
export const othersGoodsRightsStockSeedsUrl = `${othersGoodsRightsStockUrl}/seeds`;

export const othersGoodsRightsHarvestUrl = `${othersGoodsRightsUrl}harvest`;
export const othersGoodsRightsHarvestTotalAreaUrl = `${othersGoodsRightsHarvestUrl}/totalArea`;
export const othersGoodsRightsHarvestTotalBalanceUrl = `${othersGoodsRightsHarvestUrl}/totalBalance`;

export const othersGoodsRightsSuppliesUrl = `${othersGoodsRightsUrl}supplies`;

export const othersGoodsRightsFinancialUrl = `${othersGoodsRightsUrl}financial`;

export const othersGoodsRightsShareholdingUrl = `${othersGoodsRightsUrl}shareholding`;

export const debtsUrl = `${BASE_URL}/debt`;
export const debtsDebtPeriodUrl = `${debtsUrl}/debtPeriod`;
export const debtsLongShortPeriod = `${debtsUrl}/long-short`;

export const bankUrl = `${BASE_URL}/bank`;

export const debtTypeUrl = `${BASE_URL}/debtType`;

export const debtPurposeUrl = `${BASE_URL}/debtPurpose`;


export const harvestUrl = `${BASE_URL}/harvest`;
export const harvestIndicatorUrl = 'indicator';
export const financialHarvestCharsValuesUrl = `${harvestUrl}/chartValues`;
export const currentHarvestCharsValuesUrl = `${harvestUrl}/chartValues`;

export const nextHarvestUrl = `${BASE_URL}/next-harvest`;
export const nextHarvestLineCharsValuesUrl = `${nextHarvestUrl}/lineChartValues`;

export const newCurrentHarvest = `${BASE_URL}/new-current-harvest`;
export const newCurrentHarvestTotal = `${BASE_URL}/new-current-harvest/total`;
export const newCurrentHarvestAsset = `${BASE_URL}/new-current-harvest/asset`;

export const productionUrl = `${BASE_URL}/production`;
export const productionResumeUrl = `${productionUrl}/resume`;
export const productionLineCharsValuesUrl = `${productionUrl}/lineChartValues`;

export const cashFlowUrl = `${BASE_URL}/cash-flow`;
export const cashFlowCostUrl = `${cashFlowUrl}/cost`;
export const cashFlowEbtidaUrl = `${cashFlowUrl}/ebtida`;
export const cashFlowRevenueUrl = `${cashFlowUrl}/revenue`;
export const cashFlowIndicatorUrl = `${cashFlowUrl}/indicator`;

export const balanceUrl = `${BASE_URL}/balance`;
export const balanceCashFlowUrl = `${balanceUrl}/cash-flow`;

export const indexUrl = `${BASE_URL}/index`;
export const indexBalanceUrl = `${indexUrl}/balance`;
export const indexCashFlowUrl = `${indexUrl}/cash-flow`;

export const analyzeUrl = `${BASE_URL}/analyze`;

export const comparativeFlow = `${BASE_URL}/comparative-flow`;
export const comparativeFlowLineCharsValuesUrl = `${comparativeFlow}/lineChartValues`;

export const assetTypeUrl = `${BASE_URL}/asset-type`;

export const balanceTypeUrl = `${BASE_URL}/balance-type`;

export const analyzeAccountTypeUrl = `${BASE_URL}/analyze-account-type`;


