
// MÓDULO DE GESTIÓN DE FACHADAS

const CLAVE_FACHADAS = 'mantenimientosFachadas'

// CONSULTAR REGISTROS GUARDADOS

function obtenerFachadas() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_FACHADAS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar fachadas:', error)
    return []
  }
}

// GUARDAR REGISTROS

function guardarFachadas(registros) {
  try {
    localStorage.setItem(
      CLAVE_FACHADAS,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar fachadas:', error)
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

// PROTEGER LOS TEXTOS MOSTRADOS EN PANTALLA

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

// MOSTRAR FORMULARIO DE FACHADAS

export function mostrarFachadas(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🏢</div>

      <h2>Gestión de fachadas</h2>

      <p>
        Registre los mantenimientos e intervenciones
        realizados en las fachadas de la propiedad horizontal.
      </p>

      <form id="formulario-fachadas">

        <p>
          <label for="torre-fachada">Torre o bloque</label>
          <input
            type="text"
            id="torre-fachada"
            placeholder="Ejemplo: Torre 1"
            required
          >
        </p>

        <p>
          <label for="ubicacion-fachada">Ubicación de la fachada</label>
          <select id="ubicacion-fachada" required>
            <option value="">Seleccione la ubicación</option>
            <option value="Frontal">Frontal</option>
            <option value="Posterior">Posterior</option>
            <option value="Lateral">Lateral</option>
            <option value="Otra">Otra</option>
          </select>
        </p>

        <p>
          <label for="fecha-fachada">Fecha de la intervención</label>
          <input
            type="date"
            id="fecha-fachada"
            required
          >
        </p>

        <p>
          <label for="actividad-fachada">Tipo de actividad</label>
          <select id="actividad-fachada" required>
            <option value="">Seleccione una actividad</option>
            <option value="Inspección">Inspección</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Reparación">Reparación</option>
            <option value="Pintura">Pintura</option>
            <option value="Mantenimiento">Mantenimiento</option>
          </select>
        </p>

        <p>
          <label for="estado-fachada">Estado de la fachada</label>
          <select id="estado-fachada" required>
            <option value="">Seleccione el estado</option>
            <option value="Bueno">Bueno</option>
            <option value="Regular">Regular</option>
            <option value="Malo">Malo</option>
          </select>
        </p>

        <p>
          <label for="descripcion-fachada">Descripción</label>
          <textarea
            id="descripcion-fachada"
            rows="3"
            placeholder="Describa los trabajos realizados"
            required
          ></textarea>
        </p>

        <p>
          <label for="costo-fachada">Costo de la intervención (COP)</label>
          <input
            type="text"
            id="costo-fachada"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 250000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-fachada">Observaciones</label>
          <textarea
            id="observaciones-fachada"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar intervención
        </button>

        <p id="mensaje-fachadas" aria-live="polite"></p>

      </form>

      <h3>Historial de intervenciones</h3>

      <div id="historial-fachadas"></div>

    </section>
  `

  document.querySelector('#formulario-fachadas')
    .addEventListener('submit', registrarFachada)

  mostrarHistorialFachadas()
}

// REGISTRAR INTERVENCIÓN

function registrarFachada(evento) {
  evento.preventDefault()

  const torre = document.querySelector('#torre-fachada').value.trim()
  const ubicacion = document.querySelector('#ubicacion-fachada').value
  const fecha = document.querySelector('#fecha-fachada').value
  const actividad = document.querySelector('#actividad-fachada').value
  const estado = document.querySelector('#estado-fachada').value
  const descripcion = document.querySelector('#descripcion-fachada').value.trim()
  const costoTexto = document.querySelector('#costo-fachada').value
  const costo = Number(costoTexto)
  const observaciones = document.querySelector('#observaciones-fachada').value.trim()

  const mensaje = document.querySelector('#mensaje-fachadas')

  if (
    !torre ||
    !ubicacion ||
    !fecha ||
    !actividad ||
    !estado ||
    !descripcion ||
    !/^[0-9]+$/.test(costoTexto) ||
    !Number.isSafeInteger(costo) ||
    costo < 0
  ) {
    mensaje.textContent = 'Revise los datos del formulario.'
    return
  }

  const registros = obtenerFachadas()

  registros.push({
    torre,
    ubicacion,
    fecha,
    actividad,
    estado,
    descripcion,
    costo,
    observaciones
  })

  if (!guardarFachadas(registros)) {
    mensaje.textContent = 'No fue posible guardar la intervención.'
    return
  }

  document.querySelector('#formulario-fachadas').reset()

  mensaje.textContent = 'Intervención registrada correctamente.'

  mostrarHistorialFachadas()
}

// MOSTRAR HISTORIAL Y COSTOS

function mostrarHistorialFachadas() {
  const historial = document.querySelector('#historial-fachadas')

  if (!historial) {
    return
  }

  const registros = obtenerFachadas()

  const total = registros.reduce(
    (suma, registro) => suma + Number(registro.costo),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay intervenciones registradas.</p>
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
            <th>Torre</th>
            <th>Ubicación</th>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Estado</th>
            <th>Descripción</th>
            <th>Costo</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>${escaparHTML(registro.torre)}</td>
              <td>${escaparHTML(registro.ubicacion)}</td>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${escaparHTML(registro.actividad)}</td>
              <td>${escaparHTML(registro.estado)}</td>
              <td>${escaparHTML(registro.descripcion)}</td>
              <td>${formatoMoneda(registro.costo)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>
        Intervenciones registradas: ${registros.length}
      </strong>
    </p>

    <p>
      <strong>
        Costo total de intervenciones:
        ${formatoMoneda(total)}
      </strong>
    </p>
  `
}
