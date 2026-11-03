import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const stylesRoot = path.resolve("src/shared/config/styles")
const primitivesRoot = path.resolve("src/shared/ui/shadcn")
const paletteCss = fs.readFileSync(path.join(stylesRoot, "palette.css"), "utf8")
const globalCss = fs.readFileSync(path.join(stylesRoot, "global.css"), "utf8")
const shadcnConfig = JSON.parse(fs.readFileSync("components.json", "utf8"))

const semanticTokens = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "success",
  "success-foreground",
  "warning",
  "warning-foreground",
  "info",
  "info-foreground",
  "border",
  "input",
  "ring",
  "overlay",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "sidebar",
  "sidebar-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
  "sidebar-accent",
  "sidebar-accent-foreground",
  "sidebar-border",
  "sidebar-ring",
]

const rawColorUtility =
  /\b(?:bg|text|border|ring|fill|stroke)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d+)?(?:\/\d+)?\b/g

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function listTsxFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) return listTsxFiles(target)
    return entry.name.endsWith(".tsx") ? [target] : []
  })
}

test("shadcn semantic colors resolve through the project palette", () => {
  assert.match(globalCss, /@import ["']\.\/palette\.css["'];/)

  for (const token of semanticTokens) {
    const escaped = escapeRegExp(token)
    const mappings = paletteCss.match(
      new RegExp(`--${escaped}:\\s*var\\(--palette-[^)]+\\);`, "g"),
    )

    assert.equal(mappings?.length, 2, `${token} must map in light and dark themes`)
    assert.match(
      globalCss,
      new RegExp(`--color-${escaped}:\\s*var\\(--${escaped}\\);`),
      `${token} must be exposed to Tailwind`,
    )
  }
})

test("shadcn writes new primitives into the shared token-aware folder", () => {
  assert.equal(shadcnConfig.tailwind.css, "src/shared/config/styles/global.css")
  assert.equal(shadcnConfig.aliases.ui, "@/shared/ui/shadcn")
  assert.equal(shadcnConfig.aliases.utils, "@/shared/libs/utils")
})

test("registry primitives do not bypass semantic colors", () => {
  const violations = listTsxFiles(primitivesRoot).flatMap((file) => {
    const matches = fs.readFileSync(file, "utf8").match(rawColorUtility) ?? []
    return matches.map((match) => `${path.relative(process.cwd(), file)}: ${match}`)
  })

  assert.deepEqual(violations, [])
})
