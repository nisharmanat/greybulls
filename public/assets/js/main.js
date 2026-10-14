(function () {
  var D = window.GB;
  var $ = function (id) { return document.getElementById(id); };
  var img = function (name, small) { return "assets/img/" + name + (small ? "-sm" : "") + ".jpg"; };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]; }); };
  var initials = function (n) {
    var w = n.replace(/^(Adv|Dr)\.?\s*/i, "").replace(/\./g, " ").trim().split(/\s+/);
    return ((w[0] || "")[0] + (w.length > 1 ? w[w.length - 1][0] : (w[0] || "")[1] || "")).toUpperCase();
  };

  $("year").textContent = new Date().getFullYear();
  $("heroEyebrow").textContent = D.team.tagline + " · " + D.team.city;
  $("intro").textContent = D.team.intro;

  // Hero slider
  var slides = $("heroSlides"), dots = $("heroDots"), cap = $("heroCaption"), cur = 0, timer;
  D.hero.forEach(function (h, i) {
    var el = document.createElement("img");
    el.src = img(h.img); el.alt = h.caption;
    if (i > 0) el.loading = "lazy";
    slides.appendChild(el);
    var b = document.createElement("button");
    b.setAttribute("aria-label", "Show photo " + (i + 1));
    b.onclick = function () { show(i); restart(); };
    dots.appendChild(b);
  });
  function show(i) {
    cur = (i + D.hero.length) % D.hero.length;
    [].forEach.call(slides.children, function (el, k) { el.classList.toggle("on", k === cur); });
    [].forEach.call(dots.children, function (el, k) { el.classList.toggle("on", k === cur); });
    cap.style.opacity = 0;
    setTimeout(function () { cap.textContent = D.hero[cur].caption; cap.style.opacity = 1; }, 250);
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 6000); }
  show(0); restart();

  // Stats
  var titles = D.honours.filter(function (h) { return h.title === "Winners"; }).length;
  var awards = D.honours.length - titles;
  [[D.squad.length, "Players"], [titles, titles === 1 ? "League title" : "League titles"], [awards, "Player awards"], ["T20", "Format"]]
    .forEach(function (s) {
      $("stats").insertAdjacentHTML("beforeend", '<div class="stat"><b>' + esc(s[0]) + "</b><span>" + esc(s[1]) + "</span></div>");
    });

  // Featured players
  D.featured.forEach(function (f) {
    $("featured").insertAdjacentHTML("beforeend",
      '<figure class="feat"><img src="' + img(f.img, true) + '" alt="' + esc(f.name) + '" loading="lazy"' + (f.pos ? ' style="object-position:' + esc(f.pos) + '"' : "") + '>' +
      '<figcaption class="feat-info"><div class="feat-num">' + esc(f.number) + '</div><div class="feat-name">' + esc(f.name) +
      '</div><div class="feat-tag">' + esc(f.tag) + "</div></figcaption></figure>");
  });

  // Squad with filters
  var groups = [["All", null], ["Batters", "Batter"], ["Bowlers", "Bowler"], ["All-rounders", "All-rounder"], ["Keepers", "Wicketkeeper"]];
  var sorted = D.squad.slice().sort(function (a, b) { return (b.captain ? 1 : 0) - (a.captain ? 1 : 0) || a.name.localeCompare(b.name); });
  function renderSquad(role) {
    $("squadGrid").innerHTML = sorted.filter(function (p) { return !role || p.role === role; }).map(function (p) {
      var r = p.role || "Player";
      var style = [p.bat, p.bowl].filter(Boolean).join(" · ");
      var av = p.photo ? '<img src="' + img(p.photo, true) + '" alt="" loading="lazy">' : esc(initials(p.name));
      return '<article class="player"><div class="avatar">' + av + '</div><div class="p-body">' +
        '<div class="p-name">' + esc(p.name) + (p.number ? '<span class="num">#' + esc(p.number) + "</span>" : "") +
        (p.captain ? '<span class="badge">Captain</span>' : "") + "</div>" +
        '<div class="p-role r-' + r.toLowerCase() + '">' + esc(r) + "</div>" +
        (style ? '<div class="p-style">' + esc(style) + "</div>" : "") + "</div></article>";
    }).join("");
  }
  groups.forEach(function (g, i) {
    var n = g[1] ? D.squad.filter(function (p) { return p.role === g[1]; }).length : D.squad.length;
    var b = document.createElement("button");
    b.innerHTML = esc(g[0]) + '<span class="n">' + n + "</span>";
    b.setAttribute("role", "tab");
    b.onclick = function () {
      [].forEach.call($("filters").children, function (x) { x.classList.remove("on"); });
      b.classList.add("on"); renderSquad(g[1]);
    };
    if (i === 0) b.classList.add("on");
    $("filters").appendChild(b);
  });
  renderSquad(null);

  // Honours
  D.honours.forEach(function (h) {
    $("honoursGrid").insertAdjacentHTML("beforeend",
      '<figure class="honour"><img src="' + img(h.img, true) + '" alt="' + esc(h.title + ", " + h.event) + '" loading="lazy">' +
      '<div><span class="trophy">🏆</span><h3>' + esc(h.title) + "</h3><p>" + esc(h.event) + "</p></div></figure>");
  });

  // Gallery carousel + lightbox
  var car = $("carousel");
  D.gallery.forEach(function (g, i) {
    var b = document.createElement("button");
    b.className = "slide";
    b.setAttribute("aria-label", "Open photo: " + g.alt);
    b.innerHTML = '<img src="' + img(g.img, true) + '" alt="' + esc(g.alt) + '" loading="lazy">';
    b.onclick = function () { openLb(i); };
    car.appendChild(b);
  });
  var step = function () { return Math.max(280, car.clientWidth * 0.6); };
  $("galPrev").onclick = function () { car.scrollBy({left: -step(), behavior: "smooth"}); };
  $("galNext").onclick = function () { car.scrollBy({left: step(), behavior: "smooth"}); };
  var auto = setInterval(function () {
    if (car.scrollLeft + car.clientWidth >= car.scrollWidth - 5) car.scrollTo({left: 0, behavior: "smooth"});
    else car.scrollBy({left: step(), behavior: "smooth"});
  }, 4500);
  ["pointerdown", "wheel", "touchstart"].forEach(function (e) { car.addEventListener(e, function () { clearInterval(auto); }, {passive: true}); });

  var lb = $("lightbox"), lbImg = $("lbImg"), li = 0;
  function openLb(i) {
    li = (i + D.gallery.length) % D.gallery.length;
    lbImg.src = img(D.gallery[li].img); lbImg.alt = D.gallery[li].alt;
    lb.hidden = false; clearInterval(auto);
  }
  $("lbClose").onclick = function () { lb.hidden = true; };
  $("lbPrev").onclick = function () { openLb(li - 1); };
  $("lbNext").onclick = function () { openLb(li + 1); };
  lb.onclick = function (e) { if (e.target === lb) lb.hidden = true; };
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") lb.hidden = true;
    if (e.key === "ArrowLeft") openLb(li - 1);
    if (e.key === "ArrowRight") openLb(li + 1);
  });
})();
