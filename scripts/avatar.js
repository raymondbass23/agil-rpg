// avatar.js - handles avatar creation and rendering
function initUI(){
  renderAvatarCard();
  renderCurrencies();
  renderSagas();
  renderSkills();
  renderInventoryList();
  bindControls();
}

function bindControls(){
  const btnToggle = document.getElementById('btn-toggle-create');
  if(btnToggle) btnToggle.onclick = ()=> toggleCreatePanel();
  const btnSave = document.getElementById('btn-save');
  if(btnSave) btnSave.onclick = ()=> { saveState(AGIL.state); alert('Guardado localmente'); };
  const newSaga = document.getElementById('btn-new-saga');
  if(newSaga) newSaga.onclick = ()=> {
    const name = prompt('Nombre de la nueva Saga:');
    if(!name) return;
    AGIL.state.sagas.push({ id:'saga_'+Math.random().toString(36).slice(2,6), name, metas:[] });
    saveState(AGIL.state); renderSagas();
  };
  const avatarForm = document.getElementById('avatar-form');
  if(avatarForm){
    // populate options
    populateAvatarOptions();
    avatarForm.onsubmit = (e)=> {
      e.preventDefault();
      const name = document.getElementById('avatar-name').value || 'Protagonista';
      AGIL.state.profile.avatar.name = name;
      AGIL.state.profile.avatar.gender = document.getElementById('avatar-gender').value;
      AGIL.state.profile.avatar.race = document.getElementById('avatar-race').value;
      AGIL.state.profile.avatar.role = document.getElementById('avatar-role').value;
      AGIL.state.profile.avatar.skin = Number(document.getElementById('avatar-skin').value);
      AGIL.state.profile.avatar.hair = Number(document.getElementById('avatar-hair').value);
      saveState(AGIL.state);
      alert('Avatar guardado.');
    };
  }
}

function populateAvatarOptions(){
  const races = ['Humano','Elfo','Enano','Androide','Espíritu','Demi-Humano'];
  const roles = ['Estratega','Visionario','Guardián','Emisario','Viajero','Forjador','Sabio','Corazón Ardiente'];
  const skinSel = document.getElementById('avatar-skin');
  const hairSel = document.getElementById('avatar-hair');
  const raceSel = document.getElementById('avatar-race');
  const roleSel = document.getElementById('avatar-role');
  races.forEach((r,i)=> raceSel.appendChild(Object.assign(document.createElement('option'),{value:r,textContent:r})));
  roles.forEach((r,i)=> roleSel.appendChild(Object.assign(document.createElement('option'),{value:r,textContent:r})));
  for(let i=0;i<5;i++){ skinSel.appendChild(Object.assign(document.createElement('option'),{value:i,textContent:'Tono '+(i+1)})); hairSel.appendChild(Object.assign(document.createElement('option'),{value:i,textContent:'Peinado '+(i+1)}));}
  // populate fields if exists
  const av = AGIL.state.profile.avatar;
  document.getElementById('avatar-name').value = av.name || '';
  document.getElementById('avatar-gender').value = av.gender || 'male';
  document.getElementById('avatar-race').value = av.race || 'Humano';
  document.getElementById('avatar-role').value = av.role || 'Estratega';
  document.getElementById('avatar-skin').value = av.skin || 0;
  document.getElementById('avatar-hair').value = av.hair || 0;
  renderAvatarCard();
}

function renderAvatarCard(){
  const el = document.getElementById('avatar-card') || document.getElementById('avatar-preview');
  if(!el) return;
  const a = AGIL.state.profile.avatar;
  el.innerHTML = '';
  const svg = document.createElement('div');
  svg.className = 'avatar-svg';
  svg.innerHTML = avatarSVG(a);
  el.appendChild(svg);
  const meta = document.createElement('div'); meta.className='avatar-meta small';
  meta.innerHTML = `<strong>${a.name}</strong><div>${a.role} · ${a.race}</div>`;
  el.appendChild(meta);
}

function avatarSVG(profile){
  const colorPal = ['#f5d7c4','#ffd8b8','#f2e9d7','#e7f5ff','#fbe7ff'];
  const hairPal = ['#2f2f2f','#443a9e','#b3477a','#3a8f6b','#000000'];
  const skin = colorPal[(profile.skin||0) % colorPal.length];
  const hair = hairPal[(profile.hair||0) % hairPal.length];
  return `
    <svg viewBox="0 0 120 120" width="150" height="150" xmlns="http://www.w3.org/2000/svg" role="img">
      <rect x="6" y="6" width="108" height="108" rx="14" fill="rgba(255,255,255,0.02)" />
      <circle cx="60" cy="42" r="22" fill="${skin}" stroke="rgba(255,255,255,0.03)" stroke-width="2"/>
      <path d="M38 36 q22 -26 44 0 q-6 6 -22 6 q-16 0 -22 -6" fill="${hair}" opacity="0.95"/>
      <rect x="34" y="62" width="52" height="36" rx="8" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.02)"/>
      <circle cx="52" cy="40" r="2.2" fill="#0b1220"/>
      <circle cx="68" cy="40" r="2.2" fill="#0b1220"/>
      <text x="60" y="92" text-anchor="middle" font-size="14" fill="${'#caa7ff'}">${profile.symbol||'✦'}</text>
    </svg>`;
}
