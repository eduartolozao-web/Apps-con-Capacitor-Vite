
// MÓDULO DE COMITÉ DE CONVIVENCIA

import { mostrarIndicadoresConvivencia } from './indicadoresConvivencia.js'
import { mostrarMultasConvivencia } from './multasConvivencia.js'

const CLAVE_CONVIVENCIA = 'casosConvivencia'

const estadosCaso = [
  'Reportado',
  'En revisión',
  'Infracción confirmada',
  'Cerrado sin infracción',
  'Cerrado'
]

// CONSULTAR LOS CASOS

function obtenerCasos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_CONVIVENCIA) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar casos:', error)
    return []
  }
}

// GUARDAR LOS CASOS

function guardarCasos(registros) {
  try {
    localStorage.setItem(
      CLAVE_CONVIVENCIA,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar casos:', error)
    return false
  }
}

// PROTEGER EL CONTENIDO MOSTRADO EN HTML

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caracter])
}

// MOSTRAR COMITÉ DE CONVIVENCIA

export function mostrarConvivencia(contenido) {
  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">👥</div>

      <h2>Comité de convivencia</h2>

      <p>
        Registro y seguimiento de situaciones reportadas
        en la propiedad horizontal.
      </p>

      <h3>Registrar nuevo caso</h3>

      <form id="formulario-convivencia">

        <p>
          <label for="fecha-caso">Fecha del reporte</label>
          <input type="date" id="fecha-caso" required>
        </p>

        <p>
          <label for="torre-caso">Torre o bloque</label>
          <input
            type="text"
            id="torre-caso"
            placeholder="Ejemplo: Torre 1"
            required
          >
        </p>

        <p>
          <label for="vivienda-caso">Apartamento o casa</label>
          <input
            type="text"
            id="vivienda-caso"
            placeholder="Ejemplo: 301"
            required
          >
        </p>

        <p>
          <label for="persona-caso">Identificador de persona involucrada</label>
          <input
            type="text"
            id="persona-caso"
            placeholder="Ejemplo: RES-001"
            required
          >
        </p>

        <p>
          <label for="tipo-caso">Tipo de situación</label>
          <select id="tipo-caso" required>
            <option value="">Seleccione una situación</option>
            <option value="Ruido">Ruido</option>
            <option value="Mascotas">Mascotas</option>
            <option value="Parqueaderos">Parqueaderos</option>
            <option value="Residuos">Manejo de residuos</option>
            <option value="Zonas comunes">Uso de zonas comunes</option>
            <option value="Conflictos">Conflictos entre residentes</option>
            <option value="Otra">Otra</option>
          </select>
        </p>

        <p>
          <label for="descripcion-caso">Descripción del caso</label>
          <textarea
            id="descripcion-caso"
            rows="4"
            required
          ></textarea>
        </p>

        <p>
          <label for="observaciones-caso">Observaciones</label>
          <textarea
            id="observaciones-caso"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar caso
        </button>

        <p id="mensaje-convivencia" aria-live="polite"></p>

      </form>

      <hr>

      <button
        type="button"
        id="boton-indicadores"
        class="boton-volver"
      >
        Ver indicadores de convivencia
      </button>

      <button
        type="button"
        id="boton-multas"
        class="boton-volver"
      >
        Gestionar multas
      </button>

      <div id="panel-indicadores"></div>
      <div id="panel-multas"></div>

      <h3>Historial de casos reportados</h3>

      <div id="historial-convivencia"></div>

      <div id="seguimiento-convivencia"></div>

    </section>
  `

  contenido.querySelector('#formulario-convivencia')
    .addEventListener('submit', registrarCaso)

  contenido.querySelector('#boton-indicadores')
    .addEventListener('click', () => {
      const panel = contenido.querySelector('#panel-indicadores')
      mostrarIndicadoresConvivencia(panel)
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

  contenido.querySelector('#boton-multas')
    .addEventListener('click', () => {
      const panel = contenido.querySelector('#panel-multas')
      mostrarMultasConvivencia(panel)
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

  mostrarHistorialConvivencia()
}

// REGISTRAR NUEVO CASO

function registrarCaso(evento) {
  evento.preventDefault()

  const fecha = document.querySelector('#fecha-caso').value
  const torre = document.querySelector('#torre-caso').value.trim()
  const vivienda = document.querySelector('#vivienda-caso').value.trim()
  const persona = document.querySelector('#persona-caso').value.trim()
  const tipo = document.querySelector('#tipo-caso').value
  const descripcion = document.querySelector('#descripcion-caso').value.trim()
  const observaciones = document.querySelector('#observaciones-caso').value.trim()

  const mensaje = document.querySelector('#mensaje-convivencia')

  if (!fecha || !torre || !vivienda || !persona || !tipo || !descripcion) {
    mensaje.textContent = 'Complete los campos obligatorios.'
    return
  }

  const registros = obtenerCasos()

  const numero = registros.reduce(
    (mayor, caso) => Math.max(mayor, Number(caso.numero) || 0),
    0
  ) + 1

  registros.push({
    numero,
    fecha,
    torre,
    vivienda,
    persona,
    tipo,
    descripcion,
    estado: 'Reportado',
    observaciones,
    seguimientos: []
  })

  if (!guardarCasos(registros)) {
    mensaje.textContent = 'No fue posible guardar el caso.'
    return
  }

  document.querySelector('#formulario-convivencia').reset()

  mensaje.textContent = 'Caso registrado correctamente.'

  mostrarHistorialConvivencia()
}

// MOSTRAR HISTORIAL PRINCIPAL

function mostrarHistorialConvivencia() {
  const historial = document.querySelector('#historial-convivencia')

  if (!historial) return

  const registros = obtenerCasos()

  if (registros.length === 0) {
    historial.innerHTML = '<p>No hay casos registrados.</p>'
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
            <th>Caso</th>
            <th>Fecha</th>
            <th>Torre</th>
            <th>Vivienda</th>
            <th>Persona</th>
            <th>Situación</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(caso => `
            <tr>
              <td>${escaparHTML(caso.numero)}</td>
              <td>${escaparHTML(caso.fecha)}</td>
              <td>${escaparHTML(caso.torre)}</td>
              <td>${escaparHTML(caso.vivienda)}</td>
              <td>${escaparHTML(caso.persona)}</td>
              <td>${escaparHTML(caso.tipo)}</td>
              <td>${escaparHTML(caso.descripcion)}</td>
              <td>${escaparHTML(caso.estado)}</td>
              <td>${escaparHTML(caso.observaciones)}</td>
              <td>
                <button
                  type="button"
                  class="boton-volver"
                  data-seguimiento="${escaparHTML(caso.numero)}"
                >
                  Seguimiento
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

    </div>

    <p>
      <strong>Total de casos registrados: ${registros.length}</strong>
    </p>
  `

  historial.querySelectorAll('[data-seguimiento]').forEach(boton => {
    boton.addEventListener('click', () => {
      const numero = Number(boton.dataset.seguimiento)

      mostrarFormularioSeguimiento(numero)

      const panel = document.querySelector('#seguimiento-convivencia')

      if (panel) {
        panel.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

// MOSTRAR FORMULARIO DE SEGUIMIENTO

function mostrarFormularioSeguimiento(numero) {
  const registros = obtenerCasos()

  const caso = registros.find(
    item => Number(item.numero) === Number(numero)
  )

  if (!caso) return

  const contenido = document.querySelector('#seguimiento-convivencia')

  if (!contenido) return

  contenido.innerHTML = `
    <section class="detalle">

      <h3>Seguimiento del caso ${escaparHTML(caso.numero)}</h3>

      <p>
        Persona involucrada:
        <strong>${escaparHTML(caso.persona)}</strong>
      </p>

      <p>
        Tipo de situación:
        <strong>${escaparHTML(caso.tipo)}</strong>
      </p>

      <p>
        Estado actual:
        <strong>${escaparHTML(caso.estado)}</strong>
      </p>

      <form id="formulario-seguimiento">

        <p>
          <label for="fecha-seguimiento">Fecha del seguimiento</label>
          <input type="date" id="fecha-seguimiento" required>
        </p>

        <p>
          <label for="estado-seguimiento">Nuevo estado</label>

          <select id="estado-seguimiento" required>
            <option value="">Seleccione el estado</option>
            ${estadosCaso.map(estado => `
              <option value="${escaparHTML(estado)}">
                ${escaparHTML(estado)}
              </option>
            `).join('')}
          </select>
        </p>

        <p>
          <label for="observacion-seguimiento">Observación</label>
          <textarea
            id="observacion-seguimiento"
            rows="3"
            required
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar seguimiento
        </button>

        <p id="mensaje-seguimiento" aria-live="polite"></p>

      </form>

      <h3>Historial de seguimiento</h3>

      <div id="historial-seguimiento"></div>

    </section>
  `

  contenido.querySelector('#formulario-seguimiento')
    .addEventListener('submit', evento => {
      guardarSeguimientoCaso(evento, numero)
    })

  mostrarHistorialSeguimiento(caso)
}

// ESTADOS DE CONVIVENCIA

const estadosCaso = [
  'Reportado',
  'En revisión',
  'Infracción confirmada',
  'Cerrado sin infracción',
  'Cerrado'
]

// GUARDAR SEGUIMIENTO

function guardarSeguimientoCaso(evento, numero) {
  evento.preventDefault()

  const fecha = document.querySelector('#fecha-seguimiento').value
  const estado = document.querySelector('#estado-seguimiento').value
  const observacion = document.querySelector('#observacion-seguimiento').value.trim()

  const mensaje = document.querySelector('#mensaje-seguimiento')

  if (!fecha || !estadosCaso.includes(estado) || !observacion) {
    mensaje.textContent = 'Complete correctamente los campos.'
    return
  }

  const registros = obtenerCasos()

  const caso = registros.find(
    item => Number(item.numero) === Number(numero)
  )

  if (!caso) {
    mensaje.textContent = 'No se encontró el caso.'
    return
  }

  if (!Array.isArray(caso.seguimientos)) {
    caso.seguimientos = []
  }

  caso.seguimientos.push({
    fecha,
    estado,
    observacion
  })

  caso.estado = estado

  if (!guardarCasos(registros)) {
    mensaje.textContent = 'No se pudo guardar el seguimiento.'
    return
  }

  mostrarHistorialConvivencia()
  mostrarFormularioSeguimiento(numero)

  document.querySelector('#mensaje-seguimiento').textContent =
    'Seguimiento registrado correctamente.'
}

// HISTORIAL DE SEGUIMIENTO

function mostrarHistorialSeguimiento(caso) {
  const historial = document.querySelector('#historial-seguimiento')

  if (!historial) return

  const seguimientos = Array.isArray(caso.seguimientos)
    ? caso.seguimientos
    : []

  if (seguimientos.length === 0) {
    historial.innerHTML = '<p>No hay seguimientos registrados.</p>'
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
            <th>Estado</th>
            <th>Observación</th>
          </tr>
        </thead>

        <tbody>
          ${seguimientos.map(item => `
            <tr>
              <td>${escaparHTML(item.fecha)}</td>
              <td>${escaparHTML(item.estado)}</td>
              <td>${escaparHTML(item.observacion)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>Total de seguimientos: ${seguimientos.length}</strong>
    </p>
  `
}
