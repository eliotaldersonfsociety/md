export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fábrica de Peluches Mundo Disney",
  description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados. Envíos a Colombia y Venezuela.",
  url: "https://fabricadepeluchesmundodisney.com",
  logo: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
  sameAs: [
    "https://www.facebook.com/streetachira",
    "https://www.instagram.com/fabricadepeluchesmundodisney",
    "https://www.tiktok.com/@fabricamundodisney",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+57 311 281 4787",
      contactType: "customer service",
      areaServed: "CO",
      availableLanguage: ["Spanish"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+58 422 178 2843",
      contactType: "customer service",
      areaServed: "VE",
      availableLanguage: ["Spanish"],
    },
  ],
}

export const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fábrica de Peluches Mundo Disney",
  url: "https://fabricadepeluchesmundodisney.com",
  description: "Fábrica de peluches, cojines, cervicales, llaveros y regalos personalizados.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://fabricadepeluchesmundodisney.com/?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

export function productSchema(product: {
  name: string
  image: string
  description: string
  price: number
  currency?: string
  availability?: string
  brand?: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "COP",
      availability: product.availability || "https://schema.org/InStock",
      url: `https://fabricadepeluchesmundodisney.com/${product.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
    },
    brand: {
      "@type": "Brand",
      name: product.brand || "Fábrica de Peluches Mundo Disney",
    },
  }
}

export function breadcrumbSchema(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

export function articleSchema(article: {
  title: string
  description: string
  image: string
  date: string
  author: string
  url: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    author: {
      "@type": "Organization",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Fábrica de Peluches Mundo Disney",
      logo: {
        "@type": "ImageObject",
        url: "https://fabricadepeluchesmundodisney.com/images/logo.webp",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
  }
}
