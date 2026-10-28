// =========================================================================
// 10. NAVIGATION, LUXURY THEMES, PRIVACY MASK, BACKUP EXPORT/IMPORT
// =========================================================================
function switchTab(tabId, btnEl) {
  document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (btnEl) btnEl.classList.add('active');
  const allTabs = ['tab-command', 'tab-cash-advisor', 'tab-markets', 'tab-loan', 'tab-stress', 'tab-cfo'];
  const idx = allTabs.indexOf(tabId);
  if (idx >= 0) {
    document.querySelectorAll('.bnav-item').forEach((b, i) => b.classList.toggle('active', i === idx));
  }
}

function switchTabByIndex(idx) {
  const allTabs = ['tab-command', 'tab-cash-advisor', 'tab-markets', 'tab-loan', 'tab-stress', 'tab-cfo'];
  const btns = document.querySelectorAll('.tab-btn');
  if (allTabs[idx]) {
    switchTab(allTabs[idx], btns[idx]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function switchTabMobile(tabId, idx) {
  switchTab(tabId, document.querySelectorAll('.tab-btn')[idx]);
  document.querySelectorAll('.bnav-item').forEach((b, i) => {
    b.classList.toggle('active', i === idx);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function togglePrivacyMask() {
  document.body.classList.toggle('privacy-masked');
  const isMasked = document.body.classList.contains('privacy-masked');
  document.getElementById('privacyBtn').textContent = isMasked ? '🔓 نمایش ارقام' : '👁️ محرمانه';
  showToast(isMasked ? 'حالت محرمانه فعال شد (تمام ارقام محو شدند).' : 'نمایش ارقام فعال شد.');
}

function setAppTheme(themeName, silent = false) {
  const html = document.documentElement;
  html.setAttribute('data-theme', themeName);
  document.getElementById('themeBtnObsidian')?.classList.toggle('active', themeName === 'obsidian');
  document.getElementById('themeBtnSlate')?.classList.toggle('active', themeName === 'slate' || themeName === 'dark');
  document.getElementById('themeBtnLight')?.classList.toggle('active', themeName === 'light');
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  } catch (_) {}
  if (!silent) {
    const names = {
      obsidian: 'تم لوکس Obsidian Gold (پرایوت بانکینگ) فعال شد.',
      slate: 'تم Institutional Slate (کوانت/بلومبرگ) فعال شد.',
      light: 'تم روشن Ivory Executive فعال شد.'
    };
    showToast(names[themeName] || 'تم تغییر کرد.');
  }
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'obsidian';
  const order = ['obsidian', 'slate', 'light'];
  const next = order[(order.indexOf(cur) + 1) % order.length];
  setAppTheme(next);
}

function dismissAlertBanner() {
  window._alertDismissed = true;
  document.getElementById('topAlertBanner')?.classList.remove('visible');
}

function exportPortfolioBackup() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `wealth-terminal-v26-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  showToast('فایل بکاپ کامل پورتفوی دانلود شد.');
}

function importPortfolioBackup(event) {
  const file = event.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!parsed || !Array.isArray(parsed.stocks)) {
        showToast('ساختار فایل JSON معتبر نیست.');
        return;
      }
      undoSnapshot = JSON.stringify(state);
      state = Object.assign({}, DEFAULT_STATE, parsed);
      saveState();
      renderAll();
      showToast('بکاپ پورتفوی با موفقیت بازیابی شد.', true);
    } catch (_) {
      showToast('خطا در خواندن فایل JSON.');
    }
  };
  reader.readAsText(file);
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

// Boot Terminal
window.addEventListener('DOMContentLoaded', () => {
  loadState();
  renderAll();
  syncAllLivePrices(false);
  changeAutoSyncInterval(60000);
});
