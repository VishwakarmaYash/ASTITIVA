import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, Save, Loader } from "lucide-react";
import { Product } from "../types";
import { productsAPI } from "../../api/client";

interface ProductManagerProps {
  onClose: () => void;
  onProductsUpdated: () => void;
}

interface FormProduct extends Omit<Product, "id"> {
  id?: string;
}

export default function ProductManager({ onClose, onProductsUpdated }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState<FormProduct>({
    name: "",
    price: 0,
    colorCode: "",
    image: "",
    description: "",
    category: "Jackets",
    features: [],
    specs: [],
    sizes: [],
  });

  const [featureInput, setFeatureInput] = useState("");
  const [specInput, setSpecInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productsAPI.getAll();
        setProducts(data);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to load products" });
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      price: 0,
      colorCode: "",
      image: "",
      description: "",
      category: "Jackets",
      features: [],
      specs: [],
      sizes: [],
    });
    setEditingId(null);
    setFeatureInput("");
    setSpecInput("");
    setSizeInput("");
  };

  const handleEdit = (product: Product) => {
    setFormData(product);
    setEditingId(product.id);
  };

  const addArrayItem = (array: string[], value: string, setter: (items: string[]) => void) => {
    if (value.trim()) {
      setter([...array, value.trim()]);
    }
  };

  const removeArrayItem = (array: string[], index: number, setter: (items: string[]) => void) => {
    setter(array.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!formData.name || !formData.price) {
      setMessage({ type: "error", text: "Name and price are required" });
      return;
    }

    try {
      setLoading(true);

      if (editingId) {
        // Update existing product (optional - depends on backend)
        await productsAPI.getById(editingId); // Just to verify it exists
        setMessage({ type: "success", text: "Product would be updated (endpoint needed)" });
      } else {
        // Create new product - this calls the backend API
        const newProduct = await productsAPI.createProduct(formData);
        setProducts([...products, newProduct]);
        setMessage({ type: "success", text: "Product added successfully!" });
        resetForm();
        onProductsUpdated();
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to save product" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setLoading(true);
      await productsAPI.deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      setMessage({ type: "success", text: "Product deleted" });
      onProductsUpdated();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to delete product" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 p-6 flex justify-between items-center">
          <h2 className="font-display font-bold text-2xl text-[#141b2b] uppercase tracking-wider">
            PRODUCT MANAGEMENT
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-lg transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Form Section */}
          <div className="lg:col-span-1 border border-black/10 rounded-lg p-6 bg-[#f9f9ff] h-fit sticky top-0">
            <h3 className="font-mono text-xs font-bold text-[#575f65] uppercase tracking-widest mb-4">
              {editingId ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
            </h3>

            {message && (
              <div
                className={`p-3 rounded mb-4 text-xs font-mono ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3">
              {/* Basic Info */}
              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Product ID
                </label>
                <input
                  type="text"
                  value={formData.id || ""}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!editingId}
                  placeholder="unique-product-id"
                  className="w-full px-3 py-2 border border-black/10 rounded text-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., KINETIC SHELL"
                  className="w-full px-3 py-2 border border-black/10 rounded text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-black/10 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-black/10 rounded text-sm"
                  >
                    <option>Jackets</option>
                    <option>Pants</option>
                    <option>Footwear</option>
                    <option>Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Color Code
                </label>
                <input
                  type="text"
                  value={formData.colorCode}
                  onChange={(e) => setFormData({ ...formData, colorCode: e.target.value })}
                  placeholder="e.g., GLACIER / 01"
                  className="w-full px-3 py-2 border border-black/10 rounded text-sm"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-black/10 rounded text-sm"
                />
              </div>

              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-black/10 rounded text-sm resize-none"
                />
              </div>

              {/* Array Inputs */}
              <div>
                <label className="text-[9px] font-bold text-[#575f65] uppercase tracking-widest block mb-1">
                  Sizes (XS, S, M, L, XL)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value.toUpperCase())}
                    placeholder="Add size"
                    className="flex-1 px-2 py-1 border border-black/10 rounded text-xs"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addArrayItem(formData.sizes, sizeInput, (sizes) =>
                          setFormData({ ...formData, sizes })
                        );
                        setSizeInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      addArrayItem(formData.sizes, sizeInput, (sizes) =>
                        setFormData({ ...formData, sizes })
                      );
                      setSizeInput("");
                    }}
                    className="px-2 py-1 bg-[#141b2b] text-white text-xs rounded hover:bg-[#1a2439]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.sizes.map((size, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-black/10 text-xs rounded flex items-center gap-1"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem(formData.sizes, i, (sizes) =>
                            setFormData({ ...formData, sizes })
                          )
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-[#141b2b] hover:bg-[#1a2439] text-white font-mono text-xs font-bold uppercase tracking-wider rounded transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    SAVING...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingId ? "UPDATE" : "ADD"}
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-mono text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  CANCEL
                </button>
              )}
            </form>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <h3 className="font-mono text-xs font-bold text-[#575f65] uppercase tracking-widest mb-4">
              EXISTING PRODUCTS ({products.length})
            </h3>

            {loading && products.length === 0 ? (
              <div className="text-center py-12">
                <Loader className="w-6 h-6 animate-spin mx-auto text-[#141b2b] mb-2" />
                <p className="text-sm text-[#575f65]">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-[#f9f9ff] rounded border border-dashed border-black/10">
                <p className="text-sm text-[#575f65]">No products yet. Add your first one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="border border-black/10 rounded-lg p-4 hover:bg-[#f9f9ff]">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-[#141b2b] uppercase tracking-wider">
                          {product.name}
                        </h4>
                        <p className="text-xs text-[#575f65] mt-1">
                          {product.colorCode} • ${product.price} • {product.category}
                        </p>
                        {product.sizes && product.sizes.length > 0 && (
                          <p className="text-xs text-[#575f65] mt-1">
                            Sizes: {product.sizes.join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
