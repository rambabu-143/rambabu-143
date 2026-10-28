const {Cam,fit,proj,facing,rings,prism,solid,put,mk,seg,unproj,clamp,tween,tset,tval,tdone,pointer,register,disposer} = HL;
function mount({stage,svg,read},value) {
  const bag=disposer();
  let reach=value, active=-1;
  const C=Cam(45,.5,1.95);
  fit(C,[[0,0,0],[126,0,12],[0,96,0],[126,96,24]],200,166);
  const P=proj(C),front=facing(C),g=mk('g',{},svg);
  function block(parent,x0,y0,x1,y1,r,z0,z1) {
    const [a,b]=rings(x0,y0,x1,y1,r,.65), el=solid(parent);
    put(el,prism(P,front,a,b,z0,z1));
    return el;
  }
  block(g,0,0,126,96,7,0,10);
  for(let i=0;i<5;i++) {
    const x=17+i*23;
    block(g,x-5,12,x+5,22,4,10,15);
    mk('path',{d:seg(P(x,14,15),P(x,18,15)),class:'nf lo'},g);
  }
  const strips=[],rest=[.32,.68,.47,.78,.4];
  for(let i=0;i<5;i++) {
    const x=17+i*23,group=mk('g',{},g);
    mk('path',{d:seg(P(x,34,10.2),P(x,82,10.2)),class:'nf lo'},group);
    for(let j=0;j<4;j++) mk('path',{d:seg(P(x-5,38+j*13,10.2),P(x-3,38+j*13,10.2)),class:'nf lo'},group);
    strips.push({x,cap:solid(group),mark:mk('path',{class:'nf lo'},group),t:tween(rest[i]),last:null});
  }
  function draw(i,v) {
    const s=strips[i];if(s.last===v)return;s.last=v;
    const y=38+v*39,[a,b]=rings(s.x-7,y-4,s.x+7,y+4,2,.65);
    put(s.cap,prism(P,front,a,b,10.2,15));
    s.mark.setAttribute('d',seg(P(s.x-4,y,15),P(s.x+4,y,15)));
  }
  strips.forEach((s,i)=>draw(i,rest[i]));
  strips[2].cap.sil.classList.add('hi');
  const B=register(stage,(_dt,now)=>{
    let moving=false;
    strips.forEach((s,i)=>{draw(i,tval(s.t,now));if(!tdone(s.t,now))moving=true;});
    return moving;
  });
  bag.add(B.unregister);
  function pick(p) {
    const [x,y]=unproj(C,p[0],p[1],10);
    if(x<5||x>121||y<27||y>90)return -1;
    return clamp(Math.round((x-17)/23),0,4);
  }
  function choose(a,force=false) {
    if(a===active&&!force)return;
    const from=a<0?active:a;active=a;
    const now=performance.now();
    strips.forEach((s,i)=>{
      const d=Math.abs(i-a),target=a<0?rest[i]:clamp(rest[i]-(.36*reach)/(1+d*d),.06,.94);
      tset(s.t,target,now,Math.abs(i-from)*40);
      s.cap.sil.classList.toggle('hi',i===(a<0?2:a));
    });
    read.textContent=a<0?'rest':`channel ${a+1}`;B.wake();
  }
  bag.add(pointer(stage,{move:p=>choose(pick(p)),leave:()=>choose(-1)}));
  bag.add(()=>svg.replaceChildren());
  return {set(v){reach=v;choose(active,true);},destroy:bag.dispose};
}
hairline({name:'voice-console',means:'A voice console: choose a channel and its fader rises, with a smaller response from its neighbours.',rules:[1,2,4,5,8,9],range:[.4,1,1.7],tour:[[253,176],[191,192],[128,208],null],mount});
