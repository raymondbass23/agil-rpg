/* dashboard.js - quick rendering for index.html */
document.addEventListener('DOMContentLoaded', ()=>{
  // render quick player summary
  loadPlayer().then(p=>{
    document.getElementById('dash-name') && (document.getElementById('dash-name').textContent = p.profile?.avatar?.name || 'Protagonista');
    document.getElementById('dash-level') && (document.getElementById('dash-level').textContent = p.level || 1);
    document.getElementById('dash-role') && (document.getElementById('dash-role').textContent = (p.profile?.avatar?.role||'') + ' · ' + (p.profile?.avatar?.race||''));
    document.getElementById('dash-mini-stats') && (document.getElementById('dash-mini-stats').textContent = 'STR '+(p.stats?.str||0)+' · AGI '+(p.stats?.agi||0)+' · INT '+(p.stats?.int||0));
  });

  // render quick missions (3 items)
  const missionsArea = document.getElementById('dash-missions');
  if(missionsArea){
    const ms = (localStorage.getItem('agilrpg_missions_v1') && JSON.parse(localStorage.getItem('agilrpg_missions_v1'))) || [];
    const active = ms.filter(m=> m.state !== 'done').slice(0,3);
    if(active.length===0){ missionsArea.innerHTML = '<div class="small muted">No hay misiones activas</div>'; }
    else{
      missionsArea.innerHTML = '';
      active.forEach(m=>{
        const div = document.createElement('div');
        div.className = 'task small';
        div.textContent = m.title + ' — ' + (m.state||'Pendiente');
        div.setAttribute('role','listitem');
        missionsArea.appendChild(div);
      });
    }
  }

  // render equipped items quick
  Promise.all([ loadCSV('data/equipment.csv'), loadPlayer() ]).then(([catalog, player])=>{
    const equipArea = document.getElementById('dash-equip');
    if(!equipArea) return;
    equipArea.innerHTML = '';
    const equipped = (player.equipped||[]);
    if(equipped.length===0){ equipArea.innerHTML = '<div class="muted small">Sin equipo equipado</div>'; return; }
    equipped.slice(0,4).forEach(id=>{
      const item = catalog.find(c=> c.id===id);
      const div = document.createElement('div');
      div.className = 'equip-item';
      div.innerHTML = '<strong>' + (item?item.name:'Ítem') + '</strong><div class="small muted">'+ (item?item.rarity:'') +'</div>';
      equipArea.appendChild(div);
    });
  });

  // notifications (simple)
  const noteArea = document.getElementById('dash-notifications');
  if(noteArea){
    noteArea.innerHTML = '';
    const notes = [];
    const msRaw = localStorage.getItem('agilrpg_missions_v1');
    const ms = msRaw ? JSON.parse(msRaw) : [];
    const pending = ms.filter(m=> m.state === 'pending').length;
    if(pending>0) notes.push('Tienes ' + pending + ' misiones pendientes');
    loadPlayer().then(p=>{
      if((p.hp && p.hp.current) && p.hp.current < (p.hp.max||50)*0.3) notes.push('Tu HP está bajo');
      if(notes.length===0) noteArea.innerHTML = '<li class="small muted">Sin novedades</li>';
      else notes.forEach(n=>{ const li = document.createElement('li'); li.textContent = n; noteArea.appendChild(li); });
    });
  }

  // open settings shortcut
  document.getElementById('open-settings')?.addEventListener('click', ()=> window.location.href = 'settings.html');
});