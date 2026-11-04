(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const S = window.SITE, P = window.PROJECTS;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* 1. Split the name into letters so each can animate */
  document.querySelectorAll("[data-split]").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    [...text].forEach((c, i) => {
      const s = document.createElement("span");
      s.className = "ch"; s.textContent = c;
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--i", i);
      el.appendChild(s);
    });
  });

  /* 2. Loader counter, then reveal the page */
  const ready = () => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("ready");
    const l = $(".loader");
    l.classList.add("done");
    setTimeout(() => l.remove(), 1000);
  };
  if (reduce) ready();
  else {
    let n = 0;
    const id = setInterval(() => {
      n = Math.min(100, n + 1 + Math.floor(Math.random() * 9));
      $(".count").textContent = String(n).padStart(3, "0");
      if (n === 100) { clearInterval(id); setTimeout(ready, 250); }
    }, 45);
  }

  /* 3. Live Alexandria clock */
  const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Africa/Cairo" });
  const tick = () => { $("#clock").textContent = fmt.format(new Date()) + " Alexandria"; };
  tick(); setInterval(tick, 10000);
  $("#year").textContent = new Date().getFullYear();

  /* 4. Menu */
  const btn = $(".nav .menu-btn"), menu = $("#menu");
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open);
    btn.textContent = open ? "Close" : "Menu";
    document.body.classList.toggle("lock", open);
  };
  btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* 5. Light that follows finger or cursor */
  if (!reduce) ["pointermove", "pointerdown"].forEach((ev) =>
    addEventListener(ev, (e) => {
      root.style.setProperty("--mx", e.clientX + "px");
      root.style.setProperty("--my", e.clientY + "px");
    }, { passive: true }));

  /* 6. Render projects, skills and contact from the data files */
  $("#projects").innerHTML = P.map((p, i) => {
    const inner = `<span class="ttl">${p.title}</span><span class="meta">${p.category}${p.soon ? " (in development)" : ""}</span>`;
    return `<li class="rv" style="--d:${i * 60}ms">` + (p.soon
      ? `<div class="row soon">${inner}</div>`
      : `<button class="row" type="button" data-id="${p.id}">${inner}</button>`) + "</li>";
  }).join("");
  $("#skill-list").innerHTML = S.skills.map((s, i) =>
    `<li class="rv" style="--d:${i * 60}ms"><span>${s.name}</span><small>${s.note}</small></li>`).join("");

  const links = [["GitHub", S.github, "github.com"], ["Instagram", S.instagram, "Instagram"], ["Email", S.email && "mailto:" + S.email, S.email]];
  $("#links").innerHTML = links.map(([name, href, text]) => href
    ? `<a href="${href}" target="${name === "Email" ? "_self" : "_blank"}" rel="noopener"><span>${name}</span><span>${text}</span></a>`
    : `<span class="off"><span>${name}</span><span>Coming soon</span></span>`).join("");
  if (S.email) $("#cta").href = "mailto:" + S.email;

  /* 7. Reveal list items as they scroll in */
  const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 }) : null;
  document.querySelectorAll(".rv").forEach((el) => io ? io.observe(el) : el.classList.add("in"));

  /* 8. Case study panel */
  const dlg = $("#case");
  let opener = null;
  const open = (id) => {
    const p = P.find((x) => x.id === id);
    if (!p || p.soon) return;
    $("#c-cat").textContent = p.category;
    $("#c-title").textContent = p.title;
    $("#c-sum").textContent = p.summary;
    $("#c-note").textContent = p.note;
    $("#c-tags").innerHTML = p.tags.map((t) => `<li>${t}</li>`).join("");
    $("#c-body").innerHTML = p.details.map(([h, t]) => `<h3>${h}</h3><p>${t}</p>`).join("");
    $("#c-live").href = p.live;
    $("#c-repo").href = p.repo;
    $("#c-frame").src = p.live;
    opener = document.activeElement;
    dlg.showModal ? dlg.showModal() : dlg.setAttribute("open", "");
    history.replaceState(null, "", "#" + id);
  };
  $("#projects").addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]");
    if (b) open(b.dataset.id);
  });
  $("#c-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("close", () => {
    $("#c-frame").removeAttribute("src");
    history.replaceState(null, "", location.pathname);
    if (opener) opener.focus();
  });
  if (P.some((p) => !p.soon && "#" + p.id === location.hash)) open(location.hash.slice(1));
})();
