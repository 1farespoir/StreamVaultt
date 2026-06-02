import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const DealFormModal = ({ deal, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_code: '',
    discount_percentage: '',
    image_url: '',
    background_color: '#00FF66',
    text_color: '#000000',
    is_active: true,
    show_once_per_session: true,
    show_delay_seconds: 3,
    show_frequency_days: 1,
    start_date: '',
    end_date: '',
    cta_text: 'Shop Now',
    cta_link: '/#subscriptions',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        ...deal,
        start_date: deal.start_date ? new Date(deal.start_date).toISOString().slice(0, 16) : '',
        end_date: deal.end_date ? new Date(deal.end_date).toISOString().slice(0, 16) : '',
      });
    }
  }, [deal]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
        end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null,
      };

      if (deal) {
        await axios.put(`${API_URL}/deals/${deal.id}`, submitData);
      } else {
        await axios.post(`${API_URL}/deals`, submitData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
      alert(error.response?.data?.detail || 'Failed to save deal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-2xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">{deal ? 'Edit Deal' : 'Create New Deal'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              placeholder="Get 50% OFF This Week!"
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
              placeholder="Limited time offer on all subscriptions"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Discount Code</label>
              <input
                type="text"
                name="discount_code"
                value={formData.discount_code}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="SAVE50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Discount %</label>
              <input
                type="number"
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <input
                type="text"
                name="background_color"
                value={formData.background_color}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <input
                type="text"
                name="text_color"
                value={formData.text_color}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Show Delay (seconds)</label>
              <input
                type="number"
                name="show_delay_seconds"
                value={formData.show_delay_seconds}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Show Frequency (days)</label>
              <input
                type="number"
                name="show_frequency_days"
                value={formData.show_frequency_days}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date (Optional)</label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">CTA Text</label>
              <input
                type="text"
                name="cta_text"
                value={formData.cta_text}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">CTA Link</label>
              <input
                type="text"
                name="cta_link"
                value={formData.cta_link}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer flex-1">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5 accent-[#00FF66]"
              />
              <span className="text-sm font-medium">Active</span>
            </label>

            <label className="flex items-center gap-3 p-4 bg-gray-800/50 rounded-lg cursor-pointer flex-1">
              <input
                type="checkbox"
                name="show_once_per_session"
                checked={formData.show_once_per_session}
                onChange={handleChange}
                className="w-5 h-5 accent-[#00FF66]"
              />
              <span className="text-sm font-medium">Once Per Session</span>
            </label>
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
              {loading ? 'Saving...' : (deal ? 'Update Deal' : 'Create Deal')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealFormModal;