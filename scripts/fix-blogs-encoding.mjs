import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const blogsPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'blogs.ts')
let s = readFileSync(blogsPath, 'utf8')

// UTF-8 em dash / quotes misread as Windows-1252
s = s.replace(/\u00e2\u0080\u0094/g, '—')
s = s.replace(/\u00e2\u0080\u009c/g, '"')
s = s.replace(/\u00e2\u0080\u009d/g, '"')
s = s.replace(/\u00e2\u0080\u0099/g, "'")

// Windows-1252 misread UTF-8 (â€" = em dash, â€" = close quote used as wrapper)
s = s.replace(/\u00e2\u20ac\u2014/g, '—')
s = s.replace(/\u00e2\u20ac\u0094/g, '—')
s = s.replace(/\u00e2\u20ac\u201d/g, '"')
s = s.replace(/\u00e2\u20ac\u201c/g, '"')
s = s.replace(/\u00e2\u20ac\u009d/g, '"')
s = s.replace(/\u00e2\u20ac\u009c/g, '"')

// Mojibake fix left stray `" ` where an em dash belonged
s = s.replace(/ "/g, ' —')

writeFileSync(blogsPath, s, 'utf8')
console.log('fixed blogs encoding')
