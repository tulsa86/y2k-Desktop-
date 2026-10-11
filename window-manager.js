/* Shared window lifecycle, taskbar, focus, sizing and pointer dragging. Apps own only their content. */
Y2K.wm={windows:[],active:null,z:10,
 create({title,icon='file',width=540,height=370,render,onClose,owner=null}){
  const el=document.createElement('section');el.className='window';el.setAttribute('role','dialog');el.setAttribute('aria-label',title);
  const offset=this.windows.length%6*24;
  el.style.cssText=`width:${width}px;height:${height}px;left:${Math.min(150+offset,Math.max(0,innerWidth-width))}px;top:${40+offset}px`;
  el.innerHTML=`<header class="titlebar">${Y2K.icon(icon,true)}<span class="window-title"></span><div class="window-controls"><button aria-label="Minimize">_</button><button aria-label="Maximize">□</button><button aria-label="Close">×</button></div></header><div class="window-content"></div>`;
  const task=document.createElement('button');task.className='task';task.innerHTML=Y2K.icon(icon,true)+'<span></span>';document.getElementById('tasks').append(task);
  const win={el,task,title,icon,owner,minimized:false,maximized:false,onClose,content:el.querySelector('.window-content')};
  win.setTitle=(text)=>{win.title=text;el.querySelector('.window-title').textContent=text;task.querySelector('span').textContent=text;task.title=text;el.setAttribute('aria-label',text);};win.setTitle(title);
  this.windows.push(win);document.getElementById('windows').append(el);
  el.addEventListener('pointerdown',()=>this.focus(win));
  task.onclick=()=>{if(this.active===win&&!win.minimized)this.minimize(win);else this.restore(win);};
  const controls=el.querySelectorAll('.window-controls button');controls[0].onclick=()=>this.minimize(win);controls[1].onclick=()=>this.maximize(win);controls[2].onclick=()=>this.close(win);
  const bar=el.querySelector('.titlebar');bar.ondblclick=e=>{if(!e.target.closest('button'))this.maximize(win);};
  bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||win.maximized||e.button!==0)return;
   const rect=el.getBoundingClientRect(),dx=e.clientX-rect.left,dy=e.clientY-rect.top;bar.setPointerCapture(e.pointerId);
   const move=ev=>{el.style.left=Math.max(0,Math.min(ev.clientX-dx,innerWidth-el.offsetWidth))+'px';el.style.top=Math.max(0,Math.min(ev.clientY-dy,document.getElementById('desktop').clientHeight-el.offsetHeight))+'px';};
   const stop=()=>{bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',stop);bar.removeEventListener('pointercancel',stop);};bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',stop);bar.addEventListener('pointercancel',stop);
  });
  this.clamp(win);render?.(win);this.focus(win);return win;
 },
 focus(win){if(win.minimized)return;this.active=win;win.el.style.zIndex=++this.z;this.windows.forEach(w=>{w.el.classList.toggle('active',w===win);w.task.classList.toggle('active',w===win);w.task.setAttribute('aria-pressed',String(w===win));});},
 next(){const visible=this.windows.filter(w=>!w.minimized).sort((a,b)=>Number(b.el.style.zIndex)-Number(a.el.style.zIndex));this.active=null;if(visible[0])this.focus(visible[0]);},
 minimize(win){win.minimized=true;win.el.hidden=true;win.el.classList.remove('active');win.task.classList.remove('active');win.task.setAttribute('aria-pressed','false');if(this.active===win)this.next();},
 restore(win){win.minimized=false;win.el.hidden=false;this.clamp(win);this.focus(win);},
 maximize(win){if(!win.maximized){win.previous={left:win.el.style.left,top:win.el.style.top,width:win.el.style.width,height:win.el.style.height};win.maximized=true;}else{win.maximized=false;Object.assign(win.el.style,win.previous);}win.el.classList.toggle('maximized',win.maximized);const b=win.el.querySelectorAll('.window-controls button')[1];b.textContent=win.maximized?'▣':'□';b.setAttribute('aria-label',win.maximized?'Restore':'Maximize');this.clamp(win);this.focus(win);},
 close(win,force=false){if(!force&&win.onClose&&win.onClose()===false)return;this.windows.filter(w=>w.owner===win).forEach(w=>this.close(w,true));win.el.remove();win.task.remove();this.windows=this.windows.filter(w=>w!==win);if(this.active===win)this.next();},
 clamp(win){const h=document.getElementById('desktop').clientHeight,w=innerWidth;const el=win.el;if(win.maximized){Object.assign(el.style,{left:'0px',top:'0px',width:w+'px',height:h+'px'});return;}el.style.width=Math.min(parseFloat(el.style.width)||540,w)+'px';el.style.height=Math.min(parseFloat(el.style.height)||370,h)+'px';el.style.left=Math.max(0,Math.min(parseFloat(el.style.left)||0,w-parseFloat(el.style.width)))+'px';el.style.top=Math.max(0,Math.min(parseFloat(el.style.top)||0,h-parseFloat(el.style.height)))+'px';}
};
window.addEventListener('resize',()=>Y2K.wm.windows.forEach(w=>Y2K.wm.clamp(w)));
