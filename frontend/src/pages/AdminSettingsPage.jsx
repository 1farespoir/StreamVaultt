import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Save } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${API_URL}/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(`${API_URL}/settings`, settings);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF66] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
        <p className="text-gray-400">Manage your site configuration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#00FF66]">General</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Site Name</label>
              <input
                type="text"
                name="site_name"
                value={settings?.site_name || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <input
                type="text"
                name="currency"
                value={settings?.currency || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Site Tagline</label>
            <input
              type="text"
              name="site_tagline"
              value={settings?.site_tagline || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <input
                type="text"
                name="primary_color"
                value={settings?.primary_color || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <input
                type="text"
                name="secondary_color"
                value={settings?.secondary_color || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#00FF66]">Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Support Email</label>
              <input
                type="email"
                name="support_email"
                value={settings?.support_email || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Support Phone</label>
              <input
                type="text"
                name="support_phone"
                value={settings?.support_phone || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
            <input
              type="text"
              name="whatsapp_number"
              value={settings?.whatsapp_number || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
            />
          </div>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="show_whatsapp_button"
              checked={settings?.show_whatsapp_button || false}
              onChange={handleChange}
              className="w-5 h-5 accent-[#00FF66]"
            />
            <span className="text-sm font-medium">Show WhatsApp Button</span>
          </label>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-[#00FF66]">Trust Indicators</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Deliveries</label>
              <input
                type="number"
                name="total_deliveries"
                value={settings?.total_deliveries || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Average Rating</label>
              <input
                type="number"
                step="0.1"
                name="average_rating"
                value={settings?.average_rating || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Delivery Time (seconds)</label>
              <input
                type="number"
                name="delivery_time_seconds"
                value={settings?.delivery_time_seconds || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Uptime Percentage</label>
              <input
                type="number"
                step="0.01"
                name="uptime_percentage"
                value={settings?.uptime_percentage || 0}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-[#00FF66] text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettingsPage;