/* Elf Bowl '99. Original artwork, original foul-mouthed elves. */
(()=>{
const heckles=[
"Nice throw, fatass! You bowl like you drive that sleigh!",
"Santa, you couldn't hit a fucking barn!",
"Your sleigh's got better aim than your drunk ass!",
"Hey Santa! Your wife's been checking MY stocking!",
"You're the reason Christmas needs a refund, asshole!",
"I've seen Rudolph shit straighter than you bowl!",
"Come on, you red-suited bastard!",
"That ball's got more brains than you, Santa!",
"You're a walking workplace violation, fat boy!",
"Get your shit together, Saint Nick!",
"Ho ho holy shit, that was embarrassing!",
"Your aim is as broken as our fucking benefits!"
];
const hits=["Oh, FUCK!","My tiny elf balls!","Tell my union rep!","Santa, you prick!","That's a lawsuit, asshole!","I quit this shitty job!"];
let current=null;
function open(){
 if(current&&document.contains(current.el)){Y2K.wm.restore(current);return current;}
 let frame=0,roll=false,score=[],throws=[],pins=[],ball=null,flying=[],settling=false,roundToken=0,raf=0,aim=0,angle=0,started=false,ended=false,tauntTime=0,animationStart=0,down=null;
 const win=Y2K.wm.create({title:"Elf Bowl '99",icon:'elfbowl',width:690,height:620,onClose(){cancelAnimationFrame(raf);current=null;},render(w){
 w.content.innerHTML='<div class="eb-app"><div class="eb-header"><strong>ELF BOWL <em>\'99</em></strong><span>THE NORTH POLE HAS A PROBLEM</span></div><div class="eb-score"></div><div class="eb-stage"><canvas width="640" height="410" aria-label="Elf bowling lane"></canvas><div class="eb-warning"><h2>⚠ WARNING ⚠</h2><h3>ELF BOWL \'99</h3><strong>MATURE AUDIENCES ONLY • 18+</strong><p>Strong language, crude humor, offensive elves, and a deeply dysfunctional North Pole workplace.</p><p>Santa has lost control of his employees. Player discretion is advised.</p><button data-play>I\'M 18+ • PLAY</button></div></div><div class="eb-controls"><label>Aim <input type="range" data-aim min="-90" max="90" value="0"></label><button data-bowl disabled>BOWL!</button><button data-new>New Game</button></div><div class="eb-caption" aria-live="polite">The elves are waiting to ruin Christmas.</div><div class="eb-help">Drag across the lane to aim, then release to bowl. Or use the slider and BOWL button. Ten frames, two throws per frame unless you strike.</div></div>';
 }});
 current=win;
 const root=win.content,canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d'),caption=root.querySelector('.eb-caption'),slider=root.querySelector('[data-aim]'),bowl=root.querySelector('[data-bowl]'),scoreEl=root.querySelector('.eb-score'),warning=root.querySelector('.eb-warning');
 const W=640,H=410;
 const positions=[[0,0],[-1,1],[1,1],[-2,2],[0,2],[2,2],[-3,3],[-1,3],[1,3],[3,3]];
 function makePins(){flying=[];settling=false;pins=positions.map(([x,row],i)=>({x:320+x*29,y:114+row*34,alive:true,id:i,fall:0}));}
 function say(message){caption.textContent='🧝 '+message;tauntTime=Date.now();}
 function scoreView(){const total=score.reduce((sum,f)=>sum+f.reduce((a,b)=>a+b,0),0);scoreEl.innerHTML='<span>FRAME '+Math.min(score.length+1,10)+'/10</span><span>THROWS: '+(throws.join(' • ')||'Ready')+'</span><span>PINS: '+pins.filter(p=>p.alive).length+'</span><span>SCORE: '+total+'</span>';}
 function elf(p){ctx.save();ctx.translate(p.x,p.y);if(!p.alive){ctx.translate(0,14);ctx.rotate(Math.PI/2);}ctx.fillStyle='#144e28';ctx.fillRect(-9,-8,18,24);ctx.fillStyle='#eac2a2';ctx.beginPath();ctx.ellipse(0,-20,11,13,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#eac2a2';ctx.beginPath();ctx.moveTo(-9,-20);ctx.lineTo(-20,-26);ctx.lineTo(-11,-12);ctx.moveTo(9,-20);ctx.lineTo(20,-26);ctx.lineTo(11,-12);ctx.fill();ctx.fillStyle='#b41926';ctx.beginPath();ctx.moveTo(-12,-30);ctx.lineTo(0,-52);ctx.lineTo(12,-30);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,-52,4,0,Math.PI*2);ctx.fill();ctx.fillStyle='#141414';ctx.fillRect(-5,-22,3,3);ctx.fillRect(4,-22,3,3);ctx.strokeStyle='#703326';ctx.beginPath();ctx.arc(0,-16,4,0,Math.PI);ctx.stroke();ctx.fillStyle='#161616';ctx.fillRect(-10,13,9,5);ctx.fillRect(2,13,9,5);ctx.restore();}
 function draw(){ctx.clearRect(0,0,W,H);const sky=ctx.createLinearGradient(0,0,0,220);sky.addColorStop(0,'#06142d');sky.addColorStop(1,'#1c4670');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';for(let i=0;i<40;i++){const x=(i*137+17)%W,y=(i*67+31)%150;ctx.fillRect(x,y,2,2);}ctx.fillStyle='#e6f2f7';ctx.fillRect(0,152,W,50);ctx.fillStyle='#2d3548';ctx.fillRect(0,188,W,222);ctx.fillStyle='#98613e';ctx.beginPath();ctx.moveTo(230,146);ctx.lineTo(410,146);ctx.lineTo(575,410);ctx.lineTo(65,410);ctx.closePath();ctx.fill();ctx.strokeStyle='#f9d6a1';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(240,146);ctx.lineTo(80,410);ctx.moveTo(400,146);ctx.lineTo(560,410);ctx.stroke();ctx.strokeStyle='#c48d58';ctx.lineWidth=1;for(let i=1;i<9;i++){const y=146+i*i*4;ctx.beginPath();ctx.moveTo(230-(y-146)*.63,y);ctx.lineTo(410+(y-146)*.63,y);ctx.stroke();}
 ctx.fillStyle='#efefef';ctx.font='bold 20px Arial';ctx.textAlign='center';ctx.fillText('NORTH POLE BOWLING ALLEY',320,65);
 pins.filter(p=>p.alive).sort((a,b)=>a.y-b.y).forEach(elf);
 for(const p of flying){ctx.save();ctx.globalAlpha=Math.max(0,1-p.age/80);ctx.translate(p.x+p.vx*p.age,p.y+p.vy*p.age+.19*p.age*p.age);ctx.rotate(p.spin*p.age);elf({...p,x:0,y:0,alive:true});ctx.restore();}
 if(ball){ctx.beginPath();ctx.fillStyle='#171c26';ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2);ctx.fill();ctx.fillStyle='#78899c';ctx.beginPath();ctx.ellipse(ball.x-ball.r*.25,ball.y-ball.r*.25,ball.r*.3,ball.r*.18,-.5,0,Math.PI*2);ctx.fill();}
 else if(started&&!ended){ctx.strokeStyle='#ffe679';ctx.lineWidth=2;ctx.setLineDash([8,8]);ctx.beginPath();ctx.moveTo(320,380);ctx.lineTo(320+aim*.9,145);ctx.stroke();ctx.setLineDash([]);ctx.beginPath();ctx.fillStyle='#252932';ctx.arc(320,378,24,0,Math.PI*2);ctx.fill();}
 }
 function loop(t){if(!document.contains(win.el))return;raf=requestAnimationFrame(loop);frame++;flying=flying.filter(p=>++p.age<80);if(ball){ball.progress=Math.min(1,ball.progress+.026);const q=ball.progress;ball.y=380-245*q;ball.x=320+ball.target*q;ball.r=24-15*q;if(q>=1){const target=ball.target;ball=null;finishThrow(target);}}draw();}
 function randomLift(){return 7+Math.random()*4;}
 function finishThrow(target){const standing=pins.filter(p=>p.alive);let count=0;for(const p of standing){const dx=p.x-(320+target);const chance=Math.max(0,1-Math.abs(dx)/100);if(Math.random()<chance*.95){p.alive=false;flying.push({...p,age:0,vx:(p.x-(320+target))*.045+(Math.random()-.5)*2,vy:-randomLift(),spin:(Math.random()-.5)*.17});count++;}}if(!count&&Math.abs(target)<35&&standing.length){const p=standing[Math.floor(Math.random()*standing.length)];p.alive=false;flying.push({...p,age:0,vx:(Math.random()-.5)*5,vy:-randomLift(),spin:(Math.random()-.5)*.17});count=1;}throws.push(count);say(count?hits[Math.floor(Math.random()*hits.length)]:heckles[Math.floor(Math.random()*heckles.length)]);roll=false;settling=true;const frameThrows=throws.length;const standingNow=pins.filter(p=>p.alive).length;if(standingNow===0||frameThrows===2){score.push([...throws]);throws=[];if(score.length>=10){ended=true;bowl.disabled=true;say('Game over, fatass! Final score: '+score.reduce((a,f)=>a+f.reduce((x,y)=>x+y,0),0)+'.');}else{const token=roundToken;setTimeout(()=>{if(!document.contains(win.el)||ended||token!==roundToken)return;makePins();scoreView();bowl.disabled=false;},1450);}}scoreView();if(!ended&&score.length<10&&throws.length>0){setTimeout(()=>{if(document.contains(win.el)&&!ended)bowl.disabled=false;},850);}else if(ended)bowl.disabled=true;}
 function throwBall(){if(!started||ended||roll||ball||bowl.disabled)return;roll=true;bowl.disabled=true;ball={x:320,y:380,r:24,progress:0,target:aim*.9};}
 function reset(){roundToken++;flying=[];settling=false;score=[];throws=[];roll=false;ball=null;ended=false;aim=0;slider.value=0;makePins();scoreView();bowl.disabled=!started;say(heckles[Math.floor(Math.random()*heckles.length)]);}
 slider.oninput=()=>{aim=Number(slider.value);};
 bowl.onclick=throwBall;root.querySelector('[data-new]').onclick=reset;
 warning.querySelector('[data-play]').onclick=()=>{warning.hidden=true;started=true;reset();};
 canvas.addEventListener('pointerdown',e=>{if(!started)return;down=true;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener('pointermove',e=>{if(!down||roll||ended)return;const rect=canvas.getBoundingClientRect();aim=Math.max(-90,Math.min(90,((e.clientX-rect.left)/rect.width-.5)*180));slider.value=aim;});
 canvas.addEventListener('pointerup',()=>{if(down){down=false;throwBall();}});canvas.addEventListener('pointercancel',()=>down=false);
 makePins();scoreView();raf=requestAnimationFrame(loop);return win;
}
Y2K.apps.push({id:'elfbowl',title:"Elf Bowl '99",icon:'elfbowl',open});
})();