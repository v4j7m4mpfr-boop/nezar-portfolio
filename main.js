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
    document.body.classList.toggle("menu-open", open);
  };
  menuBtn.addEventListener("click", () => setMenu(menuBtn.getAttribute("aria-expanded") !== "true"));
  mobileMenu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  $("#projects").innerHTML = P.map((p, i) => {
    const image = p.image || "";
    return '<article class="project-card reveal" tabindex="0" role="button" aria-label="Explore '+escapeHTML(p.title)+' project" data-id="'+escapeHTML(p.id)+'"><div class="project-image"><img src="'+escapeHTML(image)+'" alt="'+escapeHTML(p.title)+' project preview" loading="lazy"><span class="project-number">0'+(i+1)+' / 06</span><span class="project-open" aria-hidden="true">↗</span></div><div class="project-info"><div><h3>'+escapeHTML(p.title)+'</h3><p>'+escapeHTML(p.category)+'</p></div><span class="project-type">VIEW CASE</span></div></article>';
  }).join("");

  $("#skill-list").innerHTML = S.skills.map((s) => '<li class="reveal"><strong>'+escapeHTML(s.name)+'</strong><span>'+escapeHTML(s.note)+'</span></li>').join("");
  const links = [["Instagram", S.instagram, "@nezar.elsawy__"],["Email", S.email ? "mailto:"+S.email : "", S.email]];
  $("#links").innerHTML = links.map(([name, href, label]) => href ? '<a href="'+escapeHTML(href)+'" '+(name==="Instagram"?'target="_blank" rel="noopener"':'')+'><span>'+escapeHTML(name)+'</span><span>'+escapeHTML(label)+' ↗</span></a>' : "").join("");
  if (S.email) $("#cta").href = "mailto:"+S.email;

  const revealObserver = "IntersectionObserver" in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }
  }), {threshold:.12}) : null;
  document.querySelectorAll(".reveal").forEach(el => revealObserver ? revealObserver.observe(el) : el.classList.add("visible"));

  const dlg = $("#case");
  let opener = null;
  const openCase = (id) => {
    const p = P.find(item => item.id === id);
    if (!p) return;
    $("#c-cat").textContent = p.category;
    $("#c-title").textContent = p.title;
    $("#c-sum").textContent = p.summary;
    $("#c-note").textContent = p.note;
    $("#c-cover").style.backgroundImage = "url('"+String(p.image || "").replace(/['()]/g,"") +"')";
    $("#c-tags").innerHTML = (p.tags || []).map(t => "<li>"+escapeHTML(t)+"</li>").join("");
    $("#c-body").innerHTML = (p.details || []).map(([h,t]) => "<div><h3>"+escapeHTML(h)+"</h3><p>"+escapeHTML(t)+"</p></div>").join("");
    $("#c-live").href = p.live;
    $("#c-frame").src = p.live;
    opener = document.activeElement;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open","");
    history.replaceState(null,"","#"+id);
  };
  const closeCase = () => { if (dlg.open) dlg.close(); else dlg.removeAttribute("open"); };
  $("#projects").addEventListener("click", e => { const card=e.target.closest("[data-id]"); if(card) openCase(card.dataset.id); });
  $("#projects").addEventListener("keydown", e => { if ((e.key==="Enter" || e.key===" ") && e.target.matches("[data-id]")) { e.preventDefault(); openCase(e.target.dataset.id); } });
  $("#c-close").addEventListener("click", closeCase);
  dlg.addEventListener("click", e => { if(e.target===dlg) closeCase(); });
  dlg.addEventListener("close", () => { $("#c-frame").removeAttribute("src"); history.replaceState(null,"",location.pathname); if(opener) opener.focus(); });
  if (P.some(p => "#"+p.id===location.hash)) openCase(location.hash.slice(1));

  if (!reduce && matchMedia("(pointer:fine)").matches) {
    addEventListener("pointermove", e => {
      const visual = $(".hero-visual");
      if (!visual) return;
      const rect=visual.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-.5, y=(e.clientY-rect.top)/rect.height-.5;
      visual.style.setProperty("--px", (x*12)+"px");
      visual.style.setProperty("--py", (y*12)+"px");
    }, {passive:true});
  }
})();