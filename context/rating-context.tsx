"use client"

import { createContext, useContext, useEffect, useState } from "react"

type RatingData = Record<number, { avg: number; count: number }>
type ReviewsData = Record<number, any[]>

interface RatingContextValue {
  ratings: RatingData
  reviews: ReviewsData
  loading: boolean
}

const RatingContext = createContext<RatingContextValue>({
  ratings: {},
  reviews: {},
  loading: false,
})

const LATIN_NAMES = [
  "Ana García", "Luis Martínez", "María López", "Carlos Rodríguez", "Sofía Hernández",
  "Miguel Sánchez", "Elena Fernández", "José Torres", "Laura Jiménez", "David Ramírez",
  "Isabel Morales", "Antonio Ortiz", "Patricia Ruiz", "Jorge Castro", "Marta Vásquez",
  "Francisco Ríos", "Carmen Silva", "Juan Vargas", "Rosa Méndez", "Diego Aguirre",
  "Lucía Romero", "Roberto Navarro", "Silvia Delgado", "Fernando Herrera", "Claudia Campos"
]

const getRandomUserAvatar = (id: number) => {
  const gender = id % 2 === 0 ? "women" : "men"
  const imageId = ((id * 17 + Math.floor(id / 100)) % 90) + 1
  return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`
}

const LATIN_COMMENTS: Record<string, string[]> = {
  peluche: [
    "¡Muy tierno y suave! Mi hija lo adora.",
    "Calidad excelente, llegó en perfectas condiciones.",
    "Ideal para regalar, superó mis expectativas.",
    "Diseño hermoso, mi hijo no lo suelta.",
    "Muy suave, perfecto para abrigarse.",
    "Mejor peluche que he comprado, genial.",
    "Detalles perfectos, muy bien hecho.",
    "Regalé uno y a todos les encantó.",
    "Talla ideal, muy bonito el color.",
    "Super feliz con mi compra.",
    "Muy tierno, lo amo.",
    "Calidad premium, recomendado.",
    "Llegó rápido, gracias."
  ],
  cervical: [
    "Perfecta para viajes largos, muy cómoda.",
    "Excelente calidad del relleno antialérgico.",
    "Mejor de lo esperado, muy práctica.",
    "Alivia el dolor cervical, muy feliz.",
    "Recomendada, uso todos los días.",
    "Comoda y suave, llegó rápido.",
    "Dormí mejor en el avión.",
    "Calidad premium, vale cada centavo.",
    "Ideal para oficina, muy útil.",
    "Relaja perfecto el cuello.",
    "Fácil de limpiar, genial.",
    "Mejor que otras marcas.",
    "Empuja justo lo necesario."
  ],
  cojin: [
    "Hermoso diseño, llena perfecto mi salón.",
    "Muy suave y decorativa, llegó rápido.",
    "Calidad premium, vale cada peso invertido.",
    "Colores preciosos, muy bonito.",
    "Perfecta para regalar, superó lo esperado.",
    "Suavísimo, mi sofá quedó precioso.",
    "Muy higiénico, fácil de lavar.",
    "Diseño único, me encanta este cojín.",
    "Ideal como regalo de cumpleaños.",
    "Muy bonita la tela.",
    "Llena con suavidad.",
    "Los colores son vibrantes.",
    "Perfecto para mi habitación."
  ],
  lata: [
    "Diseño original y muy divertido.",
    "Ideal para guardar dulces, muy útil.",
    "Perfecta decoración para mi cuarto.",
    "Muy bonita, mejor que en foto.",
    "Regalé y fue todo un éxito.",
    "Material resistente, gran calidad.",
    "Diseños únicos, colecciono todas.",
    "Perfecta para sorpresas, genial.",
    "Muy original, llama atención.",
    "Cierre seguro, nada se cae.",
    "Excelente capacidad de almacenamiento.",
    "Diseño creativo, bravo.",
    "Muy práctica para regalos."
  ],
  llavero: [
    "Muy práctico y bonito, gran detalle.",
    "Calidad excelente para su pequeño tamaño.",
    "Perfecto para agarradera de mochila.",
    "Diseño tierno, muy útil al viajar.",
    "Duradero, no se desgasta fácil.",
    "Lleva bien las llaves, genial.",
    "Detalles muy lindos, perfecto.",
    "Muy original, todos preguntan dónde lo compré.",
    "Pequeño pero con buena calidad.",
    "Resiste bien el uso diario.",
    "Muy seguro los sujetadores.",
    "Diseño único, me encanta.",
    "Perfecto para coleccionar."
  ],
  ropa: [
    "Excelente calidad, muy cómoda.",
    "Diseño moderno y ajuste perfecto.",
    "Los colores son geniales, me encanta.",
    "Tejido suave, ideal para uso diario.",
    "Corte perfecto, muy favorecedor.",
    "Material de primera, muy satisfecho.",
    "Lavado perfecto, no encoge.",
    "Estilo único, siempre recibo cumplidos.",
    "Muy buena calidad del algodón.",
    "Sudadera perfecta, caliente.",
    "Te queda como debía.",
    "Diseño cómodo y moderno.",
    "Muy duradera, recomendada."
  ],
  default: [
    "Excelente producto, muy recomendable.",
    "Calidad superior, llegó rápido.",
    "Perfecto, exactamente lo que esperaba.",
    "Muy satisfecho con mi compra.",
    "Recomendado al 100%.",
    "Superó mis expectativas, gracias.",
    "Calidad increíble, muy bueno.",
    "Llegó antes del tiempo estimado.",
    "Todo perfecto, muy contento.",
    "Muy buena compra.",
    "Producto genial.",
    "Volvería a comprar.",
    "Servicio excelente."
  ]
}

function generateSampleReviews(productId: number, productName: string, avgRating: number): any[] {
  const category = productName.toLowerCase().includes("peluche") ? "peluche" :
                   productName.toLowerCase().includes("cervical") ? "cervical" :
                   productName.toLowerCase().includes("cojin") ? "cojin" :
                   productName.toLowerCase().includes("lata") ? "lata" :
                   productName.toLowerCase().includes("llavero") ? "llavero" :
                   productName.toLowerCase().includes("hoodie") || productName.toLowerCase().includes("ropa") ? "ropa" : "default"
  
  const comments = LATIN_COMMENTS[category]
  const commentIndex = (Math.abs(productId) * 7 + productName.length * 3) % comments.length
  const nameIndex = (Math.abs(productId) * 5 + productId.toString().charCodeAt(0) || 0) % LATIN_NAMES.length
  
  return [{
    id: -Math.abs(productId),
    rating: Math.max(1, Math.min(5, Math.round(avgRating))),
    comment: comments[commentIndex],
    avatar: getRandomUserAvatar(productId),
    username: LATIN_NAMES[nameIndex],
    created_at: new Date().toISOString()
  }]
}

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const [ratings, setRatings] = useState<RatingData>({})
  const [reviews, setReviews] = useState<ReviewsData>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    import("@/lib/products-data").then(({ allProducts }) => {
      const staticRatings: RatingData = {}
      const staticReviews: ReviewsData = {}
      
      allProducts.forEach(product => {
        if (product.rating && product.reviews) {
          staticRatings[product.id] = { avg: product.rating, count: product.reviews }
          staticReviews[product.id] = generateSampleReviews(product.id, product.name, product.rating)
        }
      })
      
      setRatings(staticRatings)
      setReviews(staticReviews)
      setLoading(false)
    })
  }, [])

  return (
    <RatingContext.Provider value={{ ratings, reviews, loading }}>
      {children}
    </RatingContext.Provider>
  )
}

export function useRatings() {
  return useContext(RatingContext)
}