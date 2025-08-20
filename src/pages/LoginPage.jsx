import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isLogin ? "Login to Your Account" : "Create a New Account"}
        </h2>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setStatus(isLogin ? "Signing in..." : "Creating account...");
              if (isLogin) {
                const res = await axios.post("/api/admin/login", { email, password });
                const token = res?.data?.token;
                if (token) {
                  localStorage.setItem("JWT_TOKEN", token);
                  setStatus("Logged in successfully");
                  navigate("/admin", { replace: true });
                } else {
                  setStatus("Login failed");
                }
              } else {
              
                const res = await axios.post("/api/auth/signup", { name, email, password });
                if (res?.status >= 200 && res?.status < 300) {
                  setStatus("Account created. Please login.");
                  setIsLogin(true);
                } else {
                  setStatus("Sign up failed");
                }
              }
            } catch (err) {
              setStatus(err?.response?.data?.message || (isLogin ? "Login failed" : "Sign up failed"));
            }
          }}
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        {status && <div className="mt-3 text-sm text-gray-600">{status}</div>}

        <p className="mt-4 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
