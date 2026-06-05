import { getOfertas } from "@/db/actions"
import OfertasClient from "./ofertas-client"

export default async function OfertasPage() {
  const ofertas = await getOfertas()
  return <OfertasClient initialProducts={ofertas} />
}
