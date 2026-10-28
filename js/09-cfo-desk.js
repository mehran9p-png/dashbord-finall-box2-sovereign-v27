// =========================================================================
// 9. CFO DOLLAR DESK, PRACTICAL REBALANCE & TRANSACTION LEDGER
// =========================================================================
function renderCfoAndRebalanceSection(metricsObj) {
  const m = metricsObj || computeMetrics();
  const sma90 = 256800;
  const devPct = ((m.usdtRate - sma90) / sma90) * 100;
  const zone1 = Math.round(sma90 * 0.99);
  const bubble = Math.round(sma90 * 1.12);

  document.getElementById('cfoSma90Val').textContent = fmtNum(sma90) + ' ت';
  document.getElementById('cfoDeviationVal').textContent = (devPct >= 0 ? '+' : '') + fmtEn(devPct, 2) + '%';
  document.getElementById('cfoZone1Val').textContent = fmtNum(zone1) + ' ت';
  document.getElementById('cfoBubbleVal').textContent = fmtNum(bubble) + ' ت';

  const ctxUsd = document.getElementById('usdSmaChart');
  if (ctxUsd && window.Chart) {
    if (charts.usd) charts.usd.destroy();
    charts.usd = new Chart(ctxUsd, {
      type: 'line',
      data: {
        labels: ['۹۰ روز پیش', '۷۵ روز پیش', '۶۰ روز پیش', '۴۵ روز پیش', '۳۰ روز پیش', '۱۵ روز پیش', 'امروز'],
        datasets: [
          { label: 'نرخ اسپات تتر (تومان)', data: [236000, 242500, 249000, 254500, 261000, 265800, m.usdtRate], borderColor: '#10b981', tension: 0.3 },
          { label: 'میانگین متحرک ۹۰ روزه (SMA90)', data: [231000, 235500, 240200, 245000, 249800, 253900, sma90], borderColor: '#d4af37', borderDash: [5, 5], tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Vazirmatn' } } } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
        }
      }
    });
  }

  renderRebalanceDesk(m);
}

function renderRebalanceDesk(metricsObj) {
  const m = metricsObj || computeMetrics();
  const nonLoanTotal = m.stocksValueToman + m.stableToman + m.cashToman + m.nftsValueToman;

  const tw = {
    stocks: Number(document.getElementById('twStocks')?.value || state.targetWeights.stocks || 25),
    crypto: Number(document.getElementById('twCrypto')?.value || state.targetWeights.crypto || 40),
    cash: Number(document.getElementById('twCash')?.value || state.targetWeights.cash || 15),
    nfts: Number(document.getElementById('twNfts')?.value || state.targetWeights.nfts || 20)
  };

  const rows = [
    { key: 'stocks', name: 'سبد سهام بورس تهران', val: m.stocksValueToman, targetPct: tw.stocks, feeRate: 0.0049 },
    { key: 'crypto', name: 'استیبل‌کوین و کریپتو', val: m.stableToman, targetPct: tw.crypto, feeRate: 0.0025 },
    { key: 'cash', name: 'نقدینگی ریالی و کارگزاری', val: m.cashToman, targetPct: tw.cash, feeRate: 0.0 },
    { key: 'nfts', name: 'کلکسیون NFT تلگرام', val: m.nftsValueToman, targetPct: tw.nfts, feeRate: 0.025 }
  ];

  const tbody = document.getElementById('rebalanceTableBody');
  if (!tbody) return;
  tbody.innerHTML = rows
    .map((r) => {
      const curPct = nonLoanTotal > 0 ? (r.val / nonLoanTotal) * 100 : 0;
      const diffPct = curPct - r.targetPct;
      const diffToman = ((r.targetPct - curPct) / 100) * nonLoanTotal;
      const feeEst = Math.abs(diffToman) * r.feeRate;

      let actionHtml = '<span class="pill pill-cyan">در محدوده تعادل (±۲٪)</span>';
      if (diffPct > 2.0) {
        actionHtml = `<span class="pill pill-down">فروش ${fmtNum(Math.round(Math.abs(diffToman)))} ت (کارمزد: ${fmtNum(Math.round(feeEst))} ت)</span>`;
      } else if (diffPct < -2.0) {
        actionHtml = `<span class="pill pill-up">خرید ${fmtNum(Math.round(Math.abs(diffToman)))} ت (کارمزد: ${fmtNum(Math.round(feeEst))} ت)</span>`;
      }

      return `
        <tr>
          <td><strong>${escapeHtml(r.name)}</strong></td>
          <td class="maskable mono-num">${fmtNum(Math.round(r.val))} ت</td>
          <td class="mono-num">%${fmtEn(curPct, 1)}</td>
          <td class="mono-num">%${fmtEn(r.targetPct, 1)}</td>
          <td class="mono-num ${Math.abs(diffPct) <= 2 ? '' : diffPct > 0 ? 'warn' : 'up'}">${diffPct >= 0 ? '+' : ''}${fmtEn(diffPct, 1)}%</td>
          <td>${actionHtml}</td>
        </tr>
      `;
    })
    .join('');
}

function saveTargetWeights() {
  const s = Number(document.getElementById('twStocks')?.value || 25);
  const c = Number(document.getElementById('twCrypto')?.value || 40);
  const k = Number(document.getElementById('twCash')?.value || 15);
  const n = Number(document.getElementById('twNfts')?.value || 20);
  if (s + c + k + n !== 100) {
    showToast(`مجموع وزن‌های هدف باید ۱۰۰٪ باشد (مجموع فعلی: ${s + c + k + n}٪).`);
    return;
  }
  state.targetWeights = { stocks: s, crypto: c, cash: k, nfts: n };
  saveState();
  renderAll();
  showToast('وزن‌های هدف ریبالانس با موفقیت ذخیره شد.');
}

function saveTargetWealth() {
  const val = Number(document.getElementById('wealthTargetInput')?.value || 0);
  if (!val || val < 10000000) {
    showToast('لطفاً مبلغ هدف مالی معتبر (حداقل ۱۰ میلیون تومان) وارد کنید.');
    return;
  }
  state.meta.wealthTargetToman = val;
  saveState();
  renderAll();
  showToast(`هدف استقلال مالی روی ${fmtNum(val)} تومان تنظیم شد.`);
}

function renderLedgerSection() {
  const tbody = document.getElementById('ledgerTableBody');
  if (!tbody) return;
  const typeLabels = {
    BUY: { text: 'خرید (BUY)', cls: 'pill-up' },
    SELL: { text: 'فروش (SELL)', cls: 'pill-down' },
    DIVIDEND: { text: 'سود نقدی (DPS)', cls: 'pill-cyan' },
    DEPOSIT: { text: 'واریز وجه', cls: 'pill-indigo' },
    WITHDRAW: { text: 'برداشت وجه', cls: 'pill-warn' }
  };

  tbody.innerHTML = (state.ledger || [])
    .slice()
    .reverse()
    .map((tx) => {
      const t = typeLabels[tx.type] || { text: tx.type, cls: 'pill-cyan' };
      const total = (Number(tx.qty) || 0) * (Number(tx.priceToman) || 0) + (Number(tx.feeToman) || 0);
      return `
        <tr>
          <td class="mono-num">${escapeHtml(tx.date)}</td>
          <td><span class="pill ${t.cls}">${escapeHtml(t.text)}</span></td>
          <td><strong>${escapeHtml(tx.symbol)}</strong></td>
          <td class="mono-num">${fmtNum(tx.qty)}</td>
          <td class="maskable mono-num">${fmtNum(tx.priceToman)}</td>
          <td class="mono-num">${fmtNum(tx.feeToman || 0)}</td>
          <td class="maskable mono-num" style="font-weight:700;">${fmtNum(Math.round(total))} ت</td>
          <td>${escapeHtml(tx.note || '')}</td>
          <td>
            <button class="btn" style="min-height:30px; padding:4px 8px; font-size:0.74rem;" onclick="deleteLedgerTx('${escapeHtml(tx.id)}')">حذف</button>
          </td>
        </tr>
      `;
    })
    .join('');
}

function addLedgerTransaction() {
  const date = document.getElementById('txDateJalali')?.value.trim() || '1405/01/31';
  const type = document.getElementById('txType')?.value || 'BUY';
  const symbol = document.getElementById('txSymbol')?.value.trim() || 'دارایی';
  const qty = Number(document.getElementById('txQty')?.value || 0);
  const priceToman = Number(document.getElementById('txPrice')?.value || 0);
  const feeToman = Number(document.getElementById('txFee')?.value || 0);
  const note = document.getElementById('txNote')?.value.trim() || '';

  if (qty <= 0 || priceToman <= 0) {
    showToast('لطفاً تعداد و قیمت واحد معتبر وارد کنید.');
    return;
  }

  undoSnapshot = JSON.stringify(state);
  state.ledger.push({
    id: 'tx-' + Date.now(),
    date,
    dateIso: new Date().toISOString().slice(0, 10),
    type,
    symbol,
    qty,
    priceToman,
    feeToman,
    note
  });

  saveState();
  renderAll();
  showToast(`تراکنش ${symbol} در دفتر کل ثبت شد.`, true);
}

function deleteLedgerTx(id) {
  undoSnapshot = JSON.stringify(state);
  state.ledger = state.ledger.filter((t) => t.id !== id);
  saveState();
  renderAll();
  showToast('تراکنش حذف شد.', true);
}

function exportLedgerCsv() {
  const headers = ['Date,Type,Symbol,Qty,PriceToman,FeeToman,Note'];
  state.ledger.forEach((t) => {
    headers.push(`"${t.date}","${t.type}","${t.symbol}",${t.qty},${t.priceToman},${t.feeToman || 0},"${(t.note || '').replace(/"/g, '""')}"`);
  });
  const blob = new Blob(['\uFEFF' + headers.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wealth-ledger-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  showToast('فایل CSV دفتر کل دانلود شد.');
}
