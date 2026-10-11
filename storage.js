/* Browser-only persistence. Storage failures are surfaced, never silently reported as saves. */
Y2K.storage = {
 read(key, fallback) { try { const value=JSON.parse(localStorage.getItem('y2k.'+key)); return value ?? fallback; } catch { return fallback; } },
 write(key, value) { try { localStorage.setItem('y2k.'+key,JSON.stringify(value)); return true; } catch { return false; } }
};
Y2K.colors=['#008080','#000080','#008000','#800000','#808000','#808080','#000000'];
const storedSettings=Y2K.storage.read('settings',{});
Y2K.settings={background:Y2K.colors.includes(storedSettings.background)?storedSettings.background:'#008080',labels:storedSettings.labels!==false};
Y2K.applySettings=()=>{document.documentElement.style.setProperty('--desktop',Y2K.settings.background);document.getElementById('icons').classList.toggle('hide-labels',!Y2K.settings.labels);};
Y2K.documents=()=>{const d=Y2K.storage.read('documents',{});return d&&typeof d==='object'&&!Array.isArray(d)?d:{};};
