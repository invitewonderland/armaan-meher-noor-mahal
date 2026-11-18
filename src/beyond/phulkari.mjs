import {seedFromWords,randomFor} from './story.mjs';

export function wrapCanvasText(ctx,text,maxWidth){const lines=[];let line='';for(const word of String(text).split(/\s+/)){const candidate=line?line+' '+word:word;if(ctx.measureText(candidate).width<=maxWidth){line=candidate;continue;}if(line)lines.push(line);line='';for(const char of word){if(ctx.measureText(line+char).width>maxWidth&&line){lines.push(line);line='';}line+=char;}}if(line)lines.push(line);return lines;}

export class LivingPhulkari{
 constructor(canvas,motion){
  this.canvas=canvas;this.ctx=canvas.getContext('2d');this.motion=motion;this.seed=seedFromWords('Armaan Meher 2026');this.active=false;this.complete=false;this.progress=1;this.frame=0;this.hover=-1;this.paths=[];
  new ResizeObserver(()=>this.resize()).observe(canvas);
  canvas.addEventListener('pointermove',e=>{if(!this.active||this.frame||motion.matches)return;const r=canvas.getBoundingClientRect();this.hover=(e.clientX-r.left)/r.width;this.draw();},{passive:true});
  canvas.addEventListener('pointerleave',()=>{this.hover=-1;if(this.active&&!this.frame)this.draw();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;this.progress=1;}else if(this.active)this.draw();});
 }
 setActive(active){this.active=active;if(active)this.resize();else{cancelAnimationFrame(this.frame);this.frame=0;this.progress=1;this.canvas.dataset.weaving='false';}}
 resize(){
  if(!this.ctx)return;const r=this.canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  this.w=r.width;this.h=r.height;this.dpr=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.round(r.width*this.dpr);this.canvas.height=Math.round(r.height*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.paths=this.pattern(this.w,this.h);this.cache();this.draw();
 }
 pattern(w,h){
  if(w<=20||h<=20)return [];const paths=[],rnd=randomFor(this.seed),inset=Math.max(8,Math.min(w,h)*.055),iw=w-inset*2,ih=h-inset*2,cols=w/h>1.5?8:6,rows=Math.max(3,Math.min(9,Math.round(cols*h/w))),sx=iw/cols,sy=ih/rows;
  const palette=[['#f4d397','#dba96a','#efd2b5'],['#f3d899','#e2b67f','#d5d6ad'],['#f6d79d','#d9997a','#eed9b2']][Math.floor(rnd()*3)];
  const segment=(x1,y1,x2,y2,color,width=.7)=>{if(Math.min(x1,x2)<inset-1||Math.max(x1,x2)>w-inset+1||Math.min(y1,y2)<inset-1||Math.max(y1,y2)>h-inset+1)return;paths.push({x1,y1,x2,y2,color,width:width*Math.max(.8,Math.min(sx,sy)/40)});};
  const diamond=(x,y,rx,ry,color)=>{for(let i=0;i<=10;i++){const t=-1+i/5,edge=1-Math.abs(t);segment(x+rx*t,y-ry*edge,x+rx*t,y+ry*edge,color,.7);}};
  for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
   const x=inset+(col+.5)*sx,y=inset+(row+.5)*sy,breath=.93+rnd()*.1,rx=sx*.48*breath,ry=sy*.48*breath,c=palette[(col+row)%3];
   // Four darning-stitch petals interlock into an all-over bagh-inspired field.
   diamond(x-rx*.46,y,rx*.47,ry*.43,c);diamond(x+rx*.46,y,rx*.47,ry*.43,c);
   diamond(x,y-ry*.46,rx*.43,ry*.47,palette[0]);diamond(x,y+ry*.46,rx*.43,ry*.47,palette[0]);
   diamond(x,y,rx*.16,ry*.16,palette[1]);
   for(const dx of [-.5,.5])for(const dy of [-.5,.5])diamond(x+dx*sx,y+dy*sy,sx*.12,sy*.12,palette[1]);
   for(const sign of [-1,1]){segment(x-rx*.84,y+sign*ry*.84,x-rx*.55,y+sign*ry*.84,palette[2],.55);segment(x+rx*.55,y+sign*ry*.84,x+rx*.84,y+sign*ry*.84,palette[2],.55);}
  }
  // A luminous central medallion joins the field rather than leaving an empty island.
  const cx=w/2,cy=h/2,rx=iw*.18,ry=ih*.28;
  for(let ring=0;ring<3;ring++){const k=1-ring*.12;segment(cx,cy-ry*k,cx+rx*k,cy,palette[0],.9);segment(cx+rx*k,cy,cx,cy+ry*k,palette[0],.9);segment(cx,cy+ry*k,cx-rx*k,cy,palette[0],.9);segment(cx-rx*k,cy,cx,cy-ry*k,palette[0],.9);}
  diamond(cx,cy,rx*.24,ry*.24,'#fff0c1');
  // A shuttle traverses every row; no off-canvas stitches consume the reveal time.
  paths.sort((a,b)=>{const order=p=>{const y=(p.y1+p.y2)/2,x=(p.x1+p.x2)/2,row=Math.floor((y-inset)/sy);return y+sy*.07*(row%2?1-x/w:x/w);};return order(a)-order(b);});return paths;
 }
 paint(ctx,w,h,paths,progress=1){
  ctx.save();ctx.beginPath();ctx.rect(0,0,w,h);ctx.clip();const gradient=ctx.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#4a1f35');gradient.addColorStop(.42,'#752941');gradient.addColorStop(.7,'#61213b');gradient.addColorStop(1,'#3e1a30');ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h);
  ctx.lineWidth=.45;for(let y=.5;y<h;y+=3){ctx.strokeStyle='#ffdcb90b';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}for(let x=.5;x<w;x+=3){ctx.strokeStyle='#f8dfb209';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  const count=Math.floor(paths.length*progress);ctx.lineCap='butt';for(let i=0;i<paths.length;i++){const p=paths[i];ctx.globalAlpha=i<count?1:.075;ctx.strokeStyle=p.color;ctx.lineWidth=p.width*1.35;ctx.beginPath();ctx.moveTo(p.x1,p.y1);ctx.lineTo(p.x2,p.y2);ctx.stroke();}ctx.globalAlpha=1;
  ctx.strokeStyle='#e9c58588';ctx.lineWidth=.8;ctx.strokeRect(5,5,w-10,h-10);ctx.strokeRect(8,8,w-16,h-16);ctx.restore();
 }
 cache(){
  if(!this.w||!this.h)return;this.layers=[0,1].map(progress=>{const c=document.createElement('canvas');c.width=this.canvas.width;c.height=this.canvas.height;const context=c.getContext('2d');context.setTransform(this.dpr,0,0,this.dpr,0,0);this.paint(context,this.w,this.h,this.paths,progress);return c;});
 }
 draw(){
  if(!this.ctx||!this.w||!this.h||!this.layers)return;const c=this.ctx,w=this.w,h=this.h,p=this.progress;c.clearRect(0,0,w,h);c.drawImage(this.layers[p>=1?1:0],0,0,w,h);
  if(p<1){
   const front=-h*.09+p*h*1.18,amplitude=Math.sin(p*Math.PI)*h*.045,wave=x=>front+Math.sin(x/w*Math.PI*2-p*Math.PI*5)*amplitude;
   c.save();c.beginPath();c.moveTo(0,0);c.lineTo(w,0);for(let x=w;x>=0;x-=w/40)c.lineTo(x,wave(x));c.closePath();c.clip();c.drawImage(this.layers[1],0,0,w,h);c.restore();
   // One soft light front and a fine needle trail, composited over cached silk.
   const band=Math.max(12,h*.08),glow=c.createLinearGradient(0,front-band,0,front+band);glow.addColorStop(0,'#ffe6ae00');glow.addColorStop(.5,'#ffe6ae35');glow.addColorStop(1,'#ffe6ae00');c.fillStyle=glow;c.fillRect(0,front-band-amplitude,w,band*2+amplitude*2);
   c.save();c.strokeStyle='#ffe6ac';c.lineWidth=.9;c.shadowBlur=9;c.shadowColor='#efbb65';c.beginPath();for(let x=0;x<=w;x+=w/40){const y=wave(x);if(x===0)c.moveTo(x,y);else c.lineTo(x,y);}c.stroke();c.shadowBlur=0;
   for(let i=0;i<12;i++){const x=((p*1.7+i*.083)%1)*w,y=wave(x)+Math.sin(p*21+i*2)*band*.75;c.globalAlpha=Math.sin(p*Math.PI)*(.25+(i%3)*.15);c.fillStyle='#fff2c6';c.beginPath();c.arc(x,y,i%3===0?1.5:.8,0,Math.PI*2);c.fill();}c.restore();
  }
  if(this.hover>=0&&p>=1){const x=this.hover*w,g=c.createLinearGradient(x-60,0,x+60,0);g.addColorStop(0,'#ffe8b800');g.addColorStop(.5,'#ffe8b816');g.addColorStop(1,'#ffe8b800');c.fillStyle=g;c.fillRect(0,0,w,h);}
  this.canvas.dataset.weaving=p<1?'true':'false';this.canvas.dataset.weaveProgress=p.toFixed(3);
 }
 weave(blessing,animate=true){
  this.seed=seedFromWords(blessing.name+' · '+blessing.text);this.complete=true;this.paths=this.pattern(this.w||300,this.h||400);cancelAnimationFrame(this.frame);this.frame=0;this.cache();
  if(this.motion.matches||!animate||!this.active){this.progress=1;this.draw();return;}this.progress=0;this.hover=-1;const born=performance.now();const tick=now=>{this.frame=0;this.progress=Math.min(1,(now-born)/4800);this.draw();if(this.progress<1&&this.active&&!document.hidden)this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);
 }
 clear(){cancelAnimationFrame(this.frame);this.frame=0;this.seed=seedFromWords('Armaan Meher 2026');this.complete=false;this.progress=1;this.paths=this.pattern(this.w||300,this.h||400);this.cache();this.draw();}
 card(blessing){const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1600;const c=canvas.getContext('2d');c.fillStyle='#f8f0df';c.fillRect(0,0,1200,1600);c.strokeStyle='#ad8750';c.lineWidth=2;c.strokeRect(36,36,1128,1528);c.strokeStyle='#b18e5455';c.lineWidth=1;c.strokeRect(46,46,1108,1508);c.save();c.translate(88,90);this.paint(c,1024,870,this.pattern(1024,870),1);c.restore();c.fillStyle='#a57b3a';c.textAlign='center';c.font='500 14px "DM Sans", Arial';c.letterSpacing='3px';c.fillText('A PHULKARI OF BLESSINGS',600,1020);c.letterSpacing='0px';c.fillStyle='#264c3e';c.font='italic 42px "Fraunces", "Noto Serif Gurmukhi", Georgia';const lines=wrapCanvasText(c,blessing.text,960);let y=1100;for(const line of lines){c.fillText(line,600,y);y+=48;}c.font='26px "Fraunces", "Noto Serif Gurmukhi", Georgia';c.fillText(blessing.name?`With love, ${blessing.name}`:'With all my love',600,Math.max(1330,y+32));c.fillStyle='#9e793e';c.font='43px "Fraunces", "Noto Serif Gurmukhi", Georgia';c.fillText('Armaan & Meher',600,1450);c.font='11px "DM Sans", Arial';c.letterSpacing='2px';c.fillText('20 DECEMBER 2026 · AN INVITE WONDERLAND ORIGINAL',600,1516);return canvas;}
}
