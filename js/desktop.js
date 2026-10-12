/* Desktop input and menus are independent of individual applications. */
(() => {
 const desktop=document.getElementById('desktop'),icons=document.getElementById('icons'),menu=document.getElementById('programs-menu'),context=document.getElementById('context-menu'),programs=document.getElementById('programs-button');
 let transient=null;
 const gameIds=new Set(['minesweeper','solitaire','freecell','hearts']);
 const programItems=document.getElementById('program-items');
 const gamesEntry=document.createElement('div');gamesEntry.className='games-entry';
 const gamesToggle=document.createElement('button');gamesToggle.type='button';gamesToggle.className='games-toggle';gamesToggle.setAttribute('aria-expanded','false');gamesToggle.innerHTML=Y2K.icon('folder')+'<span>Games</span><span class="games-arrow">▸</span>';
 const gamesSubmenu=document.createElement('div');gamesSubmenu.className='games-submenu';gamesSubmenu.hidden=true;gamesSubmenu.setAttribute('aria-label','Games');
 gamesEntry.append(gamesToggle,gamesSubmenu);
 function closeGames(){gamesSubmenu.hidden=true;gamesToggle.setAttribute('aria-expanded','false');}
 gamesToggle.onclick=e=>{e.stopPropagation();const open=gamesSubmenu.hidden;gamesSubmenu.hidden=!open;gamesToggle.setAttribute('aria-expanded',String(open));if(open)gamesSubmenu.querySelector('button')?.focus();};
 gamesToggle.onkeydown=e=>{if(e.key==='ArrowRight'){e.preventDefault();gamesSubmenu.hidden=false;gamesToggle.setAttribute('aria-expanded','true');gamesSubmenu.querySelector('button')?.focus();}};
 gamesSubmenu.onkeydown=e=>{if(e.key==='ArrowLeft'){e.preventDefault();closeGames();gamesToggle.focus();}};
 Y2K.hideMenus=()=>{menu.hidden=true;context.hidden=true;closeGames();programs.classList.remove('pressed');programs.setAttribute('aria-expanded','false');if(transient){transient.remove();transient=null;}};
 Y2K.showPopup=(popup,anchor)=>{Y2K.hideMenus();transient=popup;document.body.append(popup);const r=anchor.getBoundingClientRect();popup.style.left=Math.max(0,Math.min(r.left,innerWidth-popup.offsetWidth))+'px';popup.style.top=Math.max(0,Math.min(r.bottom,desktop.clientHeight-popup.offsetHeight))+'px';popup.querySelector('button')?.focus();};
 function launchSafely(app){try{Y2K.launch(app.id);}catch(err){console.error('App launch failed:',app.id,err);Y2K.message('Could not open '+app.title,'Launch error: '+(err&&err.message?err.message:String(err)));}}
 function select(b){icons.querySelectorAll('button').forEach(x=>x.classList.toggle('selected',x===b));}
 Y2K.apps.forEach(app=>{
 const isGame=gameIds.has(app.id);
 const b=document.createElement('button');b.className='desktop-icon';b.innerHTML=Y2K.icon(app.icon)+'<span></span>';b.querySelector('span').textContent=app.title;b.setAttribute('aria-label','Open '+app.title);b.onclick=()=>{select(b);if(app.id==='aim'&&window.matchMedia('(pointer: coarse)').matches)launchSafely(app);};b.ondblclick=()=>{if(app.id==='aim'&&window.matchMedia('(pointer: coarse)').matches)return;launchSafely(app);};b.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();Y2K.launch(app.id);}if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();const items=[...icons.children];const i=items.indexOf(b);const next=items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length];select(next);next.focus();}};if(!isGame)icons.append(b);
 const shortcut=document.createElement('button');shortcut.innerHTML=Y2K.icon(app.icon)+'<span></span>';shortcut.querySelector('span').textContent=app.title;shortcut.onclick=()=>{Y2K.hideMenus();launchSafely(app);};(isGame?gamesSubmenu:programItems).append(shortcut);
 });
 if(gamesSubmenu.children.length)programItems.append(gamesEntry);
 programs.onclick=()=>{const open=menu.hidden;Y2K.hideMenus();menu.hidden=!open;programs.classList.toggle('pressed',open);programs.setAttribute('aria-expanded',String(open));if(open)menu.querySelector('button').focus();};
 document.addEventListener('pointerdown',e=>{if(!e.target.closest('.popup')&&!e.target.closest('#programs-button')&&!e.target.closest('.menubar'))Y2K.hideMenus();if(e.target===desktop||e.target.id==='windows'){select(null);}});
 desktop.addEventListener('contextmenu',e=>{if(e.target.closest('.window'))return;e.preventDefault();Y2K.hideMenus();context.hidden=false;context.style.left=Math.max(0,Math.min(e.clientX,innerWidth-context.offsetWidth))+'px';context.style.top=Math.max(0,Math.min(e.clientY,desktop.clientHeight-context.offsetHeight))+'px';context.querySelector('button').focus();});
 context.querySelector('[data-context=refresh]').onclick=()=>{select(null);Y2K.applySettings();Y2K.hideMenus();};context.querySelector('[data-context=properties]').onclick=()=>{Y2K.hideMenus();Y2K.launch('control');};
 document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){const hadMenu=!menu.hidden||!context.hidden||!!transient;Y2K.hideMenus();if(!hadMenu&&Y2K.wm.active?.owner)Y2K.wm.close(Y2K.wm.active);select(null);}
 if(e.altKey&&e.key==='F4'){e.preventDefault();if(Y2K.wm.active)Y2K.wm.close(Y2K.wm.active);}
 if(e.altKey&&e.key==='F9'){e.preventDefault();if(Y2K.wm.active)Y2K.wm.minimize(Y2K.wm.active);}
 if(e.altKey&&e.key==='F10'){e.preventDefault();if(Y2K.wm.active)Y2K.wm.maximize(Y2K.wm.active);}
 const popup=e.target.closest('.popup');if(popup&&['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const buttons=[...popup.querySelectorAll('button')];let index=buttons.indexOf(document.activeElement);index=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;buttons[index].focus();}
 });
 function clock(){const now=new Date();document.getElementById('clock').textContent=now.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});document.getElementById('clock').title=now.toLocaleDateString([],{weekday:'long',year:'numeric',month:'long',day:'numeric'});}
 clock();setInterval(clock,1000);Y2K.applySettings();
 // A first-run welcome document makes the desktop immediately explorable.
 if(!Y2K.storage.read('visited',false)){Y2K.openNotepad('WELCOME.TXT',Y2K.files.children[0].children[0].children[0].text);Y2K.storage.write('visited',true);}
})();
