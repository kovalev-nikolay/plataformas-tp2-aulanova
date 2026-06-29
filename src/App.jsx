import './App.css'

function App() {
  const roles = [
    {
      nombre: 'Admin',
      descripcion: 'Gestiona usuarios, cursos y clases.',
    },
    {
      nombre: 'Profesor',
      descripcion: 'Consulta sus clases y alumnos.',
    },
    {
      nombre: 'Alumno',
      descripcion: 'Ve sus cursos y proximas clases.',
    },
  ]

  return (
    <main className="app">
      <section className="inicio">
        <div className="presentacion">
          <p className="marca">Escuela de idiomas</p>
          <h1>AulaNova</h1>
          <p className="descripcion">
            Sistema simple para una escuela de idiomas
          </p>
          <button type="button" className="boton-principal">
            Entrar al sistema
          </button>
        </div>

        <section className="roles" aria-label="Roles de usuario">
          {roles.map((rol) => (
            <article className="rol-card" key={rol.nombre}>
              <h2>{rol.nombre}</h2>
              <p>{rol.descripcion}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  )
}

export default App
