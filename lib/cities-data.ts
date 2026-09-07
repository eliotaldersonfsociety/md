export interface City {
  name: string
  slug: string
  country: 'colombia' | 'venezuela'
  department?: string
  state?: string
}

export const cities: City[] = [
  { name: 'Bogotá', slug: 'bogota', country: 'colombia', department: 'Cundinamarca' },
  { name: 'Medellín', slug: 'medellin', country: 'colombia', department: 'Antioquia' },
  { name: 'Cali', slug: 'cali', country: 'colombia', department: 'Valle del Cauca' },
  { name: 'Barranquilla', slug: 'barranquilla', country: 'colombia', department: 'Atlántico' },
  { name: 'Cartagena', slug: 'cartagena', country: 'colombia', department: 'Bolívar' },
  { name: 'Bucaramanga', slug: 'bucaramanga', country: 'colombia', department: 'Santander' },
  { name: 'Cúcuta', slug: 'cucuta', country: 'colombia', department: 'Norte de Santander' },
  { name: 'Pereira', slug: 'pereira', country: 'colombia', department: 'Risaralda' },
  { name: 'Manizales', slug: 'manizales', country: 'colombia', department: 'Caldas' },
  { name: 'Ibagué', slug: 'ibague', country: 'colombia', department: 'Tolima' },
  { name: 'Santa Marta', slug: 'santa-marta', country: 'colombia', department: 'Magdalena' },
  { name: 'Villavicencio', slug: 'villavicencio', country: 'colombia', department: 'Meta' },
  { name: 'Pasto', slug: 'pasto', country: 'colombia', department: 'Nariño' },
  { name: 'Montería', slug: 'monteria', country: 'colombia', department: 'Córdoba' },
  { name: 'Sincelejo', slug: 'sincelejo', country: 'colombia', department: 'Sucre' },
  { name: 'Popayán', slug: 'popayan', country: 'colombia', department: 'Cauca' },
  { name: 'Tunja', slug: 'tunja', country: 'colombia', department: 'Boyacá' },
  { name: 'Florencia', slug: 'florencia', country: 'colombia', department: 'Caquetá' },
  { name: 'Neiva', slug: 'neiva', country: 'colombia', department: 'Huila' },
  { name: 'Riohacha', slug: 'riohacha', country: 'colombia', department: 'La Guajira' },
  { name: 'Armenia', slug: 'armenia', country: 'colombia', department: 'Quindío' },
  { name: 'Yopal', slug: 'yopal', country: 'colombia', department: 'Casanare' },
  { name: 'Valledupar', slug: 'valledupar', country: 'colombia', department: 'Cesar' },
  { name: 'Quibdó', slug: 'quibdo', country: 'colombia', department: 'Chocó' },
  { name: 'Mitu', slug: 'mitu', country: 'colombia', department: 'Vaupés' },
  { name: 'San José del Guaviare', slug: 'san-jose-del-guaviare', country: 'colombia', department: 'Guaviare' },
  { name: 'Inírida', slug: 'inirida', country: 'colombia', department: 'Guainía' },
  { name: 'Puerto Carreño', slug: 'puerto-carreno', country: 'colombia', department: 'Vichada' },
  { name: 'Leticia', slug: 'leticia', country: 'colombia', department: 'Amazonas' },
  { name: 'Providencia', slug: 'providencia', country: 'colombia', department: 'San Andrés' },

  { name: 'Caracas', slug: 'caracas', country: 'venezuela', state: 'Distrito Capital' },
  { name: 'Maracaibo', slug: 'maracaibo', country: 'venezuela', state: 'Zulia' },
  { name: 'Valencia', slug: 'valencia', country: 'venezuela', state: 'Carabobo' },
  { name: 'Barquisimeto', slug: 'barquisimeto', country: 'venezuela', state: 'Lara' },
  { name: 'Barcelona', slug: 'barcelona', country: 'venezuela', state: 'Anzoátegui' },
  { name: 'Maracay', slug: 'maracay', country: 'venezuela', state: 'Aragua' },
  { name: 'Ciudad Guayana', slug: 'ciudad-guayana', country: 'venezuela', state: 'Bolívar' },
  { name: 'San Cristóbal', slug: 'san-cristobal', country: 'venezuela', state: 'Táchira' },
  { name: 'Mérida', slug: 'merida', country: 'venezuela', state: 'Mérida' },
  { name: 'Barinas', slug: 'barinas', country: 'venezuela', state: 'Barinas' },
  { name: 'Maturín', slug: 'maturin', country: 'venezuela', state: 'Monagas' },
  { name: 'Coro', slug: 'coro', country: 'venezuela', state: 'Falcón' },
  { name: 'Los Teques', slug: 'los-teques', country: 'venezuela', state: 'Miranda' },
  { name: 'San Fernando de Apure', slug: 'san-fernando-de-apure', country: 'venezuela', state: 'Apure' },
  { name: 'Tucupita', slug: 'tucupita', country: 'venezuela', state: 'Delta Amacuro' },
  { name: 'Puerto Ayacucho', slug: 'puerto-ayacucho', country: 'venezuela', state: 'Amazonas' },
  { name: 'San Antonio del Táchira', slug: 'san-antonio-del-tachira', country: 'venezuela', state: 'Táchira' },
  { name: 'Rubio', slug: 'rubio', country: 'venezuela', state: 'Táchira' },
]

export function getCityBySlug(slug: string) {
  return cities.find((city) => city.slug === slug)
}

export function getCitiesByCountry(country: 'colombia' | 'venezuela') {
  return cities.filter((city) => city.country === country)
}

export function getAllCities() {
  return cities
}
