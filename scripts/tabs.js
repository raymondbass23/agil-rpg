// tabs.js - simple accessible tab switching for persona.html
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.tabbtn').forEach(btn=> btn.addEventListener('click', ()=>{
    const target = btn.dataset.tab;
    document.querySelectorAll('.tabbtn').forEach(b=> { b.setAttribute('aria-selected','false'); b.classList.remove('active'); });
    btn.setAttribute('aria-selected','true'); btn.classList.add('active');
    document.querySelectorAll('.tabpanel').forEach(p=> { p.classList.remove('active'); p.setAttribute('aria-hidden','true'); });
    const panel = document.getElementById(target);
    panel.classList.add('active'); panel.setAttribute('aria-hidden','false');
  }));
});
