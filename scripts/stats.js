// stats.js - skill system helpers
function renderSkills(){
  const root = document.getElementById('skills-list');
  if(!root) return;
  root.innerHTML = '';
  AGIL.skillDef.categories.forEach(cat=>{
    const sec = document.createElement('div'); sec.className='section';
    sec.innerHTML = `<h4>${cat.name}</h4>`;
    cat.skills.forEach(s=>{
      const st = AGIL.state.skills[s.id] || {tier:0,level:0,xp:0};
      const row = document.createElement('div'); row.className='skill-row';
      const pct = Math.round((st.level/20)*100);
      row.innerHTML = `<div><strong>${s.name}</strong><div class="small">${s.desc||''}</div></div>
        <div style="text-align:right">
          <div class="skill-bar"><div class="skill-fill" style="width:${pct}%"></div></div>
          <div class="small">Lvl ${st.level} · ${tierName(st.tier)}</div>
        </div>`;
      sec.appendChild(row);
    });
    root.appendChild(sec);
  });
}

function awardXPToRandomRelevantSkill(amount){
  const keys = Object.keys(AGIL.state.skills);
  const pick = keys[Math.floor(Math.random()*keys.length)];
  awardXP(pick, amount);
}

function awardXP(skillId, amount){
  const st = AGIL.state.skills[skillId];
  if(!st) return;
  st.xp = (st.xp||0) + amount;
  const need = xpForLevel(st.level, st.tier);
  while(st.xp >= need && st.level < 20){
    st.xp -= need;
    st.level++;
  }
  if(st.level >= 20){
    st.level = 0;
    st.tier = Math.min((st.tier||0)+1, 6);
    // reward small coin
    AGIL.state.currencies.coinB += 1;
  }
  saveState(AGIL.state);
}

function xpForLevel(level, tier){
  const base = 20 + (level * 12);
  const mult = 1 + (tier * 0.45);
  return Math.round(base * mult);
}

function tierName(t){
  const names = ['Aspirante','Iniciado','Adepto','Virtuoso','Maestro','Ascendido','Eterno'];
  return names[t] || names[0];
}
