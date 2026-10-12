/* Y2K Paint: original, offline, touch-friendly bitmap editor. */
(()=>{
let active=null;
const palette=['#000000','#808080','#800000','#808000','#008000','#008080','#000080','#800080','#808080','#c0c0c0','#ff0000','#ffff00','#00ff00','#00ffff','#0000ff','#ff00ff','#ffffff','#f7c79e','#ff8000','#a0522d','#333333','#80bfff','#ffb6c1','#663399'];
const tools=[['pencil','✎','Pencil'],['brush','🖌','Brush'],['spray','▦','Airbrush'],['eraser','▧','Eraser'],['fill','▰','Fill'],['line','╱','Line'],['rect','□','Rectangle'],['ellipse','◯','Ellipse'],['text','A','Text']];
function open(){
 if(active&&document.contains(active.el)){Y2K.wm.restore(active);return active;}
 let tool='pencil',fg='#000000',bg='#ffffff',size=3,pressed=false,start=null,prior=null,dirty=false,history=[],redo=[],objectUrl=null;
 const win=Y2K.wm.create({title:'Untitled - Y2K Paint',icon:'paint',width:700,height:530,onClose(){if(objectUrl)URL.revokeObjectURL(objectUrl);active=null;},render(w){
 w.content.innerHTML='<div class="paint-app"><div class="paint-menubar"><button data-new>New</button><button data-open>Open Image</button><button data-save>Save PNG</button><button data-undo>Undo</button><button data-redo>Redo</button><button data-clear>Clear</button></div><div class="paint-workspace"><aside class="paint-tools" aria-label="Drawing tools"></aside><div class="paint-canvas-scroll"><canvas width="640" height="420" aria-label="Paint drawing surface"></canvas></div></div><div class="paint-bottom"><div class="paint-swatches"><div class="paint-active"><span data-fg></span><span data-bg></span></div><div class="paint-palette" data-palette></div></div><div class="paint-options"><label>Size <input data-size type="range" min="1" max="24" value="3"></label><span data-size-label>3px</span></div></div><div class="paint-status" data-status>Ready. Choose a tool and draw. Right-click a color for background.</div><input type="file" accept="image/*" data-file hidden></div>';
 }});
 active=win;
 const root=win.content,$=s=>root.querySelector(s),canvas=$('canvas'),ctx=canvas.getContext('2d',{willReadFrequently:true}),status=$('[data-status]'),file=$('[data-file]');
 ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
 const say=t=>{status.textContent=t;};
 const snapshot=()=>ctx.getImageData(0,0,canvas.width,canvas.height);
 const restore=data=>ctx.putImageData(data,0,0);
 function checkpoint(){history.push(snapshot());if(history.length>18)history.shift();redo=[];}
 function updateColors(){$('[data-fg]').style.background=fg;$('[data-bg]').style.background=bg;}
 for(const [id,symbol,name] of tools){const btn=document.createElement('button');btn.textContent=symbol;btn.title=name;btn.setAttribute('aria-label',name);btn.dataset.tool=id;btn.onclick=()=>{tool=id;root.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('paint-chosen',b===btn));say(name+' selected');};if(id==='pencil')btn.classList.add('paint-chosen');$('.paint-tools').append(btn);}
 for(const color of palette){const btn=document.createElement('button');btn.className='paint-color';btn.style.background=color;btn.title='Color '+color;btn.setAttribute('aria-label','Choose '+color);btn.onclick=()=>{fg=color;updateColors();};btn.oncontextmenu=e=>{e.preventDefault();bg=color;updateColors();};btn.addEventListener('pointerdown',e=>{if(e.button===2){bg=color;updateColors();}});$('[data-palette]').append(btn);}
 updateColors();
 $('[data-size]').oninput=e=>{size=+e.target.value;$('[data-size-label]').textContent=size+'px';};
 function point(e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(canvas.width-1,(e.clientX-r.left)*canvas.width/r.width)),y:Math.max(0,Math.min(canvas.height-1,(e.clientY-r.top)*canvas.height/r.height))};}
 function stroke(a,b,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
 function spray(p){ctx.fillStyle=fg;for(let i=0;i<size*3;i++){const angle=Math.random()*Math.PI*2,dist=Math.sqrt(Math.random())*size*3;ctx.fillRect(p.x+Math.cos(angle)*dist,p.y+Math.sin(angle)*dist,1.3,1.3);}}
 function shape(p){ctx.strokeStyle=fg;ctx.lineWidth=size;ctx.beginPath();if(tool==='line'){ctx.moveTo(start.x,start.y);ctx.lineTo(p.x,p.y);}else if(tool==='rect'){ctx.rect(start.x,start.y,p.x-start.x,p.y-start.y);}else if(tool==='ellipse'){ctx.ellipse((start.x+p.x)/2,(start.y+p.y)/2,Math.max(.5,Math.abs(p.x-start.x)/2),Math.max(.5,Math.abs(p.y-start.y)/2),0,0,Math.PI*2);}ctx.stroke();}
 function fill(p){const img=ctx.getImageData(0,0,canvas.width,canvas.height),d=img.data,w=canvas.width,h=canvas.height,x=Math.floor(p.x),y=Math.floor(p.y),idx=(y*w+x)*4,target=[d[idx],d[idx+1],d[idx+2],d[idx+3]],rgb=fg.match(/[0-9a-f]{2}/gi).map(x=>parseInt(x,16));if(target[0]===rgb[0]&&target[1]===rgb[1]&&target[2]===rgb[2]&&target[3]===255)return;const stack=[y*w+x],seen=new Uint8Array(w*h);while(stack.length){const pos=stack.pop();if(seen[pos])continue;seen[pos]=1;const i=pos*4;if(d[i]!==target[0]||d[i+1]!==target[1]||d[i+2]!==target[2]||d[i+3]!==target[3])continue;d[i]=rgb[0];d[i+1]=rgb[1];d[i+2]=rgb[2];d[i+3]=255;const px=pos%w,py=Math.floor(pos/w);if(px>0)stack.push(pos-1);if(px<w-1)stack.push(pos+1);if(py>0)stack.push(pos-w);if(py<h-1)stack.push(pos+w);}ctx.putImageData(img,0,0);}
 function drawStart(e){if(e.button!==0&&e.pointerType==='mouse')return;e.preventDefault();const p=point(e);if(tool==='text'){const value=prompt('Enter text to place on the picture:');if(!value)return;checkpoint();ctx.fillStyle=fg;ctx.font=Math.max(12,size*5)+'px Arial';ctx.fillText(value.slice(0,120),p.x,p.y);dirty=true;return;}checkpoint();dirty=true;if(tool==='fill'){fill(p);return;}pressed=true;start=p;prior=snapshot();canvas.setPointerCapture(e.pointerId);if(tool==='pencil'||tool==='brush'||tool==='eraser'){stroke(p,{x:p.x+.01,y:p.y+.01},tool==='eraser'?bg:fg,tool==='brush'?size*3:tool==='eraser'?size*5:size);}else if(tool==='spray')spray(p);}
 function drawMove(e){if(!pressed)return;e.preventDefault();const p=point(e);if(['line','rect','ellipse'].includes(tool)){restore(prior);shape(p);}else if(tool==='spray')spray(p);else stroke(start,p,tool==='eraser'?bg:fg,tool==='brush'?size*3:tool==='eraser'?size*5:size);start=['line','rect','ellipse'].includes(tool)?start:p;}
 function drawEnd(e){if(!pressed)return;drawMove(e);pressed=false;prior=null;try{canvas.releasePointerCapture(e.pointerId);}catch{}}
 canvas.addEventListener('pointerdown',drawStart);canvas.addEventListener('pointermove',drawMove);canvas.addEventListener('pointerup',drawEnd);canvas.addEventListener('pointercancel',()=>{pressed=false;prior=null;});
 $('[data-undo]').onclick=()=>{if(!history.length)return;redo.push(snapshot());restore(history.pop());say('Undo');};
 $('[data-redo]').onclick=()=>{if(!redo.length)return;history.push(snapshot());restore(redo.pop());say('Redo');};
 function blank(){checkpoint();ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);dirty=false;}
 $('[data-new]').onclick=()=>{if(dirty&&!confirm('Start a new picture? Unsaved drawing will be cleared.'))return;blank();win.setTitle('Untitled - Y2K Paint');say('New picture');};
 $('[data-clear]').onclick=()=>{if(!confirm('Clear the drawing?'))return;blank();say('Canvas cleared');};
 $('[data-save]').onclick=()=>{canvas.toBlob(blob=>{if(!blob){say('Could not create PNG');return;}if(objectUrl)URL.revokeObjectURL(objectUrl);objectUrl=URL.createObjectURL(blob);const a=document.createElement('a');a.href=objectUrl;a.download='Y2K-Paint-'+new Date().toISOString().slice(0,10)+'.png';document.body.append(a);a.click();a.remove();dirty=false;say('PNG prepared. On iPhone, use the download/share option to save it.');},'image/png');};
 $('[data-open]').onclick=()=>file.click();
 file.onchange=()=>{const selected=file.files&&file.files[0];if(!selected)return;if(!selected.type.startsWith('image/')){say('Please choose an image file');return;}const url=URL.createObjectURL(selected),img=new Image();img.onload=()=>{checkpoint();ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/img.width,canvas.height/img.height,1);ctx.drawImage(img,0,0,img.width*scale,img.height*scale);dirty=true;win.setTitle(selected.name+' - Y2K Paint');say('Opened '+selected.name);URL.revokeObjectURL(url);file.value='';};img.onerror=()=>{say('Could not open that image');URL.revokeObjectURL(url);};img.src=url;};
 return win;
}
Y2K.apps.push({id:'paint',title:'Paint',icon:'paint',open});
})();
