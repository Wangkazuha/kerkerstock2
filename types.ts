

export interface StockData {
  symbol: string;
  name: string;
  market: string; // "TWSE" (上市) or "OTC" (上櫃)
  price: string;
  change: string;
  changePercent: string;
  updateTime: string;
  marketCap?: string;
  peRatio?: string; // Price-to-Earnings
  pbRatio?: string; // Price-to-Book
  dividendYield?: string;
  sector?: string;
  
  // Removed manual priceHistory array as we use TradingView widget
  
  // Financials
  eps?: string;
  
  // New metrics requested for charts
  // 12 Months of Revenue
  revenueHistory: Array<{
    date: string; // e.g. "2023/10"
    revenue: number; // Amount (usually in Billions or Millions)
    mom: string; // Month over Month %
    yoy: string; // Year over Year %
    cumulativeRevenueYoy?: string; // New: Cumulative Year over Year %
  }>;

  // 8 Quarters of Margins
  marginHistory: Array<{
    quarter: string; // e.g. "23Q4"
    grossMargin: number; // % New: Gross Margin (毛利率)
    operatingMargin: number; // %
    preTaxMargin?: number; // % Pre-tax Profit Margin
    netProfitMargin: number; // %
  }>;
  
  // Analysis
  aiSummary: string;
  
  // News
  news: Array<{
    title: string;
    source: string;
    date: string;
    url: string;
  }>;
  
  // Sources utilized by Grounding
  sourceUrls: Array<{ title: string; uri: string }>;
}

export interface SearchState {
  query: string;
  loading: boolean;
  error: string | null;
  data: StockData | null;
}

// FinMind Data Types
export interface InstitutionalData {
  date: string;
  stock_id: string;
  buy: number;
  sell: number;
  name: string; // Foreign_Investor, Investment_Trust, Dealer_Self, etc.
}

export interface MarginData {
  date: string;
  stock_id: string;
  MarginPurchaseTodayBalance: number;
  ShortSaleTodayBalance: number;
}

export interface DailyPriceData {
  date: string;
  stock_id: string;
  close: number;
  open: number;
  max: number;
  min: number;
}

export interface FinMindCombinedData {
  date: string;
  foreignBuy: number; // Foreign Investor Net Buy
  investmentTrustBuy: number; // Investment Trust Net Buy
  dealerBuy: number; // Dealer Net Buy
  marginBalance: number; // Margin Purchase Balance
  shortBalance: number; // Short Sale Balance
  price: number; // Close price
  open: number;
  high: number;
  low: number;
}