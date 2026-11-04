(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const S = window.SITE, P = window.PROJECTS;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  document.querySelectorAll("[data-split]").forEach((el) => {
    const value = el.textContent; el.textContent = "";
    [...value].forEach((c, i) => { const span = document.createElement("span"); span.className = "ch"; span.textContent = c; span.setAttribute("aria-hidden", "true"); span.style.setProperty("--i", i); el.appendChild(span); });
  });
  const ready = () => { document.body.classList.remove("is-loading"); document.body.classList.add("ready"); const loader = $(".loader"); if (loader) { loader.classList.add("done"); setTimeout(() => loader.remove(), 1000); } };
  if (reduce) ready(); else { let n = 0; const id = setInterval(() => { n = Math.min(100, n + 1 + Math.floor(Math.random() * 9)); $(".count").textContent = String(n).padStart(3, "0"); if (n === 100) { clearInterval(id); setTimeout(ready, 250); } }, 45); }
  $("#year").textContent = new Date().getFullYear();
  const btn = $(".nav .menu-btn"), menu = $("#menu");
  const setMenu = (open) => { menu.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.textContent = open ? "Close" : "Menu"; document.body.classList.toggle("lock", open); };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  if (!reduce) ["pointermove", "pointerdown"].forEach((ev) => addEventListener(ev, (e) => { root.style.setProperty("--mx", e.clientX + "px"); root.style.setProperty("--my", e.clientY + "px"); }, { passive: true }));
  $("#projects").innerHTML = P.map((p, i) => {
    const inner = '<span class="ttl">' + p.title + '</span><span class="meta">' + p.category + '</span>';
    return '<li class="rv" style="--d:' + (i * 60) + 'ms"><button class="row" type="button" data-id="' + p.id + '">' + inner + '</button></li>';
  }).join("");
  $("#skill-list").innerHTML = S.skills.map((s, i) => '<li class="rv" style="--d:' + (i * 60) + 'ms"><span>' + s.name + '</span><small>' + s.note + '</small></li>').join("");
  const links = [["Instagram", S.instagram, "@nezar.elsawy__"], ["Email", S.email && "mailto:" + S.email, S.email]];
  $("#links").innerHTML = links.map(([name, href, label]) => href ? '<a href="' + href + '" target="' + (name === "Email" ? "_self" : "_blank") + '" rel="noopener"><span>' + name + '</span><span>' + label + '</span></a>' : "").join("");
  if (S.email) $("#cta").href = "mailto:" + S.email;
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); } }), { threshold: 0.15 }) : null;
  document.querySelectorAll(".rv").forEach((el) => io ? io.observe(el) : el.classList.add("in"));
  const dlg = $("#case"); let opener = null;
  const open = (id) => {
    const p = P.find((x) => x.id === id); if (!p) return;
    $("#c-cat").textContent = p.category; $("#c-title").textContent = p.title; $("#c-sum").textContent = p.summary; $("#c-note").textContent = p.note;
    $("#c-tags").innerHTML = p.tags.map((t) => "<li>" + t + "</li>").join("");
    $("#c-body").innerHTML = p.details.map(([h, t]) => "<h3>" + h + "</h3><p>" + t + "</p>").join("");
    $("#c-live").href = p.live; $("#c-frame").src = p.live; opener = document.activeElement;
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", ""); history.replaceState(null, "", "#" + id);
  };
  $("#projects").addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) open(b.dataset.id); });
  $("#c-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => { $("#c-frame").removeAttribute("src"); history.replaceState(null, "", location.pathname); if (opener) opener.focus(); });
  if (P.some((p) => "#" + p.id === location.hash)) open(location.hash.slice(1));
})();