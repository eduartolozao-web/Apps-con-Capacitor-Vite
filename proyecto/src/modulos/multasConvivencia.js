
// GESTIÓN DE MULTAS DEL COMITÉ DE CONVIVENCIA

const CLAVE_CASOS = 'casosConvivencia'
const CLAVE_MULTAS = 'multasConvivencia'

// CONSULTAR INFORMACIÓN GUARDADA

function leerDatos(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || '[]')
    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar:', clave, error)
    return []
  }
}

function obtenerCasos() {
  return leerDatos(CLAVE_CASOS)
}

function obtenerMultas() {
  return leerDatos(CLAVE_MULTAS)
}

function guardarMultas(multas) {
  try {
    localStorage.setItem(CLAVE_MULTAS, JSON.stringify(multas))
    return true
  } catch (error) {
    console.error('Error al guardar multas:', error)
    return false
  }
}

// FORMATO DE MONEDA

function formatoMoneda(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor)
}

// SEGURIDAD DEL CONTENIDO HTML

function escaparHTML(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caracter => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caracter])
}

// VERIFICAR QUÉ CASOS PUEDEN RECIBIR UNA MULTA

function obtenerCasosDisponibles() {
  const casos = obtenerCasos()
  const multas = obtenerMultas()

  return casos.filter(caso => {
    const confirmado = caso.estado === 'Infracción confirmada'

    const tieneMulta = multas.some(multa =>
      Number(multa.numeroCaso) === Number(caso.numero)
    )

    return confirmado && !tieneMulta
  })
}

// MOSTRAR LA GESTIÓN DE MULTAS

export function mostrarMultasConvivencia(contenido) {
  if (!contenido) return

  const casos = obtenerCasos()
  const disponibles = obtenerCasosDisponibles()

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">⚖️</div>
      <h2>Gestión de multas de convivencia</h2>

      <p>
        Registre las multas asociadas a los casos
        con infracción confirmada.
      </p>

      <h3>Registrar nueva multa</h3>

      <p>
        Casos registrados: ${casos.length}
      </p>

      <p>
        Casos disponibles para multa: ${disponibles.length}
      </p>

      <form id="formulario-multas">

        <p>
          <label for="caso-multa">Seleccione el caso</label>

          <select id="caso-multa" required>
            <option value="">Seleccione un caso</option>

            ${disponibles.map(caso => `
              <option value="${escaparHTML(caso.numero)}">
                Caso ${escaparHTML(caso.numero)}
                - ${escaparHTML(caso.tipo)}
                - ${escaparHTML(caso.persona)}
              </option>
            `).join('')}

          </select>
        </p>

        <p>
          <label for="fecha-multa">Fecha de aplicación</label>
          <input
            type="date"
            id="fecha-multa"
            required
          >
        </p>

        <p>
          <label for="motivo-multa">Motivo de la multa</label>
          <textarea
            id="motivo-multa"
            rows="3"
            required
          ></textarea>
        </p>

        <p>
          <label for="valor-multa">Valor de la multa (COP)</label>
          <input
            type="text"
            id="valor-multa"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 150000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-multa">Observaciones</label>
          <textarea
            id="observaciones-multa"
            rows="3"
          ></textarea>
        </p>

        <button
          type="submit"
          class="boton-volver"
          ${disponibles.length === 0 ? 'disabled' : ''}
        >
          Guardar multa
        </button>

        <p id="mensaje-multas" aria-live="polite"></p>

      </form>

      ${disponibles.length === 0 ? `
        <p class="mensaje">
          No hay casos disponibles para aplicar una multa.
          Compruebe que el caso tenga estado
          "Infracción confirmada" y que no tenga
          una multa registrada anteriormente.
        </p>
      ` : ''}

      <h3>Historial de multas</h3>

      <div id="historial-multas"></div>

    </section>
  `

  contenido.querySelector('#formulario-multas')
    .addEventListener('submit', evento => {
      registrarMulta(evento, contenido)
    })

  mostrarHistorialMultas(contenido)
}

// GUARDAR UNA NUEVA MULTA

function registrarMulta(evento, contenido) {
  evento.preventDefault()

  const numeroCaso = Number(
    contenido.querySelector('#caso-multa').value
  )

  const fecha = contenido.querySelector('#fecha-multa').value
  const motivo = contenido.querySelector('#motivo-multa').value.trim()

  const valorTexto = contenido.querySelector('#valor-multa').value
  const valor = Number(valorTexto)

  const observaciones = contenido
    .querySelector('#observaciones-multa').value.trim()

  const mensaje = contenido.querySelector('#mensaje-multas')

  if (
    !Number.isSafeInteger(numeroCaso) ||
    numeroCaso < 1 ||
    !fecha ||
    !motivo ||
    !/^[0-9]+$/.test(valorTexto) ||
    !Number.isSafeInteger(valor) ||
    valor <= 0
  ) {
    mensaje.textContent = 'Revise los datos de la multa.'
    return
  }

  const disponible = obtenerCasosDisponibles().some(
    caso => Number(caso.numero) === numeroCaso
  )

  if (!disponible) {
    mensaje.textContent =
      'El caso no está habilitado para registrar una multa.'
    return
  }

  const multas = obtenerMultas()

  const numero = multas.reduce(
    (mayor, multa) => Math.max(
      mayor,
      Number(multa.numero) || 0
    ),
    0
  ) + 1

  multas.push({
    numero,
    numeroCaso,
    fecha,
    motivo,
    valor,
    estadoPago: 'Pendiente',
    fechaPago: '',
    observaciones
  })

  if (!guardarMultas(multas)) {
    mensaje.textContent = 'No fue posible guardar la multa.'
    return
  }

  mostrarMultasConvivencia(contenido)

  contenido.querySelector('#mensaje-multas').textContent =
    'Multa registrada correctamente.'
}

// REGISTRAR EL PAGO DE UNA MULTA

function marcarMultaPagada(numero, contenido) {
  const multas = obtenerMultas()

  const multa = multas.find(
    item => Number(item.numero) === Number(numero)
  )

  if (!multa || multa.estadoPago === 'Pagada') return

  const fecha = contenido.querySelector(
    `[data-fecha-pago="${numero}"]`
  )

  const mensaje = contenido.querySelector('#mensaje-multas')

  if (!fecha || !fecha.value) {
    mensaje.textContent = 'Seleccione la fecha de pago.'
    return
  }

  multa.estadoPago = 'Pagada'
  multa.fechaPago = fecha.value

  if (!guardarMultas(multas)) {
    mensaje.textContent = 'No se pudo registrar el pago.'
    return
  }

  mostrarHistorialMultas(contenido)

  mensaje.textContent = 'Pago registrado correctamente.'
}

// MOSTRAR HISTORIAL Y RESUMEN ECONÓMICO

function mostrarHistorialMultas(contenido) {
  const historial = contenido.querySelector('#historial-multas')
  if (!historial) return

  const multas = obtenerMultas()

  const totalAplicado = multas.reduce(
    (suma, multa) => suma + Number(multa.valor),
    0
  )

  const totalPagado = multas
    .filter(multa => multa.estadoPago === 'Pagada')
    .reduce((suma, multa) => suma + Number(multa.valor), 0)

  const totalPendiente = totalAplicado - totalPagado

  historial.innerHTML = `
    <div style="overflow-x: auto;">

      <table
        border="1"
        cellpadding="10"
        style="width: 100%; border-collapse: collapse;"
      >
        <thead>
          <tr>
            <th>Multa</th>
            <th>Caso</th>
            <th>Fecha</th>
            <th>Motivo</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Fecha de pago</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          ${multas.map(multa => `
            <tr>
              <td>${escaparHTML(multa.numero)}</td>
              <td>${escaparHTML(multa.numeroCaso)}</td>
              <td>${escaparHTML(multa.fecha)}</td>
              <td>${escaparHTML(multa.motivo)}</td>
              <td>${formatoMoneda(multa.valor)}</td>
              <td>${escaparHTML(multa.estadoPago)}</td>
              <td>${escaparHTML(multa.fechaPago || 'Sin pago')}</td>

              <td>
                ${multa.estadoPago === 'Pendiente' ? `
                  <input
                    type="date"
                    data-fecha-pago="${escaparHTML(multa.numero)}"
                  >

                  <button
                    type="button"
                    class="boton-volver"
                    data-pagar-multa="${escaparHTML(multa.numero)}"
                  >
                    Marcar pagada
                  </button>
                ` : 'Pagada'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    ${multas.length === 0 ? `
      <p>No hay multas registradas.</p>
    ` : ''}

    <p><strong>Multas registradas: ${multas.length}</strong></p>
    <p><strong>Total aplicado: ${formatoMoneda(totalAplicado)}</strong></p>
    <p><strong>Total pagado: ${formatoMoneda(totalPagado)}</strong></p>
    <p><strong>Total pendiente: ${formatoMoneda(totalPendiente)}</strong></p>
  `

  historial.querySelectorAll('[data-pagar-multa]').forEach(boton => {
    boton.addEventListener('click', () => {
      marcarMultaPagada(
        Number(boton.dataset.pagarMulta),
        contenido
      )
    })
  })
}
