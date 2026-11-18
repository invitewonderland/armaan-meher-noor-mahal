import * as THREE from 'three';

// One instanced sculpture; every petal travels between choreographed formations.
export class PalaceRealm {
 constructor(canvas,motion){
  this.canvas=canvas;this.motion=motion;this.chapter=0;this.flower=0;this.energy=0;this.time=0;this.frame=0;this.last=0;this.pointer={x:0,y:0};this.count=420;this.profiling=new URLSearchParams(location.search).has('profile');this.samples=[];
  this.seed=Array.from({length:this.count},(_,i)=>{const r=n=>{const x=Math.sin(i*127.1+n*311.7)*43758.5453;return x-Math.floor(x)};return {a:r(1)*Math.PI*2,r:r(2),z:r(3)*6-3,s:.055+r(4)*.12,speed:.12+r(5)*.25,offset:r(6)*10};});
  try{this.init();}catch{this.fallback();}
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas.parentElement);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(this.frame);this.frame=0;}else this.start();});
  motion.addEventListener('change',()=>{cancelAnimationFrame(this.frame);this.frame=0;this.start();});
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(this.frame);this.frame=0;this.lost=true;canvas.style.opacity='0';});
  canvas.addEventListener('webglcontextrestored',()=>{this.lost=false;canvas.style.opacity='';this.start();});
  this.start();
 }
 init(){
  this.renderer=new THREE.WebGLRenderer({canvas:this.canvas,alpha:true,antialias:true,powerPreference:'default'});
  this.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));this.renderer.setClearColor(0x000000,0);this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.25;
  this.scene=new THREE.Scene();this.camera=new THREE.PerspectiveCamera(38,1,.1,70);this.camera.position.z=27;
  this.scene.add(new THREE.HemisphereLight(0xffebc4,0x29372a,2.5));
  const key=new THREE.DirectionalLight(0xffedbb,4.5);key.position.set(-8,12,16);this.scene.add(key);
  const rim=new THREE.PointLight(0xffb875,30,45);rim.position.set(8,-3,12);this.scene.add(rim);
  const shape=new THREE.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-.8,.55,-.5,1.5,0,1.95);shape.bezierCurveTo(.7,1.1,.9,.45,0,0);
  const geometry=new THREE.ShapeGeometry(shape,8);geometry.translate(0,-.8,0);
  this.mesh=new THREE.InstancedMesh(geometry,new THREE.MeshStandardMaterial({color:0xe6c38b,metalness:.7,roughness:.3,side:THREE.DoubleSide,transparent:true,opacity:.4}),this.count);this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.mesh.frustumCulled=false;this.scene.add(this.mesh);
  this.dummy=new THREE.Object3D();this.targetVector=new THREE.Vector3();this.current=Array.from({length:this.count},()=>new THREE.Vector3());this.positioned=false;
  this.garden=new THREE.Group();this.garden.visible=false;this.scene.add(this.garden);this.gardenMaterials=[];
  for(let strand=0;strand<3;strand++){
   class FlowerCurve extends THREE.Curve{getPoint(u,target=new THREE.Vector3()){const a=u*Math.PI*2,r=6.15+2.55*Math.cos(a*6+strand*.16);return target.set(Math.cos(a)*r,Math.sin(a)*r,Math.sin(a*6+strand*.4)*1.3+strand*.18);}}
   const mat=new THREE.MeshBasicMaterial({color:strand===1?0xf4dfb0:0xc99a51,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false});
   this.gardenMaterials.push(mat);this.garden.add(new THREE.Mesh(new THREE.TubeGeometry(new FlowerCurve(),360,.018,5,true),mat));
  }
  this.gardenGlow=0;
  const count=700,positions=new Float32Array(count*3),sizes=new Float32Array(count);for(let i=0;i<count;i++){const s=this.seed[i%this.count];positions[i*3]=Math.sin(i*19.71)*18;positions[i*3+1]=Math.cos(i*37.14)*12;positions[i*3+2]=s.z-6;sizes[i]=.4+s.r;}
  const starGeometry=new THREE.BufferGeometry();starGeometry.setAttribute('position',new THREE.BufferAttribute(positions,3));starGeometry.setAttribute('aSize',new THREE.BufferAttribute(sizes,1));
  this.stars=new THREE.Points(starGeometry,new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,uniforms:{uTime:{value:0},uOpacity:{value:.15},uDpr:{value:Math.min(devicePixelRatio||1,2)}},vertexShader:'attribute float aSize;uniform float uTime;uniform float uDpr;varying float vLight;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;gl_PointSize=(1.4+1.8*aSize)*uDpr;vLight=.35+.65*pow(sin(uTime*.4+position.x*3.)*.5+.5,3.);}',fragmentShader:'uniform float uOpacity;varying float vLight;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,0.,d);gl_FragColor=vec4(1.,.83,.52,a*vLight*uOpacity);}'}));this.scene.add(this.stars);
  this.mesh.count=110;this.resize();this.canvas.dataset.renderer='webgl';
 }
 fallback(){
  // A failed GPU never affects the semantic invitation or its interactions.
  const replacement=document.createElement('canvas');replacement.id=this.canvas.id;replacement.setAttribute('aria-hidden','true');this.canvas.replaceWith(replacement);this.canvas=replacement;this.ctx=replacement.getContext('2d');this.renderer=null;this.resize();this.canvas.dataset.renderer='canvas';
 }
 resize(){const width=this.canvas.parentElement.clientWidth,height=this.canvas.parentElement.clientHeight;this.width=width;this.height=height;if(this.renderer){this.renderer.setSize(width,height,false);this.camera.aspect=width/Math.max(1,height);this.camera.updateProjectionMatrix();}else if(this.ctx){const d=Math.min(devicePixelRatio||1,2);this.canvas.width=width*d;this.canvas.height=height*d;this.ctx.setTransform(d,0,0,d,0,0);}if(this.motion.matches)this.render(.016);}
 setChapter(chapter){this.chapter=chapter;this.flower=0;this.energy=.45;this.gardenGlow=0;this.samples=[];delete this.canvas.dataset.profile;if(this.garden)this.garden.visible=chapter===7;if(this.mesh){this.mesh.count=chapter===7?420:110;this.mesh.material.opacity=[3,4,7].includes(chapter)?.75:.4;}if(this.stars)this.stars.material.uniforms.uOpacity.value=[0,1,2,5,6].includes(chapter)?.16:.75;this.start();}
 pulse(strength=1){this.energy=Math.min(2,this.energy+strength);this.start();}
 bloom(){this.flower=1;this.energy=2;this.start();}
 start(){if(this.frame||document.hidden||this.lost)return;this.last=performance.now();if(this.motion.matches){this.render(.016);return;}const tick=now=>{this.frame=0;const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.render(dt);if(!document.hidden&&!this.motion.matches&&!this.lost)this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);}
 target(i,t){const s=this.seed[i],a=s.a+t*s.speed*.2,r=7+s.r*5,aspect=this.width/Math.max(1,this.height);let x=Math.cos(a)*r,y=Math.sin(a)*r*.85,z=s.z;
  if(this.chapter===0||this.chapter===1||this.chapter===6){x=Math.cos(a)*r*aspect;y=Math.sin(a)*r*.9;}
  if(this.chapter===2){x=Math.sin(s.a+t*.12)*14*aspect;y=((s.r*24+t*(.3+s.speed))%24)-12;}
  if(this.chapter===3){x=Math.cos(a)*r*aspect;y=Math.sin(a)*r;}
  if(this.chapter===4){x=Math.cos(a)*(r+Math.sin(t*1.5+s.a)*this.energy*2)*aspect;y=Math.sin(a)*r*.7;}
  if(this.chapter===5){x=(s.r>.5?1:-1)*(6+s.r*5)*aspect;y=Math.sin(a)*10;}
  if(this.chapter===7){const f=this.flower,angle=s.a+t*.065,petalR=5.5+Math.pow(Math.abs(Math.cos(angle*6)),.7)*4+s.r*1.5;x=Math.cos(angle)*(r*(1-f)+petalR*f)*Math.max(.6,aspect);y=Math.sin(angle)*(r*(1-f)+petalR*f);z=s.z*(1-f*.5)+Math.sin(angle*6+t*.2)*f*2;}
  return [x+this.pointer.x*.1,y+this.pointer.y*.1,z];
 }
 render(dt){const started=this.profiling?performance.now():0;this.time+=dt;this.energy*=Math.exp(-dt*1.9);const t=this.time;if(this.renderer){for(let i=0;i<this.mesh.count;i++){const s=this.seed[i],target=this.target(i,t),p=this.current[i];this.targetVector.set(...target);p.lerp(this.targetVector,this.motion.matches||!this.positioned?1:Math.min(1,dt*1.8));this.dummy.position.copy(p);this.dummy.rotation.set(t*.2+s.a,Math.sin(t*.3+s.a),t*s.speed+s.a);const size=s.s*(1+this.energy*.35);this.dummy.scale.set(size,size,size);this.dummy.updateMatrix();this.mesh.setMatrixAt(i,this.dummy.matrix);}this.positioned=true;this.mesh.instanceMatrix.needsUpdate=true;this.stars.material.uniforms.uTime.value=t;
   if(this.garden.visible){this.gardenGlow+=(this.flower-this.gardenGlow)*(this.motion.matches?1:Math.min(1,dt*.9));this.garden.rotation.z=t*.022;this.garden.rotation.x=Math.sin(t*.1)*.16;this.garden.scale.x=Math.max(.6,this.width/Math.max(1,this.height));this.gardenMaterials.forEach((m,i)=>m.opacity=this.gardenGlow*(i===1?.65:.3));}
   this.renderer.render(this.scene,this.camera);}else if(this.ctx){const c=this.ctx;c.clearRect(0,0,this.width,this.height);for(let i=0;i<65;i++){const s=this.seed[i],x=(Math.sin(s.a+t*.03)*.48+.5)*this.width,y=((s.r+t*.014)%1)*this.height;c.save();c.translate(x,y);c.rotate(s.a+t*.1);c.fillStyle=`rgba(183,144,72,${.1+s.r*.25})`;c.beginPath();c.ellipse(0,0,2+s.r*2,1+s.r*4,0,0,Math.PI*2);c.fill();c.restore();}}
  if(this.profiling&&this.samples.length<240){this.samples.push(performance.now()-started);if(this.samples.length===240){const sorted=[...this.samples].sort((a,b)=>a-b);this.canvas.dataset.profile=JSON.stringify({chapter:this.chapter,renderer:this.canvas.dataset.renderer,samples:240,renderCpuMedianMs:sorted[120],renderCpuP95Ms:sorted[228],drawCalls:this.renderer?.info.render.calls,triangles:this.renderer?.info.render.triangles,width:this.width,height:this.height,pixelRatio:Math.min(devicePixelRatio||1,2)});}}
 }
}
