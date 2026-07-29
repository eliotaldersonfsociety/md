import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const vercelCountry = request.headers.get("x-vercel-ip-country")

  if (vercelCountry) {
    const isColombia = vercelCountry.toUpperCase() === "CO"
    const currency = isColombia ? "COP" : "USD"
    return Response.json({ country: vercelCountry.toUpperCase(), currency, isColombia })
  }

  const forwarded = request.headers.get("x-forwarded-for")
  const ip = forwarded ? forwarded.split(",")[0].trim() : request.headers.get("x-real-ip") || "unknown"

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { Accept: "application/json" },
    })
    if (!response.ok) {
      return Response.json({ country: "CO", currency: "COP", isColombia: true })
    }
    const data = await response.json()
    const isColombia = data?.country_code === "CO"
    const currency = isColombia ? "COP" : "USD"
    return Response.json({ country: data?.country_code || "CO", currency, isColombia })
  } catch {
    return Response.json({ country: "CO", currency: "COP", isColombia: true })
  }
}
