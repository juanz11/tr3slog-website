import { createServer } from 'http'
import { readFile, stat } from 'fs/promises'
import { join, extname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const ROOT = resolve(__dirname, '..', process.env.ROOT || 'out')
const PORT = process.env.PORT || 8080

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.webp': 'image/webp',
  '.map': 'application/json',
  '.txt': 'text/plain',
}

const notFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('Not found')
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`)
    let filePath = join(ROOT, decodeURIComponent(url.pathname))

    const info = await stat(filePath).catch(() => null)
    if (info && info.isDirectory()) {
      filePath = join(filePath, 'index.html')
    }

    const ext = extname(filePath)
    if (!ext) {
      filePath += '.html'
    }

    const data = await readFile(filePath)
    res.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    })
    res.end(data)
  } catch {
    const fallback = join(ROOT, 'index.html')
    try {
      const data = await readFile(fallback)
      res.writeHead(200, { 'Content-Type': 'text/html', 'Cache-Control': 'no-cache' })
      res.end(data)
    } catch {
      notFound(res)
    }
  }
})

server.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT} serving ${ROOT}`)
})
