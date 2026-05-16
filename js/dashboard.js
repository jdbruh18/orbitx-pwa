document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page !== "dashboard") return;

  const feed = document.getElementById("dashboardAlertFeed");
  const missions = [
    "Artemis Relay reports narrow-band interference.",
    "Crew biosigns refreshed from habitat loop.",
    "Fuel trim burn completed on autonomous schedule.",
    "Orbital debris corridor updated for next pass.",
    "Docking port pressure test finished."
  ];

  const addMissionAlert = (message) => {
    OrbitX.addAlert(feed, {
      level: message.includes("interference") ? "warning" : "success",
      title: "Mission Control",
      message
    });
  };

  missions.slice(1, 4).forEach(addMissionAlert);

  const updateDashboard = () => {
    const fuel = OrbitX.randomBetween(66, 86);
    const orbit = OrbitX.randomBetween(92, 99, 1);
    const crew = OrbitX.randomBetween(96, 100);
    const power = OrbitX.randomBetween(72, 94);

    OrbitX.setText("fuelStatusValue", `${fuel}%`);
    OrbitX.setText("orbitStabilityValue", `${orbit}%`);
    OrbitX.setText("crewReadinessValue", `${crew}%`);
    OrbitX.setText("powerReserveValue", `${power}%`);
    OrbitX.setProgress("fuelStatusBar", fuel);
    OrbitX.setProgress("orbitStabilityBar", orbit);
    OrbitX.setProgress("crewReadinessBar", crew);
    OrbitX.setProgress("powerReserveBar", power);
  };

  updateDashboard();
  setInterval(updateDashboard, 5000);
  setInterval(() => addMissionAlert(missions[Math.floor(Math.random() * missions.length)]), 11000);
});
