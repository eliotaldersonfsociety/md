"use client"

import { Star } from "lucide-react"
import { useState, useTransition, useEffect } from "react"
import { rateProduct } from "@/db/actions"
import { useRatings } from "@/context/rating-context"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

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

const getNameFromId = (id: number) => LATIN_NAMES[id % LATIN_NAMES.length]

interface RatingSectionProps {
  productId: number
  showWriteReview?: boolean
  isLoading?: boolean
  initialRating?: number
  initialReviews?: number
}

export function RatingSection({ productId, showWriteReview = true, initialRating, initialReviews }: RatingSectionProps) {
  const { ratings, reviews, loading } = useRatings()
  const [avg, setAvg] = useState(0)
  const [count, setCount] = useState(0)
  const [selectedRating, setSelectedRating] = useState(0)
  const [username, setUsername] = useState("")
  const [comment, setComment] = useState("")
  const [localReviews, setLocalReviews] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mounted, setMounted] = useState(false)
  const [isLocalLoading, setIsLocalLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    const timer = setTimeout(() => setIsLocalLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  const productRating = ratings[productId]
  const displayAvg = productRating ? productRating.avg : (initialRating ?? avg)
  const displayCount = productRating ? productRating.count : (initialReviews ?? count)
  const productReviews = reviews[productId] || []

  const resetForm = () => {
    setSelectedRating(0)
    setComment("")
    setUsername("")
  }

  const handleRatingSubmit = () => {
    if (selectedRating === 0) return

    const currentUsername = username || getNameFromId(productId)
    const currentComment = comment || "Excelente producto"
    const currentAvatar = getRandomUserAvatar(productId)

    startTransition(async () => {
      const result = await rateProduct(productId, selectedRating, currentComment, currentUsername, currentAvatar)
      if (result) {
        setAvg(result.avg)
        setCount(result.count)

        const newReview = {
          id: Date.now(),
          rating: selectedRating,
          comment: currentComment,
          avatar: currentAvatar,
          username: currentUsername,
          created_at: new Date().toISOString()
        }

        setLocalReviews(prev => [...prev, newReview])
        resetForm()
        setOpen(false)
      }
    })
  }

  if (!mounted || isLocalLoading) {
    return (
      <div className="flex flex-col gap-1 animate-pulse">
        <div className="flex items-center gap-1">
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
        <div className="h-3 w-20 bg-gray-200 rounded" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 cursor-pointer transition-colors ${
              star <= displayAvg
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
        ))}
        {displayCount > 0 ? (
          <>
            <span className="text-sm font-medium ml-1">{displayAvg.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({displayCount})</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground ml-1">Sin reseñas</span>
        )}
      </div>

      {showWriteReview && mounted ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="text-xs text-primary hover:underline text-left">
              Escribir reseña
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Califica este producto</DialogTitle>
            </DialogHeader>

            <div className="flex gap-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer transition-colors ${
                    star <= selectedRating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                  onClick={() => setSelectedRating(star)}
                />
              ))}
            </div>

            <input
              type="text"
              placeholder="Tu nombre (opcional)"
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 20))}
              className="w-full px-3 py-1.5 text-sm border rounded-md mb-3 h-9"
            />

            <Textarea
              placeholder="Escribe tu reseña (máximo 1 línea)..."
              value={comment}
              onChange={(e) => setComment(e.target.value.slice(0, 80))}
              className="mb-3 resize-none"
              rows={1}
            />

            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetForm}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                size="sm"
                onClick={handleRatingSubmit}
                disabled={selectedRating === 0 || isPending}
              >
                {isPending ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      {showWriteReview && productReviews.length > 0 ? (
        <div className="mt-2 space-y-2">
          {productReviews.map((review) => (
            <div key={review.id} className="text-xs bg-muted/30 p-2 rounded">
              <div className="flex items-center gap-1 mb-1">
                <img
                  src={review.avatar}
                  alt={review.username}
                  className="h-5 w-5 rounded-full"
                />
                <span className="font-medium truncate">{review.username}</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3 w-3 ${
                        s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-muted-foreground truncate">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
