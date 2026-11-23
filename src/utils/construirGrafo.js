import redLaPaz from '../data/redLaPaz.json'

const pesoValido = valor => {
  const peso = Number(valor)
  return Number.isFinite(peso) && peso > 0 ? peso : 0.01
}

export function construirGrafo(escenario = 'normal') {
  const escenarioValido =
    ['normal', 'pico', 'paro'].includes(escenario) ? escenario : 'normal'

  const nodes = []
  const edges = []
  let siguienteArista = 1

  const visibleIds = new Set()

  // Los nodos visibles representan estaciones y puntos extra.
  for (const estacion of redLaPaz.estaciones) {
    visibleIds.add(estacion.id)
    nodes.push({
      id: estacion.id,
      nombre: estacion.nombre,
      visible: true,
      x: estacion.x,
      y: estacion.y
    })
  }

  for (const punto of redLaPaz.puntosExtra) {
    visibleIds.add(punto.id)
    nodes.push({
      id: punto.id,
      nombre: punto.nombre,
      visible: true,
      x: punto.x,
      y: punto.y
    })
  }

  const agregarArista = (sourceId, targetId, weight, metadata = {}) => {
    edges.push({
      id: `e${siguienteArista++}`,
      sourceId,
      targetId,
      weight,
      ...metadata
    })
  }

  // Líneas de teleférico: nodos internos para controlar la espera al subir.
  for (const linea of redLaPaz.lineas) {
    const internosPorEstacion = new Map()

    for (const estacionId of linea.estaciones) {
      const internoId = `${estacionId}|${linea.id}`
      internosPorEstacion.set(estacionId, internoId)

      nodes.push({
        id: internoId,
        nombre: `${estacionId} - Línea ${linea.nombre}`,
        visible: false,
        lineaId: linea.id
      })

      const fila = pesoValido(linea.fila?.[escenarioValido])

      // Subir a la línea cuesta la fila; bajar al nodo visible casi no cuesta.
      agregarArista(estacionId, internoId, fila, {
        kind: 'subir',
        lineaId: linea.id,
        lineaNombre: linea.nombre
      })
      agregarArista(internoId, estacionId, 0.01, {
        kind: 'bajada',
        lineaId: linea.id,
        lineaNombre: linea.nombre
      })
    }

    for (let i = 0; i < linea.tramos.length; i += 1) {
      const estacionA = linea.estaciones[i]
      const estacionB = linea.estaciones[i + 1]
      const tramo = pesoValido(linea.tramos[i])

      agregarArista(internosPorEstacion.get(estacionA), internosPorEstacion.get(estacionB), tramo, {
        kind: 'tramo',
        lineaId: linea.id,
        lineaNombre: linea.nombre,
        desdeId: estacionA,
        haciaId: estacionB
      })
      agregarArista(internosPorEstacion.get(estacionB), internosPorEstacion.get(estacionA), tramo, {
        kind: 'tramo',
        lineaId: linea.id,
        lineaNombre: linea.nombre,
        desdeId: estacionB,
        haciaId: estacionA
      })
    }
  }

  // Caminatas entre puntos extra y estaciones visibles.
  for (const punto of redLaPaz.puntosExtra) {
    for (const conexion of punto.conexiones || []) {
      if (!visibleIds.has(conexion.con)) continue

      const tiempo = pesoValido(conexion.min?.[escenarioValido])
      agregarArista(punto.id, conexion.con, tiempo, {
        kind: 'caminata',
        desdeId: punto.id,
        haciaId: conexion.con
      })
      agregarArista(conexion.con, punto.id, tiempo, {
        kind: 'caminata',
        desdeId: conexion.con,
        haciaId: punto.id
      })
    }
  }

  // Minibús y enlaces bidireccionales entre nodos visibles.
  for (const enlace of redLaPaz.enlaces) {
    if (!visibleIds.has(enlace.de) || !visibleIds.has(enlace.a)) continue

    const tiempo = pesoValido(enlace.min?.[escenarioValido])
    agregarArista(enlace.de, enlace.a, tiempo, {
      kind: enlace.tipo,
      desdeId: enlace.de,
      haciaId: enlace.a,
      nota: enlace.nota || ''
    })
    agregarArista(enlace.a, enlace.de, tiempo, {
      kind: enlace.tipo,
      desdeId: enlace.a,
      haciaId: enlace.de,
      nota: enlace.nota || ''
    })
  }

  return { nodes, edges }
}
