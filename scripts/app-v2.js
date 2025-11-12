// app-v2.js - improved mobile-first app logic
(function(){
  window.AGIL = window.AGIL || {};
  const seed = {
    profile:{ avatar:{ name:'Protagonista', race:'Humano', role:'Estratega', gender:'male', skin:0, hair:0, symbol:'✦' }, level:1, xp:0 },
    currencies:{ coinA:12, coinB:3, coinC:1 },
    inventory:{ equipped:{}, items:[] },
    skills:{},
    sagas:[]
  };
  AGIL.state = loadState() || seed;

  Promise.all([fetch('data/skills.json').then(r=>r.json()), fetch('data/equipment.json').then(r=>r.json())])
    .then(([skills,equipment])=>{
      AGIL.skillDef = skills; AGIL.equipments = equipment;
      skills.categories.forEach(c => c.skills.forEach(s => { AGIL.state.skills[s.id] = AGIL.state.skills[s.id] || {tier:0,level:0,xp:0}; }));
      if(!AGIL.state.inventory.items || AGIL.state.inventory.items.length === 0){
        AGIL.state.inventory.items = equipment.slice(0,4).map(it => Object.assign({}, it, { uid: 'it_' + Math.random().toString(36).slice(2,8) }));
      }
      saveState(AGIL.state);
      init();
    }).catch(err => { console.error('Data load failed', err); init(); });

  function init(){
    bindUI();
    renderAll();
  }

  function bindUI(){
    document.getElementById('menu-toggle').addEventListener('click', ()=> toggleSide());
    document.getElementById('btn-save').addEventListener('click', ()=> { saveState(AGIL.state); notify('Guardado'); });
    document.getElementById('btn-edit-avatar').addEventListener('click', ()=> location.href='avatar.html');
    document.getElementById('btn-new-saga').addEventListener('click', ()=> createSaga());
    document.getElementById('btn-create').addEventListener('click', ()=> openModal());
    document.getElementById('modal-close').addEventListener('click', ()=> closeModal());
    document.getElementById('task-cancel').addEventListener('click', ()=> closeModal());
    document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
    document.getElementById('nav-inventory').addEventListener('click', ()=> renderPanel('inventory'));
    document.getElementById('nav-skills').addEventListener('click', ()=> renderPanel('skills'));
    document.getElementById('nav-avatar').addEventListener('click', ()=> location.href='avatar.html');
    document.getElementById('nav-dashboard').addEventListener('click', ()=> { toggleSide(false); renderPanel('dashboard'); });
  }

  function renderAll(){
    renderAvatar();
    renderCurrencies();
    renderStats();
    renderSagas();
    populateModalSelects();
  }

  function renderAvatar(){
    const a = AGIL.state.profile.avatar;
    document.getElementById('profile-name').textContent = a.name || 'Protagonista';
    document.getElementById('profile-meta').textContent = (a.role || '') + ' · ' + (a.race || '');
    document.getElementById('profile-level').textContent = AGIL.state.profile.level || 1;
    const el = document.getElementById('avatar-preview');
    el.innerHTML = avatarSVG(a);
  }

  function renderCurrencies(){
    document.getElementById('coinA').textContent = AGIL.state.currencies.coinA || 0;
    document.getElementById('coinB').textContent = AGIL.state.currencies.coinB || 0;
    document.getElementById('coinC').textContent = AGIL.state.currencies.coinC || 0;
  }

  function renderStats(){
    const container = document.getElementById('stats-list');
    container.innerHTML = '';
    if(!AGIL.skillDef) return;
    AGIL.skillDef.categories.forEach(cat => {
      cat.skills.forEach(s => {
        const st = AGIL.state.skills[s.id] || { level: 0, tier: 0, xp:0 };
        const pct = Math.round((st.level / 20) * 100);
        const row = document.createElement('div'); row.className = 'stat-row';
        row.innerHTML = '<div class="stat-name"><strong>' + s.name + '</strong><div class="small">' + (s.desc||'') + '</div></div>' +
          '<div class="stat-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><div class="stat-fill" style="width:' + pct + '%"></div></div>' +
          '<div style="min-width:46px;text-align:right" class="small">Lvl ' + st.level + '</div>';
        container.appendChild(row);
      });
    });
  }

  function renderSagas(){
    const root = document.getElementById('saga-list'); root.innerHTML = '';
    if(!AGIL.state.sagas.length){ root.innerHTML = '<div class="small">No hay Sagas. Crea la primera para organizar tus misiones.</div>'; return; }
    AGIL.state.sagas.forEach(s => {
      const card = document.createElement('div'); card.className = 'saga-card';
      card.innerHTML = '<div style="display:flex;justify-content:space-between;align-items:center"><div><strong>' + s.name + '</strong><div class="small">' + (s.metas?.length||0) + ' metas</div></div><div style="display:flex;gap:6px"><button class="btn small" onclick="promptMeta(\''+s.id+'\')">+Meta</button><button class="btn small" onclick="renameSaga(\''+s.id+'\')">✎</button><button class="btn small" onclick="deleteSaga(\''+s.id+'\')">🗑</button></div></div>';
      (s.metas||[]).forEach(m => {
        const mEl = document.createElement('div'); mEl.className = 'meta-card';
        mEl.innerHTML = '<div style="display:flex;justify-content:space-between"><div><strong>' + m.title + '</strong><div class="small">' + (m.tasks?.length||0) + ' tareas</div></div><div style="display:flex;gap:6px"><button class="btn small" onclick="openModal(\''+s.id+'\',\''+m.id+'\')">+Tarea</button><button class="btn small" onclick="renameMeta(\''+s.id+'\',\''+m.id+'\')">✎</button></div></div>';
        (m.tasks||[]).forEach(t => {
          const ti = document.createElement('div'); ti.className = 'task-item';
          ti.innerHTML = '<div><div style="font-weight:600">' + t.title + '</div><div class="small">' + (t.priority||'') + ' · ' + (t.due||'') + '</div></div><div style="display:flex;gap:6px"><button class="btn small" onclick="completeTask(\''+t.id+'\')">✓</button><button class="btn small" onclick="editTask(\''+t.id+'\')">✎</button><button class="btn small" onclick="removeTask(\''+t.id+'\')">🗑</button></div>';
          mEl.appendChild(ti);
        });
        card.appendChild(mEl);
      });
      root.appendChild(card);
    });
  }

  window.promptMeta = function(sid){ const name = prompt('Nombre de la Meta:'); if(!name) return; const saga = AGIL.state.sagas.find(x=>x.id===sid); saga.metas = saga.metas || []; saga.metas.push({ id:'meta_'+Math.random().toString(36).slice(2,6), title:name, desc:'', tasks:[] }); saveState(AGIL.state); renderSagas(); notify('Meta creada'); };
  window.renameSaga = function(sid){ const s = AGIL.state.sagas.find(x=>x.id===sid); const nm = prompt('Nuevo nombre:', s.name); if(!nm) return; s.name = nm; saveState(AGIL.state); renderSagas(); };
  window.deleteSaga = function(sid){ if(!confirm('Eliminar saga y todo su contenido?')) return; AGIL.state.sagas = AGIL.state.sagas.filter(x=>x.id!==sid); saveState(AGIL.state); renderSagas(); notify('Saga eliminada'); };
  window.renameMeta = function(sid, mid){ const m = findMeta(mid); const nm = prompt('Nuevo nombre:', m.title); if(!nm) return; m.title = nm; saveState(AGIL.state); renderSagas(); };
  window.openModal = function(sid, mid){ openModal(sid, mid); };
  window.editTask = function(tid){ const t = findTask(tid); if(!t) return; openModal(); const modal = document.getElementById('modal'); modal.dataset.edit = tid; document.getElementById('task-type').value = t.type; document.getElementById('task-title').value = t.title; document.getElementById('task-desc').value = t.desc || ''; document.getElementById('task-priority').value = t.priority || 'med'; document.getElementById('task-due').value = t.due || ''; document.getElementById('task-rew-A').value = t.rewards?.A || 0; document.getElementById('task-rew-B').value = t.rewards?.B || 0; document.getElementById('task-rew-C').value = t.rewards?.C || 0; document.getElementById('task-saga').value = ''; };
  window.removeTask = function(tid){ if(!confirm('Eliminar tarea?')) return; for(const s of AGIL.state.sagas) for(const m of (s.metas||[])) m.tasks = (m.tasks||[]).filter(t=>t.id!==tid); saveState(AGIL.state); renderSagas(); notify('Tarea eliminada'); };
  window.completeTask = function(tid){ const t = findTask(tid); if(!t) return; if(t.done) return alert('Ya completada'); t.done = true; AGIL.state.currencies.coinA += t.rewards?.A || 0; AGIL.state.currencies.coinB += t.rewards?.B || 0; AGIL.state.currencies.coinC += t.rewards?.C || 0; awardRandomXP(12); saveState(AGIL.state); renderSagas(); renderCurrencies(); notify('Completada'); };

  function findMeta(mid){ for(const s of AGIL.state.sagas) for(const m of (s.metas||[])) if(m.id===mid) return m; return null; }
  function findTask(tid){ for(const s of AGIL.state.sagas) for(const m of (s.metas||[])) for(const t of (m.tasks||[])) if(t.id===tid) return t; return null; }

  function openModal(sagaId='', metaId=''){ const modal = document.getElementById('modal'); modal.classList.remove('hidden'); modal.dataset.edit = ''; populateModalSelects(sagaId, metaId); setTimeout(()=> document.getElementById('task-title').focus(), 120); }
  function closeModal(){ const modal = document.getElementById('modal'); modal.classList.add('hidden'); modal.dataset.edit = ''; }
  function populateModalSelects(selectedSaga='', selectedMeta=''){ const sagaSel = document.getElementById('task-saga'); sagaSel.innerHTML = '<option value="">Sin saga</option>'; AGIL.state.sagas.forEach(s => { const opt = document.createElement('option'); opt.value = s.id; opt.textContent = s.name; sagaSel.appendChild(opt); }); const metaSel = document.getElementById('task-meta'); metaSel.innerHTML = '<option value="">Sin meta</option>'; AGIL.state.sagas.forEach(s => (s.metas||[]).forEach(m => { const opt = document.createElement('option'); opt.value = m.id; opt.textContent = s.name + ' → ' + m.title; metaSel.appendChild(opt); })); if(selectedSaga) sagaSel.value = selectedSaga; if(selectedMeta) metaSel.value = selectedMeta; }

  function handleTaskSubmit(e){ e.preventDefault(); const modal = document.getElementById('modal'); const editId = modal.dataset.edit || ''; const type = document.getElementById('task-type').value; const sagaId = document.getElementById('task-saga').value; const metaId = document.getElementById('task-meta').value; const title = document.getElementById('task-title').value.trim(); if(!title) { alert('Escribe un título'); return; } const desc = document.getElementById('task-desc').value; const priority = document.getElementById('task-priority').value; const due = document.getElementById('task-due').value; const rewards = { A: Number(document.getElementById('task-rew-A').value||0), B: Number(document.getElementById('task-rew-B').value||0), C: Number(document.getElementById('task-rew-C').value||0) }; if(editId){ const t = findTask(editId); if(!t) return; Object.assign(t,{type,title,desc,priority,due,rewards}); saveState(AGIL.state); renderSagas(); closeModal(); notify('Tarea actualizada'); return; } const newTask = { id:'task_'+Math.random().toString(36).slice(2,6), type, title, desc, priority, due, rewards, done:false }; if(metaId){ const m = findMeta(metaId); m.tasks = m.tasks || []; m.tasks.push(newTask); } else if(sagaId){ const saga = AGIL.state.sagas.find(s => s.id === sagaId); const newMeta = { id:'meta_'+Math.random().toString(36).slice(2,6), title:'(Meta auto)', desc:'', tasks:[newTask] }; saga.metas = saga.metas || []; saga.metas.push(newMeta); } else { const s = { id:'saga_'+Math.random().toString(36).slice(2,6), name:title, metas:[{ id:'meta_'+Math.random().toString(36).slice(2,6), title:'Meta inicial', tasks:[newTask] }] }; AGIL.state.sagas.push(s); } saveState(AGIL.state); renderSagas(); closeModal(); notify('Tarea creada'); }

  function createSaga(){ const name = prompt('Nombre de la nueva Saga:'); if(!name) return; AGIL.state.sagas.push({ id:'saga_'+Math.random().toString(36).slice(2,6), name, metas:[] }); saveState(AGIL.state); renderSagas(); notify('Saga creada'); }

  function notify(msg){ const el = document.getElementById('panel-content'); el.textContent = msg; setTimeout(()=> el.textContent = '', 1200); }

  function awardRandomXP(amount){ const keys = Object.keys(AGIL.state.skills); if(!keys.length) return; const id = keys[Math.floor(Math.random()*keys.length)]; AGIL.state.skills[id].xp = (AGIL.state.skills[id].xp||0) + amount; const need = xpForLevel(AGIL.state.skills[id].level, AGIL.state.skills[id].tier); while(AGIL.state.skills[id].xp >= need && AGIL.state.skills[id].level < 20){ AGIL.state.skills[id].xp -= need; AGIL.state.skills[id].level++; } if(AGIL.state.skills[id].level >= 20){ AGIL.state.skills[id].level = 0; AGIL.state.skills[id].tier = Math.min((AGIL.state.skills[id].tier||0)+1,6); AGIL.state.currencies.coinB += 1; } saveState(AGIL.state); }

  function xpForLevel(level,tier){ const base = 20 + (level * 12); const mult = 1 + (tier * 0.45); return Math.round(base * mult); }

  function renderPanel(key){ const pc = document.getElementById('panel-content'); if(key === 'inventory'){ pc.innerHTML = renderInventoryPanel(); return; } if(key === 'skills'){ pc.innerHTML = renderSkillsPanel(); return; } pc.innerHTML = ''; }

  function renderInventoryPanel(){ const items = AGIL.state.inventory.items || []; let out = '<div class="panel"><h3>Inventario</h3><div class="inventory-list">'; items.forEach(it => { out += '<div class="inventory-item"><strong>' + it.name + '</strong><div class="small">' + it.category + ' · ' + it.tier + '</div><div class="small">' + it.effect + '</div><div style="margin-top:8px"><button class="btn small" onclick="equipItem(\''+it.uid+'\')">Equipar</button> <button class="btn small" onclick="dropItem(\''+it.uid+'\')">Eliminar</button></div></div>'; }); out += '</div></div>'; return out; }

  function renderSkillsPanel(){ if(!AGIL.skillDef) return '<div class="panel"><h3>Habilidades</h3><div class="small">Cargando...</div></div>'; let out = ''; AGIL.skillDef.categories.forEach(cat => { out += '<div class="panel"><h3>' + cat.name + '</h3>'; cat.skills.forEach(s => { const st = AGIL.state.skills[s.id] || { level:0, tier:0 }; const pct = Math.round((st.level/20)*100); out += '<div class="stat-row"><div><strong>' + s.name + '</strong><div class="small">' + (s.desc||'') + '</div></div><div style="text-align:right"><div style="width:140px;background:rgba(255,255,255,0.03);height:10px;border-radius:6px;overflow:hidden"><div style="width:' + pct + '%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></div></div><div class="small">Lvl ' + st.level + '</div></div></div>'; }); out += '</div>'; }); return out; }

  window.equipItem = function(uid){ const it = AGIL.state.inventory.items.find(x=>x.uid===uid); if(!it) return; AGIL.state.inventory.equipped[it.category] = it; saveState(AGIL.state); notify('Equipado'); renderAvatar(); }
  window.dropItem = function(uid){ AGIL.state.inventory.items = AGIL.state.inventory.items.filter(x=>x.uid!==uid); saveState(AGIL.state); renderPanel('inventory'); notify('Eliminado'); }

  function toggleSide(force){ const side = document.getElementById('side'); if(typeof force === 'boolean') side.classList.toggle('hidden', !force); else side.classList.toggle('hidden'); }

  function avatarSVG(profile){ const skinPal = ['#f5d7c4','#ffd8b8','#f2e9d7','#e7f5ff','#fbe7ff']; const hairPal = ['#2f2f2f','#443a9e','#b3477a','#3a8f6b','#000000']; const skin = skinPal[(profile.skin||0) % skinPal.length]; const hair = hairPal[(profile.hair||0) % hairPal.length]; return '<svg width="76" height="76" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><rect x="6" y="6" width="108" height="108" rx="12" fill="rgba(255,255,255,0.01)"/><circle cx="60" cy="40" r="22" fill="' + skin + '"/><path d="M38 36 q22 -26 44 0 q-6 6 -22 6 q-16 0 -22 -6" fill="' + hair + '"/><text x="60" y="92" text-anchor="middle" font-size="14" fill="' + (profile.symbol||'#caa7ff') + '">' + (profile.symbol||'✦') + '</text></svg>'; }

  window.findTask = findTask; window.findMeta = findMeta; window.renderSagas = renderSagas;
})();
