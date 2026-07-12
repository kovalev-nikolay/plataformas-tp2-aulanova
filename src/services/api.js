const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8888/api'

export async function loginRequest(email, contrasena) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contrasena }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message)
  }

  return data
}
