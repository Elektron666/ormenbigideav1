import React, { useState, useMemo } from 'react';
import { Plus, Package, MapPin, Tag, Edit, Trash2, Search, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  minStock?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export function StockManagement() {
  const [stockItems, setStockItems] = useLocalStorage<StockItem[]>('ormen_stock_items', [
    {
      id: '1',
      name: 'Pamuk Kartela A1',
      category: 'Pamuk',
      quantity: 150,
      location: 'Depo A - Raf 1',
      minStock: 50,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Polyester Mix B2',
      category: 'Polyester',
      quantity: 75,
      location: 'Depo B - Raf 3',
      minStock: 30,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '3',
      name: 'Viskon Premium C1',
      category: 'Viskon',
      quantity: 25,
      location: 'Depo A - Raf 2',
      minStock: 40,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '4',
      name: 'Karışım Ekonomik D1',
      category: 'Karışım',
      quantity: 200,
      location: 'Depo B - Raf 1',
      minStock: 80,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'quantity' | 'category' | 'location'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);
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

  // Statistics calculations
  const totalItems = stockItems.length;
  const totalQuantity = stockItems.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = stockItems.filter(item => 
    item.minStock && item.quantity <= item.minStock
  );
  const categoryCounts = categories.map(cat => ({
    category: cat,
    count: stockItems.filter(item => item.category === cat).length,
    quantity: stockItems.filter(item => item.category === cat).reduce((sum, item) => sum + item.quantity, 0)
  })).filter(item => item.count > 0);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let filtered = stockItems;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term) ||
        (item.notes && item.notes.toLowerCase().includes(term))
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        const comparison = aVal.localeCompare(bVal, 'tr-TR', { sensitivity: 'base' });
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
  }, [stockItems, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity && newItem.location) {
      const item: StockItem = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        category: newItem.category,
        quantity: parseInt(newItem.quantity),
        location: newItem.location,
        minStock: newItem.minStock ? parseInt(newItem.minStock) : undefined,
        notes: newItem.notes.trim() || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setStockItems(prev => [...prev, item]);
      setNewItem({ name: '', category: '', quantity: '', location: '', minStock: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleEditItem = (item: StockItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      location: item.location,
      minStock: item.minStock?.toString() || '',
      notes: item.notes || '',
    });
    setShowAddForm(true);
  };

  const handleUpdateItem = () => {
    if (editingItem && newItem.name && newItem.category && newItem.quantity && newItem.location) {
      setStockItems(prev => prev.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              name: newItem.name.trim(),
              category: newItem.category,
              quantity: parseInt(newItem.quantity),
              location: newItem.location,
              minStock: newItem.minStock ? parseInt(newItem.minStock) : undefined,
              notes: newItem.notes.trim() || undefined,
              updatedAt: new Date(),
            }
          : item
      ));
      setEditingItem(null);
      setNewItem({ name: '', category: '', quantity: '', location: '', minStock: '', notes: '' });
      setShowAddForm(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Bu stok kaydını silmek istediğinizden emin misiniz?')) {
      setStockItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingItem(null);
    setNewItem({ name: '', category: '', quantity: '', location: '', minStock: '', notes: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Kartela Stok Yönetimi</h2>
              <p className="text-gray-600">Bağımsız stok takip sistemi</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2.5 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Stok Kalemi</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Toplam Kalem</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
            <Package className="w-8 h-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Toplam Miktar</p>
              <p className="text-2xl font-bold">{totalQuantity.toLocaleString('tr-TR')}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Düşük Stok</p>
              <p className="text-2xl font-bold">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Kategori</p>
              <p className="text-2xl font-bold">{categoryCounts.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-900">Düşük Stok Uyarısı</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg p-3 border border-red-200">
                <p className="font-medium text-red-800">{item.name}</p>
                <p className="text-red-600 text-sm">
                  Mevcut: {item.quantity} | Min: {item.minStock} | Konum: {item.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Stok ara..."
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="name">İsim</option>
            <option value="category">Kategori</option>
            <option value="quantity">Miktar</option>
            <option value="location">Konum</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span>{sortOrder === 'asc' ? 'Artan' : 'Azalan'}</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingItem ? 'Stok Kalemi Düzenle' : 'Yeni Stok Kalemi'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı *</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ürün adı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konum *</label>
              <select
                value={newItem.location}
                onChange={(e) => setNewItem(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
              <input
                type="text"
                value={newItem.notes}
                onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Ek notlar"
              />
            </div>
          </div>
          
          <div className="flex space-x-3 mt-6">
            <button
              onClick={editingItem ? handleUpdateItem : handleAddItem}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              {editingItem ? 'Güncelle' : 'Kaydet'}
            </button>
            <button
              onClick={handleCancelForm}
              className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              İptal
            </button>
          </div>
        </div>
      )}

      {/* Stock Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 hover:border-purple-300 transform hover:scale-[1.02]">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 border border-purple-200">
                <span className="text-sm font-bold text-purple-700">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Tag className="w-4 h-4 mr-1" />
                  <span className="text-sm">{item.category}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Miktar:</span>
                <span className={`font-bold text-lg ${
                  item.minStock && item.quantity <= item.minStock 
                    ? 'text-red-600' 
                    : item.quantity > (item.minStock || 0) * 2
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}>
                  {item.quantity.toLocaleString('tr-TR')} adet
                </span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{item.location}</span>
              </div>
              
              {item.minStock && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Min. Stok:</span>
                  <span className="text-gray-700 font-medium">{item.minStock} adet</span>
                </div>
              )}
              
              {item.notes && (
                <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">{item.notes}</p>
              )}

              {/* Stock Level Indicator */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    item.minStock && item.quantity <= item.minStock 
                      ? 'bg-red-500' 
                      : item.quantity > (item.minStock || 0) * 2
                      ? 'bg-green-500'
                      : 'bg-orange-500'
                  }`}
                  style={{ 
                    width: item.minStock 
                      ? `${Math.min((item.quantity / (item.minStock * 3)) * 100, 100)}%`
                      : '100%'
                  }}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditItem(item)}
                className="flex-1 flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-3 py-2.5 rounded-lg hover:from-purple-200 hover:to-indigo-200 transition-all duration-200 font-medium"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm">Düzenle</span>
              </button>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="flex items-center justify-center bg-gradient-to-r from-red-100 to-pink-100 text-red-700 px-3 py-2.5 rounded-lg hover:from-red-200 hover:to-pink-200 transition-all duration-200"
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
            {searchTerm || selectedCategory ? 'Filtreleme kriterlerinize uygun stok bulunamadı.' : 'Henüz hiç stok kalemi eklenmemiş.'}
          </p>
          {!searchTerm && !selectedCategory && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>İlk Stok Kalemini Ekle</span>
            </button>
          )}
        </div>
      )}

      {/* Category Summary */}
      {categoryCounts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategori Özeti</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryCounts.map(cat => (
              <div key={cat.category} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900">{cat.category}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">{cat.count} kalem</p>
                  <p className="text-lg font-bold text-gray-900">{cat.quantity.toLocaleString('tr-TR')} adet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}