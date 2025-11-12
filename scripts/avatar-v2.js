// avatar-v2.js
(function(){
  const races = ['Humano','Elfo','Enano','Androide','Espíritu','Demi-Humano'];
  const roles = ['Estratega','Visionario','Guardián','Emisario','Viajero','Forjador','Sabio','Corazón Ardiente'];
  document.addEventListener('DOMContentLoaded', ()=> {
    const state = loadState() || {};
    const av = (state.profile && state.profile.avatar) ? state.profile.avatar : { name:'Protagonista', race:'Humano', role:'Estratega', gender:'male', skin:0, hair:0, symbol:'✦' };
    const raceSel = document.getElementById('avatar-race');
    const roleSel = document.getElementById('avatar-role');
    const skinSel = document.getElementById('avatar-skin');
    const hairSel = document.getElementById('avatar-hair');
    races.forEach((r)=> raceSel.appendChild(Object.assign(document.createElement('option'),{value:r,textContent:r})));
    roles.forEach((r)=> roleSel.appendChild(Object.assign(document.createElement('option'),{value:r,textContent:r})));
    for(let i=0;i<5;i++){ skinSel.appendChild(Object.assign(document.createElement('option'),{value:i,textContent:'Tono '+(i+1)})); hairSel.appendChild(Object.assign(document.createElement('option'),{value:i,textContent:'Peinado '+(i+1)}));}
    document.getElementById('avatar-name').value = av.name || '';
    document.getElementById('avatar-gender').value = av.gender || 'male';
    document.getElementById('avatar-race').value = av.race || 'Humano';
    document.getElementById('avatar-role').value = av.role || 'Estratega';
    document.getElementById('avatar-skin').value = av.skin || 0;
    document.getElementById('avatar-hair').value = av.hair || 0;
    renderPreview(av);

    document.getElementById('avatar-form').addEventListener('submit', function(e){
      e.preventDefault();
      const name = document.getElementById('avatar-name').value.trim() || 'Protagonista';
      const gender = document.getElementById('avatar-gender').value;
      const race = document.getElementById('avatar-race').value;
      const role = document.getElementById('avatar-role').value;
      const skin = Number(document.getElementById('avatar-skin').value);
      const hair = Number(document.getElementById('avatar-hair').value);
      const state = loadState() || {};
      state.profile = state.profile || {};
      state.profile.avatar = { name, gender, race, role, skin, hair, symbol: '✦' };
      saveState(state);
      alert('Avatar guardado');
      location.href = 'index.html';
    });

    ['avatar-name','avatar-gender','avatar-race','avatar-role','avatar-skin','avatar-hair'].forEach(id=>{
      const el = document.getElementById(id);
      if(el) el.addEventListener('change', ()=> {
        const temp = {
          name: document.getElementById('avatar-name').value,
          gender: document.getElementById('avatar-gender').value,
          race: document.getElementById('avatar-race').value,
          role: document.getElementById('avatar-role').value,
          skin: Number(document.getElementById('avatar-skin').value),
          hair: Number(document.getElementById('avatar-hair').value),
          symbol: '✦'
        };
        renderPreview(temp);
      });
    });

    document.getElementById('avatar-reset').addEventListener('click', function(){ if(!confirm('Resetear avatar a valores por defecto?')) return; document.getElementById('avatar-form').reset(); renderPreview({name:'Protagonista',race:'Humano',role:'Estratega',skin:0,hair:0,symbol:'✦'}); });

    function renderPreview(profile){
      const container = document.getElementById('avatar-preview-region') || document.getElementById('avatar-preview');
      if(!container) return;
      container.innerHTML = avatarSVG(profile) + '<div class="name small" style="margin-top:8px"><strong>' + (profile.name || 'Protagonista') + '</strong><div class="small">' + (profile.role || '') + ' · ' + (profile.race || '') + '</div></div>';
    }

    function avatarSVG(profile){
      const skinPal = ['#f5d7c4','#ffd8b8','#f2e9d7','#e7f5ff','#fbe7ff'];
      const hairPal = ['#2f2f2f','#443a9e','#b3477a','#3a8f6b','#000000'];
      const skin = skinPal[(profile.skin||0) % skinPal.length];
      const hair = hairPal[(profile.hair||0) % hairPal.length];
      return '<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true"><rect x="6" y="6" width="108" height="108" rx="12" fill="rgba(255,255,255,0.01)"/><circle cx="60" cy="40" r="22" fill="'+skin+'"/><path d="M38 36 q22 -26 44 0 q-6 6 -22 6 q-16 0 -22 -6" fill="'+hair+'"/><text x="60" y="92" text-anchor="middle" font-size="14" fill="'+(profile.symbol||'#caa7ff')+'">'+(profile.symbol||'✦')+'</text></svg>';
    }
  });
})();
