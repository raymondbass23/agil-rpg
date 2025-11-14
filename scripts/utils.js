// utils.js - small helpers
function el(id){return document.getElementById(id);}
function create(tag, cls){ const e=document.createElement(tag); if(cls) e.className=cls; return e; }
function notify(msg){ const n=create('div','notify'); n.textContent=msg; Object.assign(n.style,{position:'fixed',right:'12px',bottom:'120px',background:'#041722',color:'#fff',padding:'8px 12px',borderRadius:'8px'}); document.body.appendChild(n); setTimeout(()=>n.remove(),1400); }
