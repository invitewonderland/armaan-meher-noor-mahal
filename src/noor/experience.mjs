import {PalaceRealm} from './realm.mjs';
import {NoorSound} from './sound.mjs';
import {Phulkari} from './weave.mjs';
import {chapters,portraits,events,calendarFor,cleanBlessing,readBlessings,storageKey} from './story.mjs';

const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const palace=$('#palace'),scenes=$$('.scene'),motion=matchMedia('(prefers-reduced-motion: reduce)');
let current=0,entered=false,opening=false,transitioning=false,pending=null,transitionTimer=0,entryTimer=0,toastTimer=0,portraitIndex=0,portraitEpoch=0,eventIndex=0,fieldTimer=0,soundChoice=null,keepsakeBlob=null,keepsakeURL=null;
let storage;try{storage=localStorage;}catch{storage=null;}
let blessings=readBlessings(storage);
const realm=new PalaceRealm($('#realm'),motion),weave=new Phulkari($('#weaveCanvas'),motion);
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('is-visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('is-visible'),3500);}
const sound=new NoorSound($('#soundtrack'),(enabled,message)=>{const toggle=$('#soundToggle');toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('aria-label',enabled?'Turn sound off':'Turn sound on');$('.sound-label').textContent=enabled?'SOUND ON':'SOUND OFF';if(message)toast(message);});
$('#soundToggle').addEventListener('click',()=>{sound.toggle();if(!sound.enabled)stopRhythm();soundChoice=sound.enabled;});
$('#soundtrack').addEventListener('error',()=>{if(sound.enabled)toast('The score is resting. Your dhol still has a heartbeat.');});

function viewport(){const h=window.visualViewport?.height||innerHeight;palace.style.setProperty('--view-height',`${Math.round(h)}px`);const writing=!!document.activeElement?.matches('input,textarea');palace.classList.toggle('keyboard-open',writing&&(innerHeight-h>110||h<520));}
window.visualViewport?.addEventListener('resize',viewport);window.addEventListener('resize',viewport,{passive:true});document.addEventListener('focusin',viewport);document.addEventListener('focusout',()=>setTimeout(viewport,180));viewport();
document.fonts?.ready.then(()=>{viewport();weave.resize();});

function closeMenu(returnFocus=false){const menu=$('#chapterMenu');if(menu.hidden)return;menu.hidden=true;menu.inert=true;$('#chapterMenuButton').setAttribute('aria-expanded','false');if(returnFocus)$('#chapterMenuButton').focus();}
$('#chapterMenuButton').addEventListener('click',()=>{const menu=$('#chapterMenu');if(menu.hidden){menu.hidden=false;menu.inert=false;$('#chapterMenuButton').setAttribute('aria-expanded','true');}else closeMenu();});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#chapterMenu,#chapterMenuButton'))closeMenu();});

chapters.forEach((label,index)=>{
 const button=document.createElement('button');button.type='button';button.setAttribute('aria-label',`${String(index+1).padStart(2,'0')}: ${label}`);if(!index)button.setAttribute('aria-current','step');button.addEventListener('click',()=>go(index));$('#chapterDots').append(button);
 const item=document.createElement('button');item.type='button';const number=document.createElement('small');number.textContent=String(index+1).padStart(2,'0');item.append(number,document.createTextNode(label));item.addEventListener('click',()=>{closeMenu();go(index);});if(!index)item.setAttribute('aria-current','step');$('#chapterMenuItems').append(item);
});
function updateFurniture(){
 palace.dataset.chapter=String(current);palace.classList.toggle('is-dark',[3,4,7].includes(current));$('#chapterNumber').textContent=String(current+1).padStart(2,'0');$('#chapterName').textContent=chapters[current].toUpperCase();$('#previousChapter').disabled=current===0;
 $('#nextLabel').textContent=current===7?'FEEL IT AGAIN':current===0?'BEGIN THE STORY':chapters[current+1].toUpperCase();$('#nextChapter').setAttribute('aria-label',current===7?'Begin the story again':current===0?'Enter our world':`Next: ${chapters[current+1]}`);
 $$('#chapterDots button,#chapterMenuItems button').forEach((b,index)=>{if(index%8===current)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});
 document.querySelector('meta[name=theme-color]').content=[3,4,7].includes(current)?current===4?'#261d29':'#103c35':'#f4efdf';
}
function leaveScene(index){
 if(index===4)stopRhythm();if(index===5)weave.setActive(false);if(index===2){clearTimeout(fieldTimer);$('#fieldPetals').replaceChildren();}
 scenes[index].classList.remove('entering');scenes[index].getAnimations?.({subtree:true}).forEach(a=>{if(a.effect?.target?.classList?.contains('is-hit'))a.cancel();});
}
function showScene(index){
 leaveScene(current);scenes[current].hidden=true;scenes[current].inert=true;scenes[current].classList.remove('is-active');current=index;
 scenes[current].hidden=false;scenes[current].inert=false;scenes[current].classList.add('is-active','entering');updateFurniture();realm.setChapter(current);if(current===5){weave.setActive(true);if(blessings.length)weave.bloom(blessings.length);}
 if(current===7&&scenes[7].classList.contains('is-bloomed'))realm.bloom();
 $('#announcement').textContent=`Chapter ${current+1} of eight. ${chapters[current]}.`;scenes[current].focus({preventScroll:true});
}
function perform(index){
 if(index===current){pending=null;return;}pending=null;transitioning=true;palace.dataset.transitioning='true';closeMenu();
 if(motion.matches){showScene(index);transitioning=false;palace.dataset.transitioning='false';return;}
 const thread=$('#transitionThread');thread.classList.add('is-moving');
 transitionTimer=setTimeout(()=>{showScene(index);sound.chime();transitionTimer=setTimeout(()=>{thread.classList.remove('is-moving');transitioning=false;palace.dataset.transitioning='false';if(pending!==null&&pending!==current)perform(pending);else pending=null;},850);},390);
}
function enter(){
 if(entered||opening)return;entered=true;opening=true;palace.classList.add('opening');$('#enterPalace').disabled=true;
 if(soundChoice!==false)sound.enable(true);sound.chime();realm.pulse(1.5);
 entryTimer=setTimeout(()=>{opening=false;palace.classList.remove('opening');$('#enterPalace').disabled=false;const destination=pending??1;pending=null;if(destination===0){showScene(0);return;}if(motion.matches)showScene(destination);else perform(destination);},motion.matches?0:1400);
}
function go(index){index=Math.max(0,Math.min(7,index));if(!entered&&index!==0){pending=index;enter();return;}if(opening||transitioning){pending=index;return;}perform(index);}
$('#enterPalace').addEventListener('click',()=>{if(entered)go(1);else enter();});$('#previousChapter').addEventListener('click',()=>go((pending??current)-1));$('#nextChapter').addEventListener('click',()=>{if(current===7&&!transitioning)replay();else if(!entered)enter();else go((pending??current)+1);});

portraits.forEach((portrait,index)=>{const button=document.createElement('button');button.type='button';button.className='portrait-thumb';button.setAttribute('aria-label',`Portrait ${index+1}: ${portrait.title}`);button.setAttribute('aria-pressed',String(index===0));const img=document.createElement('img');img.src=`assets/noor/${portrait.file}-thumb.webp`;img.alt='';img.width=48;img.height=53;img.loading='lazy';button.append(img);button.addEventListener('click',()=>choosePortrait(index));$('#portraitRail').append(button);});
async function choosePortrait(index){
 if(index===portraitIndex)return;portraitIndex=index;const epoch=++portraitEpoch,portrait=portraits[index];const img=new Image();img.src=`assets/noor/${portrait.file}.webp`;
 $$('.portrait-thumb').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));$('#portraitNumber').textContent=String(index+1).padStart(2,'0');
 try{await img.decode();}catch{if(epoch===portraitEpoch){toast('That memory is taking a moment to arrive. Try it once more.');portraitIndex=-1;}return;}
 if(epoch!==portraitEpoch)return;const target=$('#salonImage');target.src=img.src;target.alt=portrait.alt;$('#portraitTitle').textContent=portrait.title;
 if(!motion.matches){target.getAnimations().forEach(a=>a.cancel());target.animate([{opacity:.2,transform:'scale(1.025)'},{opacity:1,transform:'scale(1)'}],{duration:750,easing:'ease-out'});}realm.pulse(.4);sound.chime();
}
let pointerFrame=0;$('#portraitFrame').addEventListener('pointermove',e=>{if(motion.matches||e.pointerType==='touch'||pointerFrame)return;pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;const r=$('#portraitFrame').getBoundingClientRect();$('#portraitFrame').style.transform=`perspective(1000px) rotate(3deg) rotateY(${((e.clientX-r.left)/r.width-.5)*5}deg) rotateX(${(.5-(e.clientY-r.top)/r.height)*4}deg)`;});});$('#portraitFrame').addEventListener('pointerleave',()=>{$('#portraitFrame').style.transform='';});

function fieldBloom(){
 realm.pulse(1.8);sound.chime('bloom');if(motion.matches){toast('A little more sunshine, just for you.');return;}clearTimeout(fieldTimer);$('#fieldPetals').replaceChildren();
 for(let i=0;i<64;i++){const p=document.createElement('i');const rnd=n=>{const x=Math.sin(i*73.71+n*61.19)*43654.34;return x-Math.floor(x)};p.style.cssText=`--x:${rnd(1)*100}%;--size:${6+rnd(2)*13}px;--drift:${rnd(3)*300-150}px;--spin:${rnd(4)*1000-500}deg;--duration:${3+rnd(5)*3}s;--delay:${rnd(6)*.9}s`;$('#fieldPetals').append(p);}
 fieldTimer=setTimeout(()=>$('#fieldPetals').replaceChildren(),7100);
}
$('#bloomField').addEventListener('click',fieldBloom);

function selectEvent(index,focus=false){
 eventIndex=index;const event=events[index];$('#eventTitle').replaceChildren(document.createTextNode('The '));const em=document.createElement('em');em.textContent=event.name+'.';$('#eventTitle').append(em);$('#eventNumeral').textContent=String(index+1).padStart(2,'0');$('#eventKicker').textContent=event.kicker;$('#eventLine').replaceChildren();event.line.split('\n').forEach((line,i)=>{if(i)$('#eventLine').append(document.createElement('br'));$('#eventLine').append(document.createTextNode(line));});
 const image=$('#eventImage');image.src=`assets/noor/${event.image}.webp`;image.alt=portraits.find(p=>p.file===event.image)?.alt||event.name;
 $('#eventLine').querySelectorAll('br').forEach(br=>br.after(document.createTextNode(' ')));$('#eventDateLabel').textContent=`${event.short} · ${event.venue.toUpperCase()}`;$('#eventPanel').textContent=`${event.name}. ${event.date} at ${event.time}. ${event.venue}, Noor Mahal, Patiala.`;$('#eventPanel').setAttribute('aria-labelledby',`eventTab${index}`);
 $$('[data-event]').forEach((b,i)=>{b.setAttribute('aria-selected',String(i===index));b.tabIndex=i===index?0:-1;});if(focus)$(`#eventTab${index}`).focus();
 if(!motion.matches){image.getAnimations().forEach(a=>a.cancel());image.animate([{opacity:.4},{opacity:1}],{duration:650});}realm.pulse(.4);sound.chime();
}
$$('[data-event]').forEach(button=>{button.addEventListener('click',()=>selectEvent(+button.dataset.event));button.addEventListener('keydown',e=>{let index=eventIndex;if(e.key==='ArrowRight')index=(eventIndex+1)%4;else if(e.key==='ArrowLeft')index=(eventIndex+3)%4;else if(e.key==='Home')index=0;else if(e.key==='End')index=3;else return;e.preventDefault();e.stopPropagation();selectEvent(index,true);});});
$('#eventDetailsButton').addEventListener('click',()=>{const event=events[eventIndex];$('#dialogEventTitle').textContent=`The ${event.name}`;$('#dialogEventLine').textContent=event.line.replace('\n',' ');$('#dialogEventDate').textContent=`${event.date} · ${event.time} IST`;$('#dialogEventPlace').textContent=`${event.venue} · Noor Mahal, Patiala`;$('#dialogEventDress').textContent=event.dress;$('#eventDialog').showModal();});
function downloadBlob(blob,filename){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
$('#addToCalendar').addEventListener('click',()=>{downloadBlob(new Blob([calendarFor(events[eventIndex])],{type:'text/calendar;charset=utf-8'}),`Armaan-Meher-${events[eventIndex].name.replaceAll(' ','-')}.ics`);});
$$('[data-close-dialog]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}}));

function hitDrum(index,play=true){if(play){if(!sound.enabled){sound.enable(true);soundChoice=true;}sound.drum(index);}const button=$(`[data-drum="${index}"]`);button.classList.remove('is-hit');requestAnimationFrame(()=>button.classList.add('is-hit'));clearTimeout(button._hitTimer);button._hitTimer=setTimeout(()=>button.classList.remove('is-hit'),180);realm.pulse(.55);if(!motion.matches){const drum=$('.dhol');drum.getAnimations().filter(a=>a.id==='drum-hit').forEach(a=>a.cancel());const animation=drum.animate([{transform:'translateY(0) rotate(0) scale(1)'},{transform:`translateY(-4px) rotate(${index%2?1.5:-1.5}deg) scale(1.025)`},{transform:'translateY(0) rotate(0) scale(1)'}],{duration:240,easing:'ease-out'});animation.id='drum-hit';}}
$$('[data-drum]').forEach(button=>button.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();hitDrum(+button.dataset.drum);}));$$('[data-drum]').forEach(button=>button.addEventListener('click',e=>{if(e.detail===0)hitDrum(+button.dataset.drum);}));
function stopRhythm(){sound.stopRhythm();$('#playRhythm').setAttribute('aria-pressed','false');$('#playRhythm').replaceChildren();const icon=document.createElement('span');icon.className='play-icon';icon.setAttribute('aria-hidden','true');icon.textContent='▷';$('#playRhythm').append(icon,document.createTextNode('Play the celebration'));}
$('#playRhythm').addEventListener('click',()=>{if(sound.playing){stopRhythm();return;}sound.startRhythm(index=>hitDrum(index,false),stopRhythm);if(sound.playing){$('#playRhythm').setAttribute('aria-pressed','true');$('#playRhythm').textContent='Ⅱ  Pause the celebration';}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopRhythm();});

function displayBlessing(blessing,persisted=true){$('#blessingForm').hidden=true;$('#blessingResult').hidden=false;$('#savedBlessing').textContent=blessing.text;$('#savedGuest').textContent=blessing.name?`With love, ${blessing.name}`:'With all my love';$('#blessingResult>small').textContent=persisted?'Saved on this device.':'Kept for this visit. Browser storage is unavailable.';}
if(blessings.length)displayBlessing(blessings.at(-1));
$('#blessingForm').addEventListener('submit',e=>{e.preventDefault();const blessing=cleanBlessing($('#guestName').value,$('#blessingText').value);if(!blessing.text){$('#blessingText').setCustomValidity('Add a few words of love first.');$('#blessingText').reportValidity();return;}$('#blessingText').setCustomValidity('');blessings=[...blessings,blessing].slice(-8);let persisted=false;try{storage?.setItem(storageKey,JSON.stringify(blessings));persisted=!!storage;}catch{}displayBlessing(blessing,persisted);document.activeElement?.blur();viewport();weave.bloom(blessings.length);realm.pulse(1.5);sound.chime('bloom');$('#announcement').textContent='Your blessing has been woven into the tapestry.';});
$('#blessingText').addEventListener('input',()=>$('#blessingText').setCustomValidity(''));$('#anotherBlessing').addEventListener('click',()=>{$('#blessingResult').hidden=true;$('#blessingForm').hidden=false;$('#blessingText').value='';$('#blessingText').focus();});
const clearBlessings=document.createElement('button');clearBlessings.type='button';clearBlessings.className='clear-blessings';clearBlessings.textContent='Clear my saved blessings';clearBlessings.addEventListener('click',()=>{blessings=[];try{storage?.removeItem(storageKey);}catch{}$('#blessingResult').hidden=true;$('#blessingForm').hidden=false;$('#blessingText').value='';$('#guestName').value='';weave.lights=0;weave.progress=0;weave.draw();toast('Your threads have been gently unwoven.');});$('#blessingResult').append(clearBlessings);

async function makeKeepsake(){
 const button=$('#saveKeepsake');if(button.disabled)return;button.disabled=true;
 try{const image=new Image();image.src='assets/noor/together.webp';await image.decode();await document.fonts?.ready;const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1600;const c=canvas.getContext('2d');c.fillStyle='#f5efdf';c.fillRect(0,0,1200,1600);c.strokeStyle='#a98448';c.lineWidth=2;c.strokeRect(35,35,1130,1530);c.strokeStyle='#b7995c66';c.lineWidth=1;c.strokeRect(45,45,1110,1510);c.fillStyle='#254a3d';c.textAlign='center';c.font='500 16px Manrope, Arial';c.letterSpacing='5px';c.fillText('NOOR MAHAL · THE WEDDING OF',600,94);c.letterSpacing='0px';
  const box={x:85,y:130,w:1030,h:1120},scale=Math.min(box.w/image.width,box.h/image.height),w=image.width*scale,h=image.height*scale;c.drawImage(image,box.x+(box.w-w)/2,box.y+(box.h-h)/2,w,h);c.strokeStyle='#a98448';c.strokeRect(box.x-8,box.y-8,box.w+16,box.h+16);
  c.font='500 78px "Cormorant Garamond", Georgia';c.fillText('Armaan & Meher',600,1360);c.fillStyle='#9b773f';c.font='500 16px Manrope, Arial';c.letterSpacing='4px';c.fillText('20 DECEMBER 2026 · PATIALA',600,1410);c.letterSpacing='0px';c.fillStyle='#577060';c.font='italic 30px "Cormorant Garamond", Georgia';c.fillText('You are part of our forever.',600,1466);c.fillStyle='#9b773f';c.font='12px Manrope, Arial';c.letterSpacing='2px';c.fillText('AN INVITE WONDERLAND ORIGINAL',600,1521);
  keepsakeBlob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.96));if(!keepsakeBlob)throw new Error('image');if(keepsakeURL)URL.revokeObjectURL(keepsakeURL);keepsakeURL=URL.createObjectURL(keepsakeBlob);$('#keepsakeImage').src=keepsakeURL;await $('#keepsakeImage').decode();$('#keepsakeDialog').showModal();sound.chime();
 }catch{toast('Your keepsake needs a moment. Please try once more.');}finally{button.disabled=false;}
}
$('#saveKeepsake').addEventListener('click',makeKeepsake);$('#downloadKeepsake').addEventListener('click',()=>{if(keepsakeBlob)downloadBlob(keepsakeBlob,'Armaan-Meher-Noor-Mahal.jpg');});

$('#finalBloom').addEventListener('click',()=>{scenes[7].classList.add('is-bloomed');realm.bloom();sound.chime('bloom');$('#finalBloom').replaceChildren();const flower=document.createElement('span');flower.setAttribute('aria-hidden','true');flower.textContent='✳';$('#finalBloom').append(flower,document.createTextNode('And love became everything.'));$('#announcement').textContent='A garden of golden petals blooms around Armaan and Meher.';});
$('#shareInvitation').addEventListener('click',async()=>{if(['localhost','127.0.0.1'].includes(location.hostname)){toast('The wonder is ready. Give it a live link to share with your guests.');return;}const data={title:'Armaan & Meher — Noor Mahal',text:'You are part of our forever. 18–20 December 2026 · Patiala.',url:location.href.split('#')[0]};try{if(navigator.share)await navigator.share(data);else{await navigator.clipboard.writeText(data.url);toast('A little wonder, copied. Share it with someone you love.');}}catch(e){if(e.name!=='AbortError')toast('Copy the invitation link from your browser to share the wonder.');}});
function replay(){clearTimeout(entryTimer);clearTimeout(transitionTimer);opening=false;transitioning=false;pending=null;entered=false;palace.classList.remove('opening');$('#transitionThread').classList.remove('is-moving');palace.dataset.transitioning='false';$('#enterPalace').disabled=false;sound.reset();sound.enable(false);soundChoice=null;scenes[7].classList.remove('is-bloomed');$('#finalBloom').replaceChildren();const flower=document.createElement('span');flower.setAttribute('aria-hidden','true');flower.textContent='✳';$('#finalBloom').append(flower,document.createTextNode('Let love bloom'));showScene(0);}
$('#replay').addEventListener('click',replay);
$('#fullscreenButton').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen({navigationUI:'hide'});else toast('Your invitation already fills the space your browser gives it.');}catch{toast('Your browser is keeping its own frame. The wonder continues.');}});document.addEventListener('fullscreenchange',()=>$('#fullscreenButton').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen'));

document.addEventListener('keydown',e=>{
 if(e.key==='Escape'){closeMenu(true);return;}if(e.altKey||e.metaKey||e.ctrlKey||e.target.closest('input,textarea,dialog,[role=tablist]')||$$('dialog').some(d=>d.open)||!$('#chapterMenu').hidden)return;
 if(current===4&&!e.repeat){const key=['a','s','d','f'].indexOf(e.key.toLowerCase());if(key!==-1){e.preventDefault();hitDrum(key);return;}}
 if(e.key==='ArrowRight'){e.preventDefault();if(!entered)enter();else if(current===7)replay();else go((pending??current)+1);}else if(e.key==='ArrowLeft'){e.preventDefault();go((pending??current)-1);}
});
let swipe=null;$('#stage').addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'||e.target.closest('button,a,input,textarea,dialog,#weaveCanvas'))return;swipe={x:e.clientX,y:e.clientY,id:e.pointerId};},{passive:true});$('#stage').addEventListener('pointerup',e=>{if(!swipe||e.pointerId!==swipe.id)return;const dx=e.clientX-swipe.x,dy=e.clientY-swipe.y;swipe=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.6){if(dx<0){if(!entered)enter();else if(current<7)go(current+1);}else go(current-1);}},{passive:true});$('#stage').addEventListener('pointercancel',()=>{swipe=null;},{passive:true});
updateFurniture();palace.dataset.ready='true';
