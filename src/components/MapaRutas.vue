<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import redLaPaz from '../data/redLaPaz.json'

const props = defineProps({
  ruta: {
    type: Array,
    default: () => []
  },
  repeatKey: {
    type: Number,
    default: 0
  }
})

const tramosActivos = ref(0)
const animacionActiva = ref(false)
let temporizadorAnimacion = null

// Índices rápidos para obtener las coordenadas de cada nodo por su id.
const estacionesPorId = computed(() => {
  return new Map(redLaPaz.estaciones.map(estacion => [estacion.id, estacion]))
})

const puntosPorId = computed(() => {
  return new Map(redLaPaz.puntosExtra.map(punto => [punto.id, punto]))
})

// Posiciona el nombre según el campo opcional "etiqueta".
// Sin etiqueta se conserva la posición original: a la derecha y arriba.
const posicionEtiqueta = nodo => {
  switch (nodo.etiqueta) {
    case 'arriba':
      return { x: nodo.x, y: nodo.y - 14, anchor: 'middle' }
    case 'abajo':
      return { x: nodo.x, y: nodo.y + 22, anchor: 'middle' }
    case 'izquierda':
      return { x: nodo.x - 11, y: nodo.y + 4, anchor: 'end' }
    case 'derecha':
      return { x: nodo.x + 11, y: nodo.y - 9, anchor: 'start' }
    default:
      return { x: nodo.x + 11, y: nodo.y - 9, anchor: 'start' }
  }
}

// Cuenta cuántas líneas comparten exactamente el mismo tramo.
const segmentosCompartidos = computed(() => {
  const cantidades = new Map()

  for (const linea of redLaPaz.lineas) {
    for (let i = 0; i < linea.estaciones.length - 1; i += 1) {
      const ids = [linea.estaciones[i], linea.estaciones[i + 1]].sort()
      const clave = `${ids[0]}|${ids[1]}`
      cantidades.set(clave, (cantidades.get(clave) || 0) + 1)
    }
  }

  return cantidades
})

// Convierte las coordenadas del JSON en coordenadas SVG.
const coordenadasEstacion = id => estacionesPorId.value.get(id)

// Calcula los tramos consecutivos de cada línea.
const segmentosLinea = computed(() => {
  const segmentos = []

  for (const linea of redLaPaz.lineas) {
    for (let i = 0; i < linea.estaciones.length - 1; i += 1) {
      const inicio = coordenadasEstacion(linea.estaciones[i])
      const fin = coordenadasEstacion(linea.estaciones[i + 1])

      if (!inicio || !fin) continue

      const clave = [inicio.id, fin.id].sort().join('|')
      const esCompartido = segmentosCompartidos.value.get(clave) > 1

      // Desplaza ambos trazos perpendicularmente unos 3 px cuando comparten tramo.
      let offsetX = 0
      let offsetY = 0

      if (esCompartido) {
        const dx = fin.x - inicio.x
        const dy = fin.y - inicio.y
        const longitud = Math.hypot(dx, dy) || 1
        const perpendicularX = -dy / longitud
        const perpendicularY = dx / longitud

        // Se usa el índice de la línea dentro del segmento para separar las líneas.
        const lineaIndex = redLaPaz.lineas
          .filter(item => item.estaciones.some((id, index) =>
            index < item.estaciones.length - 1 &&
            [item.estaciones[index], item.estaciones[index + 1]].sort().join('|') === clave
          ))
          .findIndex(item => item.id === linea.id)

        const separacion = lineaIndex % 2 === 0 ? -1.5 : 1.5
        offsetX = perpendicularX * separacion
        offsetY = perpendicularY * separacion
      }

      segmentos.push({
        key: `${linea.id}-${inicio.id}-${fin.id}`,
        linea,
        inicioId: inicio.id,
        finId: fin.id,
        x1: inicio.x + offsetX,
        y1: inicio.y + offsetY,
        x2: fin.x + offsetX,
        y2: fin.y + offsetY
      })
    }
  }

  return segmentos
})

// Une cada punto extra con las estaciones indicadas en "conexiones".
const conexionesPuntos = computed(() => {
  const conexiones = []

  for (const punto of redLaPaz.puntosExtra) {
    for (const conexion of punto.conexiones || []) {
      const estacion = estacionesPorId.value.get(conexion.con)
      if (!estacion) continue

      conexiones.push({
        key: `${punto.id}-${conexion.con}`,
        inicioId: punto.id,
        finId: conexion.con,
        x1: punto.x,
        y1: punto.y,
        x2: estacion.x,
        y2: estacion.y
      })
    }
  }

  return conexiones
})

// Une los destinos que usan el enlace de minibús definido en el JSON.
const conexionesEnlaces = computed(() => {
  return (redLaPaz.enlaces || []).flatMap(enlace => {
    const origen = estacionesPorId.value.get(enlace.de) || puntosPorId.value.get(enlace.de)
    const destino = estacionesPorId.value.get(enlace.a) || puntosPorId.value.get(enlace.a)

    if (!origen || !destino) return []

    return [{
      key: `${enlace.de}-${enlace.a}`,
      x1: origen.x,
      y1: origen.y,
      x2: destino.x,
      y2: destino.y
    }]
  })
})

// Convierte el camino interno de Dijkstra en una secuencia visible.
const secuenciaVisible = computed(() => {
  const secuencia = []

  for (const idInterno of props.ruta || []) {
    const idVisible = idInterno.split('|')[0]
    if (secuencia[secuencia.length - 1] !== idVisible) {
      secuencia.push(idVisible)
    }
  }

  return secuencia
})

const nodosRuta = computed(() => new Set(secuenciaVisible.value))

// Obtiene las coordenadas y el trazado existente para cada tramo visible.
const tramosRuta = computed(() => {
  const tramos = []

  for (let i = 0; i < secuenciaVisible.value.length - 1; i += 1) {
    const origenId = secuenciaVisible.value[i]
    const destinoId = secuenciaVisible.value[i + 1]

    const segmentoLinea = segmentosLinea.value.find(segmento =>
      (segmento.inicioId === origenId && segmento.finId === destinoId) ||
      (segmento.inicioId === destinoId && segmento.finId === origenId)
    )

    if (segmentoLinea) {
      const avanzaAlReves = segmentoLinea.inicioId === destinoId
      tramos.push({
        key: `${origenId}-${destinoId}-${i}`,
        x1: avanzaAlReves ? segmentoLinea.x2 : segmentoLinea.x1,
        y1: avanzaAlReves ? segmentoLinea.y2 : segmentoLinea.y1,
        x2: avanzaAlReves ? segmentoLinea.x1 : segmentoLinea.x2,
        y2: avanzaAlReves ? segmentoLinea.y1 : segmentoLinea.y2
      })
      continue
    }

    const conexionPunto = conexionesPuntos.value.find(conexion =>
      (conexion.inicioId === origenId && conexion.finId === destinoId) ||
      (conexion.inicioId === destinoId && conexion.finId === origenId)
    )

    if (conexionPunto) {
      tramos.push({
        key: `${origenId}-${destinoId}-${i}`,
        x1: origenId === conexionPunto.inicioId ? conexionPunto.x1 : conexionPunto.x2,
        y1: origenId === conexionPunto.inicioId ? conexionPunto.y1 : conexionPunto.y2,
        x2: destinoId === conexionPunto.finId ? conexionPunto.x2 : conexionPunto.x1,
        y2: destinoId === conexionPunto.finId ? conexionPunto.y2 : conexionPunto.y1
      })
      continue
    }

    const conexionEnlace = conexionesEnlaces.value.find(conexion =>
      (conexion.key === `${origenId}-${destinoId}`) ||
      (conexion.key === `${destinoId}-${origenId}`)
    )

    if (conexionEnlace) {
      const avanzaAlReves = conexionEnlace.key === `${destinoId}-${origenId}`
      tramos.push({
        key: `${origenId}-${destinoId}-${i}`,
        x1: avanzaAlReves ? conexionEnlace.x2 : conexionEnlace.x1,
        y1: avanzaAlReves ? conexionEnlace.y2 : conexionEnlace.y1,
        x2: avanzaAlReves ? conexionEnlace.x1 : conexionEnlace.x2,
        y2: avanzaAlReves ? conexionEnlace.y1 : conexionEnlace.y2
      })
    }
  }

  return tramos
})

const reiniciarAnimacion = () => {
  if (temporizadorAnimacion) {
    clearInterval(temporizadorAnimacion)
    temporizadorAnimacion = null
  }

  tramosActivos.value = 0
  animacionActiva.value = tramosRuta.value.length > 0

  if (!animacionActiva.value) return

  // El primer tramo aparece de inmediato y los siguientes cada 600 ms.
  tramosActivos.value = 1

  temporizadorAnimacion = setInterval(() => {
    if (tramosActivos.value < tramosRuta.value.length) {
      tramosActivos.value += 1
    } else {
      clearInterval(temporizadorAnimacion)
      temporizadorAnimacion = null
    }
  }, 600)
}

watch(
  [() => props.ruta, () => props.repeatKey],
  reiniciarAnimacion,
  { immediate: true, deep: true }
)

onBeforeUnmount(() => {
  if (temporizadorAnimacion) clearInterval(temporizadorAnimacion)
})
</script>

<template>
  <article class="map-card" aria-label="Mapa estático de la red de La Paz">
    <div class="map-scroll">
      <svg
        class="network-map"
        :class="{ 'has-route': animacionActiva }"
        viewBox="0 0 1050 650"
        width="100%"
        min-width="1050"
        role="img"
        aria-label="Red de teleférico y conexiones de La Paz"
      >
        <!-- Capa decorativa de fondo: dibujada antes de rutas y estaciones -->
        <defs>
          <linearGradient id="map-background-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :style="{ stopColor: 'var(--bg-surface)' }" />
            <stop offset="55%" :style="{ stopColor: 'var(--accent-solid)', stopOpacity: 0.035 }" />
            <stop offset="100%" :style="{ stopColor: 'var(--bg-surface)', stopOpacity: 0.96 }" />
          </linearGradient>
        </defs>

        <g class="map-decoration" pointer-events="none" aria-hidden="true">
          <rect width="1050" height="650" fill="url(#map-background-gradient)" />

          <!-- Curvas suaves que sugieren las laderas de La Paz -->
          <path d="M 20 100 C 180 145, 330 170, 470 260 S 760 410, 1030 520" />
          <path d="M 20 170 C 170 210, 330 235, 500 320 S 790 470, 1030 580" />
          <path d="M 20 240 C 190 270, 360 300, 540 380 S 820 525, 1030 620" />
          <path d="M 20 310 C 210 330, 390 365, 570 430 S 860 560, 1030 640" />
          <path d="M 70 40 C 250 95, 390 130, 540 210 S 800 350, 1000 430" />

          <g class="zone-label" text-anchor="middle">
            <text x="120" y="110" class="zone-name">EL ALTO</text>
            <text x="120" y="128" class="zone-height">~4.000 m s. n. m.</text>

            <text x="600" y="360" class="zone-name">CENTRO</text>
            <text x="600" y="378" class="zone-height">~3.600 m</text>

            <text x="800" y="610" class="zone-name">ZONA SUR</text>
            <text x="800" y="628" class="zone-height">~3.300 m</text>
          </g>
        </g>

        <!-- Conexiones de puntos extra a estaciones -->
        <g class="extra-connections" aria-hidden="true">
          <line
            v-for="conexion in conexionesPuntos"
            :key="conexion.key"
            :x1="conexion.x1"
            :y1="conexion.y1"
            :x2="conexion.x2"
            :y2="conexion.y2"
          />
        </g>

        <!-- Conexiones especiales de minibús -->
        <g class="link-connections" aria-hidden="true">
          <line
            v-for="conexion in conexionesEnlaces"
            :key="conexion.key"
            :x1="conexion.x1"
            :y1="conexion.y1"
            :x2="conexion.x2"
            :y2="conexion.y2"
          />
        </g>

        <!-- Líneas de teleférico -->
        <g class="line-segments" aria-hidden="true">
          <line
            v-for="segmento in segmentosLinea"
            :key="segmento.key"
            :x1="segmento.x1"
            :y1="segmento.y1"
            :x2="segmento.x2"
            :y2="segmento.y2"
            :stroke="segmento.linea.color"
          />
        </g>

        <!-- El camino óptimo se dibuja encima, tramo por tramo -->
        <g v-if="animacionActiva" class="route-animation" aria-hidden="true">
          <g
            v-for="(tramo, index) in tramosRuta.slice(0, tramosActivos)"
            :key="`glow-${tramo.key}`"
          >
            <line
              class="route-glow"
              :x1="tramo.x1"
              :y1="tramo.y1"
              :x2="tramo.x2"
              :y2="tramo.y2"
            />
            <line
              class="route-dash"
              :x1="tramo.x1"
              :y1="tramo.y1"
              :x2="tramo.x2"
              :y2="tramo.y2"
              :style="{ animationDelay: `${index * 80}ms` }"
            />
          </g>
        </g>

        <!-- Estaciones visibles del teleférico -->
        <g
          v-for="estacion in redLaPaz.estaciones"
          :key="estacion.id"
          class="station"
          :class="{ 'route-node': nodosRuta.has(estacion.id) && animacionActiva }"
          :data-id="estacion.id"
        >
          <circle :cx="estacion.x" :cy="estacion.y" r="7" />
          <text
            :x="posicionEtiqueta(estacion).x"
            :y="posicionEtiqueta(estacion).y"
            :text-anchor="posicionEtiqueta(estacion).anchor"
          >
            {{ estacion.nombre }}
          </text>
        </g>

        <!-- Puntos extra con forma cuadrada y redondeada -->
        <g
          v-for="punto in redLaPaz.puntosExtra"
          :key="punto.id"
          class="extra-point"
          :class="{ 'route-node': nodosRuta.has(punto.id) && animacionActiva }"
          :data-id="punto.id"
        >
          <rect
            :x="punto.x - 7"
            :y="punto.y - 7"
            width="14"
            height="14"
            rx="3"
          />
          <text
            :x="posicionEtiqueta(punto).x"
            :y="posicionEtiqueta(punto).y"
            :text-anchor="posicionEtiqueta(punto).anchor"
          >
            {{ punto.nombre }}
          </text>
        </g>
      </svg>
    </div>

    <!-- Leyenda compacta -->
    <div class="map-legend" aria-label="Leyenda del mapa">
      <span
        v-for="linea in redLaPaz.lineas"
        :key="linea.id"
        class="legend-item"
      >
        <i :style="{ backgroundColor: linea.color }"></i>
        {{ linea.nombre }}
      </span>
      <span class="legend-item">
        <i class="legend-extra-point"></i>
        Punto de la ciudad
      </span>
      <span class="legend-item">
        <i class="legend-dashed"></i>
        Conexión a pie o minibús
      </span>
    </div>
  </article>
</template>

<style scoped>
.map-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 18px;
  background: var(--bg-surface);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.map-scroll {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--bg-surface);
  scrollbar-color: var(--accent-solid) var(--bg-surface-2);
}

.network-map {
  display: block;
  min-width: 1050px;
  height: auto;
  background:
    radial-gradient(circle at 50% 45%, rgba(155, 114, 232, 0.06), transparent 360px),
    var(--bg-surface);
}

/* Decoración visual tenue, sin interferir con rutas ni estaciones. */
.map-decoration path {
  fill: none;
  stroke: var(--text-secondary);
  stroke-width: 1;
  stroke-dasharray: 5 9;
  opacity: 0.08;
}

.zone-name {
  fill: var(--text-secondary);
  opacity: 0.12;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: 8px;
  pointer-events: none;
}

.zone-height {
  fill: var(--text-secondary);
  opacity: 0.12;
  font-size: 10px;
  letter-spacing: 1.5px;
  pointer-events: none;
}

.line-segments line {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.extra-connections line,
.link-connections line {
  fill: none;
  stroke: var(--text-secondary);
  stroke-width: 2;
  stroke-dasharray: 7 7;
  opacity: 0.75;
}

.station circle {
  fill: var(--bg-surface);
  stroke: var(--text-primary);
  stroke-width: 3;
}

.station text,
.extra-point text {
  fill: var(--text-primary);
  stroke: var(--bg-surface);
  stroke-width: 3;
  paint-order: stroke;
  font-size: 11px;
  font-weight: 700;
  pointer-events: none;
}

.extra-point rect {
  fill: var(--bg-surface-2);
  stroke: var(--text-secondary);
  stroke-width: 2;
}

/* Atenúa el resto del mapa mientras el camino óptimo está activo. */
.network-map.has-route .extra-connections,
.network-map.has-route .link-connections,
.network-map.has-route .line-segments,
.network-map.has-route .station:not(.route-node),
.network-map.has-route .extra-point:not(.route-node) {
  opacity: 0.35;
}

.route-glow {
  fill: none;
  stroke: #10b981;
  stroke-width: 14;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.55;
  filter: drop-shadow(0 0 7px #10b981);
}

.route-dash {
  fill: none;
  stroke: #34d399;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 18 10;
  animation: avanzar-trazo 600ms linear infinite;
}

@keyframes avanzar-trazo {
  from { stroke-dashoffset: 28; }
  to { stroke-dashoffset: 0; }
}

.station.route-node circle,
.extra-point.route-node rect {
  stroke: #34d399;
  stroke-width: 4;
  filter: drop-shadow(0 0 5px #10b981);
  transform-box: fill-box;
  transform-origin: center;
  animation: latido-nodo 900ms ease-in-out infinite;
}

@keyframes latido-nodo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.28); }
}

.map-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  padding-top: 14px;
  color: var(--text-secondary);
  font-size: 0.78rem;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.legend-item i {
  width: 18px;
  height: 5px;
  display: inline-block;
  border-radius: 999px;
}

.legend-item i.legend-extra-point {
  width: 10px;
  height: 10px;
  border: 2px solid var(--text-secondary);
  border-radius: 3px;
  background: var(--bg-surface-2);
}

.legend-item i.legend-dashed {
  height: 0;
  border-top: 2px dashed var(--text-secondary);
  border-radius: 0;
  background: transparent;
}

@media (max-width: 640px) {
  .map-card {
    padding: 10px;
  }
}
</style>
