
// MÓDULO DE GESTIÓN DE ZONAS COMUNES

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

// MOSTRAR LAS SECCIONES DEL MÓDULO

export function mostrarZonasComunes() {

  return `
    <section class="detalle">

      <h2>Gestión de zonas comunes</h2>

      <p>
        Seleccione la zona común que desea consultar.
      </p>

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

// MOSTRAR LA SECCIÓN SELECCIONADA

export function seleccionarZona(id) {

  const zona = zonasComunes.find(item => item.id === id)

  if (!zona) {
    return
  }

  const contenido = document.querySelector('#contenido-zona')

  if (!contenido) {
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
