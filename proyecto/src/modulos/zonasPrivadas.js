
// MÓDULO DE GESTIÓN DE ZONAS PRIVADAS
// DISEÑO EN DOS COLUMNAS

import { mostrarHabitantes } from './habitantes.js'

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

// PROTEGER TEXTOS HTML

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

// MOSTRAR ZONAS PRIVADAS

export function mostrarZonasPrivadas(contenido) {
  if (!contenido) return

  contenido.innerHTML = `
    <section class="detalle sgph-privadas">

      <div class="sgph-privadas-grid">

        <!-- COLUMNA IZQUIERDA -->

        <div class="sgph-privadas-formulario">

          <div class="marca">🏠</div>

          <h2>Gestión de zonas privadas</h2>

          <p class="sgph-descripcion">
            Registre y administre las viviendas de la
            propiedad horizontal.
          </p>

          <h3>Registrar nueva vivienda</h3>

          <form id="formulario-viviendas">

            <p>
              <label for="torre-vivienda">
                Torre o bloque
              </label>

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
              <label for="tipo-vivienda">
                Tipo de vivienda
              </label>

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

            <button
              type="submit"
              class="boton-volver"
            >
              Guardar vivienda
            </button>

            <p
              id="mensaje-viviendas"
              aria-live="polite"
            ></p>

          </form>

          <button
            type="button"
            id="boton-habitantes"
            class="boton-volver"
            aria-expanded="false"
          >
            Gestionar habitantes
          </button>

        </div>

        <!-- COLUMNA DERECHA -->

        <div class="sgph-privadas-registros">

          <div class="sgph-titulo-registros">
            <h3>Viviendas registradas</h3>
            <p>
              Consulte las unidades y sus estados
              de ocupación.
            </p>
          </div>

          <div id="historial-viviendas"></div>

        </div>

      </div>

      <!-- PANEL DE HABITANTES -->

      <div
        id="panel-habitantes"
        class="sgph-panel-habitantes"
      ></div>

    </section>
  `

  // ACTIVAR REGISTRO DE VIVIENDAS

  contenido.querySelector('#formulario-viviendas')
    .addEventListener('submit', registrarVivienda)

  // ACTIVAR GESTIÓN DE HABITANTES

  contenido.querySelector('#boton-habitantes')
    .addEventListener('click', () => {
      const panel = contenido.querySelector('#panel-habitantes')
      const boton = contenido.querySelector('#boton-habitantes')

      // CERRAR PANEL SI YA ESTÁ ABIERTO

      if (panel.hasChildNodes()) {
        panel.innerHTML = ''
        boton.setAttribute('aria-expanded', 'false')
        boton.textContent = 'Gestionar habitantes'
        return
      }

      // ABRIR PANEL Y MOSTRAR REGISTROS

      mostrarHabitantes(panel)

      boton.setAttribute('aria-expanded', 'true')
      boton.textContent = 'Ocultar habitantes'

      panel.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })

  mostrarHistorialViviendas()
}

// REGISTRAR VIVIENDA

function registrarVivienda(evento) {
  evento.preventDefault()

  const formulario = evento.currentTarget

  const torre = formulario.querySelector('#torre-vivienda')
    .value.trim()

  const numero = formulario.querySelector('#numero-vivienda')
    .value.trim()

  const tipo = formulario.querySelector('#tipo-vivienda').value

  const anioTexto = formulario.querySelector('#anio-vivienda').value
  const anio = Number(anioTexto)

  const propietario = formulario.querySelector('#propietario-vivienda')
    .value.trim()

  const ocupacion = formulario.querySelector('#ocupacion-vivienda').value

  const observaciones = formulario.querySelector(
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

  // EVITAR REGISTROS DUPLICADOS

  const existe = viviendas.some(vivienda =>
    String(vivienda.torre).toLowerCase() === torre.toLowerCase() &&
    String(vivienda.numero).toLowerCase() === numero.toLowerCase()
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

  formulario.reset()

  mensaje.textContent = 'Vivienda registrada correctamente.'

  mostrarHistorialViviendas()

  // ACTUALIZAR HABITANTES SI EL PANEL ESTÁ ABIERTO

  const panel = document.querySelector('#panel-habitantes')

  if (panel && panel.hasChildNodes()) {
    mostrarHabitantes(panel)
  }
}

// MOSTRAR HISTORIAL Y RESUMEN DE VIVIENDAS

function mostrarHistorialViviendas() {
  const historial = document.querySelector('#historial-viviendas')

  if (!historial) return

  const viviendas = obtenerViviendas()

  const ocupadas = viviendas.filter(
    vivienda => vivienda.ocupacion === 'Ocupada'
  ).length

  const desocupadas = viviendas.filter(
    vivienda => vivienda.ocupacion === 'Desocupada'
  ).length

  historial.innerHTML = `

    <!-- INDICADORES -->

    <div class="sgph-resumen-viviendas">

      <div class="sgph-indicador">
        <span>Total de viviendas</span>
        <strong>${viviendas.length}</strong>
      </div>

      <div class="sgph-indicador">
        <span>Ocupadas</span>
        <strong>${ocupadas}</strong>
      </div>

      <div class="sgph-indicador">
        <span>Desocupadas</span>
        <strong>${desocupadas}</strong>
      </div>

    </div>

    <!-- TABLA -->

    <div class="sgph-tabla-scroll">

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Torre</th>
            <th>Vivienda</th>
            <th>Tipo</th>
            <th>Año</th>
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

    ${viviendas.length === 0 ? `
      <p class="mensaje">
        No hay viviendas registradas.
      </p>
    ` : ''}

  `
}
