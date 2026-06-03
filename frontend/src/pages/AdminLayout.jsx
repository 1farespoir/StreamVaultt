import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  MessageSquare, 
  ShoppingCart, 
  Settings,
  Menu,
  X,
  Zap
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/deals', icon: Tag, label: 'Deals & Popups' },
    { to: '/admin/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-gray-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/admin')}>
            <Zap className="text-[#00FF66]" size={24} />
            <span className="text-xl font-bold">GetSub <span className="text-[#00FF66]">Admin</span></span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm"
        >
          View Site
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-16 bottom-0 w-64 bg-black/50 backdrop-blur-xl border-r border-gray-800 transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`pt-16 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'}`}>
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
