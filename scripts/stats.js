// stats.js - render stats panel and allow using available points
document.addEventListener('DOMContentLoaded', ()=>{
  const attrGrid = document.querySelector('.attr-grid');
  if(!attrGrid) return;
  loadPlayer().then(p=>{
    const stats = p.stats || {str:5,agi:5,int:5,vit:5,per:5};
    const bonus = p.bonus || {str:0,agi:0,int:0,vit:0,per:0};
    const available = p.available_points || 0;
    el('stat-level').textContent = p.level || 1;
    el('stat-job').textContent = p.profile?.job || (p.profile?.avatar?.role || 'Aventurero');
    el('stat-title').textContent = p.title || '';
    el('available-points').textContent = available;
    // resources
    const hp = (p.hp?.current !== undefined) ? p.hp : {current:50,max:50};
    el('hp-text').textContent = (hp.current||0) + ' / ' + (hp.max||0);
    el('hp-fill').style.width = Math.round(((hp.current||0)/(hp.max||1))*100) + '%';
    const mp = p.mp || {current:30,max:30};
    el('mp-text').textContent = (mp.current||0) + ' / ' + (mp.max||0);
    el('mp-fill').style.width = Math.round(((mp.current||0)/(mp.max||1))*100) + '%';
    const fat = p.fatigue || 0;
    el('fatigue-text').textContent = fat + '%';
    el('fatigue-fill').style.width = (fat>100?100:fat) + '%';

    // render attributes
    attrGrid.innerHTML = '';
    Object.keys(stats).forEach(k=>{
      const box = create('div','attr-box');
      box.setAttribute('role','listitem');
      box.innerHTML = '<div><div class="attr-name">'+k.toUpperCase()+'</div><div class="small muted">Base: '+stats[k]+'</div></div><div><div class="attr-bonus">+'+(bonus[k]||0)+'</div></div>';
      attrGrid.appendChild(box);
    });
    // add simple allocation buttons when points available
    if(available>0){
      Object.keys(stats).forEach(k=>{
        const btn = create('button','btn'); btn.textContent = '+'; btn.style.marginLeft='8px';
        btn.addEventListener('click', ()=>{
          loadPlayer().then(p2=>{
            p2.stats = p2.stats || stats;
            p2.available_points = (p2.available_points||0)-1;
            p2.stats[k] = (p2.stats[k]||0) + 1;
            savePlayer(p2); window.location.reload();
          });
        });
        attrGrid.querySelectorAll('.attr-box')[0] && attrGrid.querySelectorAll('.attr-box')[0]; // no-op to avoid silent errors
      });
    }
  });
});
