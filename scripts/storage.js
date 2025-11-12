// storage.js
const STORE_KEY = 'agilrpg_v1';
function loadState(){ try{ return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); }catch(e){return null;} }
function saveState(s){ localStorage.setItem(STORE_KEY, JSON.stringify(s)); }
function resetState(){ localStorage.removeItem(STORE_KEY); location.reload(); }
