import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  Package,
  Calendar,
  Clock
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/statistics`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = '#00FF66' }) => (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg`} style={{ backgroundColor: `${color}20` }}>
          <Icon size={24} style={{ color }} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-sm font-medium text-gray-300">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00FF66] mx-auto mb-4"></div>
          <p className="text-gray-400">Loading statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's what's happening with GetSub today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`$${stats?.total_revenue?.toLocaleString() || '0'}`}
          subtitle="All time"
          color="#00FF66"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={stats?.total_orders?.toLocaleString() || '0'}
          subtitle="All time"
          color="#3B82F6"
        />
        <StatCard
          icon={TrendingUp}
          title="Revenue Today"
          value={`$${stats?.revenue_today?.toLocaleString() || '0'}`}
          subtitle={`${stats?.orders_today || 0} orders`}
          color="#F59E0B"
        />
        <StatCard
          icon={Calendar}
          title="This Week"
          value={`$${stats?.revenue_this_week?.toLocaleString() || '0'}`}
          subtitle={`${stats?.orders_this_week || 0} orders`}
          color="#8B5CF6"
        />
        <StatCard
          icon={Clock}
          title="This Month"
          value={`$${stats?.revenue_this_month?.toLocaleString() || '0'}`}
          subtitle={`${stats?.orders_this_month || 0} orders`}
          color="#EC4899"
        />
        <StatCard
          icon={Package}
          title="Active Products"
          value={stats?.top_products?.length || '0'}
          subtitle="Top sellers"
          color="#10B981"
        />
      </div>

      {/* Top Products */}
      {stats?.top_products && stats.top_products.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Top Products</h2>
          <div className="space-y-4">
            {stats.top_products.map((product, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#00FF66]/10 flex items-center justify-center text-[#00FF66] font-bold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-white">{product.name}</p>
                    <p className="text-sm text-gray-400">{product.count} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-[#00FF66] h-2 rounded-full transition-all"
                      style={{ 
                        width: `${(product.count / stats.top_products[0].count) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/products" className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-center">
            <Package className="mx-auto mb-2 text-[#00FF66]" size={24} />
            <p className="font-medium">Add Product</p>
          </a>
          <a href="/admin/deals" className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-center">
            <TrendingUp className="mx-auto mb-2 text-[#00FF66]" size={24} />
            <p className="font-medium">Create Deal</p>
          </a>
          <a href="/admin/testimonials" className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-center">
            <ShoppingBag className="mx-auto mb-2 text-[#00FF66]" size={24} />
            <p className="font-medium">Add Review</p>
          </a>
          <a href="/admin/orders" className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors text-center">
            <Calendar className="mx-auto mb-2 text-[#00FF66]" size={24} />
            <p className="font-medium">View Orders</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
