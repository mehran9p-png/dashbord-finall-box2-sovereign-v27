// =========================================================================
// 6. UI RENDERING PIPELINE (All 6 Tabs + Charts + Interactive Widgets)
// =========================================================================
function renderAll() {
  const m = computeMetrics();

  // Top Ticker Strip
  document.getElementById('stripUsdt').textContent = fmtNum(m.usdtRate) + ' ت';
  document.getElementById('stripUsd').textContent = fmtNum(state.fx.freeUsdToman) + ' ت';
  document.getElementById('stripGold').textContent = fmtNum(state.fx.gold18kToman) + ' ت';
  const btc = state.crypto.watchlist[0];
  const eth = state.crypto.watchlist[1];
  const sol = state.crypto.watchlist[2];
  document.getElementById('stripBtc').textContent = '$' + fmtEn(btc.priceUsd, 0);
  const btcChgEl = document.getElementById('stripBtcChg');
  btcChgEl.textContent = `(${btc.change24h >= 0 ? '+' : ''}${btc.change24h}%)`;
  btcChgEl.className = btc.change24h >= 0 ? 'up' : 'down';
  document.getElementById('stripEth').textContent = '$' + fmtEn(eth.priceUsd, 0);
  document.getElementById('stripSol').textContent = '$' + fmtEn(sol.priceUsd, 2);
  document.getElementById('stripTedpix').textContent = fmtNum(state.fx.tedpix);

  // Market Open/Close Status
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const isBourseOpen = day !== 4 && day !== 5 && hour >= 9.0 && hour <= 12.5;
  const clockBadge = document.getElementById('marketClockBadge');
  clockBadge.textContent = isBourseOpen ? '🟢 بورس تهران: باز • کریپتو ۲۴/۷' : '🌙 بورس تهران: بسته • کریپتو و تتر ۲۴/۷';
  clockBadge.className = 'pill ' + (isBourseOpen ? 'pill-up' : 'pill-cyan');

  // Top Alert Banner
  const alertBanner = document.getElementById('topAlertBanner');
  const alertText = document.getElementById('topAlertText');
  if ((m.hasAnomaly || m.bankCash > 10000000) && !window._alertDismissed) {
    alertBanner.classList.add('visible');
    alertText.textContent = `شما ${fmtNum(m.bankCash)} تومان وجه نقد بانکی با زیان خواب ماهانه ${fmtNum(Math.round(m.monthlyCashDragToman))} تومان دارید و نماد «سیمکات» نیز نیازمند بازبینی قیمت خرید پس از افزایش سرمایه است.`;
  } else {
    alertBanner.classList.remove('visible');
  }

  // Hero Bento
  document.getElementById('heroGrossToman').textContent = fmtNum(Math.round(m.grossToman)) + ' تومان';
  document.getElementById('heroGrossUsd').textContent = '$' + fmtEn(m.grossUsd, 2);
  document.getElementById('heroNetToman').textContent = fmtNum(Math.round(m.netToman)) + ' تومان';
  document.getElementById('xirrHeroBadge').textContent = `XIRR: %${fmtNum(m.xirrPct, 1)}+`;

  // Allocation Bar
  const segments = [
    { label: 'بورس تهران', val: m.stocksValueToman, color: '#10b981' },
    { label: 'استیبل‌کوین (Dry Powder)', val: m.stableToman, color: '#06b6d4' },
    { label: 'نقد ریالی', val: m.cashToman, color: '#d4af37' },
    { label: 'کلکسیون NFT', val: m.nftsValueToman, color: '#a855f7' },
    { label: 'سبد وام ۳۰م', val: m.loan.loanAssetsCurrent, color: '#6366f1' }
  ];
  const barEl = document.getElementById('heroAllocBar');
  const legEl = document.getElementById('heroAllocLegend');
  barEl.innerHTML = segments
    .map((s) => {
      const pct = m.grossToman > 0 ? ((s.val / m.grossToman) * 100).toFixed(1) : 0;
      return `<div class="alloc-seg" style="width:${pct}%; background:${s.color}" title="${s.label}: %${pct}"></div>`;
    })
    .join('');
  legEl.innerHTML = segments
    .map((s) => {
      const pct = m.grossToman > 0 ? ((s.val / m.grossToman) * 100).toFixed(1) : 0;
      return `<span><span class="legend-dot" style="background:${s.color}"></span>${s.label}: <strong>%${fmtNum(pct, 1)}</strong></span>`;
    })
    .join('');

  // Performance Matrix KPIs
  const todayEl = document.getElementById('kpiTodayStockPnl');
  todayEl.textContent = (m.stocksTodayPnlToman >= 0 ? '+' : '') + fmtNum(Math.round(m.stocksTodayPnlToman)) + ' ت';
  todayEl.className = 'kpi-box-val maskable mono-num ' + (m.stocksTodayPnlToman >= 0 ? 'up' : 'down');

  const totalStockPnlEl = document.getElementById('kpiTotalStockPnl');
  totalStockPnlEl.textContent = (m.stocksPnlToman >= 0 ? '+' : '') + fmtNum(Math.round(m.stocksPnlToman)) + ' ت';
  totalStockPnlEl.className = 'kpi-box-val maskable mono-num ' + (m.stocksPnlToman >= 0 ? 'up' : 'down');

  document.getElementById('kpiLoanNetSpread').textContent = '+' + fmtNum(Math.round(m.loan.netArbitrage)) + ' ت';
  document.getElementById('kpiDryPowderUsd').textContent = '$' + fmtEn(m.stableUsd + m.cashUsd, 2);

  // Financial Goal Widget
  const target = Number(state.meta.wealthTargetToman) || 500000000;
  const pctGoal = Math.min(100, Math.max(0, (m.grossToman / target) * 100));
  const remGoal = Math.max(0, target - m.grossToman);
  document.getElementById('goalPercentBadge').textContent = `%${fmtNum(pctGoal, 1)}`;
  document.getElementById('goalCurrentLabel').textContent = fmtNum(Math.round(m.grossToman / 1e6), 1) + ' میلیون ت';
  document.getElementById('goalTargetLabel').textContent = fmtNum(Math.round(target / 1e6), 1) + ' میلیون ت';
  document.getElementById('goalProgressFill').style.width = `${pctGoal}%`;
  document.getElementById('goalRemainingLabel').textContent = fmtNum(Math.round(remGoal)) + ' تومان';
  const monthlySave = Number(state.meta.monthlyContributionToman) || 8000000;
  const monthsToGoal = remGoal <= 0 ? 0 : Math.ceil(remGoal / (monthlySave + m.grossToman * 0.025));
  document.getElementById('goalEtaBadge').textContent =
    monthsToGoal === 0 ? '🎉 هدف محقق شد!' : `⏱️ تحقق: ${fmtNum(monthsToGoal)} ماه دیگر`;
  const targetInput = document.getElementById('wealthTargetInput');
  if (targetInput && !targetInput.value) targetInput.value = target;

  // Render Sub-Sections
  renderCommandTab(m, segments);
  renderCfoCashAdvisor(m);
  renderStocksSection(m);
  renderCryptoAndNftsSection(m);
  renderLoanSection(m);
  runStressSimulation(m);
  renderProjectionChart(m);
  renderCfoAndRebalanceSection(m);
  renderLedgerSection();
  renderPriceEngineeringPanels();
}

function renderCommandTab(m, segments) {
  const actions = [
    {
      title: '۱. حذف فوری خواب پول ۴۶.۹۸ میلیون تومانی (فرمان ارشد CFO)',
      desc: `نگهداری نقد در بانک ماهانه ${fmtNum(Math.round(m.monthlyCashDragToman))} تومان زیان فرصت دارد. ۳۵٪ آن را در صندوق درآمد ثابت روزشمار (۳۱.۵٪) و ۲۵٪ را در صندوق طلای عیار پارک کنید.`,
      badge: 'اولویت ۱ خزانه‌داری',
      cls: 'gold-border'
    },
    {
      title: '۲. شلیک پله اول شکار کف کریپتو (Dry Powder)',
      desc: `موجودی $${fmtEn(m.stableUsd, 2)} استیبل‌کوین (LUSD/USDT) آماده است. سفارش لیمیت پله اول BTC را روی $76,500 و ETH را روی $2,220 فعال نگه دارید.`,
      badge: 'آماده شلیک (Sniper)',
      cls: 'cyan-border'
    },
    {
      title: '۳. مدیریت سبد بورس و آربیتراژ مثبت وام ۳۰ میلیونی',
      desc: `کرومیت تنها ۰.۵٪ با میانگین خرید (۵۶۰ ت) فاصله دارد. ارزش دارایی‌های وام نیز به ۳۴ میلیون تومان رسیده و از کل بدهی وام عبور کرده است.`,
      badge: 'سیگنال سبدگردانی',
      cls: ''
    }
  ];
  document.getElementById('dailyActionsContainer').innerHTML = actions
    .map(
      (a) => `
      <div class="action-card ${a.cls}">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
          <strong style="font-size:0.85rem;">${escapeHtml(a.title)}</strong>
          <span class="pill pill-gold">${escapeHtml(a.badge)}</span>
        </div>
        <p style="font-size:0.78rem; color:var(--text-secondary);">${escapeHtml(a.desc)}</p>
      </div>
    `
    )
    .join('');

  const pillars = [
    { icon: '📊', name: 'سبد سهام بورس', val: m.stocksValueToman, sub: `۱۱ نماد • سود: +${fmtNum(Math.round(m.stocksPnlToman))} ت`, color: 'var(--emerald)' },
    { icon: '🛡️', name: 'استیبل‌کوین (اتریوم)', val: m.stableToman, sub: `$${fmtEn(m.stableUsd, 2)} (LUSD + USDT)`, color: 'var(--cyan)' },
    { icon: '🏛️', name: 'خزانه نقد ریالی', val: m.cashToman, sub: `معادل $${fmtEn(m.cashUsd, 1)} • آماده تخصیص CFO`, color: 'var(--gold-bright)' },
    { icon: '🎁', name: 'کلکسیون NFT تلگرام', val: m.nftsValueToman, sub: `۳ آیتم Fragment • سود: +۵.۶م`, color: 'var(--violet)' },
    { icon: '🏦', name: 'پورتفوی وام ۳۰ میلیونی', val: m.loan.loanAssetsCurrent, sub: `طلا + بیت‌کوین + سهام`, color: 'var(--indigo)' }
  ];
  document.getElementById('assetPillarsGrid').innerHTML = pillars
    .map(
      (p) => `
      <div class="card" style="padding:15px;">
        <div style="font-size:0.77rem; color:var(--text-secondary); margin-bottom:6px;">${p.icon} ${escapeHtml(p.name)}</div>
        <div class="maskable mono-num" style="font-size:1.1rem; font-weight:900; color:${p.color}; margin-bottom:4px;">${fmtNum(Math.round(p.val))} ت</div>
        <div style="font-size:0.72rem; color:var(--text-muted);">${escapeHtml(p.sub)}</div>
      </div>
    `
    )
    .join('');

  // Dual-Currency Growth Chart
  const snaps = state.historySnapshots || [];
  const labels = snaps.map((s) => s.date);
  const tomanData = snaps.map((s, idx) => (idx === snaps.length - 1 ? Math.round(m.grossToman / 1e6) : Math.round(s.grossToman / 1e6)));
  const usdData = snaps.map((s, idx) => (idx === snaps.length - 1 ? Number(m.grossUsd.toFixed(1)) : Number((s.grossToman / s.usdRate).toFixed(1))));

  const ctxDual = document.getElementById('wealthDualChart');
  if (ctxDual && window.Chart) {
    if (charts.dual) charts.dual.destroy();
    charts.dual = new Chart(ctxDual, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'ثروت کل (میلیون تومان)',
            data: tomanData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.14)',
            fill: true,
            tension: 0.35,
            yAxisID: 'y'
          },
          {
            label: 'ثروت واقعی به دلار ($ USD)',
            data: usdData,
            borderColor: '#d4af37',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
            tension: 0.35,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Vazirmatn' } } } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } }, grid: { color: 'rgba(148,163,184,0.08)' } },
          y: { type: 'linear', position: 'right', ticks: { color: '#10b981' }, grid: { color: 'rgba(148,163,184,0.08)' } },
          y1: { type: 'linear', position: 'left', ticks: { color: '#d4af37' }, grid: { drawOnChartArea: false } }
        }
      }
    });
  }

  const ctxDonut = document.getElementById('allocationDonutChart');
  if (ctxDonut && window.Chart) {
    if (charts.donut) charts.donut.destroy();
    charts.donut = new Chart(ctxDonut, {
      type: 'doughnut',
      data: {
        labels: segments.map((s) => s.label),
        datasets: [
          {
            data: segments.map((s) => Math.round(s.val)),
            backgroundColor: segments.map((s) => s.color),
            borderWidth: 2,
            borderColor: '#0c1018'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: {
          legend: { position: 'bottom', labels: { color: '#94a3b8', font: { family: 'Vazirmatn', size: 11 } } }
        }
      }
    });
  }
}

function renderStocksSection(metricsObj) {
  const m = metricsObj || computeMetrics();
  const query = normalizeFa(document.getElementById('stockSearchInput')?.value || '');
  const sortMode = document.getElementById('stockSortSelect')?.value || 'valueDesc';

  let list = m.enrichedStocks.filter((s) => {
    if (!query) return true;
    return normalizeFa(s.symbol).includes(query) || normalizeFa(s.name).includes(query) || normalizeFa(s.sector).includes(query);
  });

  list.sort((a, b) => {
    if (sortMode === 'pnlPctDesc') return b.pnlPct - a.pnlPct;
    if (sortMode === 'pnlPctAsc') return a.pnlPct - b.pnlPct;
    if (sortMode === 'dailyDesc') return b.dailyChange - a.dailyChange;
    return b.val - a.val;
  });

  const treemapEl = document.getElementById('stockTreemapContainer');
  if (treemapEl) {
    treemapEl.innerHTML = list
      .map((s) => {
        const weight = m.stocksValueToman > 0 ? ((s.val / m.stocksValueToman) * 100).toFixed(1) : 0;
        const bg =
          s.pnlPct >= 15
            ? 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(5,150,105,0.12))'
            : s.pnlPct >= 0
            ? 'linear-gradient(135deg, rgba(16,185,129,0.14), rgba(18,24,36,0.85))'
            : 'linear-gradient(135deg, rgba(244,63,94,0.22), rgba(18,24,36,0.85))';
        return `
          <div class="treemap-cell" style="background:${bg}">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:0.9rem;">${escapeHtml(s.symbol)}</strong>
              <span class="mono-num ${s.pnlPct >= 0 ? 'up' : 'down'}" style="font-size:0.78rem; font-weight:800;">
                ${s.pnlPct >= 0 ? '+' : ''}${fmtEn(s.pnlPct, 1)}%
              </span>
            </div>
            <div class="maskable mono-num" style="font-size:0.86rem; font-weight:700; margin:6px 0;">
              ${fmtNum(Math.round(s.val))} ت
            </div>
            <div style="font-size:0.7rem; color:var(--text-secondary); display:flex; justify-content:space-between;">
              <span>وزن: %${fmtNum(weight, 1)}</span>
              <span>روزانه: ${s.dailyChange >= 0 ? '+' : ''}${s.dailyChange}%</span>
            </div>
          </div>
        `;
      })
      .join('');
  }

  const tbody = document.getElementById('stocksTableBody');
  if (tbody) {
    tbody.innerHTML = list
      .map((s) => {
        const weight = m.stocksValueToman > 0 ? (s.val / m.stocksValueToman) * 100 : 0;
        let signalBadge = '<span class="pill pill-cyan">نگهداری (Hold)</span>';
        if (weight > 35) signalBadge = '<span class="pill pill-warn">وزن سنگین (>35%)</span>';
        else if (s.pnlPct < 0 && s.pnlPct > -5) signalBadge = '<span class="pill pill-up">نزدیک سر‌به‌سر (پله خرید)</span>';
        else if (s.pnlPct > 200) signalBadge = '<span class="pill pill-gold">اصلاح قیمت خرید</span>';

        return `
          <tr>
            <td>
              <strong>${escapeHtml(s.symbol)}</strong>
              <div style="font-size:0.72rem; color:var(--text-secondary);">${escapeHtml(s.sector)}</div>
            </td>
            <td class="mono-num">${fmtNum(s.qty)}</td>
            <td>
              <input type="number" class="inline-input maskable" value="${s.avgBuyPrice}"
                 onchange="updateStockBuyPrice('${escapeHtml(s.symbol)}', this.value)" aria-label="میانگین خرید ${escapeHtml(s.symbol)}" />
            </td>
            <td class="mono-num" style="font-weight:700;">${fmtNum(s.currentPrice)}</td>
            <td class="mono-num ${s.dailyChange >= 0 ? 'up' : 'down'}">${s.dailyChange >= 0 ? '+' : ''}${fmtEn(s.dailyChange, 2)}%</td>
            <td class="maskable mono-num" style="font-weight:800;">${fmtNum(Math.round(s.val))}</td>
            <td class="maskable mono-num ${s.pnl >= 0 ? 'up' : 'down'}">${s.pnl >= 0 ? '+' : ''}${fmtNum(Math.round(s.pnl))}</td>
            <td class="mono-num ${s.pnlPct >= 0 ? 'up' : 'down'}" style="font-weight:700;">${s.pnlPct >= 0 ? '+' : ''}${fmtEn(s.pnlPct, 1)}%</td>
            <td class="mono-num">%${fmtEn(weight, 1)}</td>
            <td>${signalBadge}</td>
            <td>
              <input type="text" class="inline-note" value="${escapeHtml(s.note || '')}"
                onchange="updateStockNote('${escapeHtml(s.symbol)}', this.value)" aria-label="یادداشت ${escapeHtml(s.symbol)}" />
            </td>
          </tr>
        `;
      })
      .join('');
  }

  const mobContainer = document.getElementById('mobileStocksContainer');
  if (mobContainer) {
    mobContainer.innerHTML = list
      .map((s, idx) => {
        const weight = m.stocksValueToman > 0 ? (s.val / m.stocksValueToman) * 100 : 0;
        return `
          <div class="m-stock-card" id="mstock-${idx}">
            <div class="m-stock-top">
              <div>
                <strong style="font-size:0.95rem;">${escapeHtml(s.symbol)}</strong>
                <span style="font-size:0.75rem; color:var(--text-secondary); margin-right:6px;">(${fmtNum(s.qty)} سهم)</span>
              </div>
              <div style="text-align:left;">
                <div class="maskable mono-num" style="font-weight:800;">${fmtNum(Math.round(s.val))} ت</div>
                <span class="mono-num ${s.pnlPct >= 0 ? 'up' : 'down'}" style="font-size:0.76rem; font-weight:700;">
                  ${s.pnlPct >= 0 ? '+' : ''}${fmtEn(s.pnlPct, 1)}%
                </span>
              </div>
            </div>
            <button class="btn" style="width:100%; min-height:34px; font-size:0.75rem;" onclick="toggleMobileStockCard('mstock-${idx}')">
              جزئیات و ویرایش میانگین خرید ▾
            </button>
            <div class="m-stock-details">
              <div>قیمت روز: <strong>${fmtNum(s.currentPrice)} ت</strong></div>
              <div>تغییر امروز: <strong class="${s.dailyChange >= 0 ? 'up' : 'down'}">${s.dailyChange}%</strong></div>
              <div>سود خالص: <strong class="maskable">${fmtNum(Math.round(s.pnl))} ت</strong></div>
              <div>وزن سبد: <strong>%${fmtEn(weight, 1)}</strong></div>
              <div style="grid-column: span 2; display:flex; gap:8px; align-items:center; margin-top:4px;">
                <span>خرید:</span>
                <input type="number" class="inline-input" value="${s.avgBuyPrice}" onchange="updateStockBuyPrice('${escapeHtml(s.symbol)}', this.value)" />
                <input type="text" class="inline-note" style="flex:1;" value="${escapeHtml(s.note || '')}" onchange="updateStockNote('${escapeHtml(s.symbol)}', this.value)" />
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }
}

function toggleMobileStockCard(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('expanded');
}

function updateStockBuyPrice(symbol, newVal) {
  const price = Number(newVal);
  if (isNaN(price) || price <= 0) return;
  const st = state.stocks.find((s) => s.symbol === symbol);
  if (st) {
    undoSnapshot = JSON.stringify(state);
    st.avgBuyPrice = price;
    saveState();
    renderAll();
    showToast(`میانگین خرید نماد ${symbol} به ${fmtNum(price)} تومان بروزرسانی شد.`, true);
  }
}

function updateStockNote(symbol, noteText) {
  const st = state.stocks.find((s) => s.symbol === symbol);
  if (st) {
    st.note = String(noteText).slice(0, 120);
    saveState();
    showToast(`یادداشت نماد ${symbol} ذخیره شد.`);
  }
}

function renderCryptoAndNftsSection(m) {
  document.getElementById('totalDryPowderBadge').textContent = `$${fmtEn(m.stableUsd, 2)} Dry Powder`;

  const bInput = document.getElementById('quickBankCashInput');
  const brkInput = document.getElementById('quickBrokerCashInput');
  if (bInput) bInput.value = state.cash.bankCashToman;
  if (brkInput) brkInput.value = state.cash.brokerBuyingPowerToman;

  const stBody = document.getElementById('stablecoinsTableBody');
  if (stBody) {
    stBody.innerHTML = state.crypto.stablecoins
      .map((sc) => {
        const usdVal = sc.balance * sc.pegUsd;
        const tomVal = usdVal * m.usdtRate;
        return `
          <tr>
            <td><strong>${escapeHtml(sc.symbol)}</strong> <span style="font-size:0.73rem; color:var(--text-secondary);">(${escapeHtml(sc.name)})</span></td>
            <td><span class="pill pill-indigo">${escapeHtml(sc.network)}</span></td>
            <td class="maskable mono-num" style="font-weight:700;">${fmtEn(sc.balance, 2)}</td>
            <td class="mono-num">$${fmtEn(sc.pegUsd, 3)}</td>
            <td class="maskable mono-num" style="color:var(--cyan); font-weight:700;">$${fmtEn(usdVal, 2)}</td>
            <td class="maskable mono-num">${fmtNum(Math.round(tomVal))} ت</td>
          </tr>
        `;
      })
      .join('');
  }

  const nftBody = document.getElementById('nftsTableBody');
  if (nftBody) {
    nftBody.innerHTML = state.nfts
      .map((n) => {
        const pnl = n.estimatedFloorToman - n.buyValueToman;
        const pct = n.buyValueToman > 0 ? (pnl / n.buyValueToman) * 100 : 0;
        return `
          <tr>
            <td><strong>${escapeHtml(n.name)}</strong><div style="font-size:0.72rem; color:var(--text-secondary);">${escapeHtml(n.collection)}</div></td>
            <td class="maskable mono-num">${fmtNum(n.buyValueToman)}</td>
            <td class="maskable mono-num" style="font-weight:700;">${fmtNum(n.estimatedFloorToman)}</td>
            <td class="maskable mono-num ${pnl >= 0 ? 'up' : 'down'}">+${fmtNum(pnl)} (%${fmtEn(pct, 1)})</td>
            <td><span class="pill pill-cyan">${escapeHtml(n.liquidity)}</span></td>
          </tr>
        `;
      })
      .join('');
  }

  const ladderEl = document.getElementById('cryptoDipLadderContainer');
  if (ladderEl) {
    const stepWeights = [0.20, 0.25, 0.25, 0.30];
    ladderEl.innerHTML = state.crypto.watchlist
      .map((c) => {
        const ddFromHigh = ((c.priceUsd - c.high90d) / c.high90d) * 100;
        const vsSma200 = ((c.priceUsd - c.sma200) / c.sma200) * 100;
        return `
          <div style="background:var(--bg-elevated); border:1px solid var(--border-muted); border-radius:12px; padding:13px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; flex-wrap:wrap; gap:6px;">
              <div>
                <strong style="font-size:0.95rem;">${escapeHtml(c.name)} (${escapeHtml(c.symbol)})</strong>
                <span class="mono-num" style="font-weight:800; color:var(--cyan); margin-right:8px;">$${fmtEn(c.priceUsd, 2)}</span>
              </div>
              <div style="font-size:0.75rem; display:flex; gap:8px;">
                <span class="pill pill-down">فاصله از سقف ۹۰ روزه: ${fmtEn(ddFromHigh, 1)}%</span>
                <span class="pill ${vsSma200 >= 0 ? 'pill-up' : 'pill-warn'}">نسبت به SMA200: ${vsSma200 >= 0 ? '+' : ''}${fmtEn(vsSma200, 1)}%</span>
              </div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:6px; font-size:0.74rem;">
              ${c.steps
                .map((stPrice, i) => {
                  const allocUsd = (c.targetAllocUsd * stepWeights[i]).toFixed(1);
                  const isHit = c.priceUsd <= stPrice;
                  return `
                    <div style="padding:7px; border-radius:8px; background:var(--bg-base); border:1px solid ${isHit ? 'var(--emerald)' : 'var(--border-muted)'}; text-align:center;">
                      <div style="color:var(--text-secondary);">پله ${i + 1} (${stepWeights[i] * 100}%)</div>
                      <div class="mono-num" style="font-weight:800; margin:2px 0;">$${fmtEn(stPrice)}</div>
                      <div class="mono-num" style="color:var(--emerald);">$${allocUsd}</div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>
        `;
      })
      .join('');
  }
}
