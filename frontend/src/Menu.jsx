const categories = [
  {
    name: 'Starters',
    items: [
      ['Bruschetta', 'Fresh tomatoes, basil, olive oil, and toasted baguette slices', '8.50'],
      ['Caesar Salad', 'Crisp romaine with homemade Caesar dressing', '9.00'],
    ],
  },
  {
    name: 'Main Courses',
    items: [
      ['Grilled Salmon', 'Served with lemon butter sauce and seasonal vegetables', '22.00'],
      ['Ribeye Steak', '12 oz prime cut with garlic mashed potatoes', '28.00'],
      ['Vegetable Risotto', 'Creamy Arborio rice with wild mushrooms', '18.00'],
    ],
  },
  {
    name: 'Desserts',
    items: [
      ['Tiramisu', 'Classic Italian dessert with mascarpone', '7.50'],
      ['Cheesecake', 'Creamy cheesecake with berry compote', '7.00'],
    ],
  },
  {
    name: 'Beverages',
    items: [
      ['Red Wine (Glass)', 'A selection of Italian reds', '10.00'],
      ['White Wine (Glass)', 'Crisp and refreshing', '9.00'],
      ['Craft Beer', 'Local artisan brews', '6.00'],
      ['Espresso', 'Strong and aromatic', '3.00'],
    ],
  },
]

export default function Menu() {
  return (
    <div className="menu-grid">
      {categories.map((category) => (
        <section className="menu-category" key={category.name}>
          <h3>{category.name}</h3>

          {category.items.map(([name, description, price]) => (
            <article className="menu-item" key={name}>
              <div className="menu-item-heading">
                <h4>{name}</h4>
                <strong>${price}</strong>
              </div>
              <p>{description}</p>
            </article>
          ))}
        </section>
      ))}
    </div>
  )
}