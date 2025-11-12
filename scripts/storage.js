// storage.js - simple localStorage wrapper
const STORE_KEY = 'agilrpg_v1';
function loadState(){
  try { const s = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); return s; } catch(e){ return null; }
}
function saveState(state){
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}
function resetState(){
  localStorage.removeItem(STORE_KEY);
  location.reload();
}
