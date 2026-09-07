function mostrarWizard() {
  document.getElementById("dashboard-section").classList.add("d-none");
  document.getElementById("wizard-section").classList.remove("d-none");
  document.getElementById("btn-reset").classList.add("d-none");
}

function mostrarDashboard() {
  document.getElementById("wizard-section").classList.add("d-none");
  document.getElementById("dashboard-section").classList.remove("d-none");
  document.getElementById("btn-reset").classList.remove("d-none");
  actualizarDashboardCompleto();
}

document.addEventListener("DOMContentLoaded", () => {
  inicializarWizard();
  inicializarDashboard();

  if (existePerfilGuardado()) {
    mostrarDashboard();
  } else {
    mostrarWizard();
  }
});