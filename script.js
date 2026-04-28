// ── Utilities ──────────────────────────────────────

function fmt(n) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function getNum(id) {
  const val = parseFloat(document.getElementById(id).value);
  return isNaN(val) || val < 0 ? 0 : val;
}

function setField(id, val) {
  document.getElementById(id).textContent = val;
}

// ── Hourly Calculator ──────────────────────────────

function calcHourly() {
  const rate       = getNum('h-rate');
  const hours      = getNum('h-hours');
  const commission = getNum('h-commission');

  if (rate === 0 || hours === 0) {
    alert('Please enter your hourly rate and hours worked.');
    return;
  }

  const base           = rate * hours;
  const commissionAmt  = base * (commission / 100);
  const total          = base + commissionAmt;

  setField('h-base',           fmt(base));
  setField('h-commission-amt', fmt(commissionAmt));
  setField('h-total',          fmt(total));
}

// ── Flat Rate Calculator ───────────────────────────

// Hours added by each add-on
const ADD_ONS = {
  // static
  's-design':      15,
  's-responsive':   5,
  's-seo':          4,
  's-animations':   6,
  // multi
  'm-design':      15,
  'm-contact':      4,
  'm-cms':         10,
  'm-auth':        12,
  'm-ecommerce':   25,
  'm-api':          8,
  'm-seo':          5,
  'm-responsive':   5,
};

let activeTab = 'static';

function switchTab(tab) {
  activeTab = tab;

  // Toggle panels
  document.getElementById('panel-static').classList.toggle('hidden', tab !== 'static');
  document.getElementById('panel-multi').classList.toggle('hidden',  tab !== 'multi');

  // Toggle active tab button
  document.getElementById('tab-static').classList.toggle('active', tab === 'static');
  document.getElementById('tab-multi').classList.toggle('active',  tab === 'multi');

  // Recalculate if rate is already set
  if (getNum('f-rate') > 0) calcFlat();
}

function calcFlat() {
  const rate = getNum('f-rate');

  const baseHours = activeTab === 'static' ? 20 : 30;
  const prefix    = activeTab === 'static' ? 's-' : 'm-';

  let addonHours = 0;
  for (const [id, hrs] of Object.entries(ADD_ONS)) {
    if (!id.startsWith(prefix)) continue;
    const el = document.getElementById(id);
    if (el && el.checked) addonHours += hrs;
  }

  const totalHours = baseHours + addonHours;
  const total      = rate * totalHours;

  setField('f-base-hours',  `${baseHours} hrs`);
  setField('f-addon-hours', `${addonHours} hrs`);
  setField('f-total-hours', `${totalHours} hrs`);
  setField('f-total',       rate === 0 ? 'Enter your rate' : fmt(total));
}

// Live update flat rate when base rate changes
document.getElementById('f-rate').addEventListener('input', () => {
  if (getNum('f-rate') > 0) calcFlat();
});

// ── Value-Based Calculator ─────────────────────────

function updateCutLabel(val) {
  document.getElementById('v-cut-label').textContent = `${val}%`;
}

function calcValue() {
  const monthly  = getNum('v-revenue');
  const increase = getNum('v-increase');
  const horizon  = parseInt(document.getElementById('v-horizon').value, 10);
  const cut      = parseFloat(document.getElementById('v-cut').value);

  if (monthly === 0 || increase === 0) {
    alert('Please enter the client\'s monthly revenue and expected increase.');
    return;
  }

  const projectedROI = monthly * horizon * (increase / 100);
  const low          = projectedROI * 0.10;
  const mid          = projectedROI * 0.15;
  const high         = projectedROI * 0.20;
  const suggested    = projectedROI * (cut / 100);

  setField('v-roi',   fmt(projectedROI));
  setField('v-low',   fmt(low));
  setField('v-mid',   fmt(mid));
  setField('v-high',  fmt(high));
  setField('v-total', fmt(suggested));
}
