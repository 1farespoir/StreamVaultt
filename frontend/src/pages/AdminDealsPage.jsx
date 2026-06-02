import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DealFormModal from '../components/admin/DealFormModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const AdminDealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await axios.get(`${API_URL}/deals`);
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) return;
    try {
      await axios.delete(`${API_URL}/deals/${dealId}`);
      fetchDeals();
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal');
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingDeal(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingDeal(null);
    fetchDeals();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF66] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Deals & Popups</h1>
          <p className="text-gray-400">Manage promotional popups and deals</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
        >
          <Plus size={20} />
          Create Deal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {deals.map((deal) => (
          <div
            key={deal.id}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                {deal.is_active ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#00FF66]/10 text-[#00FF66] text-xs font-bold rounded-full mb-2">
                    <Eye size={14} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-gray-800 text-gray-400 text-xs font-bold rounded-full mb-2">
                    <EyeOff size={14} />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{deal.title}</h3>
            <p className="text-sm text-gray-400 mb-4">{deal.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              {deal.discount_percentage && (
                <div>
                  <span className="text-gray-500">Discount:</span>
                  <p className="text-white font-medium">{deal.discount_percentage}% OFF</p>
                </div>
              )}
              {deal.discount_code && (
                <div>
                  <span className="text-gray-500">Code:</span>
                  <p className="text-white font-medium font-mono">{deal.discount_code}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Delay:</span>
                <p className="text-white font-medium">{deal.show_delay_seconds}s</p>
              </div>
              <div>
                <span className="text-gray-500">Frequency:</span>
                <p className="text-white font-medium">{deal.show_frequency_days} day(s)</p>
              </div>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 mb-4">
              <span>Views: {deal.views_count || 0}</span>
              <span>Clicks: {deal.clicks_count || 0}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(deal)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(deal.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {deals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No deals yet</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
          >
            <Plus size={20} />
            Create Your First Deal
          </button>
        </div>
      )}

      {modalOpen && (
        <DealFormModal
          deal={editingDeal}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminDealsPage;