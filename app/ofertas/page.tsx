import { getOfertasPageData } from "@/db/actions"
import OfertasClient from "./ofertas-client"

export default async function OfertasPage() {
  const { products, maxDiscount } = await getOfertasPageData()
  return <OfertasClient initialProducts={products} maxDiscount={maxDiscount} />
}
