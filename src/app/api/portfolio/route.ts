import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

const ALLOWED_EXT = new Set(['.webp', '.jpg', '.jpeg', '.png'])

function listFilesSafe(dir: string): string[] {
  try {
    return fs.readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => ALLOWED_EXT.has(path.extname(name).toLowerCase()))
      // natural numeric sort: 1,2,10
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  } catch {
    return []
  }
}

function sanitizeFolder(folder?: string | null): string | null {
  if (!folder) return null
  // allow letters, digits, dashes and underscores only to avoid path traversal
  if (!/^[a-z0-9_-]+$/i.test(folder)) return null
  return folder
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const folderParam = sanitizeFolder(url.searchParams.get('folder'))
    const foldersParam = url.searchParams.get('folders') // comma-separated
    const baseNameRaw = url.searchParams.get('base') || 'portfolio'
    const baseName = (baseNameRaw === 'cases' ? 'cases' : 'portfolio')
    const baseDir = path.join(process.cwd(), 'public', 'images', baseName)

    if (folderParam) {
      const dir = path.join(baseDir, folderParam)
      const files = listFilesSafe(dir).map((f) => `/images/${baseName}/${folderParam}/${f}`)
      return NextResponse.json({ folder: folderParam, base: baseName, files }, { status: 200 })
    }

    const result: Record<string, string[]> = {}
    if (foldersParam) {
      const folders = foldersParam.split(',').map((s) => sanitizeFolder(s.trim())).filter(Boolean) as string[]
      folders.forEach((f) => {
        const dir = path.join(baseDir, f)
        const files = listFilesSafe(dir).map((name) => `/images/${baseName}/${f}/${name}`)
        result[f] = files
      })
      return NextResponse.json({ base: baseName, folders: result }, { status: 200 })
    }

    // If no params, return list of folders with their files
    let folders: string[] = []
    try {
      folders = fs.readdirSync(baseDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .filter((n) => sanitizeFolder(n))
    } catch {
      folders = []
    }
    folders.forEach((f) => {
      const dir = path.join(baseDir, f)
      const files = listFilesSafe(dir).map((name) => `/images/${baseName}/${f}/${name}`)
      result[f] = files
    })
    return NextResponse.json({ base: baseName, folders: result }, { status: 200 })
  } catch (e: unknown) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

