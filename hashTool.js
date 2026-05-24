// hashTool.js
const hashTextEl = document.getElementById('hashText');
const hashAlgo = document.getElementById('hashAlgo');
const hashBtn = document.getElementById('hashBtn');
const hashResult = document.getElementById('hashResult');
const hashClear = document.getElementById('hashClear');

const fileInput = document.getElementById('fileInput');
const fileAlgo = document.getElementById('fileAlgo');
const fileHashBtn = document.getElementById('fileHashBtn');
const fileHashResult = document.getElementById('fileHashResult');

function toHex(buffer){
  const a = new Uint8Array(buffer);
  return Array.from(a).map(b => b.toString(16).padStart(2,'0')).join('');
}

if (hashBtn) hashBtn.addEventListener('click', async () => {
  const txt = hashTextEl.value || '';
  const algo = hashAlgo.value;
  if (!txt) { hashResult.value = ''; return; }

  if (algo === 'md5') {
    hashResult.value = (typeof SparkMD5 !== 'undefined') ? SparkMD5.hash(txt) : 'MD5 lib missing';
    return;
  }
  if (algo === 'sha-256') {
    const enc = new TextEncoder();
    const digest = await crypto.subtle.digest('SHA-256', enc.encode(txt));
    hashResult.value = toHex(digest);
    return;
  }
});

if (hashClear) hashClear.addEventListener('click', () => {
  if (hashTextEl) hashTextEl.value = '';
  if (hashResult) hashResult.value = '';
});

if (fileHashBtn) fileHashBtn.addEventListener('click', async () => {
  const f = fileInput.files[0];
  if (!f) { alert('Select a file first'); return; }
  const algo = fileAlgo.value;

  if (algo === 'md5') {
    const chunkSize = 2 * 1024 * 1024;
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    let offset = 0;
    reader.onload = e => {
      spark.append(e.target.result);
      offset += e.target.result.byteLength;
      if (offset < f.size) readNext();
      else fileHashResult.value = spark.end();
    };
    function readNext(){
      const slice = f.slice(offset, offset + chunkSize);
      reader.readAsArrayBuffer(slice);
    }
    readNext();
    return;
  }

  const buffer = await f.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', buffer);
  fileHashResult.value = toHex(digest);
});
