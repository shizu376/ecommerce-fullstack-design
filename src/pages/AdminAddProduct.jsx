import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
    description: "",
    image: "",
    features: "",
  });
  const onChange = (k) => (e) => setForm((v) => ({ ...v, [k]: e.target.value }));

  const uploadFromPC = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const data = new FormData();
      data.append('image', file);
      const key = localStorage.getItem('ADMIN_API_KEY') || '';
      const res = await axios.post('/api/uploads', data, { headers: { 'x-admin-key': key } });
      const url = res.data?.url;
      if (url) setForm((v) => ({ ...v, image: url }));
    };
    input.click();
  };

  const useImageUrl = () => {
    const url = prompt('Paste public image link (e.g., Google Drive direct link)');
    if (url) setForm((v) => ({ ...v, image: url }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      stock: Number(form.stock) || 0,
      features: form.features ? form.features.split(',').map(s=>s.trim()).filter(Boolean) : [],
    };
    const headers = { 'x-admin-key': localStorage.getItem('ADMIN_API_KEY') || '' };
    await axios.post('/api/products', payload, { headers });
    navigate('/admin?tab=products', { replace: true });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="text-lg font-semibold mb-4">Create Product</div>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-4 rounded border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Product Name" value={form.name} onChange={onChange('name')} />
          <input className="border rounded px-3 py-2" placeholder="Price" value={form.price} onChange={onChange('price')} />
          <input className="border rounded px-3 py-2" placeholder="Category" value={form.category} onChange={onChange('category')} />
          <input className="border rounded px-3 py-2" placeholder="Brand" value={form.brand} onChange={onChange('brand')} />
          <input className="border rounded px-3 py-2" placeholder="Quantity" value={form.stock} onChange={onChange('stock')} />
        </div>
        <textarea className="border rounded px-3 py-2 w-full min-h-28" placeholder="Description" value={form.description} onChange={onChange('description')} />
        <div className="flex items-center gap-2">
          <button type="button" onClick={uploadFromPC} className="px-3 py-2 rounded border">Choose File</button>
          <button type="button" onClick={useImageUrl} className="px-3 py-2 rounded border">Use Image URL</button>
          {form.image && <span className="text-xs text-gray-600 truncate">{form.image}</span>}
        </div>
        <input className="border rounded px-3 py-2 w-full" placeholder="Features (comma separated)" value={form.features} onChange={onChange('features')} />
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded bg-green-600 text-white">Create</button>
          <button type="button" onClick={() => navigate('/admin?tab=products')} className="px-4 py-2 rounded border">Cancel</button>
        </div>
      </form>
    </div>
  );
}


