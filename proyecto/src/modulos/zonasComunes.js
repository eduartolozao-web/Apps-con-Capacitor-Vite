import { mostrarCanchas } from './canchas.js'
import { mostrarParqueaderosViviendas } from './parqueaderosViviendas.js'
/* MÓDULO DE GESTIÓN DE ZONAS COMUNES */

const zonasComunes = [
  {
    id: 'jardines',
    nombre: 'Jardines',
    icono: '🌳',
    descripcion: 'Registro de mantenimiento, fechas, costos y observaciones.'
  },
  {
    id: 'canchas',
    nombre: 'Canchas',
    icono: '🏀',
    descripcion: 'Control de uso, mantenimiento y estado de las canchas.'
  },
  {
    id: 'parqueaderos-viviendas',
    nombre: 'Parqueaderos de viviendas',
    icono: '🚗',
    descripcion: 'Asignación de espacios, utilización e ingresos.'
  },
  {
    id: 'parqueaderos-visitantes',
    nombre: 'Parqueaderos de visitantes',
    icono: '🅿️',
    descripcion: 'Registro de utilización, tarifas e ingresos generados.'
  },
  {
    id: 'basuras',
    nombre: 'Shut de basuras',
    icono: '🗑️',
    descripcion: 'Limpieza, mantenimiento y novedades.'
  },
  {
    id: 'luminarias',
    nombre: 'Luminarias',
    icono: '💡',
    descripcion: 'Ubicación, estado, mantenimiento y reparaciones.'
  },
  {
    id: 'fachadas',
    nombre: 'Fachadas',
    icono: '🏢',
    descripcion: 'Mantenimiento, intervenciones y costos.'
  }
]

// MOSTRAR LAS SECCIONES DE ZONAS COMUNES

export function mostrarZonasComunes() {
  return `
    <section class="detalle">
      <h2>Gestión de zonas comunes</h2>
      <p>Seleccione la zona común que desea consultar.</p>

      <div class="modulos">
        ${zonasComunes.map(zona => `
          <button
            class="tarjeta"
            type="button"
            data-zona="${zona.id}"
          >
            <span class="icono">${zona.icono}</span>
            <h3>${zona.nombre}</h3>
            <p>${zona.descripcion}</p>
            <span class="entrar">Consultar →</span>
          </button>
        `).join('')}
      </div>

      <div id="contenido-zona"></div>
    </section>
  `
}

// MOSTRAR LA ZONA SELECCIONADA

export function seleccionarZona(id) {
  const zona = zonasComunes.find(item => item.id === id)

  if (!zona) {
    return
  }

  const contenido = document.querySelector('#contenido-zona')

  if (!contenido) {
    return
  }

  if (id === 'jardines') {
    mostrarJardines(contenido)
    return
  }
  if (id === 'canchas') {
  mostrarCanchas(contenido)
  return
}
if (id === 'parqueaderos-viviendas') {
  mostrarParqueaderosViviendas(contenido)
  return
}

  contenido.innerHTML = `
    <section class="detalle">
      <div class="marca">${zona.icono}</div>
      <h2>${zona.nombre}</h2>
      <p>${zona.descripcion}</p>
      <p class="mensaje">
        Sección preparada para incorporar los registros de gestión.
      </p>
    </section>
  `
}

// OBTENER REGISTROS DE JARDINES

function obtenerMantenimientos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem('mantenimientosJardines') || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al leer los mantenimientos:', error)
    return []
  }
}

// GUARDAR REGISTROS DE JARDINES

function guardarMantenimientos(registros) {
  try {
    localStorage.setItem(
      'mantenimientosJardines',
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

// EVITAR QUE LOS DATOS INGRESADOS SE INTERPRETEN COMO HTML

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

// MOSTRAR FORMULARIO DE JARDINES

function mostrarJardines(contenido) {
  contenido.innerHTML = `
    <section class="detalle">
      <div class="marca">🌳</div>
      <h2>Mantenimiento de jardines</h2>

      <p>Registre las actividades realizadas en los jardines.</p>

      <form id="formulario-jardines">

        <p>
          <label for="fecha-jardin">Fecha del mantenimiento</label>
          <input
            type="date"
            id="fecha-jardin"
            required
          >
        </p>

        <p>
          <label for="actividad-jardin">Actividad realizada</label>
          <select id="actividad-jardin" required>
            <option value="">Seleccione una actividad</option>
            <option value="Poda">Poda</option>
            <option value="Riego">Riego</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Otra">Otra</option>
          </select>
        </p>

        <p>
          <label for="descripcion-jardin">Descripción</label>
          <textarea
            id="descripcion-jardin"
            rows="3"
            required
          ></textarea>
        </p>

        
<p>
  <label for="costo-jardin">Costo del mantenimiento (COP)</label>
  <input
    type="text"
    id="costo-jardin"
    inputmode="numeric"
    pattern="[0-9]+"
    placeholder="Ejemplo: 150000"
    autocomplete="off"
    required
  >
</p>


        <p>
          <label for="observaciones-jardin">Observaciones</label>
          <textarea
            id="observaciones-jardin"
            rows="3"
          ></textarea>
        </p>

        <button class="boton-volver" type="submit">
          Guardar mantenimiento
        </button>

        <p id="mensaje-jardines" aria-live="polite"></p>

      </form>

      <h3>Historial de mantenimientos</h3>
      <div id="historial-jardines"></div>

    </section>
  `

  document.querySelector('#formulario-jardines')
    .addEventListener('submit', registrarMantenimiento)

  mostrarHistorialJardines()
}

// REGISTRAR UN MANTENIMIENTO

function registrarMantenimiento(evento) {
  evento.preventDefault()

  const fecha = document.querySelector('#fecha-jardin').value
  const actividad = document.querySelector('#actividad-jardin').value
  const descripcion = document.querySelector('#descripcion-jardin').value.trim()
  const costoTexto = document.querySelector('#costo-jardin').value
  const costo = Number(costoTexto)
  const observaciones = document.querySelector('#observaciones-jardin').value.trim()

  const mensaje = document.querySelector('#mensaje-jardines')

  if (
    !fecha ||
    !actividad ||
    !descripcion ||
    costoTexto === '' ||
    !Number.isSafeInteger(costo) ||
    costo < 0
  ) {
    mensaje.textContent = 'Revise los datos del formulario.'
    return
  }

  const registros = obtenerMantenimientos()

  const nuevoRegistro = {
    fecha,
    actividad,
    descripcion,
    costo,
    observaciones
  }

  registros.push(nuevoRegistro)

  if (!guardarMantenimientos(registros)) {
    mensaje.textContent = 'No fue posible guardar el mantenimiento.'
    return
  }

  document.querySelector('#formulario-jardines').reset()

  mensaje.textContent = 'Mantenimiento registrado correctamente.'

  mostrarHistorialJardines()
}

// MOSTRAR HISTORIAL Y COSTOS ACUMULADOS

function mostrarHistorialJardines() {
  const registros = obtenerMantenimientos()
  const historial = document.querySelector('#historial-jardines')

  if (!historial) {
    return
  }

  const total = registros.reduce(
    (suma, registro) => suma + Number(registro.costo),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay mantenimientos registrados.</p>
      <p><strong>Costo total: ${formatoMoneda(0)}</strong></p>
    `
    return
  }

  historial.innerHTML = `
    <div style="overflow-x: auto;">
      <table border="1" cellpadding="10" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Actividad</th>
            <th>Descripción</th>
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
              <td>${formatoMoneda(registro.costo)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>Costo total de mantenimiento:
        ${formatoMoneda(total)}
      </strong>
    </p>
  `
}
