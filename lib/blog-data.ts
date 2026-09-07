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
  {
    slug: "regalos-amor-amistad-colombia-2026",
    title: "10 regalos para el Día del Amor y la Amistad en Colombia 2026",
    description: "Descubre los mejores regalos para el 19 de septiembre en Colombia. Peluches personalizados, cojines románticos y detalles únicos para celebrar el Amor y la Amistad.",
    content: `
      <p>El 19 de septiembre es una fecha especial para celebrar el amor y la amistad en Colombia. Si buscas un regalo que emocione y perdure, aquí tienes 10 ideas pensadas para sorprender a tu pareja, amigos o compañeros.</p>

      <h2>1. Peluche personalizado con nombre</h2>
      <p>Un peluche con el nombre de esa persona especial es un regalo directo, emotivo y muy recordado. Ideal para parejas y amigos cercanos.</p>

      <h2>2. Cojín con mensaje romántico</h2>
      <p>Los cojines con frases como "Te Amo", "TQM" o "Eres Especial" son regalos que decoran y transmiten sentimientos al mismo tiempo.</p>

      <h2>3. Peluche grande para abrazar</h2>
      <p>Un peluche de 60cm o más se convierte en compañero de sofá y en un recuerdo tangible de esta fecha. Perfecto para quienes aman los abrazos.</p>

      <h2>4. Arreglo de peluches pequeños</h2>
      <p>Combina varios peluches en un solo arreglo. Es ideal para grupos de amigos, compañeros de trabajo o para sorprender a tu pareja con varios detalles.</p>

      <h2>5. Lata personalizada con sorpresa</h2>
      <p>Una lata decorada con dulces, notas o pequeños regalos es una experiencia de apertura que genera expectativa y alegría.</p>

      <h2>6. Cervical con frase especial</h2>
      <p>Un regalo práctico y emocional para quienes viajan mucho. Combina utilidad con un mensaje de cariño único.</p>

      <h2>7. Peluche temático para amigos</h2>
      <p>Si buscas algo más divertido y menos romántico, elige un peluche con una personalidad que represente la amistad.</p>

      <h2>8. Cojín para oficina o estudio</h2>
      <p>Un cojín decorativo para el espacio de trabajo o estudio es un detalle que la persona verá todos los días y le recordará a ti.</p>

      <h2>9. Regalo corporativo para tu equipo</h2>
      <p>Si quieres celebrar con tus compañeros, un peluche o cojín personalizado con el nombre del equipo es una opción original y cohesionadora.</p>

      <h2>10. Cotiza un regalo 100% personalizado</h2>
      <p>En Fábrica de Peluches Mundo Disney creamos diseños exclusivos para el Día del Amor y la Amistad. Contáctanos y creamos juntos el regalo perfecto.</p>

      <h2>Consejo final</h2>
      <p>No esperes al último día. Hacer tu pedido con anticipación garantiza entrega a tiempo y más opciones de personalización.</p>
    `,
    image: "/images/arreglos/peluches/1.webp",
    category: "Amor y Amistad",
    date: "2026-09-07",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "sorprender-mejor-amiga-amor-amistad",
    title: "Cómo sorprender a tu mejor amiga en el Día del Amor y la Amistad",
    description: "Ideas originales y emotivas para sorprender a tu mejor amiga el 19 de septiembre. Regalos que representan una amistad verdadera.",
    content: `
      <p>La amistad es uno de los vínculos más bonitos de la vida. El Día del Amor y la Amistad es la excusa perfecta para celebrarla con un detalle que le haga sentir lo importante que es para ti.</p>

      <h2>Peluches que representen su personalidad</h2>
      <p>Elige un peluche con una personalidad que se parezca a tu amiga: divertida, tierna, creativa o valiente. Ese detalle demuestra que la conoces profundamente.</p>

      <h2>Cojines con frases de amistad</h2>
      <p>Un cojín con un mensaje que solo ustedes entiendan puede convertirse en un objeto sentimental muy valioso.</p>

      <h2>Arreglos pequeños pero significativos</h2>
      <p>No necesitas gastar mucho. Un peluche pequeño con una nota escrita a mano puede significar más que cualquier regalo costoso.</p>

      <h2>Regalos para compartir</h2>
      <p>Considera regalar algo que puedan disfrutar juntas: un peluche para su oficina, un cojín para su habitación o una lata con sus dulces favoritos.</p>

      <h2>Personalización</h2>
      <p>Agregar su nombre, una fecha especial o un chiste interno convierte cualquier producto en un regalo único. En Mundo Disney te ayudamos a personalizarlo.</p>
    `,
    image: "/images/arreglos/peluches/2.webp",
    category: "Amor y Amistad",
    date: "2026-09-08",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "peluches-personalizados-19-septiembre",
    title: "Peluches personalizados para el 19 de septiembre: ideas únicas",
    description: "Ideas de peluches personalizados para el Día del Amor y la Amistad en Colombia. Crea un regalo único y emotivo para el 19 de septiembre.",
    content: `
      <p>Los peluches personalizados son una de las mejores opciones para el 19 de septiembre. Combinan ternura, originalidad y un mensaje directo al corazón. Aquí te contamos cómo aprovecharlos al máximo.</p>

      <h2>¿Qué se puede personalizar?</h2>
      <p>En Fábrica de Peluches Mundo Disney agregamos nombres, fechas, frases cortas y diseños especiales. Desde un simple "Te Amo" hasta una fecha inolvidable.</p>

      <h2>Ideas por destinatario</h2>
      <p>Para tu pareja, un peluche con una fecha especial. Para un amigo, un peluche con un chiste interno. Para un compañero, un peluche con el nombre del equipo o una frase motivacional.</p>

      <h2>¿Qué peluche elegir?</h2>
      <p>Tenemos personajes originales como Milo Gato, Mimi Gata, Bubu Mono y muchos más. Cada uno tiene su propia personalidad y tamaño.</p>

      <h2>Tiempo de entrega</h2>
      <p>Para el 19 de septiembre, te recomendamos hacer tu pedido con al menos 5 días hábiles de anticipación. Así garantizas la entrega a tiempo y la personalización sin apuros.</p>

      <h2>Cotiza tu idea</h2>
      <p>Contáctanos por WhatsApp o a través de nuestro formulario. Cuéntanos tu idea y te ayudamos a crear el peluche perfecto.</p>
    `,
    image: "/images/arreglos/peluches/4.webp",
    category: "Amor y Amistad",
    date: "2026-09-09",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Contacto", href: "/contacto" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "regalos-pareja-amor-amistad",
    title: "Regalos para tu pareja en el Día del Amor y la Amistad: opciones creativas",
    description: "Regalos creativos y emotivos para tu pareja el 19 de septiembre. Ideas que van más allá de lo tradicional y conquistan corazones.",
    content: `
      <p>El Día del Amor y la Amistad no solo es para celebrar a tu pareja, sino también para recordarle lo mucho que la quieres. Aquí tienes opciones creativas que van más allá de lo tradicional.</p>

      <h2>Cojines románticos</h2>
      <p>Un cojín con un mensaje de amor en la cama o el sofá es un detalle que verá todos los días y le recordará a ti.</p>

      <h2>Peluches personalizados</h2>
      <p>Un peluche con su nombre o una fecha especial es un regalo que guardará por siempre. Puedes elegir entre tamaños de 40cm, 60cm y 100cm.</p>

      <h2>Arreglos combinados</h2>
      <p>Combina peluches, cojines y detalles en un solo arreglo. Es una forma de dar varios regalos en una presentación hermosa.</p>

      <h2>Regalos experienciales</h2>
      <p>Un peluche acompañado de una carta, una cena o una salida especial convierte un regalo material en un recuerdo inolvidable.</p>

      <h2>Personalización</h2>
      <p>En Fábrica de Peluches Mundo Disney creamos diseños exclusivos. Cuéntanos tu idea y la hacemos realidad.</p>
    `,
    image: "/images/cojines/28.webp",
    category: "Amor y Amistad",
    date: "2026-09-10",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Cojines", href: "/cojines" },
      { name: "Peluches", href: "/peluches" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "regalar-companero-trabajo-amor-amistad",
    title: "Qué regalar a un compañero de trabajo en Amor y Amistad",
    description: "Ideas de regalos apropiados y originales para compañeros de trabajo en el Día del Amor y la Amistad. Detalles que unen sin invadir.",
    content: `
      <p>Elegir un regalo para un compañero de trabajo puede ser un reto. Quieres algo amable, apropiado y memorable, pero sin exceder límites. Aquí te ayudamos a encontrar el equilibrio perfecto.</p>

      <h2>Peluches pequeños y discretos</h2>
      <p>Un peluche pequeño para el escritorio es un detalle alegre y respetuoso. No invade el espacio personal y genera sonrisas en la oficina.</p>

      <h2>Cojines decorativos</h2>
      <p>Un cojín pequeño con un mensaje positivo es ideal para la silla de oficina o el área de descanso.</p>

      <h2>Llaveros personalizados</h2>
      <p>Un llavero con el nombre del equipo, una frase motivacional o un diseño compartido es un regalo práctico y significativo.</p>

      <h2>Latas sorpresa para compartir</h2>
      <p>Una lata con dulces o snacks para compartir en la oficina es un detalle que une sin comprometer.</p>

      <h2>Regalos grupales</h2>
      <p>Si quieres celebrar con todo el equipo, considera un cojín o peluche personalizado con el nombre del grupo. Es un regalo que fortalece la cultura del equipo.</p>
    `,
    image: "/images/llaveros/1.webp",
    category: "Amor y Amistad",
    date: "2026-09-11",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Llaveros", href: "/llaveros" },
      { name: "Peluches", href: "/peluches" },
      { name: "Empresas", href: "/empresas" },
    ],
  },
  {
    slug: "regalos-economicos-amor-amistad",
    title: "Los mejores regalos económicos para el Día del Amor y la Amistad",
    description: "Regalos económicos pero emotivos para el 19 de septiembre. Peluches pequeños, cojines y detalles que emocionan sin gastar mucho.",
    content: `
      <p>No necesitas gastar mucho para emocionar. El Día del Amor y la Amistad se trata del gesto, no del precio. Aquí tienes opciones económicas que generan un impacto grande.</p>

      <h2>Peluches pequeños</h2>
      <p>Un peluche de 40cm es económico, fácil de obsequiar y muy querido. Ideal para amigos, compañeros y fechas informales.</p>

      <h2>Cojines con frases</h2>
      <p>Un cojín con un mensaje corto y directo es un regalo decorativo y emocional a un precio accesible.</p>

      <h2>Latas decoradas</h2>
      <p>Una lata con dulces o notas es una experiencia de apertura que cuesta poco y genera mucha alegría.</p>

      <h2>Llaveros personalizados</h2>
      <p>Un detalle pequeño pero significativo. Perfecto para llevar en la mochila, las llaves o la cartera.</p>

      <h2>Consejo para ahorrar</h2>
      <p>Compra con anticipación y aprovecha promociones. En Fábrica de Peluches Mundo Disney tenemos opciones para todos los presupuestos.</p>
    `,
    image: "/images/cojines/6.webp",
    category: "Amor y Amistad",
    date: "2026-09-12",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
      { name: "Latas", href: "/latas" },
    ],
  },
  {
    slug: "armar-regalo-peluches-cojines-amor-amistad",
    title: "Cómo armar un regalo con peluches y cojines para Amor y Amistad",
    description: "Guía para armar un regalo memorable combinando peluches y cojines para el 19 de septiembre. Presentaciones, ideas y tips prácticos.",
    content: `
      <p>Combinar peluches y cojines en un solo regalo es una forma de dar un detalle completo, emotivo y decorativo. Aquí te enseñamos cómo armar el regalo perfecto para el Día del Amor y la Amistad.</p>

      <h2>Elige el tema</h2>
      <p>Define el mensaje principal: amor, amistad, gratitud o celebración. Esto te ayudará a elegir los productos y la presentación.</p>

      <h2>Selecciona los productos</h2>
      <p>Un peluche central, un cojín con frase y un detalle pequeño como una lata o llavero. La combinación ideal para sorprender.</p>

      <h2>Empaque y presentación</h2>
      <p>Usa papel decorativo, cintas y una tarjeta escrita a mano. El empaque es parte de la experiencia de regalo.</p>

      <h2>Personalización</h2>
      <p>Agrega nombres, fechas o frases personalizadas. En Fábrica de Peluches Mundo Disney te ayudamos a personalizar cada pieza.</p>

      <h2>Entrega</h2>
      <p>Si el regalo es para tu pareja, una entrega romántica aumenta el impacto. Si es para un amigo, una entrega sorpresa en el trabajo o estudio es divertida.</p>
    `,
    image: "/images/cojines/11.webp",
    category: "Amor y Amistad",
    date: "2026-09-13",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "frases-tarjetas-amor-amistad",
    title: "Frases para tarjetas de Amor y Amistad que acompañan tu regalo",
    description: "Frases emotivas y originales para tarjetas de Amor y Amistad. Complementa tu regalo con palabras que lleguen al corazón.",
    content: `
      <p>Un regalo se vuelve inolvidable cuando va acompañado de palabras sinceras. En el Día del Amor y la Amistad, una tarjeta con la frase adecuada puede emocionar más que el propio regalo.</p>

      <h2>Frases para tu pareja</h2>
      <p>"Eres mi lugar favorito", "Cada día a tu lado es un regalo", "Te amo más que ayer y menos que mañana". Frases cortas, directas y llenas de sentimiento.</p>

      <h2>Frases para un amigo</h2>
      <p>"Gracias por ser mi persona", "La amistad contigo es un tesoro", "Celebro tu vida y tu amistad". Frases que valoran el vínculo sin confundir.</p>

      <h2>Frases para compañeros</h2>
      <p>"Gracias por hacer el trabajo más ameno", "Celebro tu amistad y tu profesionalismo", "Un equipo increíble merece un regalo especial". Frases apropiadas para el entorno laboral.</p>

      <h2>Frases para familiares</h2>
      <p>"Gracias por ser mi ejemplo", "Celebro tu vida y tu amor", "Familia como la tuya no se cambia". Frases que fortalecen los lazos familiares.</p>

      <h2>Consejo</h2>
      <p>Escribe a mano. Una tarjeta escrita por ti tiene mucho más valor que cualquier frase impresa. Acompaña tu regalo con estas palabras y verás la diferencia.</p>
    `,
    image: "/images/cojines/26.webp",
    category: "Amor y Amistad",
    date: "2026-09-14",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Cojines", href: "/cojines" },
      { name: "Peluches", href: "/peluches" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
  {
    slug: "regalos-personalizados-colombia-19-septiembre",
    title: "Regalos personalizados en Colombia: tendencias para el 19 de septiembre",
    description: "Tendencias de regalos personalizados en Colombia para el Día del Amor y la Amistad. Lo que más se pide para el 19 de septiembre.",
    content: `
      <p>El 19 de septiembre es una de las fechas más importantes para los regalos personalizados en Colombia. Cada año, las tendencias se renuevan y los detalles únicos ganan más protagonismo.</p>

      <h2>Peluches con nombres</h2>
      <p>La tendencia número uno. Los peluches con el nombre de la persona son el regalo más pedido para esta fecha. Directos, emotivos y memorables.</p>

      <h2>Cojines con frases personalizadas</h2>
      <p>Los cojines con mensajes como "Te Amo", "Eres Especial" o fechas especiales siguen creciendo. Son regalos decorativos y sentimentales.</p>

      <h2>Arreglos combinados</h2>
      <p>Cada vez más personas piden arreglos que combinen peluches, cojines y detalles pequeños. Es una forma de dar un regalo completo sin limitarse a un solo producto.</p>

      <h2>Regalos para grupos</h2>
      <p>Amigos, compañeros de trabajo y equipos piden regalos personalizados grupales. Un peluche o cojín con el nombre del grupo celebra la unión.</p>

      <h2>Entrega a tiempo</h2>
      <p>La tendencia es clara: las personas quieren recibir su regalo personalizado justo el 19 de septiembre. Por eso, hacer el pedido con anticipación es clave.</p>

      <h2>Cotiza tu tendencia</h2>
      <p>En Fábrica de Peluches Mundo Disney creamos tendencias juntos. Contáctanos y hagamos tu regalo personalizado realidad.</p>
    `,
    image: "/images/arreglos/cojines/23.webp",
    category: "Amor y Amistad",
    date: "2026-09-15",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
      { name: "Peluches", href: "/peluches" },
      { name: "Contacto", href: "/contacto" },
    ],
  },
  {
    slug: "ideas-regalos-amigos-familiares-amor-amistad",
    title: "Ideas de regalos para amigos y familiares en el Día del Amor y la Amistad",
    description: "Ideas de regalos para amigos y familiares en el Día del Amor y la Amistad. Detalles que celebran todos los vínculos especiales.",
    content: `
      <p>El Día del Amor y la Amistad no es solo para parejas. En Colombia, esta fecha celebra todos los vínculos: amigos, familiares y compañeros. Aquí tienes ideas para cada relación.</p>

      <h2>Para tu mejor amiga</h2>
      <p>Un peluche con un chiste interno o un cojín con una frase que solo ustedes entiendan. Lo importante es que demuestres que conoces su personalidad.</p>

      <h2>Para tus padres</h2>
      <p>Un cojín decorativo para la sala o un peluche grande para abrazar. Detalles cálidos que representan gratitud y amor familiar.</p>

      <h2>Para tus hermanos</h2>
      <p>Un peluche divertido o una lata sorpresa. Regalos juveniles que no pierden la ternura.</p>

      <h2>Para tus compañeros de trabajo</h2>
      <p>Un peluche pequeño para el escritorio, un cojín decorativo o un llavero personalizado. Detalles apropiados que unen sin invadir.</p>

      <h2>Para tus abuelos</h2>
      <p>Un cojín suave con un mensaje de amor o un peluche tierno. Regalos que generan cercanía y recuerdos.</p>

      <h2>Consejo</h2>
      <p>No te limites a una sola categoría. Mezcla peluches, cojines y detalles según cada persona. En Fábrica de Peluches Mundo Disney te asesoramos para elegir el regalo ideal.</p>
    `,
    image: "/images/arreglos/peluches/5.webp",
    category: "Amor y Amistad",
    date: "2026-09-16",
    author: "Mundo Disney",
    relatedProducts: [
      { name: "Peluches", href: "/peluches" },
      { name: "Cojines", href: "/cojines" },
      { name: "Amor y Amistad", href: "/amor-y-amistad" },
    ],
  },
]

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

export function getAllPosts() {
  return blogPosts
}
