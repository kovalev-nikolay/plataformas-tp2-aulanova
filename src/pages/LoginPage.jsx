import { useState } from 'react'
import { users } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const loginOk = login(email, password)

    if (!loginOk) {
      setError('Email o password incorrectos.')
    }
  }

  return (
    <section className="panel login-panel">
      <div>
        <p className="marca">Acceso AulaNova</p>
        <h1>Ingresar</h1>
        <p className="descripcion">
          Usar un usuario de prueba para entrar al sistema.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@aulanova.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin123"
            required
          />
        </label>

        {error && <p className="mensaje-error">{error}</p>}

        <button type="submit" className="boton-principal">
          Entrar
        </button>
      </form>

      <div className="usuarios-prueba">
        <h2>Usuarios de prueba</h2>
        {users.map((user) => (
          <div className="usuario-prueba" key={user.id}>
            <strong>{user.rol}</strong>
            <span>{user.email}</span>
            <span>{user.password}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LoginPage
