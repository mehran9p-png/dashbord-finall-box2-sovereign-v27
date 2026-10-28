// =========================================================================
// 5. SENIOR CFO & CASH INVESTMENT ADVISOR ENGINE (GitHub Skills Integration)
// =========================================================================
const CFO_REGIMES = {
  balanced: {
    name: 'هسته متعادل مدیر مالی ارشد (Balanced CFO Core)',
    expectedPortfolioYield: 41.8,
    tiers: { t1: 15, t2: 55, t3: 30 },
    vehicles: [
      { key: 'fix', name: 'صندوق درآمد ثابت روزشمار (افران / کارا / یاقوت)', weight: 35, expReturn: 31.5, liq: 'آنی (T+0)', role: 'حذف خواب پول + سپر اقساط وام', risk: 'بسیار کم' },
      { key: 'gold', name: 'صندوق طلای بورسی (عیار / لوتوس / کهربا)', weight: 25, expReturn: 46.0, liq: 'روزانه (T+1)', role: 'پوشش مستقیم جهش دلار و اونس جهانی', risk: 'متوسط' },
      { key: 'usdt', name: 'خرید پله‌ای تتر / استیبل‌کوین در حمایت SMA90', weight: 20, expReturn: 38.0, liq: 'آنی ۲۴/۷', role: 'حفظ قدرت خرید دلاری و آربیتراژ', risk: 'کم تا متوسط' },
      { key: 'stocks', name: 'سهام بنیادی دلاری با DPS بالا (شپدیس / فپنتا / وفیروزه)', weight: 12, expReturn: 52.0, liq: 'T+2 کارگزاری', role: 'دریافت سود تقسیمی مجمع + رشد بنیادی', risk: 'متوسط به بالا' },
      { key: 'dip', name: 'ذخیره شکار کف کریپتو (پله‌های BTC $76.5k و ETH $2,220)', weight: 8, expReturn: 65.0, liq: 'آنی ۲۴/۷', role: 'آلفای نامتقارن در اصلاح‌های سنگین بازار', risk: 'بالا (کنترل‌شده)' }
    ]
  },
  shield: {
    name: 'سپر محافظه‌کارانه ضدتورمی (Conservative Inflation Shield)',
    expectedPortfolioYield: 36.4,
    tiers: { t1: 20, t2: 65, t3: 15 },
    vehicles: [
      { key: 'fix', name: 'صندوق درآمد ثابت روزشمار (افران / کارا / یاقوت)', weight: 50, expReturn: 31.5, liq: 'آنی (T+0)', role: 'جریان نقدی تضمین‌شده و پوشش کامل اقساط', risk: 'بسیار کم' },
      { key: 'gold', name: 'صندوق طلای بورسی (عیار / لوتوس)', weight: 30, expReturn: 46.0, liq: 'روزانه (T+1)', role: 'بیمه سرمایه در برابر تورم و ریسک سیاسی', risk: 'متوسط' },
      { key: 'usdt', name: 'استیبل‌کوین کم‌ریسک (USDT / LUSD)', weight: 15, expReturn: 38.0, liq: 'آنی ۲۴/۷', role: 'نقدینگی ارزی بدون نوسان کریپتو', risk: 'کم' },
      { key: 'stocks', name: 'سهام بنیادی تقسیم سود محور (شپدیس)', weight: 5, expReturn: 48.0, liq: 'T+2 کارگزاری', role: 'سود نقدی مجمع سالانه', risk: 'متوسط' },
      { key: 'dip', name: 'ذخیره شکار کف کریپتو', weight: 0, expReturn: 0.0, liq: '-', role: 'غیرفعال در رژیم محافظه‌کارانه', risk: '-' }
    ]
  },
  sniper: {
    name: 'شکارچی تهاجمی اصلاح بازار (Tactical Dip Hunter — Fund Manager)',
    expectedPortfolioYield: 49.2,
    tiers: { t1: 10, t2: 35, t3: 55 },
    vehicles: [
      { key: 'fix', name: 'صندوق درآمد ثابت روزشمار (پارک موقت تا شلیک)', weight: 20, expReturn: 31.5, liq: 'آنی (T+0)', role: 'کسب سود روزشمار تا فعال شدن پله‌های خرید', risk: 'بسیار کم' },
      { key: 'gold', name: 'صندوق طلای بورسی و گواهی سکه', weight: 20, expReturn: 46.0, liq: 'روزانه (T+1)', role: 'اهرم پوشش تورمی', risk: 'متوسط' },
      { key: 'usdt', name: 'مهمات تتر جهت تبدیل به دارایی‌های پرپتانسیل', weight: 20, expReturn: 38.0, liq: 'آنی ۲۴/۷', role: 'Dry Powder دلاری روی شبکه', risk: 'کم' },
      { key: 'stocks', name: 'تکمیل پله کرومیت، فپنتا و شپدیس در کف قیمتی', weight: 20, expReturn: 56.0, liq: 'T+2 کارگزاری', role: 'کاهش میانگین خرید و جهش بازده سبد بورس', risk: 'بالا' },
      { key: 'dip', name: 'شکار ۴ پله‌ای BTC، ETH و SOL زیر SMA200', weight: 20, expReturn: 68.0, liq: 'آنی ۲۴/۷', role: 'حداکثرسازی بازده دلاری در چرخه صعودی', risk: 'بالا' }
    ]
  },
  barbell: {
    name: 'استراتژی باربل نسیم طالب (Barbell: 70% Safe Yield + 30% High Alpha)',
    expectedPortfolioYield: 43.5,
    tiers: { t1: 15, t2: 55, t3: 30 },
    vehicles: [
      { key: 'fix', name: 'صندوق درآمد ثابت روزشمار (ستون اول باربل - بدون ریسک)', weight: 45, expReturn: 31.5, liq: 'آنی (T+0)', role: 'حفظ مطلق اصل سرمایه و سود مرکب ماهانه', risk: 'صفر/بسیار کم' },
      { key: 'gold', name: 'صندوق طلای بورسی (سپر سخت باربل)', weight: 25, expReturn: 46.0, liq: 'روزانه (T+1)', role: 'پوشش ریسک دم چپ (Tail Risk) ریال', risk: 'متوسط' },
      { key: 'usdt', name: 'ذخیره استیبل‌کوین (USDT)', weight: 0, expReturn: 38.0, liq: 'آنی', role: 'ادغام‌شده در ستون شکار کریپتو', risk: '-' },
      { key: 'stocks', name: 'سهام بنیادی با P/E پایین (فپنتا / وفیروزه)', weight: 12, expReturn: 54.0, liq: 'T+2', role: 'رشد بنیادی اهرمی', risk: 'متوسط به بالا' },
      { key: 'dip', name: 'ستون دوم باربل: شکار BTC و ETH در کف‌های قیمتی', weight: 18, expReturn: 68.0, liq: 'آنی ۲۴/۷', role: 'کسب بازده نامتقارن با ریسک محدود به ۱۸٪ کل نقد', risk: 'بالا' }
    ]
  }
};

function setCfoCashPreset(mode, btnEl) {
  document.querySelectorAll('.preset-chip').forEach((b) => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
  const m = computeMetrics();
  const input = document.getElementById('cfoCashAmountInput');
  if (!input) return;
  if (mode === 'current') input.value = Math.round(m.cashToman);
  else if (mode === 'all_liquid') input.value = Math.round(m.cashToman + m.stableToman);
  else if (mode === '50m') input.value = 50000000;
  else if (mode === '100m') input.value = 100000000;
  else if (mode === '250m') input.value = 250000000;
  renderCfoCashAdvisor(m);
}

function renderCfoCashAdvisor(metricsObj) {
  const m = metricsObj || computeMetrics();
  const cashInputVal = Math.max(1000000, Number(document.getElementById('cfoCashAmountInput')?.value || m.cashToman));
  const regimeKey = document.getElementById('cfoRegimeSelect')?.value || 'balanced';
  const horizonMonths = Number(document.getElementById('cfoHorizonSelect')?.value || 12);
  const fixYieldPct = Number(document.getElementById('cfoFixRateInput')?.value || 31.5);

  state.cash.cfoRegime = regimeKey;
  state.cash.cfoFixedYieldPct = fixYieldPct;

  const regime = CFO_REGIMES[regimeKey] || CFO_REGIMES.balanced;

  // Update Hero CFO Pulse Card
  const heroCashEl = document.getElementById('heroLiquidCashToman');
  const heroDragEl = document.getElementById('heroCashDragMonthly');
  const heroRunwayEl = document.getElementById('heroRunwayMonths');
  if (heroCashEl) heroCashEl.textContent = fmtNum(Math.round(m.cashToman)) + ' ت';
  if (heroDragEl) heroDragEl.textContent = '-' + fmtNum(Math.round(m.monthlyCashDragToman)) + ' ت';
  if (heroRunwayEl) heroRunwayEl.textContent = fmtNum(m.installmentRunwayMonths, 1) + ' ماه';

  // Top KPIs inside Tab 2
  const totalDeployable = m.cashToman + m.stableToman;
  const annualDragOnInput = cashInputVal * (fixYieldPct / 100);
  const dailyDragOnInput = annualDragOnInput / 365;

  // Compute weighted expected return dynamically using fixYieldPct
  let weightedYield = 0;
  regime.vehicles.forEach((v) => {
    const r = v.key === 'fix' ? fixYieldPct : v.expReturn;
    weightedYield += (v.weight / 100) * r;
  });

  document.getElementById('cfoTotalDeployableLabel').textContent = fmtNum(Math.round(totalDeployable)) + ' ت';
  document.getElementById('cfoTotalDeployableSub').textContent = `${fmtNum(Math.round(m.cashToman / 1e6), 2)}م ریال + $${fmtEn(m.stableUsd, 2)} استیبل‌کوین`;
  document.getElementById('cfoAnnualCashDragLabel').textContent = '-' + fmtNum(Math.round(annualDragOnInput)) + ' ت';
  document.getElementById('cfoDailyCashDragSub').textContent = `زیان روزانه خواب این مبلغ: ${fmtNum(Math.round(dailyDragOnInput))} تومان`;
  document.getElementById('cfoExpectedYieldLabel').textContent = `+${fmtNum(weightedYield, 1)}٪ سالانه`;
  document.getElementById('cfoRunwayCardLabel').textContent = `${fmtNum(m.installmentRunwayMonths, 1)} ماه قسط وام`;

  // Update 3-Tier Cards
  document.getElementById('tier1PctBadge').textContent = `${fmtNum(regime.tiers.t1)}٪ نقد`;
  document.getElementById('tier2PctBadge').textContent = `${fmtNum(regime.tiers.t2)}٪ نقد`;
  document.getElementById('tier3PctBadge').textContent = `${fmtNum(regime.tiers.t3)}٪ نقد`;
  document.getElementById('tier1TomanVal').textContent = fmtNum(Math.round((cashInputVal * regime.tiers.t1) / 100)) + ' تومان';
  document.getElementById('tier2TomanVal').textContent = fmtNum(Math.round((cashInputVal * regime.tiers.t2) / 100)) + ' تومان';
  document.getElementById('tier3TomanVal').textContent = fmtNum(Math.round((cashInputVal * regime.tiers.t3) / 100)) + ' تومان';

  // Render 5-Vehicle Allocation Table
  const allocBody = document.getElementById('cfoAllocationTableBody');
  if (allocBody) {
    allocBody.innerHTML = regime.vehicles
      .filter((v) => v.weight > 0)
      .map((v) => {
        const amountToman = Math.round((cashInputVal * v.weight) / 100);
        const effReturn = v.key === 'fix' ? fixYieldPct : v.expReturn;
        const profitHorizon = Math.round(amountToman * (effReturn / 100) * (horizonMonths / 12));
        return `
          <tr>
            <td><strong>${escapeHtml(v.name)}</strong></td>
            <td class="mono-num"><span class="pill pill-gold">%${fmtNum(v.weight)}</span></td>
            <td class="maskable mono-num" style="font-weight:800;">${fmtNum(amountToman)} ت</td>
            <td class="mono-num up">+%${fmtNum(effReturn, 1)} <span style="font-size:0.7rem; color:var(--text-secondary);">(${fmtNum(profitHorizon)}+ ت)</span></td>
            <td><span class="pill pill-cyan">${escapeHtml(v.liq)}</span></td>
            <td style="font-size:0.76rem; color:var(--text-secondary);">${escapeHtml(v.role)}</td>
          </tr>
        `;
      })
      .join('');
  }

  // Render 12-Month Trajectory Chart (Idle Bank vs Fixed Income vs CFO Optimal Blend)
  const ctxCfo = document.getElementById('cfoCashTrajectoryChart');
  if (ctxCfo && window.Chart) {
    if (charts.cfoCash) charts.cfoCash.destroy();
    const labels = [];
    const idleRealCurve = [];
    const fixedCurve = [];
    const cfoOptimalCurve = [];
    const inflationAnnual = 0.42;

    for (let mo = 0; mo <= horizonMonths; mo++) {
      labels.push(mo === 0 ? 'شروع' : `ماه ${fmtNum(mo)}`);
      // Real purchasing power of uninvested cash eroding under 42% inflation
      const realIdle = cashInputVal / Math.pow(1 + inflationAnnual / 12, mo);
      const fixVal = cashInputVal * Math.pow(1 + fixYieldPct / 100 / 12, mo);
      const optVal = cashInputVal * Math.pow(1 + weightedYield / 100 / 12, mo);
      idleRealCurve.push(Number((realIdle / 1e6).toFixed(2)));
      fixedCurve.push(Number((fixVal / 1e6).toFixed(2)));
      cfoOptimalCurve.push(Number((optVal / 1e6).toFixed(2)));
    }

    charts.cfoCash = new Chart(ctxCfo, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'سبد پیشنهادی مدیر مالی ارشد (میلیون تومان)',
            data: cfoOptimalCurve,
            borderColor: '#d4af37',
            backgroundColor: 'rgba(212, 175, 55, 0.14)',
            fill: true,
            tension: 0.35,
            borderWidth: 2.5
          },
          {
            label: `صندوق درآمد ثابت روزشمار (${fixYieldPct}٪)`,
            data: fixedCurve,
            borderColor: '#10b981',
            borderDash: [5, 4],
            tension: 0.35
          },
          {
            label: 'قدرت خرید حقیقی در صورت خواب در بانک (تورم ۴۲٪)',
            data: idleRealCurve,
            borderColor: '#f43f5e',
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: { legend: { labels: { color: '#94a3b8', font: { family: 'Vazirmatn', size: 11 } } } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { family: 'Vazirmatn' } }, grid: { color: 'rgba(148,163,184,0.08)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
        }
      }
    });
  }

  // Render GitHub cfo-advisor Diagnostic Red Flags
  const sma90 = 256800;
  const usdtDev = ((m.usdtRate - sma90) / sma90) * 100;
  const flags = [
    {
      tag: '🔴 RED FLAG • زیان خواب نقدینگی',
      cls: 'rose-border',
      text: `نگهداری ${fmtNum(m.bankCash)} تومان در حساب بانکی بدون سود، ماهانه ${fmtNum(Math.round(m.monthlyCashDragToman))} تومان (${fmtNum(Math.round(m.dailyCashDragToman))} تومان در روز) زیان فرصت قطعی ایجاد می‌کند. حکم فوری: انتقال حداقل ۸۵٪ آن به صندوق درآمد ثابت روزشمار.`
    },
    {
      tag: '🟡 WARNING • فاصله نرخ تتر از SMA90',
      cls: 'warn-border',
      text: `نرخ فعلی تتر (${fmtNum(m.usdtRate)} ت) حدود +${fmtEn(usdtDev, 1)}٪ بالاتر از میانگین ۹۰ روزه (${fmtNum(sma90)} ت) قرار دارد. خرید یکجای دلار در این نقطه ممنوع است؛ فقط ورود پله‌ای روی حمایت‌های ۲۵۶,۸۰۰ و ۲۴۸,۰۰۰ تومان مجاز است.`
    },
    {
      tag: '🟢 VERIFIED • پوشش کامل بدهی و آربیتراژ وام',
      cls: '',
      text: `ارزش دارایی‌های وام ۳۰ میلیونی (${fmtNum(m.loan.loanAssetsCurrent)} ت) از کل بازپرداخت وام (${fmtNum(Math.round(m.loan.totalLoanPayback))} ت) عبور کرده و نقدینگی شما کفاف ${fmtNum(m.installmentRunwayMonths, 1)} ماه قسط را می‌دهد.`
    }
  ];
  const rfBox = document.getElementById('cfoRedFlagsContainer');
  if (rfBox) {
    rfBox.innerHTML = flags
      .map(
        (f) => `
        <div class="action-card ${f.cls}" style="padding:10px 13px;">
          <div style="font-size:0.74rem; font-weight:800; color:var(--gold-bright);">${escapeHtml(f.tag)}</div>
          <div style="font-size:0.77rem; color:var(--text-secondary);">${escapeHtml(f.text)}</div>
        </div>
      `
      )
      .join('');
  }

  // Render 4-Tranche Execution Playbook
  const tranches = [
    {
      step: 'پله ۱ • اجرای فوری (امروز - ۴۰٪ نقد)',
      amount: Math.round(cashInputVal * 0.40),
      title: 'پارک فوری در صندوق درآمد ثابت + هسته طلا',
      trigger: `تریگر: اجرای آنی در ساعت معاملاتی بورس (سود روزشمار ${fixYieldPct}٪ بدون جریمه شکست)`
    },
    {
      step: 'پله ۲ • اصلاح اول بازار (۲۵٪ نقد)',
      amount: Math.round(cashInputVal * 0.25),
      title: 'ورود پله اول صندوق طلا و تتر حمایتی',
      trigger: `تریگر: اصلاح نرخ تتر به محدوده ${fmtNum(Math.round(m.usdtRate * 0.965))} تومان یا پولبک طلای ۱۸ عیار`
    },
    {
      step: 'پله ۳ • شکار میانگین SMA90 (۲۰٪ نقد)',
      amount: Math.round(cashInputVal * 0.20),
      title: 'تکمیل سبد دلاری و سهام DPS محور (شپدیس/کرومیت)',
      trigger: `تریگر: لمس میانگین ۹۰ روزه تتر (${fmtNum(sma90)} تومان) یا حمایت شاخص ۲.۷۵ میلیون`
    },
    {
      step: 'پله ۴ • ذخیره بحران و شکار کف سنگین (۱۵٪ نقد)',
      amount: Math.round(cashInputVal * 0.15),
      title: 'شلیک سنگین در کف‌های هیجانی (BTC $72k / دلار ۲۴۸هزار)',
      trigger: 'تریگر: اصلاح سنگین بازارها (Tail-Risk Event) جهت شکار دارایی با ۳۰٪ تخفیف'
    }
  ];
  const trGrid = document.getElementById('cfoTranchesGrid');
  if (trGrid) {
    trGrid.innerHTML = tranches
      .map(
        (t) => `
        <div class="tranche-box">
          <div class="tranche-step-num">${escapeHtml(t.step)}</div>
          <div style="font-weight:800; font-size:0.86rem; margin-bottom:4px;">${escapeHtml(t.title)}</div>
          <div class="maskable mono-num" style="font-size:0.98rem; font-weight:900; color:var(--emerald); margin-bottom:6px;">${fmtNum(t.amount)} تومان</div>
          <div style="font-size:0.73rem; color:var(--text-secondary);">${escapeHtml(t.trigger)}</div>
        </div>
      `
      )
      .join('');
  }

  // Render Opportunity Screener Table (borghei/Claude-Skills business-investment-advisor)
  const screenerItems = [
    { rank: 1, name: 'صندوق درآمد ثابت نوع دوم (افران/کارا)', nom: `${fixYieldPct}%`, real: '-6.5%', cvar: '0.2% (بسیار امن)', liq: 'T+0 آنی', score: 94 },
    { rank: 2, name: 'صندوق طلای بورسی (عیار/لوتوس)', nom: '46.0%', real: '+4.0%', cvar: '-8.5%', liq: 'T+1', score: 91 },
    { rank: 3, name: 'استیبل‌کوین شبکه اتریوم (LUSD/USDT)', nom: '38.0%', real: '-4.0%', cvar: '-4.2%', liq: 'آنی ۲۴/۷', score: 88 },
    { rank: 4, name: 'سهام پتروشیمی و فلزات با DPS بالا (شپدیس/فپنتا)', nom: '52.0%', real: '+10.0%', cvar: '-14.0%', liq: 'T+2', score: 85 },
    { rank: 5, name: 'شکار پله‌ای بیت‌کوین و اتریوم (Dip Ladder)', nom: '65.0%', real: '+23.0%', cvar: '-22.0%', liq: 'آنی ۲۴/۷', score: 82 },
    { rank: 6, name: 'حساب بانکی ریالی بدون سود (وضعیت فعلی)', nom: '0.0%', real: '-42.0%', cvar: '-42.0% (تورم)', liq: 'T+0', score: 18 }
  ];
  const scrBody = document.getElementById('cfoOpportunityScreenerBody');
  if (scrBody) {
    scrBody.innerHTML = screenerItems
      .map(
        (it) => `
        <tr>
          <td><strong>#${fmtNum(it.rank)} ${escapeHtml(it.name)}</strong></td>
          <td class="mono-num ${it.rank === 6 ? 'down' : 'up'}">${it.nom}</td>
          <td class="mono-num ${it.real.startsWith('+') ? 'up' : 'down'}">${it.real}</td>
          <td class="mono-num">${escapeHtml(it.cvar)}</td>
          <td><span class="pill pill-cyan">${escapeHtml(it.liq)}</span></td>
          <td class="mono-num"><span class="pill ${it.score >= 85 ? 'pill-gold' : it.score >= 70 ? 'pill-up' : 'pill-down'}">${fmtNum(it.score)} / 100</span></td>
        </tr>
      `
      )
      .join('');
  }

  // Generate IC Memo (anthropics/claude-for-financial-advisors format)
  const expectedEndVal = Math.round(cashInputVal * Math.pow(1 + weightedYield / 100 / 12, horizonMonths));
  const expectedNetGain = expectedEndVal - cashInputVal;
  const memoText = [
    `📌 مصوبه کمیته سرمایه‌گذاری و خزانه‌داری (IC EXECUTIVE MEMO — SOVEREIGN V26)`,
    `• تاریخ صدور: امروز | رژیم منتخب: ${regime.name} | افق زمانی: ${fmtNum(horizonMonths)} ماه`,
    `• سرمایه نقد مورد مشاوره: ${fmtNum(cashInputVal)} تومان (معادل $${fmtEn(cashInputVal / m.usdtRate, 2)} دلار به نرخ روز ${fmtNum(m.usdtRate)} ت)`,
    ``,
    `۱. حکم نهایی مدیر مالی (Bottom Line):`,
    `نگهداری راکد این وجه نقد در حساب بانکی، ماهانه ${fmtNum(Math.round(annualDragOnInput / 12))} تومان زیان فرصت قطعی به همراه دارد. با اجرای سبد ترکیبی پیشنهادی، بازده موزون سالانه به +${fmtNum(weightedYield, 1)}٪ رسیده و در پایان ماه ${fmtNum(horizonMonths)}، ارزش وجه نقد شما به ${fmtNum(expectedEndVal)} تومان (+${fmtNum(expectedNetGain)} تومان سود خالص) افزایش می‌یابد.`,
    ``,
    `۲. جدول دستورات اجرایی تخصیص (Execution Allocation):`,
    ...regime.vehicles
      .filter((v) => v.weight > 0)
      .map((v) => `   - ${v.name}: ${fmtNum(v.weight)}٪ معادل ${fmtNum(Math.round((cashInputVal * v.weight) / 100))} تومان (${v.role})`),
    ``,
    `۳. قوانین کنترل ریسک و تریگرهای تصمیم (Decision Triggers):`,
    `• قانون ۱ (Liquidity Floor): مبلغ ${fmtNum(Math.round((cashInputVal * regime.tiers.t1) / 100))} تومان همواره به صورت آنی (T+0) جهت پوشش اقساط وام ۳۰ میلیونی (${fmtNum(Math.round(m.loan.pmt))} ت/ماه) حفظ شود.`,
    `• قانون ۲ (SMA90 Gate): خرید سنگین تتر بالای نرخ ${fmtNum(Math.round(sma90 * 1.04))} تومان متوقف شده و نقدینگی ریالی در صندوق درآمد ثابت (${fixYieldPct}٪) پارک می‌ماند تا نرخ به محدوده ${fmtNum(sma90)} تومان اصلاح کند.`,
    `• قانون ۳ (Loan Arbitrage): تا زمانی که بازده سبد خزانه (+${fmtNum(weightedYield, 1)}٪) بالاتر از نرخ سود وام (۲۳٪) است، تسویه زودهنگام وام از محل وجه نقد انجام نشود.`
  ].join('\n');

  const memoEl = document.getElementById('cfoMemoBox');
  if (memoEl) memoEl.textContent = memoText;
}

function copyCfoMemo() {
  const text = document.getElementById('cfoMemoBox')?.textContent || '';
  if (!text) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast('متن کامل مصوبه مدیر مالی (IC Memo) در کلیپ‌بورد کپی شد.')).catch(() => fallbackCopyText(text));
    } else {
      fallbackCopyText(text);
    }
  } catch (_) {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast('متن مصوبه مدیر مالی در کلیپ‌بورد کپی شد.');
  } catch (_) {}
  document.body.removeChild(ta);
}

function applyCfoCashStrategy() {
  const regimeKey = document.getElementById('cfoRegimeSelect')?.value || 'balanced';
  undoSnapshot = JSON.stringify(state);
  if (regimeKey === 'shield') {
    state.targetWeights = { stocks: 20, crypto: 35, cash: 25, nfts: 20 };
  } else if (regimeKey === 'sniper') {
    state.targetWeights = { stocks: 30, crypto: 45, cash: 10, nfts: 15 };
  } else if (regimeKey === 'barbell') {
    state.targetWeights = { stocks: 22, crypto: 40, cash: 20, nfts: 18 };
  } else {
    state.targetWeights = { stocks: 25, crypto: 40, cash: 15, nfts: 20 };
  }
  const twS = document.getElementById('twStocks');
  const twC = document.getElementById('twCrypto');
  const twK = document.getElementById('twCash');
  const twN = document.getElementById('twNfts');
  if (twS) twS.value = state.targetWeights.stocks;
  if (twC) twC.value = state.targetWeights.crypto;
  if (twK) twK.value = state.targetWeights.cash;
  if (twN) twN.value = state.targetWeights.nfts;

  saveState();
  renderAll();
  showToast('استراتژی مدیر مالی ارشد در وزن‌های هدف پورتفوی و میز ریبالانس اعمال شد.', true);
}

function updateQuickCashBalances() {
  const bCash = Number(document.getElementById('quickBankCashInput')?.value || 0);
  const brkCash = Number(document.getElementById('quickBrokerCashInput')?.value || 0);
  if (bCash < 0 || brkCash < 0) return;
  undoSnapshot = JSON.stringify(state);
  state.cash.bankCashToman = bCash;
  state.cash.brokerBuyingPowerToman = brkCash;
  const cfoInput = document.getElementById('cfoCashAmountInput');
  if (cfoInput) cfoInput.value = bCash + brkCash;
  saveState();
  renderAll();
  showToast('موجودی وجه نقد بانکی و کارگزاری بروزرسانی شد.', true);
}
