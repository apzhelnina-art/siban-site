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
