import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [key, setKey] = useState(localStorage.getItem('ADMIN_API_KEY') || "");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const verify = async (k) => {
    try {
      const res = await axios.get('/api/admin/verify', { headers: { 'x-admin-key': k } });
      return res?.data?.ok === true;
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Unknown error';
      setStatus(`Authorization failed: ${msg}`);
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      if (!key) return;
      if (await verify(key)) {
        navigate('/admin', { replace: true });
      }
    })();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("Validating...");
    const ok = await verify(key);
    if (ok) {
      localStorage.setItem('ADMIN_API_KEY', key);
      setStatus("Valid key. Redirecting...");
      navigate('/admin', { replace: true });
    } else {
      // status already set in verify
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-4">Admin Login</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Enter Admin API Key"
          value={key}
          onChange={(e)=>setKey(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Login</button>
      </form>
      {status && <div className="mt-3 text-sm text-gray-600">{status}</div>}
    </div>
  );
}


