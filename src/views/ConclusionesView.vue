<script setup>
const scenarioRows = [
  {
    scenario: 'Normal',
    cable: 'Flujo estable; fila moderada al abordar',
    minibus: 'Circula con tiempos base en minutos',
    optimalRule: 'Balance entre tiempo directo y transbordos',
    badgeClass: 'badge-normal',
  },
  {
    scenario: 'Hora pico',
    cable: 'Mayor fila al subir a líneas concurridas',
    minibus: 'Aumenta el tiempo por congestión vial',
    optimalRule: 'Suele favorecer líneas de cable y caminar tramos cortos',
    badgeClass: 'badge-peak',
  },
  {
    scenario: 'Paro / Bloqueo',
    cable: 'Opera como alternativa clave cuando hay vías cerradas',
    minibus: 'Sin circulación (tramos inhabilitados)',
    optimalRule: 'Prioriza teleférico y caminata entre puntos habilitados',
    badgeClass: 'badge-strike',
  },
]

const conclusions = [
  {
    code: 'CONCL · 01',
    title: '¿Puede llevarse a la vida real?',
    accent: '#22c55e',
    text: 'Sí, como base de apoyo a la decisión o prototipo urbano, siempre que los tiempos de fila, tráfico y bloqueos se alimenten con datos reales y actualizados de la ciudad.',
  },
  {
    code: 'CONCL · 02',
    title: 'Cambios entre Normal, Hora pico y Paro',
    accent: '#9b72e8',
    text: 'Al mantener el mismo grafo y modificar solo los pesos en minutos, la ruta óptima cambia cuando suben las filas o cuando los minibuses dejan de circular en un paro.',
  },
  {
    code: 'CONCL · 03',
    title: 'Limitaciones del modelo',
    accent: '#ec4899',
    text: 'Usa tiempos estimados estáticos por escenario (no tráfico en tiempo real minuto a minuto) y simplifica las transiciones multimodales sobre las 26 estaciones y 6 puntos clave.',
  },
  {
    code: 'CONCL · 04',
    title: 'Trabajo futuro',
    accent: '#38bdf8',
    text: 'Integrar datos de tráfico en vivo, afinar los tiempos y conexiones aún estimados (como Alto Obrajes → UCB o Libertador → UCB) y ampliar la red a más zonas de La Paz y El Alto.',
  },
]
</script>

<template>
  <section class="view conclusions-view">

    <!-- HEADING -->
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">06 · SÍNTESIS Y COMPARATIVA</span>
      </div>
      <h1>Conclusiones</h1>
      <p class="lead">
        Qué deja aplicar Dijkstra a la red de transporte modelada al contrastar teleférico,
        minibús y caminata bajo distintos escenarios de La Paz.
      </p>
    </header>

    <!-- TABLA COMPARATIVA -->
    <section class="scenario-section">
      <div class="block-head">
        <h2>Comparación de escenarios en el grafo</h2>
        <span class="mono-pill">MISMO GRAFO · DISTINTOS PESOS</span>
      </div>

      <p class="table-intro">
        La topología se conserva; cambiar de escenario ajusta los tiempos en minutos y
        recalcula qué camino minimiza el total.
      </p>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Escenario</th>
              <th>Teleférico y filas</th>
              <th>Minibús</th>
              <th>Comportamiento de la ruta óptima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in scenarioRows" :key="row.scenario">
              <td>
                <span :class="['scenario-badge', row.badgeClass]">{{ row.scenario }}</span>
              </td>
              <td>{{ row.cable }}</td>
              <td>{{ row.minibus }}</td>
              <td class="mono-note">{{ row.optimalRule }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 4 BLOQUES DE CONCLUSIÓN -->
    <section class="conclusions-section">
      <div class="block-head">
        <h2>Hallazgos principales</h2>
        <span class="mono-pill">SÍNTESIS</span>
      </div>

      <div class="conclusions-grid">
        <article v-for="item in conclusions" :key="item.code" class="conc-item">
          <div class="conc-top">
            <span class="conc-code" :style="{ color: item.accent }">{{ item.code }}</span>
            <span class="conc-dot" :style="{ background: item.accent }"></span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="closing-section">
      <div class="closing-line"></div>
      <p class="closing-text">
        <strong>LaderaFlow</strong> demuestra que el mismo grafo, con distintos pesos en minutos,
        produce decisiones de viaje completamente distintas. La movilidad paceña no se resuelve
        con distancias: se resuelve entendiendo el tiempo.
      </p>
      <RouterLink class="closing-link" to="/aplicacion/simulador">
        <span>Volver al simulador</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </RouterLink>
    </section>

  </section>
</template>

<style scoped>
/* ============================================================
   RESET DEL CONTENEDOR DE LA VISTA
   ============================================================ */
.conclusions-view {
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 5vw, 60px);
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

/* ============ HEADING ============ */
.kicker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.kicker-line {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-green));
}

.kicker-text {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-solid);
}

.section-heading h1 {
  font-size: clamp(2rem, 4.2vw, 3.1rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin: 0 0 16px;
  font-weight: 800;
  color: var(--text-primary);
}

.section-heading .lead {
  font-size: clamp(0.98rem, 1.1vw, 1.06rem);
  line-height: 1.65;
  max-width: 64ch;
  color: var(--text-secondary);
  margin: 0;
}

.section-heading code,
.table-intro code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  padding: 2px 6px;
  border-radius: 4px;
  background: var(--accent-soft-bg);
  color: var(--accent-green);
}

/* ============ BLOCK HEAD ============ */
.block-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
}

.block-head h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

.mono-pill {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  background: var(--bg-surface-2);
  color: var(--accent-green);
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

/* ============ TABLA DE ESCENARIOS ============ */
.scenario-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.table-intro {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 72ch;
  margin: 0;
}

.table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--border-color);
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 720px;
}

.table-wrap thead th {
  text-align: left;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  padding: 12px 10px;
  border-bottom: 1px solid var(--border-color);
}

.table-wrap thead th:first-child {
  padding-left: 0;
}

.table-wrap tbody td {
  padding: 14px 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  line-height: 1.55;
  vertical-align: top;
}

.table-wrap tbody tr:last-child td {
  border-bottom: none;
}

.table-wrap tbody td:first-child {
  padding-left: 0;
}

.scenario-badge {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
}

.badge-normal {
  background: rgba(34, 197, 94, 0.14);
  color: var(--accent-green);
}

.badge-peak {
  background: rgba(155, 114, 232, 0.16);
  color: var(--accent-solid);
}

.badge-strike {
  background: rgba(236, 72, 153, 0.14);
  color: var(--accent-pink);
}

.mono-note {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  color: var(--text-primary) !important;
}

/* ============ CONCLUSIONES (columnas, sin cards) ============ */
.conclusions-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.conclusions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0 40px;
}

.conc-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.conc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.conc-code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.conc-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
}

.conc-item h3 {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.3;
  color: var(--text-primary);
}

.conc-item p {
  margin: 0;
  font-size: 0.89rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

/* ============ CIERRE ============ */
.closing-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.closing-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent-solid), var(--accent-green));
}

.closing-text {
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  line-height: 1.55;
  font-weight: 500;
  color: var(--text-primary);
  max-width: 66ch;
  margin: 0;
}

.closing-text strong {
  font-weight: 800;
  color: var(--accent-solid);
}

.closing-link {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 12px 22px;
  border: 1px solid var(--accent-solid);
  border-radius: 8px;
  background: transparent;
  color: var(--accent-solid) !important;
  text-decoration: none !important;
  font-size: 0.9rem;
  font-weight: 700;
  transition: background 160ms ease, color 160ms ease;
}

.closing-link:hover {
  background: var(--accent-solid);
  color: #ffffff !important;
}

.closing-link svg {
  transition: transform 200ms ease;
}

.closing-link:hover svg {
  transform: translateX(3px);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 900px) {
  .conclusions-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .closing-link {
    width: 100%;
    justify-content: center;
  }
}
</style>