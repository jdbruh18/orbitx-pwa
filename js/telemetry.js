document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "telemetry") return;

  const logBody = document.getElementById("telemetryLogBody");
  const channels = ["NAV", "PROP", "COMMS", "THERMAL", "POWER", "GNC"];
  let altitude = 421.5;
  let velocity = 27640;
  let fuel = 64;

  function appendLog(channel, value, status) {
    if (!logBody) return;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date().toISOString().slice(11, 19)}</td>
      <td>${channel}</td>
      <td>${value}</td>
      <td><span class="badge ${status === "WARN" ? "badge-warning-soft" : "badge-success-soft"}">${status}</span></td>
    `;
    logBody.prepend(row);
    while (logBody.children.length > 8) logBody.lastElementChild.remove();
  }

  function updateTelemetry() {
    altitude += OrbitX.randomBetween(-0.18, 0.22, 2);
    velocity += OrbitX.randomBetween(-18, 24);
    fuel = Math.max(32, fuel - OrbitX.randomBetween(0.02, 0.16, 2));
    const latency = OrbitX.randomBetween(18, 84);
    const thermal = OrbitX.randomBetween(38, 63);
    const consumption = OrbitX.randomBetween(0.8, 2.4, 1);

    OrbitX.setText("velocityValue", `${velocity.toLocaleString()} km/h`);
    OrbitX.setText("altitudeValue", `${altitude.toFixed(2)} km`);
    OrbitX.setText("latencyValue", `${latency} ms`);
    OrbitX.setText("fuelFlowValue", `${consumption} kg/s`);
    OrbitX.setText("remainingFuelValue", `${fuel.toFixed(1)}%`);
    OrbitX.setText("thermalLoadValue", `${thermal}%`);

    OrbitX.setProgress("latencyBar", Math.max(5, 100 - latency));
    OrbitX.setProgress("fuelFlowBar", fuel);
    OrbitX.setProgress("thermalLoadBar", thermal);

    const channel = channels[Math.floor(Math.random() * channels.length)];
    const status = latency > 70 || thermal > 58 ? "WARN" : "OK";
    appendLog(channel, `${channel}-${OrbitX.randomBetween(1000, 9999)} packet`, status);
  }

  updateTelemetry();
  setInterval(updateTelemetry, 2400);
});
