<script setup>
import { computed, ref, watch } from 'vue'
import redLaPaz from '../data/redLaPaz.json'
import { construirGrafo } from '../utils/construirGrafo'
import { calcularDijkstra } from '../utils/dijkstra'
import MapaRutas from '../components/MapaRutas.vue'

const escenarios = [
  { id: 'normal', nombre: 'Normal', codigo: 'BASE' },
  { id: 'pico', nombre: 'Hora pico', codigo: 'PICO' },
  { id: 'paro', nombre: 'Paro', codigo: 'PARO' }
]

const origenId = ref('libertador')
const destinoId = ref('calacoto')
const escenarioSeleccionado = ref('normal')
const resultado = ref(null)
const comparacion = ref([])
const mensajeError = ref('')
const caminoRuta = ref([])
const repetirClave = ref(0)

// Cambiar origen, destino o escenario limpia la animación del camino anterior.
watch([origenId, destinoId, escenarioSeleccionado], () => {
  caminoRuta.value = []
})

const repetirAnimacion = () => {
  repetirClave.value += 1
}

const nodosVisibles = computed(() => [
  ...redLaPaz.estaciones,
  ...redLaPaz.puntosExtra
])

const nombreNodo = id => {
  const nodo = nodosVisibles.value.find(item => item.id === id)
  return nodo?.nombre || id
}

const nombreVisibleDesdeCamino = id => {
  if (!id.includes('|')) return nombreNodo(id)
  return nombreNodo(id.split('|')[0])
}

const formatoMinutos = distancia => {
  if (!Number.isFinite(distancia)) return 'Sin ruta'
  const minutos = Math.max(0, Math.round(distancia))
  return `${minutos} min`
}

const construirPasos = (ruta, aristasPorId) => {
  if (!ruta.alcanzable) return []

  const pasos = []
  let tramoActual = null

  const cerrarTramo = () => {
    if (!tramoActual) return
    pasos.push({
      modo: 'teleferico',
      etiqueta: `LÍNEA ${tramoActual.linea}`,
      texto: `Viaja ${formatoMinutos(tramoActual.minutos)} en Línea ${tramoActual.linea} hasta ${tramoActual.destino}`
    })
    tramoActual = null
  }

  for (const edgeId of ruta.aristasCamino) {
    const arista = aristasPorId.get(edgeId)
    if (!arista) continue

    if (arista.kind === 'subir') {
      cerrarTramo()
      pasos.push({
        modo: 'fila',
        etiqueta: 'FILA / ABORDAJE',
        texto: `Espera ${formatoMinutos(arista.weight)} y sube a Línea ${arista.lineaNombre}`
      })
    } else if (arista.kind === 'tramo') {
      if (!tramoActual || tramoActual.lineaId !== arista.lineaId) {
        cerrarTramo()
        tramoActual = {
          lineaId: arista.lineaId,
          linea: arista.lineaNombre,
          minutos: 0,
          destino: nombreVisibleDesdeCamino(arista.targetId)
        }
      }

      tramoActual.minutos += arista.weight
      tramoActual.destino = nombreVisibleDesdeCamino(arista.targetId)
    } else if (arista.kind === 'bajada') {
      cerrarTramo()
    } else if (arista.kind === 'caminata') {
      cerrarTramo()
      pasos.push({
        modo: 'caminata',
        etiqueta: 'CAMINATA',
        texto: `Camina ${formatoMinutos(arista.weight)} hasta ${nombreNodo(arista.haciaId)}`
      })
    } else if (arista.kind === 'minibus') {
      cerrarTramo()
      pasos.push({
        modo: 'minibus',
        etiqueta: 'MINIBÚS',
        texto: `Minibús ${formatoMinutos(arista.weight)} hasta ${nombreNodo(arista.haciaId)}`
      })
    }
  }

  cerrarTramo()
  return pasos
}

const rutaVisible = ruta => {
  return ruta.camino
    .filter(id => !id.includes('|'))
    .join('>')
}

const calcular = () => {
  mensajeError.value = ''

  if (origenId.value === destinoId.value) {
    caminoRuta.value = []
    resultado.value = {
      distancia: 0,
      pasos: [{
        modo: 'caminata',
        etiqueta: 'ORIGEN = DESTINO',
        texto: 'Ya te encuentras en el punto de destino.'
      }]
    }
    comparacion.value = escenarios.map(item => ({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      tiempo: '0 min',
      cambio: 'Ruta igual'
    }))
    return
  }

  try {
    const actuales = {}

    for (const escenario of escenarios) {
      const { nodes, edges } = construirGrafo(escenario.id)
      const ruta = calcularDijkstra(
        nodes,
        edges,
        origenId.value,
        destinoId.value
      )

      actuales[escenario.id] = ruta
    }

    const rutaPrincipal = actuales[escenarioSeleccionado.value]

    if (!rutaPrincipal.alcanzable) {
      caminoRuta.value = []
      resultado.value = null
      mensajeError.value = 'No existe una ruta disponible entre el origen y el destino.'
    } else {
      caminoRuta.value = [...rutaPrincipal.camino]
      const grafoPrincipal = construirGrafo(escenarioSeleccionado.value)
      const aristasPorId = new Map(
        grafoPrincipal.edges.map(arista => [arista.id, arista])
      )

      resultado.value = {
        distancia: rutaPrincipal.distancia,
        pasos: construirPasos(rutaPrincipal, aristasPorId)
      }
    }

    const rutasDeReferencia = Object.values(actuales)
      .filter(ruta => ruta.alcanzable)

    comparacion.value = escenarios.map(escenario => {
      const ruta = actuales[escenario.id]

      if (!ruta.alcanzable) {
        return {
          id: escenario.id,
          codigo: escenario.codigo,
          nombre: escenario.nombre,
          tiempo: 'Sin ruta',
          cambio: 'Sin ruta disponible'
        }
      }

      const rutaActual = rutaVisible(ruta)
      const rutaNormal = rutasDeReferencia[0]
        ? rutaVisible(rutasDeReferencia[0])
        : rutaActual

      return {
        id: escenario.id,
        codigo: escenario.codigo,
        nombre: escenario.nombre,
        tiempo: formatoMinutos(ruta.distancia),
        cambio: rutaNormal === rutaActual
          ? 'Misma ruta de referencia'
          : 'La ruta cambió'
      }
    })
  } catch (error) {
    caminoRuta.value = []
    resultado.value = null
    comparacion.value = []
    mensajeError.value = error.message
  }
}

calcular()
</script>

<template>
  <section class="view application-view">
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">05 · SIMULADOR DE RUTAS</span>
      </div>
      <h1>Aplicación</h1>
      <p class="lead">
        Elige origen, destino y escenario para calcular el camino de menor tiempo con
        Dijkstra sobre <code>redLaPaz.json</code>.
      </p>
    </header>

    <!-- Panel de control -->
    <article class="card route-controls">
      <div class="controls-header">
        <span class="mono-tag">PARÁMETROS DE CONSULTA</span>
        <span class="active-route-pill">
          {{ nombreNodo(origenId) }} → {{ nombreNodo(destinoId) }}
        </span>
      </div>

      <div class="select-grid">
        <label>
          <span>Origen</span>
          <select v-model="origenId">
            <optgroup label="Estaciones de teleférico">
              <option
                v-for="estacion in redLaPaz.estaciones"
                :key="estacion.id"
                :value="estacion.id"
              >
                {{ estacion.nombre }}
              </option>
            </optgroup>
            <optgroup label="Puntos de la ciudad">
              <option
                v-for="punto in redLaPaz.puntosExtra"
                :key="punto.id"
                :value="punto.id"
              >
                {{ punto.nombre }}
              </option>
            </optgroup>
          </select>
        </label>

        <label>
          <span>Destino</span>
          <select v-model="destinoId">
            <optgroup label="Estaciones de teleférico">
              <option
                v-for="estacion in redLaPaz.estaciones"
                :key="estacion.id"
                :value="estacion.id"
              >
                {{ estacion.nombre }}
              </option>
            </optgroup>
            <optgroup label="Puntos de la ciudad">
              <option
                v-for="punto in redLaPaz.puntosExtra"
                :key="punto.id"
                :value="punto.id"
              >
                {{ punto.nombre }}
              </option>
            </optgroup>
          </select>
        </label>
      </div>

      <div class="controls-bottom">
        <div class="scenario-row">
          <span class="control-label">Escenario</span>
          <div class="scenario-buttons" role="group" aria-label="Seleccionar escenario">
            <button
              v-for="escenario in escenarios"
              :key="escenario.id"
              type="button"
              :class="{ active: escenarioSeleccionado === escenario.id }"
              @click="escenarioSeleccionado = escenario.id"
            >
              <span class="btn-code">{{ escenario.codigo }}</span>
              <span>{{ escenario.nombre }}</span>
            </button>
          </div>
        </div>

        <button class="calculate-button" type="button" @click="calcular">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Calcular ruta</span>
        </button>
      </div>
    </article>

    <!-- Mapa + barra de animación -->
    <article class="card map-stage">
      <div class="map-toolbar">
        <div>
          <span class="mono-tag">RED INTERACTIVA · LA PAZ</span>
          <h2>Visualización del recorrido</h2>
        </div>

        <button
          v-if="caminoRuta.length"
          class="repeat-button"
          type="button"
          @click="repetirAnimacion"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3 3v5h5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Repetir animación</span>
        </button>
      </div>

      <div class="map-frame">
        <MapaRutas :ruta="caminoRuta" :repeat-key="repetirClave" />
      </div>
    </article>

    <!-- Error o resultado paso a paso -->
    <article v-if="mensajeError" class="card no-route">
      <span class="error-code">SIN CONEXIÓN</span>
      <h2>Ruta no disponible</h2>
      <p>{{ mensajeError }}</p>
    </article>

    <article v-else-if="resultado" class="card route-result">
      <div class="result-header">
        <div>
          <span class="mono-tag">TIEMPO MÍNIMO ESTIMADO</span>
          <h2>Detalle de la ruta óptima</h2>
        </div>
        <strong class="total-time">{{ formatoMinutos(resultado.distancia) }}</strong>
      </div>

      <ol class="route-steps">
        <li
          v-for="(paso, index) in resultado.pasos"
          :key="`${paso.texto}-${index}`"
          :class="`step-${paso.modo}`"
        >
          <span class="step-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <div class="step-content">
            <span class="step-tag">{{ paso.etiqueta }}</span>
            <p>{{ paso.texto }}</p>
          </div>
        </li>
      </ol>
    </article>

    <!-- Comparación entre escenarios -->
    <article v-if="comparacion.length" class="card comparison-card">
      <div class="comparison-head">
        <h2>Comparación entre escenarios</h2>
        <span class="mono-pill">MISMO GRAFO</span>
      </div>

      <div class="comparison-grid">
        <div
          v-for="item in comparacion"
          :key="item.id"
          :class="['comparison-item', { selected: item.id === escenarioSeleccionado }]"
        >
          <div class="item-top">
            <span>{{ item.nombre }}</span>
            <small class="item-code">{{ item.codigo }}</small>
          </div>
          <strong>{{ item.tiempo }}</strong>
          <small class="item-status">{{ item.cambio }}</small>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.application-view {
  min-width: 0;
}

.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.kicker-line {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-green));
}

.kicker-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
}

.section-heading code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

.mono-tag {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-solid);
}

/* Panel de controles */
.route-controls {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.controls-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--border-color);
}

.active-route-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 7px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
  color: var(--accent-green);
}

.select-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.select-grid label,
.scenario-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-grid label > span,
.control-label {
  font-family: "JetBrains Mono", monospace;
  color: var(--text-primary);
  font-size: 0.76rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.select-grid select {
  width: 100%;
  height: 46px;
  padding: 0 12px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  outline: none;
  background: var(--bg-surface-2);
  color: var(--text-primary);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.select-grid select:focus {
  border-color: var(--accent-solid);
  box-shadow: 0 0 0 3px var(--accent-soft-bg);
}

.controls-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.scenario-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scenario-buttons button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-surface-2);
  color: var(--text-secondary);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.88rem;
  transition: 160ms ease;
}

.scenario-buttons button:hover {
  color: var(--text-primary);
  border-color: var(--accent-solid);
}

.scenario-buttons button.active {
  border-color: var(--accent-solid);
  background: var(--accent-soft-bg);
  color: var(--text-primary);
}

.btn-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  padding: 2px 6px;
  border-radius: 5px;
  background: var(--bg-body);
  color: var(--accent-solid);
}

.scenario-buttons button.active .btn-code {
  color: var(--accent-green);
}

.calculate-button {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 44px;
  padding: 0 22px;
  border: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--accent-solid), var(--accent-pink));
  color: #fff;
  cursor: pointer;
  font-weight: 800;
  font-size: 0.9rem;
  transition: transform 160ms ease, filter 160ms ease;
}

.calculate-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.06);
}

/* Mapa */
.map-stage {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.map-toolbar h2 {
  margin: 4px 0 0;
}

.map-frame {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background: var(--bg-body);
}

.repeat-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid var(--border-color);
  border-radius: 9px;
  background: var(--bg-surface-2);
  color: var(--text-primary);
  cursor: pointer;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.76rem;
  font-weight: 700;
  transition: 160ms ease;
}

.repeat-button:hover {
  border-color: var(--accent-green);
  color: var(--accent-green);
}

/* Error */
.no-route {
  border-color: rgba(236, 72, 153, 0.45);
  background: rgba(236, 72, 153, 0.08);
}

.error-code {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--accent-pink);
  margin-bottom: 6px;
}

/* Resultado */
.route-result {
  border-left: 4px solid var(--accent-green);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-color);
}

.result-header h2 {
  margin: 4px 0 0;
}

.total-time {
  font-family: "JetBrains Mono", monospace;
  color: var(--accent-green);
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
}

.route-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.route-steps li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 13px 15px;
  border-radius: 12px;
  background: var(--bg-body);
  border: 1px solid var(--border-color);
}

.step-index {
  flex: 0 0 auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 5px 8px;
  border-radius: 7px;
  background: var(--accent-soft-bg);
  color: var(--accent-solid);
}

.step-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.step-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
}

.step-teleferico .step-tag {
  color: var(--accent-solid);
}

.step-fila .step-tag {
  color: var(--accent-pink);
}

.step-caminata .step-tag {
  color: var(--accent-green);
}

.step-minibus .step-tag {
  color: var(--accent-blue);
}

.route-steps p {
  margin: 0;
  color: var(--text-primary);
  font-size: 0.95rem;
}

/* Comparación */
.comparison-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.comparison-head h2 {
  margin: 0;
}

.mono-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--bg-surface-2);
  color: var(--accent-green);
  border: 1px solid var(--border-color);
}

.comparison-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 118px;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-body);
  transition: border-color 160ms ease, background-color 160ms ease;
}

.comparison-item.selected {
  border-color: var(--accent-green);
  background: var(--accent-soft-bg);
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.item-top span {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.item-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  color: var(--text-secondary);
}

.comparison-item strong {
  font-family: "JetBrains Mono", monospace;
  color: var(--accent-green);
  font-size: 1.3rem;
}

.item-status {
  font-family: "JetBrains Mono", monospace;
  color: var(--text-secondary);
  font-size: 0.76rem;
  line-height: 1.35;
}

@media (max-width: 720px) {
  .select-grid,
  .comparison-grid {
    grid-template-columns: 1fr;
  }

  .controls-bottom {
    align-items: stretch;
  }

  .calculate-button {
    width: 100%;
    justify-content: center;
  }

  .scenario-buttons button {
    flex: 1;
    justify-content: center;
  }
}
</style>