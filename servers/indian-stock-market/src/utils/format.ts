function safeString(value: unknown, fallback = "N/A"): string {
  if (typeof value === "string") {
    return value.trim() || fallback
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }
  if (Array.isArray(value) && value.length > 0) {
    return value.map(item => safeString(item)).join(", ")
  }
  if (value && typeof value === "object") {
    return JSON.stringify(value)
  }
  return fallback
}

function firstItems<T>(items: T[] | undefined, max = 5): T[] {
  return Array.isArray(items) ? items.slice(0, max) : []
}

function formatList(items: any[], formatItem: (item: any, index: number) => string, max = 5): string {
  return firstItems(items, max).map((item, index) => `${index + 1}. ${formatItem(item, index)}`).join("\n")
}

function formatTrending(response: any): string {
  const trending = response?.trending_stocks || response
  const topGainers = firstItems(trending?.top_gainers || [])
  const topLosers = firstItems(trending?.top_losers || [])

  const gainersText = topGainers.length
    ? formatList(topGainers, item => `${safeString(item.company_name)} (${safeString(item.ticker_id)}) — ${safeString(item.price)} INR, ${safeString(item.percent_change)}%`)
    : "No top gainers available"

  const losersText = topLosers.length
    ? formatList(topLosers, item => `${safeString(item.company_name)} (${safeString(item.ticker_id)}) — ${safeString(item.price)} INR, ${safeString(item.percent_change)}%`)
    : "No top losers available"

  return `Trending Stocks:\n\nTop Gainers:\n${gainersText}\n\nTop Losers:\n${losersText}`
}

function formatNews(response: any): string {
  const articles = Array.isArray(response) ? response : response?.articles || response?.data || []
  if (!Array.isArray(articles) || !articles.length) {
    return "No news items available"
  }

  const list = formatList(articles, item => {
    const title = safeString(item.title || item.heading || item.news || item.headline)
    const source = safeString(item.source || item.source_name || item.sourceName, "source unknown")
    return `${title} — ${source}`
  }, 5)

  return `Latest News:\n${list}`
}

function formatStockDetails(response: any): string {
  const name = safeString(response?.companyName || response?.name || response?.tickerId || response?.ticker_id)
  const industry = safeString(response?.industry)
  const bsePrice = safeString(response?.currentPrice?.BSE)
  const nsePrice = safeString(response?.currentPrice?.NSE)
  const change = safeString(response?.percentChange)
  const high = safeString(response?.yearHigh)
  const low = safeString(response?.yearLow)
  const newsCount = Array.isArray(response?.recentNews) ? response.recentNews.length : 0

  return `Company: ${name}\nIndustry: ${industry}\nBSE Price: ${bsePrice}\nNSE Price: ${nsePrice}\nPercent Change: ${change}%\n52-week High: ${high}\n52-week Low: ${low}\nRecent News Items: ${newsCount}`
}

function formatSimpleArray(response: any, label: string, fields: [string, string][]): string {
  const items = Array.isArray(response) ? response : response?.data || response?.results || []
  if (!Array.isArray(items) || !items.length) {
    return `No ${label.toLowerCase()} available`
  }

  const list = formatList(items, item => fields.map(([key, title]) => `${title}: ${safeString(item[key])}`).join(" | "))
  return `${label}:\n${list}`
}

function format52Week(response: any): string {
  const bse = response?.BSE_52WeekHighLow || response?.bse_52_week_high_low || {}
  const nse = response?.NSE_52WeekHighLow || response?.nse_52_week_high_low || {}

  const highBse = formatList(firstItems(bse?.high52Week || []), item => `${safeString(item.company)} (${safeString(item.ticker)}) — ${safeString(item.price)}`, 3)
  const lowBse = formatList(firstItems(bse?.low52Week || []), item => `${safeString(item.company)} (${safeString(item.ticker)}) — ${safeString(item.price)}`, 3)
  const highNse = formatList(firstItems(nse?.high52Week || []), item => `${safeString(item.company)} (${safeString(item.ticker)}) — ${safeString(item.price)}`, 3)
  const lowNse = formatList(firstItems(nse?.low52Week || []), item => `${safeString(item.company)} (${safeString(item.ticker)}) — ${safeString(item.price)}`, 3)

  return `52-Week High/Low:\n\nBSE High:\n${highBse || "None"}\n\nBSE Low:\n${lowBse || "None"}\n\nNSE High:\n${highNse || "None"}\n\nNSE Low:\n${lowNse || "None"}`
}

function formatStockTargetPrice(response: any): string {
  const priceTarget = response?.priceTarget || response?.price_target || {}
  const recommendation = response?.recommendation || {}

  return `Target Price Summary:\nMean: ${safeString(priceTarget?.Mean)}\nHigh: ${safeString(priceTarget?.High)}\nLow: ${safeString(priceTarget?.Low)}\nEstimates: ${safeString(priceTarget?.NumberOfEstimates)}\nRecommendation Mean: ${safeString(recommendation?.Mean)}\nRecommendation High: ${safeString(recommendation?.High)}\nRecommendation Low: ${safeString(recommendation?.Low)}`
}

function formatDefault(response: any): string {
  if (Array.isArray(response)) {
    return response.length ? formatList(response, item => safeString(item?.company || item?.ticker || item?.schemeName || item?.id || item?.name || JSON.stringify(item))) : "No results"
  }
  if (response && typeof response === "object") {
    return `Response keys: ${Object.keys(response).join(", ")}`
  }
  return safeString(response, "No data returned")
}

export function formatResponse(endpoint: string, response: any): string {
  switch (endpoint) {
    case "/trending":
      return formatTrending(response)
    case "/news":
      return formatNews(response)
    case "/stock":
      return formatStockDetails(response)
    case "/statement":
      return formatStockDetails(response)
    case "/commodities":
      return formatSimpleArray(response, "Commodities", [["commoditySymbol", "Symbol"], ["lastTradedPrice", "Price"]])
    case "/mutual_funds":
      return `Mutual Fund categories: ${Object.keys(response || {}).join(", ")}`
    case "/price_shockers":
      return formatSimpleArray(response, "Price Shockers", [["company", "Company"], ["ticker", "Ticker"], ["percent_change", "% Change"]])
    case "/BSE_most_active":
    case "/NSE_most_active":
      return formatSimpleArray(response, "Most Active Stocks", [["company", "Company"], ["ticker", "Ticker"], ["price", "Price"]])
    case "/fetch_52_week_high_low_data":
      return format52Week(response)
    case "/industry_search":
      return formatSimpleArray(response, "Industry Search Results", [["commonName", "Company"], ["mgSector", "Sector"], ["mgIndustry", "Industry"]])
    case "/mutual_fund_search":
      return formatSimpleArray(response, "Mutual Fund Search Results", [["schemeName", "Fund"], ["isin", "ISIN"]])
    case "/stock_forecasts":
      return `Forecast result keys: ${Object.keys(response || {}).join(", ")}`
    case "/historical_data":
      return `Historical dataset keys: ${Object.keys(response || {}).join(", ")}`
    case "/historical_stats":
      return `Historical stats keys: ${Object.keys(response || {}).join(", ")}`
    case "/corporate_actions":
      return formatSimpleArray(response, "Corporate Actions", [["action", "Action"], ["date", "Date"]])
    case "/stock_target_price":
      return formatStockTargetPrice(response)
    case "/mutual_funds_details":
      return `Fund name: ${safeString(response?.schemeName)}\nISIN: ${safeString(response?.isin)}\nCategory: ${safeString(response?.categoryId)}`
    case "/recent_announcements":
      return formatSimpleArray(response, "Recent Announcements", [["title", "Title"], ["date", "Date"]])
    case "/ipo":
      return formatSimpleArray(response, "IPO Data", [["companyName", "Company"], ["issuePrice", "Issue Price"], ["listingDate", "Listing Date"]])
    default:
      return formatDefault(response)
  }
}
