const {Cam,fit,proj,facing,rings,prism,solid,put,mk,seg,poly,rrect,tween,tset,tval,tdone,pointer,register,disposer} = HL;
function mount({stage,svg,read},value) {
  const bag=disposer(),C=Cam(45,.5,1.65);
  fit(C,[[-58,-50,0],[58,50,0],[-58,50,75],[58,-50,75]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  const [base,inside]=rings(-62,-52,62,52,8,2);
  put(solid(g),prism(P,front,base,inside,-5,0));
  // Overlapping paper leaves with offset punched tabs and document rulings.
  const pages=[];
  for(let i=0;i<5;i++){
    const x=-39+i*5,y=-34+i*12,z=7+i*5;
    const [ring,inner]=rings(x,y,x+68,y+43,4,.8),group=mk('g',{},g);
    const el=solid(group),lines=mk('path',{class:'nf lo'},group),tab=mk('path',{class:'nf'},group);
    pages.push({x,y,z,ring,inner,el,lines,tab,tw:tween(z),last:NaN});
  }
  let selected=-1, lift=value;
  function paint(now){let moving=false;pages.forEach((p,i)=>{const z=tval(p.tw,now);if(!tdone(p.tw,now))moving=true;if(p.last===z)return;p.last=z;put(p.el,prism(P,front,p.ring,p.inner,z,z+1.5));p.lines.setAttribute('d',[10,17,24,31].map((v,k)=>seg(P(p.x+9,p.y+v,z+1.6),P(p.x+52-k*5,p.y+v,z+1.6))).join(''));p.tab.setAttribute('d',poly(rrect(p.x+45,p.y+3,p.x+60,p.y+7,1.5,4).map(q=>P(q.u,q.v,z+1.7))));});return moving;}
  const B=register(stage,(_dt,now)=>paint(now));bag.add(B.unregister);
  function choose(a){if(a===selected)return;const from=a<0?selected:a;selected=a;const now=performance.now();pages.forEach((p,i)=>{const distance=Math.abs(i-a);tset(p.tw,p.z+(a<0?0:lift*Math.max(0,1-distance*.32)),now,Math.abs(i-from)*40);p.el.sil.classList.toggle('hi',i===(a<0?4:a));});read.textContent=a<0?'rest':`document ${a+1}`;B.wake();}
  const centers=pages.map(p=>P(p.x+34,p.y+22,p.z));
  bag.add(pointer(stage,{move:([x,y])=>{let a=0,d=Infinity;centers.forEach((p,i)=>{const n=(p[0]-x)**2+(p[1]-y)**2;if(n<d){a=i;d=n;}});choose(d<13000?a:-1);},leave:()=>choose(-1)}));
  pages[4].el.sil.classList.add('hi');paint(0);bag.add(()=>svg.replaceChildren());
  return {set:v=>{lift=v;const a=selected;selected=-2;choose(a);},destroy:bag.dispose};
}
hairline({name:'documents',means:'A document tray lifts a selected page and its nearby context together.',rules:[1,2,4,5,8,9],range:[8,24,36],tour:[[210,125],[190,170],[168,205],null],mount});
