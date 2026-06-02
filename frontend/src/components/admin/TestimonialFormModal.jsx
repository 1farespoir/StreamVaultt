import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const TestimonialFormModal = ({ testimonial, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    rating: 5.0,
    text: '',
    product_purchased: '',
    is_active: true,
    is_featured: false,
    display_order: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    }
  }, [testimonial]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (testimonial) {
        await axios.put(`${API_URL}/testimonials/${testimonial.id}`, formData);
      } else {
        await axios.post(`${API_URL}/testimonials`, formData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert(error.response?.data?.detail || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{testimonial ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <input
              type="text"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Testimonial Text *</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              placeholder="This service is amazing..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Purchased</label>
            <input
              type="text"
              name="product_purchased"
              value={formData.product_purchased}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              placeholder="Spotify Premium"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 accent-[#00FF66]"
              />
              <span className="text-sm font-medium">Featured</span>
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Order</label>
              <input
                type="number"
                name="display_order"
                value={formData.display_order}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

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
              {loading ? 'Saving...' : (testimonial ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialFormModal;