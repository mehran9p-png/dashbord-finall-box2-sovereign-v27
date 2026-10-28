// =========================================================================
// 8. MARKET STRESS-TEST & 5-YEAR WEALTH PROJECTOR
// =========================================================================
function resetStressSliders() {
  const m = computeMetrics();
  document.getElementById('simUsdSlider').value = m.usdtRate;
  document.getElementById('simBtcSlider').value = Math.round(state.crypto.watchlist[0].priceUsd);
  document.getElementById('simBourseSlider').value = 0;
  document.getElementById('simNftSlider').value = 0;
  runStressSimulation(m);
}

function runStressSimulation(metricsObj) {
  const m = metricsObj || computeMetrics();
  const simUsd = Number(document.getElementById('simUsdSlider')?.value || m.usdtRate);
  const simBtc = Number(document.getElementById('simBtcSlider')?.value || 80018);
  const simBoursePct = Number(document.getElementById('simBourseSlider')?.value || 0);
  const simNftPct = Number(document.getElementById('simNftSlider')?.value || 0);

  document.getElementById('simUsdLabel').textContent = fmtNum(simUsd) + ' تومان';
  document.getElementById('simBtcLabel').textContent = '$' + fmtEn(simBtc);
  document.getElementById('simBourseLabel').textContent = (simBoursePct >= 0 ? '+' : '') + simBoursePct + '%';
  document.getElementById('simNftLabel').textContent = (simNftPct >= 0 ? '+' : '') + simNftPct + '%';

  const usdRatio = simUsd / m.usdtRate;
  const btcRatio = simBtc / (state.crypto.watchlist[0].priceUsd || 80018);

  const simStocks = m.stocksValueToman * (1 + simBoursePct / 100);
  const simStable = m.stableUsd * simUsd;
  const simCash = m.cashToman;
  const simNfts = m.nftsValueToman * usdRatio * (1 + simNftPct / 100);
  const simLoanAssets =
    16200000 * usdRatio * (1 + simNftPct / 200) +
    11500000 * usdRatio * btcRatio +
    6300000 * (1 + simBoursePct / 100);

  const simGross = simStocks + simStable + simCash + simNfts + simLoanAssets;
  const delta = simGross - m.grossToman;
  const deltaPct = m.grossToman > 0 ? (delta / m.grossToman) * 100 : 0;

  document.getElementById('simResultGrossToman').textContent = fmtNum(Math.round(simGross)) + ' ت';
  const deltaEl = document.getElementById('simResultDeltaToman');
  deltaEl.textContent = `${delta >= 0 ? '+' : ''}${fmtNum(Math.round(delta))} ت (${delta >= 0 ? '+' : ''}${fmtEn(deltaPct, 1)}%)`;
  deltaEl.className = 'kpi-box-val maskable mono-num ' + (delta >= 0 ? 'up' : 'down');
}

function renderProjectionChart(metricsObj) {
  const m = metricsObj || computeMetrics();
  const monthlyAdd = Number(document.getElementById('projMonthlySaveInput')?.value || 8000000);
  const years = Number(document.getElementById('projYearsSelect')?.value || 3);
  const months = years * 12;

  state.meta.monthlyContributionToman = monthlyAdd;

  const labels = [];
  const pess = [];
  const base = [];
  const opt = [];

  let wPess = m.grossToman;
  let wBase = m.grossToman;
  let wOpt = m.grossToman;

  for (let i = 0; i <= months; i += Math.max(1, Math.floor(months / 12))) {
    labels.push(i === 0 ? 'امروز' : `ماه ${fmtNum(i)}`);
    pess.push(Math.round(wPess / 1e6));
    base.push(Math.round(wBase / 1e6));
    opt.push(Math.round(wOpt / 1e6));

    const stepMonths = Math.max(1, Math.floor(months / 12));
    for (let s = 0; s < stepMonths; s++) {
      wPess = wPess * (1 + 0.25 / 12) + monthlyAdd;
      wBase = wBase * (1 + 0.45 / 12) + monthlyAdd;
      wOpt = wOpt * (1 + 0.68 / 12) + monthlyAdd;
    }
  }

  const ctxProj = document.getElementById('wealthProjectionChart');
  if (ctxProj && window.Chart) {
    if (charts.proj) charts.proj.destroy();
    charts.proj = new Chart(ctxProj, {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: 'سناریوی جسورانه (۶۸٪ سالانه)', data: opt, borderColor: '#10b981', tension: 0.35 },
          { label: 'سناریوی پایه (۴۵٪ سالانه)', data: base, borderColor: '#d4af37', backgroundColor: 'rgba(212,175,55,0.12)', fill: true, tension: 0.35 },
          { label: 'سناریوی محافظه‌کارانه (۲۵٪ سالانه)', data: pess, borderColor: '#38bdf8', borderDash: [4, 4], tension: 0.35 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Vazirmatn', size: 11 } } } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
        }
      }
    });
  }

  const sumEl = document.getElementById('projSummaryText');
  if (sumEl) {
    sumEl.innerHTML = `با پس‌انداز ماهانه <strong>${fmtNum(monthlyAdd)} تومان</strong>، ثروت شما در پایان سال ${fmtNum(years)} در سناریوی پایه به <strong>${fmtNum(base[base.length - 1])} میلیون تومان</strong> و در سناریوی جسورانه به <strong>${fmtNum(opt[opt.length - 1])} میلیون تومان</strong> خواهد رسید.`;
  }
}
