import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login.jsx";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function App() {
  // The token is saved in the browser so you stay logged in after refresh
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });

  function handleLogin(newToken) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setProducts([]);
  }

  function authHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async function loadProducts() {
    const res = await fetch(`${API_URL}/api/v1/products`, { headers: authHeaders() });
    if (res.status === 401) {
      handleLogout();
      return;
    }
    const json = await res.json();
    setProducts(json.data);
  }

  useEffect(() => {
    if (token) {
      loadProducts();
    }
  }, [token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch(`${API_URL}/api/v1/products`, {
      method: "POST",
      headers: authHeaders(),
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
    await fetch(`${API_URL}/api/v1/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    loadProducts();
  }

  // Not logged in: show the login page
  if (!token) {
    return (
      <>
        <AppHeader />
        <Login onLogin={handleLogin} />
        <AppFooter />
      </>
    );
  }

  return (
    <>
      <AppHeader onLogout={handleLogout} />
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

function AppHeader(props) {
  return (
    <header>
      <h1>Inventory</h1>
      <p>Manage your products</p>
      {props.onLogout && (
        <button className="logout" onClick={props.onLogout}>Logout</button>
      )}
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
