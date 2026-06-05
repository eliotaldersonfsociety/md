"use client"

import React from 'react';

// Tipado opcional si usas TypeScript, si usas JavaScript puedes borrar esta interfaz
interface LineaProducto {
  linea: string;
  descripcion: string;
  materiales: string;
  minimo: string;
}

export default function DesarrollosCorporativos() {
  const lineasProducto: LineaProducto[] = [
    {
      linea: "Peluches Personalizados",
      descripcion: "Réplicas exactas de personajes corporativos o diseños a la medida.",
      materiales: "Felpa hipoalergénica extra suave, relleno de fibra siliconada.",
      minimo: "100 unidades"
    },
    {
      linea: "Llaveros y Miniaturas",
      descripcion: "Detalles promocionales compactos de alto impacto y distribución masiva.",
      materiales: "Micro-felpa bordada, PVC inyectado, herrajes de seguridad.",
      minimo: "500 unidades"
    },
    {
      linea: "Cojines y Elementos de Confort",
      descripcion: "Productos decorativos y funcionales para espacios de oficina u hogar.",
      materiales: "Telas antifluido, lona premium, bordados computarizados de alta definición.",
      minimo: "50 unidades"
    },
    {
      linea: "Kits Corporativos Mixtos",
      descripcion: "Combinaciones de peluche institucional con agendas, tazas o empaques especiales.",
      materiales: "Materiales mixtos con certificación de calidad Pelanas.",
      minimo: "30 kits"
    }
  ];

  const pasosProceso = [
    { titulo: "Briefing Inicial", desc: "Levantamiento de requerimientos, objetivos de la campaña, presupuesto y manual de identidad corporativa." },
    { titulo: "Diseño y Modelado 2D/3D", desc: "Presentación de propuestas visuales y planos de confección digital por parte de nuestro equipo creativo." },
    { titulo: "Desarrollo de Prototipo", desc: "Elaboración de una muestra física real para la validación de texturas, dimensiones, colores y acabados finales." },
    { titulo: "Producción en Masa", desc: "Fabricación industrial bajo estrictas normativas de seguridad y acabados de alta costura con control de calidad." },
    { titulo: "Logística y Entrega", desc: "Distribución centralizada o atomizada a nivel nacional según la planeación del proyecto." }
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pelanas <span className="text-lime-400">Desarrollos Corporativos</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Conectamos a las organizaciones con sus clientes, colaboradores y aliados estratégicos a través de experiencias emocionales y productos promocionales de alta calidad.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 space-y-20">
        
        {/* Servicios */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Nuestros Servicios Corporativos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-2">Diseño de Mascotas de Marca</h3>
              <p className="text-slate-600">Conceptualización y fabricación en felpa o materiales especiales de la mascota oficial de su empresa.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-2">Regalos Empresariales de Temporada</h3>
              <p className="text-slate-600">Detalles exclusivos y personalizados para Fin de Año, Día de la Madre, Padre y aniversarios corporativos.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-2">Material POP y Merchandising</h3>
              <p className="text-slate-600">Desarrollo de productos promocionales blandos alineados estrictamente con el manual de identidad de la organización.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-xl text-slate-800 mb-2">Kits de Bienvenida (Onboarding)</h3>
              <p className="text-slate-600">Paquetes de productos diseñados para nuevos colaboradores que refuerzan la cultura organizacional desde el primer día.</p>
            </div>
          </div>
        </section>

        {/* Tabla de Productos */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Líneas de Producto y Especificaciones</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-700">Línea de Producto</th>
                  <th className="p-4 font-bold text-slate-700">Descripción General</th>
                  <th className="p-4 font-bold text-slate-700">Materiales e Insumos</th>
                  <th className="p-4 font-bold text-slate-700">Pedido Mínimo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineasProducto.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-semibold text-slate-900">{item.linea}</td>
                    <td className="p-4 text-slate-600">{item.descripcion}</td>
                    <td className="p-4 text-slate-600">{item.materiales}</td>
                    <td className="p-4"><span className="bg-lime-100 text-lime-800 text-xs font-semibold px-2.5 py-1 rounded-full">{item.minimo}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Proceso de Co-Creación */}
        <section className="bg-slate-900 text-white p-8 md:p-12 rounded-2xl shadow-inner">
          <h2 className="text-3xl font-bold mb-10 text-center">Proceso de Co-Creación y Desarrollo</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {pasosProceso.map((paso, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-lg shadow-lime-400/20">
                  {index + 1}
                </div>
                <h3 className="font-bold text-lg text-slate-100">{paso.titulo}</h3>
                <p className="text-sm text-slate-400">{paso.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Formulario de Cotización */}
        <section className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Solicitud de Cotización Empresarial</h2>
          <p className="text-slate-500 text-center mb-6">Completa los datos esenciales para iniciar la planeación de tu proyecto.</p>
          
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()} action="#">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Razón Social</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent" placeholder="Empresa S.A.S." />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">NIT / Identificación</label>
                <input type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent" placeholder="900.000.000-1" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Desarrollo</label>
              <select className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent">
                <option>Mascota de Marca (Peluche)</option>
                <option>Regalos de Temporada</option>
                <option>Material POP Blando</option>
                <option>Kits de Bienvenida Mixtos</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Volumen Estimado</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent" placeholder="Cantidad de unidades" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Entrega Ideal</label>
                <input type="date" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent" />
              </div>
            </div>
            <button type="submit" className="w-full bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors shadow-md mt-2">
              Enviar Solicitud
            </button>
          </form>
        </section>

      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        &copy; {new Date().getFullYear()} Pelanas. Todos los derechos reservados. División Corporativa.
      </footer>
    </div>
  );
}