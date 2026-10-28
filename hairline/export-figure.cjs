// Offline image export. Geometry and easing come from the unchanged Hairline engine.
const fs=require('fs'),vm=require('vm'),path=require('path');
const sharp=require(process.env.SHARP_PATH || '/Users/ramrac/Library/Caches/hairline-look/node_modules/sharp');
const name=process.argv[2] || 'voice-console';
if(!/^[a-z-]+$/.test(name))throw new Error('Invalid figure name');
const out=path.join(__dirname,'frames',name);
fs.mkdirSync(out,{recursive:true});
class El {
 constructor(tag,attrs={}){this.tag=tag;this.attrs=attrs;this.children=[];this.classList={add:(c)=>this.toggle(c,true),toggle:(c,on)=>this.toggle(c,on)};}
 toggle(c,on){const s=new Set((this.attrs.class||'').split(' ').filter(Boolean));if(on)s.add(c);else s.delete(c);this.attrs.class=[...s].join(' ');}
 setAttribute(k,v){this.attrs[k]=v;} appendChild(e){this.children.push(e);return e;} append(...es){this.children.push(...es);} remove(){} replaceChildren(){this.children=[];}
 get outerHTML(){return `<${this.tag} ${Object.entries(this.attrs).map(([k,v])=>`${k}="${v}"`).join(' ')}>${this.children.map(e=>e.outerHTML).join('')}</${this.tag}>`;}
}
let now=0,tick,handlers,figure;
const ctx={console,Math,performance:{now:()=>now},document:{createElementNS:(_,t)=>new El(t)},window:{matchMedia:()=>({matches:false,addEventListener(){}})},matchMedia:()=>({matches:false,addEventListener(){}}),IntersectionObserver:class {observe(){} unobserve(){}},requestAnimationFrame:()=>0,cancelAnimationFrame(){},hairline:f=>figure=f};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('/Users/ramrac/.agents/skills/hairline-create/kernel.js','utf8'),ctx);
// Capture lifecycle hooks for deterministic, non-browser export; no engine source is altered.
vm.runInContext('HL = {...HL, register: (_s,t) => { captureTick(t); return {wake(){},unregister(){}}; }, pointer: (_s,h) => { capturePointer(h); return ()=>{}; }}',Object.assign(ctx,{captureTick:t=>tick=t,capturePointer:h=>handlers=h}));
vm.runInContext(fs.readFileSync(path.join(__dirname,name+'.js'),'utf8'),ctx);
(async()=>{
for(const theme of ['light','dark']){
 const svg=new El('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 400 320',width:480,height:384});
 now=0;const read={textContent:'rest'};const handle=figure.mount({stage:{},svg,read},figure.range[1]);
 const stops=figure.tour;
 const dir=path.join(out,theme);fs.mkdirSync(dir,{recursive:true});
 const states=[];
 for(let f=0;f<100;f++){
  now=f*100;
  if(f>=10 && (f-10)%20===0 && (f-10)/20<stops.length){const p=stops[(f-10)/20];if(p)handlers.move(p);else handlers.leave();}
  for(let j=0;j<6;j++){now=f*100+j*(100/6);tick(1/60,now);}
  if(f%10===0)states.push({frame:f,read:read.textContent});
  const ground=theme==='dark'?'#08090a':'#ffffff',ink=theme==='dark'?'#b1b5c0':'#656974',bright=theme==='dark'?'#f0f2f8':'#14161c',dim=theme==='dark'?'#41444d':'#c1c4cb';
  const css=`<style>path{fill:${ground};stroke:${ink};stroke-width:.8;stroke-linejoin:round;stroke-linecap:round}.sil{stroke:${ink}}.lo{stroke:${dim};stroke-width:.6}.nf{fill:none}.hi{stroke:${bright};stroke-width:1.1}</style><rect width="400" height="320" fill="${ground}"/>`;
  const data=svg.outerHTML.replace('>',`>${css}`);
  await sharp(Buffer.from(data)).png().toFile(path.join(dir,`${String(f).padStart(3,'0')}.png`));
  if(f===99)fs.writeFileSync(path.join(__dirname,'../assets',`${name}-${theme}.svg`),data);
 }
 fs.writeFileSync(path.join(dir,'states.json'),JSON.stringify(states,null,2));
 handle.destroy();
 console.log(name,theme,'exported');
}
})().catch(e=>{console.error(e);process.exit(1)});
