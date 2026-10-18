import { useState } from 'react'
import Menu from './Menu.jsx'
import About from './About.jsx'
import Gallery from './Gallery.jsx'
import Reservations from './Reservations.jsx'
import Newsletter from './Newsletter.jsx'

const pages = ['Home', 'Menu', 'Reservations', 'About Us', 'Gallery']

export default function App() {
  const [page, setPage] = useState('Home')

  return (
    <div>
      <header>
        <h1>Café Fausse</h1>
        <p>Italian tradition. Modern inspiration.</p>

        <nav aria-label="Main navigation">
          {pages.map((name) => (
            <button
              key={name}
              onClick={() => setPage(name)}
              aria-current={page === name ? 'page' : undefined}
            >
              {name}
            </button>
          ))}
        </nav>
      </header>

      <main>
        <h2>{page}</h2>

        {page === 'Home' && (
          <section>
            <img
              src="/images/home-cafe-fausse.webp"
              alt="Café Fausse restaurant"
              style={{ width: '100%', maxWidth: '900px' }}
            />
            <h3>Welcome to Café Fausse</h3>
            <p>
              Experience traditional Italian flavors with modern
              culinary innovation.
            </p>
            <p>1234 Culinary Ave, Suite 100, Washington, DC 20002</p>
            <p>Phone: (202) 555-4567</p>
            <p>Monday–Saturday: 5:00 PM–11:00 PM</p>
            <p>Sunday: 5:00 PM–9:00 PM</p>
          </section>
        )}

        {page === 'Menu' && <Menu />}

              {page === 'About Us' && <About />}

               {page === 'Gallery' && <Gallery />}

                {page === 'Reservations' && <Reservations />}
        <Newsletter />
      </main>
    </div>
  )
}