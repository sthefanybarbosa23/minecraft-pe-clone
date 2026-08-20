import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);scene.fog=new THREE.Fog(0x87ceeb,25,90);
const camera=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,150);camera.position.set(8,8,12);
const renderer=new THREE.WebGLRenderer({antialias:false});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));document.getElementById('game').appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xffffff,0x667755,2));const sun=new THREE.DirectionalLight(0xffffff,2);sun.position.set(20,30,10);scene.add(sun);
const mats={grass:new THREE.MeshLambertMaterial({color:0x55aa3b}),dirt:new THREE.MeshLambertMaterial({color:0x8b5a2b}),stone:new THREE.MeshLambertMaterial({color:0x888888}),wood:new THREE.MeshLambertMaterial({color:0x9b6b3f})};
const geo=new THREE.BoxGeometry(1,1,1),blocks=[];
function addBlock(x,y,z,type='grass'){const m=new THREE.Mesh(geo,mats[type]||mats.grass);m.position.set(x,y,z);m.userData.type=type;m.userData.grid={x,y,z};scene.add(m);blocks.push(m);return m}
for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){const h=1+Math.floor(Math.max(0,Math.sin(x*.55)*Math.cos(z*.45)*1.2));for(let y=0;y<h;y++)addBlock(x,y,z,y===h-1?'grass':y>h-3?'dirt':'stone')}
for(let i=0;i<12;i++){let x=-9+Math.floor(Math.random()*18),z=-9+Math.floor(Math.random()*18);for(let y=1;y<4;y++)addBlock(x,y,z,'wood')}
const keys={};let selected='grass',yaw=0,pitch=0,velY=0,onGround=false;
addEventListener('keydown',e=>keys[e.code]=true);addEventListener('keyup',e=>keys[e.code]=false);
document.querySelectorAll('[data-block]').forEach(b=>b.onclick=()=>selected=b.dataset.block);
document.querySelectorAll('[data-key]').forEach(b=>{const k={w:'KeyW',a:'KeyA',s:'KeyS',d:'KeyD',space:'Space'}[b.dataset.key];b.onpointerdown=()=>keys[k]=true;b.onpointerup=b.onpointerleave=()=>keys[k]=false});
renderer.domElement.addEventListener('click',()=>renderer.domElement.requestPointerLock?.());document.addEventListener('mousemove',e=>{if(document.pointerLockElement===renderer.domElement){yaw-=e.movementX*.0025;pitch-=e.movementY*.0025;pitch=Math.max(-1.5,Math.min(1.5,pitch))}});
function ray(){const r=new THREE.Raycaster();r.setFromCamera(new THREE.Vector2(0,0),camera);return r.intersectObjects(blocks,false)}
function breakBlock(){const hit=ray()[0];if(!hit)return;const b=hit.object;scene.remove(b);blocks.splice(blocks.indexOf(b),1)}
function placeBlock(){const hit=ray()[0];if(!hit)return;const p=hit.object.position.clone().add(hit.face.normal);p.set(Math.round(p.x),Math.round(p.y),Math.round(p.z));if(blocks.some(b=>b.position.distanceTo(p)<.1))return;addBlock(p.x,p.y,p.z,selected)}
document.getElementById('break').onclick=breakBlock;document.getElementById('place').onclick=placeBlock;renderer.domElement.addEventListener('mousedown',e=>{if(e.button===0)breakBlock();if(e.button===2)placeBlock()});renderer.domElement.addEventListener('contextmenu',e=>e.preventDefault());
function update(dt){const dir=new THREE.Vector3((keys.KeyD?1:0)-(keys.KeyA?1:0),0,(keys.KeyS?1:0)-(keys.KeyW?1:0));if(dir.lengthSq()){dir.normalize();dir.applyAxisAngle(new THREE.Vector3(0,1,0),yaw);camera.position.x+=dir.x*dt*6;camera.position.z+=dir.z*dt*6}if(keys.Space&&onGround){velY=7;onGround=false}velY-=18*dt;camera.position.y+=velY*dt;if(camera.position.y<2.1){camera.position.y=2.1;velY=0;onGround=true}camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch}
let last=performance.now();function loop(t){const dt=Math.min((t-last)/1000,.05);last=t;update(dt);renderer.render(scene,camera);requestAnimationFrame(loop)}requestAnimationFrame(loop);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
