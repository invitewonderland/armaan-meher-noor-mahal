import * as T from 'three';

// Physical foreground, refracted light and responsive ceremonial sculptures.
// Everything shares the invitation's one renderer and one requestAnimationFrame.
export class PalaceCinema {
 constructor(world){
  this.world=world;this.touchAge=100;this.touch=new T.Vector2(.5,.2);this.root=new T.Group();world.scene.add(this.root);
  const gold=new T.MeshStandardMaterial({color:0xcaa560,metalness:.88,roughness:.24});
  const stone=new T.MeshPhysicalMaterial({color:0xf0dfbc,roughness:.38,metalness:.12,clearcoat:.35});
  this.columns=new T.InstancedMesh(new T.CylinderGeometry(.14,.2,1,18,1),stone,12);
  this.capitals=new T.InstancedMesh(new T.TorusGeometry(.22,.045,6,24),gold,24);
  this.lanterns=new T.InstancedMesh(new T.OctahedronGeometry(.16,0),new T.MeshPhysicalMaterial({color:0xffdc97,metalness:.35,roughness:.12,transparent:true,opacity:.8,emissive:0xb67a26,emissiveIntensity:.22}),12);
  this.chains=new T.InstancedMesh(new T.CylinderGeometry(.009,.009,1,4),gold,12);
  for(const mesh of [this.columns,this.capitals,this.lanterns,this.chains]){mesh.frustumCulled=false;this.root.add(mesh);}
  this.dummy=new T.Object3D();
  this.beams=new T.ShaderMaterial({uniforms:{uTime:{value:0},uEnergy:{value:0},uRoom:{value:0},uFlight:{value:0}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}',fragmentShader:`varying vec2 vUv;uniform float uTime,uEnergy,uRoom,uFlight;void main(){vec2 uv=vUv;float light=0.;for(int i=0;i<4;i++){float f=float(i);float x=.09+f*.29+sin(uTime*.065+f)*.02;float ray=exp(-pow((uv.x-x+(1.-uv.y)*.32)/(.028+f*.005),2.));light+=ray*pow(uv.y,.6)*(.04+uEnergy*.025);}float edge=pow(abs(uv.x-.5)*2.,5.);float fleck=pow(max(0.,sin(uv.x*110.+sin(uv.y*32.-uTime*.12)*2.)),12.)*pow(max(0.,sin(uv.y*73.+uTime*.09)),10.);float floorLight=(1.-smoothstep(.08,.35,uv.y))*.018;float caustic=pow(max(0.,sin(uv.x*42.+sin(uv.y*35.+uTime*.22)*1.2)),8.);light+=edge*fleck*.10+floorLight*caustic;float finale=step(5.5,uRoom);float orbit=exp(-pow((length((uv-vec2(.5,.52))*vec2(1.,.7))-(.38+sin(uTime*.08)*.012))/.012,2.));float curtain=pow(max(0.,sin(uv.x*12.+sin(uv.y*5.-uTime*.12)*.65)),6.)*edge;light+=finale*(orbit*(.018+uFlight*.04)+curtain*(.025+uFlight*.025));gl_FragColor=vec4(vec3(1.,.82,.48),light*mix(.7,1.2,step(2.5,uRoom)));}`,transparent:true,depthWrite:false,depthTest:false,blending:T.AdditiveBlending});
  this.lightPlane=new T.Mesh(new T.PlaneGeometry(2,2),this.beams);this.lightPlane.frustumCulled=false;this.lightPlane.renderOrder=-90;world.scene.add(this.lightPlane);
  this.stage=new T.Group();world.dhol.add(this.stage);this.stage.position.y=-2.05;
  const disc=new T.Mesh(new T.CylinderGeometry(2.75,2.9,.13,80),new T.MeshPhysicalMaterial({color:0x204e42,metalness:.7,roughness:.16,clearcoat:1}));this.stage.add(disc);
  this.rings=[];for(let i=0;i<3;i++){const ring=new T.Mesh(new T.TorusGeometry(2.3+i*.23,.017,5,96),new T.MeshBasicMaterial({color:0xeacb8a,transparent:true,opacity:.5}));ring.rotation.x=Math.PI/2;ring.position.y=.08+i*.012;this.stage.add(ring);this.rings.push(ring);}
  const spokes=new T.InstancedMesh(new T.BoxGeometry(.012,.014,.55),gold,32);for(let i=0;i<32;i++){const a=i/32*Math.PI*2;this.dummy.position.set(Math.cos(a)*2.3,.09,Math.sin(a)*2.3);this.dummy.rotation.set(0,-a+Math.PI/2,0);this.dummy.scale.setScalar(1);this.dummy.updateMatrix();spokes.setMatrixAt(i,this.dummy.matrix);}this.stage.add(spokes);
  const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(-.65,.4,-.85,1.6,0,2.1);shape.bezierCurveTo(.85,1.6,.65,.4,0,0);
  this.lotus=new T.InstancedMesh(new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelSize:.02,bevelThickness:.02,bevelSegments:2,steps:1,curveSegments:12}),new T.MeshPhysicalMaterial({color:0xc4a267,metalness:.84,roughness:.22,clearcoat:1,transparent:true,opacity:.23,side:T.DoubleSide}),16);this.lotus.frustumCulled=false;world.forever.add(this.lotus);
  this.halos=new T.InstancedMesh(new T.TorusGeometry(1,.006,3,120),new T.MeshBasicMaterial({color:0xe8c989,transparent:true,opacity:.48,depthWrite:false}),3);this.halos.frustumCulled=false;world.forever.add(this.halos);

  document.querySelector('#stage').addEventListener('pointerdown',e=>{if(e.target.closest('button,a,input,textarea'))return;const r=world.canvas.getBoundingClientRect();this.touch.set((e.clientX-r.left)/r.width,1-(e.clientY-r.top)/r.height);this.touchAge=0;world.canvas.dataset.ripples=String((Number(world.canvas.dataset.ripples)||0)+1);world.wake();},{passive:true});
 }
 resize(){const w=this.world,u=w.worldUnit(-1),span=w.width*u,high=w.height*u;for(let i=0;i<12;i++){const side=i%2?1:-1,depth=Math.floor(i/2),x=side*span*(.505+depth*.012),y=0,z=-1-depth*.45,h=high*.88;this.dummy.position.set(x,y,z);this.dummy.rotation.set(0,0,0);this.dummy.scale.set(1,h,1);this.dummy.updateMatrix();this.columns.setMatrixAt(i,this.dummy.matrix);for(let j=0;j<2;j++){this.dummy.position.set(x,(j?1:-1)*h*.46,z);this.dummy.scale.setScalar(1);this.dummy.rotation.x=Math.PI/2;this.dummy.updateMatrix();this.capitals.setMatrixAt(i*2+j,this.dummy.matrix);}this.dummy.rotation.set(0,0,0);this.dummy.position.set(x-side*.4,high*.32,z+.3);this.dummy.scale.set(1,high*.16,1);this.dummy.updateMatrix();this.chains.setMatrixAt(i,this.dummy.matrix);}for(const m of [this.columns,this.capitals,this.chains])m.instanceMatrix.needsUpdate=true;}
 render(dt,still){const w=this.world,t=w.time;this.touchAge+=dt;this.beams.uniforms.uTime.value=t;this.beams.uniforms.uEnergy.value=w.energy;this.beams.uniforms.uRoom.value=w.room;this.beams.uniforms.uFlight.value=w.flight;
  this.root.position.x=w.pointer.x*.04;this.root.position.y=w.pointer.y*.02;
  const u=w.worldUnit(-1),span=w.width*u,high=w.height*u;for(let i=0;i<12;i++){const side=i%2?1:-1,depth=Math.floor(i/2);this.dummy.position.set(side*(span*(.505+depth*.012)-.4),high*.24+Math.sin(t*.5+i)*.025,-.7-depth*.45);this.dummy.rotation.set(.1,Math.sin(t*.2+i)*.2,Math.sin(t*.35+i)*.08);this.dummy.scale.setScalar(.8+depth*.05);this.dummy.updateMatrix();this.lanterns.setMatrixAt(i,this.dummy.matrix);}this.lanterns.instanceMatrix.needsUpdate=true;
  this.rings.forEach((r,i)=>{const beat=w.dholKick||0;r.scale.setScalar(1+beat*(i+1)*.12);r.material.opacity=.38+beat*.55;r.rotation.z=t*.04*(i%2?-1:1);});this.stage.rotation.y=Math.sin(t*.1)*.03;
  if(w.forever.visible){for(let i=0;i<16;i++){const a=i/16*Math.PI*2,flower=1+w.flight*.16;this.dummy.position.set(Math.cos(a)*2.45*flower,Math.sin(a)*2.9*flower+w.flight*(i%3)*.5,-.5);this.dummy.rotation.set(.22*Math.cos(a),.18*Math.sin(t*.2+a),a-Math.PI/2);this.dummy.scale.set(.29,.58+w.flight*.18,.5);this.dummy.updateMatrix();this.lotus.setMatrixAt(i,this.dummy.matrix);}this.lotus.instanceMatrix.needsUpdate=true;this.lotus.material.opacity=.15+w.flight*.14;
   for(let i=0;i<3;i++){const a=t*(i%2?.025:-.018)+i*.075;this.dummy.position.set(0,0,-.65-i*.04);this.dummy.rotation.set(.08*Math.sin(t*.12+i),.1*Math.cos(t*.09+i),a);this.dummy.scale.set(2.65+i*.12+w.flight*.2,3.35+i*.15+w.flight*.24,1);this.dummy.updateMatrix();this.halos.setMatrixAt(i,this.dummy.matrix);}this.halos.instanceMatrix.needsUpdate=true;this.halos.material.opacity=.3+w.flight*.2;
}
 }
}
