const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api'

async function authenticatedRequest(path, options = {}) {
  const token = localStorage.getItem('aulanova_token')
  const headers = {
    Authorization: `Bearer ${token}`,
    ...options.headers,
  }

  if (options.body) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

export async function loginRequest(email, contrasena) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contrasena }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}

export function getUsersRequest() {
  return authenticatedRequest('/users')
}

export function createUserRequest(usuario) {
  return authenticatedRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: usuario.contrasena,
      rol: usuario.rol,
    }),
  })
}

export function updateUserRequest(id, usuario) {
  return authenticatedRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      activo: usuario.activo,
    }),
  })
}

export function deleteUserRequest(id) {
  return authenticatedRequest(`/users/${id}`, { method: 'DELETE' })
}

export function getCoursesRequest() {
  return authenticatedRequest('/courses')
}

export function createCourseRequest(curso) {
  return authenticatedRequest('/courses', {
    method: 'POST',
    body: JSON.stringify({
      nombre: curso.nombre,
      idioma: curso.idioma,
      nivel: curso.nivel,
      profesorId: Number(curso.profesorId),
    }),
  })
}

export function updateCourseRequest(id, curso) {
  return authenticatedRequest(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nombre: curso.nombre,
      idioma: curso.idioma,
      nivel: curso.nivel,
      profesorId: Number(curso.profesorId),
    }),
  })
}

export function deleteCourseRequest(id) {
  return authenticatedRequest(`/courses/${id}`, { method: 'DELETE' })
}

export function getClassesRequest() {
  return authenticatedRequest('/classes')
}

export function createClassRequest(clase) {
  return authenticatedRequest('/classes', {
    method: 'POST',
    body: JSON.stringify({
      courseId: Number(clase.courseId),
      titulo: clase.titulo,
      fecha: clase.fecha,
      hora: clase.hora,
      aula: clase.aula,
    }),
  })
}

export function updateClassRequest(id, clase) {
  return authenticatedRequest(`/classes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      courseId: Number(clase.courseId),
      titulo: clase.titulo,
      fecha: clase.fecha,
      hora: clase.hora,
      aula: clase.aula,
    }),
  })
}

export function deleteClassRequest(id) {
  return authenticatedRequest(`/classes/${id}`, { method: 'DELETE' })
}
