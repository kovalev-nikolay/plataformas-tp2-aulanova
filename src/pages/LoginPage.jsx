import { useState } from 'react'
import { users } from '../data/mockData'
import { useAuth } from '../context/AuthContext'

function LoginPage({ onVolverInicio }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const emailIngresado = email.trim()
    const passwordIngresado = password.trim()

    if (!emailIngresado || !emailIngresado.includes('@')) {
      setError('Ingresá un email válido.')
      return
    }

    if (!passwordIngresado) {
      setError('Ingresá la contraseña.')
      return
    }

    const loginOk = login(emailIngresado, passwordIngresado)

    if (!loginOk) {
      setError('Usuario o contraseña incorrectos.')
    }
  }

  return (
    <section className="panel login-panel">
      <div className="login-top">
        <button
          type="button"
          className="boton-volver"
          onClick={onVolverInicio}
        >
          Volver al inicio
        </button>
      </div>

      <div>
        <p className="marca">Acceso AulaNova</p>
        <h1>Ingresar</h1>
        <p className="descripcion">
          Usar un usuario de prueba para entrar al sistema.
        </p>
      </div>

      <form className="login-form" onSubmit={handleSubmit} noValidate>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
            placeholder="tu email"
            autoComplete="off"
          />
        </label>

        <label>
          Password
          <div className="password-field">
            <input
              type={mostrarPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="tu contraseña"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="boton-password"
              onClick={() => setMostrarPassword(!mostrarPassword)}
              aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {mostrarPassword ? '🙈' : '👁'}
            </button>
          </div>
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
