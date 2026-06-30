import { useState } from 'react'

function HomePage({ onEntrar }) {
  const [consultaEnviada, setConsultaEnviada] = useState(false)

  function enviarConsulta(event) {
    event.preventDefault()
    setConsultaEnviada(true)
  }

  const cursos = [
    {
      nombre: 'Inglés',
      nivel: 'Inicial y conversación',
      texto: 'Para empezar desde cero o ganar confianza al hablar.',
    },
    {
      nombre: 'Español',
      nivel: 'Para extranjeros',
      texto: 'Clases prácticas para vivir, estudiar o trabajar en Buenos Aires.',
    },
    {
      nombre: 'Portugués',
      nivel: 'Viajes y trabajo',
      texto: 'Frases útiles, pronunciación y práctica cotidiana.',
    },
  ]

  const beneficios = [
    'Horarios flexibles',
    'Profesores cercanos',
    'Clases online y presenciales',
    'Seguimiento del alumno',
  ]

  return (
    <main className="home-page">
      <header className="home-header-wrap">
        <div className="home-header">
          <a className="home-logo" href="#inicio">
            AulaNova
          </a>
          <nav className="home-nav" aria-label="Navegación principal">
            <a href="#inicio">Inicio</a>
            <a href="#cursos">Cursos</a>
            <a href="#beneficios">Beneficios</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <button type="button" className="boton-secundario" onClick={onEntrar}>
            Entrar
          </button>
        </div>
      </header>

      <section className="home-hero" id="inicio">
        <div className="hero-texto">
          <p className="marca">Escuela de idiomas en Buenos Aires</p>
          <h1>Aprendé idiomas en un espacio simple y cercano</h1>
          <p className="descripcion">
            AulaNova acompaña a alumnos de una escuela chica con clases claras,
            grupos reducidos y seguimiento personal.
          </p>
          <button type="button" className="boton-principal" onClick={onEntrar}>
            Entrar al sistema
          </button>
        </div>

        <aside className="hero-card" aria-label="Resumen de AulaNova">
          <span className="hero-card-tag">Aula abierta</span>
          <h2>Clases para avanzar de a poco</h2>
          <p>Inglés, español y portugués con horarios pensados para el barrio.</p>
          <div className="hero-datos">
            <span>3 idiomas</span>
            <span>Grupos chicos</span>
            <span>CABA</span>
          </div>
        </aside>
      </section>

      <section className="home-section" id="cursos">
        <div className="section-heading">
          <p className="marca">Cursos</p>
          <h2>Idiomas disponibles</h2>
        </div>
        <div className="home-grid">
          {cursos.map((curso) => (
            <article className="home-card" key={curso.nombre}>
              <h3>{curso.nombre}</h3>
              <strong>{curso.nivel}</strong>
              <p>{curso.texto}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" id="beneficios">
        <div className="section-heading">
          <p className="marca">Beneficios</p>
          <h2>Una escuela chica, con trato cercano</h2>
        </div>
        <div className="beneficios-grid">
          {beneficios.map((beneficio) => (
            <article className="home-card beneficio-card" key={beneficio}>
              <span>✓</span>
              <h3>{beneficio}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section contacto-section" id="contacto">
        <div className="section-heading">
          <p className="marca">Contacto</p>
          <h2>Consultá por un curso</h2>
        </div>
        <form className="contacto-form" onSubmit={enviarConsulta}>
          <label>
            Nombre
            <input type="text" placeholder="Tu nombre" />
          </label>
          <label>
            Email
            <input type="email" placeholder="tu@email.com" />
          </label>
          <label>
            Mensaje
            <textarea placeholder="Contanos qué idioma querés estudiar" />
          </label>
          <button type="submit" className="boton-principal">
            Enviar consulta
          </button>
          {consultaEnviada && (
            <p className="mensaje-ok">Consulta registrada para responder luego.</p>
          )}
        </form>
      </section>

      <footer className="home-footer">
        <div>
          <strong>AulaNova</strong>
          <p>Av. Asamblea 1234, Buenos Aires</p>
          <p>hola@aulanova.com</p>
        </div>
        <nav aria-label="Links del pie">
          <a href="#cursos">Cursos</a>
          <a href="#beneficios">Beneficios</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </footer>
    </main>
  )
}

export default HomePage
