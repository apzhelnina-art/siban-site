(function(){
  var top=document.querySelector('.top'),b=document.querySelector('.burger'),nav=document.getElementById('nav');
  function setH(){document.documentElement.style.setProperty('--top-h',top.offsetHeight+'px')}setH();window.addEventListener('resize',setH);
  function onScroll(){top.classList.toggle('scrolled',window.scrollY>10)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  if(b){b.addEventListener('click',function(){var o=nav.classList.toggle('open');b.setAttribute('aria-expanded',o);var en=document.documentElement.lang==='en';b.setAttribute('aria-label',o?(en?'Close menu':'Закрыть меню'):(en?'Open menu':'Открыть меню'))});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');b.setAttribute('aria-expanded','false')}})}
  var els=document.querySelectorAll('.sec,.stage,.request');
  if('IntersectionObserver' in window){
    els.forEach(function(el){el.classList.add('reveal')});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.08});
    els.forEach(function(el){io.observe(el)});
  }
})();
/* живая плата на главном экране */
(function(){
  var svg=document.querySelector('.hx__circuit'); if(!svg) return;
  var hx=svg.parentNode, mark=hx.querySelector('.stage__mark'), NS='http://www.w3.org/2000/svg';
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rnd(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646}}
  function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e}
  function build(){
    var fig=mark.parentNode, mw=mark.clientWidth||mark.getBoundingClientRect().width;
    var W=hx.clientWidth, H=hx.clientHeight, cx=fig.offsetLeft+fig.offsetWidth/2, cy=fig.offsetTop+mw/2, R=mw*0.47, G=24;
    var rand=rnd(20141), snap=function(v){return Math.round(v/G)*G};
    svg.setAttribute('viewBox','0 0 '+W+' '+H); while(svg.firstChild) svg.removeChild(svg.firstChild);
    var small=W<861, n=small?10:18, used={};
    for(var i=0;i<n;i++){
      var side=small?(i%2?'left':'right'):(['left','left','top','right','left','top','right','left'][i%8]);
      var pts=[], off=snap((rand()-.5)*R*0.9);
      if(side==='left'||side==='right'){
        var dir=side==='left'?1:-1, y0=small?snap(Math.max(G,Math.min(H-G,cy+(rand()-.5)*R*3.2))):snap(H*(.06+rand()*.88)), yt=cy+off, ex=cx-dir*R, x0=side==='left'?0:W;
        var dy=Math.abs(yt-y0), x1=ex-dir*(dy+G*(1+Math.floor(rand()*4)));
        if((x1-x0)*dir<0) x1=x0;
        pts=[[x0,y0],[x1,y0],[x1+dir*dy,yt],[ex,yt]];
      } else {
        var dv=side==='top'?1:-1, x0=snap(cx+(rand()-.5)*W*.7), xt=cx+off, ey=cy-dv*R, y0=side==='top'?0:H;
        var dx=Math.abs(xt-x0), y1=ey-dv*(dx+G*(1+Math.floor(rand()*3)));
        if((y1-y0)*dv<0) y1=y0;
        pts=[[x0,y0],[x0,y1],[xt,y1+dv*dx],[xt,ey]];
      }
      var key=Math.round(pts[3][0])+','+Math.round(pts[3][1]); if(used[key]) continue; used[key]=1;
      var d='M'+pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1)}).join(' L');
      var delay=(i*0.06).toFixed(2)+'s';
      svg.appendChild(el('path',{d:d,'class':'tr',pathLength:100,style:'--i:'+delay}));
      var s=pts[0]; if(s[0]>0&&s[0]<W&&s[1]>0&&s[1]<H) svg.appendChild(el('circle',{cx:s[0],cy:s[1],r:4,'class':'tr-dot',style:'--i:'+delay}));
      var b=pts[1]; if(i%3===0) svg.appendChild(el('circle',{cx:b[0],cy:b[1],r:3.2,'class':'tr-dot',style:'--i:'+(i*0.06+.8).toFixed(2)+'s'}));
      if(!reduce&&i%2===0) svg.appendChild(el('path',{d:d,'class':'tr-run',pathLength:100,style:'--d:'+(3+rand()*3).toFixed(2)+'s;--dl:'+(1.8+rand()*3).toFixed(2)+'s'}));
    }
  }
  var t; function rebuild(){clearTimeout(t);t=setTimeout(build,150)}
  if(document.readyState==='complete') build(); else window.addEventListener('load',build);
  window.addEventListener('resize',rebuild);
  if(!reduce&&window.matchMedia('(pointer:fine)').matches){
    hx.addEventListener('pointermove',function(e){var r=hx.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;svg.style.transform='translate('+(-x*14).toFixed(1)+'px,'+(-y*10).toFixed(1)+'px)'});
    hx.addEventListener('pointerleave',function(){svg.style.transform=''});
  }
})();
/* v2: «камера отъезжает», статусы BOM, линия процесса */
(function(){
  var mic=document.querySelector('.mic'); var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(mic&&!reduce){
    var ticking=false;
    function upd(){ticking=false;if(window.innerWidth<=860){mic.style.setProperty('--p',0);return}var h=mic.offsetHeight||1;var p=Math.min(1,Math.max(0,window.scrollY/(h*.9)));mic.style.setProperty('--p',p.toFixed(3))}
    window.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});
    window.addEventListener('resize',upd);upd();
  }
  function onSee(el,fn){if(!el)return;if(!('IntersectionObserver' in window)){fn();return}var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fn();io.disconnect()}})},{threshold:.35});io.observe(el)}
  var bom=document.querySelector('.bom');
  onSee(bom,function(){var s=bom.querySelectorAll('.stt');s.forEach(function(x,i){setTimeout(function(){x.textContent=x.getAttribute('data-final');x.className='stt '+x.getAttribute('data-cls')},reduce?0:400+i*420)})});
  var pl=document.querySelector('.pl'); onSee(pl,function(){pl.classList.add('is-on')});
})();
