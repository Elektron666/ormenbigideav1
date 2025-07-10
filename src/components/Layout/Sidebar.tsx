import React from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  FileText, 
  Settings, 
  Download, 
  Upload,
  BarChart3,
  Home,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Ana Sayfa', icon: Home },
  { id: 'customers', label: 'Müşteriler', icon: Users },
  { id: 'products', label: 'Kartelalar', icon: Package },
  { id: 'movements', label: 'Hareketler', icon: TrendingUp },
  { id: 'reports', label: 'Raporlar', icon: BarChart3 },
  { id: 'import-export', label: 'Veri Yönetimi', icon: FileText },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:shadow-none lg:border-r lg:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Kartela Yönetimi</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      onTabChange(item.id);
                      onClose();
                    }}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors
                      ${isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-xs text-blue-600 font-medium">Kartela Yönetim v1.0</p>
            <p className="text-xs text-blue-500 mt-1">Modern & Kullanıcı Dostu</p>
          </div>
        </div>
      </aside>
    </>
  );
}