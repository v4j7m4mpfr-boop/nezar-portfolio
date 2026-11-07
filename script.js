(function(){var m=document.querySelector('.hero-wordmark');if(m&&!matchMedia('(prefers-reduced-motion: reduce)').matches){function p(e){var r=m.getBoundingClientRect();m.style.setProperty('--mx',(e.clientX-r.left)+'px');m.style.setProperty('--my',(e.clientY-r.top)+'px');m.classList.add('is-active')}m.addEventListener('pointermove',p,{passive:true});m.addEventListener('pointerdown',p,{passive:true});m.addEventListener('pointerleave',function(){m.classList.remove('is-active')})}var c=document.querySelector('.cursor');if(c&&matchMedia('(pointer:fine)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.addEventListener('pointermove',function(e){c.style.left=e.clientX+'px';c.style.top=e.clientY+'px';c.classList.add('visible')},{passive:true});document.querySelectorAll('a,button,.project-card').forEach(function(a){a.addEventListener('pointerenter',function(){c.classList.add('hover')});a.addEventListener('pointerleave',function(){c.classList.remove('hover')})})}}var close=document.querySelector('.menu-close'),btn=document.querySelector('.menu-toggle');if(close&&btn)close.addEventListener('click',function(){if(btn.getAttribute('aria-expanded')==='true')btn.click()});var targets=document.querySelectorAll('.reveal-text');if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{threshold:.08});targets.forEach(function(t){observer.observe(t)})}else{targets.forEach(function(t){t.classList.add('visible')})}})();

/* Global section reveal and staggered entrance */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var selectors=[
    '.section-head','.about-copy','.about-stats>div','.work-heading',
    '.project-card','.work-footnote','.expertise-grid>div',
    '.skill-list li','.manifesto','.contact-panel','.social-links a','footer'
  ];
  var items=[];
  selectors.forEach(function(selector){
    document.querySelectorAll(selector).forEach(function(el){
      if(el.classList.contains('motion-item'))return;
      el.classList.add('motion-item');
      items.push(el);
    });
  });
  if(reduce||!('IntersectionObserver'in window)){
    items.forEach(function(el){el.classList.add('is-in')});
    return;
  }
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-in');
      observer.unobserve(entry.target);
    });
  },{threshold:.12,rootMargin:'0px 0px -35px 0px'});
  items.forEach(function(el){observer.observe(el)});
})();
