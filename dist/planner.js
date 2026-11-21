// Interpretador offline de instruções curtas em português; não utiliza IA externa.
// Mantido puro para permitir testes de unidade com Node.js.
export function clampMeters(value) {
  const n = Number(String(value).trim().replace(',', '.'));
  return Number.isFinite(n) && n >= 2 && n <= 12 ? Math.round(n * 100) / 100 : null;
}
function norm(text) {
  return String(text).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim();
}
const COLORS = {
  branco:'#f0ede5',preto:'#323838',cinza:'#9da6a3',azul:'#94b7d5',
  'azul escuro':'#405c80',verde:'#9daf87','verde escuro':'#486451',
  vermelho:'#b75b57',rosa:'#e4b1bd',amarelo:'#e7ce84',
  bege:'#d8c2a4',marrom:'#956e51',madeira:'#a67f57',
  terracota:'#bc8166',lilas:'#b6a4cc'
};
function side(line) {
  if(/\b(direit[ao]|lado direito)\b/.test(line)) return 'right';
  if(/\b(esquerd[ao]|lado esquerdo)\b/.test(line)) return 'left';
  if(/\b(frente|frontal|entrada)\b/.test(line)) return 'front';
  if(/\b(fundo|tras|traseir[ao])\b/.test(line)) return 'back';
  return null;
}
function locationOffset(line) {
  const m=line.match(/\b(\d{1,3})\s*%/);
  if(m) return Math.min(100,Math.max(0,Number(m[1])));
  if(/\b(centro|centralizad[ao]|meio)\b/.test(line)) return 50;
  return null;
}
function findColor(line) {
  const match=Object.entries(COLORS).sort((a,b)=>b[0].length-a[0].length).find(([name])=>new RegExp('\\b'+name+'\\b').test(line));
  const hex=line.match(/#[0-9a-f]{6}\b/);
  return hex?.[0] || match?.[1] || null;
}
function parseLine(line,products) {
  const str=norm(line);
  const dim=str.match(/\b(\d{1,2}(?:[.,]\d{1,2})?)\s*(?:m(?:etros?)?)?\s*(?:x|por)\s*(\d{1,2}(?:[.,]\d{1,2})?)\s*m?\b/);
  if(dim) return {kind:'dimensions',width:Number(dim[1].replace(',','.')),depth:Number(dim[2].replace(',','.'))};
  const space= /\b(quarto|sala|banheiro|area externa|quintal|jardim|varanda)\b/.exec(str);
  if(space && /^(?:ir para|mudar para|abrir|selecionar|ambiente|mostrar|trocar para)\b/.test(str))
    return {kind:'space',space:({quintal:'externa',jardim:'externa',varanda:'externa','area externa':'externa'})[space[1]]||space[1]};
  const target=/\b(janela|porta)\b/.exec(str);
  if(target) {
    const color=findColor(str);
    const style= /\b(de correr|corredica|deslizante)\b/.test(str)?'sliding'
      :/\bminecraft\b/.test(str)?'minecraft'
      :/\b(blindex|vidro)\b/.test(str)?'blindex'
      :/\b(madeira|veneziana)\b/.test(str)?'wood'
      :/\b(tradicional|normal)\b/.test(str)?'normal':null;
    if(style || side(str) || locationOffset(str)!==null)
      return {kind:'architecture',type:target[1]==='porta'?'door':'window',
        ...(style ? {style:target[1]==='janela' && style==='sliding'?'blindex':style}:{}),
        ...(side(str)?{side:side(str)}:{}),
        ...(locationOffset(str)!==null?{offset:locationOffset(str)}:{})};
    if(color) return {kind:'finish',target:target[1]==='porta'?'door':'window',color};
  }
  const color=findColor(str);
  if(color && /\b(parede|paredes|pintar|tinta|piso|chao)\b/.test(str)) {
    return {kind:'finish',target:/\b(piso|chao)\b/.test(str)?'floor':'wall',color};
  }
  if(/\b(mover|mova|colocar|coloque|posicionar|posicione|arrastar|leve)\b/.test(str)) {
    const p=[...products].sort((a,b)=>b.name.length-a.name.length).find(p=>str.includes(norm(p.name)) || str.includes(norm(p.id)));
    const alias=str.match(/\b(sofa|cama|mesa|cadeira|rack|tv|pia|banheira|vaso|planta|tapete|estante|monitor|notebook|computador|pc)\b/);
    const objectName=p?.id || alias?.[1];
    if(objectName) return {kind:'move',name:objectName,horizontal:/\bcentro\b/.test(str)?'center':side(str)==='left'?'left':side(str)==='right'?'right':null,
      vertical:side(str)==='back'?'back':side(str)==='front'?'front':/\bcanto\b/.test(str)?'back':null};
  }
  return null;
}
export function parseDescription(input, products=[]) {
  const commands=[],unknown=[];
  String(input).split(/[;\n]+/).map(s=>s.trim()).filter(Boolean).slice(0,30).forEach(text=>{
    const cmd=parseLine(text,products);
    if(cmd)commands.push(cmd);else unknown.push(text);
  });
  return {commands,unknown};
}
