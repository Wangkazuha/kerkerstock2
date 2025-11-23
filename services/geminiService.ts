

import { GoogleGenAI } from "@google/genai";
import { StockData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeStock = async (stockCode: string): Promise<StockData> => {
  const modelId = "gemini-2.5-flash";

  // Updated prompt for Traditional Chinese
  // Removed priceHistory request as we now use TradingView widget
  const prompt = `
    你是一位台灣證券交易所 (TWSE) 的專業金融分析師。
    
    任務：
    搜尋股票代碼 "${stockCode}" 的最新即時數據、財務指標和新聞。請全部使用繁體中文回答。
    
    必須優先參考的來源：
    1. TWSE (證交所) & OpenAPI - 用於本益比、股價淨值比、殖利率和每日交易資訊。
    2. MOPS (公開資訊觀測站) - 必要來源，用於獲取 "月營收" 和 "獲利能力" (毛利率/營業利益率/稅前純益率)。
    3. MoneyDJ (理財網) / HiStock - 用於新聞與即時報價。
    4. 辨識股票類別：明確指出該股票是 "上市" (TWSE) 還是 "上櫃" (OTC)。

    要求的輸出格式：
    僅返回一個有效的 JSON 物件。不要使用 Markdown 格式。所有文字敘述必須是繁體中文。
    
    JSON Schema:
    {
      "symbol": "字串 (例如 2330)",
      "name": "字串 (例如 台積電)",
      "market": "字串 (必須是 'TWSE' 或 'OTC'，代表上市或上櫃)",
      "price": "字串 (最新股價)",
      "change": "字串 (漲跌價)",
      "changePercent": "字串 (漲跌幅)",
      "updateTime": "字串 (例如 2023-10-27 13:30)",
      "peRatio": "字串 (本益比)",
      "pbRatio": "字串 (股價淨值比)",
      "dividendYield": "字串 (殖利率)",
      "sector": "字串 (產業類別)",
      "eps": "字串 (最新 EPS)",
      "aiSummary": "字串 (100字以內的繁體中文精簡分析摘要，請包含近期市場趨勢與觀察)",
      
      "revenueHistory": [
         { 
           "date": "YYYY/MM", 
           "revenue": number (僅數字，單位：新台幣十億元), 
           "mom": "字串 (月增率 e.g. +1.2%)", 
           "yoy": "字串 (單月年增率 e.g. +15.5%)",
           "cumulativeRevenueYoy": "字串 (累計營收年增率 e.g. +20.1% 若無直接數據請依據歷史推算)"
         },
         ... (嚴格生成過去 "12個月" 的數據)
      ],

      "marginHistory": [
         {
           "quarter": "YY-Q# (e.g. 23Q4)",
           "grossMargin": number (毛利率 %), 
           "operatingMargin": number (營業利益率 %),
           "preTaxMargin": number (稅前純益率 %),
           "netProfitMargin": number (稅後純益率 %)
         },
         ... (嚴格生成過去 "8個季度" 的數據)
      ],

      "news": [
        {
          "title": "字串 (繁體中文標題)",
          "source": "字串",
          "date": "字串",
          "url": "字串"
        },
        ... (最多 15 則新聞，必須嚴格按照日期由新到舊排序)
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    
    if (!text) {
        throw new Error("No response from AI");
    }

    const jsonString = extractJSON(text);
    const parsedData = JSON.parse(jsonString);
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sourceUrls = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((item: any) => item !== null);

    return {
      ...parsedData,
      sourceUrls: sourceUrls
    };

  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

function extractJSON(text: string): string {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error("Failed to parse JSON from AI response. Raw response: " + text);
  }
  
  return text.substring(start, end + 1);
}