(function(){
var mark=document.querySelector('.hero-wordmark');
if(mark&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 function reveal(e){var r=mark.getBoundingClientRect();mark.style.setProperty('--mx',(e.clientX-r.left)+'px');mark.style.setProperty('--my',(e.clientY-r.top)+'px');mark.classList.add('is-active');}
 mark.addEventListener('pointermove',reveal);
 mark.addEventListener('pointerdown',reveal);
 mark.addEventListener('pointerleave',function(){mark.classList.remove('is-active');});
}
var menu=document.getElementById('mobile-menu');
var btn=document.querySelector('.menu-toggle');
var close=document.querySelector('.menu-close');
function toggle(open){if(!menu||!btn)return;menu.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));}
if(btn)btn.addEventListener('click',function(){toggle(btn.getAttribute('aria-expanded')!=='true');});
if(close)close.addEventListener('click',function(){toggle(false);});
if(menu)menu.addEventListener('click',function(e){if(e.target.closest('a'))toggle(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')toggle(false);});
var items=document.querySelectorAll('.reveal,.reveal-text');
if('IntersectionObserver'in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}});},{threshold:.08});
 items.forEach(function(item){observer.observe(item);});
}else{items.forEach(function(item){item.classList.add('visible');});}
var cursor=document.querySelector('.cursor');
if(cursor&&window.matchMedia('(pointer:fine)').matches){
 document.addEventListener('pointermove',function(e){cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px';cursor.classList.add('visible');});
 document.querySelectorAll('a,button,.project-card').forEach(function(item){item.addEventListener('pointerenter',function(){cursor.classList.add('hover');});item.addEventListener('pointerleave',function(){cursor.classList.remove('hover');});});
}
})();