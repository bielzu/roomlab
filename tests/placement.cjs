const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
(async()=>{
const THREE=await import(require('node:url').pathToFileURL(path.resolve(__dirname,'../dist/vendor/three.module.js')).href);
const src=fs.readFileSync(path.resolve(__dirname,'../dist/app.js'),'utf8');
const c={THREE,objects:[],roomSize:4,roomDepth:4};vm.createContext(c);
vm.runInContext(src.slice(src.indexOf('function dims('),src.indexOf('$("#delivery").onclick')),c);
function obj(id,w,d,h,surface,small=false,x=0,z=0){const o=new THREE.Group();o.userData={p:{id,w,d,h,surface,small}};o.position.set(x,0,z);return o;}
const desk=obj('desk',1.35,.65,.865,.865);c.objects.push(desk);
const lamp=obj('lamp',.22,.22,.38,undefined,true);
assert(c.put(lamp,-.35,0));assert.equal(lamp.position.y,.865);c.objects.push(lamp);
const laptop=obj('laptop',.36,.28,.25,undefined,true);
assert(c.put(laptop,.25,0));c.objects.push(laptop);
const mug=obj('mug',.12,.09,.1,undefined,true);
assert(!c.put(mug,-.35,0),'objects on the same tabletop must not intersect');
assert(c.put(desk,0,1));assert.equal(lamp.position.z,1);
assert(c.put(desk,0,1,Math.PI/2));assert(Math.abs(lamp.position.z-1.35)<1e-6);
assert(!c.put(desk,1.9,1),'rollback for invalid furniture position');
assert.equal(desk.position.x,0);
c.roomDepth=2.7;
assert(!c.valid(desk,0,1,Math.PI/2),'rectangular room limits apply to depth');
c.roomSize=8;c.roomDepth=5;
assert(c.put(desk,2.5,1));assert(c.valid(lamp,lamp.position.x,lamp.position.z));
const books=obj('books',.24,.18,.1,.1,true);
assert(c.put(books,-2,-2));c.objects.push(books);
const cup=obj('cup',.12,.09,.1,undefined,true);
assert(c.put(cup,-2,-2));assert.equal(cup.position.y,.1);c.objects.push(cup);
assert(!c.put(books,3.99,3.99));assert.equal(cup.position.x,-2);
console.log('PASS: surfaces, collisions, support rotation, rollback, rectangle dimensions, stack.');
const mc={THREE};vm.createContext(mc);
vm.runInContext(src.slice(src.indexOf('const products ='),src.indexOf('let roomSize =')),mc);
vm.runInContext('globalThis.products=products',mc);
vm.runInContext(src.slice(src.indexOf('const material ='),src.indexOf('// Architectural openings')),mc);
vm.runInContext(src.slice(src.indexOf('function model('),src.indexOf('const initialBudget =')),mc);
for(const p of mc.products){const g=mc.model(p),bounds=new THREE.Box3().setFromObject(g),size=bounds.getSize(new THREE.Vector3());assert(size.x<=p.w+.045,p.id+' width');assert(size.z<=p.d+.045,p.id+' depth');assert(bounds.max.y<=p.h+.035,p.id+' height');}
assert.equal(mc.products.length,65);
assert(mc.products.reduce((sum,p)=>sum+p.price,0)<=30000);
console.log('PASS: 65 models and geometry bounds.');
assert(mc.productRooms(mc.products.find(p=>p.id==='toilet')).includes('banheiro'));
assert(!mc.productRooms(mc.products.find(p=>p.id==='toilet')).includes('sala'));
assert(mc.productRooms(mc.products.find(p=>p.id==='armchair')).includes('externa'));
assert(!mc.productRooms(mc.products.find(p=>p.id==='armchair')).includes('banheiro'));
const ui={}, pc={THREE,painting:true,controls:{enabled:false},exploring:false,roomSize:4,roomDepth:4,tilePaint:{},cast(){},buildTiles(){},saveProject(){},$:(key)=>ui[key]||(ui[key]={value:key==='#floorfinish'?'tile':'#abcdef'}),ray:{ray:{intersectPlane:()=>new THREE.Vector3(0,0,0)}}};
vm.createContext(pc);vm.runInContext(src.slice(src.indexOf('function stopPainting('),src.indexOf("$('#applywallpaint')")),pc);
pc.paintFloor({});assert.equal(pc.painting,false);assert.equal(pc.controls.enabled,true);assert.equal(pc.tilePaint['4,4'].type,'tile');
pc.painting=true;pc.controls.enabled=false;pc.ray.ray.intersectPlane=()=>new THREE.Vector3(10,0,10);pc.paintFloor({});assert.equal(pc.painting,true);
console.log('PASS: room categories and single-action floor painting.');

const ac={doorEnabled:true,extraDoors:[],extraDoorGroup:null,balconySide:"back",balconyOffset:76,currentSpace:"quarto",extraWindows:[],tilePaint:{},tileBase:{type:"wood",color:"#ae906f"},wallPaint:{},yardFence:"wood",yardColor:"#98704e",balcony:false,extraGroup:null,balconyGroup:null,tileGroup:null,THREE,scene:new THREE.Scene(),roomSize:4,roomDepth:6,wallColor:'#d9dfc7',floorColor:'#ae906f',allWalls:false,showGrid:false,exploring:false,windowSide:'left',doorSide:'back',windowOffset:50,doorOffset:76};
vm.createContext(ac);
vm.runInContext(src.slice(src.indexOf('const material ='),src.indexOf('const ground =')),ac);
for(const [w,d] of [[3,4],[4,4],[6,5],[8,8]]){
  ac.roomSize=w;ac.roomDepth=d;
  for(const style of ['normal','blindex','wood','minecraft']){
    vm.runInContext(`windowStyle='${style}';doorStyle='${style}';windowColor='#ff7755';doorColor='#3377bb';windowSide='right';doorSide='front';buildRoom();`,ac);
    vm.runInContext('globalThis.result={room,floor,walls,wallGroups,windowGroup,doorGroup}',ac);
    assert.equal(ac.result.floor.geometry.parameters.width,w+.2);
    assert.equal(ac.result.floor.geometry.parameters.depth,d+.2);
    assert.equal(ac.result.wallGroups.length,4);
    assert.equal(ac.result.wallGroups.filter(g=>g.visible).length,2);
    assert.equal(ac.result.windowGroup.visible,false);
    assert.equal(ac.result.doorGroup.visible,false);
    assert(ac.result.windowGroup.children.some(m=>m.userData.tint&&m.material.color.getHexString()==='ff7755'));
    assert(ac.result.doorGroup.children.some(m=>m.userData.tint&&m.material.color.getHexString()==='3377bb'));
    ac.exploring=true;vm.runInContext('applyWalls()',ac);
    assert(ac.result.wallGroups.every(g=>g.visible));
    assert(ac.result.windowGroup.visible&&ac.result.doorGroup.visible);
    ac.exploring=false;
  }
}
ac.extraWindows=[{side:'back',offset:10,color:'#f03040',style:'wood'},{side:'front',offset:50,color:'#aabbcc',style:'blindex'}];ac.balcony=true;
vm.runInContext('buildRoom();globalThis.extensions={extraGroup,balconyGroup,tileGroup}',ac);
assert.equal(ac.extensions.extraGroup.children.length,2);assert(ac.extensions.balconyGroup.children.length>5);
ac.tilePaint={'0,0':{type:'grass',color:'#00ff00'}};vm.runInContext('buildTiles();globalThis.tiles=tileGroup',ac);
assert.equal(ac.tiles.children.find(m=>m.userData.tile==='0,0').material.color.getHexString(),'00ff00');
assert.equal(ac.tiles.children.filter(m=>m.userData.tile).length,Math.ceil(ac.roomSize/.5)*Math.ceil(ac.roomDepth/.5));

ac.$=()=>({});ac.syncCustom=()=>{};ac.openingDrag={kind:'window'};ac.extraWindows=[];ac.doorSide='back';ac.doorOffset=90;
vm.runInContext(src.slice(src.indexOf('function extraValid('),src.indexOf("$('#addwindow')")),ac);
vm.runInContext(src.slice(src.indexOf('function moveOpening('),src.indexOf('function release()')),ac);
ac.moveOpening(new THREE.Vector3(ac.roomSize/2,1.62,1));assert.equal(ac.windowSide,'right');assert(ac.windowOffset>50);
ac.openingDrag={kind:'door'};ac.moveOpening(new THREE.Vector3(0,1.09,ac.roomDepth/2));assert.equal(ac.doorSide,'front');assert.equal(ac.doorOffset,50);
const oldDoorSide=ac.doorSide,oldDoorOffset=ac.doorOffset;
ac.openingDrag={kind:'balcony'};ac.moveOpening(new THREE.Vector3(-ac.roomSize/2,0,0));assert.equal(ac.balconySide,'left');assert.equal(ac.doorSide,oldDoorSide);assert.equal(ac.doorOffset,oldDoorOffset);
ac.doorEnabled=false;ac.extraDoors=[];ac.balcony=false;vm.runInContext('buildRoom();globalThis.dg=doorGroup',ac);assert.equal(ac.dg.visible,false);
ac.saveProject=()=>{};ac.toast=()=>{};
vm.runInContext(src.slice(src.indexOf('function addDoor('),src.indexOf("$('#adddoor')")),ac);
ac.addDoor();ac.addDoor();assert.equal(ac.extraDoors.length,2);assert(ac.extraValid());
vm.runInContext('globalThis.ed=extraDoorGroup',ac);assert.equal(ac.ed.children.length,2);
ac.openingDrag={kind:'extraDoor',index:0};ac.moveOpening(new THREE.Vector3(0,1,ac.roomDepth/2));assert.equal(ac.extraDoors[0].side,'front');
ac.extraDoors.splice(0,1);vm.runInContext('buildRoom();globalThis.ed=extraDoorGroup',ac);assert.equal(ac.ed.children.length,1);
ac.extraDoors=[];vm.runInContext('buildRoom();globalThis.ed=extraDoorGroup',ac);assert.equal(ac.ed.children.length,0);
vm.runInContext(src.slice(src.indexOf('function onBalcony('),src.indexOf('function canWalk(')),ac);
ac.balcony=true;ac.balconySide='front';ac.balconyOffset=50;
assert.equal(ac.onBalcony(0,ac.roomDepth/2),false,'wall blocks access when all doors removed');
ac.extraDoors=[{side:'front',offset:50,color:'#abcdef',style:'sliding'}];assert.equal(ac.onBalcony(0,ac.roomDepth/2),true);
console.log('PASS: multiple doors, removal, independent balcony movement and doorway access.');
ac.currentSpace='externa';for(const style of ['wood','wall','none']){ac.yardFence=style;vm.runInContext('buildRoom();globalThis.ext={wallGroups,windowGroup,doorGroup}',ac);assert(!ac.ext.windowGroup.visible);assert(!ac.ext.doorGroup.visible);if(style==='none')assert(ac.ext.wallGroups.every(g=>!g.children.length));}
console.log('PASS: multiple windows, balcony, independent tile materials, three yard boundary styles.');
console.log('PASS: four physical walls, door/window placement on all sides, custom colors, exploration view.');
})().catch(e=>{console.error(e);process.exitCode=1});
