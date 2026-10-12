/* Y2K Amp: original late-90s media player using local browser audio. */
(()=>{
let active=null;
/* A short, original tracker-style loop rendered as a WAV so the normal player controls work. */
function demoWav(){
 const rate=11025,bpm=132,beats=64,duration=beats*60/bpm,count=Math.floor(duration*rate);
 const bytes=new ArrayBuffer(44+count*2),view=new DataView(bytes);
 const str=(p,s)=>{for(let i=0;i<s.length;i++)view.setUint8(p+i,s.charCodeAt(i));};
 str(0,'RIFF');view.setUint32(4,36+count*2,true);str(8,'WAVE');str(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);str(36,'data');view.setUint32(40,count*2,true);
 const bass=[55,55,65.406,65.406,73.416,73.416,65.406,65.406],notes=[440,523.25,659.25,523.25,392,493.88,587.33,493.88,349.23,440,523.25,440,392,493.88,587.33,659.25];
 const twopi=Math.PI*2,beatLength=60/bpm;
 for(let i=0;i<count;i++){
  const t=i/rate,beat=t/beatLength,step=Math.floor(beat),phase=beat%1,bar=Math.floor(step/4);
  const f=bass[Math.floor(step/2)%bass.length],bassEnv=Math.exp(-phase*4);
  const saw=(t*f)%1*2-1;
  const kickTime=phase*beatLength,kick=Math.sin(twopi*(58*kickTime+120*(1-Math.exp(-kickTime*22))/22))*Math.exp(-kickTime*19);
  const hat=((Math.sin(i*2.398)+Math.sin(i*1.1337)*.5+Math.sin(i*.913)*.3)/1.8)*Math.exp(-((beat*2)%1)*13);
  const snare=(step%4===1||step%4===3)?Math.sin(i*1.719)*Math.exp(-kickTime*24):0;
  const n=notes[Math.floor(beat*2)%notes.length],melPhase=(beat*2)%1;
  const melody=bar>=2?Math.sin(twopi*n*t)*Math.exp(-melPhase*6):0;
  const pad=Math.sin(twopi*f*4*t)*.07;
  const fade=Math.min(1,t/.5,(duration-t)/.7);
  const sample=(kick*.34+saw*bassEnv*.16+hat*.055+snare*.12+melody*.15+pad)*Math.max(0,fade);
  view.setInt16(44+i*2,Math.max(-1,Math.min(1,sample))*32767,true);
 }
 return new Blob([bytes],{type:'audio/wav'});
}

function open(){
 if(active&&document.contains(active.win.el)){Y2K.wm.restore(active.win);return active.win;}
 const tracks=[],audio=new Audio();audio.preload='metadata';
 let index=-1,shuffle=false,repeat=false,playlistOpen=true,eqOpen=false,ctx=null,analyser=null,source=null,raf=0;
 const win=Y2K.wm.create({title:'Y2K Amp',icon:'cd',width:370,height:480,onClose(){cleanup();},render(w){
 w.content.innerHTML='<div class="amp-app"><div class="amp-brand"><b>Y2K<span>AMP</span></b><small>v2.99 • DIGITAL AUDIO PLAYER</small></div><div class="amp-display"><div class="amp-readout"><strong data-time>00:00</strong><div class="amp-trackname"><span data-title>Y2K AMP • LOAD YOUR MUSIC</span><small data-meta>STEREO • READY</small></div></div><canvas data-viz width="300" height="32" aria-label="Audio visualizer"></canvas></div><div class="amp-seek"><input data-seek type="range" min="0" max="1000" value="0" aria-label="Seek position"></div><div class="amp-controls"><button data-prev title="Previous track" aria-label="Previous track">|◀</button><button data-play title="Play" aria-label="Play">▶</button><button data-pause title="Pause" aria-label="Pause">Ⅱ</button><button data-stop title="Stop" aria-label="Stop">■</button><button data-next title="Next track" aria-label="Next track">▶|</button><label>VOL <input data-volume type="range" min="0" max="100" value="75" aria-label="Volume"></label></div><div class="amp-switches"><button data-shuffle aria-pressed="false">SHUFFLE</button><button data-repeat aria-pressed="false">REPEAT</button><button data-eq aria-expanded="false">EQ</button><button data-list aria-expanded="true">PL</button></div><div class="amp-eq" data-eq-panel hidden><label>BASS <input data-bass type="range" min="-12" max="12" value="0"></label><label>TREBLE <input data-treble type="range" min="-12" max="12" value="0"></label><small>Equalizer uses Web Audio where supported.</small></div><div class="amp-playlist"><div class="amp-playlist-title">PLAYLIST EDITOR <span data-count>0 TRACKS</span></div><ol data-tracks></ol><div class="amp-list-actions"><button data-add>+ ADD FILES</button><button data-clear>CLEAR</button><span data-status>Load MP3, WAV, M4A or other supported audio</span></div></div><input data-files type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg,.flac" multiple hidden></div>';
 }});
 active={win};
 const root=win.content,$=sel=>root.querySelector(sel),title=$('[data-title]'),meta=$('[data-meta]'),clock=$('[data-time]'),seek=$('[data-seek]'),list=$('[data-tracks]'),status=$('[data-status]'),canvas=$('[data-viz]'),paint=canvas.getContext('2d');
 audio.volume=.75;
 function fmt(t){if(!Number.isFinite(t))return'00:00';return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
 function update(){clock.textContent=fmt(audio.currentTime);seek.value=Number.isFinite(audio.duration)&&audio.duration>0?Math.round(audio.currentTime/audio.duration*1000):0;meta.textContent=(Number.isFinite(audio.duration)?fmt(audio.duration):'--:--')+'  •  '+(audio.paused?'PAUSED':'PLAYING');list.querySelectorAll('li').forEach((li,i)=>li.classList.toggle('amp-current',i===index));}
 function display(){const track=tracks[index];title.textContent=track?track.name:'Y2K AMP • LOAD YOUR MUSIC';update();}
 function audioGraph(){if(ctx||!window.AudioContext&&!window.webkitAudioContext)return;try{const AudioContextClass=window.AudioContext||window.webkitAudioContext;ctx=new AudioContextClass();source=ctx.createMediaElementSource(audio);const bass=ctx.createBiquadFilter(),treble=ctx.createBiquadFilter();bass.type='lowshelf';bass.frequency.value=200;treble.type='highshelf';treble.frequency.value=3200;analyser=ctx.createAnalyser();analyser.fftSize=128;source.connect(bass);bass.connect(treble);treble.connect(analyser);analyser.connect(ctx.destination);$('[data-bass]').oninput=e=>bass.gain.value=Number(e.target.value);$('[data-treble]').oninput=e=>treble.gain.value=Number(e.target.value);}catch(e){status.textContent='Equalizer unavailable in this browser.';}}
 async function play(){if(!tracks.length){$('[data-files]').click();return;}if(index<0)load(0,false);audioGraph();if(ctx?.state==='suspended')await ctx.resume();try{await audio.play();status.textContent='Playing '+tracks[index].name;}catch(e){status.textContent='Tap Play to start audio. Unsupported files cannot play.';}update();}
 function load(i,autoplay=true){if(i<0||i>=tracks.length)return;index=i;audio.src=tracks[i].url;audio.load();display();if(autoplay)play();}
 function next(direction=1){if(!tracks.length)return;if(shuffle&&tracks.length>1){let n;do{n=Math.floor(Math.random()*tracks.length);}while(n===index);load(n);}else{let n=index+direction;if(n>=tracks.length){if(!repeat){audio.pause();audio.currentTime=0;update();status.textContent='End of playlist';return;}n=0;}if(n<0)n=tracks.length-1;load(n);}}
 function renderList(){list.replaceChildren();tracks.forEach((track,i)=>{const li=document.createElement('li'),b=document.createElement('button');b.textContent=(i+1)+'. '+track.name;b.title='Play '+track.name;b.onclick=()=>load(i);li.append(b);list.append(li);});$('[data-count]').textContent=tracks.length+' TRACK'+(tracks.length===1?'':'S');update();}
 function addFiles(files){const audioFiles=[...files].filter(f=>f.type.startsWith('audio/')||/\.(mp3|m4a|wav|ogg|flac|aac)$/i.test(f.name));for(const f of audioFiles)tracks.push({name:f.name.replace(/\.[^.]+$/,''),url:URL.createObjectURL(f)});renderList();status.textContent=audioFiles.length+' file(s) added. Files stay on your device.';if(index<0&&tracks.length)load(0,false);}
 function clear(){audio.pause();audio.removeAttribute('src');audio.load();tracks.forEach(t=>URL.revokeObjectURL(t.url));tracks.length=0;index=-1;renderList();display();status.textContent='Playlist cleared';}
 function cleanup(){cancelAnimationFrame(raf);audio.pause();clear();ctx?.close();ctx=null;active=null;}
 function visualize(){if(!document.contains(win.el))return;const w=canvas.width,h=canvas.height;paint.fillStyle='#050c0d';paint.fillRect(0,0,w,h);if(analyser&&!audio.paused){const data=new Uint8Array(analyser.frequencyBinCount);analyser.getByteFrequencyData(data);const bars=40;for(let i=0;i<bars;i++){const value=data[Math.floor(i*data.length/bars)]/255;paint.fillStyle=value>.7?'#d4ee49':'#44d777';paint.fillRect(i*7.5,h-value*h,5,value*h);}}else{paint.fillStyle='#295a39';for(let i=0;i<40;i++)paint.fillRect(i*7.5,h-3,5,2);}raf=requestAnimationFrame(visualize);}
 $('[data-play]').onclick=play;$('[data-pause]').onclick=()=>{audio.pause();update();};$('[data-stop]').onclick=()=>{audio.pause();audio.currentTime=0;update();};$('[data-prev]').onclick=()=>next(-1);$('[data-next]').onclick=()=>next();$('[data-volume]').oninput=e=>audio.volume=Number(e.target.value)/100;
 seek.oninput=e=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=Number(e.target.value)/1000*audio.duration;};
 $('[data-shuffle]').onclick=e=>{shuffle=!shuffle;e.currentTarget.setAttribute('aria-pressed',String(shuffle));};$('[data-repeat]').onclick=e=>{repeat=!repeat;e.currentTarget.setAttribute('aria-pressed',String(repeat));};
 $('[data-eq]').onclick=e=>{eqOpen=!eqOpen;$('[data-eq-panel]').hidden=!eqOpen;e.currentTarget.setAttribute('aria-expanded',String(eqOpen));if(eqOpen)audioGraph();};
 $('[data-list]').onclick=e=>{playlistOpen=!playlistOpen;root.querySelector('.amp-playlist').hidden=!playlistOpen;e.currentTarget.setAttribute('aria-expanded',String(playlistOpen));};
 $('[data-add]').onclick=()=>$('[data-files]').click();$('[data-files]').onchange=e=>{addFiles(e.target.files);e.target.value='';};$('[data-clear]').onclick=clear;
 const demoUrl=URL.createObjectURL(demoWav());tracks.push({name:'Y2K Amp - Dial-Up Dreams (Demo)',url:demoUrl});renderList();load(0,false);status.textContent='Demo track ready. Tap Play to listen.';
 audio.addEventListener('timeupdate',update);audio.addEventListener('loadedmetadata',update);audio.addEventListener('ended',()=>next());audio.addEventListener('error',()=>{if(tracks.length)status.textContent='Cannot play this format in this browser.';});visualize();display();return win;
}
Y2K.apps.push({id:'winamp',title:'Y2K Amp',icon:'cd',open});
})();
