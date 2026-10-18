export default function About() {
  return (
    <section>
      <h3>Our Story</h3>
      <p>
        Founded in 2010 by Chef Antonio Rossi and restaurateur Maria
        Lopez, Café Fausse blends traditional Italian flavors with
        modern culinary innovation. Our mission is to provide an
        unforgettable dining experience that reflects both quality
        and creativity.
      </p>

      <div className="menu-grid">
        <article className="menu-category">
          <h3>Chef Antonio Rossi</h3>
          <p>
            Co-founder and chef Antonio Rossi guides our culinary
            vision, bringing together Italian traditions and modern
            techniques. His approach celebrates excellent food,
            seasonal flavors, and locally sourced ingredients.
          </p>
        </article>

        <article className="menu-category">
          <h3>Maria Lopez</h3>
          <p>
            Co-founder and restaurateur Maria Lopez shapes the
            hospitality and dining experience at Café Fausse.
            Her focus is thoughtful service, a welcoming atmosphere,
            and making every visit memorable.
          </p>
        </article>
      </div>

      <h3>Our Commitment</h3>
      <p>
        We believe unforgettable dining begins with quality
        ingredients, creative cooking, and genuine hospitality.
        We prioritize locally sourced ingredients and bring care
        to every dish and every guest experience.
      </p>
    </section>
  )
}