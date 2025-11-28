// passwordTool.js
const pwdInput = document.getElementById('pwdInput');
const pwdBar = document.getElementById('pwdBar');
const pwdAdvice = document.getElementById('pwdAdvice');
const pwdToggle = document.getElementById('pwdToggle');
const genBtn = document.getElementById('genBtn');
const genLen = document.getElementById('genLen');
const genResult = document.getElementById('genResult');
const copyGen = document.getElementById('copyGen');

if (pwdToggle) pwdToggle.addEventListener('click', () => {
  if (pwdInput.type === 'password') { pwdInput.type = 'text'; pwdToggle.textContent = 'Hide'; }
  else { pwdInput.type = 'password'; pwdToggle.textContent = 'Show'; }
});

function scorePassword(p){
  let s = 0;
  if (!p) return 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[a-z]/.test(p)) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}

if (pwdInput) pwdInput.addEventListener('input', () => {
  const p = pwdInput.value;
  const sc = scorePassword(p);
  const pct = Math.round((sc / 6) * 100);
  pwdBar.style.width = pct + '%';
  if (sc <= 2) {
    pwdBar.style.background = 'linear-gradient(90deg,#ff5577,#ff8a6b)';
    pwdAdvice.textContent = 'Weak — use at least 12 characters, mix cases, numbers & symbols.';
  } else if (sc <= 4) {
    pwdBar.style.background = 'linear-gradient(90deg,#ffbd2e,#ffd86b)';
    pwdAdvice.textContent = 'Moderate — add length and another character type.';
  } else {
    pwdBar.style.background = 'linear-gradient(90deg,#00ffa5,#3ae0ff)';
    pwdAdvice.textContent = 'Strong — great! Consider using a passphrase + password manager.';
  }
});

if (genBtn) genBtn.addEventListener('click', () => {
  const len = Math.max(8, Math.min(64, parseInt(genLen.value || 16)));
  genResult.value = generatePassword(len);
});

if (copyGen) copyGen.addEventListener('click', async () => {
  if (!genResult.value) return;
  await navigator.clipboard.writeText(genResult.value);
  copyGen.textContent = 'Copied!';
  setTimeout(()=> copyGen.textContent = 'Copy', 1500);
});

function generatePassword(len=16){
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}<>?';
  const rnd = new Uint32Array(len);
  crypto.getRandomValues(rnd);
  let out = '';
  for (let i=0;i<len;i++) out += charset[rnd[i] % charset.length];
  return out;
}
