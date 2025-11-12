// main.js
(function(){
  window.AGIL = window.AGIL || {};
  const seed = {
    profile:{ avatar:{ name:'Protagonista', race:'Humano', role:'Estratega', gender:'male', skin:0,hair:0, symbol:'✦' }, level:1, xp:0 },
    currencies:{ coinA:12, coinB:3, coinC:1 },
    inventory:{ equipped:{}, items:[] },
    skills:{},
    sagas: []
  };
  AGIL.state = loadState() || seed;
  Promise.all([fetch('data/skills.json').then(r=>r.json()), fetch('data/equipment.json').then(r=>r.json())])
    .then(([skills,equipment])=>{
      AGIL.skillDef = skills; AGIL.equipments = equipment;
      skills.categories.forEach(c=> c.skills.forEach(s=> AGIL.state.skills[s.id] = AGIL.state.skills[s.id] || {tier:0,level:0,xp:0}));
      if(!AGIL.state.inventory.items || !AGIL.state.inventory.items.length){
        AGIL.state.inventory.items = equipment.slice(0,5).map(it=> Object.assign({},it,{uid:'it_'+Math.random().toString(36).slice(2,8)}));
      }
      saveState(AGIL.state);
      if(typeof initUX === 'function') initUX();
    }).catch(err=>{ console.error(err); if(typeof initUX === 'function') initUX(); });
})();
