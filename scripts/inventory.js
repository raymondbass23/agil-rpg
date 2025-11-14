// inventory.js - merge catalog and player inventory, render and allow equip toggle
function renderInventory(areaId){
  Promise.all([ loadCSV('data/equipment.csv'), loadPlayer() ]).then(([catalog, player])=>{
    const merged = catalog.map(it=> Object.assign({}, it, { acquired: (player.acquired||[]).includes(it.id), equipped: (player.equipped||[]).includes(it.id) }));
    const area = document.getElementById(areaId || 'inventory-list') || document.getElementById('inventory-list-full');
    if(!area) return;
    area.innerHTML = '';
    merged.forEach(item=>{
      const row = create('div','inventory-item');
      row.innerHTML = '<div><strong>'+item.name+'</strong><div class="small muted">'+item.category+' · '+item.rarity+' · Tier '+item.tier+'</div></div>';
      const actions = create('div','inv-actions');
      const btn = create('button','btn');
      btn.textContent = item.acquired ? (item.equipped ? 'Desequipar' : 'Equipar') : 'Adquirir';
      btn.addEventListener('click', ()=> toggleItem(item.id));
      actions.appendChild(btn);
      row.appendChild(actions);
      area.appendChild(row);
    });
    // update equip slots
    const equipSlots = document.getElementById('equip-slots');
    if(equipSlots){
      const equipped = (player.equipped||[]);
      equipSlots.querySelectorAll('.slot').forEach((s, idx)=>{
        const id = equipped[idx];
        const name = id ? (merged.find(x=>x.id===id)||{}).name || 'Sin equipo' : 'Sin equipo';
        s.querySelector('.slot-val').textContent = name;
      });
    }
  });
}

function toggleItem(id){
  loadPlayer().then(player=>{
    player.acquired = player.acquired || [];
    player.equipped = player.equipped || [];
    if(!player.acquired.includes(id)){
      player.acquired.push(id);
      notify('Ítem adquirido');
    } else {
      if(player.equipped.includes(id)){
        player.equipped = player.equipped.filter(x=>x!==id);
        notify('Desequipado');
      } else {
        // simple rule: equip as primary (single equip for demo)
        player.equipped = [id];
        notify('Equipado');
      }
    }
    savePlayer(player);
    window.AGIL_PLAYER = player;
    renderInventory();
  });
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderInventory('inventory-list');
  renderInventory('inventory-list-full');
});
