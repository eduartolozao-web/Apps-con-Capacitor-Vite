
// MÓDULO DE GESTIÓN DE LUMINARIAS

const CLAVE_LUMINARIAS = 'mantenimientosLuminarias'

// CONSULTAR REGISTROS GUARDADOS

function obtenerLuminarias() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_LUMINARIAS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar luminarias:', error)
    return []
  }
}

// GUARDAR REGISTROS

function guardarLuminarias(registros) {
  try {
    localStorage.setItem(
      CLAVE_LUMINARIAS,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar luminarias:', error)
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

// PROTEGER LOS DATOS MOSTRADOS EN HTML

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

// MOSTRAR FORMULARIO DE LUMINARIAS

export function mostrarLuminarias(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">💡</div>

      <h2>Gestión de luminarias</h2>

      <p>
        Registre las revisiones, mantenimientos y reparaciones
        de las luminarias de la propiedad horizontal.
      </p>

      <form id="formulario-luminarias">

        <p>
          <label for="numero-luminaria">Número de luminaria</label>
          <input
            type="number"
            id="numero-luminaria"
            min="1"
            step="1"
            required
          >
        </p>

        <p>
          <label for="ubicacion-luminaria">Ubicación</label>
          <input
            type="text"
            id="ubicacion-luminaria"
            placeholder="Ejemplo: Pasillo Torre 1"
            required
          >
        </p>

        <p>
          <label for="fecha-luminaria">Fecha de la actividad</label>
          <input
            type="date"
            id="fecha-luminaria"
            required
          >
        </p>

        <p>
          <label for="actividad-luminaria">Tipo de actividad</label>
          <select id="actividad-luminaria" required>
            <option value="">Seleccione una actividad</option>
            <option value="Inspección">Inspección</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Reparación">Reparación</option>
            <option value="Cambio">Cambio</option>
          </select>
        </p>

        <p>
          <label for="estado-luminaria">Estado de la luminaria</label>
          <select id="estado-luminaria" required>
            <option value="">Seleccione el estado</option>
            <option value="Funcionando">Funcionando</option>
            <option value="Con fallas">Con fallas</option>
            <option value="Fuera de servicio">Fuera de servicio</option>
          </select>
        </p>

        <p>
          <label for="descripcion-luminaria">Descripción</label>
          <textarea
            id="descripcion-luminaria"
            rows="3"
            placeholder="Describa la actividad realizada"
            required
          ></textarea>
        </p>

        <p>
          <label for="costo-luminaria">Costo de la actividad (COP)</label>
          <input
            type="text"
            id="costo-luminaria"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 45000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-luminaria">Observaciones</label>
          <textarea
            id="observaciones-luminaria"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar actividad
        </button>

        <p id="mensaje-luminarias" aria-live="polite"></p>

      </form>

      <h3>Historial de luminarias</h3>

      <div id="historial-luminarias"></div>

    </section>
  `

  document.querySelector('#formulario-luminarias')
    .addEventListener('submit', registrarLuminaria)

  mostrarHistorialLuminarias()
}

// REGISTRAR ACTIVIDAD DE LUMINARIA

function registrarLuminaria(evento) {
  evento.preventDefault()

  const numeroTexto = document.querySelector('#numero-luminaria').value
  const numero = Number(numeroTexto)
  const ubicacion = document.querySelector('#ubicacion-luminaria').value.trim()
  const fecha = document.querySelector('#fecha-luminaria').value
  const actividad = document.querySelector('#actividad-luminaria').value
  const estado = document.querySelector('#estado-luminaria').value
  const descripcion = document.querySelector('#descripcion-luminaria').value.trim()
  const costoTexto = document.querySelector('#costo-luminaria').value
  const costo = Number(costoTexto)
  const observaciones = document.querySelector('#observaciones-luminaria').value.trim()

  const mensaje = document.querySelector('#mensaje-luminarias')

  if (
    !Number.isSafeInteger(numero) ||
    numero < 1 ||
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

  const registros = obtenerLuminarias()

  registros.push({
    numero,
    ubicacion,
    fecha,
    actividad,
    estado,
    descripcion,
    costo,
    observaciones
  })

  if (!guardarLuminarias(registros)) {
    mensaje.textContent = 'No fue posible guardar la actividad.'
    return
  }

  document.querySelector('#formulario-luminarias').reset()

  mensaje.textContent = 'Actividad registrada correctamente.'

  mostrarHistorialLuminarias()
}

// MOSTRAR HISTORIAL Y COSTOS

function mostrarHistorialLuminarias() {
  const historial = document.querySelector('#historial-luminarias')

  if (!historial) {
    return
  }

  const registros = obtenerLuminarias()

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
            <th>Luminaria</th>
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
              <td>${escaparHTML(registro.numero)}</td>
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
        Costo total de mantenimiento:
        ${formatoMoneda(total)}
      </strong>
    </p>
  `
}
