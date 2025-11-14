// storage.js - data loading and persistence
const PLAYER_KEY = 'agilrpg_player_state_v1';

function loadCSV(path){ return fetch(path).then(r=>r.text()).then(txt=>{ const lines = txt.trim().split('\n'); const headers = lines[0].split(','); const rows=[]; for(let i=1;i<lines.length;i++){ const cols = lines[i].split(','); const obj={}; headers.forEach((h,idx)=> obj[h.trim()]= (cols[idx]||'').trim() ); rows.push(obj); } return rows; }); }

function loadPlayer(){ const raw = localStorage.getItem(PLAYER_KEY); if(raw) return Promise.resolve(JSON.parse(raw)); return fetch('data/player_inventory.json').then(r=>r.json()).catch(()=>({acquired:[],equipped:[],profile:{avatar:{name:'Protagonista',race:'Humano',role:'Estratega',gender:'male'}},stats:{str:5,agi:5,int:5,vit:5,per:5},level:1,xp:0,coins:{A:0,B:0}})); }

function savePlayer(p){ localStorage.setItem(PLAYER_KEY, JSON.stringify(p)); }
