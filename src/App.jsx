import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import AdminDashboard from './pages/AdminDashboard'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfessorDashboard from './pages/ProfessorDashboard'
import StudentDashboard from './pages/StudentDashboard'
import './App.css'

function App() {
  const { currentUser } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (currentUser) {
    const userRole = currentUser.role || currentUser.rol

    return (
      <main className="app">
        {userRole === 'admin' && <AdminDashboard />}
        {userRole === 'profesor' && <ProfessorDashboard />}
        {userRole === 'alumno' && <StudentDashboard />}
      </main>
    )
  }

  if (showLogin) {
    return (
      <main className="app">
        <LoginPage onVolverInicio={() => setShowLogin(false)} />
      </main>
    )
  }

  return <HomePage onEntrar={() => setShowLogin(true)} />
}

export default App
