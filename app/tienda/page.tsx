import { getProductsWithVariantsFromDB } from "@/db/actions"
import TiendaClient from "./tienda-client"

export default async function TiendaPage() {
  const dbProducts = await getProductsWithVariantsFromDB()
  return <TiendaClient initialProducts={dbProducts} />
}
