import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// CRC32 for PNG chunks
const crcTable = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const body = Buffer.concat([typeBuf, data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

/** Draw a rounded-square Stash icon with stacked "shelf" bars. */
function render(size) {
  const px = Buffer.alloc(size * size * 4)
  const radius = size * 0.22
  const set = (x, y, r, g, b, a) => {
    const i = (y * size + x) * 4
    px[i] = r
    px[i + 1] = g
    px[i + 2] = b
    px[i + 3] = a
  }
  const inRoundedRect = (x, y, pad) => {
    const min = pad
    const max = size - pad
    if (x < min || y < min || x >= max || y >= max) return false
    const rr = radius - pad * 0.4
    const cxs = [min + rr, max - rr]
    const cys = [min + rr, max - rr]
    const nearL = x < cxs[0]
    const nearR = x > cxs[1]
    const nearT = y < cys[0]
    const nearB = y > cys[1]
    if ((nearL || nearR) && (nearT || nearB)) {
      const cx = nearL ? cxs[0] : cxs[1]
      const cy = nearT ? cys[0] : cys[1]
      return (x - cx) ** 2 + (y - cy) ** 2 <= rr * rr
    }
    return true
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!inRoundedRect(x, y, 0)) {
        set(x, y, 0, 0, 0, 0)
        continue
      }
      // vertical gradient blue (#2563EB -> #1D4ED8)
      const t = y / size
      const r = Math.round(37 + (29 - 37) * t)
      const g = Math.round(99 + (78 - 99) * t)
      const b = Math.round(235 + (216 - 235) * t)
      set(x, y, r, g, b, 255)
    }
  }

  // Three white rounded bars (the "shelf" glyph)
  const barLeft = Math.round(size * 0.28)
  const barRight = Math.round(size * 0.72)
  const barH = Math.round(size * 0.09)
  const gap = Math.round(size * 0.075)
  const startY = Math.round(size * 0.3)
  for (let bar = 0; bar < 3; bar++) {
    const y0 = startY + bar * (barH + gap)
    const y1 = y0 + barH
    const rr = barH / 2
    for (let y = y0; y < y1; y++) {
      for (let x = barLeft; x < barRight; x++) {
        // rounded ends
        let ok = true
        if (x < barLeft + rr) {
          const cx = barLeft + rr
          const cy = y0 + rr
          if ((x - cx) ** 2 + (y - cy) ** 2 > rr * rr) ok = false
        } else if (x > barRight - rr) {
          const cx = barRight - rr
          const cy = y0 + rr
          if ((x - cx) ** 2 + (y - cy) ** 2 > rr * rr) ok = false
        }
        if (ok) set(x, y, 255, 255, 255, 235)
      }
    }
  }

  // raw scanlines with filter byte 0
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0))
  ])
}

mkdirSync(join(root, 'resources'), { recursive: true })
writeFileSync(join(root, 'resources', 'icon.png'), render(512))
writeFileSync(join(root, 'resources', 'tray-icon.png'), render(32))
console.log('wrote resources/icon.png (512) and resources/tray-icon.png (32)')
