(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const S = window.SITE || {skills:[],email:"",instagram:""};
  const P = window.PROJECTS || [];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const currentYear = new Date().getFullYear();
  $("#year").textContent = currentYear;
  const copyrightYear = $("#copyright-year");
  if (copyrightYear) copyrightYear.textContent = currentYear;

  const menuBtn = $(".menu-toggle"), mobileMenu = $("#mobile-menu");
  const setMenu = (open) => {
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) mobileMenu.querySelector("a")?.focus();
    else menuBtn.focus();
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  mobileMenu.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", e => { if (e.key === "Escape") { setMenu(false); closeProject(); } });

  const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const modal = $("#project-modal");
  const modalContent = $("#project-modal-content");
  let lastProjectTrigger = null;
  const closeProject = () => {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden","true");
    document.body.classList.remove("modal-open");
    if (lastProjectTrigger) lastProjectTrigger.focus();
  };
  const openProject = (p, trigger) => {
    if (!modal || !p) return;
    lastProjectTrigger = trigger || document.activeElement;
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
    modal.querySelector(".project-modal-close").focus();
  };
  $("#projects").innerHTML = P.map((p, i) =>
    '<article class="project-card reveal">'+
      '<button class="project-card-trigger" type="button" data-project="'+esc(p.id)+'" aria-label="View '+esc(p.title)+' case study">'+
        '<span class="project-image"><img src="'+esc(p.image || "")+'" alt="'+esc(p.title)+' website preview" loading="lazy" decoding="async"><span class="project-number">0'+(i+1)+' / 06</span><span class="project-open" aria-hidden="true"><svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 15L15 5M6 5H15V14" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"/></svg></span></span>'+
        '<span class="project-info"><span class="project-title-group"><strong>'+esc(p.title)+'</strong><span>'+esc(p.category)+'</span></span></span>'+
      '</button>'+
    '</article>'
  ).join("");
  $("#projects").addEventListener("click", e => {
    const trigger = e.target.closest("[data-project]");
    if (trigger) openProject(P.find(p => p.id === trigger.dataset.project), trigger);
  });
  modal.addEventListener("click",e=>{if(e.target===modal)closeProject();});

  $("#skill-list").innerHTML = S.skills.map(s => '<li class="reveal"><strong>'+esc(s.name)+'</strong><span>'+esc(s.note)+'</span></li>').join("");
  const instagramIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="17.7" cy="6.8" r="1" fill="currentColor"/></svg>';
  const emailIcon='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="1.7"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const links = [
    {name:"Instagram",href:S.instagram,label:"@nezar.elsawy__",icon:instagramIcon},
    {name:"Email",href:S.email ? "mailto:"+S.email : "",label:S.email,icon:emailIcon}
  ];
  $("#links").innerHTML = links.map(item => item.href ? '<a href="'+esc(item.href)+'" '+(item.name==="Instagram"?'target="_blank" rel="noopener"':'')+'><span class="social-link-main"><span class="social-link-icon">'+item.icon+'</span><span class="social-link-copy"><strong>'+esc(item.name)+'</strong><small>'+esc(item.label)+'</small></span></span><span class="social-link-arrow" aria-hidden="true">↗</span></a>' : "").join("");
  

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