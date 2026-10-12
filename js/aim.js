/* Y2K Messenger: fictional offline 1999 buddy conversations and chat rooms. */
(()=>{
const buddies=[
 {id:'sk8rboi99',name:'Sk8rBoi99',mood:'games',online:true},
 {id:'glittergrl82',name:'GlitterGrl82',mood:'music',online:true},
 {id:'xXdarkangelXx',name:'xXDarkAngelXx',mood:'dramatic',online:true},
 {id:'modemwizard',name:'ModemWizard',mood:'tech',online:true},
 {id:'away4pizza',name:'Away4Pizza',mood:'food',online:false}
];
const rooms=[
 {id:'teenhangout',name:'Teen Hangout',topic:'Homework, crushes, and totally random stuff',members:['Sk8rBoi99','GlitterGrl82','xXDarkAngelXx']},
 {id:'music1999',name:'Music & MP3s',topic:'CDs, mixtapes, and the new MP3 craze',members:['GlitterGrl82','ModemWizard','Sk8rBoi99']},
 {id:'gamers',name:'PC Gamers',topic:'LAN parties, cheat codes, and dial-up lag',members:['Sk8rBoi99','ModemWizard','xXDarkAngelXx']}
];
const canned={
 games:['i was just playing quake lol','my computer lags so bad when everyone gets online','u play starcraft?','brb my mom needs the phone','that would be epic if my pc could run it'],
 music:['i have that song stuck in my head now','burning a mix cd tonight!','i still listen to my discman on the bus','napster is changing everything lol','what band are u into?'],
 dramatic:['omg seriously???','lol whateverrr','that is SO 1998','i cant even rn','brb changing my away message'],
 tech:['try restarting it. classic fix lol','56k is fast until someone picks up the phone','i built my own pc last summer','have u tried a different browser?','i want a faster modem sooo bad'],
 food:['pizza rolls count as dinner right','im back, got pizza','anyone hungry?','brb getting snacks']
};
const greetings={games:'sup! just got back from a LAN party.',music:'heyyy :) what are u listening to?',dramatic:'heyyyy!! omg i have gossip',tech:'Hey! Just finished tweaking my computer.',food:'away: getting pizza. leave a message!'};
const topics=[
 [/\b(hi|hey|hello|sup|yo|what'?s up)\b/i,['hey!! :)','heyyy what are u up to?','sup lol']],
 [/\b(how are you|how r u|how you doing)\b/i,['pretty good! just hanging online','bored lol. u?','doing ok, homework can wait']],
 [/\b(who are you|your name|what is your name)\b/i,['just another screen name on the internet lol','u can call me by my screen name :)']],
 [/\b(music|song|band|mp3|napster|cd|blink|britney|backstreet|nsync)\b/i,['i have been downloading mp3s all night','do u make mix cds?','my favorite songs change every week lol']],
 [/\b(game|quake|doom|starcraft|diablo|nintendo|playstation|pokemon)\b/i,['i could play games all weekend','multiplayer is so much better at a LAN party','i need a new graphics card so bad']],
 [/\b(internet|modem|dial.?up|aol|computer|windows|browser)\b/i,['my connection keeps dropping lol','if somebody picks up the phone im disconnected','remember when 28.8k was fast?']],
 [/\b(school|class|homework|teacher|test)\b/i,['i should be doing homework right now','school tomorrow ugh','i forgot about my homework lol']],
 [/\b(pizza|food|hungry|snack|eat)\b/i,['pizza rolls are basically a food group','brb kitchen raid','i could eat an entire pizza rn']],
 [/\b(lol|haha|lmao|rofl)\b/i,['LOL','hahaha exactly','rofl']],
 [/\b(bye|later|goodnight|gtg|brb)\b/i,['later!!','ttyl :)','cya online!']],
 [/\b(why|what|how|when|where)\b/i,['not sure tbh, what do u think?','lol good question','idk, tell me more']],
 [/\b(yes|yeah|yep|sure|totally)\b/i,['same here','lol exactly','right??']],
 [/\b(no|nope|nah|never)\b/i,['fair enough lol','haha okay','why not?']]
];
let current=null;
function choose(arr,seed){return arr[Math.abs(seed)%arr.length];}
function response(message,mood,turn){const rule=topics.find(([re])=>re.test(message));return choose(rule?rule[1]:canned[mood],message.length*7+turn*13+mood.length);}
function tone(){try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;const c=new A(),o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(660,c.currentTime);o.frequency.setValueAtTime(880,c.currentTime+.09);g.gain.setValueAtTime(.035,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.21);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.22);o.onended=()=>c.close();}catch{}}
function open(){
 if(current&&document.contains(current.el)){Y2K.wm.restore(current);return current;}
 const win=Y2K.wm.create({title:'Y2K Instant Messenger - Buddy List',icon:'computer',width:310,height:470,render(w){
  w.content.innerHTML='<div class="aim-buddy"><div class="aim-banner"><b>Y2K<span> Instant Messenger</span></b><small>CONNECTED • 56K ONLINE</small></div><div class="aim-account">Screen Name: <strong data-screenname>RetroGuest99</strong> <button data-change-name title="Change your screen name">Edit</button></div><div class="aim-away"><label><input type="checkbox" data-away> Away</label><input data-away-text value="BRB - surfing the web" aria-label="Away message"></div><div class="aim-section">Buddies <small>double-click or tap to chat</small></div><div class="aim-buddy-list" data-buddies></div><div class="aim-section">Chat Rooms</div><div class="aim-buddy-list" data-rooms></div><div class="aim-footer">● Online <span>SIMULATED CHAT • NO REAL USERS</span></div></div>';
 }});
 current=win;
 const root=win.content,$=s=>root.querySelector(s),saved=Y2K.storage.read('aim.profile',{});
 let screenname=typeof saved.screenname==='string'&&saved.screenname.trim()?saved.screenname.slice(0,22):'RetroGuest99',away=!!saved.away,awayText=typeof saved.awayText==='string'?saved.awayText:'BRB - surfing the web';
 $('[data-screenname]').textContent=screenname;$('[data-away]').checked=away;$('[data-away-text]').value=awayText;
 const persist=()=>Y2K.storage.write('aim.profile',{screenname,away,awayText});
 $('[data-change-name]').onclick=()=>{const name=prompt('Choose your screen name (up to 22 characters):',screenname);if(name===null)return;const clean=name.trim().replace(/[^a-zA-Z0-9_]/g,'').slice(0,22);if(!clean){Y2K.message('Screen Name','Use letters, numbers, or underscores.');return;}screenname=clean;$('[data-screenname]').textContent=clean;persist();};
 $('[data-away]').onchange=e=>{away=e.target.checked;persist();};$('[data-away-text]').onchange=e=>{awayText=e.target.value.slice(0,100);persist();};
 for(const buddy of buddies){const button=document.createElement('button');button.className='aim-contact';button.innerHTML='<span class="aim-dot '+(buddy.online?'':'aim-offline')+'">●</span><span></span><small></small>';button.children[1].textContent=buddy.name;button.lastChild.textContent=buddy.online?'Online':'Away';button.onclick=()=>conversation(buddy);$('[data-buddies]').append(button);}
 for(const room of rooms){const button=document.createElement('button');button.className='aim-contact';button.innerHTML='<span>♣</span><span></span><small></small>';button.children[1].textContent=room.name;button.lastChild.textContent=room.members.length+' users';button.onclick=()=>conversation(room,true);$('[data-rooms]').append(button);}
 return win;
 function conversation(target,isRoom=false){
  const key=(isRoom?'room.':'buddy.')+target.id,history=Y2K.storage.read('aim.chat.'+key,[]);
  const entries=Array.isArray(history)?history.filter(x=>x&&typeof x.name==='string'&&typeof x.text==='string').slice(-70):[];
  if(!entries.length)entries.push({name:isRoom?'System':target.name,text:isRoom?'Welcome to '+target.name+'! '+target.topic:greetings[target.mood]});
  const child=Y2K.wm.create({title:(isRoom?'Chat Room: ':'Instant Message: ')+target.name,icon:'computer',width:460,height:425,owner:win,render(w){
   w.content.innerHTML='<div class="aim-chat"><div class="aim-chat-head"><strong data-heading></strong><span data-subheading></span></div><div class="aim-transcript" data-transcript role="log" aria-live="polite" aria-label="Chat transcript"></div><form class="aim-compose"><label for="aim-message-'+target.id+'">Message:</label><textarea id="aim-message-'+target.id+'" rows="2" maxlength="500" placeholder="Type a message..."></textarea><div class="aim-send-row"><span data-typing></span><button type="submit">Send</button></div></form></div>';
  }});
  const box=child.content,log=box.querySelector('[data-transcript]'),form=box.querySelector('form'),input=form.querySelector('textarea'),typing=box.querySelector('[data-typing]');
  box.querySelector('[data-heading]').textContent=isRoom?'# '+target.name:target.name;
  box.querySelector('[data-subheading]').textContent=isRoom?target.members.join(', '):(target.online?'Online now':'Away: getting pizza');
  let pending=null,turn=entries.length;
  function add(name,text){entries.push({name,text});if(entries.length>70)entries.shift();Y2K.storage.write('aim.chat.'+key,entries);draw();}
  function draw(){log.replaceChildren();for(const entry of entries){const p=document.createElement('p'),label=document.createElement('strong');label.textContent=entry.name+': ';label.className=entry.name===screenname?'aim-self':'';p.append(label,document.createTextNode(entry.text));log.append(p);}log.scrollTop=log.scrollHeight;}
  draw();input.focus();
  form.onsubmit=e=>{e.preventDefault();const msg=input.value.trim();if(!msg)return;input.value='';add(screenname,msg);if(pending)clearTimeout(pending);const person=isRoom?buddies.find(b=>b.name===target.members[turn%target.members.length])||buddies[0]:target;const reply=response(msg,person.mood,++turn);typing.textContent=person.name+' is typing...';pending=setTimeout(()=>{pending=null;if(!document.contains(child.el))return;typing.textContent='';add(person.name,reply);tone();},650+Math.min(msg.length*30,1200));};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
  child.onClose=()=>{if(pending)clearTimeout(pending);return true;};
 }
}
Y2K.apps.push({id:'aim',title:'Y2K Instant Messenger',icon:'computer',open});
})();
