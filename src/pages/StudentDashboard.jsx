import { classes, courses } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function StudentDashboard() {
  const { currentUser, logout } = useAuth()
  const cursosDelAlumno = courses.filter((course) =>
    course.alumnosIds.includes(currentUser.id),
  )
  const cursosIds = cursosDelAlumno.map((course) => course.id)
  const clasesDelAlumno = classes.filter((clase) =>
    cursosIds.includes(clase.courseId),
  )
  const proximasClases = clasesDelAlumno.slice(0, 3)

  function nombreCurso(courseId) {
    return courses.find((course) => course.id === courseId)?.nombre
  }

  return (
    <section className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="marca">Panel alumno</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">
            Tus cursos y próximas clases en AulaNova.
          </p>
        </div>
        <button type="button" className="boton-secundario" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <section className="dashboard-section">
        <h2>Mis cursos</h2>
        <div className="lista-simple">
          {cursosDelAlumno.map((course) => (
            <article className="lista-item" key={course.id}>
              <strong>{course.nombre}</strong>
              <span>
                {course.idioma} · Nivel {course.nivel}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Próximas clases</h2>
        <div className="lista-simple">
          {proximasClases.map((clase) => (
            <article className="lista-item" key={clase.id}>
              <strong>{clase.titulo}</strong>
              <span>{nombreCurso(clase.courseId)}</span>
              <span>
                {clase.fecha} · {clase.hora} · {clase.aula}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default StudentDashboard
