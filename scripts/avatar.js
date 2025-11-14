// avatar.js - manage avatar form in persona page
document.addEventListener('DOMContentLoaded', ()=>{
  const races = ['Humano','Elfo','Enano','Androide','Espíritu'];
  const raceSel = document.getElementById('av-race');
  if(raceSel) races.forEach(r=> raceSel.appendChild(new Option(r,r)));
  loadPlayer().then(p=>{
    window.AGIL_PLAYER = p;
    const av = p.profile?.avatar || {name:'Protagonista',gender:'male',race:'Humano',role:'Estratega'};
    el('av-name') && (el('av-name').value = av.name);
    el('av-gender') && (el('av-gender').value = av.gender || 'male');
    el('av-role') && (el('av-role').value = av.role || '');
    el('av-race') && (el('av-race').value = av.race || 'Humano');
  });

  document.getElementById('save-avatar')?.addEventListener('click', ()=>{
    loadPlayer().then(p=>{
      p.profile = p.profile || {};
      p.profile.avatar = { name: el('av-name').value || 'Protagonista', gender: el('av-gender').value, role: el('av-role').value, race: el('av-race').value };
      savePlayer(p); window.AGIL_PLAYER = p; notify('Avatar guardado');
    });
  });

  document.getElementById('reset-avatar')?.addEventListener('click', ()=>{
    if(!confirm('Resetear avatar?')) return;
    loadPlayer().then(p=>{
      p.profile = { avatar: { name:'Protagonista', gender:'male', role:'Estratega', race:'Humano' } };
      savePlayer(p); window.AGIL_PLAYER = p; location.reload();
    });
  });
});
