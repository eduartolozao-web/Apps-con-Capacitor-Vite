
// MÓDULO DE REGISTRO DE HABITANTES

const CLAVE_VIVIENDAS = 'viviendasPropiedadHorizontal'
const CLAVE_HABITANTES = 'habitantesPropiedadHorizontal'

// CONSULTAR DATOS GUARDADOS

function leerDatos(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || '[]')
    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar datos:', error)
    return []
  }
}

function obtenerViviendas() {
  return leerDatos(CLAVE_VIVIENDAS)
}

function obtenerHabitantes() {
  return leerDatos(CLAVE_HABITANTES)
}

// GUARDAR HABITANTES

function guardarHabitantes(registros) {
  try {
    localStorage.setItem(
      CLAVE_HABITANTES,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar habitantes:', error)
    return false
  }
}

// PROTEGER EL CONTENIDO HTML

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caracter])
}

// MOSTRAR FORMULARIO DE HABITANTES

export function mostrarHabitantes(contenido) {
  if (!contenido) return

  const viviendas = obtenerViviendas()

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">👨‍👩‍👧‍👦</div>

      <h2>Registro de habitantes</h2>

      <p>
        Vincule los habitantes con las viviendas
        registradas en la propiedad horizontal.
      </p>

      <form id="formulario-habitantes">

        <p>
          <label for="vivienda-habitante">Seleccione la vivienda</label>

          <select id="vivienda-habitante" required>
            <option value="">Seleccione una vivienda</option>

            ${viviendas.map(vivienda => `
              <option value="${escaparHTML(vivienda.id)}">
                ${escaparHTML(vivienda.torre)}
                - ${escaparHTML(vivienda.numero)}
              </option>
            `).join('')}

          </select>
        </p>

        <p>
          <label for="codigo-habitante">Identificador del habitante</label>
          <input
            type="text"
            id="codigo-habitante"
            placeholder="Ejemplo: RES-001"
            required
          >
        </p>

        <p>
          <label for="nombre-habitante">Nombre del habitante</label>
          <input
            type="text"
            id="nombre-habitante"
            placeholder="Nombre ficticio del residente"
            required
          >
        </p>

        <p>
          <label for="tipo-habitante">Tipo de ocupante</label>

          <select id="tipo-habitante" required>
            <option value="">Seleccione una opción</option>
            <option value="Propietario residente">Propietario residente</option>
            <option value="Arrendatario">Arrendatario</option>
            <option value="Otro residente">Otro residente</option>
          </select>
        </p>

        <p>
          <label for="fecha-ingreso-habitante">Fecha de ingreso</label>
          <input
            type="date"
            id="fecha-ingreso-habitante"
            required
          >
        </p>

        <p>
          <label for="observaciones-habitante">Observaciones</label>
          <textarea
            id="observaciones-habitante"
            rows="3"
          ></textarea>
        </p>

        <button
          type="submit"
          class="boton-volver"
          ${viviendas.length === 0 ? 'disabled' : ''}
        >
          Guardar habitante
        </button>

        <p id="mensaje-habitantes" aria-live="polite"></p>

      </form>

      ${viviendas.length === 0 ? `
        <p class="mensaje">
          Primero debe registrar una vivienda en Zonas privadas.
        </p>
      ` : ''}

      <h3>Habitantes registrados</h3>

      <div id="historial-habitantes"></div>

    </section>
  `

  contenido.querySelector('#formulario-habitantes')
    .addEventListener('submit', registrarHabitante)

  mostrarHistorialHabitantes()
}

// REGISTRAR HABITANTE

function registrarHabitante(evento) {
  evento.preventDefault()

  const viviendaId = Number(
    document.querySelector('#vivienda-habitante').value
  )

  const codigo = document.querySelector('#codigo-habitante')
    .value.trim().toUpperCase()

  const nombre = document.querySelector('#nombre-habitante').value.trim()
  const tipo = document.querySelector('#tipo-habitante').value
  const fechaIngreso = document.querySelector('#fecha-ingreso-habitante').value

  const observaciones = document.querySelector(
    '#observaciones-habitante'
  ).value.trim()

  const mensaje = document.querySelector('#mensaje-habitantes')

  if (
    !Number.isSafeInteger(viviendaId) ||
    viviendaId < 1 ||
    !codigo ||
    !nombre ||
    !tipo ||
    !fechaIngreso
  ) {
    mensaje.textContent = 'Complete los campos obligatorios.'
    return
  }

  const viviendas = obtenerViviendas()

  const viviendaExiste = viviendas.some(
    vivienda => Number(vivienda.id) === viviendaId
  )

  if (!viviendaExiste) {
    mensaje.textContent = 'La vivienda seleccionada no existe.'
    return
  }

  const habitantes = obtenerHabitantes()

  const duplicado = habitantes.some(
    habitante => habitante.codigo === codigo
  )

  if (duplicado) {
    mensaje.textContent = 'El identificador del habitante ya está registrado.'
    return
  }

  habitantes.push({
    viviendaId,
    codigo,
    nombre,
    tipo,
    fechaIngreso,
    observaciones
  })

  if (!guardarHabitantes(habitantes)) {
    mensaje.textContent = 'No fue posible guardar el habitante.'
    return
  }

  document.querySelector('#formulario-habitantes').reset()

  mensaje.textContent = 'Habitante registrado correctamente.'

  mostrarHistorialHabitantes()
}

// MOSTRAR HISTORIAL Y TOTALES

function mostrarHistorialHabitantes() {
  const historial = document.querySelector('#historial-habitantes')

  if (!historial) return

  const habitantes = obtenerHabitantes()
  const viviendas = obtenerViviendas()

  if (habitantes.length === 0) {
    historial.innerHTML = `
      <p>No hay habitantes registrados.</p>
      <p><strong>Total de habitantes: 0</strong></p>
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
            <th>Identificador</th>
            <th>Nombre</th>
            <th>Vivienda</th>
            <th>Tipo de ocupante</th>
            <th>Fecha de ingreso</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${habitantes.map(habitante => {

            const vivienda = viviendas.find(
              item => Number(item.id) === Number(habitante.viviendaId)
            )

            const nombreVivienda = vivienda
              ? `${vivienda.torre} - ${vivienda.numero}`
              : 'Vivienda no encontrada'

            return `
              <tr>
                <td>${escaparHTML(habitante.codigo)}</td>
                <td>${escaparHTML(habitante.nombre)}</td>
                <td>${escaparHTML(nombreVivienda)}</td>
                <td>${escaparHTML(habitante.tipo)}</td>
                <td>${escaparHTML(habitante.fechaIngreso)}</td>
                <td>${escaparHTML(habitante.observaciones)}</td>
              </tr>
            `
          }).join('')}
        </tbody>
      </table>

    </div>

    <p>
      <strong>Total de habitantes: ${habitantes.length}</strong>
    </p>
  `
}
