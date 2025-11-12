// quests.js - simple saga/meta/mission handling
function renderSagas(){
  const root = document.getElementById('saga-list');
  if(!root) return;
  root.innerHTML = '';
  AGIL.state.sagas.forEach(saga=>{
    const div = document.createElement('div');
    div.className = 'saga-card';
    div.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center">
      <div><strong>${saga.name}</strong><div class="small">Metas: ${saga.metas?.length||0}</div></div>
      <div><button class="btn-add-meta" data-sid="${saga.id}">+ Meta</button></div>
    </div>`;
    const metaList = document.createElement('div'); metaList.className='meta-list';
    (saga.metas||[]).forEach(meta=>{
      const m = document.createElement('div'); m.className='meta-card';
      m.innerHTML = `<div style="display:flex;justify-content:space-between">
        <div><strong>${meta.title}</strong><div class="small">${meta.desc||''}</div></div>
        <div><button class="btn-add-task" data-mid="${meta.id}">+ Tarea</button></div>
      </div>`;
      const tlist = document.createElement('div'); tlist.className='task-list';
      (meta.tasks||[]).forEach(task=>{
        const ti = document.createElement('div'); ti.className='task-item';
        ti.innerHTML = `<div class="left"><div style="width:8px;height:8px;border-radius:3px;background:${task.type==='consequence'?'#e06':'#6b5dd3'}"></div>
          <div style="margin-left:8px">
            <div class="title">${task.title}</div>
            <div class="small">${task.priority||''} · ${task.due||''}</div>
          </div></div>
          <div class="task-actions">
            <button class="btn-complete" data-tid="${task.id}">✓</button>
          </div>`;
        tlist.appendChild(ti);
      });
      m.appendChild(tlist);
      metaList.appendChild(m);
    });
    div.appendChild(metaList);
    root.appendChild(div);
  });
  // attach handlers
  document.querySelectorAll('.btn-add-meta').forEach(b=> b.onclick = e=>{
    const sid = e.target.dataset.sid;
    const name = prompt('Nombre de la Meta:');
    if(!name) return;
    const saga = AGIL.state.sagas.find(x=>x.id===sid);
    saga.metas = saga.metas || [];
    saga.metas.push({ id:'meta_'+Math.random().toString(36).slice(2,6), title:name, desc:'', tasks:[] });
    saveState(AGIL.state); renderSagas();
  });
  document.querySelectorAll('.btn-add-task').forEach(b=> b.onclick = e=>{
    const mid = e.target.dataset.mid;
    const meta = findMetaById(mid);
    if(!meta) return;
    const title = prompt('Titulo:');
    if(!title) return;
    const type = confirm('¿Es consecuencia? (OK) o misión (Cancelar)') ? 'consequence' : 'mission';
    meta.tasks = meta.tasks || [];
    meta.tasks.push({ id:'task_'+Math.random().toString(36).slice(2,6), title, desc:'', type, priority:'med', due:'', rewards:{A:0,B:0,C:0}, done:false });
    saveState(AGIL.state); renderSagas();
  });
  document.querySelectorAll('.btn-complete').forEach(b=> b.onclick = e=>{
    const tid = e.target.dataset.tid;
    markTaskComplete(tid);
  });
}

function findMetaById(mid){
  for(const s of AGIL.state.sagas) for(const m of (s.metas||[])) if(m.id===mid) return m;
  return null;
}
function findTaskById(tid){
  for(const s of AGIL.state.sagas) for(const m of (s.metas||[])) for(const t of (m.tasks||[])) if(t.id===tid) return t;
  return null;
}

function markTaskComplete(tid){
  const task = findTaskById(tid);
  if(!task) return alert('No encontrado');
  task.done = true;
  AGIL.state.currencies.coinA += task.rewards?.A || 0;
  AGIL.state.currencies.coinB += task.rewards?.B || 0;
  AGIL.state.currencies.coinC += task.rewards?.C || 0;
  // award xp to a relevant skill (random for now)
  awardXPToRandomRelevantSkill(12);
  saveState(AGIL.state); renderSagas(); renderCurrencies(); renderSkills();
  alert('Tarea completada');
}
