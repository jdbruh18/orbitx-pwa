document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "launch") return;

  const totalSeconds = 300;
  let remaining = Number(localStorage.getItem("orbitx-countdown") || totalSeconds);
  let timer = null;

  const display = document.getElementById("countdownDisplay");
  const progress = document.getElementById("launchProgress");
  const stageLabel = document.getElementById("launchStageLabel");
  const rocket = document.getElementById("rocketVisual");
  const startBtn = document.getElementById("launchStart");
  const holdBtn = document.getElementById("launchHold");
  const resetBtn = document.getElementById("launchReset");
  const ignitionBtn = document.getElementById("ignitionBtn");
  const stageSteps = [...document.querySelectorAll(".stage-step")];

  const stages = [
    { at: 300, label: "Ground systems" },
    { at: 220, label: "Propellant loading" },
    { at: 150, label: "Guidance align" },
    { at: 70, label: "Terminal count" },
    { at: 10, label: "Ignition sequence" }
  ];

  function format(seconds) {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = Math.max(0, seconds % 60).toString().padStart(2, "0");
    return `T-${mins}:${secs}`;
  }

  function stageIndex() {
    if (remaining <= 10) return 4;
    if (remaining <= 70) return 3;
    if (remaining <= 150) return 2;
    if (remaining <= 220) return 1;
    return 0;
  }

  function render() {
    if (display) display.textContent = remaining > 0 ? format(remaining) : "LIFTOFF";
    if (progress) {
      const done = ((totalSeconds - remaining) / totalSeconds) * 100;
      progress.style.width = `${Math.max(0, Math.min(100, done))}%`;
      progress.setAttribute("aria-valuenow", String(Math.round(done)));
    }

    const active = stageIndex();
    stageSteps.forEach((step, index) => {
      step.classList.toggle("active", index === active);
      step.classList.toggle("complete", index < active || remaining === 0);
    });
    if (stageLabel) stageLabel.textContent = remaining === 0 ? "Vehicle clear of tower" : stages[active].label;
    if (rocket) rocket.classList.toggle("igniting", remaining <= 10);

    OrbitX.setText("engineChillValue", `${OrbitX.randomBetween(82, 98)}%`);
    OrbitX.setText("tankPressureValue", `${OrbitX.randomBetween(92, 101)}%`);
    OrbitX.setText("weatherValue", `${OrbitX.randomBetween(88, 97)}%`);
    OrbitX.setProgress("engineChillBar", OrbitX.randomBetween(82, 98));
    OrbitX.setProgress("tankPressureBar", OrbitX.randomBetween(88, 100));
    OrbitX.setProgress("weatherBar", OrbitX.randomBetween(84, 98));
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      remaining = 0;
      clearInterval(timer);
      timer = null;
      localStorage.setItem("orbitx-countdown", String(totalSeconds));
      OrbitX.showToast("Liftoff", "OrbitX launch vehicle has cleared the tower.", "success");
    } else {
      localStorage.setItem("orbitx-countdown", String(remaining));
    }
    render();
  }

  startBtn?.addEventListener("click", () => {
    if (timer) return;
    OrbitX.showToast("Countdown resumed", "Autosequence is running.", "success");
    timer = setInterval(tick, 1000);
  });

  holdBtn?.addEventListener("click", () => {
    if (timer) clearInterval(timer);
    timer = null;
    OrbitX.showToast("Countdown hold", "Launch sequence paused by flight director.", "warning");
    render();
  });

  resetBtn?.addEventListener("click", () => {
    if (timer) clearInterval(timer);
    timer = null;
    remaining = totalSeconds;
    localStorage.setItem("orbitx-countdown", String(remaining));
    OrbitX.showToast("Countdown reset", "Launch timeline restored to T-05:00.", "info");
    render();
  });

  ignitionBtn?.addEventListener("click", () => {
    remaining = Math.min(remaining, 10);
    localStorage.setItem("orbitx-countdown", String(remaining));
    OrbitX.showToast("Ignition armed", "Engine start sequencer moved to final ten seconds.", "danger");
    render();
  });

  render();
});
