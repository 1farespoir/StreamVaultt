import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import ProductFormModal from '../components/admin/ProductFormModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await axios.delete(`${API_URL}/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF66] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-400">Manage your subscription products</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all relative"
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              {product.is_active ? (
                <Eye size={18} className="text-[#00FF66]" title="Active" />
              ) : (
                <EyeOff size={18} className="text-gray-500" title="Inactive" />
              )}
            </div>

            {/* Product Info */}
            <div className="mb-4">
              {product.custom_fields?.badge && (
                <span className="inline-block px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] text-xs font-bold rounded-full mb-3">
                  {product.custom_fields.badge}
                </span>
              )}
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{product.short_description}</p>
              
              {product.category && (
                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                  {product.category}
                </span>
              )}
            </div>

            {/* Pricing */}
            <div className="mb-4 space-y-2">
              {product.plans.map((plan, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{plan.duration}</span>
                  <div>
                    <span className="text-white font-bold">${plan.price}</span>
                    {plan.original_price && (
                      <span className="text-gray-500 line-through ml-2 text-xs">
                        ${plan.original_price}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">{product.features.length} features</p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No products yet</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
          >
            <Plus size={20} />
            Add Your First Product
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ProductFormModal
          product={editingProduct}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
