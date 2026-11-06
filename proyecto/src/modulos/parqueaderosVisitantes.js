
// MÓDULO DE PARQUEADEROS DE VISITANTES

const CLAVE_VISITANTES = 'parqueaderosVisitantes'

// CONSULTAR REGISTROS

function obtenerVisitantes() {
  try {
    const datos = JSON.parse(
      localStorage.getItem(CLAVE_VISITANTES) || '[]'
    )

    return Array.isArray(datos) ? datos : []
  } catch (error) {
    console.error('Error al consultar visitantes:', error)
    return []
  }
}

// GUARDAR REGISTROS

function guardarVisitantes(registros) {
  try {
    localStorage.setItem(
      CLAVE_VISITANTES,
      JSON.stringify(registros)
    )
    return true
  } catch (error) {
    console.error('Error al guardar visitantes:', error)
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

// PROTEGER LOS DATOS MOSTRADOS COMO HTML

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

// CONVERTIR UNA HORA A MINUTOS

function convertirMinutos(hora) {
  const partes = hora.split(':').map(Number)
  return partes[0] * 60 + partes[1]
}

// CALCULAR VALOR POR HORA O FRACCIÓN

function calcularCobro(inicio, final, tarifa) {
  const minutos = convertirMinutos(final) - convertirMinutos(inicio)

  if (minutos <= 0) {
    return null
  }

  const horas = Math.ceil(minutos / 60)

  return {
    minutos,
    horas,
    valor: horas * tarifa
  }
}

// MOSTRAR FORMULARIO

export function mostrarParqueaderosVisitantes(contenido) {
  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">🅿️</div>
      <h2>Parqueaderos de visitantes</h2>

      <p>Registre la utilización de los parqueaderos de visitantes.</p>

      <form id="formulario-visitantes">

        <p>
          <label for="numero-visitante">Número de parqueadero</label>
          <input
            type="number"
            id="numero-visitante"
            min="1"
            step="1"
            required
          >
        </p>

        <p>
          <label for="fecha-visitante">Fecha de utilización</label>
          <input
            type="date"
            id="fecha-visitante"
            required
          >
        </p>

        <p>
          <label for="placa-visitante">Placa del vehículo</label>
          <input
            type="text"
            id="placa-visitante"
            maxlength="10"
            placeholder="Ejemplo: ABC123"
            required
          >
        </p>

        <p>
          <label for="entrada-visitante">Hora de entrada</label>
          <input
            type="time"
            id="entrada-visitante"
            required
          >
        </p>

        <p>
          <label for="salida-visitante">Hora de salida</label>
          <input
            type="time"
            id="salida-visitante"
            required
          >
        </p>

        <p>
          <label for="tarifa-visitante">Tarifa por hora (COP)</label>
          <input
            type="text"
            id="tarifa-visitante"
            inputmode="numeric"
            pattern="[0-9]+"
            placeholder="Ejemplo: 3000"
            autocomplete="off"
            required
          >
        </p>

        <p>
          <label for="observaciones-visitante">Observaciones</label>
          <textarea
            id="observaciones-visitante"
            rows="3"
          ></textarea>
        </p>

        <button class="boton-volver" type="submit">
          Guardar utilización
        </button>

        <p id="mensaje-visitantes" aria-live="polite"></p>

      </form>

      <h3>Historial de utilización</h3>
      <div id="historial-visitantes"></div>

    </section>
  `

  document.querySelector('#formulario-visitantes')
    .addEventListener('submit', registrarVisitante)

  mostrarHistorialVisitantes()
}

// REGISTRAR UTILIZACIÓN

function registrarVisitante(evento) {
  evento.preventDefault()

  const numeroTexto = document.querySelector('#numero-visitante').value
  const numero = Number(numeroTexto)
  const fecha = document.querySelector('#fecha-visitante').value
  const placa = document.querySelector('#placa-visitante').value.trim().toUpperCase()
  const entrada = document.querySelector('#entrada-visitante').value
  const salida = document.querySelector('#salida-visitante').value
  const tarifaTexto = document.querySelector('#tarifa-visitante').value
  const tarifa = Number(tarifaTexto)
  const observaciones = document.querySelector('#observaciones-visitante').value.trim()

  const mensaje = document.querySelector('#mensaje-visitantes')

  if (
    !Number.isSafeInteger(numero) ||
    numero < 1 ||
    !fecha ||
    !placa ||
    !entrada ||
    !salida ||
    !/^[0-9]+$/.test(tarifaTexto) ||
    !Number.isSafeInteger(tarifa)
  ) {
    mensaje.textContent = 'Revise los datos ingresados.'
    return
  }

  const cobro = calcularCobro(entrada, salida, tarifa)

  if (!cobro || !Number.isSafeInteger(cobro.valor)) {
    mensaje.textContent = 'La hora de salida debe ser posterior a la entrada y el valor debe ser válido.'
    return
  }

  const registros = obtenerVisitantes()

  // EVITAR USO SIMULTÁNEO DEL MISMO PARQUEADERO

  const ocupado = registros.some(registro =>
    registro.numero === numero &&
    registro.fecha === fecha &&
    entrada < registro.salida &&
    salida > registro.entrada
  )

  if (ocupado) {
    mensaje.textContent = 'El parqueadero ya está ocupado en ese horario.'
    return
  }

  registros.push({
    numero,
    fecha,
    placa,
    entrada,
    salida,
    tarifa,
    minutos: cobro.minutos,
    horas: cobro.horas,
    valor: cobro.valor,
    observaciones
  })

  if (!guardarVisitantes(registros)) {
    mensaje.textContent = 'No fue posible guardar el registro.'
    return
  }

  document.querySelector('#formulario-visitantes').reset()

  mensaje.textContent = 'Utilización registrada correctamente.'

  mostrarHistorialVisitantes()
}

// MOSTRAR HISTORIAL E INGRESOS GENERADOS

function mostrarHistorialVisitantes() {
  const historial = document.querySelector('#historial-visitantes')

  if (!historial) {
    return
  }

  const registros = obtenerVisitantes()

  const total = registros.reduce(
    (suma, registro) => suma + Number(registro.valor),
    0
  )

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay utilizaciones registradas.</p>
      <p><strong>Total generado: ${formatoMoneda(0)}</strong></p>
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
            <th>Fecha</th>
            <th>Placa</th>
            <th>Entrada</th>
            <th>Salida</th>
            <th>Horas cobradas</th>
            <th>Tarifa</th>
            <th>Valor generado</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          ${registros.map(registro => `
            <tr>
              <td>${escaparHTML(registro.numero)}</td>
              <td>${escaparHTML(registro.fecha)}</td>
              <td>${escaparHTML(registro.placa)}</td>
              <td>${escaparHTML(registro.entrada)}</td>
              <td>${escaparHTML(registro.salida)}</td>
              <td>${escaparHTML(registro.horas)}</td>
              <td>${formatoMoneda(registro.tarifa)}</td>
              <td>${formatoMoneda(registro.valor)}</td>
              <td>${escaparHTML(registro.observaciones)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>Utilizaciones registradas: ${registros.length}</strong>
    </p>

    <p>
      <strong>Total generado: ${formatoMoneda(total)}</strong>
    </p>
  `
}
