import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import TestimonialFormModal from '../components/admin/TestimonialFormModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const AdminTestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API_URL}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await axios.delete(`${API_URL}/testimonials/${testimonialId}`);
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Failed to delete testimonial');
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTestimonial(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF66] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Testimonials</h1>
          <p className="text-gray-400">Manage customer reviews and testimonials</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <img
                src={testimonial.avatar || 'https://via.placeholder.com/60'}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{testimonial.name}</h3>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < testimonial.rating ? 'fill-[#00FF66] text-[#00FF66]' : 'text-gray-600'}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-4">{testimonial.text}</p>

            {testimonial.product_purchased && (
              <p className="text-xs text-gray-500 mb-4">Product: {testimonial.product_purchased}</p>
            )}

            <div className="flex gap-2 text-xs mb-4">
              {testimonial.is_active && (
                <span className="px-2 py-1 bg-[#00FF66]/10 text-[#00FF66] rounded">Active</span>
              )}
              {testimonial.is_featured && (
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded">Featured</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(testimonial)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Edit size={16} />
                Edit
              </button>
              <button
                onClick={() => handleDelete(testimonial.id)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No testimonials yet</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF66] text-black font-bold rounded-lg hover:bg-[#00FF66]/90 transition-all"
          >
            <Plus size={20} />
            Add Your First Testimonial
          </button>
        </div>
      )}

      {modalOpen && (
        <TestimonialFormModal
          testimonial={editingTestimonial}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default AdminTestimonialsPage;