import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getOverrides, saveOverrides, getVisibleLocalProducts, resolveImagePath, DELETED_KEY } from "../data/localProductsHelpers";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [adminKey, setAdminKey] = useState("");
  const [health, setHealth] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formProduct, setFormProduct] = useState({ name: "", price: "", category: "", brand: "", image: "", features: "", description: "", stock: "" });
  const [formCategory, setFormCategory] = useState({ name: "", description: "", image: "" });
  const [editingProductKey, setEditingProductKey] = useState(null); // backend _id or 'fe-{frontendId}'
  const [editProduct, setEditProduct] = useState({ name: "", price: "", category: "", brand: "", image: "", features: "" });
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: "", description: "", image: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState(new Set());

  const getAuthHeaders = () => {
    const headers = {};
    const key = localStorage.getItem('ADMIN_API_KEY') || '';
    const jwt = localStorage.getItem('JWT_TOKEN') || '';
    if (key) headers['x-admin-key'] = key;
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
    return headers;
  };

  // Helper functions for deleted products
  const getDeletedSet = () => {
    try {
      const deleted = localStorage.getItem(DELETED_KEY);
      return deleted ? new Set(JSON.parse(deleted)) : new Set();
    } catch {
      return new Set();
    }
  };

  const saveDeletedSet = (deletedSet) => {
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify([...deletedSet]));
    } catch (error) {
      console.error('Failed to save deleted set:', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/health');
        setHealth(res.data?.ok === true ? 'connected' : 'unknown');
      } catch {
        setHealth('disconnected');
      }
    })();
  }, []);

  const loadOverrides = () => getOverrides();

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to load from API first
      let apiItemsRaw = [];
      let categories = [];
      
      try {
        const [p, c] = await Promise.all([
          axios.get('/api/products?limit=100'),
          axios.get('/api/categories'),
        ]);
        apiItemsRaw = (p.data.items || p.data || []).map((it) => ({
          ...it,
          displayImage: resolveImagePath(it.image),
          __source: 'backend',
        }));
        categories = c.data || [];
      } catch (apiError) {
        console.log('API not available, using local data only');
      }
      
      // Always load local products as fallback
      const localWithOverrides = getVisibleLocalProducts();
      
      // Merge and de-duplicate by name+brand (prefer backend entries)
      const seen = new Set();
      const merged = [];
      for (const item of [...apiItemsRaw, ...localWithOverrides]) {
        const key = `${(item.name || '').toLowerCase()}|${(item.brand || '').toLowerCase()}`;
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(item);
      }
      
      console.log('Loaded products:', merged.length, 'API:', apiItemsRaw.length, 'Local:', localWithOverrides.length);
      setProducts(merged);
      setCategories(categories);
    } catch (e) {
      console.error('Error loading data:', e);
      // Fallback to local products only
      const localProducts = getVisibleLocalProducts();
      setProducts(localProducts);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    loadData(); 
    // Also ensure we have local products as fallback
    const localProducts = getVisibleLocalProducts();
    if (localProducts.length > 0 && products.length === 0) {
      setProducts(localProducts);
    }
  }, []);

  useEffect(() => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set('tab', activeTab);
      return params;
    }, { replace: true });
  }, [activeTab, setSearchParams]);

  const saveAdminKey = () => {
    if (!adminKey.trim()) return;
    localStorage.setItem('ADMIN_API_KEY', adminKey.trim());
    setAdminKey("");
  };

  const signOut = () => {
    localStorage.removeItem('ADMIN_API_KEY');
    navigate('/admin/login');
  };

  const createProduct = async () => {
    const payload = {
      ...formProduct,
      price: Number(formProduct.price) || 0,
      stock: Number(formProduct.stock) || 0,
      features: formProduct.features
        ? formProduct.features.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
    };
    try {
      await axios.post('/api/products', payload, { headers: getAuthHeaders() });
      setFormProduct({ name: "", price: "", category: "", brand: "", image: "", features: "", description: "", stock: "" });
      await loadData();
    } catch (error) {
      alert('Failed to create product: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      await axios.put(`/api/products/${id}`, updates, { headers: getAuthHeaders() });
      await loadData();
    } catch (error) {
      alert('Failed to update product: ' + (error.response?.data?.message || error.message));
    }
  };

  const deleteProduct = async (product) => {
    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;

    try {
      if (product._id) {
        // Backend product - delete via API
        await axios.delete(`/api/products/${product._id}`, { headers: getAuthHeaders() });
        alert('Product deleted successfully!');
      } else if (product.frontendId) {
        // Frontend product - mark as deleted in localStorage
        const deleted = getDeletedSet();
        deleted.add(String(product.frontendId));
        saveDeletedSet(deleted);
        alert('Product deleted successfully!');
      } else {
        alert('Cannot delete this product - no valid ID found');
        return;
      }
      await loadData();
    } catch (error) {
      console.error('Delete product error:', error);
      alert('Failed to delete product: ' + (error.response?.data?.message || error.message));
    }
  };

  const createCategory = async () => {
    if (!formCategory.name.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      await axios.post('/api/categories', formCategory, { headers: getAuthHeaders() });
      setFormCategory({ name: "", description: "", image: "" });
      await loadData();
    } catch (error) {
      alert('Failed to create category: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateCategory = async (id, updates) => {
    try {
      await axios.put(`/api/categories/${id}`, updates, { headers: getAuthHeaders() });
      await loadData();
    } catch (error) {
      alert('Failed to update category: ' + (error.response?.data?.message || error.message));
    }
  };

  const beginEditProduct = (p) => {
    const key = p._id ? p._id : (p.frontendId != null ? `fe-${p.frontendId}` : null);
    if (!key) return;
    setEditingProductKey(key);
    setEditProduct({
      name: p.name || "",
      price: String(p.price ?? ""),
      category: p.category || "",
      brand: p.brand || "",
      image: p.image || "",
      features: Array.isArray(p.features) ? p.features.join(", ") : (p.features || ""),
      description: p.description || "",
      stock: p.stock != null ? String(p.stock) : "",
    });
  };

  const saveEditProduct = async () => {
    if (!editingProductKey) return;
    const payload = {
      name: editProduct.name,
      price: Number(editProduct.price) || 0,
      category: editProduct.category,
      brand: editProduct.brand,
      image: editProduct.image,
      features: editProduct.features
        ? editProduct.features.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      description: editProduct.description,
      stock: editProduct.stock != null ? Number(editProduct.stock) : undefined,
    };
    if (editingProductKey.startsWith('fe-')) {
      const frontendId = editingProductKey.slice(3);
      const overrides = loadOverrides();
      overrides[frontendId] = { ...(overrides[frontendId] || {}), ...payload };
      saveOverrides(overrides);
      await loadData();
    } else {
      await updateProduct(editingProductKey, payload);
    }
    setEditingProductKey(null);
  };

  const cancelEditProduct = () => {
    setEditingProductKey(null);
  };

  const beginEditCategory = (c) => {
    if (!c._id) return;
    setEditingCategoryId(c._id);
    setEditCategory({
      name: c.name || "",
      description: c.description || "",
      });
  };

  const saveEditCategory = async () => {
    if (!editingCategoryId) return;
    await updateCategory(editingCategoryId, { ...editCategory });
    setEditingCategoryId(null);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this category?');
    if (!confirmed) return;
    
    try {
      await axios.delete(`/api/categories/${id}`, { headers: getAuthHeaders() });
      await loadData();
    } catch (error) {
      alert('Failed to delete category: ' + (error.response?.data?.message || error.message));
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const bulkDeleteProducts = async () => {
    if (selectedProducts.size === 0) {
      alert('Please select products to delete');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to delete ${selectedProducts.size} selected products?`);
    if (!confirmed) return;

    try {
      const selectedProductList = products.filter(p => selectedProducts.has(p._id || p.id));
      let deletedCount = 0;

      for (const product of selectedProductList) {
        try {
          await deleteProduct(product);
          deletedCount++;
        } catch (error) {
          console.error(`Failed to delete product ${product.name}:`, error);
        }
      }

      setSelectedProducts(new Set());
      alert(`Successfully deleted ${deletedCount} out of ${selectedProductList.length} products`);
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Some products could not be deleted. Please try again.');
    }
  };

  const SummaryCard = ({ title, value }) => (
    <div className="border rounded-lg p-4 bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <span className={`text-sm px-2 py-1 rounded-full ${health === 'connected' ? 'bg-green-100 text-green-700' : health === 'disconnected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
          {health === 'connected' ? 'Backend: Connected' : health === 'disconnected' ? 'Backend: Disconnected' : 'Backend: Checking...'}
        </span>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b">
        {[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'products', label: 'Product' },
          { key: 'categories', label: 'Category' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 -mb-px border-b-2 ${activeTab === t.key ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-600'} hover:text-blue-700`}
          >
            {t.label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button onClick={signOut} className="px-3 py-1.5 rounded border text-xs">Sign out</button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SummaryCard title="Total Products" value={products.length} />
            <SummaryCard title="Categories" value={categories.length} />
            <SummaryCard title="Status" value={health || '—'} />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button onClick={loadData} className="px-3 py-2 rounded border text-sm">Refresh Data</button>
              {loading && <span className="text-sm text-gray-600">Loading...</span>}
            </div>

            {/* System Overview */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium mb-3">System Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Backend Connection</div>
                  <div className={`text-sm px-2 py-1 rounded ${health === 'connected' ? 'bg-green-100 text-green-700' : health === 'disconnected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                    {health === 'connected' ? 'Connected' : health === 'disconnected' ? 'Disconnected' : 'Checking...'}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">Data Sources</div>
                  <div className="text-sm">
                    API Products: {products.filter(p => p.__source === 'backend').length}<br/>
                    Local Products: {products.filter(p => p.__source !== 'backend').length}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setActiveTab('products')} 
                  className="px-3 py-2 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                  Manage Products
                </button>
                <button 
                  onClick={() => setActiveTab('categories')} 
                  className="px-3 py-2 rounded bg-green-600 text-white text-sm hover:bg-green-700"
                >
                  Manage Categories
                </button>
                <button 
                  onClick={() => navigate('/admin/products/new')} 
                  className="px-3 py-2 rounded border text-sm hover:bg-gray-50"
                >
                  Add New Product
                </button>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white border rounded-lg p-4">
              <h3 className="font-medium mb-3">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold text-blue-600">{products.length}</div>
                  <div className="text-sm text-gray-600">Total Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-green-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold text-purple-600">
                    {products.filter(p => p.stock && p.stock > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">In Stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Create Category form */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="text-lg font-medium mb-3">Create Category</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input className="border rounded px-3 py-2" placeholder="Name" value={formCategory.name} onChange={(e)=>setFormCategory(v=>({...v,name:e.target.value}))} />
            <div className="flex flex-col gap-2">
            </div>
            </div>
            <button onClick={createCategory} className="mt-3 px-3 py-2 rounded bg-green-600 text-white text-sm">Create Category</button>
          </div>

          {/* Category List */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="font-medium mb-3 flex items-center justify-between">
              <span>Category List</span>
              <button onClick={loadData} className="text-xs px-2 py-1 border rounded">Refresh</button>
            </div>
            <div className="divide-y">
              {categories.map((c) => (
                <div key={c._id} className="py-3 flex items-center gap-3">
                 <div className="flex-1 min-w-0">
                    {editingCategoryId === c._id ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <input className="border rounded px-2 py-1 text-sm" value={editCategory.name} onChange={(e)=>setEditCategory(v=>({...v,name:e.target.value}))} />
                       
                      </div>
                    ) : (
                      <>
                        <div className="font-medium truncate">{c.name}</div>
                        {c.description && (
                          <div className="text-xs text-gray-500 truncate">{c.description}</div>
                        )}
                      </>
                    )}
                  </div>
                  {editingCategoryId === c._id ? (
                    <div className="flex items-center gap-2">
                      <button onClick={saveEditCategory} className="text-xs px-2 py-1 rounded bg-blue-600 text-white">Save</button>
                      <button onClick={cancelEditCategory} className="text-xs px-2 py-1 rounded border">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={() => beginEditCategory(c)} className="text-xs px-2 py-1 rounded border">Edit</button>
                      <button onClick={() => updateCategory(c._id, { isActive: !c.isActive })} className="text-xs px-2 py-1 rounded border">{c.isActive ? 'Disable' : 'Enable'}</button>
                      <button onClick={() => deleteCategory(c._id)} className="text-xs px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                    </div>
                  )}
                </div>
              ))}
              {categories.length === 0 && <div className="py-6 text-sm text-gray-500">No categories</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Products header */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium">Product</div>
            <div className="flex items-center gap-2">
              <button onClick={loadData} className="px-3 py-2 rounded border text-sm">Refresh</button>
              {selectedProducts.size > 0 && (
                <button 
                  onClick={bulkDeleteProducts} 
                  className="px-3 py-2 rounded bg-red-600 text-white text-sm"
                >
                  Delete Selected ({selectedProducts.size})
                </button>
              )}
              <button onClick={() => navigate('/admin/products/new')} className="px-3 py-2 rounded bg-blue-600 text-white text-sm">+ Add Product</button>
            </div>
          </div>

          {/* Product list table */}
          <div className="border rounded-lg bg-white overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={selectedProducts.size === products.length && products.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts(new Set(products.map(p => p._id || p.id)));
                        } else {
                          setSelectedProducts(new Set());
                        }
                      }}
                      className="mr-2"
                    />
                  </th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Category</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Quantity</th>
                  <th className="px-3 py-2">Image</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((p) => {
                  const key = p._id ? p._id : (p.frontendId != null ? `fe-${p.frontendId}` : null);
                  const isEditing = editingProductKey === key;
                  return (
                    <tr key={p._id || p.id || p.name}>
                      <td className="px-3 py-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(p._id || p.id)}
                          onChange={() => toggleProductSelection(p._id || p.id)}
                          className="mr-2"
                        />
                      </td>
                      <td className="px-3 py-2 font-medium">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 text-sm w-full" value={editProduct.name} onChange={(e)=>setEditProduct(v=>({...v,name:e.target.value}))} />
                        ) : (
                          p.name
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 text-sm w-full" value={editProduct.category} onChange={(e)=>setEditProduct(v=>({...v,category:e.target.value}))} />
                        ) : (
                          p.category || '—'
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 text-sm w-24" value={editProduct.price} onChange={(e)=>setEditProduct(v=>({...v,price:e.target.value}))} />
                        ) : (
                          `$${p.price}`
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 text-sm w-20" value={editProduct.stock ?? ''} onChange={(e)=>setEditProduct(v=>({...v,stock:e.target.value}))} />
                        ) : (
                          p.stock ?? '—'
                        )}
                      </td>
                      <td className="px-3 py-2">
                        {isEditing ? (
                          <input className="border rounded px-2 py-1 text-sm w-full" value={editProduct.image} onChange={(e)=>setEditProduct(v=>({...v,image:e.target.value}))} />
                        ) : (
                          p.displayImage || p.image ? (
                            <img src={p.displayImage || p.image} alt="" className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-gray-100" />
                          )
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <button onClick={saveEditProduct} className="px-2 py-1 rounded bg-blue-600 text-white text-xs">Save</button>
                              <button onClick={cancelEditProduct} className="px-2 py-1 rounded border text-xs">Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => beginEditProduct(p)} className="px-2 py-1 rounded border text-xs">Edit</button>
                              <button onClick={() => deleteProduct(p)} className="px-2 py-1 rounded bg-red-600 text-white text-xs">Delete</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr><td className="px-3 py-4 text-gray-500" colSpan={7}>No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
           </div>
      )}

      {loading && <div className="mt-6 text-sm text-gray-500">Loading...</div>}
    </div>
  );
}