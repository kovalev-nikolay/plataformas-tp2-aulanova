import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createUserRequest,
  createCourseRequest,
  deleteCourseRequest,
  deleteUserRequest,
  getClassesRequest,
  getCoursesRequest,
  getUsersRequest,
  updateCourseRequest,
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

function normalizarCurso(course) {
  return {
    id: course.id,
    nombre: course.nombre,
    idioma: course.idioma,
    nivel: course.nivel,
    profesorId: Number(course.profesor_id ?? course.profesorId),
  }
}

function normalizarClase(clase) {
  return {
    id: clase.id,
    courseId: Number(clase.curso_id ?? clase.courseId),
    titulo: clase.titulo,
    fecha: clase.fecha,
    hora: clase.hora,
    aula: clase.aula,
  }
}

function AdminDashboard() {
  const { currentUser, logout } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const profesores = usuarios.filter(
    (user) => user.rol === 'profesor' && user.activo,
  )
  const [cursos, setCursos] = useState([])
  const [formUsuario, setFormUsuario] = useState(usuarioVacio)
  const [formCurso, setFormCurso] = useState({
    nombre: '',
    idioma: '',
    nivel: '',
    profesorId: '',
  })
  const [cursoEditandoId, setCursoEditandoId] = useState(null)
  const [mensajeUsuarios, setMensajeUsuarios] = useState('')
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true)
  const [procesandoUsuario, setProcesandoUsuario] = useState(false)
  const [usuarioEditandoId, setUsuarioEditandoId] = useState(null)
  const [cargandoCursos, setCargandoCursos] = useState(true)
  const [procesandoCurso, setProcesandoCurso] = useState(false)
  const [mensajeCursos, setMensajeCursos] = useState('')
  const [clases, setClases] = useState([])
  const [cargandoClases, setCargandoClases] = useState(true)
  const [mensajeClases, setMensajeClases] = useState('')

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

  useEffect(() => {
    async function cargarClases() {
      try {
        const data = await getClassesRequest()
        const lista = data.clases || data
        setClases(lista.map(normalizarClase))
      } catch (error) {
        setMensajeClases(error.message)
      } finally {
        setCargandoClases(false)
      }
    }

    cargarClases()
  }, [])

  useEffect(() => {
    async function cargarCursos() {
      try {
        const data = await getCoursesRequest()
        const lista = data.cursos || data
        setCursos(lista.map(normalizarCurso))
      } catch (error) {
        setMensajeCursos(error.message)
      } finally {
        setCargandoCursos(false)
      }
    }

    cargarCursos()
  }, [])

  useEffect(() => {
    if (!formCurso.profesorId && profesores.length) {
      setFormCurso((form) => ({ ...form, profesorId: profesores[0].id }))
    }
  }, [formCurso.profesorId, profesores])

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
    setFormCurso({
      nombre: '',
      idioma: '',
      nivel: '',
      profesorId: profesores[0]?.id || '',
    })
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

  async function guardarCurso(event) {
    event.preventDefault()

    if (procesandoCurso) return

    if (
      !formCurso.nombre ||
      !formCurso.idioma ||
      !formCurso.nivel ||
      !formCurso.profesorId
    ) {
      return
    }

    setMensajeCursos('')
    setProcesandoCurso(true)

    try {
      if (cursoEditandoId) {
        const data = await updateCourseRequest(cursoEditandoId, formCurso)
        const cursoActualizado = normalizarCurso(data.curso || data)
        setCursos((lista) =>
          lista.map((course) =>
            course.id === cursoEditandoId ? cursoActualizado : course,
          ),
        )
      } else {
        const data = await createCourseRequest(formCurso)
        const nuevoCurso = normalizarCurso(data.curso || data)
        setCursos((lista) => [...lista, nuevoCurso])
      }

      limpiarFormulario()
    } catch (error) {
      setMensajeCursos(error.message)
    } finally {
      setProcesandoCurso(false)
    }
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

  async function eliminarCurso(courseId) {
    if (procesandoCurso || !window.confirm('¿Eliminar este curso?')) return

    setMensajeCursos('')
    setProcesandoCurso(true)

    try {
      await deleteCourseRequest(courseId)
      setCursos((lista) => lista.filter((course) => course.id !== courseId))

      if (cursoEditandoId === courseId) limpiarFormulario()
    } catch (error) {
      setMensajeCursos(error.message)
    } finally {
      setProcesandoCurso(false)
    }
  }

  function nombreProfesor(profesorId) {
    return (
      usuarios.find((user) => user.id === profesorId)?.nombre || 'Sin profesor'
    )
  }

  function nombreCurso(courseId) {
    return (
      cursos.find((course) => course.id === courseId)?.nombre ||
      'Curso no disponible'
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
          <span>{clases.length}</span>
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
            <button
              type="submit"
              className="boton-principal"
              disabled={procesandoCurso || !profesores.length}
            >
              {procesandoCurso
                ? 'Procesando...'
                : cursoEditandoId
                  ? 'Guardar cambios'
                  : 'Agregar curso'}
            </button>
            {cursoEditandoId && (
              <button
                type="button"
                className="boton-secundario"
                disabled={procesandoCurso}
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {mensajeCursos && <p className="mensaje-error">{mensajeCursos}</p>}

        <div className="lista-simple">
          {cargandoCursos && <p>Cargando cursos...</p>}
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
                  disabled={procesandoCurso}
                  onClick={() => editarCurso(course)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-chico boton-peligro"
                  disabled={procesandoCurso}
                  onClick={() => eliminarCurso(course.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Clases</h2>

        {mensajeClases && <p className="mensaje-error">{mensajeClases}</p>}

        <div className="lista-simple">
          {cargandoClases && <p>Cargando clases...</p>}
          {!cargandoClases && !mensajeClases && clases.length === 0 && (
            <p>No hay clases registradas.</p>
          )}
          {clases.map((clase) => (
            <article className="lista-item" key={clase.id}>
              <strong>{clase.titulo}</strong>
              <span>
                {clase.fecha} · {clase.hora}
              </span>
              <span>Aula: {clase.aula}</span>
              <span>Curso: {nombreCurso(clase.courseId)}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
