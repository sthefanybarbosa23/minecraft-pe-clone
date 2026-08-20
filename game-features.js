// Sistemas auxiliares para a próxima fase do BlockCraft PE.
export const BLOCKS={grass:{id:1,name:'Grama'},dirt:{id:2,name:'Terra'},stone:{id:3,name:'Pedra'},wood:{id:4,name:'Madeira'},sand:{id:5,name:'Areia'},glass:{id:6,name:'Vidro'}};
export const RECIPES=[{name:'Tábuas de madeira',input:{wood:1},output:{planks:4}},{name:'Bancada de trabalho',input:{planks:4},output:{crafting_table:1}}];
export function createInventory(){return {grass:32,dirt:32,stone:32,wood:16,sand:16,glass:0,planks:0,crafting_table:0}}
export function saveWorld(state){localStorage.setItem('blockcraft-world',JSON.stringify(state))}
export function loadWorld(){try{return JSON.parse(localStorage.getItem('blockcraft-world'))||null}catch{return null}}
