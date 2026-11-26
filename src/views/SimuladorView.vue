<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import redLaPaz from '../data/redLaPaz.json'
import { construirGrafo } from '../utils/construirGrafo'
import { calcularDijkstra } from '../utils/dijkstra'
import MapaRutas from '../components/MapaRutas.vue'

const escenarios = [
  { id: 'normal', nombre: 'Normal', codigo: 'BASE' },
  { id: 'pico', nombre: 'Hora pico', codigo: 'PICO' },
  { id: 'paro', nombre: 'Paro', codigo: 'PARO' },
]

const causasFila = {
  normal: 'la fila habitual',
  pico: 'la fila de hora pico',
  paro: 'la fila del paro',
}

const origenId = ref('libertador')
const destinoId = ref('calacoto')
const escenarioSeleccionado = ref('normal')
const resultado = ref(null)
const comparacion = ref([])
const mensajeError = ref('')
const caminoRuta = ref([])
const repetirClave = ref(0)
const limpiando = ref(false)

const repetirAnimacion = () => {
  repetirClave.value += 1
}

const limpiar = () => {
  limpiando.value = true
  origenId.value = 'libertador'
  destinoId.value = 'calacoto'
  escenarioSeleccionado.value = 'normal'
  resultado.value = null
  comparacion.value = []
  mensajeError.value = ''
  caminoRuta.value = []
  repetirClave.value = 0
  setTimeout(() => {
    limpiando.value = false
  }, 0)
}

const nodosVisibles = computed(() => [
  ...redLaPaz.estaciones,
  ...redLaPaz.puntosExtra,
])

const nombreNodo = (id) => {
  const nodo = nodosVisibles.value.find((item) => item.id === id)
  return nodo?.nombre || id
}

const nombreVisibleDesdeCamino = (id) => {
  if (!id.includes('|')) return nombreNodo(id)
  return nombreNodo(id.split('|')[0])
}

const nombreNodoGrafo = (id) => {
  if (!id.includes('|')) return nombreNodo(id)
  const [estacionId, lineaId] = id.split('|')
  const linea = redLaPaz.lineas.find((item) => item.id === lineaId)
  return `${nombreNodo(estacionId)} · Línea ${linea?.nombre || lineaId}`
}

const formatoMinutos = (distancia) => {
  if (!Number.isFinite(distancia)) return 'Sin ruta'
  const minutos = Math.max(0, Math.round(distancia))
  return `${minutos} min`
}

const formatoDistanciaTentativa = (distancia) =>
  Number.isFinite(distancia) ? `${distancia.toFixed(2)} min` : '∞'

const construirPasos = (ruta, aristasPorId, escenario) => {
  if (!ruta.alcanzable) return []

  const pasos = []
  let tramoActual = null

  const cerrarTramo = () => {
    if (!tramoActual) return
    pasos.push({
      modo: 'teleferico',
      etiqueta: `LÍNEA ${tramoActual.linea}`,
      texto: `Viaja ${formatoMinutos(tramoActual.minutos)} en Línea ${tramoActual.linea} hasta ${tramoActual.destino}`,
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
        texto: `Espera ${formatoMinutos(arista.weight)} por ${causasFila[escenario]} antes de abordar Línea ${arista.lineaNombre}`,
      })
    } else if (arista.kind === 'tramo') {
      if (!tramoActual || tramoActual.lineaId !== arista.lineaId) {
        cerrarTramo()
        tramoActual = {
          lineaId: arista.lineaId,
          linea: arista.lineaNombre,
          minutos: 0,
          destino: nombreVisibleDesdeCamino(arista.targetId),
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
        texto: `Camina ${formatoMinutos(arista.weight)} hasta ${nombreNodo(arista.haciaId)}`,
      })
    } else if (arista.kind === 'minibus') {
      cerrarTramo()
      pasos.push({
        modo: 'minibus',
        etiqueta: 'MINIBÚS',
        texto: `Minibús ${formatoMinutos(arista.weight)} hasta ${nombreNodo(arista.haciaId)}`,
      })
    }
  }

  cerrarTramo()
  return pasos
}

const rutaVisible = (ruta) => ruta.camino.filter((id) => !id.includes('|')).join('>')

const calcular = () => {
  mensajeError.value = ''

  if (origenId.value === destinoId.value) {
    caminoRuta.value = []
    resultado.value = {
      distancia: 0,
      traza: [],
      pasos: [
        {
          modo: 'caminata',
          etiqueta: 'ORIGEN = DESTINO',
          texto: 'Ya te encuentras en el punto de destino.',
        },
      ],
    }
    comparacion.value = escenarios.map((item) => ({
      id: item.id,
      codigo: item.codigo,
      nombre: item.nombre,
      tiempo: '0 min',
      cambio: 'Ruta igual',
    }))
    return
  }

  try {
    const actuales = {}

    for (const escenario of escenarios) {
      const { nodes, edges } = construirGrafo(escenario.id)
      const ruta = calcularDijkstra(nodes, edges, origenId.value, destinoId.value)
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
      const aristasPorId = new Map(grafoPrincipal.edges.map((a) => [a.id, a]))

      resultado.value = {
        distancia: rutaPrincipal.distancia,
        pasos: construirPasos(rutaPrincipal, aristasPorId, escenarioSeleccionado.value),
        traza: rutaPrincipal.traza,
      }
    }

    const rutasDeReferencia = Object.values(actuales).filter((r) => r.alcanzable)

    comparacion.value = escenarios.map((escenario) => {
      const ruta = actuales[escenario.id]

      if (!ruta.alcanzable) {
        return {
          id: escenario.id,
          codigo: escenario.codigo,
          nombre: escenario.nombre,
          tiempo: 'Sin ruta',
          cambio: 'Sin ruta disponible',
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
        cambio:
          rutaNormal === rutaActual
            ? 'Misma ruta de referencia'
            : 'La ruta cambió',
      }
    })
  } catch (error) {
    caminoRuta.value = []
    resultado.value = null
    comparacion.value = []
    mensajeError.value = error.message
  }
}

watch([origenId, destinoId, escenarioSeleccionado], () => {
  if (limpiando.value) return
  calcular()
})
</script>

<template>
  <section class="view simulator-view">

    <!-- HEADER CON VOLVER -->
    <header class="simulator-header">
      <RouterLink class="back-link" to="/aplicacion">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M19 12H5M11 19l-7-7 7-7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span>Volver a Aplicación</span>
      </RouterLink>

      <div class="simulator-title">
        <div class="kicker-row">
          <span class="kicker-line"></span>
          <span class="kicker-text">05 · SIMULADOR INTERACTIVO</span>
        </div>
        <h1>Calcula tu ruta en La Paz</h1>
        <p class="lead">
          Elige origen, destino y escenario. Dijkstra recorre el grafo y devuelve el camino
          de menor tiempo acumulado en minutos.
        </p>
      </div>
    </header>

    <!-- Panel de control -->
    <article class="sim-panel sim-controls">
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

        <div class="action-row">
          <button class="clear-button" type="button" @click="limpiar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Limpiar</span>
          </button>

          <button class="calculate-button" type="button" @click="calcular">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Calcular ruta</span>
          </button>
        </div>
      </div>
    </article>

    <!-- Mapa -->
    <article class="sim-panel sim-map">
      <div class="map-toolbar">
        <div>
          <span class="mono-tag">RED INTERACTIVA · LA PAZ</span>
          <h3>Visualización del recorrido</h3>
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

    <!-- Error -->
    <article v-if="mensajeError" class="sim-panel sim-error">
      <span class="error-code">SIN CONEXIÓN</span>
      <h3>Ruta no disponible</h3>
      <p>{{ mensajeError }}</p>
    </article>

    <!-- Resultado -->
    <article v-else-if="resultado" class="sim-panel sim-result">
      <div class="result-header">
        <div>
          <span class="mono-tag">TIEMPO MÍNIMO ESTIMADO</span>
          <h3>Detalle de la ruta óptima</h3>
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

      <details
        v-if="resultado.traza.length"
        class="algorithm-trace"
        :key="`${origenId}-${destinoId}-${escenarioSeleccionado}`"
      >
        <summary>
          <span>Ver cómo se calculó con Dijkstra</span>
          <small>{{ resultado.traza.length }} nodos procesados</small>
        </summary>
        <p class="trace-intro">
          En cada paso se fija el nodo no visitado con menor tiempo provisional.
          Si se encuentra un camino más corto a un vecino, su distancia se actualiza.
        </p>
        <ol class="trace-list">
          <li v-for="(paso, index) in resultado.traza" :key="paso.nodoId">
            <span class="trace-index">{{ String(index + 1).padStart(2, '0') }}</span>
            <div class="trace-content">
              <p>
                Se elige <strong>{{ nombreNodoGrafo(paso.nodoId) }}</strong>
                con <strong>{{ formatoDistanciaTentativa(paso.distancia) }}</strong>.
              </p>
              <ul v-if="paso.actualizaciones.length">
                <li
                  v-for="actualizacion in paso.actualizaciones"
                  :key="actualizacion.nodoId"
                >
                  Actualiza {{ nombreNodoGrafo(actualizacion.nodoId) }}:
                  {{ formatoDistanciaTentativa(actualizacion.distanciaAnterior) }}
                  → {{ formatoDistanciaTentativa(actualizacion.distanciaNueva) }}
                </li>
              </ul>
              <small v-else>No se encontró una distancia mejor para sus vecinos.</small>
            </div>
          </li>
        </ol>
      </details>
    </article>
    <article v-else class="sim-panel sim-hint">
      <span class="mono-tag">LISTO PARA CALCULAR</span>
      <p>Elige un origen, un destino y un escenario, y presiona <strong>Calcular ruta</strong> para ver el recorrido en el mapa.</p>
    </article>
    <!-- Comparación -->
    <article v-if="comparacion.length" class="sim-panel sim-comparison">
      <div class="comparison-head">
        <h3>Comparación entre escenarios</h3>
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
/* ===== Variables locales (usan las globales si existen) ===== */
.simulator-view {
  --s-bg: var(--bg-body, #0b0f14);
  --s-surface: color-mix(in srgb, var(--bg-body, #0b0f14) 80%, transparent);
  --s-border: var(--border-color, rgba(255, 255, 255, 0.1));
  --s-text: var(--text-primary, #e8edf3);
  --s-muted: var(--text-secondary, #8b97a7);
  --s-accent: var(--accent-solid, #7c5cff);
  --s-accent-soft: var(--accent-soft-bg, rgba(124, 92, 255, 0.14));
  --s-green: var(--accent-green, #22c55e);
  --s-pink: var(--accent-pink, #ec4899);
  --s-mono: "JetBrains Mono", ui-monospace, monospace;

  display: grid;
  grid-template-columns: minmax(320px, 400px) minmax(0, 1fr);
  grid-template-areas:
    "header header"
    "controls map"
    "result map"
    "comparison comparison";
  gap: 20px;
  align-items: start;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: var(--s-text);
}

.simulator-view > * { min-width: 0; }

.simulator-header { grid-area: header; display: flex; flex-direction: column; gap: 16px; }
.sim-controls { grid-area: controls; }
.sim-map { grid-area: map; }
.sim-result,
.sim-error { grid-area: result; }
.sim-comparison { grid-area: comparison; }

/* ===== Header ===== */
.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  min-height: 36px;
  font-family: var(--s-mono);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--s-muted) !important;
  text-decoration: none !important;
  transition: color 0.2s ease;
}
.back-link:hover { color: var(--s-accent) !important; }

.kicker-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.kicker-line {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, var(--s-pink), var(--s-green));
}
.kicker-text {
  font-family: var(--s-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--s-accent);
}
.simulator-title h1 {
  margin: 0 0 12px;
  font-size: clamp(1.7rem, 5vw, 2.8rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 800;
}
.simulator-title .lead {
  margin: 0;
  max-width: 62ch;
  font-size: clamp(0.92rem, 2.4vw, 1.04rem);
  line-height: 1.6;
  color: var(--s-muted);
}

/* ===== Paneles ===== */
.sim-panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(16px, 3vw, 24px);
  border: 1px solid var(--s-border);
  border-radius: 14px;
  background: var(--s-surface);
  backdrop-filter: blur(10px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px rgba(0, 0, 0, 0.05);
}
.sim-panel h3 {
  margin: 4px 0 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}
.mono-tag {
  display: inline-block;
  font-family: var(--s-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--s-accent);
}
.mono-pill {
  font-family: var(--s-mono);
  font-size: 0.66rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 999px;
  background: var(--s-bg);
  color: var(--s-green);
  border: 1px solid var(--s-border);
  white-space: nowrap;
}

/* ===== Mensaje inicial ===== */
.sim-hint { align-items: flex-start; }
.sim-hint p { margin: 0; color: var(--s-muted); line-height: 1.55; }

/* ===== Controles ===== */
.controls-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--s-border);
}
.active-route-pill {
  max-width: 100%;
  font-family: var(--s-mono);
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.4;
  padding: 6px 10px;
  border-radius: 8px;
  background: var(--s-bg);
  border: 1px solid var(--s-border);
  color: var(--s-green);
  overflow-wrap: anywhere;
}

.select-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
.select-grid label,
.scenario-row { display: flex; flex-direction: column; gap: 8px; }

.select-grid label > span,
.control-label {
  font-family: var(--s-mono);
  color: var(--s-muted);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.select-grid select {
  width: 100%;
  height: 46px;
  padding: 0 12px;
  font-size: 16px; /* evita zoom en iOS */
  border: 1px solid var(--s-border);
  border-radius: 10px;
  outline: none;
  background: var(--s-bg);
  color: var(--s-text);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}
.select-grid select:focus {
  border-color: var(--s-accent);
  box-shadow: 0 0 0 3px var(--s-accent-soft);
}

.controls-bottom { display: flex; flex-direction: column; gap: 16px; }

.scenario-buttons { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.scenario-buttons button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-height: 46px;
  padding: 6px;
  border: 1px solid var(--s-border);
  border-radius: 10px;
  background: var(--s-bg);
  color: var(--s-muted);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.82rem;
  transition: 160ms ease;
}
.scenario-buttons button:hover { color: var(--s-text); border-color: var(--s-accent); }
.scenario-buttons button.active {
  border-color: var(--s-accent);
  background: var(--s-accent-soft);
  color: var(--s-text);
}
.btn-code {
  font-family: var(--s-mono);
  font-size: 0.62rem;
  letter-spacing: 0.06em;
  color: var(--s-accent);
}
.scenario-buttons button.active .btn-code { color: var(--s-green); }

/* ===== Fila de acciones (Limpiar + Calcular) ===== */
.action-row {
  display: flex;
  gap: 10px;
  align-items: stretch;
}

.clear-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 18px;
  border: 1px solid var(--s-border);
  border-radius: 10px;
  background: var(--s-bg);
  color: var(--s-muted);
  cursor: pointer;
  font-weight: 700;
  font-size: 0.88rem;
  flex: 0 0 auto;
  white-space: nowrap;
  transition: 160ms ease;
}
.clear-button:hover {
  border-color: var(--s-pink);
  color: var(--s-pink);
}
.clear-button:active {
  transform: translateY(1px);
}

.calculate-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  width: 100%;
  min-height: 48px;
  padding: 0 22px;
  border: 0;
  border-radius: 10px;
  background: var(--s-accent);
  color: #fff;
  cursor: pointer;
  font-weight: 700;
  font-size: 0.92rem;
  flex: 1 1 auto;
  transition: transform 160ms ease, filter 160ms ease;
}
.calculate-button:hover { transform: translateY(-1px); filter: brightness(1.1); }
.calculate-button:active { transform: translateY(0); }

/* ===== Mapa (solo el contenedor; MapaRutas no se toca) ===== */
.map-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.map-frame {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--s-border);
  background: var(--s-bg);
}
.map-frame :deep(svg),
.map-frame :deep(canvas),
.map-frame :deep(img) {
  max-width: 100%;
  height: auto;
}
.repeat-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 38px;
  padding: 0 14px;
  border: 1px solid var(--s-border);
  border-radius: 10px;
  background: var(--s-bg);
  color: var(--s-text);
  cursor: pointer;
  font-family: var(--s-mono);
  font-size: 0.72rem;
  font-weight: 700;
  transition: 160ms ease;
}
.repeat-button:hover { border-color: var(--s-green); color: var(--s-green); }

/* ===== Error ===== */
.sim-error {
  border-color: rgba(236, 72, 153, 0.45);
  background: rgba(236, 72, 153, 0.07);
}
.error-code {
  font-family: var(--s-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--s-pink);
}
.sim-error p { margin: 0; color: var(--s-muted); line-height: 1.5; }

/* ===== Resultado ===== */
.sim-result { border-top: 3px solid var(--s-green); }

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--s-border);
}
.total-time {
  font-family: var(--s-mono);
  color: var(--s-green);
  font-size: clamp(1.5rem, 6vw, 2.1rem);
  font-weight: 700;
  white-space: nowrap;
}

.route-steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.route-steps li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  background: var(--s-bg);
  border: 1px solid var(--s-border);
  border-left: 3px solid var(--s-muted);
}
.route-steps li.step-teleferico { border-left-color: var(--s-accent); }
.route-steps li.step-fila { border-left-color: var(--s-pink); }
.route-steps li.step-caminata { border-left-color: var(--s-green); }
.route-steps li.step-minibus { border-left-color: #38bdf8; }

.step-index {
  flex: 0 0 auto;
  font-family: var(--s-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--s-accent-soft);
  color: var(--s-accent);
}
.step-content { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.step-tag {
  font-family: var(--s-mono);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--s-muted);
}
.step-teleferico .step-tag { color: var(--s-accent); }
.step-fila .step-tag { color: var(--s-pink); }
.step-caminata .step-tag { color: var(--s-green); }
.step-minibus .step-tag { color: #38bdf8; }

.route-steps p {
  margin: 0;
  color: var(--s-text);
  font-size: 0.9rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

/* ===== Traza Dijkstra ===== */
.algorithm-trace { padding-top: 14px; border-top: 1px solid var(--s-border); }
.algorithm-trace summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 6px 12px;
  cursor: pointer;
  color: var(--s-text);
  font-weight: 700;
  font-size: 0.9rem;
}
.algorithm-trace summary small {
  color: var(--s-muted);
  font-family: var(--s-mono);
  font-size: 0.7rem;
  font-weight: 400;
}
.trace-intro { margin: 12px 0; font-size: 0.84rem; color: var(--s-muted); line-height: 1.55; }

.trace-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 420px;
  overflow-y: auto;
  margin: 0;
  padding: 0 6px 0 0;
  list-style: none;
}
.trace-list > li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--s-border);
  border-radius: 10px;
  background: var(--s-bg);
}
.trace-index {
  flex: 0 0 auto;
  padding: 3px 7px;
  border-radius: 5px;
  background: var(--s-accent-soft);
  color: var(--s-accent);
  font-family: var(--s-mono);
  font-size: 0.68rem;
  font-weight: 700;
}
.trace-content { min-width: 0; }
.trace-content p { margin: 0; color: var(--s-text); font-size: 0.86rem; overflow-wrap: anywhere; }
.trace-content ul {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 8px 0 0;
  padding-left: 18px;
  color: var(--s-muted);
  font-size: 0.8rem;
  overflow-wrap: anywhere;
}
.trace-content > small {
  display: inline-block;
  margin-top: 6px;
  color: var(--s-muted);
  font-size: 0.76rem;
}

/* ===== Comparación ===== */
.comparison-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}
.comparison-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 14px;
  border: 1px solid var(--s-border);
  border-radius: 12px;
  background: var(--s-bg);
  transition: border-color 160ms ease, background-color 160ms ease;
}
.comparison-item.selected {
  border-color: var(--s-green);
  background: var(--s-accent-soft);
}
.item-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.item-top span { font-weight: 700; font-size: 0.88rem; color: var(--s-text); }
.item-code { font-family: var(--s-mono); font-size: 0.64rem; color: var(--s-muted); }
.comparison-item strong { font-family: var(--s-mono); color: var(--s-green); font-size: 1.3rem; }
.item-status {
  font-family: var(--s-mono);
  color: var(--s-muted);
  font-size: 0.72rem;
  line-height: 1.35;
}

/* ===== Tablet y celular ===== */
@media (max-width: 1023px) {
  .simulator-view {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas:
      "header"
      "controls"
      "map"
      "result"
      "comparison";
    gap: 16px;
  }
}

@media (min-width: 600px) and (max-width: 1023px) {
  .select-grid { grid-template-columns: 1fr 1fr; }
  .controls-bottom { flex-direction: row; align-items: flex-end; justify-content: space-between; }
  .scenario-row { flex: 1; }
  .action-row { flex: 0 0 auto; }
  .clear-button { min-width: 120px; }
  .calculate-button { width: auto; min-width: 180px; }
}

@media (max-width: 420px) {
  .scenario-buttons button { font-size: 0.76rem; }
  .result-header { flex-direction: column; align-items: flex-start; }
  .trace-list { max-height: 340px; }
  .action-row { flex-direction: column-reverse; }
  .clear-button { width: 100%; }
}
</style>