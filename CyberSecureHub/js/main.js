// main.js - small helpers
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  try {
    const path = location.pathname.split('/').pop() || 'index.html';
    $$('header .topbar a, .topbar a, nav a').forEach(a => {
      if (a.getAttribute('href') === path) a.classList.add('active');
    });
  } catch(e){}
});
