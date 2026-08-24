import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Calendar, User, Tag, ArrowLeft, MessageCircle } from "lucide-react"
import { getPostBySlug, getAllPosts } from "@/lib/blog-data"
import { JsonLd, articleSchema, breadcrumbSchema } from "@/components/json-ld"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: "Artículo no encontrado | Fábrica de Peluches Mundo Disney" }
  }

  return {
    title: `${post.title} | Blog | Fábrica de Peluches Mundo Disney`,
    description: post.description,
    canonical: `/blog/${post.slug}`,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const allPosts = getAllPosts()
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          image: post.image,
          date: post.date,
          author: post.author,
          url: `https://fabricadepeluchesmundodisney.com/blog/${post.slug}`,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", item: "https://fabricadepeluchesmundodisney.com/" },
          { name: "Blog", item: "https://fabricadepeluchesmundodisney.com/blog" },
          { name: post.title, item: `https://fabricadepeluchesmundodisney.com/blog/${post.slug}` },
        ])}
      />

      <article className="py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ArrowLeft className="h-4 w-4" />
            <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
            <ArrowLeft className="h-4 w-4" />
            <span className="text-foreground font-medium">{post.title}</span>
          </nav>

          <div className="relative aspect-video bg-gray-50 rounded-2xl overflow-hidden mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </span>
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{post.title}</h1>

          <div
            className="prose prose-gray max-w-none mb-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-4 [&_p]:text-foreground/90 [&_p]:leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {post.relatedProducts && post.relatedProducts.length > 0 && (
            <div className="bg-muted/30 rounded-2xl p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Productos Relacionados</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {post.relatedProducts.map((product) => (
                  <Link
                    key={product.href}
                    href={product.href}
                    className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all border text-center"
                  >
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-primary text-sm mt-2">
                      Ver productos <ArrowLeft className="h-4 w-4 rotate-180" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-primary to-pink-400 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">¿Te gustó este artículo?</h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Descubre nuestros productos y encuentra el regalo perfecto para esa persona especial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/peluches">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                  Ver Peluches
                </Button>
              </Link>
              <a href="https://wa.me/573112814787" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold gap-2">
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Artículos Relacionados</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border"
                >
                  <div className="relative aspect-video bg-gray-50">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-primary font-medium uppercase tracking-wide">{related.category}</span>
                    <h3 className="font-semibold text-lg mt-1 group-hover:text-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{related.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
