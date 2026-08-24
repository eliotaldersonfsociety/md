export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  image: string
  category: string
  date: string
  author: string
  relatedProducts?: Array<{
    name: string
    href: string
  }>
}

export const blogPosts: BlogPost[] = [
  {
    slug: "10-ideas-regalos-te-amo",
    title: "10 ideas de regalos para decirle Te Amo",
    description: "Descubre ideas de regalos originales y emocionales para expresar tu amor. Peluches, cojines y detalles que conquistan corazones.",
    content: `
      <p>Expresar amor no siempre es fácil, pero un regalo bien pensado puede decir más que mil palabras. En Fábrica de Peluches Mundo Disney creamos productos que transmiten cariño, ternura y dedicación.</p>

      <h2>1. Cojín Corazón Te Amo</h2>
      <p>Un clásico que nunca falla. Nuestro cojín con diseño "Te Amo" es suave, decorativo y perfecto para cualquier espacio. Ideal para sorprender a tu pareja en una fecha especial.</p>

      <h2>2. Peluche Personalizado</h2>
      <p>Un peluche único, diseñado exclusivamente para esa persona especial. Puedes incluir su nombre, fecha o un detalle que solo ambos entiendan.</p>

      <h2>3. Peluche Milo Gato</h2>
      <p>Uno de nuestros personajes originales más queridos. Su diseño tierno y su tamaño lo convierten en el compañero ideal para regalar.</p>

      <h2>4. Cojín Corazón Me Gustas</h2>
      <p>Para那些 etapas iniciales del amor, este cojín transmite interés y ternura sin ser demasiado intenso.</p>

      <h2>5. Lata Te Quiero</h2>
      <p>Una forma dulce y práctica de decir "Te Quiero". Perfecta para guardar dulces, notas o pequeños recuerdos.</p>

      <h2>6. Cojín Corazón Eres Especial</h2>
      <p>Hazle saber lo importante que es para ti con este cojín que celebra su singularidad.</p>

      <h2>7. Peluche Bubu Mono</h2>
      <p>Simpático y adorable, este peluche es ideal para quienes aman los diseños únicos y originales.</p>

      <h2>8. Cervical Te Amo</h2>
      <p>Un regalo práctico y emocional. Perfecto para quienes viajan mucho y necesitan comodidad con un mensaje de amor.</p>

      <h2>9. Cojín Corazón TQM</h2>
      <p>Corto, directo y muy tierno. El cojín TQM es ideal para mensajes espontáneos de cariño.</p>

      <h2>10. Arreglo Personalizado</h2>
      <p>Combina varios productos en un solo arreglo personalizado. Peluches, cojines y detalles en una presentación única.</p>

      <h2>Consejo final</h2>
      <p>Lo más importante no es el valor del regalo, sino el mensaje que transmites. En Fábrica de Peluches Mundo Disney te ayudamos a encontrar el detalle perfecto.</p>
    `,
    image: "/images/cojines/6.webp",
    category: "Ideas de regalos",
    date: "2026-01-15",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Cojín Corazón Te Amo", href: "/cojines/cojin-corazon-te-amo" },
      { name: "Peluche Milo Gato", href: "/peluches/milo-gato" },
      { name: "Peluches", href: "/peluches" },
    ],
  },
  {
    slug: "que-regalarle-pareja-cumpleanos",
    title: "Qué regalarle a tu pareja en su cumpleaños",
    description: "Guía de regalos de cumpleaños para tu pareja. Ideas originales, emocionales y prácticas que conquistan.",
    content: `
      <p>El cumpleaños de tu pareja es una oportunidad perfecta para demostrar cuánto conoces sus gustos y cuánto la valoras. Aquí te compartimos ideas que van más allá de lo convencional.</p>

      <h2>Regalos emocionales</h2>
      <p>Los peluches personalizados y los cojines con mensajes especiales son regalos que se guardan por años. No son solo objetos, son recuerdos tangibles de un momento especial.</p>

      <h2>Regalos prácticos con sentimiento</h2>
      <p>Una almohada cervical con un diseño único puede ser el regalo perfecto para esa persona que viaja mucho. Combina utilidad con un detalle emocional.</p>

      <h2>Regalos para compartir</h2>
      <p>Considera regalar experiencias o productos que ambos puedan disfrutar. Un peluche grande para la sala, un cojín decorativo para el sofá.</p>

      <h2>Personalización</h2>
      <p>En Fábrica de Peluches Mundo Disney podemos crear diseños personalizados para esa persona especial. Contáctanos para hablar de tu idea.</p>
    `,
    image: "/images/cojines/11.webp",
    category: "Cumpleaños y celebraciones",
    date: "2026-02-10",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Cojines", href: "/cojines" },
      { name: "Peluches", href: "/peluches" },
      { name: "Cervicales", href: "/cervicales" },
    ],
  },
  {
    slug: "ideas-regalos-originales-cumpleanos",
    title: "Ideas de regalos originales para cumpleaños",
    description: "Regalos originales para cumpleaños que sorprenderán a cualquier persona. Peluches, cojines, latas y detalles únicos.",
    content: `
      <p>Buscar un regalo original puede ser un desafío, pero con la guía adecuada encontrarás el detalle perfecto que sorprenda y emocione.</p>

      <h2>Peluches con historia</h2>
      <p>Nuestros personajes originales como Milo Gato, Mimi Gata y Bubu Mono tienen personalidades propias. Regalar un peluche es dar un compañero para la vida.</p>

      <h2>Cojines con mensaje</h2>
      <p>Los cojines con frases como "Feliz Cumpleaños", "Te Amo" o "Eres Especial" son regalos que combinan decoración y sentimiento.</p>

      <h2>Latas sorpresa</h2>
      <p>Perfectas para guardar dulces, monedas o notas especiales. Un regalo práctico con un toque de magia.</p>

      <h2>Arreglos personalizados</h2>
      <p>Combina varios productos en un solo arreglo. Una lata con un peluche pequeño y una nota personalizada puede ser el regalo más memorable.</p>
    `,
    image: "/images/cojines/11.webp",
    category: "Cumpleaños y celebraciones",
    date: "2026-03-05",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Latas", href: "/latas" },
      { name: "Cojines", href: "/cojines" },
    ],
  },
  {
    slug: "regalos-personalizados-empresas",
    title: "Regalos personalizados para empresas",
    description: "Regalos corporativos personalizados para empresas. Peluches, cojines, llaveros y material POP para campañas y eventos.",
    content: `
      <p>Los regalos empresariales son una herramienta poderosa para fortalecer relaciones con clientes, colaboradores y aliados. En Fábrica de Peluches Mundo Disney entendemos la importancia de la marca y la calidad.</p>

      <h2>Mascotas de marca</h2>
      <p>Diseñamos y fabricamos mascotas corporativas en felpa, perfectas para campañas de marca, eventos y ferias.</p>

      <h2>Material POP blando</h2>
      <p>Llaveros, cojines y peluches con el logo y colores de tu empresa. Ideales para regalar en lanzamientos, aniversarios o fin de año.</p>

      <h2>Kits de bienvenida</h2>
      <p>Paquetes personalizados para nuevos colaboradores. Refuerzan la cultura organizacional desde el primer día.</p>

      <h2>Pedido mínimo</h2>
      <p>Trabajamos con pedidos desde 100 unidades para peluches y 500 unidades para llaveros. Contáctanos para una cotización personalizada.</p>
    `,
    image: "/images/llaveros/1.webp",
    category: "Regalos corporativos",
    date: "2026-04-12",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Empresas", href: "/empresas" },
      { name: "Llaveros", href: "/llaveros" },
      { name: "Peluches", href: "/peluches" },
    ],
  },
  {
    slug: "ideas-detalles-parejas",
    title: "Ideas de detalles para parejas",
    description: "Detalles originales para parejas que fortalecen la relación. Regalos pequeños con gran significado emocional.",
    content: `
      <p>Los detalles pequeños son los que construyen las grandes historias. Un regalo oportuno, sin motivo aparente o para celebrar un logro, puede alegrar el día de tu pareja.</p>

      <h2>Cojines románticos</h2>
      <p>Un cojín con un mensaje de amor en el lugar favorito de tu pareja es un detalle que verá todos los días.</p>

      <h2>Peluches para recordar</h2>
      <p>Un peluche que represente un momento especial, una broma interna o simplemente un diseño que le guste.</p>

      <h2>Llaveros personalizados</h2>
      <p>Un detalle pequeño pero significativo. Ideal para llevar en la mochila o las llaves del auto.</p>

      <h2>Latas con sorpresa</h2>
      <p>Una lata decorada con dulces, una nota o un pequeño regalo. La curiosidad de abrirla ya es un regalo en sí misma.</p>
    `,
    image: "/images/cojines/28.webp",
    category: "Regalos para parejas",
    date: "2026-05-20",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Cojines", href: "/cojines" },
      { name: "Peluches", href: "/peluches" },
      { name: "Llaveros", href: "/llaveros" },
    ],
  },
  {
    slug: "como-cuidar-lavar-peluche",
    title: "Cómo cuidar y lavar un peluche correctamente",
    description: "Guía para cuidar y lavar tus peluches correctamente. Consejos de limpieza, durabilidad y mantenimiento.",
    content: `
      <p>Los peluhes son compañeros de vida que merecen cuidados especiales. Con estos consejos, tu peluche se mantendrá suave, limpio y con su color original por mucho más tiempo.</p>

      <h2>Limpieza superficial</h2>
      <p>Para manchas pequeñas, usa un paño húmedo con agua fría y jabón neutro. frota suavemente y deja secar a la sombra.</p>

      <h2>Lavado en máquina</h2>
      <p>Si la etiqueta lo permite, lava tu peluche en la máquina con agua fría y detergente suave. Usa una funda de almohada para protegerlo.</p>

      <h2>Secado</h2>
      <p>Evita la secadora. Deja secar al aire libre, preferiblemente a la sombra. El sol directo puede decolorar el tejido.</p>

      <h2>Cepillado</h2>
      <p>Un cepillo suave ayuda a mantener la textura del peluche. Cepilla en la dirección del vello para evitar enredos.</p>

      <h2>Almacenamiento</h2>
      <p>Guarda tu peluche en un lugar seco y ventilado. Evita bolsas plásticas herméticas por períodos largos.</p>
    `,
    image: "/images/arreglos/peluches/1.webp",
    category: "Peluches",
    date: "2026-06-08",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
    ],
  },
  {
    slug: "como-elegir-tamano-peluche-regalar",
    title: "Cómo elegir el tamaño de un peluche para regalar",
    description: "Guía para elegir el tamaño de peluche perfecto según la edad, la ocasión y la personalidad del destinatario.",
    content: `
      <p>Elegir el tamaño adecuado de un peluche puede marcar la diferencia entre un regalo memorable y uno que pasa desapercibido. Considera estos factores:</p>

      <h2>Edad del destinatario</h2>
      <p>Para niños pequeños, un peluche mediano (40cm) es ideal: fácil de abrazar y transportar. Para adolescentes y adultos, un peluche grande (60cm o más) puede ser un detalle sorpresa.</p>

      <h2>Ocasión</h2>
      <p>Para cumpleaños infantiles, un peluche grande es siempre un éxito. Para un detalle romántico, un peluche mediano acompañado de una carta o cojín es perfecto.</p>

      <h2>Espacio disponible</h2>
      <p>Considera dónde guardará el peluche. Si la persona tiene espacio limitado, un peluche mediano es más práctico.</p>

      <h2>Personalidad</h2>
      <p>Algunas personas prefieren peluches pequeños y coleccionables. Otras aman los peluches grandes para abrazar en el sofá.</p>

      <h2>Nuestras opciones</h2>
      <p>En Fábrica de Peluches Mundo Disney ofrecemos tamaños de 40cm, 60cm y 100cm. Cada tamaño tiene su encanto y precio. Visita nuestra categoría de peluches para ver todas las opciones.</p>
    `,
    image: "/images/arreglos/peluches/3.webp",
    category: "Peluches",
    date: "2026-07-14",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Peluche Milo Gato", href: "/peluches/milo-gato" },
    ],
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllPosts() {
  return blogPosts
}
