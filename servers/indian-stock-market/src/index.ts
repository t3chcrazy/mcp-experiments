import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { makeAPIRequest } from './utils/api.js'
import { formatResponse } from './utils/format.js'

const server = new McpServer({
  name: "Indian Stock Market MCP",
  version: "1.0.0",
})

function registerEndpointTool(options: {
  toolName: string
  description: string
  endpoint: string
  inputSchema?: Record<string, unknown>
}) {
  const toolOptions: Record<string, unknown> = {
    description: options.description,
  }

  if (options.inputSchema) {
    toolOptions.inputSchema = options.inputSchema
  }

  const handler = async (input: Record<string, unknown> = {}) => {
    const params = Object.entries(input).reduce(
      (acc, [key, value]) => {
        if (value === undefined || value === null || value === "") {
          return acc
        }
        return {
          ...acc,
          [key]: String(value),
        }
      },
      {} as Record<string, string>,
    )

    const response = await makeAPIRequest(options.endpoint, params)
    console.error(`${options.toolName} response:`, response)
    return {
      content: [
        {
          type: "text",
          text: formatResponse(options.endpoint, response),
        },
      ],
    }
  }

  server.registerTool(
    options.toolName,
    toolOptions,
    handler as any,
  )
}

registerEndpointTool({
  toolName: "trending_stocks",
  description: "Get trending stocks in the Indian stock market",
  endpoint: "/trending",
})

registerEndpointTool({
  toolName: "news",
  description: "Get the latest Indian stock market news",
  endpoint: "/news",
})

registerEndpointTool({
  toolName: "stock_details",
  description: "Get company stock details by name",
  endpoint: "/stock",
  inputSchema: {
    name: z.string().nonempty().describe("Company name, shortened name or search term"),
  },
})

registerEndpointTool({
  toolName: "statement",
  description: "Get stock statement data",
  endpoint: "/statement",
  inputSchema: {
    name: z.string().nonempty().describe("Company or stock name"),
  },
})

registerEndpointTool({
  toolName: "commodities",
  description: "Get commodities market data",
  endpoint: "/commodities",
})

registerEndpointTool({
  toolName: "mutual_funds",
  description: "Get mutual funds market data",
  endpoint: "/mutual_funds",
})

registerEndpointTool({
  toolName: "price_shockers",
  description: "Get stocks with significant price shocks",
  endpoint: "/price_shockers",
})

registerEndpointTool({
  toolName: "bse_most_active",
  description: "Get the most active BSE stocks",
  endpoint: "/BSE_most_active",
})

registerEndpointTool({
  toolName: "nse_most_active",
  description: "Get the most active NSE stocks",
  endpoint: "/NSE_most_active",
})

registerEndpointTool({
  toolName: "fetch_52_week_high_low_data",
  description: "Get 52-week high/low stock data",
  endpoint: "/fetch_52_week_high_low_data",
})

registerEndpointTool({
  toolName: "industry_search",
  description: "Search companies by industry",
  endpoint: "/industry_search",
  inputSchema: {
    query: z.string().nonempty().describe("Search term for industry search"),
  },
})

registerEndpointTool({
  toolName: "mutual_fund_search",
  description: "Search mutual funds",
  endpoint: "/mutual_fund_search",
  inputSchema: {
    query: z.string().nonempty().describe("Search term for mutual fund search"),
  },
})

registerEndpointTool({
  toolName: "stock_forecasts",
  description: "Get stock forecast data",
  endpoint: "/stock_forecasts",
  inputSchema: {
    stock_id: z.string().nonempty().describe("Stock identifier"),
    measure_code: z.string().nonempty().describe("Forecast measure code"),
    period_type: z.string().nonempty().describe("Period type, e.g. Annual or Interim"),
    data_type: z.string().nonempty().describe("Data type, e.g. Actuals or Estimates"),
    age: z.string().nonempty().describe("Data age, e.g. OneWeekAgo, ThirtyDaysAgo"),
  },
})

registerEndpointTool({
  toolName: "historical_data",
  description: "Get historical stock data",
  endpoint: "/historical_data",
  inputSchema: {
    stock_name: z.string().nonempty().describe("Stock symbol or name"),
    period: z.string().optional().describe("Time period, e.g. 1m, 6m, 1yr, 3yr, 5yr, 10yr, max"),
    filter: z.string().optional().describe("Optional filter, e.g. price, pe, sm, evebitda, ptb, mcs"),
  },
})

registerEndpointTool({
  toolName: "historical_stats",
  description: "Get historical statistics for a stock",
  endpoint: "/historical_stats",
  inputSchema: {
    stock_name: z.string().nonempty().describe("Stock symbol or name"),
    stats: z.string().nonempty().describe("Stats type, e.g. quarter_results, yoy_results, balancesheet, cashflow, ratios, shareholding_pattern_quarterly, shareholding_pattern_yearly"),
  },
})

registerEndpointTool({
  toolName: "corporate_actions",
  description: "Get corporate actions data",
  endpoint: "/corporate_actions",
  inputSchema: {
    name: z.string().nonempty().describe("Company or stock name"),
  },
})

registerEndpointTool({
  toolName: "stock_target_price",
  description: "Get stock target price and analyst recommendations",
  endpoint: "/stock_target_price",
  inputSchema: {
    stock_id: z.string().nonempty().describe("Stock identifier"),
  },
})

registerEndpointTool({
  toolName: "mutual_funds_details",
  description: "Get mutual fund details",
  endpoint: "/mutual_funds_details",
  inputSchema: {
    id: z.string().nonempty().describe("Mutual fund identifier"),
  },
})

registerEndpointTool({
  toolName: "recent_announcements",
  description: "Get recent corporate announcements",
  endpoint: "/recent_announcements",
})

registerEndpointTool({
  toolName: "ipo_data",
  description: "Get IPO data",
  endpoint: "/ipo",
})

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("Indian Stock Market MCP running on STDIO")
}

main().catch(error => {
  console.log("Fatal error", error)
  process.exit()
})