// newsFeed.js
const NEWS_API_KEY = ""; // optional: paste your NewsAPI.org key
const NEWS_PAGE_SIZE = 8;

const newsFetchBtn = document.getElementById('newsFetch');
const newsList = document.getElementById('newsList');
const newsQuery = document.getElementById('newsQuery');
const newsRegion = document.getElementById('newsRegion');

const SAMPLE_NEWS = [
  { title: "Ransomware group claims new victims", description: "Researchers report a wave of ransomware targeting SMBs.", url: "#", urlToImage: "" , publishedAt: new Date().toISOString() },
  { title: "Browser zero-day patched — update now", description: "Critical patch rolled out for major browser.", url: "#", urlToImage: "" , publishedAt: new Date().toISOString() }
];

async function fetchNews(q="", region="global"){
  if (!newsList) return;
  newsList.innerHTML = `<div class="muted">Loading news...</div>`;
  if (!NEWS_API_KEY) { renderNews(SAMPLE_NEWS); return; }

  try {
    const query = encodeURIComponent(q || 'cybersecurity OR ransomware OR exploit');
    const endpoint = `https://newsapi.org/v2/everything?q=${query}&pageSize=${NEWS_PAGE_SIZE}&sortBy=publishedAt&language=en&apiKey=${NEWS_API_KEY}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error('API error '+res.status);
    const json = await res.json();
    if (!json.articles || json.articles.length === 0) renderNews(SAMPLE_NEWS);
    else renderNews(json.articles.map(a => ({
      title: a.title,
      description: a.description || '',
      url: a.url,
      urlToImage: a.urlToImage || '',
      publishedAt: a.publishedAt
    })));
  } catch(e){
    console.error(e);
    renderNews(SAMPLE_NEWS);
  }
}

function renderNews(articles){
  if (!articles || articles.length === 0) { newsList.innerHTML = `<div class="muted">No news found</div>`; return; }
  newsList.innerHTML = '';
  for (const art of articles) {
    const div = document.createElement('div');
    div.className = 'news-item';
    div.innerHTML = `
      ${art.urlToImage ? `<img src="${art.urlToImage}" alt="" onerror="this.style.display='none'">` : ''}
      <div>
        <h4><a href="${art.url}" target="_blank" rel="noopener">${escapeHtml(art.title)}</a></h4>
        <p class="muted">${escapeHtml((art.description||'')).slice(0,200)}</p>
        <div class="muted" style="margin-top:6px">${(new Date(art.publishedAt)).toLocaleString()}</div>
      </div>
    `;
    newsList.appendChild(div);
  }
}

function escapeHtml(str){
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

if (newsFetchBtn) newsFetchBtn.addEventListener('click', () => {
  fetchNews(newsQuery.value.trim(), newsRegion.value);
});

fetchNews('', 'global');
