
// MÓDULO DE COMITÉ DE CONVIVENCIA
// REGISTRO DE CASOS REPORTADOS

const CLAVE_CONVIVENCIA = 'casosConvivencia'

// CONSULTAR CASOS GUARDADOS

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

// GUARDAR CASOS

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

// MOSTRAR FORMULARIO DE CONVIVENCIA

export function mostrarConvivencia(contenido) {

  contenido.innerHTML = `
    <section class="detalle">

      <div class="marca">👥</div>

      <h2>Comité de convivencia</h2>

      <p>
        Registro y seguimiento de situaciones
        reportadas en la propiedad horizontal.
      </p>

      <h3>Registrar nuevo caso</h3>

      <form id="formulario-convivencia">

        <p>
          <label for="fecha-caso">Fecha del reporte</label>
          <input
            type="date"
            id="fecha-caso"
            required
          >
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
            placeholder="Ejemplo ficticio: RES-001"
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
            placeholder="Describa la situación reportada"
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

      <h3>Historial de casos reportados</h3>

      <div id="historial-convivencia"></div>

    </section>
  `

  document.querySelector('#formulario-convivencia')
    .addEventListener('submit', registrarCaso)

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

  if (
    !fecha ||
    !torre ||
    !vivienda ||
    !persona ||
    !tipo ||
    !descripcion
  ) {
    mensaje.textContent = 'Complete los campos obligatorios.'
    return
  }

  const registros = obtenerCasos()

  // GENERAR NÚMERO CONSECUTIVO

  const numero = registros.reduce(
    (mayor, caso) => Math.max(mayor, Number(caso.numero) || 0),
    0
  ) + 1

  const nuevoCaso = {
    numero,
    fecha,
    torre,
    vivienda,
    persona,
    tipo,
    descripcion,
    estado: 'Reportado',
    observaciones
  }

  registros.push(nuevoCaso)

  if (!guardarCasos(registros)) {
    mensaje.textContent = 'No fue posible guardar el caso.'
    return
  }

  document.querySelector('#formulario-convivencia').reset()

  mensaje.textContent = 'Caso registrado correctamente.'

  mostrarHistorialConvivencia()
}

// MOSTRAR HISTORIAL DE CASOS

function mostrarHistorialConvivencia() {
  const historial = document.querySelector('#historial-convivencia')

  if (!historial) {
    return
  }

  const registros = obtenerCasos()

  if (registros.length === 0) {
    historial.innerHTML = `
      <p>No hay casos registrados.</p>
      <p><strong>Total de casos: 0</strong></p>
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
            <th>Caso</th>
            <th>Fecha</th>
            <th>Torre</th>
            <th>Vivienda</th>
            <th>Persona</th>
            <th>Situación</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Observaciones</th>
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
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <p>
      <strong>Total de casos registrados: ${registros.length}</strong>
    </p>
  `
}
