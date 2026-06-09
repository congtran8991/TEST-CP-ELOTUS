# 📊 Antigravity Binance Trading Dashboard (React, SatchelJS & MobX)

An exceptionally performant, real-time cryptocurrency trading terminal built with **React**, **TypeScript**, **MobX**, and **SatchelJS** connecting to the public Binance API. Features premium dark-themed styling, interactive charting, glowing order book depth ladders, and high-frequency WebSocket optimizations.

---

## 🚀 Key Features

- **⚡ High-Frequency Stream Throttling**: Batched and throttled state updates prevent browser lag from noisy WebSocket streams (tickers and order books).
- **📈 TradingView Chart Integration**: Candlestick rendering using **Lightweight Charts v5** by TradingView, with real-time candle tick injection and interval switching (1m, 5m, 15m, 1h, 4h, 1d).
- **📖 Live Order Book Depth**: Visualized bid/ask queues with glowing mid-market price, real-time spread computations, and visual cumulative depth bars.
- **🔍 Searchable Sidebar**: Reactive sidebar with active Binance spot markets (`USDT`, `BTC`, `ETH`). Filterable by quote asset, sorted by 24h volume, with dynamic neon green/red price flash animations.
- **🌐 i18n Bilingual Support**: Full Vietnamese / English language switching via a lightweight JSON dictionary system (`src/i18n/`).
- **🔗 Active Connection Status**: Dual WebSocket ping indicator lights for Market Ticker and Candlestick Chart streams, shown live in the header.
- **💎 Obsidian Glassmorphic Design**: Curated slate/deep obsidian palette, custom typography (Outfit, Orbitron, Inter), glassmorphic panels, and micro-animations.

---

## 🏗️ Architecture Design (SatchelJS / Flux Pattern)

The application strictly enforces **unidirectional data flow** using the SatchelJS pattern built on top of MobX:

```
        ┌──────────────────────────────────────────────────────────┐
        │                                                          │
        ▼                                                          │
┌───────────────┐        ┌─────────────┐        ┌──────────────┐   │
│  React View   │ ───►  │   Actions   │ ───►  │  Mutators    │   │
│  (Components) │        │ (What's New)│        │(Pure Updates)│   │
└───────────────┘        └─────────────┘        └──────────────┘   │
        ▲                       ▲                      │           │
        │                       │                      ▼           │
        │                       │               ┌──────────────┐   │
        │                       └───────────────│    Store     │ ──┘
        │                                       │ (MobX State) │
        │        ┌───────────────┐              └──────────────┘
        └────────│ Orchestrators │ ◄───────────────────┘
                 │(REST/Sockets) │
                 └───────────────┘
```

1. **Store (`src/store/store.ts`)**: Defines typed state (`AppState`, `TickerInfo`, `KlineData`, `OrderBookItem`) and initializes the single MobX observable store via `createStore`.
2. **Actions (`src/store/actions.ts`)**: Strongly typed intent creators — e.g. `setSelectedSymbolAction`, `updateOrderBookAction`, `updateTickersAction`.
3. **Mutators (`src/store/mutators.ts`)**: Pure handlers that mutate the store in response to actions — updating price maps, computing spread, and tracking price change direction for flash animations.
4. **Orchestrators (`src/store/orchestrators.ts`)**: Manages all side effects, REST calls, and WebSocket lifecycle:
   - Fetches `/ticker/24hr` (REST) to populate the initial sidebar.
   - Subscribes to `!miniTicker@arr` (WebSocket) for continuous ticker updates.
   - Dynamically tears down and recreates `<symbol>@kline_<interval>` and `<symbol>@depth20@100ms` streams on symbol/interval change.

---

## ⚡ Performance Optimizations

WebSockets emit up to 10–50 messages per second. Three practices keep the UI fluid:

1. **WebSocket Update Throttling**:
   - **Tickers**: Ticks are buffered in a local `Map` and flushed to the store every **400ms**.
   - **Order Book**: Bids/asks are buffered and committed every **250ms**, reducing repaint cycles significantly.
2. **Isolated MobX Observers & React.memo**:
   - `<TickerRow />` is a standalone observer — only the row with a changed price re-renders, leaving 200+ other rows untouched.
   - `<OrderBookRow />` uses `React.memo` to skip renders for unchanged price levels.
3. **Lightweight Charts Incremental Updates**:
   - Historical candles are loaded once via REST and set with `.setData()`.
   - Live ticks use `.update()` to patch only the latest candle — no full canvas redraws.

---

## 🛠️ Installation & Setup

Ensure you have **Node.js (v18+)** and **Yarn** installed.

### 1. Clone & Navigate
```bash
git clone https://github.com/congtran8991/TEST-CP-ELOTUS.git
git checkout main
cd TEST-CP-ELOTUS
```

### 2. Install Dependencies
```bash
// use node >= v22.0.0
yarn
```

### 3. Run in Development Mode
```bash
yarn dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
yarn build
```
Outputs a fully optimized bundle to the `dist/` directory.

---

## 🧱 Project Structure

```
├── src/
│   ├── assets/                     # Static graphics/icons
│   ├── components/
│   │   ├── Chart/
│   │   │   ├── index.tsx           # Lightweight Charts canvas & real-time sync logic
│   │   │   └── ToolBar.tsx         # Interval selector (1m, 5m, 15m, 1h, 4h, 1d)
│   │   ├── Layout/
│   │   │   └── Header.tsx          # Stats header, WebSocket ping badges & language toggle
│   │   ├── Markets/
│   │   │   ├── index.tsx           # Sidebar: search input, tab filters, symbol list
│   │   │   └── TickerRow.tsx       # Individual market row with price flash animations
│   │   └── OrderBook/
│   │       ├── index.tsx           # Order book container (asks + bids sections)
│   │       ├── OrderBookHeader.tsx # Column headers with i18n labels
│   │       ├── OrderBookRow.tsx    # Single bid/ask row with depth bar
│   │       └── MidMaketPrice.tsx   # Mid-market price & spread display
│   ├── constants/
│   │   └── types.ts                # Shared TypeScript type definitions
│   ├── i18n/
│   │   ├── index.ts                # Dictionary export (EN + VI)
│   │   ├── en.json                 # English translations
│   │   └── vi.json                 # Vietnamese translations
│   ├── services/
│   │   └── index.ts                # REST helpers: fetchInitialTickers, fetchHistoricalKlines
│   ├── store/
│   │   ├── actions.ts              # SatchelJS action creators
│   │   ├── mutators.ts             # Pure store mutation handlers
│   │   ├── orchestrators.ts        # Side effects: REST fetches & WebSocket lifecycle
│   │   ├── store.ts                # MobX observable store initialization
│   │   └── index.ts                # Store package entry point
│   ├── App.tsx                     # Root dashboard CSS Grid layout
│   ├── index.css                   # Global styles, design tokens & glassmorphic utilities
│   └── main.tsx                    # React application entry point
├── index.html                      # SPA root HTML wrapper
├── package.json                    # Dependencies & scripts
├── tsconfig.json                   # TypeScript configuration
└── vite.config.ts                  # Vite build configuration
```

---

## 🌐 Internationalization (i18n)

The UI supports **English** and **Vietnamese**. Language is stored in the MobX store (`currentLanguage`) and toggled via the `VI / EN` button in the header. No external i18n library is needed — a plain JSON dictionary pattern is used for simplicity.

| Key | EN | VI |
|---|---|---|
| `lastPrice` | Last Price | Giá gần nhất |
| `change24h` | 24h Change | Thay đổi 24h |
| `orderBookTitle` | Order Book | Sổ lệnh |
| `spread` | Spread | Độ chênh lệch |
| `searchPlaceholder` | Search markets... | Tìm kiếm thị trường... |
| `interval` | Interval | Khung thời gian |
| `liveFeeds` | Live Feeds | Dữ liệu trực tiếp |

---

## 🔌 WebSocket Streams

| Stream | Endpoint | Throttle | Purpose |
|---|---|---|---|
| All Mini Tickers | `!miniTicker@arr` | 400ms batched | Sidebar price & change updates |
| Kline (Candlestick) | `<symbol>@kline_<interval>` | Immediate | Real-time chart candle ticks |
| Order Book Depth | `<symbol>@depth20@100ms` | 250ms batched | Bid/ask depth ladder |

---

## 📦 Tech Stack

| Technology | Role |
|---|---|
| React 18 + TypeScript | UI framework |
| MobX | Reactive state management |
| SatchelJS | Flux-pattern (Actions / Mutators / Orchestrators) |
| Lightweight Charts v5 | High-performance candlestick charting |
| Vite | Development server & production bundler |
| Binance Public API | REST & WebSocket market data |


## Link Deloy

[https://demo-tradingview.netlify.app/]
