// Offline image export. Geometry and easing come from the unchanged Hairline engine.
const fs=require('fs'),vm=require('vm'),sharp=require('/Users/ramrac/Library/Caches/hairline-look/node_modules/sharp');
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
vm.runInContext(fs.readFileSync('voice-console.js','utf8'),ctx);
(async()=>{
for(const theme of ['light','dark']){
 const svg=new El('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 400 320',width:640,height:512});
 now=0;figure.mount({stage:{},svg,read:{}},1);
 const stops=[[253,176],[191,192],[128,208],null];
 fs.mkdirSync(`frames-${theme}`,{recursive:true});
 for(let f=0;f<80;f++){
  now=f*100;
  if(f%20===0){const p=stops[Math.floor(f/20)];if(p)handlers.move(p);else handlers.leave();}
  tick(.1,now);
  const ground=theme==='dark'?'#08090a':'#ffffff',ink=theme==='dark'?'#b1b5c0':'#656974',bright=theme==='dark'?'#f0f2f8':'#14161c',dim=theme==='dark'?'#41444d':'#c1c4cb';
  const css=`<style>path{fill:${ground};stroke:${ink};stroke-width:.8;stroke-linejoin:round;stroke-linecap:round}.sil{stroke:${ink}}.lo{stroke:${dim};stroke-width:.6}.nf{fill:none}.hi{stroke:${bright};stroke-width:1.1}</style><rect width="400" height="320" fill="${ground}"/>`;
  const data=svg.outerHTML.replace('>',`>${css}`);
  await sharp(Buffer.from(data)).png().toFile(`frames-${theme}/${String(f).padStart(3,'0')}.png`);
  if(f===79)fs.writeFileSync(`../assets/voice-console-${theme}.svg`,data);
 }
}
})().catch(e=>{console.error(e);process.exit(1)});
