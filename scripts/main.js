// main.js - navigation and initial rendering
document.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.nav-btn').forEach(b=> b.addEventListener('click', navTo));
  document.getElementById('quick-open-missions').addEventListener('click', ()=> navTo({target:{dataset:{target:'missions'}}}));
  document.getElementById('quick-new-saga').addEventListener('click', ()=> createSaga());

  // initial load
  loadPlayerInventory().then(player=>{
    window.AGIL_PLAYER = player;
    return loadCSV('data/equipment.csv');
  }).then(catalog=>{
    window.AGIL_CATALOG = catalog;
    renderSummary();
    renderInventory();
    renderKanban();
    renderAvatarForm();
  }).catch(err=>{ console.error(err); });
});

function navTo(e){
  const target = e.currentTarget ? e.currentTarget.dataset.target : (e.target && e.target.dataset? e.target.dataset.target : null);
  document.querySelectorAll('.view').forEach(v=> v.classList.remove('active'));
  if(target) document.getElementById(target).classList.add('active');
}

function renderSummary(){
  const player = window.AGIL_PLAYER || {acquired:[],equipped:[]};
  el('summary-level').textContent = 1;
  el('summary-xp').textContent = 0;
  el('summary-coinA').textContent = 0;
  el('summary-coinB').textContent = 0;
  // avatar svg preview
  const av = (player.profile && player.profile.avatar) ? player.profile.avatar : {name:'Protagonista',race:'Humano',role:'Estratega',skin:0,hair:0};
  el('avatar-summary').innerHTML = '<svg width="64" height="64" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="40" r="22" fill="#ffd8b8"/><path d="M38 36 q22 -26 44 0 q-6 6 -22 6 q-16 0 -22 -6" fill="#2f2f2f"/></svg><div><strong>'+ (av.name||'Protagonista') +'</strong><div class="small">'+ (av.role||'') +' · '+ (av.race||'') +'</div></div>';
}

function createSaga(){ const name = prompt('Nombre de la Saga:'); if(!name) return; notify('Saga creada: '+name); }
