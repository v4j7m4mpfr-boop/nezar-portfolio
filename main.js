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
  addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); closeProject(); } });

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const modal = $("#project-modal");
  const modalContent = $("#project-modal-content");
  const closeProject = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
  };
  const openProject = p => {
    if (!modal || !p) return;
    const external = /^https?:\/\//i.test(p.live);
    modalContent.innerHTML =
      '<div class="project-modal-visual"><img src="'+esc(p.image || "")+'" alt="'+esc(p.title)+' website preview"><span>'+esc(p.category)+'</span></div>'+
      '<div class="project-modal-copy">'+
        '<div class="project-modal-heading"><div><p>SELECTED PROJECT / CASE STUDY</p><h2>'+esc(p.title)+'</h2></div><button class="project-modal-close" type="button" aria-label="Close project details">×</button></div>'+
        '<p class="project-modal-summary">'+esc(p.summary)+'</p>'+
        '<div class="project-modal-tags">'+(p.tags||[]).map(t=>'<span>'+esc(t)+'</span>').join('')+'</div>'+
        '<div class="project-modal-details">'+(p.details||[]).map(d=>'<section><h3>'+esc(d[0])+'</h3><p>'+esc(d[1])+'</p></section>').join('')+'</div>'+
        '<p class="project-modal-note">'+esc(p.note||"Independent concept project.")+'</p>'+
        '<a class="project-modal-visit" href="'+esc(p.live)+'" '+(external?'target="_blank" rel="noopener"':'')+'>EXPLORE LIVE WEBSITE <span>↗</span></a>'+
      '</div>';
    modal.classList.add("open");
    modal.setAttribute("aria-hidden","false");
    document.body.classList.add("modal-open");
    modal.querySelector(".project-modal-close").addEventListener("click",closeProject);
  };
  $("#projects").innerHTML = P.map((p, i) =>
    '<article class="project-card reveal">'+
      '<button class="project-card-trigger" type="button" data-project="'+esc(p.id)+'" aria-label="View '+esc(p.title)+' case study">'+
        '<span class="project-image"><img src="'+esc(p.image || "")+'" alt="'+esc(p.title)+' website preview" loading="lazy"><span class="project-number">0'+(i+1)+' / 06</span><span class="project-open" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 15L15 5M6 5H15V14" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>'+
        '<span class="project-info"><span class="project-title-group"><strong>'+esc(p.title)+'</strong><span>'+esc(p.category)+'</span></span></span>'+
      '</button>'+
    '</article>'
  ).join("");
  $("#projects").addEventListener("click", e => {
    const trigger = e.target.closest("[data-project]");
    if (trigger) openProject(P.find(p => p.id === trigger.dataset.project));
  });
  modal.addEventListener("click",e=>{if(e.target===modal)closeProject();});

  $("#skill-list").innerHTML = S.skills.map(s => '<li class="reveal"><strong>'+esc(s.name)+'</strong><span>'+esc(s.note)+'</span></li>').join("");
  const links = [["Instagram",S.instagram,"@nezar.elsawy__"],["Email",S.email ? "mailto:"+S.email : "",S.email]];
  $("#links").innerHTML = links.map(([name,href,label]) => href ? '<a href="'+esc(href)+'" '+(name==="Instagram"?'target="_blank" rel="noopener"':'')+'><span>'+esc(name)+'</span><span>'+esc(label)+' ↗</span></a>' : "").join("");
  if (S.email) $("#cta").href = "mailto:"+S.email+"?subject=Website%20project%20enquiry";

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