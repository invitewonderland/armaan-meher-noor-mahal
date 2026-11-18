// The same embroidered lettering layout is used on the live cloth and its keepsake.
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const isPunjabi=text=>/[\u0a00-\u0a7f]/i.test(text);
const segmenter=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}):null;
export function embroideryFont(size,text,italic=true){return `${italic&&!isPunjabi(text)?'italic ':''}500 ${size}px ${isPunjabi(text)?'"Noto Serif Gurmukhi", "Nirmala UI",':'"Fraunces",'} Georgia, serif`;}
export function graphemes(text){return segmenter?[...segmenter.segment(text)].map(v=>v.segment):Array.from(text);}

function wrap(ctx,text,width){
 const lines=[];let line='';
 for(const word of String(text).trim().split(/\s+/)){
  const next=line?line+' '+word:word;
  if(ctx.measureText(next).width<=width){line=next;continue;}
  if(line)lines.push(line);line='';
  for(const part of graphemes(word)){if(line&&ctx.measureText(line+part).width>width){lines.push(line);line='';}line+=part;}
 }
 if(line)lines.push(line);return lines;
}

export function layoutWovenMessage(ctx,blessing,w,h=null){
 const text=String(blessing?.text||'').trim();if(!text||w<40)return null;
 const count=graphemes(text).length,maxWidth=w*.78;
 let preferred=Math.max(18,w*(count<=30?.116:count<=100?.093:.077));
 // Keep a short unbroken note together when a small size adjustment is enough.
 if(count<=22&&!/\s/.test(text)){ctx.font=embroideryFont(preferred,text);const natural=ctx.measureText(text).width;preferred=Math.max(Math.min(preferred,Math.max(22,w*.07)),Math.min(preferred,preferred*maxWidth/Math.max(1,natural)*.99));}
 const author=blessing.name?`With love, ${blessing.name}`:'With all my love',authorSize=Math.max(12,w*.045),outer=w*.06,inner=w*.055;
 const measure=size=>{
  ctx.font=embroideryFont(size,text);const lines=wrap(ctx,text,maxWidth),metrics=lines.map(v=>ctx.measureText(v));
  const ascent=Math.max(size*.9,...metrics.map(m=>m.actualBoundingBoxAscent||size*.95)),descent=Math.max(size*.2,...metrics.map(m=>m.actualBoundingBoxDescent||size*.24)),lineHeight=Math.max(size*(isPunjabi(text)?1.58:1.34),ascent+descent+size*.22);
  ctx.font=embroideryFont(authorSize,author,false);const authorLines=wrap(ctx,author,maxWidth),authorHeight=authorSize*1.5;
  const gap=size*.48,contentHeight=lines.length*lineHeight+gap+authorLines.length*authorHeight;
  return {lines,lineHeight,ascent,descent,authorLines,authorHeight,gap,contentHeight};
 };
 const preferredLayout=measure(preferred),minimumHeight=Math.ceil(preferredLayout.contentHeight+2*(outer+inner));
 let fontSize=preferred,block=preferredLayout;
 const minSize=17;
 if(h!==null){while(fontSize>minSize&&block.contentHeight+2*(outer+inner)>h){fontSize=Math.max(minSize,fontSize-.5);block=measure(fontSize);}}
 const height=h??minimumHeight,panelHeight=block.contentHeight+inner*2,panelY=Math.max(outer,(height-panelHeight)/2),top=panelY+inner;
 let y=top;const lines=[];
 for(const textLine of block.lines){ctx.font=embroideryFont(fontSize,text);const width=ctx.measureText(textLine).width;lines.push({text:textLine,font:ctx.font,fontSize,x:(w-width)/2,y:y+block.ascent+fontSize*.05,width,height:block.lineHeight,ascent:block.ascent,descent:block.descent,author:false});y+=block.lineHeight;}
 y+=block.gap;
 for(const textLine of block.authorLines){ctx.font=embroideryFont(authorSize,author,false);const width=ctx.measureText(textLine).width;lines.push({text:textLine,font:ctx.font,fontSize:authorSize,x:(w-width)/2,y:y+authorSize,width,height:block.authorHeight,ascent:authorSize,descent:authorSize*.3,author:true});y+=block.authorHeight;}
 for(const line of lines)line.units=graphemes(line.text).length;
 return {fontSize,maxWidth,minimumHeight,lines,totalUnits:lines.reduce((n,l)=>n+l.units,0),panel:{x:w*.065,y:panelY,width:w*.87,height:panelHeight},text};
}

export function paintSilkCartouche(ctx,layout,w){
 if(!layout)return;const p=layout.panel;
 ctx.save();const silk=ctx.createLinearGradient(p.x,p.y,p.x+p.width,p.y+p.height);
 silk.addColorStop(0,'#522137f5');silk.addColorStop(.45,'#69263df7');silk.addColorStop(1,'#492033f7');ctx.fillStyle=silk;ctx.fillRect(p.x,p.y,p.width,p.height);
 // The panel is made of the same silk, enclosed by a fine running stitch.
 ctx.strokeStyle='#d8b57999';ctx.lineWidth=Math.max(.6,w*.002);ctx.setLineDash([Math.max(2,w*.01),Math.max(1.5,w*.006)]);ctx.strokeRect(p.x+3,p.y+3,p.width-6,p.height-6);ctx.setLineDash([]);
 ctx.strokeStyle='#ebcd9359';ctx.lineWidth=Math.max(.4,w*.0013);ctx.strokeRect(p.x+6,p.y+6,p.width-12,p.height-12);
 const r=Math.max(4,w*.018);ctx.strokeStyle='#f0d39a';
 for(const [x,y,sx,sy] of [[p.x,p.y,1,1],[p.x+p.width,p.y,-1,1],[p.x,p.y+p.height,1,-1],[p.x+p.width,p.y+p.height,-1,-1]]){ctx.beginPath();ctx.moveTo(x+sx*r*2,y+sy*r);ctx.lineTo(x+sx*r,y+sy*r);ctx.lineTo(x+sx*r,y+sy*r*2);ctx.stroke();}
 ctx.restore();
}

export function createWovenWords(layout,w,h,dpr=1){
 if(!layout)return null;const canvas=document.createElement('canvas');canvas.width=Math.ceil(w*dpr);canvas.height=Math.ceil(h*dpr);const c=canvas.getContext('2d');if(!c)return null;c.setTransform(dpr,0,0,dpr,0,0);
 c.textAlign='left';c.textBaseline='alphabetic';c.lineJoin='round';
 for(const line of layout.lines){
  c.font=line.font;c.lineWidth=Math.max(.75,line.fontSize*.035);c.strokeStyle='#290e24';c.shadowColor='#200c20aa';c.shadowOffsetY=Math.max(.7,line.fontSize*.035);c.shadowBlur=Math.max(1,line.fontSize*.045);c.strokeText(line.text,line.x,line.y);
  c.shadowBlur=0;c.shadowOffsetY=0;const thread=c.createLinearGradient(0,line.y-line.fontSize,0,line.y+line.fontSize*.22);thread.addColorStop(0,'#fff4cd');thread.addColorStop(.45,'#f8dca3');thread.addColorStop(.72,'#dfb977');thread.addColorStop(1,'#fff1c3');c.fillStyle=thread;c.fillText(line.text,line.x,line.y);
 }
 // Cached satin-thread highlights follow the letter silhouettes, including joined scripts.
 c.globalCompositeOperation='source-atop';c.lineWidth=Math.max(.45,w*.0015);
 const spacing=Math.max(1.7,w*.006);
 for(let y=0;y<h;y+=spacing){c.strokeStyle='#fff4d34d';c.beginPath();c.moveTo(0,y);c.lineTo(w,y-w*.12);c.stroke();c.strokeStyle='#70462a26';c.beginPath();c.moveTo(0,y+spacing*.45);c.lineTo(w,y-w*.12+spacing*.45);c.stroke();}
 c.globalCompositeOperation='source-over';return canvas;
}

export function drawWovenWords(c,layer,layout,w,h,progress){
 if(!layer||!layout)return;
 const p=clamp((progress-.10)/.85,0,1);
 if(p>=1){c.drawImage(layer,0,0,w,h);return;}
 c.save();c.globalAlpha=.055;c.drawImage(layer,0,0,w,h);c.restore();
 const total=layout.totalUnits;let passed=0;
 for(const line of layout.lines){
  const length=line.units,t=clamp((p*total-passed)/Math.max(1,length),0,1);passed+=length;if(!t)continue;
  const front=line.x+line.width*t;c.save();c.beginPath();c.rect(line.x-3,line.y-line.ascent-2,Math.max(0,line.width*t+4),line.ascent+line.descent+4);c.clip();c.drawImage(layer,0,0,w,h);c.restore();
  if(t<1){
   c.save();c.strokeStyle='#f9d698a6';c.lineWidth=Math.max(.6,w*.002);c.shadowBlur=7;c.shadowColor='#ffd27f';c.beginPath();c.moveTo(line.x-3,line.y+4);c.quadraticCurveTo((line.x+front)/2,line.y+9+Math.sin(progress*24)*3,front,line.y+2);c.stroke();
   c.fillStyle='#fff1c2';c.beginPath();c.ellipse(front,line.y-line.fontSize*.3,Math.max(1,w*.004),Math.max(2,line.fontSize*.16),.5,0,Math.PI*2);c.fill();c.shadowBlur=0;c.restore();
  }
 }
}
