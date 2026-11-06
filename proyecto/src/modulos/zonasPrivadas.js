import { mostrarHabitantes } from './habitantes.js'
// MÓDULO DE GESTIÓN DE ZONAS PRIVADAS
// REGISTRO DE VIVIENDAS

const CLAVE_VIVIENDAS = 'viviendasPropiedadHorizontal'

// CONSULTAR VIVIENDAS GUARDADAS

function obtenerViviendas() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_VIVIENDAS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar viviendas:', error)
    return []
  }
}

// GUARDAR VIVIENDAS

function guardarViviendas(registros) {
  try {
    localStorage.setItem(
      CLAVE_VIVIENDAS,
      JSON.stringify(registros)
    )

    return true
  } catch (error) {
    console.error('Error al guardar viviendas:', error)
    return false
  }
}

// PROTEGER LOS TEXTOS MOSTRADOS EN HTML

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => {
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

// MOSTRAR FORMULARIO DE VIVIENDAS

export function mostrarZonasPrivadas(contenido) {

  if (!contenido) {
    return
  }

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🏠</div>

      <h2>Gestión de zonas privadas</h2>

      <p>
        Registro y consulta de viviendas
        de la propiedad horizontal.
      </p>

      <h3>Registrar nueva vivienda</h3>

      <form id="formulario-viviendas">

        <p>
          <label for="torre-vivienda">Torre o bloque</label>

          <input
            type="text"
            id="torre-vivienda"
            placeholder="Ejemplo: Torre 1"
            required
          >
        </p>

        <p>
          <label for="numero-vivienda">
            Número de apartamento o casa
          </label>

          <input
            type="text"
            id="numero-vivienda"
            placeholder="Ejemplo: 301"
            required
          >
        </p>

        <p>
          <label for="tipo-vivienda">Tipo de vivienda</label>

          <select id="tipo-vivienda" required>
            <option value="">Seleccione el tipo</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
          </select>
        </p>

        <p>
          <label for="anio-vivienda">
            Año de construcción
          </label>

          <input
            type="number"
            id="anio-vivienda"
            min="1800"
            step="1"
            placeholder="Ejemplo: 2015"
            required
          >
        </p>

        <p>
          <label for="propietario-vivienda">
            Propietario
          </label>

          <input
            type="text"
            id="propietario-vivienda"
            placeholder="Nombre ficticio del propietario"
            required
          >
        </p>

        <p>
          <label for="ocupacion-vivienda">
            Estado de ocupación
          </label>

          <select id="ocupacion-vivienda" required>
            <option value="">Seleccione el estado</option>
            <option value="Ocupada">Ocupada</option>
            <option value="Desocupada">Desocupada</option>
          </select>
        </p>

        <p>
          <label for="observaciones-vivienda">
            Observaciones
          </label>

          <textarea
            id="observaciones-vivienda"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar vivienda
        </button>

        <p id="mensaje-viviendas" aria-live="polite"></p>

      </form>
<button
  type="button"
  id="boton-habitantes"
  class="boton-volver"
>
  Gestionar habitantes
</button>

<div id="panel-habitantes"></div>
      <h3>Viviendas registradas</h3>

      <div id="historial-viviendas"></div>

    </section>
  `

  contenido.querySelector('#formulario-viviendas')
    .addEventListener('submit', registrarVivienda)

  mostrarHistorialViviendas()
  // ACTIVAR EL BOTÓN DE HABITANTES

contenido.querySelector('#boton-habitantes')
  .addEventListener('click', () => {

    const panel = contenido.querySelector('#panel-habitantes')

    mostrarHabitantes(panel)

    panel.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

  })
}

// REGISTRAR NUEVA VIVIENDA

function registrarVivienda(evento) {
  evento.preventDefault()

  const torre = document.querySelector('#torre-vivienda').value.trim()
  const numero = document.querySelector('#numero-vivienda').value.trim()
  const tipo = document.querySelector('#tipo-vivienda').value

  const anioTexto = document.querySelector('#anio-vivienda').value
  const anio = Number(anioTexto)

  const propietario = document.querySelector('#propietario-vivienda').value.trim()
  const ocupacion = document.querySelector('#ocupacion-vivienda').value

  const observaciones = document.querySelector(
    '#observaciones-vivienda'
  ).value.trim()

  const mensaje = document.querySelector('#mensaje-viviendas')

  const anioActual = new Date().getFullYear()

  if (
    !torre ||
    !numero ||
    !tipo ||
    !Number.isSafeInteger(anio) ||
    anio < 1800 ||
    anio > anioActual ||
    !propietario ||
    !ocupacion
  ) {
    mensaje.textContent = 'Revise los datos de la vivienda.'
    return
  }

  const viviendas = obtenerViviendas()

  // EVITAR DUPLICAR UNA VIVIENDA EN LA MISMA TORRE

  const existe = viviendas.some(vivienda =>
    vivienda.torre.toLowerCase() === torre.toLowerCase() &&
    vivienda.numero.toLowerCase() === numero.toLowerCase()
  )

  if (existe) {
    mensaje.textContent =
      'Esta vivienda ya está registrada en la torre o bloque.'
    return
  }

  // GENERAR IDENTIFICADOR INTERNO

  const id = viviendas.reduce(
    (mayor, vivienda) => Math.max(
      mayor,
      Number(vivienda.id) || 0
    ),
    0
  ) + 1

  viviendas.push({
    id,
    torre,
    numero,
    tipo,
    anio,
    propietario,
    ocupacion,
    observaciones
  })

  if (!guardarViviendas(viviendas)) {
    mensaje.textContent = 'No fue posible guardar la vivienda.'
    return
  }

  document.querySelector('#formulario-viviendas').reset()

  mensaje.textContent = 'Vivienda registrada correctamente.'

  mostrarHistorialViviendas()
}

// MOSTRAR HISTORIAL DE VIVIENDAS

function mostrarHistorialViviendas() {
  const historial = document.querySelector('#historial-viviendas')

  if (!historial) {
    return
  }

  const viviendas = obtenerViviendas()

  const ocupadas = viviendas.filter(
    vivienda => vivienda.ocupacion === 'Ocupada'
  ).length

  const desocupadas = viviendas.filter(
    vivienda => vivienda.ocupacion === 'Desocupada'
  ).length

  if (viviendas.length === 0) {
    historial.innerHTML = `
      <p>No hay viviendas registradas.</p>
      <p><strong>Total de viviendas: 0</strong></p>
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
            <th>ID</th>
            <th>Torre o bloque</th>
            <th>Vivienda</th>
            <th>Tipo</th>
            <th>Año de construcción</th>
            <th>Propietario</th>
            <th>Ocupación</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${viviendas.map(vivienda => `
            <tr>
              <td>${escaparHTML(vivienda.id)}</td>
              <td>${escaparHTML(vivienda.torre)}</td>
              <td>${escaparHTML(vivienda.numero)}</td>
              <td>${escaparHTML(vivienda.tipo)}</td>
              <td>${escaparHTML(vivienda.anio)}</td>
              <td>${escaparHTML(vivienda.propietario)}</td>
              <td>${escaparHTML(vivienda.ocupacion)}</td>
              <td>${escaparHTML(vivienda.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

    </div>

    <p>
      <strong>
        Total de viviendas: ${viviendas.length}
      </strong>
    </p>

    <p>
      <strong>
        Viviendas ocupadas: ${ocupadas}
      </strong>
    </p>

    <p>
      <strong>
        Viviendas desocupadas: ${desocupadas}
      </strong>
    </p>
  `
}
