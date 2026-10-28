import express from 'express'
import cors from 'cors'
import { paises, clubes } from './datos.js'

const app = express()
app.use(cors())
const PORT = 3000

// ── GET /api/clubes  y  GET /api/clubes?pais=Chile ──────────────
app.get('/api/clubes', (req, res) => {
  const { pais } = req.query

  // Sin ?pais= → todos los clubes
  if (pais === undefined) {
    return res.status(200).json(clubes)
  }

  // Búsqueda anidada, salto 1: resolver el país por su nombre (sin importar mayúsculas)
  const paisEncontrado = paises.find(
    p => p.nombre.toLowerCase() === String(pais).toLowerCase()
  )

  // Si el país no existe, no hay nada que filtrar → 404
  if (!paisEncontrado) {
    return res.status(404).json({ error: `No existe el país ${pais}` })
  }

  // Salto 2: ahora sí, filtrar clubes por el id del país
  const clubesDelPais = clubes.filter(c => c.paisId === paisEncontrado.id)
  res.status(200).json(clubesDelPais)
})

// ── GET /api/clubes/:id ─────────────────────────────────────────
app.get('/api/clubes/:id', (req, res) => {
  const id = Number(req.params.id) // llega como texto → lo convierto
  const club = clubes.find(c => c.id === id)

  if (!club) {
    return res.status(404).json({ error: `No existe el club ${req.params.id}` })
  }
  res.status(200).json(club)
})

// ── GET /api/titulos/:club ──────────────────────────────────────
app.get('/api/titulos/:club', (req, res) => {
  const nombre = req.params.club.toLowerCase()
  const club = clubes.find(c => c.nombre.toLowerCase() === nombre)

  if (!club) {
    return res.status(404).json({ error: `No existe el club ${req.params.club}` })
  }
  // Si existe pero no ha ganado → 200 con []
  res.status(200).json(club.titulos)
})

// ── Cualquier otra ruta → 404 en JSON ───────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.originalUrl}` })
})

app.listen(PORT, () => {
  console.log(`🏆 API de la copa libertadores escuchando en http://localhost:${PORT}`)
})