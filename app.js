(() => {
 'use strict';
 const entries=window.NARROW_GATE_ARCHIVE || [];
 const byId=new Map(entries.map(e=>[e.id,e]));
 const categories=['All','Essays','Conversations','Commonplace','Places','Law & ideas','History'];
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ext=url=>/^https?:/.test(url)?' target="_blank" rel="noopener noreferrer"':'';
 const dateLabel=e=>e.note || (e.date?(e.date.length===4?e.date:new Intl.DateTimeFormat('en-US',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(e.date.length===7?e.date+'-01':e.date))):'Project archive');
 const img=e=>`<img src="${esc(e.image)}" alt="${esc(e.title)} — ${esc(e.imageCredit)}" loading="lazy">`;
 document.querySelectorAll('[data-entry-image]').forEach(el=>{const e=byId.get(el.dataset.entryImage);if(e)el.src=e.image;});
 document.querySelectorAll('[data-entry]').forEach(el=>{const e=byId.get(el.dataset.entry);if(e)el.href=e.url;});
 document.getElementById('vince-portrait').src=byId.get('yeoman-11').image;
 document.getElementById('commonplace-items').innerHTML=[['monument','Restoring a Monument'],['tyrants','History & Liberty'],['walking','The Walking City'],['rybczynski','Charleston Fancy']].map(([id,label])=>{const e=byId.get(id);return `<a href="${esc(e.url)}"${ext(e.url)}>${img(e)}<h3>${esc(label)}</h3></a>`}).join('');
 document.getElementById('conversation-items').innerHTML=['yeoman-27','zoning-podcast','strong-towns'].map(id=>{const e=byId.get(id);return `<a class="media-card" href="${esc(e.url)}"${ext(e.url)}>${img(e)}<span class="eyebrow">${esc(e.kind)} · ${esc(e.source)}</span><h3>${esc(e.title)}</h3><p>${esc(e.description)}</p><span class="meta">${esc(dateLabel(e))} · Listen at the source <img src="assets/arrow-up-right.svg" alt="" style="width:13px;height:13px;display:inline;vertical-align:middle"></span></a>`}).join('');
 document.getElementById('place-items').innerHTML=['ion','newpoint','catfiddle','st-james','fort-sullivan','beulah'].map(id=>{const e=byId.get(id);return `<a class="place-card" href="${esc(e.url)}"${ext(e.url)}>${img(e)}<h3>${esc(e.title)}</h3><p>${esc(e.description)}</p></a>`}).join('');
 let active='All',limit=12;
 const search=document.getElementById('archive-search'),grid=document.getElementById('archive-items'),sort=document.getElementById('sort-order'),more=document.getElementById('load-more');
 const filters=document.getElementById('filters');
 filters.innerHTML=categories.map(c=>`<button class="filter-button" aria-pressed="${c==='All'}" data-filter="${esc(c)}">${esc(c)}</button>`).join('');
 document.getElementById('total-count').textContent=`${entries.length} collected entries`;
 function render(){
  const q=search.value.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  let found=entries.filter(e=>(active==='All'||e.category===active)&&[e.title,e.description,e.author,e.source,e.kind,...e.topics].join(' ').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));
  if(sort.value==='title')found.sort((a,b)=>a.title.localeCompare(b.title));
  else if(sort.value!=='curated')found.sort((a,b)=>{if(!a.date)return 1;if(!b.date)return -1;return sort.value==='newest'?b.date.localeCompare(a.date):a.date.localeCompare(b.date)});
  grid.innerHTML=found.length?found.slice(0,limit).map(e=>`<article class="archive-card"><a href="${esc(e.url)}"${ext(e.url)}>${img(e)}<span class="eyebrow">${esc(e.kind)}</span><h3>${esc(e.title)}</h3></a><p>${esc(e.description)}</p><div class="meta">${esc(e.author)}<br>${esc(dateLabel(e))}<a class="source" href="${esc(e.url)}"${ext(e.url)}>View ${esc(e.source)} <img src="assets/arrow-up-right.svg" alt="" style="width:11px;height:11px;display:inline"></a></div></article>`).join(''):`<div class="empty-state"><h3>No matching entries.</h3><p>Try a place, a subject, or an author.</p><button id="clear-search">Clear the search and show all</button></div>`;
  document.getElementById('result-count').textContent=`${found.length} ${found.length===1?'entry':'entries'}${active==='All'?'':' in '+active}${search.value.trim()?' matching “'+search.value.trim()+'”':''}${found.length>limit?' · showing '+limit:''}`;
  more.hidden=found.length<=limit;
  if(!more.hidden)more.firstChild.textContent=`Show ${Math.min(12,found.length-limit)} more entries `;
  document.getElementById('clear-search')?.addEventListener('click',()=>selectCategory('All'));
 }
 function selectCategory(c){active=categories.includes(c)?c:'All';limit=12;search.value='';filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===active)));render()}
 filters.addEventListener('click',ev=>{const b=ev.target.closest('button[data-filter]');if(b)selectCategory(b.dataset.filter)});
 document.querySelectorAll('[data-filter-link]').forEach(a=>a.addEventListener('click',()=>selectCategory(a.dataset.filterLink)));
 document.querySelectorAll('[data-topic]').forEach(a=>a.addEventListener('click',()=>{selectCategory('All');search.value=a.dataset.topic;render()}));
 search.addEventListener('input',()=>{limit=12;render()});sort.addEventListener('change',()=>{limit=12;render()});
 more.addEventListener('click',()=>{const previous=grid.children.length;limit+=12;render();grid.children[previous]?.querySelector('a')?.focus({preventScroll:true})});
 document.querySelector('.search-toggle').addEventListener('click',()=>{selectCategory('All');document.getElementById('archive').scrollIntoView();search.focus({preventScroll:true})});
 const menu=document.querySelector('.menu-toggle'),nav=document.getElementById('main-nav');
 function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation')}
 menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation')});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
 const dialog=document.getElementById('credits-dialog');document.getElementById('open-credits').addEventListener('click',()=>dialog.showModal());dialog.querySelector('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 render();
})();
