<script setup>
const factors = [
  {
    code: 'FACTOR 01',
    title: 'Filas en el teleférico',
    metric: '+wait al abordar',
    accent: '#9b72e8',
    text: 'Subir a una estación implica tiempo de espera en fila. En el grafo, este costo se suma únicamente al iniciar o cambiar de línea, nunca mientras continúas dentro de la misma.',
  },
  {
    code: 'FACTOR 02',
    title: 'Congestión en hora pico',
    metric: '× pesos minibús',
    accent: '#ec4899',
    text: 'El embotellamiento en rutas troncales (Ceja, Centro, Miraflores y accesos a Zona Sur) multiplica los minutos de traslado vehicular frente al flujo normal.',
  },
  {
    code: 'FACTOR 03',
    title: 'Paros y bloqueos viales',
    metric: 'minibús = ∞',
    accent: '#22c55e',
    text: 'Cuando hay bloqueo, los minibuses dejan de circular. El algoritmo invalida esos tramos y obliga a reorganizar el viaje combinando cable y caminata.',
  },
]
</script>

<template>
  <section class="view problem-view">
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">02 · DIAGNÓSTICO DE MOVILIDAD</span>
      </div>
      <h1>Por qué la distancia engaña en La Paz</h1>
      <p class="lead">
        Un mapa plano sugiere que la línea recta es la mejor opción, pero en la hoyada
        paceña el costo real se mide en <strong>minutos acumulados</strong>, no en kilómetros.
      </p>
    </header>

    <!-- Bloque comparativo: Distancia geométrica vs Costo en tiempo -->
    <article class="card comparison-banner">
      <div class="comparison-copy">
        <span class="mono-tag">PARADOJA DE RUTEO</span>
        <h2>Camino corto ≠ Camino más rápido</h2>
        <p>
          Dos puntos cercanos por avenida pueden quedar aislados por un bloqueo o una
          trancadera, mientras que un recorrido más largo en teleférico —con varios
          transbordos— mantiene un tiempo estable. Por eso <strong>LaderaFlow</strong>
          pondera cada arista en minutos y adapta los pesos según el escenario activo.
        </p>
      </div>

      <!-- Mini gráfico SVG comparativo -->
      <div class="comparison-visual" aria-hidden="true">
        <svg viewBox="0 0 340 165" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Ruta A: Directa pero lenta -->
          <text x="14" y="24" fill="#ec4899" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">
            RUTA DIRECTA (MINIBÚS EN HORA PICO)
          </text>
          <line x1="16" y1="42" x2="255" y2="42" stroke="#ec4899" stroke-width="5" stroke-linecap="round" />
          <line x1="255" y1="42" x2="324" y2="42" stroke="#ec4899" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round" />
          <text x="16" y="62" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="10">
            4.2 km · 48 min (tráfico + desvío)
          </text>

          <line x1="14" y1="82" x2="326" y2="82" stroke="currentColor" stroke-opacity="0.1" stroke-width="1" />

          <!-- Ruta B: Más larga pero óptima -->
          <text x="14" y="106" fill="#22c55e" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700">
            RUTA DIJKSTRA (TELEFÉRICO + CAMINATA)
          </text>
          <line x1="16" y1="124" x2="152" y2="124" stroke="#22c55e" stroke-width="5" stroke-linecap="round" />
          <line x1="152" y1="124" x2="324" y2="124" stroke="#22c55e" stroke-opacity="0.22" stroke-width="5" stroke-linecap="round" />
          <text x="16" y="144" fill="#b5b0c4" font-family="JetBrains Mono, monospace" font-size="10">
            6.8 km · 24 min (fila inicial + cable)
          </text>
        </svg>
      </div>
    </article>

    <!-- 3 factores clave -->
    <div class="factor-grid">
      <article v-for="(factor, idx) in factors" :key="factor.title" class="card factor-card">
        <div class="factor-top">
          <span class="factor-code">{{ factor.code }}</span>
          <span class="factor-metric" :style="{ color: factor.accent }">
            {{ factor.metric }}
          </span>
        </div>

        <!-- Ícono SVG técnico único por tarjeta -->
        <div class="factor-icon" :style="{ color: factor.accent }" aria-hidden="true">
          <!-- 0: Filas / Reloj + nodos -->
          <svg v-if="idx === 0" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- 1: Hora pico / Pulso tráfico -->
          <svg v-else-if="idx === 1" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <path d="M3 16h4l3-8 4 11 3-6h4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <!-- 2: Paro / Ruta bloqueada y desvío -->
          <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">
            <circle cx="6" cy="18" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <path d="M8.5 18H13a3 3 0 0 0 3-3V8.5" stroke-linecap="round" />
            <path d="M9 5l4 4M13 5L9 9" stroke-linecap="round" />
          </svg>
        </div>

        <h2>{{ factor.title }}</h2>
        <p>{{ factor.text }}</p>
      </article>
    </div>
  </section>
</template>

<style scoped>
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

.comparison-banner {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  align-items: center;
  gap: 28px;
}

.mono-tag {
  display: inline-block;
  margin-bottom: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-pink);
}

.comparison-visual {
  border-radius: 14px;
  border: 1px solid var(--border-color);
  background: var(--bg-body);
  padding: 14px 16px;
  color: var(--text-primary);
}

.comparison-visual svg {
  width: 100%;
  height: auto;
  display: block;
}

.factor-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.factor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.factor-code,
.factor-metric {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
}

.factor-code {
  color: var(--text-secondary);
}

.factor-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
}

.factor-card h2 {
  margin: 0;
  color: var(--text-primary);
}

@media (max-width: 900px) {
  .comparison-banner {
    grid-template-columns: 1fr;
  }
}
</style>