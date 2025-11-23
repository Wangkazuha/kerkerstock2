

import { InstitutionalData, MarginData, DailyPriceData, FinMindCombinedData } from "../types";

const FINMIND_API_URL = "https://api.finmindtrade.com/api/v4/data";
// User provided token
const API_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoiMjAyNS0xMS0yMyAxMzozNDoyMCIsInVzZXJfaWQiOiJjaGloY2h1bmdqbyIsImlwIjoiMTE4LjE2OC4yMTUuMTk4In0.KzP7-d56UOJAJUDlQ-b3NaVsKe0rv1gsDtHXbnQeJwg";

const getStartDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

export const fetchFinMindData = async (stockId: string): Promise<FinMindCombinedData[]> => {
  // Fetch more days to ensure we have enough trading days (weekends/holidays)
  const startDate = getStartDate(45); 

  try {
    // 1. Fetch Institutional Investors (三大法人)
    const instRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockInstitutionalInvestorsBuySell&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const instJson = await instRes.json();
    const instData: InstitutionalData[] = instJson.data || [];

    // 2. Fetch Margin Trading (融資融券)
    const marginRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockMarginPurchaseShortSale&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const marginJson = await marginRes.json();
    const marginData: MarginData[] = marginJson.data || [];

    // 3. Fetch Price (股價 - 包含 OHLC)
    const priceRes = await fetch(`${FINMIND_API_URL}?dataset=TaiwanStockPrice&data_id=${stockId}&start_date=${startDate}&token=${API_TOKEN}`);
    const priceJson = await priceRes.json();
    const priceData: DailyPriceData[] = priceJson.data || [];

    // Combine Data by Date
    // Get unique dates from price data (trading days)
    const dates = priceData.map(p => p.date).sort();
    // Keep only last 30 days maximum
    const recentDates = dates.slice(-30);

    const combined: FinMindCombinedData[] = recentDates.map(date => {
      // Filter Institutional Data for this date
      const dayInst = instData.filter(d => d.date === date);
      
      const calcNet = (name: string) => {
        const item = dayInst.find(d => d.name === name);
        // Ensure strictly number
        return item ? Number(item.buy || 0) - Number(item.sell || 0) : 0;
      };

      const foreignNet = calcNet("Foreign_Investor");
      const trustNet = calcNet("Investment_Trust");
      const dealerNet = calcNet("Dealer_Self") + calcNet("Dealer_Hedging");

      // Filter Margin Data
      const dayMargin = marginData.find(d => d.date === date);
      
      // Filter Price
      const dayPrice = priceData.find(d => d.date === date);
      
      // Safety check: Ensure prices are numbers and not zero/null which crashes charts
      const close = Number(dayPrice?.close || 0);
      const open = Number(dayPrice?.open || 0);
      const max = Number(dayPrice?.max || 0);
      const min = Number(dayPrice?.min || 0);

      return {
        date,
        foreignBuy: foreignNet,
        investmentTrustBuy: trustNet,
        dealerBuy: dealerNet,
        marginBalance: dayMargin ? Number(dayMargin.MarginPurchaseTodayBalance || 0) : 0,
        shortBalance: dayMargin ? Number(dayMargin.ShortSaleTodayBalance || 0) : 0,
        price: close,
        open: open,
        high: max,
        low: min,
      };
    });

    // Filter out invalid data (where price is 0) to prevent chart crashes
    const validData = combined.filter(d => d.price > 0).reverse(); // Newest first

    return validData;

  } catch (error) {
    console.error("Error fetching FinMind data:", error);
    return [];
  }
};
