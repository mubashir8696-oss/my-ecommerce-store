import { useState, useEffect } from 'react'
import './App.css'
function App() {
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [cart, setCart] = useState([])
const [searchTerm, setSearchTerm] = useState('')
const [selectedCategory, setSelectedCategory] = useState('all')
const [quantities, setQuantities] = useState({})
const [showCart, setShowCart] = useState(false)
const [showCheckout, setShowCheckout] = useState(false)
const [orderPlaced, setOrderPlaced] = useState(false)
const [error, setError] = useState('')
useEffect(() => {

  const fetchProducts = async () => {

    try {

      const response = await fetch('https://fakestoreapi.com/products?limit=20'
      )

      if (!response.ok) {
        throw new Error('Products could not load')
      }

      const data = await response.json()

      setProducts(data)

    } catch (err) {

      setError(err.message)

    } finally {

      setLoading(false)

    }

  }

  fetchProducts()

}, [])
const addToCart = (product) => {
  setCart((prevCart) => [...prevCart, product])
}
const removeFromCart = (index) => {
  setCart((previousCart) =>
    previousCart.filter((_, i) => i !== index)
  )

  setQuantities((previous) => {
    const updated = {}

    Object.keys(previous).forEach((key) => {
      const oldIndex = Number(key)

      if (oldIndex < index) {
        updated[oldIndex] = previous[oldIndex]
      }

      if (oldIndex > index) {
        updated[oldIndex - 1] = previous[oldIndex]
      }
    })

    return updated
  })
}
const increaseQuantity = (index) => {
  setQuantities((previous) => ({
    ...previous,
    [index]: (previous[index] || 1) + 1
  }))
}
const decreaseQuantity = (index) => {
  setQuantities((previous) => ({
    ...previous,
    [index]: Math.max((previous[index] || 1) - 1, 1)
  }))
}
const subtotal = cart.reduce(
  (total, product, index) =>
    total + product.price * (quantities[index] || 1),
  0
)

const tax = subtotal * 0.05

const shipping = cart.length > 0 ? 5 : 0

const grandTotal = subtotal + tax + shipping

const handlePlaceOrder = (e) => {
  e.preventDefault()

  setOrderPlaced(true)
  setShowCheckout(false)
  setShowCart(false)
  setCart([])
  setQuantities({})
}
const filteredProducts = products.filter((product) => {
  const matchesSearch =
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesCategory =
    selectedCategory === 'all' ||
    product.category === selectedCategory

  return matchesSearch && matchesCategory
})
  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">

        <h2 className="logo">
          <span>MY</span> STORE.
        </h2>

        <div className="nav-links">
          <a href="#">Home</a>
          <a href="#products">Shop</a>
          <a href="#">Collections</a>
          <a href="#">Contact</a>
        </div>

<button
  className="cart-btn"
  onClick={() => setShowCart((previous) => !previous)}
>
  🛒 Cart ({
    cart.reduce(
      (total, product, index) =>
        total + (quantities[index] || 1),
      0
    )
  })
</button>
      </nav> 

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <p className="tagline">
            YOUR STYLE. YOUR CHOICE.
          </p>

          <h1>
            Shopping Made
            <span> Extraordinary.</span>
          </h1>

          <p className="hero-description">
            Discover amazing products, explore new
            collections and enjoy a smarter shopping
            experience.
          </p>

          <a href="#products" className="shop-btn">
            Explore Collection →
          </a>

        </div>

        <div className="hero-decoration">
          <div className="circle">
            <span>SHOP</span>
            <strong>SMART.</strong>
            <span>LIVE BETTER.</span>
          </div>
        </div>

      </section>

      {/* Benefits */}
      <section className="benefits">

        <div>🚚 Free Shopping Experience</div>
        <div>⭐ Quality Products</div>
        <div>🔒 Secure Shopping</div>

      </section>

      {/* Products */}
  {showCart && (
  <>
    <div
      className="cart-overlay"
      onClick={() => setShowCart(false)}
    ></div>

    <section className="cart-section">

      <button
        className="cart-close"
        onClick={() => setShowCart(false)}
      >
        ×
      </button>

      <h2>My Shopping Cart</h2>

    {cart.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      cart.map((product, index) => (
        <div className="cart-item" key={index}>
  <img
    src={product.image}
    alt={product.title}
  />

  <div>
    <h3>{product.title}</h3>
    <p>${product.price.toFixed(2)}</p>
<div className="quantity-controls">
  <button onClick={() => decreaseQuantity(index)}>
    −
  </button>

  <span>Quantity: {quantities[index] || 1}</span>

  <button onClick={() => increaseQuantity(index)}>
    +
  </button>
</div>
    <button
  className="remove-btn"
  onClick={() => removeFromCart(index)}
>
  Remove
</button>

  </div>
</div>

      ))
    )}

    {cart.length > 0 && (
     <div className="cart-total">

  <h3>
    Total: $
    {cart.reduce(
      (total, product, index) =>
        total + product.price * (quantities[index] || 1),
      0
    ).toFixed(2)}
  </h3>

<button
  className="checkout-btn"
  onClick={() => {
    setShowCart(false)
    setShowCheckout(true)
  }}
>
  Proceed to Checkout
</button>

</div>
    )}
 </section>
  </>
)}
{showCheckout && (
  <section className="checkout-section">
    <h2>Checkout</h2>
    <p>Please enter your delivery details.</p>

    <form
      className="checkout-form"
      onSubmit={handlePlaceOrder}
    >
      <input
        type="text"
        placeholder="Full Name"
        required
      />

      <input
        type="email"
        placeholder="Email Address"
        required
      />

      <input
        type="text"
        placeholder="Delivery Address"
        required
      />

      <input
        type="tel"
        placeholder="Phone Number"
        required
      />

      <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>

      <button type="submit" className="checkout-btn">
        Place Order
      </button>

      <button
        type="button"
        onClick={() => setShowCheckout(false)}
      >
        Back to Shopping
      </button>
    </form>
  </section>
)}
{orderPlaced && (
  <section className="order-success">
    <h2>🎉 Order Placed Successfully!</h2>
    <p>Thank you for shopping with us.</p>
    <p>Your order has been received.</p>

    <button
      onClick={() => setOrderPlaced(false)}
    >
      Continue Shopping
    </button>
  </section>
)}
      <section className="products" id="products">

        <div className="section-heading">
          <div>
            <p className="tagline">HANDPICKED FOR YOU</p>
            <h2>Explore Our Products.</h2>
          </div>

          <p>Find something you will love.</p>
        </div>
        <div className="search-container">
  <input
    type="text"
    placeholder="Search products..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
<div className="category-filter">
  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
  >
    <option value="all">All Categories</option>
    <option value="men's clothing">Men's Clothing</option>
    <option value="women's clothing">Women's Clothing</option>
    <option value="jewelery">Jewellery</option>
    <option value="electronics">Electronics</option>
  </select>
</div>

       {/* Loading */}
{loading && (
  <p className="status-message">
    Loading products...
  </p>
)}

{/* Error */}
{error && (
  <p className="error-message">
    {error}
  </p>
)}

{/* Products */}
{!loading && !error && (

  <div className="product-grid">

  {filteredProducts.map((product) => (

      <div className="product-card" key={product.id}>

        <div className="product-image">
          <img
            src={product.image}
            alt={product.title}
          />
        </div>

        <p className="product-category">
          {product.category}
        </p>

        <h3>{product.title}</h3>

        <div className="product-rating">
          ⭐ {product.rating.rate} / 5
          <span>
            ({product.rating.count} reviews)
          </span>
        </div>

        <div className="product-bottom">

          <strong>
            ${product.price.toFixed(2)}
          </strong>

         <button
  className="add-btn"
  onClick={() => addToCart(product)}
>
  Add to Cart +
</button>

        </div>

      </div>

    ))}

  </div>

)}

      </section>

      {/* Footer */}
      <footer>
        <h2>MY STORE.</h2>
        <p>Making online shopping better.</p>
        <p>© 2026 My E-Commerce Store</p>
      </footer>

    </div>
  )
}

export default App
