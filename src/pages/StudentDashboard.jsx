import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getClassesRequest, getCoursesRequest } from '../services/api'

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

function StudentDashboard() {
  const { currentUser, logout } = useAuth()
  const [cursos, setCursos] = useState([])
  const [clases, setClases] = useState([])
  const [cargandoCursos, setCargandoCursos] = useState(true)
  const [cargandoClases, setCargandoClases] = useState(true)
  const [errorCursos, setErrorCursos] = useState('')
  const [errorClases, setErrorClases] = useState('')

  useEffect(() => {
    getCoursesRequest()
      .then((data) => setCursos((data.cursos || data).map(normalizarCurso)))
      .catch((error) => setErrorCursos(error.message))
      .finally(() => setCargandoCursos(false))

    getClassesRequest()
      .then((data) => {
        const lista = (data.clases || data).map(normalizarClase)
        lista.sort((a, b) => new Date(`${a.fecha}T${a.hora}`) - new Date(`${b.fecha}T${b.hora}`))
        setClases(lista)
      })
      .catch((error) => setErrorClases(error.message))
      .finally(() => setCargandoClases(false))
  }, [])

  function nombreCurso(clase) {
    return clase.cursoNombre || cursos.find((course) => course.id === clase.courseId)?.nombre || 'Curso no disponible'
  }

  return (
    <section className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="marca">Panel alumno</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">Tus cursos y clases en AulaNova.</p>
        </div>
        <button type="button" className="boton-secundario" onClick={logout}>Cerrar sesión</button>
      </div>

      <section className="resumen-grid" aria-label="Resumen general">
        <article className="resumen-card"><span>{cursos.length}</span><p>Cursos</p></article>
        <article className="resumen-card"><span>{clases.length}</span><p>Clases</p></article>
      </section>

      <section className="dashboard-section">
        <h2>Mis cursos</h2>
        {cargandoCursos && <p>Cargando cursos...</p>}
        {errorCursos && <p className="mensaje-error">{errorCursos}</p>}
        {!cargandoCursos && !errorCursos && cursos.length === 0 && <p>No estás inscripto en ningún curso.</p>}
        <div className="lista-simple">
          {cursos.map((course) => (
            <article className="lista-item" key={course.id}>
              <strong>{course.nombre}</strong>
              <span>{course.idioma} · Nivel {course.nivel}</span>
              {course.profesorNombre && <span>Profesor: {course.profesorNombre}</span>}
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Mis clases</h2>
        {cargandoClases && <p>Cargando clases...</p>}
        {errorClases && <p className="mensaje-error">{errorClases}</p>}
        {!cargandoClases && !errorClases && clases.length === 0 && <p>No tenés clases registradas.</p>}
        <div className="lista-simple">
          {clases.map((clase) => (
            <article className="lista-item" key={clase.id}>
              <strong>{clase.titulo}</strong>
              <span>{nombreCurso(clase)}</span>
              <span>{clase.fecha} · {clase.hora} · {clase.aula}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default StudentDashboard
