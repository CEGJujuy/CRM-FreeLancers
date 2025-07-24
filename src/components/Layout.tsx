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
  Zap,
  Star,
  Crown
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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'from-purple-500 to-blue-600' },
    { name: 'Clientes', href: '/clients', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { name: 'Calendario', href: '/calendar', icon: Calendar, color: 'from-orange-500 to-red-600' },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare, color: 'from-pink-500 to-rose-600' },
    { name: 'Configuración', href: '/settings', icon: Settings, color: 'from-indigo-500 to-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 particle-bg">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gradient-to-br from-purple-900/60 to-blue-900/60 backdrop-blur-lg lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-xl shadow-2xl border-r border-white/20 transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo Premium */}
          <div className="flex items-center justify-between px-8 py-8 border-b border-gradient-to-r from-purple-100 to-blue-100">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-black gradient-text">CER-FreeLancers</h1>
                <p className="text-sm font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  CRM Profesional ✨
                </p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Premium */}
          <nav className="flex-1 px-6 py-8 space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link group relative overflow-hidden ${isActive ? 'active' : ''}`}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-bold text-lg ml-4 group-hover:text-purple-700 transition-colors">
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="ml-auto flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-blue-500/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Premium */}
          <div className="p-6 border-t border-gradient-to-r from-purple-100 to-blue-100">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center p-4 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4 flex-1 text-left">
                  <p className="text-sm font-bold text-slate-900">Freelancer Pro ⭐</p>
                  <p className="text-xs font-semibold text-purple-600">freelancer@email.com</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-purple-600 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {profileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-3 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 py-3 animate-scale-in">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-purple-700 transition-all duration-300"
                  >
                    <Database className="w-5 h-5 mr-3 text-purple-500" />
                    Exportar Datos
                  </button>
                  <button className="w-full flex items-center px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 hover:text-purple-700 transition-all duration-300">
                    <Settings className="w-5 h-5 mr-3 text-blue-500" />
                    Configuración
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header Premium */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/30 px-8 py-6 sticky top-0 z-30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 text-slate-400 hover:text-purple-600 hover:bg-purple-100 rounded-xl transition-all duration-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, tareas, proyectos..."
                    className="w-full pl-14 pr-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-300 focus:border-purple-500 focus:bg-white text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <kbd className="px-3 py-1 text-xs font-bold text-purple-600 bg-purple-100 rounded-lg border border-purple-200">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-4 text-slate-400 hover:text-purple-600 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 cursor-pointer">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;