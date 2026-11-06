
import './style.css'
import { mostrarZonasComunes, seleccionarZona } from './modulos/zonasComunes.js'

const modulos = [
  {
    id: 'zonas-comunes',
    nombre: 'Zonas comunes',
    descripcion: 'Mantenimiento, jardines, canchas, parqueaderos, shut de basuras, luminarias y fachadas.',
    icono: '🌳'
  },
  {
    id: 'convivencia',
    nombre: 'Comité de convivencia',
    descripcion: 'Casos reportados, infracciones, reincidencias y multas.',
    icono: '👥'
  },
  {
    id: 'zonas-privadas',
    nombre: 'Zonas privadas',
    descripcion: 'Viviendas, propietarios, residentes e intervenciones por daños externos.',
    icono: '🏠'
  }
]

const app = document.querySelector('#app')

function mostrarInicio() {
  app.innerHTML = `
    <header class="encabezado">
      <div class="marca">🏢</div>
      <h1>SISTEMA DE GESTIÓN DE PROPIEDAD HORIZONTAL</h1>
      <p>Sistema de Gestión de Propiedad Horizontal</p>
    </header>

    <main class="contenedor">
      <h2>Panel principal</h2>
      <p class="subtitulo">
        Seleccione el módulo que desea consultar.
      </p>

      <div class="modulos">
        ${modulos.map(modulo => `
          <button class="tarjeta" data-modulo="${modulo.id}">
            <span class="icono">${modulo.icono}</span>
            <h3>${modulo.nombre}</h3>
            <p>${modulo.descripcion}</p>
            <span class="entrar">Ingresar →</span>
          </button>
        `).join('')}
      </div>
    </main>

    <footer>
      Proyecto académico - Gestor de Propiedad Horizontal
    </footer>
  `

  document.querySelectorAll('[data-modulo]').forEach(boton => {
    boton.addEventListener('click', () => {
      mostrarModulo(boton.dataset.modulo)
    })
  })
}

function mostrarModulo(id) {
  const modulo = modulos.find(item => item.id === id)

  if (!modulo) {
    mostrarInicio()
    return
  }

  app.innerHTML = `
    <header class="encabezado">
      <div class="marca">${modulo.icono}</div>
      <h1>${modulo.nombre}</h1>
      <p>Sistema de Gestión de Propiedad Horizontal</p>
    </header>

    <main class="contenedor">
      <button id="volver" class="boton-volver">
        ← Volver al inicio
      </button>

      ${id === 'zonas-comunes' ? mostrarZonasComunes() : `
  <section class="detalle">

    <div class="marca">${modulo.icono}</div>

    <h2>${modulo.nombre}</h2>

    <p>${modulo.descripcion}</p>

    <p class="mensaje">
      Este módulo está preparado para comenzar su desarrollo.
    </p>

  </section>
`}
    </main>
  `

  document.querySelector('#volver').addEventListener('click', mostrarInicio)
  if (id === 'zonas-comunes') {

  document.querySelectorAll('[data-zona]').forEach(boton => {

    boton.addEventListener('click', () => {

      seleccionarZona(boton.dataset.zona)

    })

  })

}
}

mostrarInicio()
