// =========================================================================
// 3. FINANCIAL COMPUTATION ENGINE (Gross/Net, Loan PMT, XIRR, Cash Drag)
// =========================================================================
function computeMetrics() {
  const usdtRate = Number(state.fx.usdtToman) || 270100;

  // 1. Stocks
  let stocksValueToman = 0;
  let stocksCostToman = 0;
  let stocksTodayPnlToman = 0;
  let expectedAnnualDividendsToman = 0;
  let hasAnomaly = false;

  const enrichedStocks = state.stocks.map((s) => {
    const qty = Number(s.qty) || 0;
    const buy = Number(s.avgBuyPrice) || 0;
    const cur = Number(s.currentPrice) || 0;
    const dChg = Number(s.dailyChange) || 0;
    const dps = Number(s.dps) || 0;
    const val = qty * cur;
    const cost = qty * buy;
    const netVal = val * (1 - 0.0049);
    const pnl = netVal - cost;
    const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
    const todayPnl = val * (dChg / (100 + dChg));

    if (Math.abs(dChg) > 15 || pnlPct > 500) hasAnomaly = true;

    stocksValueToman += val;
    stocksCostToman += cost;
    stocksTodayPnlToman += todayPnl;
    expectedAnnualDividendsToman += qty * dps;

    return { ...s, val, cost, pnl, pnlPct };
  });

  // 2. Stablecoins (Dry Powder)
  let stableUsd = 0;
  state.crypto.stablecoins.forEach((sc) => {
    stableUsd += (Number(sc.balance) || 0) * (Number(sc.pegUsd) || 1);
  });
  const stableToman = stableUsd * usdtRate;

  // 3. Cash & CFO Cash Drag Math
  const bankCash = Number(state.cash.bankCashToman) || 0;
  const brokerCash = Number(state.cash.brokerBuyingPowerToman) || 0;
  const cashToman = bankCash + brokerCash;
  const cashUsd = cashToman / usdtRate;
  const riskFreeRate = (Number(state.cash.cfoFixedYieldPct) || 31.5) / 100;
  const annualCashDragToman = cashToman * riskFreeRate;
  const monthlyCashDragToman = annualCashDragToman / 12;
  const dailyCashDragToman = annualCashDragToman / 365;

  // 4. NFTs
  let nftsValueToman = 0;
  let nftsCostToman = 0;
  state.nfts.forEach((nft) => {
    nftsValueToman += Number(nft.estimatedFloorToman) || 0;
    nftsCostToman += Number(nft.buyValueToman) || 0;
  });

  // 5. Loan (30M @ 23%)
  const P = Number(state.loan.principalToman) || 30000000;
  const r = (Number(state.loan.annualInterestRatePct) || 23) / 100 / 12;
  const n = Number(state.loan.termMonths) || 12;
  const pmt = r > 0 ? (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : P / n;
  const totalLoanPayback = pmt * n;
  const paidCount = Math.min(n, Math.max(0, Number(state.loan.paidInstallments) || 1));
  const remainingDebt = Math.max(0, P * ((Math.pow(1 + r, n) - Math.pow(1 + r, paidCount)) / (Math.pow(1 + r, n) - 1)));

  let loanAssetsCurrent = 0;
  state.loan.investedAssets.forEach((a) => {
    loanAssetsCurrent += Number(a.currentToman) || 0;
  });

  const installmentRunwayMonths = pmt > 0 ? cashToman / pmt : 99;

  // Totals
  const grossToman = stocksValueToman + stableToman + cashToman + nftsValueToman + loanAssetsCurrent;
  const netToman = grossToman - remainingDebt;
  const grossUsd = grossToman / usdtRate;

  // XIRR
  const xirrPct = computePortfolioXirr(grossToman);

  return {
    usdtRate,
    stocksValueToman,
    stocksCostToman,
    stocksPnlToman: stocksValueToman - stocksCostToman,
    stocksTodayPnlToman,
    expectedAnnualDividendsToman,
    enrichedStocks,
    hasAnomaly,
    stableUsd,
    stableToman,
    bankCash,
    brokerCash,
    cashToman,
    cashUsd,
    annualCashDragToman,
    monthlyCashDragToman,
    dailyCashDragToman,
    installmentRunwayMonths,
    nftsValueToman,
    nftsCostToman,
    loan: {
      principal: P,
      pmt,
      totalLoanPayback,
      paidCount,
      remainingDebt,
      loanAssetsCurrent,
      netArbitrage: loanAssetsCurrent - P
    },
    grossToman,
    netToman,
    grossUsd,
    xirrPct
  };
}

function computePortfolioXirr(currentGrossToman) {
  // Base cost-basis anchor + user-added external cashflows for accurate Newton-Raphson XIRR
  const flows = [{ date: new Date('2026-03-25'), amount: -224800000 }];
  state.ledger.forEach((tx) => {
    if (['tx-101', 'tx-102', 'tx-103', 'tx-104'].includes(tx.id)) return;
    const dt = new Date(tx.dateIso || '2026-04-20');
    const total = (Number(tx.qty) || 0) * (Number(tx.priceToman) || 0);
    if (tx.type === 'DEPOSIT') {
      flows.push({ date: dt, amount: -Math.abs(total) });
    } else if (tx.type === 'WITHDRAW' || tx.type === 'DIVIDEND') {
      flows.push({ date: dt, amount: Math.abs(total) });
    }
  });
  flows.push({ date: new Date('2026-10-28'), amount: currentGrossToman });

  const t0 = flows[0].date.getTime();
  let rate = 0.35;
  for (let iter = 0; iter < 40; iter++) {
    let f = 0;
    let df = 0;
    for (const cf of flows) {
      const years = Math.max(0.05, (cf.date.getTime() - t0) / (365.25 * 86400000));
      const denom = Math.pow(1 + rate, years);
      f += cf.amount / denom;
      df -= (years * cf.amount) / Math.pow(1 + rate, years + 1);
    }
    if (Math.abs(df) < 1e-9) break;
    const next = rate - f / df;
    if (Math.abs(next - rate) < 1e-5) {
      rate = next;
      break;
    }
    rate = Math.max(-0.8, Math.min(5.0, next));
  }
  return Math.round(rate * 1000) / 10;
}
