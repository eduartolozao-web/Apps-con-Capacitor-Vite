
// MÓDULO DE PARQUEADEROS DE VIVIENDAS

const CLAVE_PARQUEADEROS = 'parqueaderosViviendas'

// CONSULTAR LOS PARQUEADEROS REGISTRADOS

function obtenerParqueaderos() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_PARQUEADEROS) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar parqueaderos:', error)
    return []
  }
}

// GUARDAR LOS REGISTROS

function guardarParqueaderos(registros) {
  try {
    localStorage.setItem(
      CLAVE_PARQUEADEROS,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar parqueaderos:', error)
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

// MOSTRAR FORMULARIO DE PARQUEADEROS

export function mostrarParqueaderosViviendas(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🚗</div>

      <h2>Parqueaderos de viviendas</h2>

      <p>
        Registre los parqueaderos asociados a las viviendas
        de la propiedad horizontal.
      </p>

      <form id="formulario-parqueaderos-viviendas">

        <p>
          <label for="numero-parqueadero">Número de parqueadero</label>
          <input
            type="number"
            id="numero-parqueadero"
            min="1"
            step="1"
            required
          >
        </p>

        <p>
          <label for="torre-parqueadero">Torre o bloque</label>
          <input
            type="text"
            id="torre-parqueadero"
            placeholder="Ejemplo: Torre 1"
            required
          >
        </p>

        <p>
          <label for="vivienda-parqueadero">Número de vivienda</label>
          <input
            type="text"
            id="vivienda-parqueadero"
            placeholder="Ejemplo: 301"
            required
          >
        </p>

        <p>
          <label for="estado-parqueadero">Estado del parqueadero</label>
          <select id="estado-parqueadero" required>
            <option value="">Seleccione el estado</option>
            <option value="Disponible">Disponible</option>
            <option value="Asignado">Asignado</option>
            <option value="En mantenimiento">En mantenimiento</option>
          </select>
        </p>

        <p>
          <label for="fecha-asignacion">Fecha de asignación</label>
          <input
            type="date"
            id="fecha-asignacion"
            required
          >
        </p>

        <p>
          <label for="valor-parqueadero">Valor mensual (COP)</label>
          <input
            type="text"
            id="valor-parqueadero"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 60000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-parqueadero">Observaciones</label>
          <textarea
            id="observaciones-parqueadero"
            rows="3"
          ></textarea>
        </p>

        <button type="submit" class="boton-volver">
          Guardar parqueadero
        </button>

        <p id="mensaje-parqueaderos" aria-live="polite"></p>

      </form>

      <h3>Parqueaderos registrados</h3>

      <div id="historial-parqueaderos"></div>

    </section>
  `

  document.querySelector('#formulario-parqueaderos-viviendas')
    .addEventListener('submit', registrarParqueadero)

  mostrarHistorialParqueaderos()
}

// REGISTRAR PARQUEADERO

function registrarParqueadero(evento) {
  evento.preventDefault()

  const numeroTexto = document.querySelector('#numero-parqueadero').value
  const numero = Number(numeroTexto)

  const torre = document.querySelector('#torre-parqueadero').value.trim()
  const vivienda = document.querySelector('#vivienda-parqueadero').value.trim()
  const estado = document.querySelector('#estado-parqueadero').value
  const fecha = document.querySelector('#fecha-asignacion').value
  const valorTexto = document.querySelector('#valor-parqueadero').value
  const valor = Number(valorTexto)
  const observaciones = document.querySelector('#observaciones-parqueadero').value.trim()

  const mensaje = document.querySelector('#mensaje-parqueaderos')

  if (
    !Number.isSafeInteger(numero) ||
    numero < 1 ||
    !torre ||
    !vivienda ||
    !estado ||
    !fecha ||
    !/^[0-9]+$/.test(valorTexto) ||
    !Number.isSafeInteger(valor) ||
    valor < 0
  ) {
    mensaje.textContent = 'Revise los datos del parqueadero.'
    return
  }

  const registros = obtenerParqueaderos()

  const existe = registros.some(
    registro => registro.numero === numero
  )

  if (existe) {
    mensaje.textContent = 'Este número de parqueadero ya está registrado.'
    return
  }

  registros.push({
    numero,
    torre,
    vivienda,
    estado,
    fecha,
    valor,
    observaciones
  })

  if (!guardarParqueaderos(registros)) {
    mensaje.textContent = 'No fue posible guardar el parqueadero.'
    return
  }

  document.querySelector('#formulario-parqueaderos-viviendas').reset()

  mensaje.textContent = 'Parqueadero registrado correctamente.'

  mostrarHistorialParqueaderos()
}

// MOSTRAR PARQUEADEROS E INGRESOS PREVISTOS

function mostrarHistorialParqueaderos() {
  const historial = document.querySelector('#historial-parqueaderos')

  if (!historial) {
    return
  }

  const registros = obtenerParqueaderos()

  const total = registros.reduce(
    (suma, registro) => suma + (
      registro.estado === 'Asignado' ? Number(registro.valor) : 0
    ),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay parqueaderos registrados.</p>
      <p><strong>Total mensual previsto: ${formatoMoneda(0)}</strong></p>
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
            <th>Parqueadero</th>
            <th>Torre</th>
            <th>Vivienda</th>
            <th>Estado</th>
            <th>Asignación</th>
            <th>Valor mensual</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>${escaparHTML(registro.numero)}</td>
              <td>${escaparHTML(registro.torre)}</td>
              <td>${escaparHTML(registro.vivienda)}</td>
              <td>${escaparHTML(registro.estado)}</td>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${formatoMoneda(registro.valor)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>Parqueaderos registrados: ${registros.length}</strong>
    </p>

    <p>
      <strong>
        Total mensual previsto de parqueaderos asignados:
        ${formatoMoneda(total)}
      </strong>
    </p>
  `
}
