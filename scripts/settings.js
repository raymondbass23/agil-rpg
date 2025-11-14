// settings.js - system settings handlers
document.addEventListener('DOMContentLoaded', ()=>{
  const toggle = document.getElementById('toggle-theme');
  const reset = document.getElementById('reset-all');
  const exp = document.getElementById('export-json');
  const imp = document.getElementById('import-file');

  // theme toggle
  const current = localStorage.getItem('agil_theme') || 'dark';
  document.body.dataset.theme = current;
  if(toggle) toggle.checked = current==='light';
  toggle?.addEventListener('change', ()=>{
    const mode = toggle.checked ? 'light' : 'dark';
    document.body.dataset.theme = mode; localStorage.setItem('agil_theme', mode);
  });

  reset?.addEventListener('click', ()=>{
    if(!confirm('Resetear todo el progreso?')) return;
    localStorage.removeItem('agilrpg_player_state_v1'); localStorage.removeItem('agilrpg_missions_v1'); notify('Progreso reiniciado');
  });

  exp?.addEventListener('click', ()=>{
    loadPlayer().then(p=>{
      const blob = new Blob([JSON.stringify(p, null, 2)], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'agilrpg_player.json'; a.click(); URL.revokeObjectURL(url);
    });
  });

  imp?.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if(!f) return;
    const reader = new FileReader(); reader.onload = ()=>{ try{ const data = JSON.parse(reader.result); savePlayer(data); notify('Progreso importado'); }catch(err){ alert('Archivo inválido'); } }; reader.readAsText(f);
  });
});