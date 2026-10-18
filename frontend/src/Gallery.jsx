import { useRef, useState } from 'react'

const photos = [
  {
    file: 'gallery-cafe-interior.webp',
    caption: 'Our restaurant interior',
  },
  {
    file: 'gallery-ribeye-steak.webp',
    caption: 'Our signature ribeye steak',
  },
  {
    file: 'gallery-special-event.webp',
    caption: 'Special events at Café Fausse',
  },
]

export default function Gallery() {
  const [selected, setSelected] = useState(photos[0])
  const lightbox = useRef(null)

  function openPhoto(photo) {
    setSelected(photo)
    lightbox.current.showModal()
  }

  return (
    <section>
      <p>Click a picture to view it larger.</p>

      <div className="gallery-grid">
        {photos.map((photo) => (
          <button
            className="gallery-card"
            key={photo.file}
            onClick={() => openPhoto(photo)}
            aria-label={`Enlarge: ${photo.caption}`}
          >
            <img
              src={`/images/${photo.file}`}
              alt={photo.caption}
              loading="lazy"
            />
            <span>{photo.caption}</span>
          </button>
        ))}
      </div>

      <dialog ref={lightbox} className="lightbox">
        <button
          className="lightbox-close"
          onClick={() => lightbox.current.close()}
          autoFocus
        >
          Close
        </button>
        <img
          src={`/images/${selected.file}`}
          alt={selected.caption}
        />
        <p>{selected.caption}</p>
      </dialog>

      <h3>Awards</h3>
      <ul className="awards-list">
        <li>Culinary Excellence Award – 2022</li>
        <li>Restaurant of the Year – 2023</li>
        <li>Best Fine Dining Experience – Foodie Magazine, 2023</li>
      </ul>

      <h3>What Our Guests Say</h3>
      <blockquote>
        <p>“Exceptional ambiance and unforgettable flavors.”</p>
        <cite>Gourmet Review</cite>
      </blockquote>
      <blockquote>
        <p>“A must-visit restaurant for food enthusiasts.”</p>
        <cite>The Daily Bite</cite>
      </blockquote>
    </section>
  )
}