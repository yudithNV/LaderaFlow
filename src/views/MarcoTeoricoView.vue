<script setup>
const steps = [
  {
    code: 'PASO 01',
    title: 'Inicializar distancias',
    text: 'Asignar costo 0 al nodo origen y ∞ (infinito) a los demás nodos del grafo.',
  },
  {
    code: 'PASO 02',
    title: 'Seleccionar el mínimo no visitado',
    text: 'Elegir el nodo pendiente con menor tiempo acumulado hasta el momento.',
  },
  {
    code: 'PASO 03',
    title: 'Relajar aristas vecinas',
    text: 'Si costo(actual) + peso(actual, vecino) < costo(vecino), actualizar distancia y predecesor.',
  },
  {
    code: 'PASO 04',
    title: 'Marcar visitado y avanzar',
    text: 'Fijar el nodo como visitado (su costo ya es óptimo) y repetir hasta completar la red.',
  },
]

const simulation = [
  {
    iter: 'Iteración 1',
    current: 'A',
    visited: 'A',
    distances: { A: '0', B: '4', C: '2', D: '∞', E: '∞' },
    updated: 'A → B (4) · A → C (2)',
  },
  {
    iter: 'Iteración 2',
    current: 'C',
    visited: 'A, C',
    distances: { A: '0', B: '3', C: '2', D: '10', E: '12' },
    updated: 'C → B (3) · C → D (10) · C → E (12)',
  },
  {
    iter: 'Iteración 3',
    current: 'B',
    visited: 'A, C, B',
    distances: { A: '0', B: '3', C: '2', D: '8', E: '10' },
    updated: 'B → D (8) · B → E (10)',
  },
  {
    iter: 'Iteración 4',
    current: 'D',
    visited: 'A, C, B, D',
    distances: { A: '0', B: '3', C: '2', D: '8', E: '10' },
    updated: 'D → E (sin mejora: 10 vs 10)',
  },
  {
    iter: 'Iteración 5',
    current: 'E',
    visited: 'A, C, B, D, E',
    distances: { A: '0', B: '3', C: '2', D: '8', E: '10' },
    updated: 'Sin vecinos pendientes · fin',
  },
]

const sampleRows = [
  { node: 'A', edges: 'B(4), C(2)', time: '0 min', path: 'A' },
  { node: 'B', edges: 'A(4), C(1), D(5)', time: '3 min', path: 'A → C → B' },
  { node: 'C', edges: 'A(2), B(1), D(8), E(10)', time: '2 min', path: 'A → C' },
  { node: 'D', edges: 'B(5), C(8), E(2)', time: '8 min', path: 'A → C → B → D' },
  { node: 'E', edges: 'C(10), D(2)', time: '10 min', path: 'A → C → B → D → E' },
]

// ── VIDEO REAL DE DIJKSTRA (freeCodeCamp) ──
const video = {
  id: 'n1VUnHD62r0',
  title: 'The 20 Minute Masterpiece: Dijkstra’s Algorithm',
  caption: 'Explicación de Dijkstra por freeCodeCamp.',
  url: 'https://www.youtube.com/watch?v=n1VUnHD62r0',
}

// ── IMÁGENES REALES DEL TELEFÉRICO (Wikimedia Commons) ──
const images = {
  hero: 'https://commons.wikimedia.org/wiki/Special:FilePath/Telef%C3%A9rico%20La%20Paz%20-%20El%20Alto.jpg?width=1280',
  heroAlt: 'Teleférico de La Paz y El Alto',

  gallery: [
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Teleferico%20de%20La%20Paz.jpg?width=1024',
      alt: 'Teleférico de La Paz',
      caption: 'Mi Teleférico · La Paz',
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/La%20Paz%20-%20telef%C3%A9rico%20Roja.jpg?width=1024',
      alt: 'Cabina de la Línea Roja',
      caption: 'Línea Roja',
    },
    {
      src: 'https://commons.wikimedia.org/wiki/Special:FilePath/Telef%C3%A9rico%20La%20Paz%20-%20El%20Alto%20Bolivia%2040.jpg?width=1024',
      alt: 'Teleférico La Paz - El Alto',
      caption: 'Red de transporte por cable',
    },
  ],
}

const relaxExample = {
  de: 'A',
  hacia: 'B',
  actualB: 4,
  viaC: 3,
  resultado: 'Se actualiza B de 4 a 3 porque 2 + 1 < 4',
}


// ── CONTENIDO COMPLEMENTARIO ──
const benefits = [
  {
    title: 'Optimiza los recorridos',
    text: 'Encuentra la ruta con menor tiempo o costo acumulado entre un punto de origen y los demás destinos.',
  },
  {
    title: 'Se adapta a distintos criterios',
    text: 'Los pesos pueden representar minutos, distancia, costo económico o una combinación definida para el estudio.',
  },
  {
    title: 'Permite reconstruir la ruta',
    text: 'Al guardar el nodo predecesor, se puede mostrar qué estaciones y conexiones forman el camino elegido.',
  },
  {
    title: 'Es eficiente en grafos grandes',
    text: 'Con una cola de prioridad, su complejidad temporal habitual es O((V + E) log V).',
  },
]

const applications = [
  {
    code: '01',
    title: 'Navegación y GPS',
    tag: 'RUTAS',
    text: 'Permite calcular caminos de menor costo entre ubicaciones, utilizando distancias o tiempos estimados.',
  },
  {
    code: '02',
    title: 'Redes informáticas',
    tag: 'OSPF',
    text: 'Se utiliza en protocolos de enrutamiento como OSPF para construir caminos de menor costo entre routers.',
  },
  {
    code: '03',
    title: 'Transporte público',
    tag: 'MOVILIDAD',
    text: 'Puede ayudar a combinar diferentes medios de transporte y encontrar recorridos con menor tiempo estimado.',
  },
  {
    code: '04',
    title: 'Robótica y videojuegos',
    tag: 'PATHFINDING',
    text: 'Ayuda a encontrar caminos de menor costo para el desplazamiento de robots o personajes en mapas representados como grafos.',
  },
]

const limitations = [
  'No funciona correctamente con aristas de peso negativo.',
  'La calidad de la ruta depende de que los tiempos, distancias y conexiones del grafo estén bien definidos.',
  'No predice por sí solo el tráfico ni los cambios futuros: necesita que los pesos se actualicen con datos nuevos.',
  'En redes muy grandes conviene utilizar estructuras eficientes, como una cola de prioridad.',
]

const references = [
  {
    title: 'A note on two problems in connexion with graphs (1959)',
    source: 'Artículo original de Edsger W. Dijkstra',
    url: 'https://doi.org/10.1007/BF01386390',
  },
  {
    title: 'Dijkstra’s Algorithm',
    source: 'Documentación oficial de NetworkX',
    url: 'https://networkx.org/documentation/stable/reference/algorithms/shortest_paths/dijkstra.html',
  },
  {
    title: 'RFC 2328 – OSPF Version 2',
    source: 'Internet Engineering Task Force (IETF)',
    url: 'https://datatracker.ietf.org/doc/html/rfc2328',
  },
]

</script>

<template>
  <section class="view theory-view">

    <!-- 1. HEADING -->
    <header class="section-heading">
      <div class="kicker-row">
        <span class="kicker-line"></span>
        <span class="kicker-text">04 · FUNDAMENTO ALGORÍTMICO</span>
      </div>
      <h1>Marco teórico: Dijkstra</h1>
      <p class="lead">
        Algoritmo clásico de caminos mínimos en grafos ponderados, aplicado aquí para
        minimizar el tiempo de viaje en minutos sobre la red de La Paz.
      </p>
    </header>

    <!-- 2. VIDEO REAL DE DIJKSTRA -->
    <figure class="media-figure">
      <div class="video-wrap">
        <iframe
          :src="`https://www.youtube-nocookie.com/embed/${video.id}`"
          :title="video.title"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
      <figcaption>
        <span class="caption-label">VIDEO</span>
        {{ video.caption }}
        <a :href="video.url" target="_blank" rel="noopener noreferrer" class="caption-link">
          Ver en YouTube →
        </a>
      </figcaption>
    </figure>

    <!-- 3. IMAGEN HERO DEL TELEFÉRICO -->
    <figure class="hero-media">
      <img
        :src="images.hero"
        :alt="images.heroAlt"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
      <figcaption>
        <span class="caption-label">IMAGEN</span>
        Red de teleférico urbano La Paz – El Alto, la más extensa del mundo.
        <span class="caption-credit">Wikimedia Commons · CC BY-SA</span>
      </figcaption>
    </figure>

    <!-- 4. LOS 3 PILARES -->
    <div class="pillars-row">
      <article class="pillar-col pillar-col--first">
        <span class="pillar-kicker">DEFINICIÓN</span>
        <h2>¿Qué es?</h2>
        <p>
          Encuentra el camino de menor costo acumulado desde un nodo origen hacia los demás
          nodos de un grafo conectado.
        </p>
      </article>

      <article class="pillar-col">
        <span class="pillar-kicker">APLICACIÓN</span>
        <h2>¿Para qué sirve?</h2>
        <p>
          Permite elegir rutas óptimas cuando cada tramo tiene un peso medible, como
          minutos de teleférico, minibús o caminata.
        </p>
      </article>

      <article class="pillar-col">
        <span class="pillar-kicker pillar-kicker--warning">RESTRICCIÓN</span>
        <h2>Pesos no negativos</h2>
        <p>
          Todos los costos de conexión deben ser <strong>≥ 0</strong>. En el proyecto, la
          fila se suma como costo adicional al subir a una línea, nunca restando tiempo.
        </p>
      </article>
    </div>


    <!-- 5. BENEFICIOS -->
    <section class="extra-section">
      <div class="block-head">
        <h2>Beneficios del algoritmo</h2>
        <span class="mono-pill">VENTAJAS</span>
      </div>
      <div class="benefits-grid">
        <article v-for="(item, i) in benefits" :key="item.title" class="benefit-item">
          <span class="extra-number">0{{ i + 1 }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <!-- 6. APLICACIONES -->
    <section class="extra-section">
      <div class="block-head">
        <h2>Aplicaciones en la vida real</h2>
        <span class="mono-pill">CASOS DE USO</span>
      </div>
      <div class="applications-grid">
        <article v-for="item in applications" :key="item.code" class="application-item">
          <div class="application-top">
            <span class="extra-number">{{ item.code }}</span>
            <span class="application-tag">{{ item.tag }}</span>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
        </article>
      </div>
    </section>

    <!-- 7. LIMITACIONES -->
    <section class="extra-section limitations-section">
      <div class="block-head">
        <h2>Limitaciones y consideraciones</h2>
        <span class="mono-pill">A TENER EN CUENTA</span>
      </div>
      <ul class="limitations-list">
        <li v-for="item in limitations" :key="item">{{ item }}</li>
      </ul>
    </section>

    <!-- 8. APLICACIÓN EN EL PROYECTO -->
    <section class="project-application">
      <span class="kicker-text">RELACIÓN CON EL PROYECTO</span>
      <h2>¿Cómo se aplica Dijkstra a la movilidad de La Paz?</h2>
      <p>
        En este estudio, cada estación del Teleférico y cada punto de conexión se
        representa como un <strong>nodo</strong>. Los desplazamientos entre ellos son
        las <strong>aristas</strong>, y cada arista tiene un peso que representa el
        tiempo estimado de viaje.
      </p>
      <div class="project-points">
        <div>
          <strong>Nodos</strong>
          <span>Estaciones y puntos importantes de la ciudad.</span>
        </div>
        <div>
          <strong>Aristas</strong>
          <span>Conexiones en teleférico, minibús o caminata.</span>
        </div>
        <div>
          <strong>Pesos</strong>
          <span>Minutos de recorrido y, cuando corresponda, tiempo de espera.</span>
        </div>
      </div>
      <p>
        Al modificar los pesos se pueden comparar escenarios como un día normal,
        hora pico o paro de transporte. En el escenario de paro, por ejemplo, las
        conexiones de minibús afectadas pueden deshabilitarse o marcarse como no
        disponibles. Dijkstra calcula la mejor ruta usando los datos definidos
        para cada escenario; no obtiene tráfico en tiempo real por sí mismo.
      </p>
    </section>

    <!-- 9. FUENTES -->
    <section class="extra-section references-section">
      <div class="block-head">
        <h2>Fuentes y referencias</h2>
        <span class="mono-pill">CONSULTA</span>
      </div>
      <ul class="references-list">
        <li v-for="ref in references" :key="ref.url">
          <div>
            <strong>{{ ref.title }}</strong>
            <span>{{ ref.source }}</span>
          </div>
          <a :href="ref.url" target="_blank" rel="noopener noreferrer">
            Consultar fuente ↗
          </a>
        </li>
      </ul>
    </section>

    <!-- 5. GALERÍA DE IMÁGENES DEL TELEFÉRICO -->
    <div class="gallery-section">
      <div class="gallery-head">
        <span class="kicker-text">REGISTRO VISUAL · RED DE CABLE</span>
      </div>
      <div class="gallery-grid">
        <figure v-for="(img, i) in images.gallery" :key="i" class="gallery-item">
          <img
            :src="img.src"
            :alt="img.alt"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <figcaption>{{ img.caption }}</figcaption>
        </figure>
      </div>
    </div>

    <!-- 6. PASOS DEL ALGORITMO -->
    <div class="steps-section">
      <div class="block-head">
        <h2>Funcionamiento paso a paso</h2>
        <span class="mono-pill">GREEDY · RELAJACIÓN</span>
      </div>
      <ol class="steps-list">
        <li v-for="step in steps" :key="step.code">
          <span class="step-badge">{{ step.code }}</span>
          <div class="step-body">
            <strong>{{ step.title }}</strong>
            <p>{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>

    <!-- 7. CÓMO SE CALCULA: SIMULACIÓN PASO A PASO -->
    <div class="calculation-section">
      <div class="calc-head">
        <span class="kicker-text">CÓMO SE CALCULA · SIMULACIÓN MANUAL</span>
        <h2>Ejecución de Dijkstra sobre 5 nodos (origen: A)</h2>
        <p class="calc-intro">
          Cada fila muestra el estado de las distancias mínimas conocidas hasta ese
          momento. El nodo <strong>actual</strong> es el no visitado con menor costo.
          Si un vecino puede alcanzarse más rápido a través del actual, se
          <strong>relaja</strong> su distancia.
        </p>
      </div>

      <div class="sim-table-wrap">
        <table class="sim-table">
          <thead>
            <tr>
              <th>Iteración</th>
              <th>Nodo actual</th>
              <th>Visitados</th>
              <th colspan="5">Distancias provisionales</th>
              <th>Relajación aplicada</th>
            </tr>
            <tr class="dist-header">
              <th></th>
              <th></th>
              <th></th>
              <th>A</th>
              <th>B</th>
              <th>C</th>
              <th>D</th>
              <th>E</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in simulation" :key="row.iter">
              <td class="cell-iter">{{ row.iter }}</td>
              <td><span class="node-badge">{{ row.current }}</span></td>
              <td class="cell-visited">{{ row.visited }}</td>
              <td class="cell-dist">{{ row.distances.A }}</td>
              <td class="cell-dist">{{ row.distances.B }}</td>
              <td class="cell-dist">{{ row.distances.C }}</td>
              <td class="cell-dist">{{ row.distances.D }}</td>
              <td class="cell-dist">{{ row.distances.E }}</td>
              <td class="cell-update">{{ row.updated }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="relax-example">
        <span class="relax-kicker">EJEMPLO DE RELAJACIÓN</span>
        <h3>¿Por qué B cambia de 4 a 3?</h3>
        <div class="relax-equation">
          <div class="eq-line">
            <span class="eq-label">Camino directo A → B</span>
            <span class="eq-value eq-value--old">4 min</span>
          </div>
          <div class="eq-line">
            <span class="eq-label">Camino vía C: A → C (2) + C → B (1)</span>
            <span class="eq-value eq-value--new">3 min</span>
          </div>
          <div class="eq-result">
            <span class="eq-op">3 &lt; 4</span>
            <span class="eq-action">→ se actualiza la distancia de B a 3</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. GRAFO + TABLA FINAL -->
    <div class="example-section">
      <div class="example-top">
        <div>
          <span class="kicker-text">RESULTADO FINAL</span>
          <h2>Distancias mínimas desde A</h2>
          <p class="table-intro">
            Al terminar, cada nodo tiene asignado el menor costo posible y la ruta que lo
            alcanza. Ir a <strong>B</strong> por <strong>C</strong> (3 min) es mejor que el
            tramo directo <strong>A → B</strong> (4 min).
          </p>
        </div>

        <div class="graph-mini" aria-hidden="true">
          <svg viewBox="0 0 320 155" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="48" y1="42" x2="148" y2="34" stroke="#b5b0c4" stroke-opacity="0.35" stroke-width="1.8" />
            <line x1="48" y1="42" x2="112" y2="118" stroke="#22c55e" stroke-width="2.4" />
            <line x1="112" y1="118" x2="148" y2="34" stroke="#22c55e" stroke-width="2.4" />
            <line x1="148" y1="34" x2="218" y2="54" stroke="#22c55e" stroke-width="2.4" />
            <line x1="112" y1="118" x2="218" y2="54" stroke="#b5b0c4" stroke-opacity="0.3" stroke-width="1.6" />
            <line x1="112" y1="118" x2="278" y2="116" stroke="#b5b0c4" stroke-opacity="0.3" stroke-width="1.6" />
            <line x1="218" y1="54" x2="278" y2="116" stroke="#22c55e" stroke-width="2.4" />

            <g font-family="JetBrains Mono, monospace" font-size="9.5" font-weight="700" fill="#e2dcf2">
              <text x="92" y="30" fill="#b5b0c4">4</text>
              <text x="64" y="88" fill="#4ade80">2</text>
              <text x="136" y="84" fill="#4ade80">1</text>
              <text x="184" y="36" fill="#4ade80">5</text>
              <text x="168" y="96" fill="#b5b0c4">8</text>
              <text x="192" y="132" fill="#b5b0c4">10</text>
              <text x="256" y="78" fill="#4ade80">2</text>
            </g>

            <circle cx="48" cy="42" r="13" fill="#1a1825" stroke="#9b72e8" stroke-width="2.2" />
            <circle cx="148" cy="34" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="112" cy="118" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="218" cy="54" r="13" fill="#1a1825" stroke="#22c55e" stroke-width="2.2" />
            <circle cx="278" cy="116" r="13" fill="#1a1825" stroke="#ec4899" stroke-width="2.2" />

            <g font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" fill="#f7f5ff" text-anchor="middle">
              <text x="48" y="46">A</text>
              <text x="148" y="38">B</text>
              <text x="112" y="122">C</text>
              <text x="218" y="58">D</text>
              <text x="278" y="120">E</text>
            </g>
          </svg>
        </div>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nodo</th>
              <th>Conexiones</th>
              <th>Costo mínimo desde A</th>
              <th>Ruta óptima</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in sampleRows" :key="row.node">
              <td><strong class="mono-node">{{ row.node }}</strong></td>
              <td class="mono-cell">{{ row.edges }}</td>
              <td><span class="time-badge">{{ row.time }}</span></td>
              <td class="mono-path">{{ row.path }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 9. PSEUDOCÓDIGO + COMPLEJIDAD -->
    <div class="code-grid">
      <article class="code-card">
        <div class="block-head">
          <h2>Pseudocódigo</h2>
          <span class="mono-pill">ALGORITMO</span>
        </div>
        <pre><code>DIJKSTRA(grafo, origen)
  distancia[origen] = 0
  marcar todos los demás como infinito

  mientras quede un nodo no visitado:
    actual = nodo no visitado con menor distancia
    marcar actual como visitado
    para cada vecino de actual:
      nuevo = distancia[actual] + peso(actual, vecino)
      si nuevo &lt; distancia[vecino]:
        distancia[vecino] = nuevo
        anterior[vecino] = actual
  devolver distancia, anterior</code></pre>
      </article>

      <article class="complexity-card">
        <span class="pillar-kicker">RENDIMIENTO</span>
        <h2>Complejidad</h2>
        <p>
          Con cola de prioridad (min-heap), el tiempo es
          <strong>O((V + E) log V)</strong>.
        </p>
        <p class="small">
          En este proyecto, <strong>V</strong> son los puntos/estaciones y <strong>E</strong>
          las conexiones en <code>redLaPaz.json</code>; para 32 nodos el cálculo es
          prácticamente instantáneo en el navegador.
        </p>
      </article>
    </div>

  </section>
</template>

<style scoped>
.theory-view {
  display: flex;
  flex-direction: column;
  gap: clamp(36px, 5vw, 60px);
  padding: 0;
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
}

.section-heading .lead {
  font-size: clamp(0.98rem, 1.1vw, 1.06rem);
  line-height: 1.65;
  max-width: 62ch;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ VIDEO ============ */
.media-figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.video-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 10px;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border-color);
}

.video-wrap iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.media-figure figcaption {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 72ch;
}

.caption-label {
  display: inline-block;
  margin-right: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
}

.caption-link {
  color: var(--accent-solid) !important;
  text-decoration: none !important;
  margin-left: 6px;
  border-bottom: 1px solid transparent;
}

.caption-link:hover {
  border-bottom-color: var(--accent-solid);
}

.caption-credit {
  opacity: 0.55;
  margin-left: 4px;
}

/* ============ IMAGEN HERO ============ */
.hero-media {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.hero-media img {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
  border-radius: 10px;
  display: block;
}

.hero-media figcaption {
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-secondary);
  max-width: 72ch;
}

/* ============ 3 PILARES ============ */
.pillars-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.pillar-col {
  padding: 24px 28px;
  border-right: 1px solid var(--border-color);
}

.pillar-col--first {
  padding-left: 0;
}

.pillar-col:last-child {
  border-right: none;
  padding-right: 0;
}

.pillar-kicker {
  display: inline-block;
  margin-bottom: 8px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--accent-solid);
}

.pillar-kicker--warning {
  color: var(--accent-pink);
}

.pillar-col h2 {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 10px;
  letter-spacing: -0.01em;
}

.pillar-col p {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ GALERÍA ============ */
.gallery-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.gallery-head {
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.gallery-item {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-item img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 8px;
  display: block;
}

.gallery-item figcaption {
  font-size: 0.76rem;
  line-height: 1.45;
  color: var(--text-secondary);
}

/* ============ PASOS ============ */
.steps-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

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

.steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.steps-list li {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 0;
  border-bottom: 1px solid var(--border-color);
}

.steps-list li:last-child {
  border-bottom: none;
}

.step-badge {
  flex: 0 0 auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--accent-solid);
  padding-top: 2px;
  min-width: 58px;
}

.step-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.step-body strong {
  font-size: 0.97rem;
  font-weight: 700;
  color: var(--text-primary);
}

.step-body p {
  font-size: 0.89rem;
  line-height: 1.55;
  color: var(--text-secondary);
  margin: 0;
}

/* ============ CÁLCULO PASO A PASO ============ */
.calculation-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.calc-head h2 {
  font-size: clamp(1.3rem, 2vw, 1.6rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 8px 0 12px;
  font-weight: 700;
}

.calc-intro {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-secondary);
  max-width: 72ch;
  margin: 0;
}

.sim-table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.sim-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
  min-width: 760px;
}

.sim-table thead th {
  text-align: left;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--text-secondary);
  padding: 12px 10px;
  border-bottom: 1px solid var(--border-color);
  background: transparent;
}

.sim-table thead th:first-child {
  padding-left: 0;
}

.sim-table thead th:last-child {
  padding-right: 0;
}

.sim-table .dist-header th {
  text-align: center;
  font-size: 0.72rem;
  color: var(--accent-solid);
  padding: 6px 10px;
}

.sim-table tbody td {
  padding: 14px 10px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-secondary);
  vertical-align: top;
}

.sim-table tbody tr:last-child td {
  border-bottom: none;
}

.sim-table tbody td:first-child {
  padding-left: 0;
}

.sim-table tbody td:last-child {
  padding-right: 0;
}

.cell-iter {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-primary);
  white-space: nowrap;
}

.cell-visited {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.76rem;
  color: var(--text-secondary);
}

.node-badge {
  display: inline-block;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.16);
  color: var(--accent-green);
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  text-align: center;
  line-height: 22px;
}

.cell-dist {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary) !important;
  text-align: center;
}

.cell-update {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* ============ EJEMPLO DE RELAJACIÓN ============ */
.relax-example {
  padding: 20px 24px;
  border-left: 2px solid var(--accent-solid);
  background: transparent;
}

.relax-kicker {
  display: block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-solid);
  margin-bottom: 8px;
}

.relax-example h3 {
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0 0 14px;
  letter-spacing: -0.01em;
}

.relax-equation {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.eq-line {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 8px;
  border-bottom: 1px dashed var(--border-color);
}

.eq-label {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.eq-value {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.9rem;
  font-weight: 700;
}

.eq-value--old {
  color: var(--text-secondary);
  text-decoration: line-through;
  text-decoration-color: rgba(236, 72, 153, 0.6);
}

.eq-value--new {
  color: var(--accent-green);
}

.eq-result {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 10px;
  flex-wrap: wrap;
}

.eq-op {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--accent-green);
}

.eq-action {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

/* ============ EJEMPLO GRAFO + TABLA ============ */
.example-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.example-top {
  display: grid;
  grid-template-columns: 1.25fr 0.9fr;
  align-items: center;
  gap: 32px;
}

.example-top h2 {
  font-size: clamp(1.3rem, 2vw, 1.6rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
  margin: 8px 0 12px;
  font-weight: 700;
}

.table-intro {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}

.graph-mini {
  background: transparent;
  padding: 0;
}

.graph-mini svg {
  width: 100%;
  height: auto;
  display: block;
}

.table-wrap {
  overflow-x: auto;
  border-top: 1px solid var(--border-color);
}

.table-wrap table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 600px;
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
}

.table-wrap tbody tr:last-child td {
  border-bottom: none;
}

.table-wrap tbody td:first-child {
  padding-left: 0;
}

.mono-node {
  font-family: "JetBrains Mono", monospace;
  color: var(--accent-solid);
  font-weight: 700;
}

.mono-cell,
.mono-path {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.82rem;
}

.mono-path {
  color: var(--text-primary);
}

.time-badge {
  display: inline-block;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.76rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(34, 197, 94, 0.14);
  color: var(--accent-green);
}

/* ============ PSEUDOCÓDIGO + COMPLEJIDAD ============ */
.code-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.code-card,
.complexity-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.code-card pre {
  margin: 0;
  padding: 18px 20px;
  border-radius: 8px;
  background: var(--bg-surface-2);
  border: 1px solid var(--border-color);
  overflow-x: auto;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.8rem;
  line-height: 1.65;
  color: var(--text-primary);
}

.complexity-card p {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--text-secondary);
  margin: 0;
}

.complexity-card p.small {
  font-size: 0.84rem;
  line-height: 1.6;
  opacity: 0.85;
}

.complexity-card code {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.85em;
  color: var(--accent-solid);
}

/* ============ RESPONSIVE ============ */
@media (max-width: 900px) {
  .pillars-row {
    grid-template-columns: 1fr;
  }

  .pillar-col,
  .pillar-col--first {
    padding: 20px 0;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .pillar-col:last-child {
    border-bottom: none;
  }

  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .example-top {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .code-grid {
    grid-template-columns: 1fr;
  }
}


/* ============ BENEFICIOS, APLICACIONES Y FUENTES ============ */
.extra-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: clamp(24px, 3vw, 36px);
  border-top: 1px solid var(--border-color);
}

.benefits-grid,
.applications-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 28px;
}

.benefit-item,
.application-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--border-color);
}

.extra-number {
  display: inline-block;
  margin-bottom: 10px;
  font-family: "JetBrains Mono", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-solid);
}

.benefit-item h3,
.application-item h3,
.project-application h2 {
  margin: 0 0 8px;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-primary);
}

.benefit-item p,
.application-item p,
.project-application p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
}

.application-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.application-tag {
  font-family: "JetBrains Mono", monospace;
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent-green);
}

.limitations-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

.project-application {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
}

.project-application h2 {
  font-size: clamp(1.3rem, 2vw, 1.6rem);
  margin: 0;
}

.project-points {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  padding: 16px 0;
}

.project-points div {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 14px;
  border-left: 2px solid var(--accent-solid);
}

.project-points strong {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.project-points span {
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.references-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.references-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.references-list li > div {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.references-list strong {
  font-size: 0.9rem;
  color: var(--text-primary);
}

.references-list span {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.references-list a {
  flex: 0 0 auto;
  color: var(--accent-solid) !important;
  font-size: 0.82rem;
  text-decoration: none !important;
}

.references-list a:hover {
  text-decoration: underline !important;
}

@media (max-width: 700px) {
  .benefits-grid,
  .applications-grid,
  .project-points {
    grid-template-columns: 1fr;
  }

  .references-list li {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}

</style>  