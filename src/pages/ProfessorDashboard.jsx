import { classes, courses, users } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function ProfessorDashboard() {
  const { currentUser, logout } = useAuth()
  const cursosDelProfesor = courses.filter(
    (course) => course.profesorId === currentUser.id,
  )
  const cursosIds = cursosDelProfesor.map((course) => course.id)
  const clasesDelProfesor = classes.filter((clase) =>
    cursosIds.includes(clase.courseId),
  )
  const alumnosIds = [...new Set(cursosDelProfesor.flatMap((course) => course.alumnosIds))]
  const alumnos = users.filter((user) => alumnosIds.includes(user.id))

  function nombreCurso(courseId) {
    return courses.find((course) => course.id === courseId)?.nombre
  }

  return (
    <section className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <p className="marca">Panel profesor</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">
            Tus clases y alumnos asignados en AulaNova.
          </p>
        </div>
        <button type="button" className="boton-secundario" onClick={logout}>
          Cerrar sesión
        </button>
      </div>

      <section className="dashboard-section">
        <h2>Mis clases</h2>
        <div className="lista-simple">
          {clasesDelProfesor.map((clase) => (
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

      <section className="dashboard-section">
        <h2>Mis alumnos</h2>
        <div className="lista-simple">
          {alumnos.map((alumno) => (
            <article className="lista-item" key={alumno.id}>
              <strong>{alumno.nombre}</strong>
              <span>{alumno.email}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default ProfessorDashboard
