import assert from 'node:assert/strict';
import {parseDescription,clampMeters} from '../dist/planner.js';
assert.equal(clampMeters('3,45'),3.45);
assert.equal(clampMeters('17'),null);
const sample=`Quarto 3,5 x 4 m
Porta de correr na parede direita
Janela de madeira na parede do fundo
Paredes azul
Mover Cama Nuvem para o canto esquerdo`;
const parsed=parseDescription(sample,[{id:'bed',name:'Cama Nuvem'}]);
assert.equal(parsed.unknown.length,0,parsed.unknown.join(','));
assert.equal(parsed.commands.length,5);
assert.deepEqual(parsed.commands[0],{kind:'dimensions',width:3.5,depth:4});
assert.equal(parsed.commands[1].style,'sliding');
assert.equal(parsed.commands[1].side,'right');
assert.equal(parsed.commands[2].side,'back');
assert.equal(parsed.commands[3].target,'wall');
assert.equal(parsed.commands[4].name,'bed');
assert.equal(parseDescription('tamanho infinito').unknown.length,1);
console.log('PASS: natural language dimensions, wall sides, opening styles, finishes, furniture placement.');
