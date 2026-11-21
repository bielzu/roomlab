import * as THREE from "three";
import { OrbitControls } from "./vendor/OrbitControls.js";
import { parseDescription, clampMeters } from "./planner.js";
const $ = (s) => document.querySelector(s),
  money = (n) =>
    n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
const products = [
  {
    id: "bed",
    name: "Cama Nuvem",
    price: 850,
    w: 1.4,
    d: 2.1,
    h: 1.025,
    cat: "essentials",
    color: "#b8cc92",
    stats: [35, 15, 10],
  },
  {
    id: "desk",
    name: "Mesa de criação",
    price: 450,
    w: 1.35,
    d: 0.65,
    h: 0.865,
    surface: 0.865,
    cat: "essentials",
    color: "#cbac81",
    stats: [8, 12, 35],
  },
  {
    id: "chair",
    name: "Cadeira Loop",
    price: 290,
    w: 0.6,
    d: 0.6,
    h: 1.05,
    cat: "essentials",
    color: "#809376",
    stats: [20, 10, 15],
  },
  {
    id: "shelf",
    name: "Estante Nicho",
    price: 380,
    w: 0.85,
    d: 0.38,
    h: 1.755,
    surface: 1.755,
    cat: "essentials",
    color: "#cbac81",
    stats: [3, 18, 25],
  },
  {
    id: "rug",
    name: "Tapete Terra",
    price: 180,
    w: 1.5,
    d: 1.6,
    h: 0.025,
    cat: "decor",
    color: "#cc875f",
    stats: [10, 25, 0],
  },
  {
    id: "plant",
    name: "Planta Monstera",
    price: 90,
    w: 0.86,
    d: 0.86,
    h: 1,
    cat: "decor",
    color: "#d2b297",
    stats: [3, 20, 0],
  },
  {
    id: "lamp",
    name: "Luminária Arco",
    price: 160,
    w: 0.56,
    d: 0.56,
    h: 1.55,
    cat: "decor",
    color: "#e8d6a4",
    stats: [8, 20, 10],
  },
  {
    id: "nightstand",
    name: "Criado Cubo",
    price: 220,
    w: 0.48,
    d: 0.48,
    h: 0.56,
    surface: 0.56,
    cat: "essentials",
    color: "#cbac81",
    stats: [8, 10, 15],
  },
  {
    id: "monitor",
    name: "Monitor 27″",
    price: 420,
    w: 0.58,
    d: 0.23,
    h: 0.46,
    small: true,
    cat: "tech",
    color: "#323e41",
    stats: [0, 8, 25],
  },
  {
    id: "pc",
    name: "PC compacto RGB",
    price: 650,
    w: 0.26,
    d: 0.43,
    h: 0.46,
    small: true,
    cat: "tech",
    color: "#354044",
    stats: [0, 15, 30],
  },
  {
    id: "laptop",
    name: "Notebook Slim",
    price: 720,
    w: 0.36,
    d: 0.31,
    h: 0.25,
    small: true,
    cat: "tech",
    color: "#a4acb1",
    stats: [0, 10, 30],
  },
  {
    id: "keyboard",
    name: "Teclado mecânico",
    price: 95,
    w: 0.38,
    d: 0.14,
    h: 0.04,
    small: true,
    cat: "tech",
    color: "#d2d5c9",
    stats: [0, 8, 10],
  },
  {
    id: "mouse",
    name: "Mouse sem fio",
    price: 45,
    w: 0.065,
    d: 0.105,
    h: 0.045,
    small: true,
    cat: "tech",
    color: "#bed18e",
    stats: [0, 3, 8],
  },
  {
    id: "speakers",
    name: "Caixa de som",
    price: 110,
    w: 0.13,
    d: 0.12,
    h: 0.22,
    small: true,
    cat: "tech",
    color: "#525b52",
    stats: [3, 8, 8],
  },
  {
    id: "tablelamp",
    name: "Abajur Mini",
    price: 75,
    w: 0.22,
    d: 0.22,
    h: 0.38,
    small: true,
    cat: "decor",
    color: "#f0d49a",
    stats: [8, 15, 5],
  },
  {
    id: "succulent",
    name: "Mini suculenta",
    price: 35,
    w: 0.17,
    d: 0.15,
    h: 0.2,
    small: true,
    cat: "decor",
    color: "#bf8968",
    stats: [2, 12, 0],
  },
  {
    id: "books",
    name: "Livros empilhados",
    price: 45,
    w: 0.24,
    d: 0.18,
    h: 0.1,
    small: true,
    surface: 0.1,
    cat: "decor",
    color: "#b88c61",
    stats: [3, 10, 5],
  },
  {
    id: "mug",
    name: "Caneca de café",
    price: 25,
    w: 0.12,
    d: 0.09,
    h: 0.1,
    small: true,
    cat: "decor",
    color: "#dcceb0",
    stats: [4, 5, 0],
  },
  {
    id: "clock",
    name: "Relógio de mesa",
    price: 55,
    w: 0.2,
    d: 0.08,
    h: 0.12,
    small: true,
    cat: "decor",
    color: "#a5b48b",
    stats: [0, 5, 5],
  },
  {
    id: "headphones",
    name: "Headset no suporte",
    price: 130,
    w: 0.18,
    d: 0.15,
    h: 0.3,
    small: true,
    cat: "tech",
    color: "#75896a",
    stats: [3, 10, 12],
  },
  {
    id: "bench",
    name: "Banco Baixo",
    price: 120,
    w: 0.65,
    d: 0.35,
    h: 0.42,
    surface: 0.42,
    cat: "essentials",
    color: "#b68d68",
    stats: [12, 8, 5],
  },
  {
    id: "coffeetable",
    name: "Mesa de centro",
    price: 240,
    w: 0.9,
    d: 0.6,
    h: 0.38,
    surface: 0.38,
    cat: "essentials",
    color: "#bfa17b",
    stats: [8, 12, 12],
  },
  {
    id: "pouf",
    name: "Pufe Cozy",
    price: 190,
    w: 0.65,
    d: 0.65,
    h: 0.42,
    cat: "essentials",
    color: "#c99478",
    stats: [18, 15, 0],
  },
  {
    id: "drawer",
    name: "Cômoda Linha",
    price: 520,
    w: 1.1,
    d: 0.54,
    h: 0.9,
    surface: 0.9,
    cat: "essentials",
    color: "#c4ad8a",
    stats: [8, 12, 30],
  },
  {
    id: "smallrug",
    name: "Tapete compacto",
    price: 85,
    w: 0.8,
    d: 0.55,
    h: 0.025,
    cat: "decor",
    color: "#879678",
    stats: [5, 12, 0],
  },

  {
    id: "deskcompact",
    name: "Mesa Compacta",
    price: 260,
    w: 0.95,
    d: 0.5,
    h: 0.78,
    surface: 0.78,
    cat: "essentials",
    color: "#c7b293",
    stats: [5, 10, 25],
  },
  {
    id: "deskgamer",
    name: "Mesa Gamer XL",
    price: 620,
    w: 1.8,
    d: 0.8,
    h: 0.8,
    surface: 0.8,
    cat: "essentials",
    color: "#464e54",
    stats: [8, 20, 40],
  },
  {
    id: "deskstudio",
    name: "Mesa Studio",
    price: 550,
    w: 1.6,
    d: 0.75,
    h: 0.82,
    surface: 0.82,
    cat: "essentials",
    color: "#b88760",
    stats: [10, 18, 35],
  },
  {
    id: "bedsingle",
    name: "Cama Solteiro",
    price: 480,
    w: 1,
    d: 2,
    h: 0.8,
    cat: "essentials",
    color: "#8ea9b9",
    stats: [28, 12, 8],
  },
  {
    id: "bedqueen",
    name: "Cama Queen Cozy",
    price: 1100,
    w: 1.8,
    d: 2.2,
    h: 1.08,
    cat: "essentials",
    color: "#cfad99",
    stats: [45, 25, 10],
  },
  {
    id: "bedlow",
    name: "Cama Japonesa",
    price: 720,
    w: 1.6,
    d: 2.15,
    h: 0.6,
    cat: "essentials",
    color: "#ddd3ad",
    stats: [32, 25, 10],
  },
  {
    id: "chairergo",
    name: "Cadeira Ergonômica",
    price: 480,
    w: 0.68,
    d: 0.68,
    h: 1.25,
    cat: "essentials",
    color: "#81958c",
    stats: [30, 12, 25],
  },
  {
    id: "chairgamer",
    name: "Cadeira Gamer",
    price: 650,
    w: 0.72,
    d: 0.72,
    h: 1.3,
    cat: "essentials",
    color: "#a090c0",
    stats: [25, 25, 25],
  },
  {
    id: "chairstudio",
    name: "Cadeira Estofada",
    price: 230,
    w: 0.58,
    d: 0.6,
    h: 0.9,
    cat: "essentials",
    color: "#c79670",
    stats: [20, 15, 10],
  },
  {id:"sofa",name:"Sofá 3 lugares",price:950,w:2.1,d:.86,h:.92,cat:"living",color:"#91a4a0",stats:[34,18,8]},
  {id:"tvstand",name:"Rack de TV",price:520,w:1.5,d:.42,h:.6,surface:.6,cat:"living",color:"#b69a72",stats:[3,14,22]},
  {id:"tv",name:"TV de sala",price:690,w:1.19,d:.16,h:.71,small:true,cat:"living",color:"#313b41",stats:[5,18,20]},
  {id:"diningtable",name:"Mesa de jantar",price:450,w:1.5,d:.9,h:.77,surface:.77,cat:"living",color:"#ad8c61",stats:[10,15,12]},
  {id:"toilet",name:"Vaso sanitário",price:470,w:.44,d:.72,h:.78,cat:"bath",color:"#e1e9e3",stats:[5,0,18]},
  {id:"sink",name:"Pia de banheiro",price:390,w:.58,d:.43,h:.86,cat:"bath",color:"#dce6e0",stats:[8,2,20]},
  {id:"shower",name:"Box de chuveiro",price:760,w:.92,d:.92,h:2.23,cat:"bath",color:"#a6d0cf",stats:[15,10,22]},
  {id:"bathtub",name:"Banheira",price:820,w:1.56,d:.79,h:.64,cat:"bath",color:"#ecf0e9",stats:[35,10,5]},
  {id:"outdoorbench",name:"Banco de jardim",price:430,w:1.5,d:.56,h:.95,cat:"outdoor",color:"#a58362",stats:[15,20,6]},
  {id:"patiotable",name:"Mesa externa",price:300,w:.85,d:.85,h:.73,surface:.73,cat:"outdoor",color:"#a28e70",stats:[8,14,12]},
  {id:"umbrella",name:"Ombrelone",price:280,w:1.6,d:1.6,h:2.35,cat:"outdoor",color:"#b9cb9d",stats:[10,23,6]},
  {id:"planter",name:"Vaso grande",price:180,w:.62,d:.62,h:1.1,cat:"outdoor",color:"#b08064",stats:[8,23,0]},
{"id": "pool", "name": "Piscina elevada", "w": 3, "d": 2, "h": 0.75, "price": 0, "cat": "outdoor", "color": "#5eb6c4", "stats": [5, 10, 5]},
{"id": "showerbox", "name": "Box de vidro", "w": 0.95, "d": 0.95, "h": 2.1, "price": 0, "cat": "bath", "color": "#9bbdc4", "stats": [5, 10, 5]},
{"id": "bathmat", "name": "Tapete de banho", "w": 0.7, "d": 0.45, "h": 0.025, "price": 0, "cat": "bath", "color": "#b4c7b4", "stats": [5, 10, 5]},
{"id": "towelrack", "name": "Toalheiro", "w": 0.65, "d": 0.3, "h": 1.05, "price": 0, "cat": "bath", "color": "#c5b4a1", "stats": [5, 10, 5]},
{"id": "soap", "name": "Saboneteira", "w": 0.16, "d": 0.1, "h": 0.06, "price": 0, "cat": "bath", "color": "#b5c5c6", "stats": [5, 10, 5], "small": true},
{"id": "vaseflowers", "name": "Vaso com flores", "w": 0.25, "d": 0.25, "h": 0.48, "price": 0, "cat": "decor", "color": "#d2a487", "stats": [5, 10, 5], "small": true},
{"id": "cushion", "name": "Almofada decorativa", "w": 0.4, "d": 0.4, "h": 0.16, "price": 0, "cat": "decor", "color": "#c39aa7", "stats": [5, 10, 5], "small": true},
{"id": "candles", "name": "Velas decorativas", "w": 0.22, "d": 0.16, "h": 0.22, "price": 0, "cat": "decor", "color": "#e4d4b1", "stats": [5, 10, 5], "small": true},
{"id": "ottoman", "name": "Banco de apoio", "w": 0.8, "d": 0.4, "h": 0.4, "price": 0, "cat": "living", "color": "#b19d7e", "stats": [5, 10, 5], "surface": 0.4},
{"id": "sideboard", "name": "Aparador", "w": 1.2, "d": 0.4, "h": 0.85, "price": 0, "cat": "living", "color": "#ba8f6a", "stats": [5, 10, 5], "surface": 0.85},
{"id": "parasol", "name": "Ombrelone", "w": 1.8, "d": 1.8, "h": 2.4, "price": 0, "cat": "outdoor", "color": "#ded1ac", "stats": [5, 10, 5]},
{"id": "lounger", "name": "Espregui\u00e7adeira", "w": 0.7, "d": 1.9, "h": 0.68, "price": 0, "cat": "outdoor", "color": "#c7b190", "stats": [5, 10, 5]},
{"id": "gardenlights", "name": "Lumin\u00e1ria de jardim", "w": 0.25, "d": 0.25, "h": 0.7, "price": 0, "cat": "outdoor", "color": "#7f9784", "stats": [5, 10, 5]},
{"id": "basket", "name": "Cesto organizador", "w": 0.4, "d": 0.4, "h": 0.45, "price": 0, "cat": "decor", "color": "#ba9977", "stats": [5, 10, 5]},
{"id": "bedtray", "name": "Bandeja decorativa", "w": 0.45, "d": 0.3, "h": 0.05, "price": 0, "cat": "decor", "color": "#bb9776", "stats": [5, 10, 5], "small": true, "surface": 0.05},
{"id": "outdoorrug", "name": "Tapete externo", "w": 1.5, "d": 1, "h": 0.025, "price": 0, "cat": "outdoor", "color": "#a7ad8a", "stats": [5, 10, 5]},
  {id:'grasspatch',name:'Grama natural',price:0,w:1,d:1,h:.09,cat:'outdoor',color:'#648c43',stats:[0,20,0]},
  {id:'openshelf',name:'Prateleira modular',price:0,w:1,d:.3,h:1.6,surface:1.6,cat:'decor',color:'#ba946e',stats:[0,15,15]},
  {id:'armchair',name:'Poltrona aconchego',price:0,w:.8,d:.8,h:.9,cat:'living',color:'#b8ad90',stats:[20,15,0]},
];
function productRooms(p){
 if(p.cat==='bath')return ['banheiro'];
 if(p.cat==='outdoor')return ['externa'];
 if(['plant','succulent','vaseflowers','candles','basket','openshelf'].includes(p.id))return ['quarto','sala','banheiro','externa'];
 if(['armchair','chair','chairstudio','bench','coffeetable','pouf','ottoman','cushion'].includes(p.id))return ['quarto','sala','externa'];
 if(p.id.startsWith('bed')||['nightstand','drawer'].includes(p.id))return ['quarto'];
 return ['quarto','sala'];
}
let roomSize = 4,
  roomDepth = 4,
  currentSpace = "quarto",
  allWalls = false,
  showGrid = false,
  exploring = false,
  windowSide = "left", doorSide = "back",
  windowOffset = 50, doorOffset = 76,
  wallColor = "#d9dfc7",
  floorColor = "#ae906f";
let extraWindows=[], tilePaint={}, tileBase={type:'wood',color:'#ae906f'},wallPaint={},yardFence='wood',yardColor='#98704e',balcony=false;
let tileGroup,extraGroup,balconyGroup,painting=false;
let openingDrag=null;
let doorEnabled=true,extraDoors=[],extraDoorGroup,balconySide="back",balconyOffset=76;
const scene = new THREE.Scene();
scene.background = new THREE.Color("#39463d");
scene.fog = new THREE.Fog("#39463d", 18, 38);
const host = $("#viewport");
let renderer;
try {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
} catch (e) {
  $("#loading").textContent =
    "Este navegador precisa de WebGL para abrir o quarto. Ative a aceleração gráfica e tente novamente.";
  throw e;
}
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor("#39463d");
host.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera(40, 1, 0.05, 100);
camera.position.set(7, 6.7, 8);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.8, 0);
controls.enableDamping = true;
controls.maxPolarAngle = Math.PI / 2.12;
controls.minDistance = 4;
controls.maxDistance = 25;
const hemi = new THREE.HemisphereLight("#f6f4dc", "#738367", 2.3);
scene.add(hemi);
const sun = new THREE.DirectionalLight("#fff3d4", 3.5);
sun.position.set(3, 7, 5);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -6;
sun.shadow.camera.right = 6;
sun.shadow.camera.top = 6;
sun.shadow.camera.bottom = -6;
sun.shadow.normalBias = 0.03;
scene.add(sun);
const warm = new THREE.PointLight("#ffc175", 0, 7);
warm.position.set(-1, 2, -1);
scene.add(warm);
const material = (c) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: 0.78 });
function box(g, w, h, d, x, y, z, c, change = false) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material(c));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  m.userData.tint = change;
  g.add(m);
  return m;
}
function cyl(g, r1, r2, h, x, y, z, c) {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(r1, r2, h, 24),
    material(c),
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}
// Architectural openings and four real walls. Sizes and positions are in metres.
let windowStyle = "normal", doorStyle = "normal",
  windowColor = "#f1e9d4", doorColor = "#a4ae95";
let windowGroup, doorGroup, room, floor, walls = [], wallGroups = [], lines, gridLines;
const WALL_H = 2.8;
function disposeGroup(group) {
  if (!group) return;
  group.parent?.remove(group);
  group.traverse(n => {
    if (n.isMesh || n.isLine) { n.geometry.dispose();
      if (Array.isArray(n.material)) n.material.forEach(m => m.dispose());
      else n.material.dispose();
    }
  });
}
function wallLength(side) { return (side === "left" || side === "right") ? roomDepth : roomSize; }
function openingCenter(side, offset, width) {
  return ((Number(offset) / 100) - 0.5) * Math.max(0, wallLength(side) - width - 0.32);
}
function wallTransform(g, side, inset = 0) {
  if (side === "back") { g.position.set(0, 0, -roomDepth / 2 + inset); g.rotation.y = 0; }
  if (side === "front") { g.position.set(0, 0, roomDepth / 2 - inset); g.rotation.y = Math.PI; }
  if (side === "left") { g.position.set(-roomSize / 2 + inset, 0, 0); g.rotation.y = Math.PI / 2; }
  if (side === "right") { g.position.set(roomSize / 2 - inset, 0, 0); g.rotation.y = -Math.PI / 2; }
}
function openingsOverlap() {
  if (!doorEnabled || windowSide !== doorSide) return false;
  return Math.abs(openingCenter(windowSide, windowOffset, 1.72) - openingCenter(doorSide, doorOffset, .86)) < 1.40;
}
function buildArchitecture() {
  disposeGroup(windowGroup); disposeGroup(doorGroup);
  windowGroup = new THREE.Group(); windowGroup.name = "janela"; room.add(windowGroup);
  wallTransform(windowGroup, windowSide, 0.055);
  windowGroup.position.add(new THREE.Vector3(0,0,0));
  windowGroup.translateX(openingCenter(windowSide, windowOffset, 1.72));
  windowGroup.position.y = 1.62;
  const wc = windowColor, wd = new THREE.Color(wc).multiplyScalar(.67).getStyle();
  const glass = box(windowGroup, 1.64, 1.21, .018, 0, 0, .025, "#b0d3d4");
  glass.material.transparent = true; glass.material.opacity = windowStyle === "blindex" ? .5 : .78;
  glass.material.roughness = .13; glass.material.metalness = .12;
  const frame = windowStyle === "blindex" ? .027 : windowStyle === "wood" ? .105 : .07;
  for (const x of [-.87,.87]) box(windowGroup,frame,1.37,.07,x,0,.05,wc,true);
  for (const y of [-.67,.67]) box(windowGroup,1.8,frame,.07,0,y,.05,wc,true);
  if(windowStyle === "normal") {
    box(windowGroup,.045,1.28,.06,0,0,.075,wc,true);
    box(windowGroup,1.7,.045,.06,0,0,.075,wc,true);
  }
  if(windowStyle === "blindex") {
    box(windowGroup,.012,1.25,.025,0,0,.055,wc,true);
    for(const x of [-.07,.07]) box(windowGroup,.035,.17,.045,x,-.05,.09,wc,true);
  }
  if(windowStyle === "wood") {
    box(windowGroup,.075,1.27,.08,0,0,.085,wc,true);
    for(const x of [-.61,.61]) {
      box(windowGroup,.46,1.2,.04,x,0,.12,wd);
      for(let y=-.5;y<=.51;y+=.12) box(windowGroup,.44,.075,.07,x,y,.16,wc,true);
    }
  }
  if(windowStyle === "minecraft") {
    box(windowGroup,.09,1.25,.1,0,0,.08,wc,true);
    box(windowGroup,1.68,.09,.1,0,0,.08,wc,true);
    for(let i=0;i<8;i++) box(windowGroup,.12,.08,.012,-.73+i*.2,-.47+i*.12,.07,"#e1f8f2");
    for(const x of [-.87,.87]) for(let y=-.57;y<.64;y+=.17)
      box(windowGroup,.095,.06,.025,x,y,.095,wd);
  }
  if(windowStyle !== "blindex") box(windowGroup,1.92,.05,.21,0,-.72,.09,wc,true);
  doorGroup = new THREE.Group(); doorGroup.name = "porta"; room.add(doorGroup);
  wallTransform(doorGroup,doorSide,.055);
  doorGroup.translateX(openingCenter(doorSide,doorOffset,.86));
  doorGroup.position.y = 1.09;
  decorateDoor(doorGroup,doorStyle,doorColor);
  buildExtras();
  applyWalls();
}
function decorateDoor(doorGroup,doorStyle,doorColor){
  const dc=doorColor, dd=new THREE.Color(dc).multiplyScalar(.72).getStyle();
  const leaf = box(doorGroup,.8,2.14,.055,0,0,0,dc,true);
  if(doorStyle === "sliding") leaf.position.x=-.38; // open-style sliding leaf
  for(const x of [-.44,.44]) box(doorGroup,.06,2.25,.09,x,0,.035,dc,true);
  box(doorGroup,.94,.06,.09,0,1.11,.035,dc,true);
  if(doorStyle === "normal") for(const y of [-.52,.49]) {
    box(doorGroup,.63,.76,.012,0,y,.034,dd);
    box(doorGroup,.55,.67,.018,0,y,.047,dc,true);
  }
  if(doorStyle === "wood") for(let x=-.3;x<=.31;x+=.15) {
    box(doorGroup,.012,2.02,.015,x,0,.034,dd);
    for(let i=0;i<3;i++) box(doorGroup,.006,.3,.014,x+.047,-.65+i*.65,.04,dd);
  }
  if(doorStyle === "blindex" || doorStyle === "sliding") {
    const pane=box(doorGroup,.66,1.96,.012,doorStyle === "sliding" ? -.38 : 0,.01,.035,"#9fbabd");
    pane.material.roughness=.12;pane.material.metalness=.25;
    box(doorGroup,.025,1.96,.018,0,.01,.045,dc,true);
    for(const y of [-.98,.98]) box(doorGroup,.7,.03,.022,0,y,.045,dc,true);
    if(doorStyle === "sliding") box(doorGroup,1.6,.06,.13,0,1.16,.05,"#b9c5b8");
  }
  if(doorStyle === "minecraft") {
    for(const x of [-.18,.18]) for(const y of [.47,.78]) {
      box(doorGroup,.24,.22,.015,x,y,.04,"#8caaa8");
      box(doorGroup,.024,.22,.025,x,y,.055,dd);
    }
    for(const y of [-.78,-.45,-.12]) box(doorGroup,.68,.045,.03,0,y,.042,dd);
  }
  box(doorGroup,.04,.07,.075,.28,-.04,.078,"#d9c88a");
  box(doorGroup,.115,.025,.035,.245,-.04,.12,"#d9c88a");
}
function cleanFinish(v,fallback='wood'){return {type:['wood','tile','stone','grass','gravel','concrete'].includes(v?.type)?v.type:fallback,color:/^#[0-9a-f]{6}$/i.test(v?.color||'')?v.color:'#ae906f'};}
function cleanTiles(v){return Object.fromEntries(Object.entries(v||{}).filter(([k])=>/^\d{1,2},\d{1,2}$/.test(k)).slice(0,576).map(([k,v])=>[k,cleanFinish(v)]));}
function buildTiles(){
 disposeGroup(tileGroup);tileGroup=new THREE.Group();room.add(tileGroup);if(lines)lines.visible=false;
 for(let i=0;i<Math.ceil(roomSize/.5);i++)for(let j=0;j<Math.ceil(roomDepth/.5);j++){
 const w=Math.min(.5,roomSize-i*.5),d=Math.min(.5,roomDepth-j*.5),key=i+','+j,f=tilePaint[key]||tileBase;
 const x=-roomSize/2+i*.5+w/2,z=-roomDepth/2+j*.5+d/2;
 const tile=box(tileGroup,w-.006,.016,d-.006,x,-.014,z,f.color);tile.userData.tile=key;
 if(f.type==='wood')for(let a=0;a<3;a++)box(tileGroup,w-.015,.002,.006,x,-.005,z-d/2+(a+1)*d/4,new THREE.Color(f.color).multiplyScalar(.75));
 if(f.type==='tile')box(tileGroup,w*.75,.002,.008,x,-.004,z,new THREE.Color(f.color).multiplyScalar(.9));
 if(['grass','gravel','stone'].includes(f.type))for(let k=0;k<5;k++){const seed=((i*31+j*17+k*13)%97)/97;const c=new THREE.Color(f.color).multiplyScalar(.72+seed*.5);box(tileGroup,.025+seed*.03,.008,.025,x+(seed-.5)*w*.8,-.004,z+(((k*23+i*7)%71)/71-.5)*d*.8,c);}
 }
}
function buildExtras(){
 disposeGroup(extraDoorGroup);extraDoorGroup=new THREE.Group();room.add(extraDoorGroup);
 if(currentSpace!=='externa')extraDoors.forEach(d=>{const g=new THREE.Group();extraDoorGroup.add(g);g.userData.side=d.side;wallTransform(g,d.side,.055);g.translateX(openingCenter(d.side,d.offset,.86));g.position.y=1.09;decorateDoor(g,d.style,d.color);});
 disposeGroup(extraGroup);disposeGroup(balconyGroup);balconyGroup=null;extraGroup=new THREE.Group();room.add(extraGroup);
 if(currentSpace!=='externa')for(const win of extraWindows){const g=new THREE.Group();g.userData.side=win.side;extraGroup.add(g);wallTransform(g,win.side,.055);g.translateX(openingCenter(win.side,win.offset,1.72));g.position.y=1.62;
 const pane=box(g,1.64,1.21,.02,0,0,.025,'#aacdd2');pane.material.transparent=true;pane.material.opacity=.6;
 for(const x of [-.87,.87])box(g,.07,1.37,.07,x,0,.05,win.color,true);for(const y of [-.67,.67])box(g,1.8,.07,.07,0,y,.05,win.color,true);
 if(win.style!=='blindex'){box(g,.05,1.25,.06,0,0,.07,win.color);box(g,1.7,.05,.06,0,0,.07,win.color);}
 if(win.style==='wood')for(const x of [-.64,.64])for(let y=-.5;y<.6;y+=.12)box(g,.4,.07,.07,x,y,.11,win.color);
 if(win.style==='minecraft')for(let k=0;k<7;k++)box(g,.12,.07,.015,-.65+k*.2,-.4+k*.13,.07,'#e0ffff');
 }
 if(balcony&&currentSpace!=='externa'){
 balconyGroup=new THREE.Group();room.add(balconyGroup);wallTransform(balconyGroup,balconySide,0);balconyGroup.translateX(openingCenter(balconySide,balconyOffset,2.4));
 box(balconyGroup,2.4,.16,1.6,0,-.1,-.8,yardColor);
 for(let x=-1.15;x<=1.16;x+=.23)box(balconyGroup,.04,1.05,.04,x,.525,-1.55,yardColor);
 for(const x of [-1.17,1.17]){box(balconyGroup,.055,.055,1.6,x,1.05,-.8,yardColor);for(let z=-1.5;z<0;z+=.25)box(balconyGroup,.04,1.05,.04,x,.525,z,yardColor);}
 box(balconyGroup,2.4,.06,.06,0,1.05,-1.55,yardColor);
 // Keep the doorway visibly open onto the balcony.
 if(doorEnabled&&doorSide===balconySide&&Math.abs(openingCenter(doorSide,doorOffset,.86)-openingCenter(balconySide,balconyOffset,2.4))<.7)doorGroup.children[0].visible=false;
 }
}
function buildWallSegments(g, side) {
  const L = wallLength(side);
  if(currentSpace==='externa'){
    if(yardFence==='none')return;
    if(yardFence==='wall'){walls.push(box(g,L,.85,.12,0,.425,0,yardColor));return;}
    for(let x=-L/2+.08;x<L/2;x+=.2)box(g,.13,1.05,.055,x,.525,0,yardColor,true);
    for(const y of [.25,.8])box(g,L,.08,.07,0,y,.015,yardColor,true);return;
  }
  const holes = [];
  for(const win of extraWindows.filter(w=>w.side===side)) {const center=openingCenter(side,win.offset,1.72);holes.push({left:center-.86,right:center+.86,bottom:1,top:2.25});}
  if(windowSide===side) holes.push({left:openingCenter(side,windowOffset,1.72)-.86, right:openingCenter(side,windowOffset,1.72)+.86, bottom:1, top:2.25});
  for(const d of extraDoors.filter(d=>d.side===side)){const c=openingCenter(side,d.offset,.86);holes.push({left:c-.43,right:c+.43,bottom:0,top:2.18});}
  if(doorEnabled&&doorSide===side) holes.push({left:openingCenter(side,doorOffset,.86)-.43, right:openingCenter(side,doorOffset,.86)+.43, bottom:0, top:2.18});
  const xs = [...new Set([-L/2,L/2,...holes.flatMap(h=>[h.left,h.right])])].sort((a,b)=>a-b);
  const ys = [...new Set([0,WALL_H,...holes.flatMap(h=>[h.bottom,h.top])])].sort((a,b)=>a-b);
  for(let i=0;i<xs.length-1;i++) for(let j=0;j<ys.length-1;j++) {
    const x=(xs[i]+xs[i+1])/2, y=(ys[j]+ys[j+1])/2;
    if(holes.some(h=>x>h.left && x<h.right && y>h.bottom && y<h.top)) continue;
    const slab=box(g,xs[i+1]-xs[i],ys[j+1]-ys[j],.12,x,y,0,wallColor);
    walls.push(slab);
  }
}
function applyWalls() {
  if(gridLines) gridLines.visible = showGrid && !exploring;
  for(const g of wallGroups) g.visible = exploring || allWalls || g.userData.side === "back" || g.userData.side === "left";
  if(windowGroup) windowGroup.visible = currentSpace!=="externa" && (exploring || allWalls || ["back","left"].includes(windowSide));
  if(extraGroup)extraGroup.children.forEach(g=>g.visible=exploring||allWalls||["back","left"].includes(g.userData.side));
  if(extraDoorGroup)extraDoorGroup.children.forEach(g=>g.visible=exploring||allWalls||["back","left"].includes(g.userData.side));
  if(doorGroup) doorGroup.visible = doorEnabled && currentSpace!=="externa" && (exploring || allWalls || ["back","left"].includes(doorSide));
}
function buildRoom() {
  disposeGroup(room);
  room = new THREE.Group(); scene.add(room); walls=[]; wallGroups=[];
  floor = box(room,roomSize+.2,.18,roomDepth+.2,0,-.12,0,floorColor);
  for(const side of ["back","left","front","right"]) {
    const g=new THREE.Group(); g.name="parede-"+side; g.userData.side=side;
    wallTransform(g,side,-.05); room.add(g); wallGroups.push(g);
    buildWallSegments(g,side);
  }
  lines=new THREE.Group(); room.add(lines);
  for(let z=-roomDepth/2;z<=roomDepth/2;z+=.32)
    box(lines,roomSize+.04,.003,.008,0,-.026,z,"#8f745b");
  for(let z=-roomDepth/2+.16;z<roomDepth/2;z+=.32)
    for(let x=-roomSize/2+.1+(Math.round(z*100)%2 ? 0:.6);x<roomSize/2;x+=1.2)
      box(lines,.008,.003,.31,x,-.025,z,"#8f745b");
  const gridPoints=[];
  for(let x=Math.ceil(-roomSize/2);x<=roomSize/2;x++) gridPoints.push(x,.008,-roomDepth/2,x,.008,roomDepth/2);
  for(let z=Math.ceil(-roomDepth/2);z<=roomDepth/2;z++) gridPoints.push(-roomSize/2,.008,z,roomSize/2,.008,z);
  gridLines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(gridPoints,3)),new THREE.LineBasicMaterial({color:'#d4f577',transparent:true,opacity:.7}));
  room.add(gridLines);
  buildArchitecture();
  floor.material.color.set(floorColor);
  lines.children.forEach(n=>n.material.color.set(new THREE.Color(floorColor).multiplyScalar(.78)));
  wallGroups.forEach(g=>g.traverse(n=>{if(n.isMesh&&currentSpace!=="externa")n.material.color.set(wallPaint[g.userData.side]||wallColor)}));
  buildTiles();
}
buildRoom();
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  material("#39463d"),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.24;
ground.receiveShadow = true;
scene.add(ground);
function model(p) {
  const g = new THREE.Group(),
    c = p.color;
  if(p.id==='grasspatch'){
    box(g,1,.015,1,0,.0075,0,'#655039');
    const blades=new THREE.InstancedMesh(new THREE.BoxGeometry(.012,1,.018),material(c),100),dummy=new THREE.Object3D();
    blades.userData.tint=true;
    for(let i=0;i<10;i++)for(let j=0;j<10;j++){
      const h=.035+((i*13+j*7)%11)*.004;
      dummy.position.set(-.45+i*.1,.015+h/2,-.45+j*.1);dummy.scale.set(1,h,1);dummy.rotation.z=((i+j)%3-1)*.2;dummy.updateMatrix();blades.setMatrixAt(i*10+j,dummy.matrix);
    }
    blades.instanceMatrix.needsUpdate=true;g.add(blades);
  }
  if(p.id==='openshelf'){
    for(const x of [-.47,.47])box(g,.06,1.6,.3,x,.8,0,c,true);
    for(const y of [.04,.55,1.05,1.57])box(g,1,.06,.3,0,y,0,c,true);
  }
  if(p.id==='armchair'){
    box(g,.72,.35,.7,0,.25,0,c,true);box(g,.76,.5,.15,0,.65,-.32,c,true);
    for(const x of [-.35,.35])box(g,.1,.28,.7,x,.55,0,c,true);
    box(g,.6,.1,.6,0,.48,.04,'#d4c7ac');
  }
  if (p.id === "bed") {
    box(g, 1.4, 0.25, 2.1, 0, 0.22, 0, "#ae865d");
    box(g, 1.37, 0.22, 2.04, 0, 0.45, 0, "#f2eddb");
    box(g, 1.39, 0.13, 1.35, 0, 0.59, 0.32, c, true);
    box(g, 1.44, 0.95, 0.1, 0, 0.55, -1, "#bc9c77");
    for (const x of [-0.36, 0.36])
      box(g, 0.56, 0.13, 0.38, x, 0.63, -0.65, "#e9e6d5");
    for (const x of [-0.55, 0.55])
      for (const z of [-0.85, 0.85])
        box(g, 0.08, 0.2, 0.08, x, 0.06, z, "#745a42");
  }
  if (p.id === "desk") {
    box(g, 1.35, 0.09, 0.65, 0, 0.82, 0, c, true);
    for (const x of [-0.57, 0.57])
      for (const z of [-0.23, 0.23])
        box(g, 0.06, 0.8, 0.06, x, 0.4, z, "#444d42");
    box(g, 0.45, 0.32, 0.4, 0.38, 0.57, 0, c, true);
    box(g, 0.12, 0.025, 0.02, 0.38, 0.56, 0.22, "#5d6754");
  }
  if (p.id === "chair") {
    box(g, 0.52, 0.1, 0.5, 0, 0.47, 0, c, true);
    box(g, 0.52, 0.53, 0.08, 0, 0.78, -0.23, c, true);
    for (const x of [-0.2, 0.2])
      for (const z of [-0.2, 0.2])
        box(g, 0.04, 0.44, 0.04, x, 0.22, z, "#343d34");
  }
  if (p.id === "shelf") {
    for (const x of [-0.4, 0.4]) box(g, 0.05, 1.75, 0.38, x, 0.88, 0, c, true);
    for (const y of [0.1, 0.6, 1.12, 1.73])
      box(g, 0.85, 0.05, 0.38, 0, y, 0, c, true);
    box(g, 0.82, 1.7, 0.025, 0, 0.9, -0.18, "#a58965");
    for (let i = 0; i < 6; i++)
      box(
        g,
        0.07,
        0.27 + Math.sin(i) * 0.04,
        0.22,
        -0.29 + i * 0.08,
        0.77,
        0,
        ["#687d68", "#b37151", "#cdb986"][i % 3],
      );
    box(g, 0.26, 0.24, 0.25, 0.14, 1.27, 0, "#e0d5bb");
  }
  if (p.id === "rug") {
    box(g, 1.5, 0.022, 1.6, 0, 0.003, 0, c, true);
    for (let z = -0.7; z < 0.8; z += 0.1)
      box(g, 1.34, 0.002, 0.018, 0, 0.016, z, "#e6c6a0");
  }
  if (p.id === "nightstand") {
    box(g, 0.48, 0.46, 0.48, 0, 0.33, 0, c, true);
    for (const x of [-0.18, 0.18])
      for (const z of [-0.18, 0.18])
        box(g, 0.05, 0.14, 0.05, x, 0.07, z, "#6b6549");
    box(g, 0.4, 0.015, 0.01, 0, 0.33, 0.245, "#8f7554");
    box(g, 0.1, 0.025, 0.02, 0, 0.42, 0.25, "#e9d8a6");
  }
  if (p.id === "plant") {
    cyl(g, 0.18, 0.13, 0.32, 0, 0.16, 0, c);
    cyl(g, 0.16, 0.16, 0.02, 0, 0.32, 0, "#5b4931");
    for (let i = 0; i < 8; i++) {
      const a = i * 2.4,
        h = 0.48 + i * 0.06;
      const stem = cyl(
        g,
        0.008,
        0.008,
        h - 0.3,
        Math.sin(a) * 0.07,
        0.3 + (h - 0.3) / 2,
        Math.cos(a) * 0.07,
        "#436344",
      );
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.16, 12, 8),
        material(i % 2 ? "#4b7045" : "#718b50"),
      );
      leaf.scale.set(0.7, 0.2, 1.6);
      leaf.position.set(Math.sin(a) * 0.15, h, Math.cos(a) * 0.15);
      leaf.rotation.set(0.3, a, 0.4);
      leaf.castShadow = true;
      g.add(leaf);
    }
  }
  if (p.id === "lamp") {
    cyl(g, 0.21, 0.21, 0.055, 0, 0.04, 0, "#525b43");
    cyl(g, 0.018, 0.018, 1.35, 0, 0.72, 0, "#525b43");
    cyl(g, 0.19, 0.28, 0.32, 0, 1.39, 0, c);
    const bulb = new THREE.PointLight("#ffcf8a", 1.6, 3);
    bulb.position.set(0, 1.24, 0);
    g.add(bulb);
  }
  if (p.id === "monitor") {
    box(g, 0.58, 0.34, 0.035, 0, 0.285, -0.02, c, true);
    box(g, 0.53, 0.285, 0.007, 0, 0.285, 0.001, "#83b7aa");
    box(g, 0.025, 0.17, 0.035, 0, 0.1, -0.02, c);
    box(g, 0.24, 0.02, 0.2, 0, 0.01, 0, c);
    box(g, 0.38, 0.009, 0.008, 0, 0.18, 0.007, "#cde9bd");
  }
  if (p.id === "pc") {
    box(g, 0.25, 0.46, 0.4, 0, 0.23, 0, c, true);
    box(g, 0.22, 0.41, 0.008, 0, 0.23, 0.205, "#182b2e");
    for (const y of [0.11, 0.24, 0.37]) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.06, 0.009, 8, 24),
        material(y === 0.24 ? "#cba7ed" : "#9bd9c2"),
      );
      ring.position.set(0, y, 0.215);
      g.add(ring);
    }
    box(g, 0.008, 0.37, 0.3, 0.129, 0.25, 0, "#536463");
  }
  if (p.id === "laptop") {
    box(g, 0.36, 0.018, 0.28, 0, 0.009, 0, c, true);
    box(g, 0.3, 0.008, 0.13, 0, 0.022, 0.01, "#465251");
    box(g, 0.09, 0.002, 0.045, 0, 0.02, 0.095, "#6b7e7c");
    const lid = new THREE.Group();
    lid.position.set(0, 0.015, -0.12);
    lid.rotation.x = -0.16;
    box(lid, 0.36, 0.23, 0.012, 0, 0.115, 0, c, true);
    box(lid, 0.325, 0.195, 0.004, 0, 0.118, 0.009, "#8bb8b1");
    g.add(lid);
  }
  if (p.id === "keyboard") {
    box(g, 0.38, 0.025, 0.14, 0, 0.013, 0, c, true);
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 12; col++)
        box(
          g,
          0.025,
          0.01,
          0.023,
          -0.164 + col * 0.029,
          0.032,
          -0.045 + row * 0.029,
          col === 0 ? "#96ad77" : "#616b65",
        );
  }
  if (p.id === "mouse") {
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), material(c));
    m.scale.set(0.032, 0.022, 0.052);
    m.position.y = 0.023;
    m.userData.tint = true;
    g.add(m);
    box(g, 0.003, 0.008, 0.018, 0, 0.045, -0.01, "#455d49");
  }
  if (p.id === "speakers") {
    box(g, 0.13, 0.22, 0.12, 0, 0.11, 0, c, true);
    for (const y of [0.07, 0.16]) {
      const m = cyl(g, 0.035, 0.035, 0.008, 0, y, 0.066, "#202c2c");
      m.rotation.x = Math.PI / 2;
    }
  }
  if (p.id === "tablelamp") {
    cyl(g, 0.08, 0.08, 0.018, 0, 0.009, 0, c).userData.tint = true;
    cyl(g, 0.012, 0.012, 0.23, 0, 0.125, 0, "#967c51");
    cyl(g, 0.065, 0.11, 0.14, 0, 0.3, 0, c).userData.tint = true;
    const light = new THREE.PointLight("#ffce83", 0.7, 1.5);
    light.position.set(0, 0.25, 0);
    g.add(light);
  }
  if (p.id === "succulent") {
    cyl(g, 0.06, 0.045, 0.09, 0, 0.045, 0, c).userData.tint = true;
    for (let i = 0; i < 7; i++) {
      const a = (i * Math.PI * 2) / 7,
        m = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 10, 8),
          material("#779364"),
        );
      m.scale.set(0.45, 1, 0.5);
      m.position.set(Math.sin(a) * 0.034, 0.135, Math.cos(a) * 0.034);
      m.rotation.z = Math.sin(a) * 0.6;
      g.add(m);
    }
  }
  if (p.id === "books") {
    for (let i = 0; i < 3; i++) {
      box(
        g,
        0.24 - i * 0.015,
        0.028,
        0.18,
        0,
        0.015 + i * 0.033,
        0,
        i === 1 ? "#7b9885" : c,
        true,
      );
      box(
        g,
        0.21 - i * 0.015,
        0.018,
        0.181,
        0,
        0.015 + i * 0.033,
        0.003,
        "#e7e1c8",
      );
    }
  }
  if (p.id === "mug") {
    cyl(g, 0.038, 0.034, 0.095, -0.015, 0.05, 0, c).userData.tint = true;
    cyl(g, 0.032, 0.032, 0.003, -0.015, 0.099, 0, "#5d4432");
    const m = new THREE.Mesh(
      new THREE.TorusGeometry(0.027, 0.007, 8, 18),
      material(c),
    );
    m.position.set(0.028, 0.05, 0);
    m.userData.tint = true;
    g.add(m);
  }
  if (p.id === "clock") {
    box(g, 0.2, 0.12, 0.08, 0, 0.06, 0, c, true);
    box(g, 0.16, 0.075, 0.005, 0, 0.065, 0.043, "#243d37");
    for (let i = 0; i < 4; i++)
      box(g, 0.023, 0.032, 0.004, -0.052 + i * 0.035, 0.065, 0.048, "#d6f3a5");
  }
  if (p.id === "headphones") {
    box(g, 0.14, 0.018, 0.14, 0, 0.009, 0, "#444e43");
    box(g, 0.012, 0.27, 0.012, 0, 0.145, 0, "#a4aa91");
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.072, 0.012, 8, 24, Math.PI),
      material(c),
    );
    arc.position.set(0, 0.21, 0);
    arc.userData.tint = true;
    g.add(arc);
    for (const x of [-0.072, 0.072])
      box(g, 0.035, 0.075, 0.055, x, 0.18, 0, c, true);
  }
  if (p.id === "bench" || p.id === "coffeetable") {
    const bench = p.id === "bench";
    box(g, p.w, 0.055, p.d, 0, p.h - 0.028, 0, c, true);
    for (const x of [-p.w / 2 + 0.07, p.w / 2 - 0.07])
      for (const z of [-p.d / 2 + 0.06, p.d / 2 - 0.06])
        box(g, 0.045, p.h - 0.055, 0.045, x, (p.h - 0.055) / 2, z, "#655d48");
  }
  if (p.id === "pouf") {
    cyl(g, 0.32, 0.3, 0.4, 0, 0.21, 0, c).userData.tint = true;
    cyl(g, 0.3, 0.3, 0.04, 0, 0.4, 0, c).userData.tint = true;
  }
  if (p.id === "drawer") {
    box(g, 1.1, 0.82, 0.5, 0, 0.49, 0, c, true);
    for (let i = 0; i < 3; i++) {
      box(g, 1.02, 0.24, 0.02, 0, 0.23 + i * 0.26, 0.26, c, true);
      box(g, 0.17, 0.022, 0.015, 0, 0.23 + i * 0.26, 0.275, "#656b51");
    }
    for (const x of [-0.44, 0.44])
      for (const z of [-0.18, 0.18])
        box(g, 0.055, 0.08, 0.055, x, 0.04, z, "#6c624b");
  }
  if (p.id === "smallrug") {
    box(g, 0.8, 0.022, 0.55, 0, 0.003, 0, c, true);
    for (let z = -0.22; z < 0.25; z += 0.07)
      box(g, 0.72, 0.002, 0.012, 0, 0.016, z, "#d9d8bd");
  }

  if (["deskcompact", "deskgamer", "deskstudio"].includes(p.id)) {
    box(g, p.w, 0.065, p.d, 0, p.h - 0.0325, 0, c, true);
    if (p.id === "deskstudio") {
      for (const x of [-p.w / 2 + 0.22, p.w / 2 - 0.22]) {
        box(g, 0.35, p.h - 0.065, p.d - 0.08, x, (p.h - 0.065) / 2, 0, c, true);
        for (const y of [0.2, 0.42, 0.64]) {
          box(g, 0.3, 0.018, 0.015, x, y, p.d / 2 - 0.026, "#785d45");
          box(g, 0.09, 0.024, 0.025, x, y + 0.07, p.d / 2 - 0.022, "#d5c39a");
        }
      }
    } else {
      for (const x of [-p.w / 2 + 0.09, p.w / 2 - 0.09]) {
        box(
          g,
          0.055,
          p.h - 0.065,
          0.055,
          x,
          (p.h - 0.065) / 2,
          0,
          p.id === "deskgamer" ? "#232c32" : "#676d58",
        );
        box(g, 0.09, 0.05, p.d - 0.06, x, 0.025, 0, "#333c36");
      }
      box(g, p.w - 0.18, 0.04, 0.04, 0, 0.22, -p.d / 2 + 0.1, "#424e43");
    }
    if (p.id === "deskgamer") {
      box(
        g,
        p.w - 0.08,
        0.016,
        0.012,
        0,
        p.h - 0.018,
        p.d / 2 + 0.002,
        "#a28cd7",
      );
      for (const x of [-0.7, 0.7])
        box(g, 0.018, 0.28, 0.018, x, 0.47, 0.03, "#9acdb4");
    }
  }
  if (["bedsingle", "bedqueen", "bedlow"].includes(p.id)) {
    const low = p.id === "bedlow",
      base = low ? 0.14 : 0.25,
      mattress = low ? 0.3 : 0.46;
    box(g, p.w, base, p.d, 0, base / 2 + 0.03, 0, low ? "#a7825a" : "#b99b7c");
    box(g, p.w - 0.1, 0.21, p.d - 0.09, 0, mattress, 0, "#eee7d7");
    box(
      g,
      p.w - 0.09,
      0.11,
      p.d * 0.62,
      0,
      mattress + 0.12,
      p.d * 0.13,
      c,
      true,
    );
    box(
      g,
      p.w,
      0.08,
      p.d * 0.08,
      0,
      mattress + 0.17,
      p.d * 0.27,
      low ? "#c1b58d" : "#d9c8b8",
    );
    box(g, p.w, 0.1, p.d * 0.08, 0, mattress + 0.17, p.d * 0.35, c, true);
    if (!low) box(g, p.w, p.h, 0.075, 0, p.h / 2, -p.d / 2 + 0.038, c, true);
    const count = p.id === "bedsingle" ? 1 : 2;
    for (let i = 0; i < count; i++)
      box(
        g,
        count === 1 ? 0.65 : p.w * 0.39,
        0.12,
        0.38,
        count === 1 ? 0 : (i === 0 ? -1 : 1) * p.w * 0.23,
        mattress + 0.16,
        -p.d * 0.31,
        "#f4eee0",
      );
    if (!low)
      for (const x of [-p.w / 2 + 0.1, p.w / 2 - 0.1])
        for (const z of [-p.d / 2 + 0.13, p.d / 2 - 0.13])
          box(g, 0.07, 0.09, 0.07, x, 0.045, z, "#665849");
  }
  if (["chairergo", "chairgamer"].includes(p.id)) {
    const gamer = p.id === "chairgamer";
    cyl(g, 0.035, 0.035, 0.38, 0, 0.27, 0, "#525d56");
    for (let i = 0; i < 5; i++) {
      const leg = new THREE.Group();
      leg.rotation.y = (i * Math.PI * 2) / 5;
      box(leg, 0.035, 0.035, 0.3, 0, 0.08, 0.14, "#3b4544");
      const wheel = cyl(leg, 0.035, 0.035, 0.035, 0, 0.04, 0.285, "#283133");
      wheel.rotation.z = Math.PI / 2;
      g.add(leg);
    }
    box(g, 0.5, 0.09, 0.5, 0, 0.49, 0, c, true);
    box(
      g,
      gamer ? 0.48 : 0.43,
      gamer ? 0.7 : 0.51,
      0.07,
      0,
      gamer ? 0.92 : 0.83,
      -0.22,
      gamer ? "#303940" : c,
      true,
    );
    if (gamer) {
      for (const x of [-0.19, 0.19])
        box(g, 0.07, 0.63, 0.095, x, 0.94, -0.17, c, true);
      box(g, 0.29, 0.14, 0.09, 0, 1.2, -0.18, c, true);
      box(g, 0.31, 0.12, 0.09, 0, 0.76, -0.15, c, true);
      for (const x of [-0.075, 0.075])
        box(g, 0.06, 0.065, 0.009, x, 1.14, -0.125, "#d8decb");
    } else {
      for (let y = 0.64; y < 1.07; y += 0.035)
        box(g, 0.38, 0.012, 0.009, 0, y, -0.18, "#4a5c55");
      box(g, 0.28, 0.13, 0.075, 0, 1.17, -0.2, c, true);
      box(g, 0.04, 0.15, 0.04, 0, 1.08, -0.25, "#424e45");
    }
    for (const x of [-0.29, 0.29]) {
      box(g, 0.035, 0.23, 0.035, x, 0.52, 0, "#424e45");
      box(g, 0.075, 0.045, 0.3, x, 0.65, 0, c, true);
    }
  }
  if (p.id === "chairstudio") {
    box(g, 0.53, 0.12, 0.49, 0, 0.48, 0, c, true);
    box(g, 0.53, 0.38, 0.085, 0, 0.71, -0.23, c, true);
    for (const x of [-0.21, 0.21])
      for (const z of [-0.2, 0.2])
        box(g, 0.045, 0.43, 0.045, x, 0.215, z, "#85745a");
  }
  // Ambientes V3: geometrias simplificadas em escala real.
  if(p.id==="sofa") {
    box(g,2.07,.18,.82,0,.40,0,c,true);
    box(g,2.07,.54,.15,0,.64,-.34,c,true);
    for(const x of [-.75,0,.75]) box(g,.61,.14,.58,x,.53,.07,c,true);
    for(const x of [-.99,.99]) box(g,.12,.48,.8,x,.48,0,c,true);
    for(const x of [-.9,.9])for(const z of [-.3,.3])box(g,.08,.2,.08,x,.1,z,"#62594c");
  }
  if(p.id==="tvstand") {
    box(g,1.48,.11,.42,0,.545,0,c,true);
    for(const x of [-.65,.65]) box(g,.12,.49,.40,x,.245,0,c,true);
    box(g,1.30,.29,.37,0,.23,0,c,true);
    box(g,.65,.08,.02,0,.32,.20,"#605a4a");
  }
  if(p.id==="tv") {
    box(g,1.18,.62,.055,0,.38,0,c,true);
    box(g,1.11,.55,.008,0,.38,.032,"#7da8af");
    box(g,.035,.08,.05,0,.08,0,c,true);
    box(g,.35,.02,.15,0,.01,0,c,true);
  }
  if(p.id==="diningtable") {
    box(g,1.5,.075,.9,0,.73,0,c,true);
    for(const x of [-.66,.66])for(const z of [-.37,.37])box(g,.08,.69,.08,x,.345,z,"#5c4c3d");
  }
  if(p.id==="toilet") {
    cyl(g,.19,.20,.37,0,.25,.09,c).userData.tint=true;
    box(g,.43,.06,.55,0,.45,.08,c,true);
    box(g,.44,.44,.16,0,.56,-.27,c,true);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.145,.034,8,30),material("#f9fbfa"));ring.rotation.x=Math.PI/2;ring.position.set(0,.495,.08);g.add(ring);
  }
  if(p.id==="sink") {
    box(g,.55,.72,.36,0,.36,0,"#8faaa2");
    box(g,.58,.12,.43,0,.80,0,c,true);
    box(g,.42,.018,.3,0,.855,.03,"#f9f9f4");
    cyl(g,.016,.016,.12,0,.79,-.13,"#919b9e");
  }
  if(p.id==="shower") {
    box(g,.9,.08,.9,0,.04,0,"#c5c8bd");
    for(const x of [-.43,.43])for(const z of [-.43,.43])box(g,.025,2.16,.025,x,1.15,z,"#839f9e");
    for(const z of [-.43,.43]) {
      const glass=box(g,.85,2.03,.014,0,1.17,z,"#95bdc2");glass.material.transparent=true;glass.material.opacity=.4;
    }
    for(const x of [-.43,.43]) {
      const glass=box(g,.014,2.03,.85,x,1.17,0,c,true);glass.material.transparent=true;glass.material.opacity=.25;
    }
    cyl(g,.075,.075,.024,0,2.12,-.37,"#b9bfc0");
  }
  if(p.id==="bathtub") {
    box(g,1.54,.58,.78,0,.30,0,c,true);
    box(g,1.37,.02,.62,0,.60,0,"#c2d4d4");
    for(const x of [-.76,.76])box(g,.025,.12,.78,x,.59,0,"#ffffff");
    for(const z of [-.37,.37])box(g,1.54,.12,.03,0,.59,z,"#ffffff");
  }
  if(p.id==="outdoorbench") {
    box(g,1.48,.1,.52,0,.47,0,c,true);
    box(g,1.48,.47,.09,0,.71,-.22,c,true);
    for(const x of [-.62,.62])for(const z of [-.18,.18])box(g,.07,.46,.07,x,.23,z,"#4d524b");
  }
  if(p.id==="patiotable") {
    box(g,.85,.06,.85,0,.70,0,c,true);
    for(const x of [-.34,.34])for(const z of [-.34,.34])box(g,.05,.67,.05,x,.335,z,"#5b645b");
  }
  if(p.id==="umbrella") {
    cyl(g,.17,.17,.06,0,.04,0,"#656c65");
    cyl(g,.025,.025,2.2,0,1.15,0,"#c2c9bd");
    const roof=new THREE.Mesh(new THREE.ConeGeometry(.79,.36,8),material(c));
    roof.position.set(0,2.16,0);roof.userData.tint=true;roof.castShadow=true;g.add(roof);
  }
  if(p.id==="planter") {
    cyl(g,.27,.19,.48,0,.24,0,c).userData.tint=true;
    cyl(g,.26,.26,.03,0,.495,0,"#6b5944");
    cyl(g,.018,.018,.52,0,.75,0,"#52754f");
    for(let i=0;i<7;i++) {
      const leaf=new THREE.Mesh(new THREE.SphereGeometry(.16,10,8),material(i%2?"#60865f":"#829f67"));
      leaf.scale.set(.7,.18,1);leaf.position.set(Math.sin(i*2.1)*.13,.69+i*.065,Math.cos(i*2.1)*.13);
      leaf.rotation.y=i*2.1;g.add(leaf);
    }
  }

if(p.id==='pool'){
 box(g,3,.12,2,0,.06,0,c,true);for(const x of [-1.43,1.43])box(g,.14,.75,2,x,.375,0,c,true);for(const z of [-.93,.93])box(g,3,.75,.14,0,.375,z,c,true);
 const water=box(g,2.7,.02,1.7,0,.58,0,'#4baec4');water.material.transparent=true;water.material.opacity=.8;water.material.roughness=.1;
}
if(p.id==='showerbox'){box(g,.95,.06,.95,0,.03,0,'#deded8');for(const x of [-.46,.46])for(const z of [-.46,.46])box(g,.025,2.1,.025,x,1.05,z,c,true);for(const x of [-.46,.46]){const pane=box(g,.015,2,.9,x,1.05,0,c,true);pane.material.transparent=true;pane.material.opacity=.3;}const front=box(g,.9,2,.015,0,1.05,.46,c,true);front.material.transparent=true;front.material.opacity=.22;box(g,.025,.25,.04,.1,1.1,.475,'#b7c5c4');box(g,.04,1.8,.04,0,.95,-.42,'#acb8b7');box(g,.2,.04,.2,0,1.9,-.33,'#bac6c5');}
if(['bathmat','outdoorrug'].includes(p.id)){box(g,p.w,.02,p.d,0,.01,0,c,true);for(let z=-p.d/2+.04;z<p.d/2;z+=.08)box(g,p.w-.08,.002,.012,0,.022,z,'#d5d8bf');}
if(p.id==='towelrack'){for(const x of [-.29,.29]){box(g,.035,1.05,.035,x,.525,0,c,true);box(g,.08,.035,.3,x,.018,0,c,true);}box(g,.6,.035,.035,0,1.02,0,c,true);box(g,.46,.55,.04,0,.73,.035,'#ded5bf',true);}
if(p.id==='soap'){box(g,.16,.025,.1,0,.013,0,c,true);box(g,.11,.035,.065,0,.043,0,'#ece9ce',true);}
if(p.id==='vaseflowers'){cyl(g,.085,.065,.22,0,.11,0,c).userData.tint=true;for(let i=0;i<5;i++){const a=i*1.25,x=Math.sin(a)*.07,z=Math.cos(a)*.07;cyl(g,.005,.005,.22,x,.31,z,'#607a4f');const f=new THREE.Mesh(new THREE.SphereGeometry(.045,10,8),material(i%2?'#dca6bb':'#e6d28a'));f.position.set(x,.43,z);g.add(f);}}
if(p.id==='cushion'){box(g,.4,.16,.4,0,.08,0,c,true);box(g,.35,.015,.35,0,.162,0,c,true);}
if(p.id==='candles'){for(const x of [-.06,.06]){cyl(g,.045,.045,x<0?.2:.14,x,x<0?.1:.07,0,c).userData.tint=true;box(g,.005,.02,.005,x,x<0?.21:.15,0,'#544a3a');}}
if(['sideboard','ottoman'].includes(p.id)){box(g,p.w,.1,p.d,0,p.h-.05,0,c,true);for(const x of [-p.w/2+.06,p.w/2-.06])for(const z of [-p.d/2+.06,p.d/2-.06])box(g,.04,p.h-.1,.04,x,(p.h-.1)/2,z,'#7c705b');}
if(p.id==='parasol'){cyl(g,.2,.2,.05,0,.025,0,'#6b7261');cyl(g,.025,.025,2.2,0,1.1,0,c);cyl(g,.04,.9,.3,0,2.25,0,c).userData.tint=true;}
if(p.id==='lounger'){box(g,.7,.1,1.85,0,.28,0,c,true);const back=box(g,.65,.1,.65,0,.46,-.57,c,true);back.rotation.x=.55;for(const x of [-.27,.27])for(const z of [-.65,.65])box(g,.04,.26,.04,x,.13,z,'#6f735b');}
if(p.id==='gardenlights'){cyl(g,.12,.12,.04,0,.02,0,c);cyl(g,.025,.025,.55,0,.3,0,c);box(g,.18,.15,.18,0,.625,0,'#e7dbb7',true);box(g,.24,.025,.24,0,.7,0,c,true);}
if(p.id==='basket'){cyl(g,.2,.17,.43,0,.215,0,c).userData.tint=true;cyl(g,.18,.18,.015,0,.435,0,'#6b6047');for(let y=.05;y<.44;y+=.06){const ring=new THREE.Mesh(new THREE.TorusGeometry(.18+y*.04,.008,6,24),material('#d5ba8d'));ring.rotation.x=Math.PI/2;ring.position.y=y;g.add(ring);}}
if(p.id==='bedtray'){box(g,.45,.018,.3,0,.009,0,c,true);for(const z of [-.14,.14])box(g,.45,.05,.02,0,.025,z,c,true);for(const x of [-.215,.215])box(g,.02,.05,.28,x,.025,0,c,true);}
  g.userData = { p, color: c };
  return g;
}
const initialBudget = 30000;
let balance = initialBudget,
  objects = [],
  queue = [],
  selected = null,
  night = false,
  drag = null,
  down = null,
  category = "quarto",
  toastTimer;
const ray = new THREE.Raycaster(),
  pointer = new THREE.Vector2(),
  plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
  hit = new THREE.Vector3();
function toast(s) {
  $("#toast").textContent = s;
  $("#toast").classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 3000);
}
function update() {
  $("#money").textContent = "∞ Livre";
  $("#spent").textContent =
    "Todos os itens disponíveis · sem limite de dinheiro";
  $("#budgetfill").style.width =
    "100%";
  $("#itemcount").textContent = String(objects.length).padStart(2, "0");
  $("#delivery").hidden = queue.length === 0;
  $("#deliverycount").textContent = "(" + queue.length + ")";
  const stats = [0, 0, 0];
  objects.forEach((o) => o.userData.p.stats.forEach((v, i) => (stats[i] += v)));
  $("#stats").innerHTML = ["Conforto", "Personalidade", "Funcionalidade"]
    .map(
      (s, i) =>
        `<div class="stat"><label>${s}<span>${Math.min(100, stats[i])}%</span></label><div class="bar"><div style="width:${Math.min(100, stats[i])}%"></div></div></div>`,
    )
    .join("");
  document.querySelectorAll("[data-buy]").forEach((b) => {
    b.disabled = false;
  });
}
// Render each catalog thumbnail with the same real 3D model as the room.
const thumbScene = new THREE.Scene();
thumbScene.background = new THREE.Color("#333d33");
thumbScene.add(new THREE.HemisphereLight("#fff4d6", "#536149", 3));
const tl = new THREE.DirectionalLight("#fff5dd", 4);
tl.position.set(3, 5, 4);
thumbScene.add(tl);
const tc = new THREE.PerspectiveCamera(35, 1, 0.1, 20);
const tr = new THREE.WebGLRenderer({ antialias: true });
tr.setSize(116, 116);
const thumbnails = {};
products.forEach((p) => {
  const g = model(p);
  thumbScene.add(g);
  const bounds = new THREE.Box3().setFromObject(g),
    center = bounds.getCenter(new THREE.Vector3()),
    size = bounds.getSize(new THREE.Vector3());
  const scale = Math.max(size.x, size.y, size.z);
  tc.position.set(scale * 1.7, scale * 1.4, scale * 2);
  tc.lookAt(center);
  tr.render(thumbScene, tc);
  thumbnails[p.id] = tr.domElement.toDataURL();
  thumbScene.remove(g);
  g.traverse((n) => {
    if (n.isMesh) {
      n.geometry.dispose();
      n.material.dispose();
    }
  });
});
tr.dispose();
function catalog() {
  $("#catalog").innerHTML = products
    .filter((p) => productRooms(p).includes(category))
    .map(
      (p) =>
        `<div class="product"><img src="${thumbnails[p.id]}" alt="${p.name}"><div><strong>${p.name}</strong><small>Livre</small></div><button data-buy="${p.id}" aria-label="Comprar ${p.name}" title="Comprar">+</button></div>`,
    )
    .join("");
  update();
}
$("#catalog").onclick = (e) => {
  const b = e.target.closest("[data-buy]");
  if (!b) return;
  const p = products.find((p) => p.id === b.dataset.buy);

  queue.push(p); makePackage(); update(); saveProject();
  toast(p.name + " chegou! Abra a entrega.");
};
document.querySelectorAll("[data-cat]").forEach(
  (b) =>
    (b.onclick = () => {
      category = b.dataset.cat;
      document
        .querySelectorAll("[data-cat]")
        .forEach((x) => x.classList.toggle("active", x === b));
      catalog();
    }),
);
let parcel = null;
function makePackage() {
  if (parcel) return;
  parcel = new THREE.Group();
  box(parcel, 0.6, 0.46, 0.5, 0, 0.23, 0, "#b78b54");
  box(parcel, 0.12, 0.005, 0.51, 0, 0.465, 0, "#dec794");
  box(parcel, 0.125, 0.46, 0.004, 0, 0.23, 0.252, "#dec794");
  parcel.position.set(roomSize / 2 - 0.7, 0, -roomDepth / 2 + 0.9);
  scene.add(parcel);
}
// Footprints rotate by 90 degrees. Heights allow objects to share floor area at different levels.
function dims(o, angle = o.rotation.y) {
  const p = o.userData.p,
    swap = Math.abs(Math.sin(angle)) > 0.5;
  return swap ? [p.d, p.w] : [p.w, p.d];
}
function isRug(o) {
  return ["rug", "smallrug", "bathmat", "outdoorrug", "grasspatch"].includes(o.userData.p.id);
}
function valid(o, x, z, angle = o.rotation.y, y = o.position.y) {
  const [w, d] = dims(o, angle),
    limitX = roomSize / 2 - 0.06, limitZ = roomDepth / 2 - 0.06;
  if (
    x - w / 2 < -limitX ||
    x + w / 2 > limitX ||
    z - d / 2 < -limitZ ||
    z + d / 2 > limitZ
  )
    return false;
  return !objects.some((other) => {
    if (other === o || isRug(other) || isRug(o)) return false;
    const [ow, od] = dims(other),
      oy = other.position.y;
    const vertical =
      y < oy + other.userData.p.h - 0.008 && y + o.userData.p.h > oy + 0.008;
    return (
      vertical &&
      Math.abs(x - other.position.x) < (w + ow) / 2 + 0.008 &&
      Math.abs(z - other.position.z) < (d + od) / 2 + 0.008
    );
  });
}
function descendants(o) {
  const out = [];
  function visit(parent) {
    objects
      .filter((x) => x.userData.support === parent)
      .forEach((x) => {
        out.push(x);
        visit(x);
      });
  }
  visit(o);
  return out;
}
function fitsSurface(o, parent, x, z, angle = o.rotation.y) {
  const [w, d] = dims(o, angle),
    [pw, pd] = dims(parent);
  return (
    Math.abs(x - parent.position.x) + w / 2 <= pw / 2 - 0.012 &&
    Math.abs(z - parent.position.z) + d / 2 <= pd / 2 - 0.012
  );
}
function destination(o, x, z, angle = o.rotation.y) {
  if (o.userData.p.small) {
    const excluded = new Set([o, ...descendants(o)]);
    const surfaces = objects
      .filter(
        (a) =>
          !excluded.has(a) &&
          a.userData.p.surface &&
          fitsSurface(o, a, x, z, angle),
      )
      .sort(
        (a, b) =>
          b.position.y +
          b.userData.p.surface -
          (a.position.y + a.userData.p.surface),
      );
    for (const parent of surfaces) {
      const y = parent.position.y + parent.userData.p.surface;
      if (valid(o, x, z, angle, y)) return { y, parent };
    } // Prevent a small object from dropping through a occupied tabletop.
    if (surfaces.length) return null;
  }
  return valid(o, x, z, angle, 0) ? { y: 0, parent: null } : null;
}
function put(o, x, z, angle = o.rotation.y) {
  const dest = destination(o, x, z, angle);
  if (!dest) return false;
  const children = descendants(o),
    all = [o, ...children],
    before = all.map((a) => ({
      o: a,
      x: a.position.x,
      y: a.position.y,
      z: a.position.z,
      angle: a.rotation.y,
    }));
  const delta = angle - o.rotation.y,
    cos = Math.cos(delta),
    sin = Math.sin(delta),
    old = o.position.clone();
  for (const a of children) {
    const dx = a.position.x - old.x,
      dz = a.position.z - old.z;
    a.position.set(
      x + cos * dx + sin * dz,
      a.position.y + dest.y - old.y,
      z - sin * dx + cos * dz,
    );
    a.rotation.y += delta;
  }
  o.position.set(x, dest.y, z);
  o.rotation.y = angle;
  if (
    all.some(
      (a) => !valid(a, a.position.x, a.position.z, a.rotation.y, a.position.y),
    )
  ) {
    before.forEach((b) => {
      b.o.position.set(b.x, b.y, b.z);
      b.o.rotation.y = b.angle;
    });
    return false;
  }
  o.userData.support = dest.parent;
  return true;
}
function place(o) {
  if (o.userData.p.small) {
    const surfaces = objects
      .filter((a) => a.userData.p.surface)
      .sort((a, b) => a.position.y - b.position.y);
    for (const parent of surfaces) {
      const [w, d] = dims(parent);
      for (
        let z = parent.position.z - d / 2 + 0.04;
        z <= parent.position.z + d / 2;
        z += 0.05
      )
        for (
          let x = parent.position.x - w / 2 + 0.04;
          x <= parent.position.x + w / 2;
          x += 0.05
        ) {
          if (fitsSurface(o, parent, x, z) && put(o, x, z)) return true;
        }
    }
  }
  const limitX = roomSize / 2 - 0.1, limitZ = roomDepth / 2 - 0.1;
  for (let z = -limitZ; z <= limitZ; z += 0.15)
    for (let x = -limitX; x <= limitX; x += 0.15) if (put(o, x, z)) return true;
  return false;
}
$("#delivery").onclick = () => {
  if (!queue.length) return;
  const p = queue[0],
    o = newInstance(p);
  if (!place(o)) {
    o.traverse((n) => {
      if (n.isMesh) {
        n.geometry.dispose();
        n.material.dispose();
      }
    });
    toast("Não há espaço livre. Reorganize ou venda um móvel.");
    return;
  }
  queue.shift();
  objects.push(o);
  scene.add(o);
  if (!queue.length) {
    scene.remove(parcel);
    parcel.traverse((n) => {
      if (n.isMesh) {
        n.geometry.dispose();
        n.material.dispose();
      }
    });
    parcel = null;
  }
  select(o);
  update(); saveProject();
  toast(
    p.name +
      (o.userData.support
        ? " sobre " + o.userData.support.userData.p.name
        : " no quarto") +
      ". Arraste para posicionar!",
  );
};
let outline;
function select(o) {
 if(o){let i=0;const parts=[];o.traverse(n=>{if(n.isMesh)parts.push(`<option value="${i++}">Parte ${i}</option>`)});$('#itempart').innerHTML='<option value="all">Tudo</option>'+parts.join('');$('#partcolor').value=o.userData.color;}
  selected = o;
  if (outline) {
    scene.remove(outline);
    outline.geometry.dispose();
    outline.material.dispose();
    outline = null;
  }
  $("#selection").hidden = !o || exploring;
  if (o) {
    $("#selectedname").textContent = o.userData.p.name;
    $("#itemcolor").value = o.userData.color;
    $("#selection span").textContent = o.userData.p.small
      ? "Encaixa sobre móveis · Arraste para mover"
      : "Arraste para mover";
    outline = new THREE.BoxHelper(o, "#d4f577");
    scene.add(outline);
  }
}
$("#rotate").onclick = () => {
  if (!selected) return;
  if (
    !put(
      selected,
      selected.position.x,
      selected.position.z,
      selected.rotation.y + Math.PI / 2,
    )
  ) {
    toast("Precisa de mais espaço para girar o móvel e seus itens.");
    return;
  }
  outline.update(); saveProject();
};
$("#itemcolor").oninput = (e) => {
  if (!selected) return;
  selected.userData.color = e.target.value;
  tintObject(selected, e.target.value); saveProject();
};
$("#sell").onclick = () => {
  if (!selected) return;
  const o = selected;
  if (descendants(o).length) {
    toast("Retire os objetos de cima antes de vender este móvel.");
    return;
  }
  
  objects = objects.filter((x) => x !== o);
  scene.remove(o);
  select(null);
  o.traverse((n) => {
    if (n.isMesh) {
      n.geometry.dispose();
      n.material.dispose();
    }
  });
  update(); saveProject();
  toast("Item removido.");
};
function cast(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.set(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    (-(e.clientY - rect.top) / rect.height) * 2 + 1,
  );
  ray.setFromCamera(pointer, camera);
}
renderer.domElement.addEventListener("pointerdown", (e) => {
  down = { x: e.clientX, y: e.clientY };
  if (exploring) {
    lookDrag = down;
    renderer.domElement.setPointerCapture(e.pointerId);
    return;
  }
  if(painting){e.stopImmediatePropagation();paintFloor(e);return;}
  cast(e);
  const openings=currentSpace==='externa'?[]:[windowGroup,doorGroup,...extraGroup.children,...extraDoorGroup.children,balconyGroup].filter(g=>g&&g.visible);
  const candidates=ray.intersectObjects([...objects,...openings],true).filter(h=>h.object.visible);
  if(candidates.length){let root=candidates[0].object;while(root.parent&&!objects.includes(root)&&!openings.includes(root))root=root.parent;
    if(openings.includes(root)){
      select(null);openingDrag={kind:root===windowGroup?'window':root===doorGroup?'door':root===balconyGroup?'balcony':extraDoorGroup.children.includes(root)?'extraDoor':'extra',index:extraDoorGroup.children.includes(root)?extraDoorGroup.children.indexOf(root):extraGroup.children.indexOf(root),height:root===balconyGroup?Math.max(.01,candidates[0].point.y):root.position.y};
      controls.enabled=false;renderer.domElement.setPointerCapture(e.pointerId);
      $('#hint').textContent='Arraste até a parede desejada. O vão acompanha a abertura.';return;
    }
  }
  const hits = ray.intersectObjects(objects, true);
  if (hits.length) {
    let o = hits[0].object;
    while (o.parent && !objects.includes(o)) o = o.parent;
    select(o);
    plane.constant = -o.position.y;
    ray.ray.intersectPlane(plane, hit);
    drag = {
      o,
      offset: o.position.clone().sub(hit),
      original: o.position.clone(),
    };
    controls.enabled = false;
    renderer.domElement.setPointerCapture(e.pointerId);
  } else select(null);
});
renderer.domElement.addEventListener("pointermove", (e) => {
  if (exploring && lookDrag) {
    yaw -= (e.clientX - lookDrag.x) * 0.005;
    pitch = Math.max(-1, Math.min(1, pitch - (e.clientY - lookDrag.y) * 0.004));
    lookDrag = { x: e.clientX, y: e.clientY };
    return;
  }
  if(openingDrag){cast(e);const p=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-openingDrag.height),new THREE.Vector3());if(p)moveOpening(p);return;}
  if (!drag) return;
  cast(e);
  // Project onto tabletops first, so the pointer follows the actual support height.
  if (drag.o.userData.p.small) {
    const excluded = new Set([drag.o, ...descendants(drag.o)]),
      candidates = [];
    for (const parent of objects) {
      if (excluded.has(parent) || !parent.userData.p.surface) continue;
      const top = new THREE.Plane(
        new THREE.Vector3(0, 1, 0),
        -(parent.position.y + parent.userData.p.surface),
      );
      const point = ray.ray.intersectPlane(top, new THREE.Vector3());
      if (!point) continue;
      const x = Math.round((point.x + drag.offset.x) * 20) / 20,
        z = Math.round((point.z + drag.offset.z) * 20) / 20;
      if (fitsSurface(drag.o, parent, x, z))
        candidates.push({ x, z, distance: point.distanceTo(camera.position) });
    }
    candidates.sort((a, b) => a.distance - b.distance);
    if (candidates.length) {
      for (const c of candidates)
        if (put(drag.o, c.x, c.z)) {
          outline.update();
          break;
        }
      return;
    }
  }
  plane.constant = 0;
  if (ray.ray.intersectPlane(plane, hit)) {
    const x = Math.round((hit.x + drag.offset.x) * 20) / 20,
      z = Math.round((hit.z + drag.offset.z) * 20) / 20;
    if (put(drag.o, x, z)) outline.update();
  }
});
function moveOpening(p){
 const side=[['left',Math.abs(p.x+roomSize/2)],['right',Math.abs(p.x-roomSize/2)],['back',Math.abs(p.z+roomDepth/2)],['front',Math.abs(p.z-roomDepth/2)]].sort((a,b)=>a[1]-b[1])[0][0];
 const coord={left:-p.z,right:p.z,back:p.x,front:-p.x}[side],width=openingDrag.kind==='balcony'?2.4:['door','extraDoor'].includes(openingDrag.kind)?.86:1.72;
 const offset=Math.max(0,Math.min(100,50+coord/Math.max(.01,wallLength(side)-width-.32)*100));
 if(openingDrag.kind==='balcony'){balconySide=side;balconyOffset=offset;buildRoom();syncCustom();return;}
 const before={windowSide,doorSide,windowOffset,doorOffset,extra:extraWindows.map(w=>({...w})),doors:extraDoors.map(d=>({...d}))};
 if(openingDrag.kind==='window'){windowSide=side;windowOffset=offset;}
 else if(openingDrag.kind==='door'){doorSide=side;doorOffset=offset;}
 else if(openingDrag.kind==='extraDoor')Object.assign(extraDoors[openingDrag.index],{side,offset});
 else Object.assign(extraWindows[openingDrag.index],{side,offset});
 if(!extraValid()){windowSide=before.windowSide;windowOffset=before.windowOffset;doorSide=before.doorSide;doorOffset=before.doorOffset;extraWindows=before.extra;extraDoors=before.doors;return;}
 buildRoom();syncCustom();
 for(const [key,val] of Object.entries({windowside:windowSide,doorside:doorSide,windowposition:windowOffset,doorposition:doorOffset}))$('#'+key).value=val;
 $('#windowposlabel').textContent=Math.round(windowOffset)+'%';$('#doorposlabel').textContent=Math.round(doorOffset)+'%';
}
function release() {
  if(openingDrag){openingDrag=null;saveProject();$('#hint').textContent='Arraste para girar a câmera · Role para aproximar';}
  if (drag) { if(selected)fillItemDimensions(selected); saveProject(); }
  drag = null;
  lookDrag = null;
  controls.enabled = !exploring&&!painting;
}
renderer.domElement.addEventListener("pointerup", release);
renderer.domElement.addEventListener("pointercancel", release);
function colors(target, arr, apply) {
  $(target).innerHTML = arr
    .map(
      (c, i) =>
        `<button class="${i === 0 ? "active" : ""}" style="background:${c}" data-color="${c}" aria-label="Cor ${c}"></button>`,
    )
    .join("");
  $(target).onclick = (e) => {
    const b = e.target.closest("[data-color]");
    if (!b) return;
    $(target)
      .querySelectorAll("button")
      .forEach((x) => x.classList.toggle("active", x === b));
    apply(b.dataset.color);
  };
}
colors(
  "#wallcolors",
  ["#d9dfc7", "#bccbd0", "#d1b6a2", "#8c9a80", "#747d87"],
  (c) => {
    wallColor = c;
    $("#wallcustom").value = c;
    walls.forEach((w) => w.material.color.set(c));
    saveProject();
  },
);
colors("#floorcolors", ["#ae906f", "#cfb694", "#746047", "#bac0b2"], (c) => {
  floorColor = c;tileBase={...tileBase,color:c};tilePaint={};buildTiles();
  floor.material.color.set(c);
  lines.children.forEach((x) =>
    x.material.color.set(new THREE.Color(c).multiplyScalar(0.78)),
  );
  saveProject();
});
$("#day").onclick = () => {
  night = !night;
  hemi.intensity = night ? 0.55 : 2.3;
  sun.intensity = night ? 0.25 : 3.5;
  sun.color.set(night ? "#849cdb" : "#fff3d4");
  warm.intensity = night ? 3 : 0;
  scene.background.set(night ? "#222b32" : "#39463d");
  scene.fog.color.copy(scene.background);
  ground.material.color.copy(scene.background);
  $("#day").textContent = night ? "☾ Noite" : "☀ Dia";
};
const savedCam = new THREE.Vector3();
let yaw = 0,
  pitch = 0,
  lookDrag = null;
const keys = {};
function mode(walk) {
  if(walk&&painting){painting=false;$("#paintfloor").textContent="Pintar quadrados";}
  if (walk === exploring) return;
  exploring = walk;
  host.classList.toggle("exploring", walk);
  $("#explore").classList.toggle("active", walk);
  $("#edit").classList.toggle("active", !walk);
  $("#walkcontrols").hidden = !walk;
  $("#selection").hidden = walk || !selected;
  controls.enabled = !walk;
  applyWalls();
  if (walk) {
    savedCam.copy(camera.position);
    let spawn = null;
    for (let z = roomDepth / 2 - 0.25; z > -roomDepth / 2 && !spawn; z -= 0.25)
      for (let x = roomSize / 2 - 0.25; x > -roomSize / 2; x -= 0.25)
        if (canWalk(x, z)) {
          spawn = { x, z };
          break;
        }
    if (!spawn) {
      exploring = false;
      host.classList.remove("exploring");
      $("#explore").classList.remove("active");
      $("#edit").classList.add("active");
      $("#walkcontrols").hidden = true;
      controls.enabled = true;
      applyWalls();
      toast("Abra um espaço para entrar no quarto.");
      return;
    }
    camera.position.set(spawn.x, 1.6, spawn.z);
    yaw = Math.PI / 4;
    pitch = 0;
    $("#hint").textContent =
      "WASD para andar · Arraste para olhar · Esc para sair";
  } else {
    camera.position.copy(savedCam);
    camera.lookAt(controls.target);
    $("#hint").textContent =
      "Arraste para girar a câmera · Role para aproximar";
  }
  Object.keys(keys).forEach((k) => (keys[k] = false));
}
$("#explore").onclick = () => mode(true);
$("#edit").onclick = () => mode(false);
$("#resetcam").onclick = () => {
  mode(false);
  recenter();
};
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    mode(false);
    select(null);
  }
  if (exploring && !e.target.matches("input")) {
    keys[e.key.toLowerCase()] = true;
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
      ].includes(e.key)
    )
      e.preventDefault();
  }
});
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));
window.addEventListener("blur", () =>
  Object.keys(keys).forEach((k) => (keys[k] = false)),
);
document.querySelectorAll("[data-walk]").forEach((b) => {
  b.onpointerdown = (e) => {
    e.preventDefault();
    b.setPointerCapture(e.pointerId);
    keys[b.dataset.walk] = true;
  };
  b.onpointerup = b.onpointercancel = () => (keys[b.dataset.walk] = false);
});
function onBalcony(x,z){
 if(!balcony||currentSpace==='externa')return false;
 const transform=new THREE.Group();wallTransform(transform,balconySide,0);const center=openingCenter(balconySide,balconyOffset,2.4);transform.translateX(center);transform.updateMatrixWorld();
 const p=transform.worldToLocal(new THREE.Vector3(x,0,z));
 if(Math.abs(p.x)<1.02&&p.z<-.2&&p.z>-1.38)return true;
 const doors=[...(doorEnabled?[{side:doorSide,offset:doorOffset}]:[]),...extraDoors];
 return p.z<=.2&&p.z>=-.25&&Math.abs(p.x)<1.02&&doors.some(d=>d.side===balconySide&&Math.abs(p.x-(openingCenter(d.side,d.offset,.86)-center))<.3);
}
function canWalk(x, z) {
 if(onBalcony(x,z))return true;
  return (
    Math.abs(x) < roomSize / 2 - 0.18 &&
    Math.abs(z) < roomDepth / 2 - 0.18 &&
    !objects.some((o) => {
      if (
        isRug(o) ||
        o.position.y >= 1.6 ||
        o.position.y + o.userData.p.h < 0.25
      )
        return false;
      const [w, d] = dims(o);
      return (
        Math.abs(x - o.position.x) < w / 2 + 0.13 &&
        Math.abs(z - o.position.z) < d / 2 + 0.13
      );
    })
  );
}
// Apply exact floor measurements without resizing placed furniture automatically.
function changeDimensions(width,depth) {
  width=clampMeters(width); depth=clampMeters(depth);
  if(width===null || depth===null) { toast("Use medidas entre 2 e 12 metros."); return false; }
  const ow=roomSize, od=roomDepth;
  roomSize=width; roomDepth=depth;
  if(openingsOverlap() || !extraValid() || objects.some(o=>!valid(o,o.position.x,o.position.z))) {
    roomSize=ow; roomDepth=od;
    toast("As novas medidas cruzam móveis ou sobrepõem a porta e a janela. Reorganize antes de reduzir.");
    return false;
  }
  mode(false); buildRoom();
  if(parcel) parcel.position.set(roomSize/2-.7,0,-roomDepth/2+.9);
  $("#roomdimensions").textContent=roomSize.toLocaleString("pt-BR")+" × "+roomDepth.toLocaleString("pt-BR")+" m";
  $("#roomwidth").value=roomSize; $("#roomdepth").value=roomDepth;
  recenter(); saveProject();
  toast("Medidas atualizadas com escala real (1 unidade = 1 metro).");
  return true;
}
$("#applysize").onclick=()=>changeDimensions($("#roomwidth").value,$("#roomdepth").value);
$("#wallswitch").onclick=()=>{
  allWalls=!allWalls; applyWalls();
  $("#wallswitch").classList.toggle("active",allWalls);
};
$("#gridtoggle").onclick=()=>{
  showGrid=!showGrid;applyWalls();
  $("#gridtoggle").classList.toggle("active",showGrid);
};
// Style selectors and free color pickers also work on narrow screens.
$("#windowstyle").onchange = (e) => {
  windowStyle = e.target.value;
  buildRoom(); saveProject();
};
$("#doorstyle").onchange = (e) => {
  doorStyle = e.target.value;
  buildRoom(); saveProject();
};
$("#windowcolor").oninput = (e) => {
  windowColor = e.target.value;
  buildArchitecture(); saveProject();
};
$("#doorcolor").oninput = (e) => {
  doorColor = e.target.value;
  buildArchitecture(); saveProject();
};
$("#wallcustom").oninput=e=>{const side=$('#walltarget').value;if(side==='all'){wallColor=e.target.value;wallPaint={}}else wallPaint[side]=e.target.value;buildRoom();saveProject();};

// --------------------------------------------------------------------------
// V3: Multiple independent spaces, real furniture measurements, persistence.
// --------------------------------------------------------------------------
const SPACE_IDS=["quarto","sala","banheiro","externa"];
const SPACE_DEFAULTS={
  quarto:{width:4,depth:4,wallColor:"#d9dfc7",floorColor:"#ae906f"},
  sala:{width:5,depth:4,wallColor:"#ded9c9",floorColor:"#b89c7c"},
  banheiro:{width:3,depth:3,wallColor:"#c9dce0",floorColor:"#bac0b2"},
  externa:{width:6,depth:5,wallColor:"#b9c4a6",floorColor:"#746047"}
};
function initialSpace(id) { return {
  ...SPACE_DEFAULTS[id], items:[], queue:[],
  windowStyle:"normal",doorStyle:"normal",windowColor:"#f1e9d4",doorColor:"#a4ae95",
  windowSide:"left",doorSide:"back",windowOffset:50,doorOffset:76
}; }
let spaces=Object.fromEntries(SPACE_IDS.map(id=>[id,initialSpace(id)]));
let nextInstanceId=0;
const STORAGE_KEY="roomlab:v3:project";
const safeColor=c=> /^#[0-9a-f]{6}$/i.test(c||"") ? c : null;
const finite=(n,def,min,max)=>Number.isFinite(Number(n)) ? Math.max(min,Math.min(max,Number(n))):def;
function newInstance(p, id) {
  const o=model(p);
  o.userData.instanceId=id || "item-"+(++nextInstanceId);
  return o;
}
function tintObject(o,c) {o.userData.color=c;o.userData.parts={};
  o.traverse(n=>{if(n.isMesh)n.material.color.set(c);});
}
function setDimensions(o,w,d,h) {
  const base=products.find(p=>p.id===o.userData.p.id);
  if(!base) return;
  o.userData.p={...base,w,d,h,
    ...(base.surface ? {surface:base.surface*(h/base.h)} : {})};
  o.scale.set(w/base.w,h/base.h,d/base.d);
}
function objectData(o) {return {
  uid:o.userData.instanceId, id:o.userData.p.id,
  x:o.position.x,z:o.position.z,y:o.position.y,
  rot:o.rotation.y, w:o.userData.p.w,d:o.userData.p.d,h:o.userData.p.h,
  color:o.userData.color,parts:o.userData.parts||{},
  support:o.userData.support?.userData.instanceId || null
};}
function captureSpace() { spaces[currentSpace]={
  width:roomSize,depth:roomDepth,wallColor,floorColor,extraWindows,tilePaint,tileBase,wallPaint,yardFence,yardColor,balcony,doorEnabled,extraDoors,balconySide,balconyOffset,
  windowStyle,doorStyle,windowColor,doorColor,windowSide,doorSide,windowOffset,doorOffset,
  items:objects.map(objectData),queue:queue.map(p=>p.id)
}; }
function saveProject(){
  try { captureSpace();localStorage.setItem(STORAGE_KEY, JSON.stringify({schema:3,balance,currentSpace,spaces})); }
  catch(e) { console.warn("ROOMLAB: armazenamento não disponível",e); }
}
function validateSpace(raw,id) {
  const def=initialSpace(id);
  if(!raw || typeof raw!=="object") return def;
  return {
    doorEnabled:raw.doorEnabled!==false,
    extraDoors:Array.isArray(raw.extraDoors)?raw.extraDoors.slice(0,24).filter(d=>['left','right','back','front'].includes(d.side)).map(d=>({side:d.side,offset:finite(d.offset,50,0,100),color:safeColor(d.color)||'#a4ae95',style:['normal','wood','blindex','minecraft','sliding'].includes(d.style)?d.style:'normal'})):[],
    balconySide:['left','right','back','front'].includes(raw.balconySide)?raw.balconySide:(['left','right','back','front'].includes(raw.doorSide)?raw.doorSide:'back'),balconyOffset:finite(raw.balconyOffset,raw.doorOffset??76,0,100),
    extraWindows:Array.isArray(raw.extraWindows)?raw.extraWindows.slice(0,24).filter(w=>['left','right','back','front'].includes(w.side)).map(w=>({side:w.side,offset:finite(w.offset,50,0,100),color:safeColor(w.color)||'#f1e9d4',style:['normal','wood','blindex','minecraft'].includes(w.style)?w.style:'normal'})):[],
    tilePaint:cleanTiles(raw.tilePaint),tileBase:cleanFinish(raw.tileBase,id==='externa'?'concrete':'wood'),
    wallPaint:Object.fromEntries(Object.entries(raw.wallPaint||{}).filter(([k,v])=>['left','right','back','front'].includes(k)&&safeColor(v))),
    yardFence:['none','wood','wall'].includes(raw.yardFence)?raw.yardFence:'wood',yardColor:safeColor(raw.yardColor)||'#98704e',balcony:raw.balcony===true,
    width:finite(raw.width,def.width,2,12), depth:finite(raw.depth,def.depth,2,12),
    wallColor:safeColor(raw.wallColor)||def.wallColor,floorColor:safeColor(raw.floorColor)||def.floorColor,
    windowColor:safeColor(raw.windowColor)||def.windowColor,doorColor:safeColor(raw.doorColor)||def.doorColor,
    windowStyle:["normal","blindex","wood","minecraft"].includes(raw.windowStyle)?raw.windowStyle:def.windowStyle,
    doorStyle:["normal","blindex","wood","minecraft","sliding"].includes(raw.doorStyle)?raw.doorStyle:def.doorStyle,
    windowSide:["left","right","back","front"].includes(raw.windowSide)?raw.windowSide:def.windowSide,
    doorSide:["left","right","back","front"].includes(raw.doorSide)?raw.doorSide:def.doorSide,
    windowOffset:finite(raw.windowOffset,50,0,100),doorOffset:finite(raw.doorOffset,76,0,100),
    items:Array.isArray(raw.items)?raw.items.slice(0,300):[],
    queue:Array.isArray(raw.queue)?raw.queue.slice(0,300).filter(id=>products.some(p=>p.id===id)):[]
  };
}
function readProject(data) {
  if(!data || data.schema!==3 || !data.spaces) throw new Error("Arquivo incompatível: é necessário um projeto ROOMLAB V3.");
  const next=Object.fromEntries(SPACE_IDS.map(id=>[id,validateSpace(data.spaces[id],id)]));
  const active=SPACE_IDS.includes(data.currentSpace)?data.currentSpace:"quarto";
  const newBalance=finite(data.balance,initialBudget,0,initialBudget);
  return {spaces:next,currentSpace:active,balance:newBalance};
}
function recenter() {
  const size=Math.max(roomSize,roomDepth);
  camera.position.set(size*1.65,size*1.5,size*1.85);
  controls.target.set(0,.8,0);
  controls.minDistance=Math.max(3,size*.9);
  controls.maxDistance=Math.max(25,size*4);
}
function showSpace(id) {
  if(!SPACE_IDS.includes(id)) return;
  painting=false;$("#paintfloor").textContent="Pintar quadrados";controls.enabled=true;mode(false); select(null);
  objects.forEach(o=>disposeGroup(o)); objects=[];
  if(parcel) {disposeGroup(parcel);parcel=null;}
  const state=spaces[id]; currentSpace=id;
  roomSize=state.width;roomDepth=state.depth;
  doorEnabled=state.doorEnabled!==false;extraDoors=state.extraDoors||[];balconySide=state.balconySide||state.doorSide;balconyOffset=state.balconyOffset??state.doorOffset;
  extraWindows=state.extraWindows||[];tilePaint=state.tilePaint||{};tileBase=state.tileBase||{type:id==='externa'?'concrete':'wood',color:id==='externa'?'#919898':state.floorColor};wallPaint=state.wallPaint||{};yardFence=state.yardFence||'wood';yardColor=state.yardColor||'#98704e';balcony=state.balcony||false;
  wallColor=state.wallColor;floorColor=state.floorColor;
  windowStyle=state.windowStyle;doorStyle=state.doorStyle;
  windowColor=state.windowColor;doorColor=state.doorColor;
  windowSide=state.windowSide;doorSide=state.doorSide;
  windowOffset=state.windowOffset;doorOffset=state.doorOffset;
  // Avoid overlapping openings in imported projects.
  if(openingsOverlap()) doorSide=windowSide === "back" ? "right" : "back";
  const importedDoors=extraDoors;extraDoors=[];
  const importedWindows=extraWindows;extraWindows=[];for(const win of importedWindows)if(extraValid([...extraWindows,win]))extraWindows.push(win);
  for(const d of importedDoors){extraDoors.push(d);if(!extraValid())extraDoors.pop();}
  if(tileBase.type==='grass'||Object.values(tilePaint).some(f=>f.type==='grass')){
    for(let i=0;i<Math.ceil(roomSize/.5);i++)for(let j=0;j<Math.ceil(roomDepth/.5);j++){
      const key=i+','+j,f=tilePaint[key]||tileBase;
      if(f.type==='grass')state.items.push({id:'grasspatch',uid:'item-'+(++nextInstanceId),x:-roomSize/2+i*.5+.25,z:-roomDepth/2+j*.5+.25,y:0,w:Math.min(.5,roomSize-i*.5),d:Math.min(.5,roomDepth-j*.5),h:.09,color:f.color});
    }
    if(tileBase.type==='grass')tileBase={type:'concrete',color:'#919898'};
    for(const key in tilePaint)if(tilePaint[key].type==='grass')delete tilePaint[key];
  }
  buildRoom();
  const byId=new Map(), pairs=[];
  for(const item of state.items) {
    const p=products.find(p=>p.id===item.id);
    if(!p) continue;
    const uid=String(item.uid||"item-"+(++nextInstanceId));
    const o=newInstance(p,uid), w=finite(item.w,p.w,.08,8),
      d=finite(item.d,p.d,.08,8),h=finite(item.h,p.h,.04,5);
    setDimensions(o,w,d,h);
    o.position.set(finite(item.x,0,-20,20),finite(item.y,0,0,5),finite(item.z,0,-20,20));
    o.rotation.y=finite(item.rot,0,-100,100);
    if(safeColor(item.color)&&item.color!==p.color)tintObject(o,item.color);
    o.userData.parts={};let partIndex=0;o.traverse(n=>{if(n.isMesh){const v=safeColor(item.parts?.[partIndex]);if(v){n.material.color.set(v);o.userData.parts[partIndex]=v}partIndex++;}});
    o.userData.support=null;
    scene.add(o);objects.push(o);byId.set(uid,o);pairs.push({item,o});
  }
  pairs.forEach(({item,o})=>{
    if(item.support) o.userData.support=byId.get(String(item.support))||null;
  });
  // Restore id sequence across refresh: generated IDs always unique.
  for(const item of state.items) {
    const hit=String(item.uid||"").match(/^item-(\d+)$/);
    if(hit)nextInstanceId=Math.max(nextInstanceId,Number(hit[1]));
  }
  queue=state.queue.map(id=>products.find(p=>p.id===id)).filter(Boolean);
  if(queue.length)makePackage();
  $("#spacepick").value=id;
  $("#roomwidth").value=roomSize;$("#roomdepth").value=roomDepth;
  $("#roomdimensions").textContent=roomSize.toLocaleString("pt-BR")+" × "+roomDepth.toLocaleString("pt-BR")+" m";
  $("#spacename").textContent={quarto:"QUARTO",sala:"SALA",banheiro:"BANHEIRO",externa:"ÁREA EXTERNA"}[id];
  $("#roomtitle").textContent={quarto:"Meu quarto",sala:"Minha sala",banheiro:"Meu banheiro",externa:"Minha área externa"}[id];
  for(const [key,val] of Object.entries({windowstyle:windowStyle,doorstyle:doorStyle,windowcolor:windowColor,
    doorcolor:doorColor,windowside:windowSide,doorside:doorSide,windowposition:windowOffset,doorposition:doorOffset,
    wallcustom:wallColor})) $("#"+key).value=val;
  $("#windowposlabel").textContent=windowOffset+"%";$("#doorposlabel").textContent=doorOffset+"%";
  $("#wallcolors").querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.color===wallColor));
  $("#floorcolors").querySelectorAll("button").forEach(b=>b.classList.toggle("active",b.dataset.color===floorColor));
  category=id;document.querySelectorAll("[data-cat]").forEach(b=>b.classList.toggle("active",b.dataset.cat===id));catalog();syncCustom();recenter();update(); saveProject();
}
$("#spacepick").onchange=e=>{captureSpace();showSpace(e.target.value);toast("Ambiente independente carregado.");};
function updateArchitectureControls() {
  const prev={windowSide,doorSide,windowOffset,doorOffset};
  windowSide=$("#windowside").value; doorSide=$("#doorside").value;
  windowOffset=Number($("#windowposition").value);doorOffset=Number($("#doorposition").value);
  if(openingsOverlap()||!extraValid()) {
    ({windowSide,doorSide,windowOffset,doorOffset}=prev);
    $("#windowside").value=windowSide;$("#doorside").value=doorSide;
    $("#windowposition").value=windowOffset;$("#doorposition").value=doorOffset;
    toast("Porta e janela não podem ocupar a mesma abertura.");return false;
  }
  $("#windowposlabel").textContent=windowOffset+"%";
  $("#doorposlabel").textContent=doorOffset+"%";
  buildRoom();saveProject();return true;
}
for(const id of ["windowside","doorside","windowposition","doorposition"])
  $("#"+id).addEventListener("change",updateArchitectureControls);
function resizeSelected() {
  const o=selected;if(!o)return;
  const w=Number($("#itemwidth").value),d=Number($("#itemdepth").value),h=Number($("#itemheight").value);
  if(![w,d,h].every(Number.isFinite) || w<.08 || d<.08 || h<.04 || w>8 || d>8 || h>5) {
    toast("Medidas inválidas: largura/profundidade 0,08 a 8 m; altura 0,04 a 5 m.");return;
  }
  const prior={w:o.userData.p.w,d:o.userData.p.d,h:o.userData.p.h};
  const children=descendants(o),oldY=new Map(children.map(c=>[c,c.position.y]));
  setDimensions(o,w,d,h);
  if(prior.h!==h) for(const child of children) child.position.y+= (h-prior.h);
  let okay=[o,...children].every(x=>valid(x,x.position.x,x.position.z,x.rotation.y,x.position.y));
  if(okay && o.userData.support) okay=fitsSurface(o,o.userData.support,o.position.x,o.position.z);
  if(okay)for(const child of children) {
    if(child.userData.support && !fitsSurface(child,child.userData.support,child.position.x,child.position.z))okay=false;
  }
  if(!okay) {
    setDimensions(o,prior.w,prior.d,prior.h);
    for(const child of children) child.position.y=oldY.get(child);
    toast("O novo tamanho causaria colisão, sairia do ambiente ou perderia apoio.");
    return;
  }
  outline?.update();saveProject();toast("Móvel dimensionado em metros reais.");
}
$("#applyitemsize").onclick=resizeSelected;
$("#applyitemposition").onclick=()=>{
  if(!selected)return;
  const x=Number($("#itemx").value),z=Number($("#itemz").value);
  if(!Number.isFinite(x)||!Number.isFinite(z)||!put(selected,x,z)){
    toast("Posição inválida, com colisão ou fora do ambiente.");return;
  }
  outline?.update();saveProject();toast("Posição exata aplicada em metros.");
};
function fillItemDimensions(o) {
  for(const [field,val] of [["itemwidth",o.userData.p.w],["itemdepth",o.userData.p.d],["itemheight",o.userData.p.h],["itemx",o.position.x],["itemz",o.position.z]]) $("#"+field).value=Number(val.toFixed(3));
}
const originalSelect=select;
// Wrap selection to always display current physical measurements.
select=function(o){originalSelect(o);if(o)fillItemDimensions(o);};
function applyCommand(cmd){
  if(cmd.kind==="dimensions")return changeDimensions(cmd.width,cmd.depth);
  if(cmd.kind==="space") {captureSpace();showSpace(cmd.space);return true;}
  if(cmd.kind==="finish") {
    if(cmd.target==="wall") {wallPaint={};wallColor=cmd.color;$("#wallcustom").value=wallColor;walls.forEach(w=>w.material.color.set(wallColor));}
    if(cmd.target==="floor") {tileBase={...tileBase,color:cmd.color};tilePaint={};buildTiles();floorColor=cmd.color;floor.material.color.set(floorColor);lines.children.forEach(n=>n.material.color.set(new THREE.Color(floorColor).multiplyScalar(.78)));}
    if(cmd.target==="window") {windowColor=cmd.color;$("#windowcolor").value=cmd.color;buildArchitecture();}
    if(cmd.target==="door") {doorColor=cmd.color;$("#doorcolor").value=cmd.color;buildArchitecture();}
    return true;
  }
  if(cmd.kind==="architecture") {
    const before={windowSide,doorSide,windowOffset,doorOffset,windowStyle,doorStyle};
    if(cmd.type==="window") {
      windowSide=cmd.side??windowSide;windowOffset=cmd.offset??windowOffset;
      windowStyle=cmd.style??windowStyle;
    }else {
      doorSide=cmd.side??doorSide;doorOffset=cmd.offset??doorOffset;
      doorStyle=cmd.style??doorStyle;
    }
    if(openingsOverlap()||!extraValid()) {
      ({windowSide,doorSide,windowOffset,doorOffset,windowStyle,doorStyle}=before);
      return false;
    }
    buildRoom();return true;
  }
  if(cmd.kind==="move") {
    const query=cmd.name.toLowerCase();
    const o=objects.find(o=>o.userData.p.name.toLowerCase().includes(query) || o.userData.p.id===query);
    if(!o)return false;
    const [w,d]=dims(o),margin=.13;
    const x=cmd.horizontal==="left" ? -roomSize/2+w/2+margin : cmd.horizontal==="right" ? roomSize/2-w/2-margin : o.position.x;
    const z=cmd.vertical==="back" ? -roomDepth/2+d/2+margin : cmd.vertical==="front" ? roomDepth/2-d/2-margin : cmd.horizontal==="center"?0:o.position.z;
    if(!put(o,cmd.horizontal==="center"?0:x,z))return false;
    select(o);outline?.update();return true;
  }
  return false;
}
$("#applydescription").onclick=()=>{
  const result=parseDescription($("#description").value,products.map(p=>({id:p.id,name:p.name})));
  let applied=0,failed=0;
  for(const cmd of result.commands) {if(applyCommand(cmd)) applied++;else failed++;}
  captureSpace();showSpace(currentSpace);saveProject();
  const messages=[`${applied} alteração(ões) aplicada(s)`];
  if(failed)messages.push(`${failed} não couberam ou não foram encontradas`);
  if(result.unknown.length)messages.push(`${result.unknown.length} frase(s) não reconhecida(s)`);
  $("#descriptionresult").textContent=messages.join(" · ")+". Use uma instrução por linha.";
  toast(messages.join(" · "));
};
$("#exportproject").onclick=()=>{
  saveProject();const blob=new Blob([JSON.stringify({schema:3,balance,currentSpace,spaces},null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download="ROOMLAB-projeto-v3.json";document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
};
$("#importproject").onchange=async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try {
    if(file.size>2_000_000)throw new Error("Arquivo acima de 2 MB.");
    const restored=readProject(JSON.parse(await file.text()));
    spaces=restored.spaces;balance=restored.balance;showSpace(restored.currentSpace);
    toast("Projeto restaurado com sucesso.");
  }catch(err){toast("Não foi possível importar: "+err.message);}
  e.target.value="";
};
$("#resetproject").onclick=()=>{
  if(!confirm("Apagar o projeto atual e recomeçar no modo livre?"))return;
  spaces=Object.fromEntries(SPACE_IDS.map(id=>[id,initialSpace(id)]));balance=initialBudget;
  showSpace("quarto");toast("Novo projeto iniciado.");
};
function syncCustom(){
 syncDoors();
 $('#balconyside').value=balconySide;$('#balconyposition').value=balconyOffset;$('#balconyposlabel').textContent=Math.round(balconyOffset)+'%';
 $('#floorfinish').value=tileBase.type;$('#tilecolor').value=tileBase.color;$('#fencestyle').value=yardFence;$('#fencecolor').value=yardColor;$('#balcony').checked=balcony;
 $('#extrawindowlist').innerHTML=extraWindows.map((w,i)=>`<div class="extra-opening"><strong>Janela ${i+2}</strong><select data-win="${i}" data-field="side">${['left','right','back','front'].map((v,k)=>`<option value="${v}" ${w.side===v?'selected':''}>${['Esquerda','Direita','Fundo','Frente'][k]}</option>`).join('')}</select><select data-win="${i}" data-field="style">${["normal","blindex","wood","minecraft"].map(v=>`<option value="${v}" ${w.style===v?"selected":""}>${v}</option>`).join("")}</select><input aria-label="Posição da janela ${i+2}" type="range" min="0" max="100" value="${w.offset}" data-win="${i}" data-field="offset"><input aria-label="Cor da janela ${i+2}" type="color" value="${w.color}" data-win="${i}" data-field="color"><button data-remove-win="${i}">Remover</button></div>`).join('');
}
function extraValid(list=extraWindows){const entries=[{side:windowSide,offset:windowOffset,w:1.92},...(doorEnabled?[{side:doorSide,offset:doorOffset,w:.98}]:[]),...extraDoors.map(d=>({...d,w:.98})),...list.map(w=>({...w,w:1.92}))];return entries.every((a,i)=>entries.every((b,j)=>i===j||a.side!==b.side||Math.abs(openingCenter(a.side,a.offset,a.w===.98?.86:1.72)-openingCenter(b.side,b.offset,b.w===.98?.86:1.72))>=(a.w+b.w)/2+.08));}
$('#addwindow').onclick=()=>{if(currentSpace==='externa'){toast('Janelas ficam nos ambientes internos.');return}for(const side of ['back','right','front','left'])for(const offset of [50,0,100,25,75]){const win={side,offset,color:windowColor,style:windowStyle};if(extraValid([...extraWindows,win])){extraWindows.push(win);buildRoom();syncCustom();saveProject();return}}toast('Sem espaço livre nas paredes. Aumente o cômodo ou reposicione as aberturas.');};
$('#extrawindowlist').onchange=e=>{const i=Number(e.target.dataset.win),field=e.target.dataset.field;if(!field)return;const before={...extraWindows[i]};extraWindows[i][field]=field==='offset'?Number(e.target.value):e.target.value;if(!extraValid()){extraWindows[i]=before;toast('As aberturas não podem se sobrepor.');}buildRoom();syncCustom();saveProject();};
$('#extrawindowlist').onclick=e=>{const b=e.target.closest('[data-remove-win]');if(!b)return;extraWindows.splice(Number(b.dataset.removeWin),1);buildRoom();syncCustom();saveProject();};
function syncDoors(){
 $('#removedoor').disabled=!doorEnabled;
 $('#extradoorlist').innerHTML=extraDoors.map((d,i)=>`<div class="extra-opening"><strong>Porta extra ${i+1}</strong><select aria-label="Parede da porta" data-door="${i}" data-field="side">${['left','right','back','front'].map((v,k)=>`<option value="${v}" ${d.side===v?'selected':''}>${['Esquerda','Direita','Fundo','Frente'][k]}</option>`).join('')}</select><select aria-label="Estilo da porta" data-door="${i}" data-field="style">${['normal','wood','blindex','minecraft','sliding'].map((v,k)=>`<option value="${v}" ${d.style===v?'selected':''}>${['Tradicional','Madeira','Blindex','Minecraft','De correr'][k]}</option>`).join('')}</select><input aria-label="Posição da porta" type="range" min="0" max="100" value="${d.offset}" data-door="${i}" data-field="offset"><input aria-label="Cor da porta" type="color" value="${d.color}" data-door="${i}" data-field="color"><button data-remove-door="${i}">Remover porta</button></div>`).join('');
}
function addDoor(){
 if(currentSpace==='externa'){toast('Adicione portas nos ambientes internos.');return;}
 for(const side of ['back','right','front','left'])for(const offset of [50,0,100,25,75]){
  const d={side,offset,style:doorStyle,color:doorColor};extraDoors.push(d);
  if(extraValid()){buildRoom();syncCustom();saveProject();toast('Porta adicionada. Arraste para posicionar.');return;}
  extraDoors.pop();
 }
 toast('Sem espaço nas paredes. Mova as aberturas ou amplie o ambiente.');
}
$('#adddoor').onclick=addDoor;
$('#removedoor').onclick=()=>{doorEnabled=false;buildRoom();syncCustom();saveProject();};
$('#extradoorlist').onclick=e=>{const b=e.target.closest('[data-remove-door]');if(!b)return;extraDoors.splice(Number(b.dataset.removeDoor),1);buildRoom();syncCustom();saveProject();};
$('#extradoorlist').onchange=e=>{const i=Number(e.target.dataset.door),field=e.target.dataset.field;if(!field)return;const before={...extraDoors[i]};extraDoors[i][field]=field==='offset'?Number(e.target.value):e.target.value;if(!extraValid()){extraDoors[i]=before;toast('As aberturas não podem se sobrepor.');}buildRoom();syncCustom();saveProject();};
for(const id of ['balconyside','balconyposition'])$('#'+id).oninput=()=>{balconySide=$('#balconyside').value;balconyOffset=Number($('#balconyposition').value);buildRoom();syncCustom();saveProject();};
$('#balcony').onchange=e=>{balcony=e.target.checked;buildRoom();syncCustom();saveProject();};
$('#fencestyle').onchange=e=>{yardFence=e.target.value;buildRoom();saveProject();};$('#fencecolor').oninput=e=>{yardColor=e.target.value;buildRoom();saveProject();};
const finishColors={wood:'#ae906f',tile:'#d4d6cf',stone:'#93988f',grass:'#688b45',gravel:'#b6ae9d',concrete:'#919898'};
$('#floorfinish').onchange=e=>{$('#tilecolor').value=finishColors[e.target.value]};
$('#fillfloor').onclick=()=>{tileBase={type:$('#floorfinish').value,color:$('#tilecolor').value};tilePaint={};floorColor=tileBase.color;buildTiles();stopPainting();saveProject();toast('Piso inteiro atualizado.');};
$('#paintfloor').onclick=()=>{painting=!painting;controls.enabled=!painting&&!exploring;select(null);$('#paintfloor').textContent=painting?'Concluir pintura':'Pintar quadrados';$('#hint').textContent=painting?'Toque em um quadrado de 50 cm. A pintura termina após aplicar.':'Arraste para girar a câmera · Role para aproximar';};
function stopPainting(){painting=false;controls.enabled=!exploring;$('#paintfloor').textContent='Pintar um quadrado';$('#hint').textContent='Arraste para girar a câmera · Role para aproximar';}
function paintFloor(e){cast(e);const p=ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),0),new THREE.Vector3());if(!p||p.x< -roomSize/2||p.x>=roomSize/2||p.z< -roomDepth/2||p.z>=roomDepth/2)return;const key=Math.floor((p.x+roomSize/2)/.5)+','+Math.floor((p.z+roomDepth/2)/.5);tilePaint[key]={type:$('#floorfinish').value,color:$('#tilecolor').value};buildTiles();stopPainting();saveProject();}
$('#applywallpaint').onclick=()=>{const side=$('#walltarget').value,c=$('#wallcustom').value;if(side==='all'){wallColor=c;wallPaint={}}else wallPaint[side]=c;buildRoom();saveProject();};
// Every mesh can be recolored independently; "Tudo" applies to the complete item.
$('#partcolor').oninput=e=>{if(!selected)return;const key=$('#itempart').value;if(key==='all')tintObject(selected,e.target.value);else{let i=0;selected.traverse(n=>{if(n.isMesh){if(String(i)===key){n.material.color.set(e.target.value);selected.userData.parts={...selected.userData.parts,[i]:e.target.value}}i++;}})}saveProject();};
let installPrompt;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("#installapp").hidden=false;});
$("#installapp").onclick=async()=>{
  if(!installPrompt){toast("No navegador, procure Instalar aplicativo no menu.");return;}
  installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("#installapp").hidden=true;
};
window.addEventListener("appinstalled",()=>{$("#installapp").hidden=true;});
if("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost" || location.hostname==="127.0.0.1"))
  window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(e=>console.warn("PWA offline indisponível",e)));
try {
  const raw=localStorage.getItem(STORAGE_KEY);
  if(raw){const state=readProject(JSON.parse(raw));spaces=state.spaces;balance=state.balance;currentSpace=state.currentSpace;}
}catch(e){console.warn("Projeto salvo não pode ser restaurado",e);}
showSpace(currentSpace);

const clock = new THREE.Clock();
function frame() {
  requestAnimationFrame(frame);
  const dt = Math.min(clock.getDelta(), 0.04);
  if (exploring) {
    camera.rotation.order = "YXZ";
    camera.rotation.set(pitch, yaw, 0);
    let f =
        Number(keys.w || keys.arrowup || keys.forward || false) -
        Number(keys.s || keys.arrowdown || keys.back || false),
      r =
        Number(keys.d || keys.arrowright || keys.right || false) -
        Number(keys.a || keys.arrowleft || keys.left || false);
    const norm = Math.hypot(f, r) || 1;
    f /= norm;
    r /= norm;
    const dx = (-Math.sin(yaw) * f + Math.cos(yaw) * r) * dt * 1.8,
      dz = (-Math.cos(yaw) * f - Math.sin(yaw) * r) * dt * 1.8;
    if (canWalk(camera.position.x + dx, camera.position.z))
      camera.position.x += dx;
    if (canWalk(camera.position.x, camera.position.z + dz))
      camera.position.z += dz;
  } else controls.update();
  renderer.render(scene, camera);
}
new ResizeObserver(() => {
  const w = host.clientWidth,
    h = host.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}).observe(host);
catalog();
$("#loading").remove();
frame();
