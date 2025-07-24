import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  Settings,
  Search,
  Bell,
  User,
  Database,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';
import { exportData } from '../lib/localStorage';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-500' },
    { name: 'Clientes', href: '/clients', icon: Users, color: 'from-green-500 to-emerald-500' },
    { name: 'Calendario', href: '/calendar', icon: Calendar, color: 'from-purple-500 to-pink-500' },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare, color: 'from-orange-500 to-red-500' },
    { name: 'Configuración', href: '/settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } border-r border-gray-200`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  CER-FreeLancers
                </h1>
                <p className="text-sm text-gray-600 font-medium">CRM Profesional</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link ${isActive ? 'active' : ''} group relative`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-lg' 
                      : 'bg-gray-100 group-hover:bg-white group-hover:shadow-md'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      isActive 
                        ? 'text-blue-600' 
                        : 'text-gray-600 group-hover:text-blue-600'
                    }`} />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                  {isActive && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1 text-left">
                  <p className="text-sm font-bold text-gray-900">Freelancer Pro</p>
                  <p className="text-xs text-gray-600">freelancer@email.com</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {profileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 backdrop-blur-sm">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300"
                  >
                    <Database className="w-5 h-5 mr-3" />
                    Exportar Datos
                  </button>
                  <Link
                    to="/settings"
                    className="w-full flex items-center px-6 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    Configuración
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, tareas, proyectos..."
                    className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-3 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all duration-300 group">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">3</span>
                </span>
              </button>
              
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;