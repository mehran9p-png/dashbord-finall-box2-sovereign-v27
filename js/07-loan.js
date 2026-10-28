// =========================================================================
// 7. LOAN ENGINEERING & EARLY PAYOFF SIMULATOR
// =========================================================================
function updateLoanParams() {
  const jalali = document.getElementById('loanJalaliInput')?.value || '1405/07/01';
  const paid = Number(document.getElementById('loanPaidCountInput')?.value || 1);
  state.loan.startDateJalali = jalali;
  state.loan.paidInstallments = Math.min(12, Math.max(0, paid));
  saveState();
  renderAll();
  showToast('پارامترهای وام ۳۰ میلیونی بروزرسانی شد.');
}

function renderLoanSection(metricsObj) {
  const m = metricsObj || computeMetrics();
  const L = m.loan;

  document.getElementById('loanPrincipalLabel').textContent = fmtNum(L.principal) + ' ت';
  document.getElementById('loanCurrentPortfolioLabel').textContent = fmtNum(L.loanAssetsCurrent) + ' ت';
  document.getElementById('loanMonthlyPaymentLabel').textContent = fmtNum(Math.round(L.pmt)) + ' ت';
  document.getElementById('loanTotalPaybackLabel').textContent = fmtNum(Math.round(L.totalLoanPayback)) + ' ت';

  const breakEvenPct = Math.min(100, (L.loanAssetsCurrent / L.totalLoanPayback) * 100);
  document.getElementById('loanBreakEvenPctLabel').textContent = `%${fmtEn((L.loanAssetsCurrent / L.totalLoanPayback) * 100, 1)}`;
  document.getElementById('loanBreakEvenBar').style.width = `${breakEvenPct}%`;

  const tlGrid = document.getElementById('loanTimelineGrid');
  if (tlGrid) {
    let html = '';
    for (let i = 1; i <= 12; i++) {
      const isPaid = i <= L.paidCount;
      html += `
        <div class="loan-step ${isPaid ? 'paid' : ''}">
          <div style="font-weight:800;">قسط ${fmtNum(i)}</div>
          <div class="mono-num" style="font-size:0.7rem; color:var(--text-secondary);">${fmtNum(Math.round(L.pmt / 1000))} هزار ت</div>
          <div style="margin-top:3px; font-weight:700; color:${isPaid ? 'var(--emerald)' : 'var(--text-muted)'};">
            ${isPaid ? '✓ پرداخت شد' : 'در انتظار'}
          </div>
        </div>
      `;
    }
    tlGrid.innerHTML = html;
  }

  const k = Number(document.getElementById('earlyPayoffMonthSlider')?.value || 6);
  document.getElementById('earlyPayoffMonthLabel').textContent = `ماه ${fmtNum(k)}`;

  const r = 0.23 / 12;
  const n = 12;
  const remPrincipalAtK = L.principal * ((Math.pow(1 + r, n) - Math.pow(1 + r, k)) / (Math.pow(1 + r, n) - 1));
  const remainingInstallmentsTotal = (n - k) * L.pmt;
  const unearnedInterest = Math.max(0, remainingInstallmentsTotal - remPrincipalAtK);
  const savedInterest = unearnedInterest * 0.9;
  const lumpSumPayoff = remainingInstallmentsTotal - savedInterest;

  const box = document.getElementById('earlyPayoffResultBox');
  if (box) {
    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <span>مبلغ تسویه یکجا در ماه ${fmtNum(k)}: <strong class="mono-num" style="color:var(--cyan)">${fmtNum(Math.round(lumpSumPayoff))} تومان</strong></span>
        <span>سود بخشیده‌شده بانکی: <strong class="mono-num up">+${fmtNum(Math.round(savedInterest))} تومان</strong></span>
      </div>
      <p style="font-size:0.77rem; color:var(--text-secondary); margin-top:4px;">
        💡 <strong>حکم مهندسی مالی CFO:</strong> از آنجا که بازده صندوق درآمد ثابت (۳۱.۵٪) و سبد دارایی وام (~۴۲٪ سالانه) بالاتر از نرخ مؤثر وام (۲۳٪) است، <strong>عدم تسویه زودهنگام</strong> و پارک وجه نقد در سپر ضدتورمی بهینه‌تر است.
      </p>
    `;
  }

  const ctxLoan = document.getElementById('loanScenarioChart');
  if (ctxLoan && window.Chart) {
    if (charts.loan) charts.loan.destroy();
    charts.loan = new Chart(ctxLoan, {
      type: 'bar',
      data: {
        labels: ['کل بازپرداخت وام (بدهی)', 'سناریوی محافظه‌کارانه (+۲۵٪)', 'سناریوی پایه (+۴۵٪)', 'سناریوی جهش ارزی (+۷۵٪)'],
        datasets: [
          {
            label: 'ارزش در پایان ماه ۱۲ (میلیون تومان)',
            data: [
              Number((L.totalLoanPayback / 1e6).toFixed(2)),
              Number(((L.loanAssetsCurrent * 1.25) / 1e6).toFixed(2)),
              Number(((L.loanAssetsCurrent * 1.45) / 1e6).toFixed(2)),
              Number(((L.loanAssetsCurrent * 1.75) / 1e6).toFixed(2))
            ],
            backgroundColor: ['#f43f5e', '#38bdf8', '#10b981', '#d4af37'],
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#94a3b8', font: { family: 'Vazirmatn', size: 10 } } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.08)' } }
        }
      }
    });
  }
}
