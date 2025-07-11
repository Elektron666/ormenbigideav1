import React from 'react';
import { 
  Users, 
  Package, 
  TrendingUp, 
  BarChart3,
  Archive,
  Lightbulb,
  BookOpen,
  Settings, 
  Download, 
  Upload,
  Home,
  X,
  Heart,
  Scissors
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
  { id: 'stock', label: 'Kartela Stok', icon: Archive },
  { id: 'motivation', label: 'Motivasyon', icon: Lightbulb },
  { id: 'notes', label: 'Notlarım', icon: BookOpen },
  { id: 'backup', label: 'Yedek Al/Yükle', icon: Download },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

export function Sidebar({ isOpen, onClose, activeTab, onTabChange }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 2xl:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        2xl:relative 2xl:translate-x-0 2xl:shadow-none 2xl:border-r 2xl:border-gray-200
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Scissors className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">ORMEN TEKSTİL</h2>
                <p className="text-xs text-gray-600">Kartela Sistemi V1</p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 2xl:hidden"
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
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-center">
              <p className="text-sm text-blue-700 font-semibold">ORMEN TEKSTİL</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}