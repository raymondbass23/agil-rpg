// storage.js - load static CSV and player JSON; manage localStorage state
const DATA_KEY = 'agilrpg_v3_state';

function loadCSV(path){
  return fetch(path).then(r=>r.text()).then(txt=>{
    const lines = txt.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = [];
    for(let i=1;i<lines.length;i++){
      const cols = lines[i].split(',');
      const obj = {};
      headers.forEach((h,idx)=> obj[h.trim()] = cols[idx] ? cols[idx].trim() : '');
      rows.push(obj);
    }
    return rows;
  });
}

function loadJSON(path){
  return fetch(path).then(r=>r.json());
}

function savePlayerInventory(inv){
  // save to localStorage
  localStorage.setItem(DATA_KEY, JSON.stringify(inv));
}

function loadPlayerInventory(){
  const v = localStorage.getItem(DATA_KEY);
  if(v) return JSON.parse(v);
  // fall back to data/player_inventory.json
  return loadJSON('data/player_inventory.json').catch(()=>({acquired:[],equipped:[]}));
}

function mergeCatalogWithPlayer(catalog, player){
  const map = {};
  catalog.forEach(item=>{
    map[item.id] = Object.assign({}, item, {
      acquired: player.acquired.includes(item.id),
      equipped: player.equipped.includes(item.id)
    });
  });
  return Object.values(map);
}
