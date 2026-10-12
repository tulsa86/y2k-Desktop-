/* Fullscreen, original canvas screensavers. No dependencies. */
(()=>{
const choices={none:'(None)',pipes:'3D Pipes',stars:'Starfield',windows:'Flying Windows',text:'3D Text'};
Y2K.screensaverChoices=choices;
let overlay=null,raf=0,timer=0,lastActivity=Date.now(),lastMove=0;
const random=(a,b)=>a+Math.random()*(b-a);
function show(mode,preview=false){
 if(overlay||!choices[mode]||mode==='none')return;
 const layer=document.createElement('div');layer.className='y2k-saver';layer.setAttribute('role','dialog');layer.setAttribute('aria-label',choices[mode]+' screensaver');layer.tabIndex=-1;
 const canvas=document.createElement('canvas');layer.append(canvas);document.body.append(layer);overlay=layer;
 const ctx=canvas.getContext('2d'),stars=[],pipes=[],windows=[];let frame=0,w=0,h=0,last=0;
 function resize(){const dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);}
 resize();
 for(let i=0;i<160;i++)stars.push({x:random(-w,w),y:random(-h,h),z:random(20,1000)});
 for(let i=0;i<7;i++)pipes.push({x:random(0,w),y:random(0,h),dx:Math.random()<.5?-1:1,dy:Math.random()<.5?-1:1,hue:random(0,360),trail:[]});
 for(let i=0;i<15;i++)windows.push({x:random(0,w),y:random(0,h),z:random(.2,1.5),vx:random(-1.5,1.5),vy:random(-1.5,1.5),angle:random(-.6,.6)});
 const text='Y2K 1999';let tx=w/2,ty=h/2,vx=2.5,vy=1.7;
 function render(t){if(!overlay||overlay!==layer)return;raf=requestAnimationFrame(render);if(t-last<28)return;last=t;frame++;ctx.fillStyle='#000';ctx.fillRect(0,0,w,h);
 if(mode==='stars'){
 ctx.fillStyle='#fff';for(const s of stars){s.z-=8;if(s.z<10){s.x=random(-w,w);s.y=random(-h,h);s.z=1000;}const x=w/2+s.x*280/s.z,y=h/2+s.y*280/s.z,r=Math.max(.5,4*(1-s.z/1000));ctx.globalAlpha=Math.max(.2,1-s.z/1200);ctx.fillRect(x,y,r,r);}ctx.globalAlpha=1;
 }else if(mode==='pipes'){
 ctx.lineCap='round';for(const p of pipes){if(frame%8===0){const old={x:p.x,y:p.y};if(Math.random()<.35){const dx=p.dx;p.dx=p.dy;p.dy=-dx;}p.x+=p.dx*26;p.y+=p.dy*26;if(p.x<0||p.x>w||p.y<0||p.y>h){p.x=random(0,w);p.y=random(0,h);p.trail=[];p.hue=random(0,360);}else{p.trail.push([old.x,old.y,p.x,p.y]);if(p.trail.length>35)p.trail.shift();}}p.trail.forEach((seg,i)=>{ctx.strokeStyle='hsl('+p.hue+',85%,'+(25+i/p.trail.length*45)+'%)';ctx.lineWidth=13;ctx.beginPath();ctx.moveTo(seg[0],seg[1]);ctx.lineTo(seg[2],seg[3]);ctx.stroke();ctx.strokeStyle='hsla('+p.hue+',100%,95%,.65)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(seg[0]-3,seg[1]-3);ctx.lineTo(seg[2]-3,seg[3]-3);ctx.stroke();});}
 }else if(mode==='windows'){
 for(const a of windows){a.x+=a.vx*2;a.y+=a.vy*2;a.angle+=.003;if(a.x<-150)a.x=w+100;if(a.x>w+150)a.x=-100;if(a.y<-120)a.y=h+100;if(a.y>h+120)a.y=-100;ctx.save();ctx.translate(a.x,a.y);ctx.rotate(a.angle);ctx.scale(a.z,a.z);ctx.fillStyle='#c0c0c0';ctx.fillRect(-35,-28,70,56);ctx.fillStyle='#000080';ctx.fillRect(-31,-24,62,12);ctx.fillStyle='#fff';ctx.fillRect(-28,-8,55,28);ctx.fillStyle='#008080';ctx.fillRect(-24,-4,47,20);ctx.strokeStyle='#fff';ctx.lineWidth=3;ctx.strokeRect(-35,-28,70,56);ctx.restore();}
 }else if(mode==='text'){
 ctx.font='bold '+Math.max(32,Math.min(76,w/8))+'px Arial';const width=ctx.measureText(text).width;tx+=vx;ty+=vy;if(tx<width/2||tx>w-width/2)vx=-vx;if(ty<85||ty>h-25)vy=-vy;const hue=(frame*2)%360;ctx.textAlign='center';for(let i=9;i>0;i--){ctx.fillStyle='hsl('+hue+',75%,'+(12+i*2)+'%)';ctx.fillText(text,tx+i,ty+i);}ctx.fillStyle='hsl('+hue+',90%,70%)';ctx.fillText(text,tx,ty);
 }
 }
 function close(){if(overlay!==layer)return;cancelAnimationFrame(raf);controller.abort();overlay=null;layer.remove();lastActivity=Date.now();schedule();}
 function wake(e){if(e.type==='mousemove'&&Date.now()-lastMove<200)return;lastMove=Date.now();e.preventDefault();e.stopPropagation();close();}
 const events=['pointerdown','touchstart','keydown','wheel','mousemove'];events.forEach(event=>layer.addEventListener(event,wake,{passive:false}));const controller=new AbortController();window.addEventListener('resize',resize,{signal:controller.signal});
 // Closing must also detach the resize listener.
 const oldClose=close;
 layer.addEventListener('click',oldClose);
 layer.focus({preventScroll:true});raf=requestAnimationFrame(render);
 }
 function schedule(){clearTimeout(timer);const s=Y2K.settings;if(!s||s.saver==='none'||!s.saverMinutes)return;const delay=s.saverMinutes*60000-(Date.now()-lastActivity);timer=setTimeout(()=>{if(document.visibilityState==='visible')show(s.saver);},Math.max(1000,delay));}
 function activity(){lastActivity=Date.now();schedule();}
 ['pointerdown','keydown','wheel','touchstart'].forEach(type=>document.addEventListener(type,activity,{passive:true}));
 document.addEventListener('mousemove',()=>{if(Date.now()-lastMove>1000){lastMove=Date.now();activity();}},{passive:true});
 document.addEventListener('visibilitychange',()=>{lastActivity=Date.now();schedule();});
 Y2K.screensaver={show,schedule};
 schedule();
})();