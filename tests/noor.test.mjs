import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chapters,portraits,events,calendarFor,cleanBlessing,readBlessings,storageKey} from '../src/noor/story.mjs';

test('all four celebrations use the chosen December weekend and correct IST instants',()=>{
 assert.equal(events.length,4);assert.equal(events[0].date,'Friday, 18 December 2026');assert.equal(events[2].date,'Sunday, 20 December 2026');
 assert.equal(new Date(events[2].start).toISOString(),'2026-12-20T04:30:00.000Z');
 const calendar=calendarFor(events[2],new Date('2026-11-18T00:00:00Z'));
 assert.match(calendar,/DTSTART:20261220T043000Z\r\n/);assert.match(calendar,/DTEND:20261220T063000Z\r\n/);
 assert.match(calendar,/DTSTAMP:20261118T000000Z/);assert.match(calendar,/LOCATION:The Darbar Sahib\\, Noor Mahal\\, Patiala/);
});
test('calendar lines are UTF-8 folded and guest text cannot inject calendar properties',()=>{
 const event={...events[0],name:'A'.repeat(100)+' — ਮੇਹਰ',line:'Love, joy; peace\nBEGIN:ATTACK'};
 const output=calendarFor(event),lines=output.split('\r\n').filter(Boolean);
 assert.ok(lines.every(line=>Buffer.byteLength(line,'utf8')<=75));assert.ok(!lines.includes('BEGIN:ATTACK'));
 assert.match(output.replace(/\r\n /g,''),/Love\\, joy\\; peace\\nBEGIN:ATTACK/);
 assert.equal(lines.filter(x=>x==='BEGIN:VEVENT').length,1);assert.equal(lines.filter(x=>x==='END:VEVENT').length,1);
});
test('private blessing storage tolerates denied access, corrupt data and excess history',()=>{
 assert.deepEqual(readBlessings({getItem(){throw new Error('denied')}}),[]);
 assert.deepEqual(readBlessings({getItem:()=>'{broken'}),[]);assert.deepEqual(readBlessings({getItem:()=>'{"text":"invalid"}'}),[]);
 const input=Array.from({length:14},(_,i)=>({name:'  Guest '+i+' ',text:' Love '+i+' '}));
 const stored=readBlessings({getItem:key=>{assert.equal(key,storageKey);return JSON.stringify(input)}});
 assert.equal(stored.length,8);assert.equal(stored[0].text,'Love 6');assert.equal(stored.at(-1).name,'Guest 13');
 assert.deepEqual(cleanBlessing('  A  ','   '),{name:'A',text:''});assert.equal(cleanBlessing('a'.repeat(90),'b'.repeat(300)).text.length,180);
});
test('the invitation loads only its new local experience and includes all eight new portraits',()=>{
 const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(html,/<title>Armaan &amp; Meher|<title>Armaan & Meher/);assert.doesNotMatch(html,/Anirudh|Kavya|Santorini|infinity\.bundle/);
 assert.equal((html.match(/class="scene /g)||[]).length,8);assert.equal(chapters.length,8);assert.equal(portraits.length,8);
 for(const {file} of portraits){assert.ok(fs.existsSync(new URL(`../assets/noor/${file}.webp`,import.meta.url)));assert.ok(fs.existsSync(new URL(`../assets/noor/${file}-thumb.webp`,import.meta.url)));}
 for(const match of html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)){const file=match[1];if(!/^(https?:|#|blob:)/.test(file))assert.ok(fs.existsSync(new URL('../'+file,import.meta.url)),file);}
});

test('accessible journey, event tabs, blessing safety and replay work without a GPU',async()=>{
 const {Window}=await import('happy-dom');const win=new Window({url:'http://localhost/',settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');win.document.write(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g,''));
 const noop=()=>{},gradient={addColorStop:noop},ctx=new Proxy({createRadialGradient:()=>gradient,createLinearGradient:()=>gradient},{get:(target,key)=>target[key]??noop,set:(target,key,value)=>{target[key]=value;return true;}});
 win.HTMLCanvasElement.prototype.getContext=function(type){return type==='2d'?ctx:null;};
 win.matchMedia=()=>({matches:true,addEventListener:noop,removeEventListener:noop});
 win.HTMLMediaElement.prototype.play=()=>Promise.resolve();win.HTMLMediaElement.prototype.pause=noop;
 const originals=new Map(),globals={window:win,document:win.document,navigator:win.navigator,localStorage:win.localStorage,location:win.location,devicePixelRatio:1,innerHeight:844,innerWidth:390,ResizeObserver:class{observe(){} disconnect(){}},requestAnimationFrame:()=>1,cancelAnimationFrame:noop,matchMedia:win.matchMedia.bind(win),Image:win.Image,setTimeout:win.setTimeout.bind(win),clearTimeout:win.clearTimeout.bind(win)};
 for(const [key,value]of Object.entries(globals)){originals.set(key,Object.getOwnPropertyDescriptor(globalThis,key));Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});}
 try{
  await import('../src/noor/experience.mjs?test='+Date.now());
  const doc=win.document,click=selector=>doc.querySelector(selector).click(),wait=()=>new Promise(resolve=>setTimeout(resolve,10));
  assert.equal(doc.querySelector('#palace').dataset.ready,'true');click('#enterPalace');await wait();assert.equal(doc.querySelector('#palace').dataset.chapter,'1');
  assert.equal(doc.querySelectorAll('.scene:not([hidden])').length,1);assert.equal(doc.querySelectorAll('.scene[hidden]:not([inert])').length,0);
  click('#previousChapter');assert.equal(doc.querySelector('#palace').dataset.chapter,'0');click('#enterPalace');assert.equal(doc.querySelector('#palace').dataset.chapter,'1');
  click('#chapterDots button:nth-child(4)');assert.equal(doc.querySelector('#palace').dataset.chapter,'3');click('#eventTab2');assert.match(doc.querySelector('#eventTitle').textContent,/Anand Karaj/);assert.equal(doc.querySelector('#eventTab2').tabIndex,0);assert.equal(doc.querySelector('#eventTab0').tabIndex,-1);
  click('#chapterDots button:nth-child(6)');doc.querySelector('#guestName').value='<svg onload=bad>';doc.querySelector('#blessingText').value='<script>bad</script> Love & light.';doc.querySelector('#blessingForm').dispatchEvent(new win.Event('submit',{bubbles:true,cancelable:true}));
  assert.equal(doc.querySelector('#savedBlessing').textContent,'<script>bad</script> Love & light.');assert.equal(doc.querySelector('#savedBlessing script'),null);assert.equal(doc.querySelector('#blessingForm').hidden,true);assert.equal(readBlessings(win.localStorage).length,1);
  click('#chapterDots button:nth-child(8)');click('#finalBloom');assert.ok(doc.querySelector('.finale').classList.contains('is-bloomed'));click('#replay');assert.equal(doc.querySelector('#palace').dataset.chapter,'0');assert.equal(doc.querySelector('#enterPalace').disabled,false);assert.equal(doc.querySelectorAll('.scene:not([hidden])').length,1);
 }finally{await win.happyDOM.abort();for(const[key,descriptor]of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}}
});
