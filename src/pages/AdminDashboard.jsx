import { useEffect, useState } from 'react'
import { classes, courses } from '../data/mockData'
import { useAuth } from '../context/AuthContext'
import {
  createUserRequest,
  deleteUserRequest,
  getUsersRequest,
  updateUserRequest,
} from '../services/api'

const usuarioVacio = {
  nombre: '',
  email: '',
  password: '',
  rol: 'alumno',
  activo: true,
}

function normalizarUsuario(user) {
  const { password: _password, contrasena: _contrasena, ...usuario } = user
  return { ...usuario, activo: Boolean(usuario.activo) }
}

function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const [usuarios, setUsuarios] = useState([])
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
  const [mensajeUsuarios, setMensajeUsuarios] = useState('')
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
  const [procesandoUsuario, setProcesandoUsuario] = useState(false)
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null)

  useEffect(() => {
    async function cargarUsuarios() {
      try {
        const data = await getUsersRequest()
        const lista = data.usuarios || data
        setUsuarios(lista.map(normalizarUsuario))
      } catch (error) {
        setMensajeUsuarios(error.message)
      } finally {
        setCargandoUsuarios(false)
      }
    }

    cargarUsuarios()
  }, [])

  function handleUsuarioChange(event) {
    const { name, value, checked, type } = event.target
    setFormUsuario({
      ...formUsuario,
      [name]: type === 'checkbox' ? checked : value,
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

  async function guardarUsuario(event) {
    event.preventDefault()

    if (procesandoUsuario) return

    setMensajeUsuarios('')

    if (
      !formUsuario.nombre ||
      !formUsuario.email ||
      (!usuarioEditandoId && !formUsuario.password)
    ) {
      return
    }

    setProcesandoUsuario(true)

    try {
      if (usuarioEditandoId) {
        const data = await updateUserRequest(usuarioEditandoId, formUsuario)
        const usuarioActualizado = normalizarUsuario(data.usuario || data)
        setUsuarios((lista) =>
          lista.map((user) =>
            user.id === usuarioEditandoId ? usuarioActualizado : user,
          ),
        )
      } else {
        const data = await createUserRequest({
          ...formUsuario,
          contrasena: formUsuario.password,
        })
        const nuevoUsuario = normalizarUsuario(data.usuario || data)
        setUsuarios((lista) => [...lista, nuevoUsuario])
      }

      setFormUsuario(usuarioVacio)
      setUsuarioEditandoId(null)
    } catch (error) {
      setMensajeUsuarios(error.message)
    } finally {
      setProcesandoUsuario(false)
    }
  }

  function editarUsuario(user) {
    setMensajeUsuarios('')
    setUsuarioEditandoId(user.id)
    setFormUsuario({
      nombre: user.nombre,
      email: user.email,
      password: '',
      rol: user.rol,
      activo: Boolean(user.activo),
    })
  }

  async function eliminarUsuario(userId) {
    if (procesandoUsuario || !window.confirm('¿Eliminar este usuario?')) return

    setMensajeUsuarios('')
    setProcesandoUsuario(true)

    try {
      await deleteUserRequest(userId)
      setUsuarios((lista) => lista.filter((user) => user.id !== userId))
      if (usuarioEditandoId === userId) {
        setFormUsuario(usuarioVacio)
        setUsuarioEditandoId(null)
      }
    } catch (error) {
      setMensajeUsuarios(error.message)
    } finally {
      setProcesandoUsuario(false)
    }
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
        <form className="admin-form" onSubmit={guardarUsuario}>
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

          {!usuarioEditandoId && (
            <label>
              Password
              <input
                type="password"
                name="password"
                value={formUsuario.password}
                onChange={handleUsuarioChange}
                placeholder="Contraseña inicial"
              />
            </label>
          )}

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

          {usuarioEditandoId && (
            <label>
              Activo
              <input
                type="checkbox"
                name="activo"
                checked={formUsuario.activo}
                onChange={handleUsuarioChange}
              />
            </label>
          )}

          <div className="acciones-form">
            <button
              type="submit"
              className="boton-principal"
              disabled={procesandoUsuario}
            >
              {procesandoUsuario
                ? 'Procesando...'
                : usuarioEditandoId
                  ? 'Guardar cambios'
                  : 'Agregar usuario'}
            </button>
            {usuarioEditandoId && (
              <button
                type="button"
                className="boton-secundario"
                disabled={procesandoUsuario}
                onClick={() => {
                  setFormUsuario(usuarioVacio)
                  setUsuarioEditandoId(null)
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {mensajeUsuarios && <p className="mensaje-error">{mensajeUsuarios}</p>}

        <div className="lista-simple">
          {cargandoUsuarios && <p>Cargando usuarios...</p>}
          {usuarios.map((user) => (
            <article className="lista-item" key={user.id}>
              <strong>{user.nombre}</strong>
              <span>{user.email}</span>
              <span className="etiqueta">{user.rol}</span>
              <span>{user.activo ? 'Activo' : 'Inactivo'}</span>
              <div className="acciones-item">
                <button
                  type="button"
                  className="boton-chico"
                  disabled={procesandoUsuario}
                  onClick={() => editarUsuario(user)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-chico boton-peligro"
                  disabled={procesandoUsuario}
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
