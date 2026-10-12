/* Browser-only persistence. Storage failures are surfaced, never silently reported as saves. */
Y2K.storage = {
 read(key, fallback) { try { const value=JSON.parse(localStorage.getItem('y2k.'+key)); return value ?? fallback; } catch { return fallback; } },
 write(key, value) { try { localStorage.setItem('y2k.'+key,JSON.stringify(value)); return true; } catch { return false; } }
};
Y2K.colors=['#008080','#000080','#008000','#800000','#808000','#808080','#000000'];
Y2K.wallpapers={
 none:{name:'None',css:'none',size:'auto'},
 clouds:{name:'Clouds',css:'radial-gradient(ellipse at 17% 30%, #ffffff 0%, #ffffffcc 12%, transparent 33%),radial-gradient(ellipse at 68% 63%, #ffffff 0%, #ffffffd0 15%, transparent 37%),radial-gradient(ellipse at 88% 12%, #ffffffb0 0%, transparent 25%),linear-gradient(#4389d2,#b5dbfa)',size:'cover'},
 tiles:{name:'Blue Tiles',css:'repeating-linear-gradient(0deg,transparent 0 27px,#184c83 28px 30px),repeating-linear-gradient(90deg,#2466a2 0 27px,#184c83 28px 30px)',size:'auto'},
 stars:{name:'Starfield',css:'radial-gradient(circle at 8% 18%,#fff 0 1px,transparent 2px),radial-gradient(circle at 29% 76%,#fff 0 1px,transparent 2px),radial-gradient(circle at 74% 38%,#fff 0 1px,transparent 2px),radial-gradient(circle at 92% 83%,#fff 0 1px,transparent 2px),radial-gradient(circle at 48% 12%,#abcaff 0 1px,transparent 2px),linear-gradient(#050c32,#152d6b)',size:'110px 110px'},
 bricks:{name:'Bricks',css:'linear-gradient(335deg,#a94b43 23px,transparent 23px),linear-gradient(155deg,#a94b43 23px,transparent 23px),linear-gradient(335deg,#a94b43 23px,transparent 23px),linear-gradient(155deg,#a94b43 23px,transparent 23px),linear-gradient(#e0c5b1,#e0c5b1)',size:'60px 60px'},
 checker:{name:'Checkerboard',css:'conic-gradient(#d4d4d4 25%,#ffffff 0 50%,#d4d4d4 0 75%,#ffffff 0)',size:'48px 48px'},
 sunset:{name:'Sunset',css:'radial-gradient(circle at 50% 75%,#ffe28a 0 10%,transparent 11%),linear-gradient(180deg,#29164f 0%,#b34e8c 46%,#ff9b61 72%,#56365d 73%,#141a44 100%)',size:'cover'}
};
Y2K.schemes={
 classic:{name:'Windows Classic',gray:'#c0c0c0',blue:'#000080',taskbar:'#c0c0c0'},
 plum:{name:'Plum',gray:'#d2c5d9',blue:'#612a78',taskbar:'#d2c5d9'},
 forest:{name:'Forest',gray:'#c3d1c3',blue:'#205d41',taskbar:'#c3d1c3'},
 slate:{name:'Slate',gray:'#b9c5d1',blue:'#284d75',taskbar:'#b9c5d1'},
 sand:{name:'Desert',gray:'#d7c9aa',blue:'#77532b',taskbar:'#d7c9aa'}
};
const storedSettings=Y2K.storage.read('settings',{});
Y2K.settings={
 background:Y2K.colors.includes(storedSettings.background)?storedSettings.background:'#008080',
 labels:storedSettings.labels!==false,
 wallpaper:Object.hasOwn(Y2K.wallpapers,storedSettings.wallpaper)?storedSettings.wallpaper:'none',
 scheme:Object.hasOwn(Y2K.schemes,storedSettings.scheme)?storedSettings.scheme:'classic',
 iconSize:storedSettings.iconSize==='small'?'small':'normal'
};
Y2K.applySettings=()=>{
 const root=document.documentElement,desktop=document.getElementById('desktop'),icons=document.getElementById('icons');
 const theme=Y2K.schemes[Y2K.settings.scheme]||Y2K.schemes.classic;
 root.style.setProperty('--desktop',Y2K.settings.background);
 root.style.setProperty('--gray',theme.gray);
 root.style.setProperty('--blue',theme.blue);
 root.style.setProperty('--taskbar-color',theme.taskbar);
 const paper=Y2K.wallpapers[Y2K.settings.wallpaper]||Y2K.wallpapers.none;
 desktop.style.backgroundImage=paper.css;
 desktop.style.backgroundSize=paper.size;
 desktop.style.backgroundPosition='center';
 icons.classList.toggle('hide-labels',!Y2K.settings.labels);
 icons.classList.toggle('small-desktop-icons',Y2K.settings.iconSize==='small');
};
Y2K.documents=()=>{const d=Y2K.storage.read('documents',{});return d&&typeof d==='object'&&!Array.isArray(d)?d:{};};
