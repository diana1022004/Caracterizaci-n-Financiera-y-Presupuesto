const FINANZAS_STORAGE_KEY = "finanzasPersonalesData";

function obtenerDatosGuardados() {
  const raw = localStorage.getItem(FINANZAS_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Datos corruptos en localStorage, se ignorarán:", error);
    return null;
  }
}

/** Guarda el objeto de datos completo en localStorage. */
function guardarDatos(data) {
  localStorage.setItem(FINANZAS_STORAGE_KEY, JSON.stringify(data));
}

/** Elimina toda la información guardada (usado por "Resetear"). */
function limpiarDatosGuardados() {
  localStorage.removeItem(FINANZAS_STORAGE_KEY);
}

/** true si ya existe un perfil de caracterización guardado. */
function existePerfilGuardado() {
  const datos = obtenerDatosGuardados();
  return !!(datos && datos.ingresos);
}

/** Genera un id simple y suficientemente único para filas dinámicas. */
function generarId(prefijo) {
  return `${prefijo}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}