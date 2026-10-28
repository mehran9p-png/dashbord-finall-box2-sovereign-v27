// =========================================================================
// 2. SAFE STORAGE, SANITIZATION & FORMATTING UTILITIES
// =========================================================================
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function normalizeFa(text) {
  if (!text) return '';
  return String(text).replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, '').replace(/\s+/g, '').trim();
}

function fmtNum(n, decimals = 0) {
  const val = Number(n) || 0;
  return val.toLocaleString('fa-IR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtEn(n, decimals = 0) {
  const val = Number(n) || 0;
  return val.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage save skipped:', e);
  }
}

function loadState() {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) setAppTheme(savedTheme, true);
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.stocks) && parsed.fx) {
        state = Object.assign({}, DEFAULT_STATE, parsed);
        state.fx = Object.assign({}, DEFAULT_STATE.fx, parsed.fx);
        state.cash = Object.assign({}, DEFAULT_STATE.cash, parsed.cash || {});
      }
    }
  } catch (e) {
    console.warn('localStorage load fallback:', e);
  }
}

function showToast(msg, allowUndo = false) {
  const box = document.getElementById('appToast');
  const text = document.getElementById('appToastMsg');
  const undoBtn = document.getElementById('appToastUndoBtn');
  if (!box || !text) return;
  text.textContent = msg;
  undoBtn.style.display = allowUndo && undoSnapshot ? 'inline-flex' : 'none';
  box.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => box.classList.remove('show'), 5500);
}

function undoLastAction() {
  if (!undoSnapshot) return;
  state = JSON.parse(undoSnapshot);
  undoSnapshot = null;
  saveState();
  renderAll();
  showToast('عملیات قبلی با موفقیت بازگردانی شد.');
}
