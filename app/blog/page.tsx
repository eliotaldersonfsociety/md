import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowRight } from "lucide-react"
import { getAllPosts } from "@/lib/blog-data"

export const metadata: Metadata = {
  title: "Blog | Fábrica de Peluches Mundo Disney",
  description: "Blog de Fábrica de Peluches Mundo Disney. Ideas de regalos, cuidado de peluches, regalos para parejas, cumpleaños y más.",
  canonical: "/blog",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Ideas, guías y consejos para regalar
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Descubre artículos sobre peluches, regalos personalizados, cumpleaños y cómo elegir el detalle perfecto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col"
              >
                <div className="relative aspect-video bg-gray-50">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {post.description}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all mt-auto"
                  >
                    Leer más <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
