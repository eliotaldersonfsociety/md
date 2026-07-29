import CategoryPage from "@/components/category-page"
import { getProductsWithStock, getVariantsByProductId, upsertProductVariants } from "@/db/actions"

const FEATURES = ["Suavidad", "Relleno antialérgico", "Durabilidad", "Fácil lavado"]

const products = [
  {
    id: 601,
    name: "Arreglo Milo Gato",
    price: 35000,
    image: "/images/arreglos/peluches/1.webp",
    rating: 4.6,
    reviews: 32,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 602,
    name: "Arreglo Mimi Gata",
    price: 42000,
    originalPrice: 52000,
    image: "/images/arreglos/peluches/2.webp",
    rating: 4.7,
    reviews: 28,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 603,
    name: "Arreglo Bubu Mono",
    price: 38000,
    image: "/images/arreglos/peluches/3.webp",
    rating: 4.5,
    reviews: 22,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 604,
    name: "Arreglo Lala Mona",
    price: 36000,
    originalPrice: 46000,
    image: "/images/arreglos/peluches/4.webp",
    rating: 4.6,
    reviews: 19,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 605,
    name: "Arreglo Dodo Conejo",
    price: 34000,
    image: "/images/arreglos/peluches/5.webp",
    rating: 4.5,
    reviews: 25,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 606,
    name: "Arreglo Buny Coneja",
    price: 33000,
    originalPrice: 42000,
    image: "/images/arreglos/peluches/6.webp",
    rating: 4.4,
    reviews: 18,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 607,
    name: "Arreglo Max Perro",
    price: 37000,
    image: "/images/arreglos/peluches/7.webp",
    rating: 4.5,
    reviews: 20,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 608,
    name: "Arreglo Kira Perra",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/8.webp",
    rating: 4.4,
    reviews: 16,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 609,
    name: "Arreglo Roco Toro",
    price: 39000,
    image: "/images/arreglos/peluches/9.webp",
    rating: 4.6,
    reviews: 21,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 610,
    name: "Arreglo Mura Vaca",
    price: 32000,
    originalPrice: 40000,
    image: "/images/arreglos/peluches/10.webp",
    rating: 4.5,
    reviews: 17,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 611,
    name: "Arreglo Nube Oveja",
    price: 36000,
    image: "/images/arreglos/peluches/11.webp",
    rating: 4.6,
    reviews: 23,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 612,
    name: "Arreglo Kimi Oveja",
    price: 34000,
    originalPrice: 43000,
    image: "/images/arreglos/peluches/12.webp",
    rating: 4.4,
    reviews: 15,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 613,
    name: "Arreglo Gino Jirafa",
    price: 38000,
    image: "/images/arreglos/peluches/13.webp",
    rating: 4.5,
    reviews: 19,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 614,
    name: "Arreglo Jira Jirafa",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/14.webp",
    rating: 4.4,
    reviews: 14,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 615,
    name: "Arreglo Drako Dragon",
    price: 40000,
    image: "/images/arreglos/peluches/15.webp",
    rating: 4.6,
    reviews: 24,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 616,
    name: "Arreglo Drini Dragon",
    price: 42000,
    originalPrice: 52000,
    image: "/images/arreglos/peluches/16.webp",
    rating: 4.7,
    reviews: 27,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 617,
    name: "Arreglo Orejon Conejo Nino",
    price: 36000,
    image: "/images/arreglos/peluches/17.webp",
    rating: 4.5,
    reviews: 20,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 618,
    name: "Arreglo Orejon Coneja Nina",
    price: 34000,
    originalPrice: 43000,
    image: "/images/arreglos/peluches/18.webp",
    rating: 4.4,
    reviews: 16,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 619,
    name: "Arreglo Orejon Perro Nino",
    price: 37000,
    image: "/images/arreglos/peluches/19.webp",
    rating: 4.5,
    reviews: 22,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 620,
    name: "Arreglo Orejon Perra Nina",
    price: 35000,
    originalPrice: 44000,
    image: "/images/arreglos/peluches/20.webp",
    rating: 4.4,
    reviews: 17,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 12 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 621,
    name: "Arreglo Mia la Osa",
    price: 45000,
    image: "/images/arreglos/peluches/21.webp",
    rating: 4.9,
    reviews: 30,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 622,
    name: "Arreglo Sam el Oso",
    price: 44000,
    originalPrice: 54000,
    image: "/images/arreglos/peluches/22.webp",
    rating: 4.9,
    reviews: 29,
    features: FEATURES,
    variants: [
      { id: "v1", label: "Peluche #2 - 40cm", price: 50000, wholesalePrice: 25000, stock: 10 },
      { id: "v2", label: "Peluche #3 - 60cm", price: 70000, wholesalePrice: 40000, stock: 8 },
      { id: "v3", label: "Peluche #4 - 100cm", price: 115000, wholesalePrice: 60000, stock: 5 },
    ]
  },
  {
    id: 235,
    name: "Cojin Corazon Lo Lograstes",
    price: 35000,
    originalPrice: 42000,
    image: "/images/arreglos/cojines/24.webp",
    rating: 4.6,
    reviews: 30,
    badge: "Oferta",
    badgeColor: "bg-orange-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 236,
    name: "Cojin Corazon Felicitaciones",
    price: 38000,
    image: "/images/arreglos/cojines/23.webp",
    rating: 4.5,
    reviews: 25,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 237,
    name: "Cojin Corazon Feliz Dia Mama",
    price: 32000,
    image: "/images/arreglos/cojines/26.webp",
    rating: 4.7,
    reviews: 35,
    badge: "Top Ventas",
    badgeColor: "bg-primary",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 238,
    name: "Cojin Corazon Me Gustas",
    price: 45000,
    image: "/images/arreglos/cojines/25.webp",
    rating: 4.6,
    reviews: 40,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },

  {
    id: 240,
    name: "Cojin Corazon Te Amo",
    price: 48000,
    image: "/images/arreglos/cojines/31.webp",
    rating: 4.7,
    reviews: 32,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 241,
    name: "Cojin Corazon Te Quiero",
    price: 48000,
    image: "/images/arreglos/cojines/32.webp",
    rating: 4.6,
    reviews: 30,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 242,
    name: "Cojin Corazon Feliz Dia",
    price: 48000,
    image: "/images/arreglos/cojines/33.webp",
    rating: 4.5,
    reviews: 27,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 243,
    name: "Cojin Corazon TQM",
    price: 48000,
    image: "/images/arreglos/cojines/34.webp",
    rating: 4.6,
    reviews: 29,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 244,
    name: "Cojin Corazon Eres Especial",
    price: 48000,
    image: "/images/arreglos/cojines/27.webp",
    rating: 4.5,
    reviews: 26,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 245,
    name: "Cojin Corazon Feliz Cumpleanos",
    price: 48000,
    image: "/images/arreglos/cojines/35.webp",
    rating: 4.6,
    reviews: 31,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 246,
    name: "Cojin Corazon Te ExtraNo",
    price: 48000,
    image: "/images/arreglos/cojines/36.webp",
    rating: 4.5,
    reviews: 24,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 247,
    name: "Cojin Corazon Eres Tu",
    price: 48000,
    image: "/images/arreglos/cojines/29.webp",
    rating: 4.4,
    reviews: 22,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 248,
    name: "Cojin Corazon Eres mi Felicidad",
    price: 48000,
    image: "/images/arreglos/cojines/28.webp",
    rating: 4.5,
    reviews: 23,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 249,
    name: "Cojin Cuadrado Portugal",
    price: 48000,
    image: "/images/arreglos/cojines/39.webp",
    rating: 4.4,
    reviews: 20,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 250,
    name: "Cojin Cuadrado Argentina",
    price: 48000,
    image: "/images/arreglos/cojines/38.webp",
    rating: 4.3,
    reviews: 18,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 251,
    name: "Cojin Cuadrado Colombia",
    price: 48000,
    image: "/images/arreglos/cojines/40.webp",
    rating: 4.4,
    reviews: 19,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },
  {
    id: 252,
    name: "Cojin Cuadrado Brasil",
    price: 48000,
    image: "/images/arreglos/cojines/37.webp",
    rating: 4.5,
    reviews: 21,
    badge: "Nuevo",
    badgeColor: "bg-green-500",
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 25cm", price: 20000, wholesalePrice: 10000, stock: 10 },
      { id: "gra", label: "Grande - 35cm", price: 30000, wholesalePrice: 18000, stock: 10 },
    ]
  },

  {
    id: 258,
    name: "Arreglo Lata Portugal",
    price: 26000,
    originalPrice: 32000,
    image: "/images/arreglos/lata/41.webp",
    rating: 4.5,
    reviews: 16,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 259,
    name: "Arreglo Lata Los Simpson",
    price: 18000,
    image: "/images/arreglos/lata/42.webp",
    rating: 4.4,
    reviews: 14,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 260,
    name: "Arreglo Lata Felicitaciones",
    price: 18000,
    image: "/images/arreglos/lata/43.webp",
    rating: 4.5,
    reviews: 17,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 261,
    name: "Arreglo Lata Te Amo",
    price: 23000,
    image: "/images/arreglos/lata/44.webp",
    rating: 4.4,
    reviews: 13,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 262,
    name: "Arreglo Lata TQM",
    price: 18000,
    image: "/images/arreglos/lata/45 (1).webp",
    rating: 4.3,
    reviews: 10,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 263,
    name: "Arreglo Lata Te Extraño",
    price: 18000,
    image: "/images/arreglos/lata/47.webp",
    rating: 4.4,
    reviews: 12,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  },
  {
    id: 264,
    name: "Arreglo Lata 47 Copia",
    price: 18000,
    image: "/images/arreglos/lata/47 - copia.webp",
    rating: 4.3,
    reviews: 9,
    features: FEATURES,
    variants: [
      { id: "med", label: "Mediano - 30cm", price: 25000, wholesalePrice: 15000, stock: 10 },
    ]
  }
]

export default async function FloristeriaPage() {
  try {
    const dbProducts = await getProductsWithStock()
    const stockMap = new Map<number, number>()
    const variantStocksMap = new Map<number, Map<string, number>>()

    for (const p of dbProducts) {
      if (p.category_id === 7) {
        stockMap.set(p.id, p.stock)
      }
      const variantRows = await getVariantsByProductId(p.id)
      if (variantRows.length > 0) {
        const variantMap = new Map<string, number>()
        for (const v of variantRows) {
          variantMap.set(v.label.trim(), v.stock)
        }
        variantStocksMap.set(p.id, variantMap)
      }
    }

    const productsWithStock = products.map(p => {
      const variants = p.variants ? p.variants.map(v => {
        const storedVariantStock = variantStocksMap.get(p.id)?.get(v.label.trim())
        const productStock = stockMap.get(p.id) ?? 0
        const fallbackStock = p.variants!.length > 0 ? Math.floor(productStock / p.variants!.length) : 0
        return {
          ...v,
          stock: (storedVariantStock ?? (v as any).stock ?? fallbackStock)
        } as typeof v & { stock: number }
      }) : p.variants

      return {
        ...p,
        stock: variants ? variants.reduce((sum, v) => sum + ((v as any).stock ?? 0), 0) : (stockMap.get(p.id) ?? 0),
        variants
      }
    })

    await Promise.all(
      productsWithStock
        .filter(p => p.variants && p.variants.length > 0)
        .map(p => upsertProductVariants(p.id, p.variants!.map(v => ({
          label: v.label,
          price: v.price,
          wholesalePrice: (v as any).wholesalePrice,
          stock: (v as any).stock ?? 0
        }))))
    )

    return (
      <CategoryPage
        title="Floristeria"
        description="Arreglos florales frescos y elegantes para cada ocasion. Envios a todo el pais."
        products={productsWithStock}
        category="floristeria"
      />
    )
  } catch {
    return (
      <CategoryPage
        title="Floristeria"
        description="Arreglos florales frescos y elegantes para cada ocasion. Envios a todo el pais."
        products={products}
        category="floristeria"
      />
    )
  }
}







