import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function LoginPage({ onVolverInicio }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [error, setError] = useState('')
  const [ingresando, setIngresando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (ingresando) return

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

    setIngresando(true)
    setError('')

    try {
      await login(emailIngresado, passwordIngresado)
    } catch (errorLogin) {
      setError(errorLogin.message || 'No se pudo iniciar sesión.')
    } finally {
      setIngresando(false)
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
          Ingresá con tu cuenta para entrar al sistema.
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

        <button type="submit" className="boton-principal" disabled={ingresando}>
          {ingresando ? 'Ingresando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}

export default LoginPage
