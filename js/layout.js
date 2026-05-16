(() => {
  const navItems = [
    { href: "index.html", icon: "bi-stars", label: "Landing" },
    { href: "dashboard.html", icon: "bi-grid-1x2", label: "Dashboard" },
    { href: "launch.html", icon: "bi-rocket-takeoff", label: "Launch Center" },
    { href: "satellites.html", icon: "bi-broadcast-pin", label: "Satellites" },
    { href: "lunar.html", icon: "bi-moon-stars", label: "Lunar Ops" },
    { href: "telemetry.html", icon: "bi-activity", label: "Telemetry" },
    { href: "about.html", icon: "bi-info-circle", label: "About" }
  ];

  const pageMeta = {
    index: {
      kicker: "OrbitX Command",
      title: "Landing Command",
      footerLeft: "OrbitX Mission Operations Dashboard",
      footerRight: "HTML5 / CSS3 / Bootstrap 5 / Vanilla JS / PWA"
    },
    dashboard: {
      kicker: "Flight Room",
      title: "Mission Dashboard",
      footerLeft: "OrbitX Mission Dashboard",
      footerRight: "Simulated locally with vanilla JavaScript"
    },
    launch: {
      kicker: "Launch Control",
      title: "Rocket Launch Center",
      footerLeft: "OrbitX Rocket Launch Center",
      footerRight: "Countdown persists in localStorage"
    },
    satellites: {
      kicker: "Orbital Assets",
      title: "Satellite Monitor",
      footerLeft: "OrbitX Satellite Monitor",
      footerRight: "Signal and battery states refresh every few seconds"
    },
    lunar: {
      kicker: "Surface Control",
      title: "Lunar Operations",
      footerLeft: "OrbitX Lunar Operations",
      footerRight: "Habitat resource simulation refreshes locally"
    },
    telemetry: {
      kicker: "Live Stream",
      title: "Telemetry Center",
      footerLeft: "OrbitX Telemetry Center",
      footerRight: "Metrics are generated in-browser"
    },
    about: {
      kicker: "Project Brief",
      title: "About OrbitX",
      footerLeft: "OrbitX About",
      footerRight: "Static, responsive, installable, and offline-ready"
    }
  };

  function brandMarkup(labelId = "") {
    const id = labelId ? ` id="${labelId}"` : "";
    return `
      <a class="brand" href="index.html"${id}>
        <span class="brand-mark">OX</span>
        <span><strong>OrbitX</strong><small>Mission Ops</small></span>
      </a>
    `;
  }

  function navMarkup() {
    return navItems.map((item) => `
      <a class="nav-link" href="${item.href}"><i class="bi ${item.icon}"></i> ${item.label}</a>
    `).join("");
  }

  function sidebarMarkup() {
    return `
      <aside class="mission-sidebar d-none d-lg-flex" aria-label="Primary navigation" data-layout="global">
        ${brandMarkup()}
        <nav class="nav mission-nav flex-column">
          ${navMarkup()}
        </nav>
        <div class="sidebar-footer">
          <div class="mini-radar"><span></span></div>
          <p>Deep Space Network</p>
          <span class="badge badge-success-soft">Stable Link</span>
        </div>
      </aside>
    `;
  }

  function offcanvasMarkup() {
    return `
      <div class="offcanvas offcanvas-start orbit-offcanvas" tabindex="-1" id="orbitNav" aria-labelledby="orbitNavLabel" data-layout="global">
        <div class="offcanvas-header">
          ${brandMarkup("orbitNavLabel")}
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <nav class="nav mission-nav flex-column">
            ${navMarkup()}
          </nav>
        </div>
      </div>
    `;
  }

  function topbarMarkup(meta) {
    return `
      <nav class="topbar navbar sticky-top">
        <button class="btn icon-btn d-lg-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#orbitNav" aria-controls="orbitNav" aria-label="Open navigation">
          <i class="bi bi-list"></i>
        </button>
        <div class="topbar-title">
          <span class="page-kicker">${meta.kicker}</span>
          <h1>${meta.title}</h1>
        </div>
        <div class="topbar-actions ms-lg-auto">
          <span class="clock-pill"><i class="bi bi-clock-history"></i><span id="utcClock">--</span></span>
          <span class="status-pill"><span class="live-dot"></span><span id="systemStatus">Nominal</span></span>
          <button class="btn icon-btn d-none" id="installBtn" type="button" data-bs-toggle="tooltip" data-bs-title="Install OrbitX"><i class="bi bi-download"></i></button>
          <button class="btn icon-btn" id="themeToggle" type="button" data-bs-toggle="tooltip" data-bs-title="Toggle theme"><i class="bi bi-moon-stars"></i></button>
        </div>
      </nav>
    `;
  }

  function footerMarkup(meta) {
    return `
      <footer class="footer">
        <div class="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-2">
          <span>${meta.footerLeft}</span>
          <span>${meta.footerRight}</span>
        </div>
      </footer>
    `;
  }

  function renderLayout() {
    if (document.querySelector("[data-layout='global']")) return;

    const page = document.body.dataset.page || "index";
    const meta = pageMeta[page] || pageMeta.index;
    const main = document.querySelector("main");
    if (!main) return;

    const sidebarTemplate = document.createElement("template");
    sidebarTemplate.innerHTML = sidebarMarkup().trim();

    const offcanvasTemplate = document.createElement("template");
    offcanvasTemplate.innerHTML = offcanvasMarkup().trim();

    const appMain = document.createElement("div");
    appMain.className = "app-main";
    appMain.innerHTML = `${topbarMarkup(meta)}<div data-main-slot></div>${footerMarkup(meta)}`;

    document.body.insertBefore(sidebarTemplate.content.firstElementChild, main);
    document.body.insertBefore(offcanvasTemplate.content.firstElementChild, main);
    main.parentNode.insertBefore(appMain, main);
    appMain.querySelector("[data-main-slot]").replaceWith(main);

    if (!document.getElementById("toastDeck")) {
      const toastDeck = document.createElement("div");
      toastDeck.className = "toast-container position-fixed bottom-0 end-0 p-3";
      toastDeck.id = "toastDeck";
      document.body.appendChild(toastDeck);
    }
  }

  document.addEventListener("DOMContentLoaded", renderLayout);
})();
