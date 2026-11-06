
// MÓDULO DE CANCHAS
// REGISTRO DE UTILIZACIÓN

const CLAVE_USOS = 'utilizacionCanchas'

// OBTENER LOS REGISTROS GUARDADOS

function obtenerUsosCanchas() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_USOS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar las canchas:', error)
    return []
  }
}

// GUARDAR LOS REGISTROS

function guardarUsosCanchas(registros) {
  try {
    localStorage.setItem(CLAVE_USOS, JSON.stringify(registros))
    return true
  } catch (error) {
    console.error('Error al guardar la información:', error)
    return false
  }
}

// PROTEGER EL CONTENIDO MOSTRADO EN PANTALLA

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

// MOSTRAR EL FORMULARIO DE UTILIZACIÓN

export function mostrarCanchas(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🏀</div>

      <h2>Gestión de canchas</h2>

      <h3>Registro de utilización</h3>

      <p>
        Registre el uso de las canchas de la propiedad horizontal.
      </p>

      <form id="formulario-canchas">

        <p>
          <label for="numero-cancha">Número de cancha</label>
          <input
            type="number"
            id="numero-cancha"
            min="1"
            step="1"
            required
          >
        </p>

        <p>
          <label for="fecha-cancha">Fecha de utilización</label>
          <input
            type="date"
            id="fecha-cancha"
            required
          >
        </p>

        <p>
          <label for="hora-inicio">Hora inicial</label>
          <input
            type="time"
            id="hora-inicio"
            required
          >
        </p>

        <p>
          <label for="hora-final">Hora final</label>
          <input
            type="time"
            id="hora-final"
            required
          >
        </p>

        <p>
          <label for="actividad-cancha">Actividad</label>
          <input
            type="text"
            id="actividad-cancha"
            placeholder="Ejemplo: Fútbol"
            required
          >
        </p>

        <p>
          <label for="observaciones-cancha">Observaciones</label>
          <textarea
            id="observaciones-cancha"
            rows="3"
          ></textarea>
        </p>

        <button class="boton-volver" type="submit">
          Guardar utilización
        </button>

        <p id="mensaje-canchas" aria-live="polite"></p>

      </form>

      <h3>Historial de utilización</h3>

      <div id="historial-canchas"></div>
<hr>

<h3>Mantenimiento de canchas</h3>

<div id="mantenimiento-canchas"></div>
    </section>
  `

  document.querySelector('#formulario-canchas')
    .addEventListener('submit', registrarUtilizacion)

  mostrarHistorialCanchas()
  mostrarMantenimientoCanchas()
}

// MANTENIMIENTO DE CANCHAS

const CLAVE_MANTENIMIENTOS_CANCHAS = 'mantenimientosCanchas'

// CONSULTAR MANTENIMIENTOS

function obtenerMantenimientosCanchas() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_MANTENIMIENTOS_CANCHAS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar mantenimientos:', error)
    return []
  }
}

// GUARDAR MANTENIMIENTOS

function guardarMantenimientosCanchas(registros) {
  try {
    localStorage.setItem(
      CLAVE_MANTENIMIENTOS_CANCHAS,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar mantenimientos:', error)
    return false
  }
}

// FORMATO DE MONEDA COLOMBIANA

function formatoMonedaCancha(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor)
}

// MOSTRAR FORMULARIO DE MANTENIMIENTO

function mostrarMantenimientoCanchas() {
  const contenido = document.querySelector('#mantenimiento-canchas')

  if (!contenido) {
    return
  }

  contenido.innerHTML = `
    <form id="formulario-mantenimiento-canchas">

      <p>
        <label for="numero-cancha-mantenimiento">Número de cancha</label>
        <input
          type="number"
          id="numero-cancha-mantenimiento"
          min="1"
          step="1"
          required
        >
      </p>

      <p>
        <label for="fecha-mantenimiento-cancha">Fecha del mantenimiento</label>
        <input
          type="date"
          id="fecha-mantenimiento-cancha"
          required
        >
      </p>

      <p>
        <label for="actividad-mantenimiento-cancha">Actividad realizada</label>
        <input
          type="text"
          id="actividad-mantenimiento-cancha"
          placeholder="Ejemplo: Reparación de malla"
          required
        >
      </p>

      <p>
        <label for="estado-cancha">Estado de la cancha</label>
        <select id="estado-cancha" required>
          <option value="">Seleccione el estado</option>
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Malo">Malo</option>
        </select>
      </p>

      <p>
        <label for="costo-mantenimiento-cancha">
          Costo del mantenimiento (COP)
        </label>
        <input
          type="text"
          id="costo-mantenimiento-cancha"
          inputmode="numeric"
          pattern="[0-9]+"
          placeholder="Ejemplo: 120000"
          autocomplete="off"
          required
        >
      </p>

      <p>
        <label for="observaciones-mantenimiento-cancha">Observaciones</label>
        <textarea
          id="observaciones-mantenimiento-cancha"
          rows="3"
        ></textarea>
      </p>

      <button class="boton-volver" type="submit">
        Guardar mantenimiento
      </button>

      <p id="mensaje-mantenimiento-cancha" aria-live="polite"></p>

    </form>

    <h3>Historial de mantenimiento</h3>

    <div id="historial-mantenimiento-canchas"></div>
  `

  document.querySelector('#formulario-mantenimiento-canchas')
    .addEventListener('submit', registrarMantenimientoCancha)

  mostrarHistorialMantenimientoCanchas()
}

// REGISTRAR MANTENIMIENTO

function registrarMantenimientoCancha(evento) {
  evento.preventDefault()

  const numeroTexto = document.querySelector('#numero-cancha-mantenimiento').value
  const numero = Number(numeroTexto)
  const fecha = document.querySelector('#fecha-mantenimiento-cancha').value
  const actividad = document.querySelector('#actividad-mantenimiento-cancha').value.trim()
  const estado = document.querySelector('#estado-cancha').value
  const costoTexto = document.querySelector('#costo-mantenimiento-cancha').value
  const costo = Number(costoTexto)
  const observaciones = document.querySelector('#observaciones-mantenimiento-cancha').value.trim()

  const mensaje = document.querySelector('#mensaje-mantenimiento-cancha')

  if (
    !Number.isSafeInteger(numero) ||
    numero < 1 ||
    !fecha ||
    !actividad ||
    !estado ||
    !/^[0-9]+$/.test(costoTexto) ||
    !Number.isSafeInteger(costo) ||
    costo < 0
  ) {
    mensaje.textContent = 'Revise los datos del mantenimiento.'
    return
  }

  const registros = obtenerMantenimientosCanchas()

  registros.push({
    numero,
    fecha,
    actividad,
    estado,
    costo,
    observaciones
  })

  if (!guardarMantenimientosCanchas(registros)) {
    mensaje.textContent = 'No fue posible guardar el mantenimiento.'
    return
  }

  document.querySelector('#formulario-mantenimiento-canchas').reset()

  mensaje.textContent = 'Mantenimiento registrado correctamente.'

  mostrarHistorialMantenimientoCanchas()
}

// CONSULTAR HISTORIAL Y COSTOS

function mostrarHistorialMantenimientoCanchas() {
  const historial = document.querySelector('#historial-mantenimiento-canchas')

  if (!historial) {
    return
  }

  const registros = obtenerMantenimientosCanchas()

  const total = registros.reduce(
    (suma, registro) => suma + Number(registro.costo),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay mantenimientos registrados.</p>
      <p><strong>Costo total: ${formatoMonedaCancha(0)}</strong></p>
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
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Estado</th>
            <th>Costo</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>Cancha ${escaparHTML(registro.numero)}</td>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${escaparHTML(registro.actividad)}</td>
              <td>${escaparHTML(registro.estado)}</td>
              <td>${formatoMonedaCancha(registro.costo)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>
        Costo total de mantenimiento: ${formatoMonedaCancha(total)}
      </strong>
    </p>
  `
}

// REGISTRAR UTILIZACIÓN

function registrarUtilizacion(evento) {
  evento.preventDefault()

  const numeroTexto = document.querySelector('#numero-cancha').value
  const numero = Number(numeroTexto)
  const fecha = document.querySelector('#fecha-cancha').value
  const inicio = document.querySelector('#hora-inicio').value
  const final = document.querySelector('#hora-final').value
  const actividad = document.querySelector('#actividad-cancha').value.trim()
  const observaciones = document.querySelector('#observaciones-cancha').value.trim()

  const mensaje = document.querySelector('#mensaje-canchas')

  if (
    !Number.isSafeInteger(numero) ||
    numero < 1 ||
    !fecha ||
    !inicio ||
    !final ||
    !actividad
  ) {
    mensaje.textContent = 'Complete correctamente los campos obligatorios.'
    return
  }

  if (final <= inicio) {
    mensaje.textContent = 'La hora final debe ser posterior a la hora inicial.'
    return
  }

  const registros = obtenerUsosCanchas()

  const nuevoRegistro = {
    numero,
    fecha,
    inicio,
    final,
    actividad,
    observaciones
  }

  registros.push(nuevoRegistro)

  if (!guardarUsosCanchas(registros)) {
    mensaje.textContent = 'No fue posible guardar la utilización.'
    return
  }

  document.querySelector('#formulario-canchas').reset()

  mensaje.textContent = 'Utilización registrada correctamente.'

  mostrarHistorialCanchas()
}

// MOSTRAR EL HISTORIAL

function mostrarHistorialCanchas() {
  const registros = obtenerUsosCanchas()
  const historial = document.querySelector('#historial-canchas')

  if (!historial) {
    return
  }

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay utilizaciones registradas.</p>
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
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Hora inicial</th>
            <th>Hora final</th>
            <th>Actividad</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>Cancha ${escaparHTML(registro.numero)}</td>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${escaparHTML(registro.inicio)}</td>
              <td>${escaparHTML(registro.final)}</td>
              <td>${escaparHTML(registro.actividad)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>
        Total de utilizaciones registradas: ${registros.length}
      </strong>
    </p>
  `
}
