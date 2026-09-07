function calcularResumen(datos) {
  const ingresosTotales = (datos.ingresos.principal || 0) + (datos.ingresos.adicionales || 0);
  const gastosFijosReal = datos.gastosFijos.reduce((acc, g) => acc + (g.montoReal || 0), 0);
  const balanceInicial = ingresosTotales - gastosFijosReal;
  const gastosVariablesTotal = datos.gastosVariables.reduce((acc, g) => acc + (g.monto || 0), 0);
  const saldoActual = balanceInicial - gastosVariablesTotal;

  return { ingresosTotales, gastosFijosReal, balanceInicial, gastosVariablesTotal, saldoActual };
}

function renderizarResumen() {
  const datos = obtenerDatosGuardados();
  if (!datos) return;

  const { ingresosTotales, gastosFijosReal, balanceInicial, gastosVariablesTotal, saldoActual } =
    calcularResumen(datos);

  document.getElementById("card-ingresos-totales").textContent = formatoMoneda.format(ingresosTotales);
  document.getElementById("card-gastos-fijos").textContent = formatoMoneda.format(gastosFijosReal);
  document.getElementById("card-balance-inicial").textContent = formatoMoneda.format(balanceInicial);
  document.getElementById("card-gastos-variables").textContent = formatoMoneda.format(gastosVariablesTotal);
  document.getElementById("saldo-actual").textContent = formatoMoneda.format(saldoActual);
}

function renderizarTablaGastos() {
  const datos = obtenerDatosGuardados();
  const tbody = document.getElementById("tabla-gastos-diarios");
  const mensajeVacio = document.getElementById("sin-gastos-msg");
  tbody.innerHTML = "";

  if (!datos || datos.gastosVariables.length === 0) {
    mensajeVacio.classList.remove("d-none");
    return;
  }
  mensajeVacio.classList.add("d-none");


  const gastosOrdenados = [...datos.gastosVariables].sort(
    (a, b) => new Date(b.fecha) - new Date(a.fecha)
  );

  gastosOrdenados.forEach((gasto) => {
    const fila = document.createElement("tr");
    const fechaLegible = new Date(gasto.fecha).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "short",
    });

    fila.innerHTML = `
      <td>${fechaLegible}</td>
      <td>${escaparHTML(gasto.concepto)}</td>
      <td><span class="categoria-chip">${escaparHTML(gasto.categoria)}</span></td>
      <td class="text-end">${formatoMoneda.format(gasto.monto)}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-eliminar-gasto" data-id="${gasto.id}" title="Eliminar">
          <i class="bi bi-trash3"></i>
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });

  tbody.querySelectorAll(".btn-eliminar-gasto").forEach((btn) => {
    btn.addEventListener("click", () => eliminarGastoDiario(btn.dataset.id));
  });
}

function escaparHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function eliminarGastoDiario(id) {
  const datos = obtenerDatosGuardados();
  if (!datos) return;
  datos.gastosVariables = datos.gastosVariables.filter((g) => g.id !== id);
  guardarDatos(datos);
  renderizarTablaGastos();
  renderizarResumen();
}

function inicializarDashboard() {
  const form = document.getElementById("form-gasto-diario");

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const concepto = document.getElementById("gd-concepto").value.trim();
    const monto = Number(document.getElementById("gd-monto").value);
    const categoria = document.getElementById("gd-categoria").value;

    if (!concepto || !monto || monto <= 0) return;

    const datos = obtenerDatosGuardados();
    datos.gastosVariables.push({
      id: generarId("gv"),
      concepto,
      monto,
      categoria,
      fecha: new Date().toISOString(),
    });
    guardarDatos(datos);

    form.reset();
    document.getElementById("gd-concepto").focus();

    renderizarTablaGastos();
    renderizarResumen();
  });

  
  const btnReset = document.getElementById("btn-reset");
  const btnConfirmarReset = document.getElementById("btn-confirmar-reset");
  const modalResetEl = document.getElementById("modalReset");
  const modalReset = new bootstrap.Modal(modalResetEl);

  btnReset.addEventListener("click", () => modalReset.show());

  btnConfirmarReset.addEventListener("click", () => {
    limpiarDatosGuardados();
    modalReset.hide();
    reiniciarWizardUI();
    mostrarWizard();
  });
}

function actualizarDashboardCompleto() {
  renderizarResumen();
  renderizarTablaGastos();
}