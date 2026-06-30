import { classes, courses, users } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function AdminDashboard() {
  const { currentUser, logout } = useAuth()

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
          <span>{users.length}</span>
          <p>Usuarios</p>
        </article>
        <article className="resumen-card">
          <span>{courses.length}</span>
          <p>Cursos</p>
        </article>
        <article className="resumen-card">
          <span>{classes.length}</span>
          <p>Clases</p>
        </article>
      </section>

      <section className="dashboard-section">
        <h2>Usuarios</h2>
        <div className="lista-simple">
          {users.map((user) => (
            <article className="lista-item" key={user.id}>
              <strong>{user.nombre}</strong>
              <span>{user.email}</span>
              <span className="etiqueta">{user.rol}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Cursos</h2>
        <div className="lista-simple">
          {courses.map((course) => (
            <article className="lista-item" key={course.id}>
              <strong>{course.nombre}</strong>
              <span>
                {course.idioma} · Nivel {course.nivel}
              </span>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
