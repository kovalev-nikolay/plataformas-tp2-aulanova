import { useState } from 'react'
import { classes, courses, users as initialUsers } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const usuarioVacio = {
    nombre: '',
    email: '',
    rol: 'alumno',
  }
  const [usuarios, setUsuarios] = useState(initialUsers)
  const profesores = usuarios.filter((user) => user.rol === 'profesor')
  const cursoVacio = {
    nombre: '',
    idioma: '',
    nivel: '',
    profesorId: profesores[0]?.id || '',
  }
  const [cursos, setCursos] = useState(courses)
  const [formUsuario, setFormUsuario] = useState(usuarioVacio)
  const [formCurso, setFormCurso] = useState(cursoVacio)
  const [cursoEditandoId, setCursoEditandoId] = useState(null)

  function handleUsuarioChange(event) {
    const { name, value } = event.target
    setFormUsuario({
      ...formUsuario,
      [name]: value,
    })
  }

  function handleFormChange(event) {
    const { name, value } = event.target
    setFormCurso({
      ...formCurso,
      [name]: name === 'profesorId' ? Number(value) : value,
    })
  }

  function limpiarFormulario() {
    setFormCurso(cursoVacio)
    setCursoEditandoId(null)
  }

  function agregarUsuario(event) {
    event.preventDefault()

    if (!formUsuario.nombre || !formUsuario.email) {
      return
    }

    const nuevoUsuario = {
      id: Date.now(),
      ...formUsuario,
    }

    setUsuarios([...usuarios, nuevoUsuario])
    setFormUsuario(usuarioVacio)
  }

  function eliminarUsuario(userId) {
    setUsuarios(usuarios.filter((user) => user.id !== userId))
  }

  function guardarCurso(event) {
    event.preventDefault()

    if (!formCurso.nombre || !formCurso.idioma || !formCurso.nivel) {
      return
    }

    if (cursoEditandoId) {
      setCursos(
        cursos.map((course) =>
          course.id === cursoEditandoId ? { ...course, ...formCurso } : course,
        ),
      )
      limpiarFormulario()
      return
    }

    const nuevoCurso = {
      id: Date.now(),
      ...formCurso,
      alumnosIds: [],
    }

    setCursos([...cursos, nuevoCurso])
    limpiarFormulario()
  }

  function editarCurso(course) {
    setCursoEditandoId(course.id)
    setFormCurso({
      nombre: course.nombre,
      idioma: course.idioma,
      nivel: course.nivel,
      profesorId: course.profesorId,
    })
  }

  function eliminarCurso(courseId) {
    setCursos(cursos.filter((course) => course.id !== courseId))

    if (cursoEditandoId === courseId) {
      limpiarFormulario()
    }
  }

  function nombreProfesor(profesorId) {
    return (
      usuarios.find((user) => user.id === profesorId)?.nombre || 'Sin profesor'
    )
  }

  return (
    <section className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="marca">Panel admin</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">
            Resumen general de AulaNova para gestionar la escuela.
          </p>
        </div>
        <button type="button" className="boton-secundario" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <section className="resumen-grid" aria-label="Resumen general">
        <article className="resumen-card">
          <span>{usuarios.length}</span>
          <p>Usuarios</p>
        </article>
        <article className="resumen-card">
          <span>{cursos.length}</span>
          <p>Cursos</p>
        </article>
        <article className="resumen-card">
          <span>{classes.length}</span>
          <p>Clases</p>
        </article>
      </section>

      <section className="dashboard-section">
        <h2>Usuarios</h2>
        <form className="admin-form" onSubmit={agregarUsuario}>
          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              value={formUsuario.nombre}
              onChange={handleUsuarioChange}
              placeholder="Nombre y apellido"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formUsuario.email}
              onChange={handleUsuarioChange}
              placeholder="usuario@aulanova.com"
            />
          </label>

          <label>
            Rol
            <select
              name="rol"
              value={formUsuario.rol}
              onChange={handleUsuarioChange}
            >
              <option value="admin">admin</option>
              <option value="profesor">profesor</option>
              <option value="alumno">alumno</option>
            </select>
          </label>

          <div className="acciones-form">
            <button type="submit" className="boton-principal">
              Agregar usuario
            </button>
          </div>
        </form>

        <div className="lista-simple">
          {usuarios.map((user) => (
            <article className="lista-item" key={user.id}>
              <strong>{user.nombre}</strong>
              <span>{user.email}</span>
              <span className="etiqueta">{user.rol}</span>
              <div className="acciones-item">
                <button
                  type="button"
                  className="boton-chico boton-peligro"
                  onClick={() => eliminarUsuario(user.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Cursos</h2>
        <form className="curso-form" onSubmit={guardarCurso}>
          <label>
            Nombre del curso
            <input
              type="text"
              name="nombre"
              value={formCurso.nombre}
              onChange={handleFormChange}
              placeholder="Inglés inicial"
            />
          </label>

          <label>
            Idioma
            <input
              type="text"
              name="idioma"
              value={formCurso.idioma}
              onChange={handleFormChange}
              placeholder="Inglés"
            />
          </label>

          <label>
            Nivel
            <input
              type="text"
              name="nivel"
              value={formCurso.nivel}
              onChange={handleFormChange}
              placeholder="A1"
            />
          </label>

          <label>
            Profesor
            <select
              name="profesorId"
              value={formCurso.profesorId}
              onChange={handleFormChange}
            >
              {profesores.map((profesor) => (
                <option value={profesor.id} key={profesor.id}>
                  {profesor.nombre}
                </option>
              ))}
            </select>
          </label>

          <div className="acciones-form">
            <button type="submit" className="boton-principal">
              {cursoEditandoId ? 'Guardar cambios' : 'Agregar curso'}
            </button>
            {cursoEditandoId && (
              <button
                type="button"
                className="boton-secundario"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="lista-simple">
          {cursos.map((course) => (
            <article className="lista-item" key={course.id}>
              <strong>{course.nombre}</strong>
              <span>
                {course.idioma} · Nivel {course.nivel}
              </span>
              <span>Profesor: {nombreProfesor(course.profesorId)}</span>
              <div className="acciones-item">
                <button
                  type="button"
                  className="boton-chico"
                  onClick={() => editarCurso(course)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-chico boton-peligro"
                  onClick={() => eliminarCurso(course.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
