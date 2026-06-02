import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Plus, Trash2 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const ProductFormModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    category: '',
    plans: [{ duration: '1m', price: 0, original_price: 0 }],
    currency: 'USD',
    icon: '',
    images: [],
    color: '#00FF66',
    features: [''],
    is_active: true,
    is_popular: false,
    in_stock: true,
    stock_count: null,
    seo_title: '',
    seo_description: '',
    seo_keywords: [],
    custom_fields: {},
    display_order: 0,
  });

  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [badgeInput, setBadgeInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        features: product.features.length > 0 ? product.features : [''],
        custom_fields: product.custom_fields || {},
      });
      setBadgeInput(product.custom_fields?.badge || '');
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from name
    if (name === 'name' && !product) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handlePlanChange = (index, field, value) => {
    const newPlans = [...formData.plans];
    newPlans[index][field] = field === 'duration' ? value : parseFloat(value) || 0;
    
    // Auto-calculate savings
    if (field === 'price' || field === 'original_price') {
      const price = field === 'price' ? parseFloat(value) || 0 : newPlans[index].price;
      const originalPrice = field === 'original_price' ? parseFloat(value) || 0 : newPlans[index].original_price;
      newPlans[index].savings = originalPrice - price;
    }
    
    setFormData(prev => ({ ...prev, plans: newPlans }));
  };

  const addPlan = () => {
    setFormData(prev => ({
      ...prev,
      plans: [...prev.plans, { duration: '1m', price: 0, original_price: 0 }]
    }));
  };

  const removePlan = (index) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features.filter(f => f), featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addKeyword = () => {
    if (keywordInput.trim()) {
      setFormData(prev => ({
        ...prev,
        seo_keywords: [...prev.seo_keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  };

  const removeKeyword = (index) => {
    setFormData(prev => ({
      ...prev,
      seo_keywords: prev.seo_keywords.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Add badge to custom_fields if provided
      const submitData = {
        ...formData,
        features: formData.features.filter(f => f.trim()),
        custom_fields: {
          ...formData.custom_fields,
          ...(badgeInput.trim() && { badge: badgeInput.trim() })
        }
      };

      if (product) {
        await axios.put(`${API_URL}/products/${product.id}`, submitData);
      } else {
        await axios.post(`${API_URL}/products`, submitData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.detail || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-4xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="e.g., Spotify Premium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="spotify-premium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description</label>
              <input
                type="text"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Ad-free music, anywhere."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Full product description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="Music Streaming"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Icon Name *</label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="spotify"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Brand Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="#00FF66"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Badge (Optional)</label>
              <input
                type="text"
                value={badgeInput}
                onChange={(e) => setBadgeInput(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Best Seller"
              />
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#00FF66]">Pricing Plans</h3>
              <button
                type="button"
                onClick={addPlan}
                className="flex items-center gap-2 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
              >
                <Plus size={16} />
                Add Plan
              </button>
            </div>

            {formData.plans.map((plan, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/50 rounded-lg">
                <div>
                  <label className="block text-xs font-medium mb-2">Duration</label>
                  <select
                    value={plan.duration}
                    onChange={(e) => handlePlanChange(index, 'duration', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#00FF66] text-white text-sm"
                  >
                    <option value="1m">1 Month</option>
                    <option value="3m">3 Months</option>
                    <option value="6m">6 Months</option>
                    <option value="12m">12 Months</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={plan.price}
                    onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#00FF66] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={plan.original_price || ''}
                    onChange={(e) => handlePlanChange(index, 'original_price', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-[#00FF66] text-white text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removePlan(index)}
                    disabled={formData.plans.length === 1}
                    className="w-full px-3 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Trash2 size={16} className="mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">Features</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Add a feature..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-2 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {formData.features.filter(f => f).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <span className="flex-1 text-sm">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">Images</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Image URL..."
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+Image'; }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">SEO</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">SEO Title</label>
              <input
                type="text"
                name="seo_title"
                value={formData.seo_title}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="Product Name - StreamVault"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO Description</label>
              <textarea
                name="seo_description"
                value={formData.seo_description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="SEO description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">SEO Keywords</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="Add keyword..."
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-4 py-2 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.seo_keywords.map((keyword, index) => (
                  <span key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Status & Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#00FF66]">Status & Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#00FF66]"
                />
                <span className="text-sm font-medium">Active</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="is_popular"
                  checked={formData.is_popular}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#00FF66]"
                />
                <span className="text-sm font-medium">Popular</span>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  name="in_stock"
                  checked={formData.in_stock}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#00FF66]"
                />
                <span className="text-sm font-medium">In Stock</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Stock Count (Optional)</label>
                <input
                  type="number"
                  name="stock_count"
                  value={formData.stock_count || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="Leave empty for unlimited"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  value={formData.display_order}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;
