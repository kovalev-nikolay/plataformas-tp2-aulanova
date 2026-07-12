/* eslint-disable react/only-export-components */
import { createContext, useContext, useState } from 'react'
import { loginRequest } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('aulanova_usuario')

    if (!savedUser) return null

    try {
      return JSON.parse(savedUser)
    } catch {
      localStorage.removeItem('aulanova_token')
      localStorage.removeItem('aulanova_usuario')
      return null
    }
  })

  async function login(email, contrasena) {
    const data = await loginRequest(email, contrasena)
    localStorage.setItem('aulanova_token', data.accessToken)
    localStorage.setItem('aulanova_usuario', JSON.stringify(data.usuario))
    setCurrentUser(data.usuario)
    return data.usuario
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem('aulanova_token')
    localStorage.removeItem('aulanova_usuario')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
