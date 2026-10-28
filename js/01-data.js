// =========================================================================
// 1. DEFAULT INSTITUTIONAL PORTFOLIO & MARKET DATA (Sovereign V26)
// =========================================================================
const STORAGE_KEY = 'WEALTH_TERMINAL_PRO_V25_STATE';
const THEME_STORAGE_KEY = 'WEALTH_TERMINAL_THEME_V26';
const BRS_API_KEY = (window.APP_CONFIG && window.APP_CONFIG.BRS_API_KEY) || '';

const DEFAULT_STATE = {
  meta: {
    owner: 'Wealth Terminal Sovereign V26 — Institutional CFO Edition',
    lastUpdated: '2026-10-28T12:00:00Z',
    wealthTargetToman: 500000000,
    monthlyContributionToman: 8000000
  },
  fx: {
    usdtToman: 270100,
    freeUsdToman: 269020,
    gold18kToman: 17850000,
    emamiCoinToman: 194500000,
    paxgUsd: 2745.0,
    tedpix: 2845200
  },
  stocks: [
    { symbol: 'وفیروزه', name: 'سرمایه‌گذاری فیروزه', sector: 'سرمایه‌گذاری', qty: 17749, avgBuyPrice: 565, currentPrice: 581, dailyChange: -2.01, eps: 98, dps: 65, insCode: '55254206302462116', note: 'سهم بنیادی بنیان‌گذار' },
    { symbol: 'فپنتا', name: 'پنتا (فلزات اساسی)', sector: 'فلزات اساسی', qty: 1489, avgBuyPrice: 4450, currentPrice: 4704, dailyChange: 0.00, eps: 720, dps: 510, insCode: '17914401175772326', note: 'پوشش تورمی ریالی' },
    { symbol: 'شپدیس', name: 'پتروشیمی پردیس', sector: 'پتروشیمی', qty: 3139, avgBuyPrice: 1180, currentPrice: 1250, dailyChange: -2.95, eps: 240, dps: 210, insCode: '44891482026867833', note: 'دلاری و تقسیم سود بالا' },
    { symbol: 'کرومیت', name: 'فرآوری معدنی کرومیت', sector: 'کانه‌های فلزی', qty: 5000, avgBuyPrice: 560, currentPrice: 557, dailyChange: -2.96, eps: 88, dps: 60, insCode: '46741025610365789', note: 'نزدیک نقطه سر‌به‌سر' },
    { symbol: 'فهامون', name: 'سرمایه‌گذاری هامون', sector: 'سرمایه‌گذاری', qty: 3607, avgBuyPrice: 610, currentPrice: 718, dailyChange: 2.87, eps: 135, dps: 95, insCode: '38232437866669967', note: 'روند صعودی پرقدرت' },
    { symbol: 'فکور', name: 'فکور صنعت تهران', sector: 'مهندسی و معدنی', qty: 1240, avgBuyPrice: 590, currentPrice: 689, dailyChange: 2.99, eps: 112, dps: 80, insCode: '66442254613568889', note: 'پروژه‌های فولادی' },
    { symbol: 'فپردیس', name: 'فولاد پردیس', sector: 'فلزات اساسی', qty: 62, avgBuyPrice: 8200, currentPrice: 9677, dailyChange: 2.99, eps: 1540, dps: 1100, insCode: '41933952242799993', note: 'حجم کم - نوسانی' },
    { symbol: 'وسرمایه', name: 'سرمایه‌گذاری ملت', sector: 'سرمایه‌گذاری', qty: 658, avgBuyPrice: 430, currentPrice: 504, dailyChange: 2.86, eps: 74, dps: 50, insCode: '21963356012832211', note: 'پرتفوی متنوع' },
    { symbol: 'زشک', name: 'کشاورزی و دامپروری', sector: 'زراعت و غذایی', qty: 211, avgBuyPrice: 1190, currentPrice: 1411, dailyChange: 2.99, eps: 195, dps: 130, insCode: '61449234123698745', note: 'نگهداری میان‌مدت' },
    { symbol: 'سیمکات', name: 'سیم و کابل تبریز', sector: 'تجهیزات برقی', qty: 39, avgBuyPrice: 105, currentPrice: 4584, dailyChange: 4310.70, eps: 610, dps: 400, insCode: '32469128621155732', note: 'بازگشایی/افزایش سرمایه' },
    { symbol: 'فساپ', name: 'صنعتی و معدنی فساپ', sector: 'فلزات اساسی', qty: 212, avgBuyPrice: 420, currentPrice: 497, dailyChange: 2.90, eps: 82, dps: 55, insCode: '51617145879012365', note: 'سهم کوچک بنیادی' }
  ],
  crypto: {
    stablecoins: [
      { symbol: 'LUSD', name: 'Liquity USD', network: 'Ethereum Mainnet', balance: 406.90, pegUsd: 1.004 },
      { symbol: 'USDT', name: 'Tether USD', network: 'Ethereum Mainnet', balance: 5.49, pegUsd: 1.000 }
    ],
    watchlist: [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', priceUsd: 80018.57, change24h: 0.42, high90d: 91800, sma200: 75800, targetAllocUsd: 220, steps: [76500, 72000, 66500, 61000] },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', priceUsd: 2321.75, change24h: 0.25, high90d: 2880, sma200: 2480, targetAllocUsd: 120, steps: [2220, 2050, 1880, 1720] },
      { id: 'solana', symbol: 'SOL', name: 'Solana', priceUsd: 100.37, change24h: -0.77, high90d: 138, sma200: 112, targetAllocUsd: 74.02, steps: [95, 86, 78, 69] }
    ]
  },
  cash: {
    bankCashToman: 46000000,
    brokerBuyingPowerToman: 978278,
    targetUsdtEntryToman: 248000,
    cfoRegime: 'balanced',
    cfoFixedYieldPct: 31.5
  },
  nfts: [
    { id: 'nft-1', name: 'Plush Pepe Gift #104', collection: 'Telegram Collectibles', buyValueToman: 24000000, estimatedFloorToman: 27800000, liquidity: 'متوسط (Fragment)' },
    { id: 'nft-2', name: 'Fragment Username @...', collection: 'TON DNS / Handle', buyValueToman: 18000000, estimatedFloorToman: 19000000, liquidity: 'بالا' },
    { id: 'nft-3', name: 'Anonymous Number +888', collection: 'Telegram Numbers', buyValueToman: 14000000, estimatedFloorToman: 14800000, liquidity: 'بسیار بالا' }
  ],
  loan: {
    principalToman: 30000000,
    annualInterestRatePct: 23.0,
    termMonths: 12,
    startDateJalali: '1405/07/01',
    paidInstallments: 1,
    investedAssets: [
      { name: 'صندوق طلای عیار', initialToman: 14000000, currentToman: 16200000 },
      { name: 'بیت‌کوین / کریپتو', initialToman: 10000000, currentToman: 11500000 },
      { name: 'فپنتا و سهام', initialToman: 6000000, currentToman: 6300000 }
    ]
  },
  targetWeights: { stocks: 25, crypto: 40, cash: 15, nfts: 20 },
  ledger: [
    { id: 'tx-101', date: '1405/01/05', dateIso: '2026-03-25', type: 'DEPOSIT', symbol: 'IRT', qty: 1, priceToman: 95000000, feeToman: 0, note: 'سرمایه اولیه پورتفوی' },
    { id: 'tx-102', date: '1405/01/12', dateIso: '2026-04-01', type: 'BUY', symbol: 'وفیروزه', qty: 17749, priceToman: 565, feeToman: 37000, note: 'خرید پله‌ای وفیروزه' },
    { id: 'tx-103', date: '1405/01/18', dateIso: '2026-04-07', type: 'DIVIDEND', symbol: 'شپدیس', qty: 3139, priceToman: 210, feeToman: 0, note: 'واریز سود مجمع شپدیس (DPS)' },
    { id: 'tx-104', date: '1405/01/25', dateIso: '2026-04-14', type: 'BUY', symbol: 'فپنتا', qty: 1489, priceToman: 4450, feeToman: 24500, note: 'تکمیل پله فپنتا' }
  ],
  historySnapshots: [
    { date: '1404/10/01', grossToman: 198500000, usdRate: 241000 },
    { date: '1404/10/15', grossToman: 205400000, usdRate: 246500 },
    { date: '1404/11/01', grossToman: 212800000, usdRate: 251000 },
    { date: '1404/11/15', grossToman: 219600000, usdRate: 255200 },
    { date: '1404/12/01', grossToman: 226900000, usdRate: 259800 },
    { date: '1404/12/15', grossToman: 233500000, usdRate: 263400 },
    { date: '1405/01/01', grossToman: 238900000, usdRate: 266900 },
    { date: 'امروز', grossToman: 244324829, usdRate: 270100 }
  ]
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
let undoSnapshot = null;
let charts = {};
let autoSyncTimer = null;

// Live Price Engineering Telemetry State
const priceTelemetry = {
  lastRunIso: null,
  healthScore: 100,
  logs: ['[BOOT] Quantum Multi-Pipeline Price Engine V26 Ready.'],
  pipelines: {
    crypto: { name: 'کریپتو جهانی (BTC/ETH/SOL/PAXG)', provider: 'CoinGecko / Binance', status: 'READY', latencyMs: 112, updated: 'آماده' },
    fx: { name: 'نرخ تتر و دلار آزاد (USDT/IRT)', provider: 'Tetherland / Nobitex', status: 'READY', latencyMs: 145, updated: 'آماده' },
    gold: { name: 'طلای ۱۸ عیار و سکه (مثلث‌سازی زنده)', provider: 'PAXG×USDT Triangulation', status: 'READY', latencyMs: 18, updated: 'آماده' },
    bourse: { name: 'بورس تهران (۱۱ نماد TSETMC)', provider: 'BrsApi / TSETMC CDN', status: 'READY', latencyMs: 190, updated: 'آماده' }
  }
};

function appendTelemetryLog(msg) {
  const ts = new Date().toLocaleTimeString('en-US', { hour12: false });
  priceTelemetry.logs.unshift(`[${ts}] ${msg}`);
  if (priceTelemetry.logs.length > 40) priceTelemetry.logs.pop();
  const logText = priceTelemetry.logs.join('\n');
  const box1 = document.getElementById('priceDiagnosticReportBox');
  const box2 = document.getElementById('modalTelemetryLog');
  if (box1) box1.textContent = logText;
  if (box2) box2.textContent = logText;
}
