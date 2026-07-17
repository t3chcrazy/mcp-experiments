# MCP Servers Monorepo

This repository contains a small monorepo of Model Context Protocol (MCP) servers built with TypeScript and Node.js. It currently includes:

- Weather MCP server
- Indian stock market MCP server
- Shared core package for common utilities

## What is an MCP server?

Model Context Protocol (MCP) servers expose tools that can be consumed by MCP-compatible clients. These servers run over STDIO and provide structured tools for different domains.

## Project structure

```text
.
├── packages/
│   └── mcp-core/           # Shared core package
├── servers/
│   ├── indian-stock-market/  # Indian stock market data tools
│   └── weather/             # Weather forecasting and alerts tools
├── package.json             # Root workspace scripts
├── pnpm-workspace.yaml      # pnpm workspace configuration
└── turbo.json               # Turbo repo configuration
```

## Available servers

### Weather server

The weather server provides tools to retrieve:

- Weather alerts for a U.S. state
- Forecast data for a given latitude/longitude

### Indian stock market server

The Indian stock market server provides tools for:

- Trending stocks
- Market news
- Stock details and statements
- Mutual fund data
- Commodities and market movers
- IPO and corporate action data
- Historical and forecast data

## Getting started

### Prerequisites

- Node.js 18+
- pnpm

### Install dependencies

```bash
pnpm install
```

### Build all packages

```bash
pnpm build
```

### Run the development workflow

```bash
pnpm dev
```

## Build individual servers

### Weather server

```bash
cd servers/weather
pnpm build
```

### Indian stock market server

```bash
cd servers/indian-stock-market
pnpm build
```

## Usage

Each server is exposed as a CLI entry point after build:

- Weather: `weather`
- Indian stock market: `indian-stock-market`

These servers are designed to be used with an MCP client that can connect to STDIO-based servers.

## Development notes

- The workspace uses `pnpm` with Turbo for orchestration.
- TypeScript source files are located under `src/` for each server.
- Compiled output is emitted to `build/`.

## License

This project is licensed under the ISC license.
