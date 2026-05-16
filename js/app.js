const OrbitX = (() => {
  const statusMessages = [
    "Nominal",
    "Deep space link stable",
    "Telemetry sync active",
    "Flight dynamics green",
    "Orbital assets online"
  ];

  const alertMessages = [
    { level: "info", title: "Telemetry", message: "S-band packet stream synchronized." },
    { level: "warning", title: "Power", message: "Solar array angle correction queued." },
    { level: "success", title: "Guidance", message: "Orbit stability within tolerance." },
    { level: "danger", title: "Thermal", message: "Radiator loop spike detected and damped." }
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  function formatUtc(date = new Date()) {
    return date.toISOString().replace("T", " ").slice(0, 19) + " UTC";
  }

  function initClock() {
    const clock = $("#utcClock");
    if (!clock) return;
    const tick = () => {
      clock.textContent = formatUtc();
    };
    tick();
    setInterval(tick, 1000);
  }

  function initActiveNav() {
    const file = location.pathname.split("/").pop() || "index.html";
    $$(".mission-nav .nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === file);
      if (href === file) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  function applyTheme(theme) {
    document.body.classList.toggle("theme-light", theme === "light");
    const icon = $("#themeToggle i");
    if (icon) {
      icon.className = theme === "light" ? "bi bi-stars" : "bi bi-moon-stars";
    }
    localStorage.setItem("orbitx-theme", theme);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem("orbitx-theme") || "dark";
    applyTheme(savedTheme);
    const toggle = $("#themeToggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("theme-light") ? "dark" : "light";
      applyTheme(nextTheme);
      showToast("Theme updated", `OrbitX switched to ${nextTheme === "light" ? "daylight ops" : "dark mission"} mode.`, "info");
    });
  }

  function initTooltips() {
    if (!window.bootstrap) return;
    $$('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
  }

  function showToast(title, message, level = "info") {
    const deck = $("#toastDeck");
    if (!deck || !window.bootstrap) return;
    const icon = level === "danger" ? "bi-exclamation-octagon" : level === "warning" ? "bi-exclamation-triangle" : level === "success" ? "bi-check2-circle" : "bi-broadcast";
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    toast.innerHTML = `
      <div class="toast-header bg-transparent border-0">
        <i class="bi ${icon} me-2 text-info"></i>
        <strong class="me-auto">${title}</strong>
        <small class="text-secondary">now</small>
        <button type="button" class="btn-close btn-close-white ms-2" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">${message}</div>
    `;
    deck.appendChild(toast);
    const instance = new bootstrap.Toast(toast, { delay: 5200 });
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
    instance.show();
  }

  function initSystemStatus() {
    const status = $("#systemStatus");
    if (!status) return;
    let index = 0;
    setInterval(() => {
      index = (index + 1) % statusMessages.length;
      status.textContent = statusMessages[index];
    }, 6000);
  }

  function initCounters() {
    const counters = $$(".counter[data-target]");
    if (!counters.length) return;
    const animate = (counter) => {
      if (counter.dataset.done === "true") return;
      counter.dataset.done = "true";
      const target = Number(counter.dataset.target);
      const suffix = counter.dataset.suffix || "";
      const duration = Number(counter.dataset.duration || 1300);
      const start = performance.now();
      const from = Number(counter.dataset.from || 0);
      const decimals = Number(counter.dataset.decimals || 0);
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = from + (target - from) * eased;
        counter.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      counters.forEach((counter) => observer.observe(counter));
    } else {
      counters.forEach(animate);
    }
  }

  function addAlert(container, item) {
    if (!container) return;
    const icon = item.level === "danger" ? "bi-exclamation-octagon" : item.level === "warning" ? "bi-exclamation-triangle" : item.level === "success" ? "bi-check2-circle" : "bi-info-circle";
    const alert = document.createElement("div");
    alert.className = "orbit-alert fade-in";
    alert.innerHTML = `
      <i class="bi ${icon}"></i>
      <div>
        <div class="d-flex align-items-center justify-content-between gap-2">
          <strong>${item.title}</strong>
          <span class="badge badge-soft">${new Date().toISOString().slice(11, 19)}</span>
        </div>
        <p>${item.message}</p>
      </div>
    `;
    container.prepend(alert);
    while (container.children.length > 6) container.lastElementChild.remove();
  }

  function initAlerts() {
    const feed = $("#globalAlertFeed");
    if (!feed) return;
    alertMessages.slice(0, 3).forEach((item) => addAlert(feed, item));
    setInterval(() => {
      const item = alertMessages[Math.floor(Math.random() * alertMessages.length)];
      addAlert(feed, item);
      if (Math.random() > 0.45) showToast(item.title, item.message, item.level);
    }, 13000);
  }

  function initInstallPrompt() {
    const installButton = $("#installBtn");
    let deferredPrompt = null;
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredPrompt = event;
      if (installButton) installButton.classList.remove("d-none");
    });
    if (!installButton) return;
    installButton.addEventListener("click", async () => {
      if (!deferredPrompt) {
        showToast("PWA ready", "Use your browser install menu to add OrbitX to this device.", "info");
        return;
      }
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      installButton.classList.add("d-none");
    });
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        console.warn("OrbitX service worker registration failed.");
      });
    });
  }

  function randomBetween(min, max, decimals = 0) {
    const value = min + Math.random() * (max - min);
    return Number(value.toFixed(decimals));
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function setProgress(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const safe = Math.max(0, Math.min(100, value));
    el.style.width = `${safe}%`;
    el.setAttribute("aria-valuenow", String(Math.round(safe)));
  }

  function initSatellites() {
    const page = document.body.dataset.page;
    if (page !== "satellites") return;
    const cards = $$(".satellite-card");
    const update = () => {
      cards.forEach((card) => {
        const online = Math.random() > 0.12;
        const signal = online ? randomBetween(72, 99) : randomBetween(0, 24);
        const battery = online ? randomBetween(48, 97) : randomBetween(12, 44);
        const badge = $(".state-badge", card);
        const signalText = $(".signal-value", card);
        const batteryText = $(".battery-value", card);
        const signalBar = $(".signal-bar", card);
        const batteryBar = $(".battery-bar", card);
        if (badge) {
          badge.textContent = online ? "Online" : "Offline";
          badge.className = `badge ${online ? "badge-success-soft" : "badge-danger-soft"} state-badge`;
        }
        if (signalText) signalText.textContent = `${signal}%`;
        if (batteryText) batteryText.textContent = `${battery}%`;
        if (signalBar) {
          signalBar.style.width = `${signal}%`;
          signalBar.classList.toggle("bg-danger", signal < 35);
        }
        if (batteryBar) {
          batteryBar.style.width = `${battery}%`;
          batteryBar.classList.toggle("bg-warning", battery < 45);
        }
      });
    };
    update();
    setInterval(update, 8000);
  }

  function initLunar() {
    const page = document.body.dataset.page;
    if (page !== "lunar") return;
    const resources = [
      { text: "oxygenValue", bar: "oxygenBar", min: 78, max: 96, suffix: "%" },
      { text: "solarValue", bar: "solarBar", min: 62, max: 91, suffix: "%" },
      { text: "waterValue", bar: "waterBar", min: 58, max: 84, suffix: "%" },
      { text: "thermalValue", bar: "thermalBar", min: 19, max: 24, suffix: " C" }
    ];
    const update = () => {
      resources.forEach((resource) => {
        const value = randomBetween(resource.min, resource.max);
        setText(resource.text, `${value}${resource.suffix}`);
        setProgress(resource.bar, resource.suffix.trim() === "C" ? value * 4 : value);
      });
      setText("regolithValue", `${randomBetween(38, 67)} kg/h`);
      setText("crewCycleValue", `${randomBetween(5, 7)} active`);
    };
    update();
    setInterval(update, 7000);
  }

  function initModals() {
    $$(".satellite-detail").forEach((button) => {
      button.addEventListener("click", () => {
        const modalTitle = $("#satelliteModalLabel");
        const modalBody = $("#satelliteModalBody");
        if (!modalTitle || !modalBody) return;
        modalTitle.textContent = button.dataset.name || "Satellite Asset";
        modalBody.innerHTML = `
          <p class="text-secondary mb-3">Remote diagnostic snapshot generated from the current local simulation.</p>
          <div class="row g-3">
            <div class="col-6"><div class="glass-card"><span class="card-label">Bus Voltage</span><p class="metric-value fs-3">${randomBetween(27, 31, 1)}<small> V</small></p></div></div>
            <div class="col-6"><div class="glass-card"><span class="card-label">Thermal Load</span><p class="metric-value fs-3">${randomBetween(38, 58)}<small>%</small></p></div></div>
          </div>
        `;
      });
    });
  }

  function init() {
    initClock();
    initActiveNav();
    initTheme();
    initTooltips();
    initCounters();
    initSystemStatus();
    initAlerts();
    initInstallPrompt();
    initSatellites();
    initLunar();
    initModals();
    registerServiceWorker();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    addAlert,
    randomBetween,
    setProgress,
    setText,
    showToast
  };
})();
