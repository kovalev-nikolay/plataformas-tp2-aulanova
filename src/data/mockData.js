export const users = [
  {
    id: 1,
    nombre: 'Sofia Admin',
    email: 'admin@aulanova.com',
    rol: 'admin',
  },
  {
    id: 2,
    nombre: 'Martin Profesor',
    email: 'profesor@aulanova.com',
    rol: 'profesor',
  },
  {
    id: 3,
    nombre: 'Lucia Alumna',
    email: 'alumno@aulanova.com',
    rol: 'alumno',
  },
]

export const courses = [
  {
    id: 1,
    nombre: 'Ingles inicial',
    idioma: 'Ingles',
    nivel: 'A1',
    profesorId: 2,
    alumnosIds: [3],
  },
  {
    id: 2,
    nombre: 'Frances conversacion',
    idioma: 'Frances',
    nivel: 'A2',
    profesorId: 2,
    alumnosIds: [3],
  },
  {
    id: 3,
    nombre: 'Portugues para viajeros',
    idioma: 'Portugues',
    nivel: 'Inicial',
    profesorId: 2,
    alumnosIds: [],
  },
]

export const classes = [
  {
    id: 1,
    courseId: 1,
    titulo: 'Presentaciones personales',
    fecha: '2026-07-06',
    hora: '18:00',
    aula: 'Aula 1',
  },
  {
    id: 2,
    courseId: 1,
    titulo: 'Verbo to be',
    fecha: '2026-07-08',
    hora: '18:00',
    aula: 'Aula 1',
  },
  {
    id: 3,
    courseId: 2,
    titulo: 'Charla sobre rutinas',
    fecha: '2026-07-07',
    hora: '19:30',
    aula: 'Aula 2',
  },
  {
    id: 4,
    courseId: 3,
    titulo: 'Saludos y frases utiles',
    fecha: '2026-07-09',
    hora: '17:00',
    aula: 'Aula 3',
  },
]
