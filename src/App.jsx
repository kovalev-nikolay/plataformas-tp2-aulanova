import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  const { currentUser, logout } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

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

  if (currentUser) {
    return (
      <main className="app">
        <section className="panel dashboard-temporal">
          <p className="marca">Panel temporal</p>
          <h1>Hola, {currentUser.nombre}</h1>
          <p className="descripcion">
            Entraste como <strong>{currentUser.rol}</strong>.
          </p>
          <button type="button" className="boton-secundario" onClick={logout}>
            Cerrar sesion
          </button>
        </section>
      </main>
    )
  }

  if (showLogin) {
    return (
      <main className="app">
        <LoginPage />
      </main>
    )
  }

  return (
    <main className="app">
      <section className="inicio">
        <div className="presentacion">
          <p className="marca">Escuela de idiomas</p>
          <h1>AulaNova</h1>
          <p className="descripcion">
            Sistema simple para una escuela de idiomas
          </p>
          <button
            type="button"
            className="boton-principal"
            onClick={() => setShowLogin(true)}
          >
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
