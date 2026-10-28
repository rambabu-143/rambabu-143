const {Cam,fit,proj,facing,rings,prism,solid,put,mk,seg,poly,rrect,spring,stepS,pointer,register,disposer,clamp} = HL;
function mount({stage,svg,read},value){
  const bag=disposer(),C=Cam(45,.5,1.65);
  fit(C,[[-65,-45,0],[65,45,0],[-65,-45,90],[65,45,90]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  const [base,inner]=rings(-63,-43,63,43,7,1.5);
  put(solid(g),prism(P,front,base,inner,0,12));
  // Three removable server cartridges: vents, connector sockets and a lid.
  const parts=[];
  for(let i=0;i<3;i++){
    const x=-49+i*34,y=-27;
    const [ring,crease]=rings(x,y,x+27,y+54,4,.8),el=solid(g),vents=mk('path',{class:'nf lo'},g),socket=mk('path',{class:'nf'},g);
    parts.push({x,y,ring,crease,el,vents,socket,sp:spring(15+i*3),last:NaN});
  }
  const [lr,li]=rings(-63,-43,63,43,7,1.5),lid=solid(g),handle=mk('path',{class:'nf'},g),opening=spring(47);
  let reach=value,over=null,lastLid=NaN;
  function draw(){parts.forEach(p=>{const z=p.sp.x;if(z===p.last)return;p.last=z;put(p.el,prism(P,front,p.ring,p.crease,z,z+11));p.vents.setAttribute('d',[8,14,20,26].map(v=>seg(P(p.x+5,p.y+v,z+11.1),P(p.x+22,p.y+v,z+11.1))).join(''));p.socket.setAttribute('d',poly(rrect(p.x+7,p.y+37,p.x+20,p.y+46,2,4).map(q=>P(q.u,q.v,z+11.2))));});const z=opening.x;if(z===lastLid)return;lastLid=z;put(lid,prism(P,front,lr,li,z,z+4));handle.setAttribute('d',poly(rrect(-15,-5,15,5,4,6).map(q=>P(q.u,q.v,z+4.1))));}
  const B=register(stage,dt=>{let moving=stepS(opening,dt);parts.forEach(p=>{if(stepS(p.sp,dt))moving=true;});draw();return moving;});bag.add(B.unregister);
  function target(p){over=p;const a=p?clamp(Math.floor((p[0]-120)/53),0,2):-1;opening.t=p?47+reach:47;parts.forEach((part,i)=>{part.sp.t=15+i*3+(p?reach*.5*Math.max(0,1-Math.abs(i-a)*.55):0);part.el.sil.classList.toggle('hi',i===a);});lid.sil.classList.toggle('hi',a<0);read.textContent=a<0?'rest':['tool registry','configuration','server runtime'][a];B.wake();}
  bag.add(pointer(stage,{move:target,leave:()=>target(null)}));bag.add(()=>svg.replaceChildren());lid.sil.classList.add('hi');draw();
  return {set:v=>{reach=v;target(over);},destroy:bag.dispose};
}
hairline({name:'server-kit',means:'A server kit opens and lifts the reusable parts of a new integration.',rules:[1,3,4,5,7,9],range:[8,22,32],tour:[[135,150],[200,170],[265,185],null],mount});
