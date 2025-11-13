// utils.js small helpers
function el(id){ return document.getElementById(id); }
function create(tag, cls){ const d = document.createElement(tag); if(cls) d.className = cls; return d; }
function notify(msg){ const pc = el('app'); const n = create('div','notify'); n.textContent = msg; Object.assign(n.style,{position:'fixed',right:'12px',bottom:'80px',background:'#041722',padding:'8px 12px',borderRadius:'8px'}); document.body.appendChild(n); setTimeout(()=>n.remove(),1400); }
