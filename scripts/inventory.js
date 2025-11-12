// inventory.js - render inventory and equip actions
function renderInventoryList(){
  const root = document.getElementById('inventory-list');
  if(!root) return;
  root.innerHTML = '';
  AGIL.state.inventory.items.forEach(it=>{
    const el = document.createElement('div'); el.className='inventory-item';
    el.innerHTML = `<strong>${it.name}</strong><div class="small">${it.category} · ${it.tier}</div><div class="small">${it.effect}</div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn-equip" data-uid="${it.uid}">Equipar</button>
        <button class="btn-drop" data-uid="${it.uid}">Eliminar</button>
      </div>`;
    root.appendChild(el);
  });
  document.querySelectorAll('.btn-equip').forEach(b=> b.onclick = e=>{
    const uid = e.target.dataset.uid;
    const it = AGIL.state.inventory.items.find(x=>x.uid===uid);
    if(!it) return;
    AGIL.state.inventory.equipped[it.category] = it;
    saveState(AGIL.state); renderInventoryList(); renderAvatarCard(); renderInventoryShort();
  });
  document.querySelectorAll('.btn-drop').forEach(b=> b.onclick = e=>{
    const uid = e.target.dataset.uid;
    AGIL.state.inventory.items = AGIL.state.inventory.items.filter(x=>x.uid!==uid);
    saveState(AGIL.state); renderInventoryList();
  });
}

function renderInventoryShort(){
  const el = document.getElementById('equipped-list');
  if(!el) return;
  el.innerHTML = '';
  const eq = AGIL.state.inventory.equipped || {};
  const keys = Object.keys(eq);
  if(!keys.length) { el.innerHTML = '<div class="small">Sin equipo equipado</div>'; return; }
  keys.forEach(k=>{
    const it = eq[k];
    const d = document.createElement('div'); d.className='small'; d.textContent = `${k}: ${it.name} (${it.tier})`; el.appendChild(d);
  });
}
