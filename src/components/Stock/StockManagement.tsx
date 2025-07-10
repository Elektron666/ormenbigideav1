import React, { useState } from 'react';
import { Plus, Package, MapPin, Tag, Edit, Trash2, Search } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  minStock?: number;
  notes?: string;
}

export function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: '1',
      name: 'Pamuk Kartela A1',
      category: 'Pamuk',
      quantity: 150,
      location: 'Depo A - Raf 1',
      minStock: 50,
    },
    {
      id: '2',
      name: 'Polyester Mix B2',
      category: 'Polyester',
      quantity: 75,
      location: 'Depo B - Raf 3',
      minStock: 30,
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    location: '',
    minStock: '',
    notes: '',
  });

  const categories = ['Pamuk', 'Polyester', 'Viskon', 'Karışım', 'Diğer'];
  const locations = ['Depo A - Raf 1', 'Depo A - Raf 2', 'Depo B - Raf 1', 'Depo B - Raf 2', 'Depo B - Raf 3'];

  const filteredItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity && newItem.location) {
      const item: StockItem = {
        id: Date.now().toString(),
        name: newItem.name,
        category: newItem.category,
        quantity: parseInt(newItem.quantity),
        location: newItem.location,
        minStock: newItem.minStock ? parseInt(newItem.minStock) : undefined,
        notes: newItem.notes || undefined,
      };
      
      setStockItems(prev => [...prev, item]);
      setNewItem({ name: '', category: '', quantity: '', location: '', minStock: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Bu stok kaydını silmek istediğinizden emin misiniz?')) {
      setStockItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getLowStockItems = () => {
    return stockItems.filter(item => 
      item.minStock && item.quantity <= item.minStock
    );
  };

  const lowStockItems = getLowStockItems();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kartela Stok Yönetimi</h2>
          <p className="text-gray-600 mt-1">Bağımsız stok takip sistemi</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Stok Kalemi</span>
        </button>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-medium text-red-900 mb-2">⚠️ Düşük Stok Uyarısı</h3>
          <div className="space-y-1">
            {lowStockItems.map(item => (
              <p key={item.id} className="text-red-700 text-sm">
                {item.name}: {item.quantity} adet (Min: {item.minStock})
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Stok ara..."
        />
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Yeni Stok Kalemi</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ürün adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Kategori seçin</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miktar *</label>
              <input
                type="number"
                value={newItem.quantity}
                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konum *</label>
              <select
                value={newItem.location}
                onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Konum seçin</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stok</label>
              <input
                type="number"
                value={newItem.minStock}
                onChange={(e) => setNewItem(prev => ({ ...prev, minStock: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
              <input
                type="text"
                value={newItem.notes}
                onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ek notlar"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleAddItem}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Kaydet
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Stock Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="text-sm">{item.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Miktar:</span>
                <span className={`font-semibold ${
                  item.minStock && item.quantity <= item.minStock 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {item.quantity} adet
                </span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{item.location}</span>
              </div>
              
              {item.minStock && (
                <div className="text-xs text-gray-500">
                  Min. Stok: {item.minStock} adet
                </div>
              )}
              
              {item.notes && (
                <p className="text-sm text-gray-600 italic">{item.notes}</p>
              )}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 flex items-center justify-center space-x-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                <Edit className="w-4 h-4" />
                <span className="text-sm">Düzenle</span>
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex items-center justify-center bg-red-100 text-red-700 px-3 py-2 rounded-lg hover:bg-red-200 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Stok kalemi bulunamadı</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'Arama kriterlerinize uygun stok bulunamadı.' : 'Henüz hiç stok kalemi eklenmemiş.'}
          </p>
        </div>
      )}
    </div>
  );
}