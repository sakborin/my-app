import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  async function loadProducts() {
    const res = await fetch(`${API_URL}/api/v1/products`);
    const json = await res.json();
    setProducts(json.data);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/v1/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        price: Number(form.price),
        stock: Number(form.stock),
      }),
    });
    setForm({ name: "", price: "", stock: "" });
    loadProducts();
  }

  async function handleDelete(id) {
    await fetch(`${API_URL}/api/v1/products/${id}`, { method: "DELETE" });
    loadProducts();
  }

  return (
    <>
      <AppHeader />
      <main>
        <form onSubmit={handleSubmit} className="form">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <button type="submit">Add Product</button>
        </form>

        {products.map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            stock={product.stock}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </main>
      <AppFooter />
    </>
  );
}

function AppHeader() {
  return (
    <header>
      <h1>Inventory</h1>
      <p>Manage your products</p>
    </header>
  );
}

function AppFooter() {
  return (
    <footer>
      <p>Inventory App</p>
    </footer>
  );
}

function ProductCard(props) {
  return (
    <div className="card">
      <div>
        <h3>{props.name}</h3>
        <p>${props.price} · Stock: {props.stock}</p>
      </div>
      <button className="delete" onClick={props.onDelete}>Delete</button>
    </div>
  );
}

export default App;
