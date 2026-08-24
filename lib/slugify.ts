export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function cleanProductName(name: string, category: string): string {
  const prefixes: Record<string, string[]> = {
    peluches: ["peluche", "peluches"],
    cojines: ["cojin", "cojines"],
    cervicales: ["cervical", "cervicales"],
    llaveros: ["llavero", "llaveros"],
    latas: ["lata", "latas"],
    ropa: ["hoodie", "ropa"],
    floristeria: ["arreglo", "floristeria"],
  }

  const categoryPrefixes = prefixes[category.toLowerCase()] || []
  const lowerName = name.toLowerCase()

  for (const prefix of categoryPrefixes) {
    if (lowerName.startsWith(prefix)) {
      return name.slice(prefix.length).trim()
    }
  }

  return name
}

export function buildProductSlug(name: string): string {
  if (!name) return ""
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function getProductSlug(name: string, category: string): string {
  const cleanName = cleanProductName(name, category)
  return slugify(cleanName)
}
