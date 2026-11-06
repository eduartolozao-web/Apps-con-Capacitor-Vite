
// INDICADORES DEL COMITÉ DE CONVIVENCIA

const CLAVE_CONVIVENCIA = 'casosConvivencia'

// CONSULTAR LOS CASOS EXISTENTES

function obtenerCasosIndicadores() {
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

// PROTEGER LOS TEXTOS MOSTRADOS EN PANTALLA

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

// CONTAR REGISTROS POR UNA PROPIEDAD

function contarPorCampo(registros, campo) {
  const conteos = {}

  registros.forEach(registro => {
    const valor = String(registro[campo] || 'Sin identificar').trim()

    conteos[valor] = (conteos[valor] || 0) + 1
  })

  return Object.entries(conteos)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) =>
      b.cantidad - a.cantidad ||
      a.nombre.localeCompare(b.nombre, 'es')
    )
}

// GENERAR TABLAS DE FRECUENCIAS

function generarTabla(datos, tituloPrimeraColumna) {
  if (datos.length === 0) {
    return '<p>No existen infracciones confirmadas para este indicador.</p>'
  }

  return `
    <div style="overflow-x: auto;">
      <table
        border="1"
        cellpadding="10"
        style="width: 100%; border-collapse: collapse;"
      >
        <thead>
          <tr>
            <th>${escaparHTML(tituloPrimeraColumna)}</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          ${datos.map(item => `
            <tr>
              <td>${escaparHTML(item.nombre)}</td>
              <td>${item.cantidad}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

// MOSTRAR INDICADORES

export function mostrarIndicadoresConvivencia(contenido) {
  if (!contenido) {
    return
  }

  const casos = obtenerCasosIndicadores()

  const enRevision = casos.filter(
    caso => caso.estado === 'En revisión'
  )

  const confirmadas = casos.filter(
    caso => caso.estado === 'Infracción confirmada'
  )

  const tiposFrecuentes = contarPorCampo(confirmadas, 'tipo')

  const personasFrecuentes = contarPorCampo(confirmadas, 'persona')

  const reincidentes = personasFrecuentes.filter(
    persona => persona.cantidad >= 2
  )

  contenido.innerHTML = `
    <section class="detalle">

      <h2>Indicadores de convivencia</h2>

      <p>
        Análisis de los casos reportados y las
        infracciones confirmadas.
      </p>

      <div class="modulos">

        <div class="tarjeta">
          <h3>Total de casos</h3>
          <h2>${casos.length}</h2>
        </div>

        <div class="tarjeta">
          <h3>Casos en revisión</h3>
          <h2>${enRevision.length}</h2>
        </div>

        <div class="tarjeta">
          <h3>Infracciones confirmadas</h3>
          <h2>${confirmadas.length}</h2>
        </div>

        <div class="tarjeta">
          <h3>Personas reincidentes</h3>
          <h2>${reincidentes.length}</h2>
        </div>

      </div>

      <h3>Tipos de infracción más frecuentes</h3>

      ${generarTabla(tiposFrecuentes, 'Tipo de infracción')}

      <h3>Personas con más infracciones confirmadas</h3>

      ${generarTabla(personasFrecuentes, 'Identificador de persona')}

      <h3>Reincidencias</h3>

      ${generarTabla(reincidentes, 'Identificador de persona')}

      <p class="mensaje">
        Los indicadores de infracciones se calculan únicamente
        sobre casos cuyo estado actual es
        "Infracción confirmada".
      </p>

    </section>
  `
}
