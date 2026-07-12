import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  createClassRequest,
  deleteClassRequest,
  getClassesRequest,
  getCoursesRequest,
  updateClassRequest,
} from '../services/api'

const claseVacia = {
  courseId: '',
  titulo: '',
  fecha: '',
  hora: '',
  aula: '',
}

function normalizarCurso(course) {
  return {
    id: Number(course.id),
    nombre: course.nombre,
    idioma: course.idioma,
    nivel: course.nivel,
    profesorId: Number(course.profesor_id ?? course.profesorId),
    profesorNombre: course.profesor_nombre ?? course.profesorNombre,
  }
}

function normalizarClase(clase) {
  return {
    id: Number(clase.id),
    courseId: Number(clase.curso_id ?? clase.courseId),
    titulo: clase.titulo,
    fecha: clase.fecha,
    hora: clase.hora,
    aula: clase.aula,
    cursoNombre: clase.curso_nombre ?? clase.cursoNombre,
  }
}

function ordenarClases(lista) {
  return [...lista].sort(
    (a, b) =>
      new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`),
  )
}

function ProfessorDashboard() {
  const { currentUser, logout } = useAuth()
  const [cursos, setCursos] = useState([])
  const [clases, setClases] = useState([])
  const [cargandoCursos, setCargandoCursos] = useState(true)
  const [cargandoClases, setCargandoClases] = useState(true)
  const [errorCursos, setErrorCursos] = useState('')
  const [errorClases, setErrorClases] = useState('')
  const [formClase, setFormClase] = useState(claseVacia)
  const [claseEditandoId, setClaseEditandoId] = useState(null)
  const [procesandoClase, setProcesandoClase] = useState(false)
  const [mensajeGestionClases, setMensajeGestionClases] = useState('')

  useEffect(() => {
    getCoursesRequest()
      .then((data) => setCursos((data.cursos || data).map(normalizarCurso)))
      .catch((error) => setErrorCursos(error.message))
      .finally(() => setCargandoCursos(false))

    getClassesRequest()
      .then((data) =>
        setClases(ordenarClases((data.clases || data).map(normalizarClase))),
      )
      .catch((error) => setErrorClases(error.message))
      .finally(() => setCargandoClases(false))
  }, [])

  useEffect(() => {
    if (!formClase.courseId && cursos.length) {
      setFormClase((form) => ({ ...form, courseId: cursos[0].id }))
    }
  }, [cursos, formClase.courseId])

  function handleClaseChange(event) {
    const { name, value } = event.target
    setFormClase({
      ...formClase,
      [name]: name === 'courseId' ? Number(value) : value,
    })
  }

  function limpiarFormularioClase() {
    setFormClase({ ...claseVacia, courseId: cursos[0]?.id || '' })
    setClaseEditandoId(null)
  }

  async function guardarClase(event) {
    event.preventDefault()

    if (procesandoClase) return

    if (Object.values(formClase).some((value) => value === '')) return

    setMensajeGestionClases('')
    setProcesandoClase(true)

    try {
      if (claseEditandoId) {
        const data = await updateClassRequest(claseEditandoId, formClase)
        const claseActualizada = normalizarClase(data.clase || data)
        setClases((lista) =>
          ordenarClases(
            lista.map((clase) =>
              clase.id === claseEditandoId ? claseActualizada : clase,
            ),
          ),
        )
      } else {
        const data = await createClassRequest(formClase)
        const nuevaClase = normalizarClase(data.clase || data)
        setClases((lista) => ordenarClases([...lista, nuevaClase]))
      }

      limpiarFormularioClase()
    } catch (error) {
      setMensajeGestionClases(error.message)
    } finally {
      setProcesandoClase(false)
    }
  }

  function editarClase(clase) {
    setMensajeGestionClases('')
    setClaseEditandoId(clase.id)
    setFormClase({
      courseId: clase.courseId,
      titulo: clase.titulo,
      fecha: clase.fecha,
      hora: clase.hora,
      aula: clase.aula,
    })
  }

  async function eliminarClase(claseId) {
    if (procesandoClase || !window.confirm('¿Eliminar esta clase?')) return

    setMensajeGestionClases('')
    setProcesandoClase(true)

    try {
      await deleteClassRequest(claseId)
      setClases((lista) => lista.filter((clase) => clase.id !== claseId))
      if (claseEditandoId === claseId) limpiarFormularioClase()
    } catch (error) {
      setMensajeGestionClases(error.message)
    } finally {
      setProcesandoClase(false)
    }
  }

  function nombreCurso(clase) {
    return (
      clase.cursoNombre ||
      cursos.find((course) => course.id === clase.courseId)?.nombre ||
      'Curso no disponible'
    )
  }

  return (
    <section className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="marca">Panel profesor</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">Tus clases y cursos asignados en AulaNova.</p>
        </div>
        <button type="button" className="boton-secundario" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <section className="resumen-grid" aria-label="Resumen general">
        <article className="resumen-card"><span>{cursos.length}</span><p>Cursos</p></article>
        <article className="resumen-card"><span>{clases.length}</span><p>Clases</p></article>
      </section>

      <section className="dashboard-section">
        <h2>Mis cursos</h2>
        {cargandoCursos && <p>Cargando cursos...</p>}
        {errorCursos && <p className="mensaje-error">{errorCursos}</p>}
        {!cargandoCursos && !errorCursos && cursos.length === 0 && <p>No tenés cursos asignados.</p>}
        <div className="lista-simple">
          {cursos.map((course) => (
            <article className="lista-item" key={course.id}>
              <strong>{course.nombre}</strong>
              <span>{course.idioma} · Nivel {course.nivel}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Mis clases</h2>
        <form className="curso-form" onSubmit={guardarClase}>
          <label>
            Curso
            <select
              name="courseId"
              value={formClase.courseId}
              onChange={handleClaseChange}
            >
              {cursos.map((course) => (
                <option value={course.id} key={course.id}>
                  {course.nombre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Título
            <input
              type="text"
              name="titulo"
              value={formClase.titulo}
              onChange={handleClaseChange}
            />
          </label>

          <label>
            Fecha
            <input
              type="date"
              name="fecha"
              value={formClase.fecha}
              onChange={handleClaseChange}
            />
          </label>

          <label>
            Hora
            <input
              type="time"
              name="hora"
              value={formClase.hora}
              onChange={handleClaseChange}
            />
          </label>

          <label>
            Aula
            <input
              type="text"
              name="aula"
              value={formClase.aula}
              onChange={handleClaseChange}
            />
          </label>

          <div className="acciones-form">
            <button
              type="submit"
              className="boton-principal"
              disabled={procesandoClase || !cursos.length}
            >
              {procesandoClase
                ? 'Procesando...'
                : claseEditandoId
                  ? 'Guardar cambios'
                  : 'Agregar clase'}
            </button>
            {claseEditandoId && (
              <button
                type="button"
                className="boton-secundario"
                disabled={procesandoClase}
                onClick={limpiarFormularioClase}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        {mensajeGestionClases && (
          <p className="mensaje-error">{mensajeGestionClases}</p>
        )}
        {cargandoClases && <p>Cargando clases...</p>}
        {errorClases && <p className="mensaje-error">{errorClases}</p>}
        {!cargandoClases && !errorClases && clases.length === 0 && <p>No tenés clases registradas.</p>}
        <div className="lista-simple">
          {clases.map((clase) => (
            <article className="lista-item" key={clase.id}>
              <strong>{clase.titulo}</strong>
              <span>{nombreCurso(clase)}</span>
              <span>{clase.fecha} · {clase.hora} · {clase.aula}</span>
              <div className="acciones-item">
                <button
                  type="button"
                  className="boton-chico"
                  disabled={procesandoClase}
                  onClick={() => editarClase(clase)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="boton-chico boton-peligro"
                  disabled={procesandoClase}
                  onClick={() => eliminarClase(clase.id)}
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

export default ProfessorDashboard
