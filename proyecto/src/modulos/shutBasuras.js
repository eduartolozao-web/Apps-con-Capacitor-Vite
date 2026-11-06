
/* MÓDULO DE GESTIÓN DEL SHUT DE BASURAS */

const CLAVE_SHUT = 'mantenimientosShutBasuras'

// OBTENER LOS REGISTROS GUARDADOS

function obtenerMantenimientosShut() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_SHUT) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar los mantenimientos:', error)
    return []
  }
}

// GUARDAR LOS REGISTROS

function guardarMantenimientosShut(registros) {
  try {
    localStorage.setItem(
      CLAVE_SHUT,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar los mantenimientos:', error)
    return false
  }
}

// FORMATO DE MONEDA COLOMBIANA

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor)
}

// PROTEGER LOS DATOS QUE APARECEN EN LA TABLA

function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caracter => {
    const equivalencias = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }

    return equivalencias[caracter]
  })
}

// MOSTRAR FORMULARIO DEL SHUT DE BASURAS

export function mostrarShutBasuras(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🗑️</div>

      <h2>Gestión del shut de basuras</h2>

      <p>
        Registre las actividades de limpieza, mantenimiento
        y reparación del shut de basuras.
      </p>

      <form id="formulario-shut">

        <p>
          <label for="fecha-shut">Fecha de la actividad</label>
          <input
            type="date"
            id="fecha-shut"
            required
          >
        </p>

        <p>
          <label for="actividad-shut">Tipo de actividad</label>
          <select id="actividad-shut" required>
            <option value="">Seleccione una actividad</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Desinfección">Desinfección</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Reparación">Reparación</option>
          </select>
        </p>

        <p>
          <label for="descripcion-shut">Descripción</label>
          <textarea
            id="descripcion-shut"
            rows="3"
            placeholder="Describa el trabajo realizado"
            required
          ></textarea>
        </p>

        <p>
          <label for="estado-shut">Estado del shut</label>
          <select id="estado-shut" required>
            <option value="">Seleccione el estado</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </p>

        <p>
          <label for="costo-shut">Costo de la actividad (COP)</label>
          <input
            type="text"
            id="costo-shut"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 90000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-shut">Observaciones</label>
          <textarea
            id="observaciones-shut"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar actividad
        </button>

        <p id="mensaje-shut" aria-live="polite"></p>

      </form>

      <h3>Historial de actividades</h3>

      <div id="historial-shut"></div>

    </section>
  `

  document.querySelector('#formulario-shut')
    .addEventListener('submit', registrarActividadShut)

  mostrarHistorialShut()
}

// REGISTRAR ACTIVIDAD DEL SHUT

function registrarActividadShut(evento) {
  evento.preventDefault()

  const fecha = document.querySelector('#fecha-shut').value
  const actividad = document.querySelector('#actividad-shut').value
  const descripcion = document.querySelector('#descripcion-shut').value.trim()
  const estado = document.querySelector('#estado-shut').value
  const costoTexto = document.querySelector('#costo-shut').value
  const costo = Number(costoTexto)
  const observaciones = document.querySelector('#observaciones-shut').value.trim()

  const mensaje = document.querySelector('#mensaje-shut')

  if (
    !fecha ||
    !actividad ||
    !descripcion ||
    !estado ||
    !/^[0-9]+$/.test(costoTexto) ||
    !Number.isSafeInteger(costo) ||
    costo < 0
  ) {
    mensaje.textContent = 'Revise los datos del formulario.'
    return
  }

  const registros = obtenerMantenimientosShut()

  registros.push({
    fecha,
    actividad,
    descripcion,
    estado,
    costo,
    observaciones
  })

  if (!guardarMantenimientosShut(registros)) {
    mensaje.textContent = 'No fue posible guardar la actividad.'
    return
  }

  document.querySelector('#formulario-shut').reset()

  mensaje.textContent = 'Actividad registrada correctamente.'

  mostrarHistorialShut()
}

// MOSTRAR HISTORIAL Y COSTOS ACUMULADOS

function mostrarHistorialShut() {
  const historial = document.querySelector('#historial-shut')

  if (!historial) {
    return
  }

  const registros = obtenerMantenimientosShut()

  const total = registros.reduce(
    (suma, registro) => suma + Number(registro.costo),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay actividades registradas.</p>
      <p><strong>Costo total: ${formatoMoneda(0)}</strong></p>
    `
    return
  }

  historial.innerHTML = `
    <div style="overflow-x: auto;">
      <table
        border="1"
        cellpadding="10"
        style="width: 100%; border-collapse: collapse;"
      >
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Costo</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${escaparHTML(registro.actividad)}</td>
              <td>${escaparHTML(registro.descripcion)}</td>
              <td>${escaparHTML(registro.estado)}</td>
              <td>${formatoMoneda(registro.costo)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>
        Actividades registradas: ${registros.length}
      </strong>
    </p>

    <p>
      <strong>
        Costo total de actividades: ${formatoMoneda(total)}
      </strong>
    </p>
  `
}
