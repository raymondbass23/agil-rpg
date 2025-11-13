// avatar.js - avatar creation/editing
const races = ['Humano','Elfo','Enano','Androide','Espíritu'];
const roles = ['Estratega','Guardián','Viajero','Sabio'];

function renderAvatarForm(){
  const raceSel = el('av-race'); const roleSel = el('av-role');
  raceSel.innerHTML=''; roleSel.innerHTML='';
  races.forEach(r=> raceSel.appendChild(new Option(r,r)));
  roles.forEach(r=> roleSel.appendChild(new Option(r,r)));
  const player = window.AGIL_PLAYER || {};
  const profile = player.profile || {};
  const avatar = profile.avatar || {name:'Protagonista',gender:'male',race:'Humano',role:'Estratega'};
  el('av-name').value = avatar.name || '';
  el('av-gender').value = avatar.gender || 'male';
  el('av-race').value = avatar.race || 'Humano';
  el('av-role').value = avatar.role || 'Estratega';
  // preview
  renderAvatarPreview(avatar);

  document.getElementById('avatar-form').addEventListener('submit', function(e){
    e.preventDefault();
    const name = el('av-name').value || 'Protagonista';
    const gender = el('av-gender').value;
    const race = el('av-race').value;
    const role = el('av-role').value;
    const state = window.AGIL_PLAYER || {acquired:[],equipped:[]};
    state.profile = state.profile || {};
    state.profile.avatar = {name,gender,race,role,skin:0,hair:0};
    savePlayerInventory(state);
    window.AGIL_PLAYER = state;
    notify('Avatar guardado');
    renderSummary();
  });
  document.getElementById('btn-reset-avatar').addEventListener('click', ()=>{
    if(confirm('Resetear avatar?')){
      const p = window.AGIL_PLAYER || {acquired:[],equipped:[]};
      p.profile = p.profile || {};
      p.profile.avatar = {name:'Protagonista',gender:'male',race:'Humano',role:'Estratega'};
      savePlayerInventory(p);
      window.AGIL_PLAYER = p;
      renderAvatarForm();
      renderSummary();
    }
  });
}

function renderAvatarPreview(avatar){
  const out = '<svg width="80" height="80" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><circle cx="60" cy="40" r="22" fill="#ffd8b8"/><path d="M38 36 q22 -26 44 0 q-6 6 -22 6 q-16 0 -22 -6" fill="#2f2f2f"/></svg><div><strong>'+ (avatar.name||'Protagonista') +'</strong><div class="small">'+ (avatar.role||'') +' · '+ (avatar.race||'') +'</div></div>';
  el('avatar-edit-area').innerHTML = out;
  const previewPage = el('avatar-preview');
  if(previewPage) previewPage.innerHTML = out;
}
