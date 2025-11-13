// missions.js - simple Kanban management stored in localStorage under 'agilrpg_missions'
const MISSIONS_KEY = 'agilrpg_missions';

function loadMissions(){
  const raw = localStorage.getItem(MISSIONS_KEY);
  if(raw) return JSON.parse(raw);
  // seed
  const seed = [
    {id:'m1',title:'Lavar platos',state:'pending',priority:'low',rewards:{A:1,B:0,C:0}},
    {id:'m2',title:'Leer 30 min',state:'pending',priority:'med',rewards:{A:2,B:0,C:0}}
  ];
  localStorage.setItem(MISSIONS_KEY, JSON.stringify(seed));
  return seed;
}

function saveMissions(ms){ localStorage.setItem(MISSIONS_KEY, JSON.stringify(ms)); }

function renderKanban(){
  const cols = {pending: el('col-pending'), inprogress: el('col-inprogress'), done: el('col-done')};
  Object.values(cols).forEach(c=> c.innerHTML = '');
  const missions = loadMissions();
  missions.forEach(m=>{
    const card = create('div','task-card'); card.draggable = true; card.dataset.id = m.id;
    card.innerHTML = '<div style="font-weight:700">'+m.title+'</div><div class="small">Recompensa: '+(m.rewards?.A||0)+' ✦</div>';
    card.addEventListener('dragstart', e=> { card.classList.add('dragging'); e.dataTransfer.setData('text/plain', m.id); });
    card.addEventListener('dragend', ()=> { card.classList.remove('dragging'); });
    card.addEventListener('click', ()=> openMissionDetail(m.id));
    cols[m.state].appendChild(card);
  });
  // bind drop
  document.querySelectorAll('.col-body').forEach(col=>{
    col.addEventListener('drop', e=>{
      const id = e.dataTransfer.getData('text/plain');
      moveMission(id, col.parentElement.dataset.state);
    });
  });
  // bind add buttons
  document.querySelectorAll('.col-add').forEach(b=> b.onclick = ()=> addMissionPrompt(b.dataset.state));
}

function addMissionPrompt(state){
  const title = prompt('Título de la misión:');
  if(!title) return;
  const missions = loadMissions();
  const id = 'm' + Math.random().toString(36).slice(2,6);
  missions.push({id, title, state, priority:'low', rewards:{A:1,B:0,C:0}});
  saveMissions(missions);
  renderKanban();
}

function moveMission(id, newState){
  const missions = loadMissions();
  const m = missions.find(x=>x.id===id);
  if(!m) return;
  m.state = newState;
  saveMissions(missions);
  renderKanban();
}

function openMissionDetail(id){
  const missions = loadMissions();
  const m = missions.find(x=>x.id===id);
  if(!m) return;
  const ok = confirm('Completar misión "'+m.title+'"?');
  if(ok){
    m.state = 'done';
    saveMissions(missions);
    // reward
    const player = window.AGIL_PLAYER || {acquired:[],equipped:[]};
    player.acquired = player.acquired || [];
    player.equipped = player.equipped || [];
    player.acquired.push('2344'); // demo: give an item when complete
    savePlayerInventory(player);
    window.AGIL_PLAYER = player;
    renderInventory();
    renderKanban();
    notify('Misión completada. Recompensa otorgada.');
  }
}
