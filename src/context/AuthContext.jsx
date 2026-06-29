/* eslint-disable react/only-export-components */
import { createContext, useContext, useState } from 'react'
import { users } from '../data/mockData'

const AuthContext = createContext()

function quitarPassword(user) {
  const { password: _password, ...userSinPassword } = user
  return userSinPassword
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('aulanovaUser')
    return savedUser ? JSON.parse(savedUser) : null
  })

  function login(email, password) {
    const user = users.find(
      (item) => item.email === email && item.password === password,
    )

    if (!user) {
      return false
    }

    const userSinPassword = quitarPassword(user)
    setCurrentUser(userSinPassword)
    localStorage.setItem('aulanovaUser', JSON.stringify(userSinPassword))
    return true
  }

  function logout() {
    setCurrentUser(null)
    localStorage.removeItem('aulanovaUser')
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
