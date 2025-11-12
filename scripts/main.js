// main.js - orchestrador simple
(function(){
  // ensure data loaded
  console.log('agil-rpg v1 booting...');
  // expose small api to other modules
  window.AGIL = window.AGIL || {};
  AGIL.state = loadState() || {
    profile:{ avatar:{ name:'Protagonista', race:'Humano', role:'Estratega', gender:'male', skin:0,hair:0, symbol:'✦' }, level:1, xp:0 },
    currencies:{ coinA:20, coinB:5, coinC:2 },
    inventory:{ equipped:{}, items:[] },
    skills:{},
    sagas: []
  };
  // initialize default skills and equipment later after data loads
  document.addEventListener('DOMContentLoaded', ()=> {
    // load skills and equipments via fetch
    fetch('data/skills.json').then(r=>r.json()).then(sk=>{
      window.AGIL.skillDef = sk;
      // seed skills
      sk.categories.forEach(cat=> cat.skills.forEach(s => {
        AGIL.state.skills[s.id] = AGIL.state.skills[s.id] || { tier:0, level:0, xp:0 };
      }));
      // load equipment list
      return fetch('data/equipment.json');
    }).then(r=>r.json()).then(eq=>{
      window.AGIL.equipments = eq;
      // seed inventory items if empty
      if(!AGIL.state.inventory.items || !AGIL.state.inventory.items.length){
        AGIL.state.inventory.items = eq.slice(0,6).map(i=> Object.assign({},i,{uid: 'it_'+Math.random().toString(36).slice(2,8)}));
      }
      // save and render UI
      saveState(AGIL.state);
      if(typeof initUI === 'function') initUI();
    }).catch(err=> { console.error('data load error',err); });
  });
  window.saveApp = ()=> saveState(AGIL.state);
})();
