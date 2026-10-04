import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/api/v1/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();

    if (json.success) {
      onLogin(json.token);
    } else {
      setError(json.message);
    }
  }

  return (
    <div className="auth-box">
      <h2>{mode === "login" ? "Login" : "Create account"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === "login" ? "Login" : "Register"}</button>
      </form>

      <p className="switch">
        {mode === "login" ? "No account yet? " : "Already have an account? "}
        <span onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Register" : "Login"}
        </span>
      </p>
    </div>
  );
}

export default Login;
