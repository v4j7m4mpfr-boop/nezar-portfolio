(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const S = window.SITE || {skills:[],email:"",instagram:""};
  const P = window.PROJECTS || [];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  $("#year").textContent = new Date().getFullYear();

  const menuBtn = $(".menu-toggle"), mobileMenu = $("#mobile-menu");
  const setMenu = (open) => {
    mobileMenu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  mobileMenu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  $("#projects").innerHTML = P.map((p, i) => {
    const external = /^https?:\/\//i.test(p.live);
    return '<a class="project-card reveal" href="'+esc(p.live)+'" '+(external?'target="_blank" rel="noopener"':'')+' aria-label="Open '+esc(p.title)+' website"><div class="project-image"><img src="'+esc(p.image || "")+'" alt="'+esc(p.title)+' website preview" loading="lazy"><span class="project-number">0'+(i+1)+' / 06</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-info"><div><h3>'+esc(p.title)+'</h3><p>'+esc(p.category)+'</p></div><span class="project-type">OPEN WEBSITE ↗</span></div></a>';
  }).join("");

  $("#skill-list").innerHTML = S.skills.map(s => '<li class="reveal"><strong>'+esc(s.name)+'</strong><span>'+esc(s.note)+'</span></li>').join("");
  const links = [["Instagram",S.instagram,"@nezar.elsawy__"],["Email",S.email ? "mailto:"+S.email : "",S.email]];
  $("#links").innerHTML = links.map(([name,href,label]) => href ? '<a href="'+esc(href)+'" '+(name==="Instagram"?'target="_blank" rel="noopener"':'')+'><span>'+esc(name)+'</span><span>'+esc(label)+' ↗</span></a>' : "").join("");
  if (S.email) $("#cta").href = "mailto:"+S.email;

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), {threshold:.08}) : null;
  document.querySelectorAll(".reveal").forEach(el => observer ? observer.observe(el) : el.classList.add("visible"));
  if (reduce) document.querySelectorAll(".reveal").forEach(el => el.classList.add("visible"));
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    addEventListener("pointermove", e => {
      const visual=$(".hero-visual"); if(!visual) return;
      const r=visual.getBoundingClientRect();
      visual.style.setProperty("--px",((e.clientX-r.left)/r.width-.5)*12+"px");
      visual.style.setProperty("--py",((e.clientY-r.top)/r.height-.5)*12+"px");
    },{passive:true});
  }
})();