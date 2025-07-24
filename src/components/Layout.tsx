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
  ChevronDown
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
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/clients', icon: Users },
    { name: 'Calendario', href: '/calendar', icon: Calendar },
    { name: 'Tareas', href: '/tasks', icon: CheckSquare },
    { name: 'Configuración', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-strong transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="ml-4">
                <h1 className="text-xl font-bold gradient-text">CER-FreeLancers</h1>
                <p className="text-sm text-slate-500 font-medium">CRM Profesional</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`nav-link ${isActive ? 'active' : ''} group`}
                >
                  <item.icon className="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-full flex items-center p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-900">Freelancer Pro</p>
                  <p className="text-xs text-slate-500">freelancer@email.com</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {profileOpen && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-strong border border-slate-100 py-2 animate-scale-in">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Database className="w-4 h-4 mr-3" />
                    Exportar Datos
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                    <Settings className="w-4 h-4 mr-3" />
                    Configuración
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar clientes, tareas..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm transition-all duration-200"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="relative p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;