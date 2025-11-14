// main.js - general behaviors
document.addEventListener('DOMContentLoaded', ()=>{
  // theme label
  const theme = localStorage.getItem('agil_theme') || 'dark';
  document.body.dataset.theme = theme;
  el('theme-label')?.textContent = theme==='dark' ? 'Oscuro' : 'Claro';

  // render summary on home
  loadPlayer().then(p=>{
    el('sum-name') && (el('sum-name').textContent = p.profile?.avatar?.name || 'Protagonista');
    el('sum-level') && (el('sum-level').textContent = p.level || 1);
    el('sum-coinA') && (el('sum-coinA').textContent = (p.coins && p.coins.A) || 0);
  });
});
