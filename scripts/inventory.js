// inventory.js - show catalog and player inventory; allow equip/deselect
function renderInventory(){
  Promise.all([ loadCSV('data/equipment.csv'), loadPlayerInventory() ]).then(([catalog, player])=>{
    const merged = mergeCatalogWithPlayer(catalog, player);
    window.AGIL_MERGED = merged;
    const list = el('inventory-list'); list.innerHTML = '';
    merged.forEach(item=>{
      const it = create('div','inventory-item');
      it.innerHTML = '<div><strong>'+item.name+'</strong><div class="small">'+item.category+' · '+item.rarity+' · Tier '+item.tier+'</div></div>';
      const actions = create('div','inv-actions');
      const btn = create('button','btn'); btn.textContent = item.acquired ? (item.equipped ? 'Desequipar' : 'Equipar') : 'Adquirir';
      btn.onclick = ()=> handleItemAction(item.id);
      actions.appendChild(btn);
      it.appendChild(actions);
      list.appendChild(it);
    });
    // update equip slots view
    const slots = el('equip-slots');
    const equipped = (player && player.equipped) ? player.equipped : [];
    slots.querySelectorAll('.slot').forEach(s=>{
      const name = equipped.length ? (merged.find(x=>x.id===equipped[0])||{}).name || 'Sin equipo' : 'Sin equipo';
      s.querySelector('.slot-val').textContent = name;
    });
  });
}

function handleItemAction(id){
  const player = window.AGIL_PLAYER || {acquired:[],equipped:[]};
  if(!player.acquired.includes(id)){
    // acquire
    player.acquired.push(id);
    notify('Ítem adquirido');
  } else {
    // toggle equip (simple logic: only one equipped for demo)
    if(player.equipped.includes(id)){
      player.equipped = player.equipped.filter(x=>x!==id);
      notify('Desequipado');
    } else {
      // put as only equipped item (demo)
      player.equipped = [id];
      notify('Equipado');
    }
  }
  savePlayerInventory(player);
  window.AGIL_PLAYER = player;
  renderInventory();
}
