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
/* Conversational engine: local context, personal tastes, follow-up answers, and repetition control. */
const personalities={
 games:{intro:'i am supposed to be fixing my pc but quake keeps happening',likes:['Quake II','StarCraft','Tony Hawk'],questions:['u got a favorite game?','what are u playing lately?'],opinion:'i will defend the n64 until my dying day'},
 music:{intro:'just spent way too long making a mix cd',likes:['Blink-182','No Doubt','TLC'],questions:['what have u had on repeat?','ever make somebody a mix cd?'],opinion:'the best songs are always track 7 for some reason'},
 dramatic:{intro:'someone at school is telling everyone i stole their screen name',likes:['the mall','TRL','horror movies'],questions:['ok but what happened next?','would u be mad if someone did that?'],opinion:'TRL is basically my whole afternoon'},
 tech:{intro:'i finally got my sound card working and now my modem is acting up',likes:['building PCs','Half-Life','weird websites'],questions:['what kind of computer do u have?','have u ever built a pc?'],opinion:'windows 98 is pretty good when it isnt crashing'},
 food:{intro:'got back from getting pizza. its cold now lol',likes:['pizza rolls','late night snacks','arcade pizza'],questions:['what toppings do u get?','u hungry too?'],opinion:'leftover pizza is better cold'}
};
const subjectRules=[
 {id:'music',re:/\b(music|songs?|bands?|mp3s?|napster|cds?|blink.?182|britney|backstreet|nsync|tlc|eminem|metallica|radio|concert)\b/i},
 {id:'games',re:/\b(games?|gaming|quake|doom|starcraft|diablo|nintendo|n64|playstation|ps1|pokemon|half.life|tony hawk|sega|zelda)\b/i},
 {id:'tech',re:/\b(internet|modem|dial.?up|aol|computer|pc|windows|browser|website|download|connection|56k)\b/i},
 {id:'school',re:/\b(school|class|homework|teacher|tests?|college|graduat|prom)\b/i},
 {id:'food',re:/\b(pizza|food|hungry|snack|eat|taco|burger|dinner|lunch)\b/i},
 {id:'life',re:/\b(job|work|family|mom|dad|parents|weekend|today|tomorrow|date|dating|girlfriend|boyfriend|crush)\b/i}
];
const subjectLines={
 music:['u remember waiting by the radio to record a song?','i have a whole stack of cds next to my computer','i keep changing my favorite band every week'],
 games:['i spent three hours on one level last night','split screen multiplayer is the best thing ever','i swear games load faster when nobody else is using the phone'],
 tech:['my modem makes the loudest noise when it connects','my desktop is covered in shortcuts lol','i keep getting kicked offline right in the middle of downloads'],
 school:['i have homework open in another window and i am ignoring it','my teachers think the internet is just for research lol','i cannot wait for friday'],
 food:['now i want pizza rolls','i could live off vending machine snacks','i just remembered theres leftover pizza in the fridge'],
 life:['this weekend better be more interesting than last weekend','i have no plans except sitting at this computer','everyone i know is online tonight']
};
const followupAnswers={
 music:['i think i would pick Blink-182 today. ask me tomorrow and it might change','i like the stuff they play on TRL, mostly','i am trying to make the perfect mix cd'],
 games:['probably Quake II, but i keep going back to Mario Kart','i would take N64 for multiplayer and PlayStation for everything else','i like games where u can play against your friends'],
 tech:['i am on a 56k modem, on a good day','i have windows 98 and way too little ram','i want a faster connection more than anything'],
 school:['math is destroying me right now','my least favorite part is waking up early','i would rather be anywhere else'],
 food:['pepperoni, no contest','pizza rolls if im too lazy to cook','anything i can eat at the computer'],
 life:['mostly hanging out and listening to music','nothing exciting, what about u?','i was hoping something interesting would happen']
};
function getState(key){const raw=Y2K.storage.read('aim.memory.'+key,{});return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};}
function saveState(key,state){Y2K.storage.write('aim.memory.'+key,{subject:state.subject||'',asked:state.asked||'',lastReplies:(state.lastReplies||[]).slice(-6),turn:state.turn||0,username:state.username||'',favorite:state.favorite||''});}
function replyTo(message,person,state){
 const text=message.trim(),low=text.toLowerCase(),p=personalities[person.mood]||personalities.games;
 state.turn=(state.turn||0)+1;
 const matched=subjectRules.find(t=>t.re.test(text)),previous=state.subject||person.mood;
 const subject=matched?.id||previous;
 const last=state.lastReplies||[];
 function pick(options){const fresh=options.filter(x=>!last.includes(x));const pool=fresh.length?fresh:options;const selected=pool[(state.turn*7+text.length+person.name.length)%pool.length];state.lastReplies=[...last,selected].slice(-6);return selected;}
 const named=text.match(/\b(?:my name is|call me|i'm|i am)\s+([a-z][a-z0-9_]{1,18})\b/i);
 if(named&&!['bored','good','fine','sad','happy','tired','hungry','playing','listening'].includes(named[1].toLowerCase()))state.username=named[1];
 const fav=text.match(/\b(?:my favorite|i love|i like|im into|i'm into)\s+(.{2,35})/i);
 if(fav)state.favorite=fav[1].replace(/[.!?]+$/,'').slice(0,35);
 let answer;
 if(/\b(?:bye|later|goodnight|gtg|gotta go|ttyl)\b/i.test(text))answer=pick(['later! dont forget to sign off lol','ttyl :)','cya, message me again sometime']);
 else if(/\b(?:hello|hey|hi|sup|yo)\b/i.test(text)&&text.split(/\s+/).length<=5)answer=pick(['hey! '+p.intro,'sup :) '+p.questions[0],'hey hey. '+p.questions[1]]);
 else if(/\b(?:who are you|your name|what is your name)\b/i.test(text))answer=pick(['im '+person.name+'. '+p.intro,'just '+person.name+' on aim lol. '+p.questions[0]]);
 else if(/\b(?:how are you|how r u|how you doing|hows it going)\b/i.test(text))answer=pick(['pretty good, '+p.intro,'not bad. '+p.questions[0],'a little bored tbh. what about u?']);
 else if(/\b(?:remember me|what is my name|do you know my name)\b/i.test(text))answer=state.username?'ur '+state.username+' right? i remember :)':'i dont think u told me ur name yet';
 else if(/\b(?:what do i like|my favorite|what did i say i liked)\b/i.test(text)&&/\b(?:what|remember|did i)\b/i.test(text))answer=state.favorite?'u said '+state.favorite+'. did i get that right?':'u havent told me a favorite yet';
 else if(/\b(?:are you (real|human|a bot|ai)|is this (real|a bot|ai))\b/i.test(text))answer='im a fictional screen name in a 1999 desktop simulator lol. still fun to chat tho';
 else if(/\b(?:sad|upset|lonely|depressed|stressed|rough day|bad day)\b/i.test(text))answer=pick(['that sounds rough. wanna tell me what happened?','sorry to hear that. whats going on?','aw :( im listening']);
 else if(/\b(?:happy|excited|awesome|great news)\b/i.test(text))answer=pick(['wait thats awesome! what happened?','nice!! tell me more','thats actually pretty cool :)']);
 else if(/\b(?:yes|yeah|yep|sure|definitely|no|nope|nah)\b/i.test(text)&&text.split(/\s+/).length<=4&&state.asked){answer=/\b(?:no|nope|nah)\b/i.test(text)?pick(['fair enough lol. '+p.questions[1],'haha ok. what would u rather do?']):pick(['nice! '+subjectLines[subject]?.[state.turn%3],'same here. '+p.questions[1]]);state.asked='';}
 else if(/\b(?:why|how come)\b/i.test(text)&&!matched){answer=pick(['mostly because '+p.opinion+'. what do u think?','i dunno, i guess thats just how it is lol','good question. '+p.intro]);}
 else if(/\b(?:what do you|what's your|whats your|which do you|do you like|favorite|recommend)\b/i.test(text)&&matched){answer=pick(followupAnswers[subject]||followupAnswers.life);state.asked=subject;}
 else if(matched){answer=pick([...subjectLines[subject],...followupAnswers[subject]]);if(state.favorite&&state.turn%4===0)answer+=' u mentioned '+state.favorite+' before too';state.asked=subject;}
 else if(/\?$/.test(text)){answer=pick(['hmm. '+p.opinion+'. what do u think?','not totally sure. '+p.questions[0],p.intro+'. does that answer it?']);state.asked=subject;}
 else if(text.length>18){answer=pick(['wait, '+text.split(/\s+/).slice(0,5).join(' ')+'... tell me more about that','thats interesting. '+p.questions[0],'ok now i need the rest of the story lol']);state.asked=subject;}
 else answer=pick([p.intro,p.opinion,p.questions[0],...subjectLines[subject]||subjectLines.life]);
 state.subject=subject;
 return answer;
}
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
  if(!entries.length)entries.push({name:isRoom?'System':target.name,text:isRoom?'Welcome to '+target.name+'! '+target.topic:(personalities[target.mood]?.intro||'hey there!')});
  const child=Y2K.wm.create({title:(isRoom?'Chat Room: ':'Instant Message: ')+target.name,icon:'computer',width:460,height:425,owner:win,render(w){
   w.content.innerHTML='<div class="aim-chat"><div class="aim-chat-head"><strong data-heading></strong><span data-subheading></span></div><div class="aim-transcript" data-transcript role="log" aria-live="polite" aria-label="Chat transcript"></div><form class="aim-compose"><label for="aim-message-'+target.id+'">Message:</label><textarea id="aim-message-'+target.id+'" rows="2" maxlength="500" placeholder="Type a message..."></textarea><div class="aim-send-row"><span data-typing></span><button type="submit">Send</button></div></form></div>';
  }});
  const box=child.content,log=box.querySelector('[data-transcript]'),form=box.querySelector('form'),input=form.querySelector('textarea'),typing=box.querySelector('[data-typing]');
  box.querySelector('[data-heading]').textContent=isRoom?'# '+target.name:target.name;
  box.querySelector('[data-subheading]').textContent=isRoom?target.members.join(', '):(target.online?'Online now':'Away: getting pizza');
  let pending=null,turn=entries.length;const state=getState(key);
  function add(name,text){entries.push({name,text});if(entries.length>70)entries.shift();Y2K.storage.write('aim.chat.'+key,entries);draw();}
  function draw(){log.replaceChildren();for(const entry of entries){const p=document.createElement('p'),label=document.createElement('strong');label.textContent=entry.name+': ';label.className=entry.name===screenname?'aim-self':'';p.append(label,document.createTextNode(entry.text));log.append(p);}log.scrollTop=log.scrollHeight;}
  draw();input.focus();
  form.onsubmit=e=>{e.preventDefault();const msg=input.value.trim();if(!msg)return;input.value='';add(screenname,msg);if(pending)clearTimeout(pending);const person=isRoom?buddies.find(b=>b.name===target.members[turn%target.members.length])||buddies[0]:target;const reply=replyTo(msg,person,state);saveState(key,state);turn++;typing.textContent=person.name+' is typing...';pending=setTimeout(()=>{pending=null;if(!document.contains(child.el))return;typing.textContent='';add(person.name,reply);tone();},650+Math.min(msg.length*30,1200));};
  input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();form.requestSubmit();}});
  child.onClose=()=>{if(pending)clearTimeout(pending);return true;};
 }
}
Y2K.apps.push({id:'aim',title:'Y2K Instant Messenger',icon:'computer',open});
})();
