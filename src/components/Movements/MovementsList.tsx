import React, { useState, useMemo } from 'react';
import { Edit, Trash2, Calendar, User, Package, ArrowUpDown, Eye } from 'lucide-react';
import { Movement, Customer, Product } from '../../types';
import { SearchFilter } from '../Common/SearchFilter';
import { formatDate } from '../../utils/helpers';
import { tabletDebounce } from '../../utils/performance';

interface MovementsListProps {
  movements: Movement[];
  customers: Customer[];
  products: Product[];
  onEdit: (movement: Movement) => void;
  onDelete: (id: string) => void;
}

export function MovementsList({ movements, customers, products, onEdit, onDelete }: MovementsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<keyof Movement>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [displayCount, setDisplayCount] = useState(20); // Tablet için daha az

  const sortOptions = [
    { value: 'createdAt', label: 'Tarih' },
    { value: 'type', label: 'Tür' },
    { value: 'quantity', label: 'Miktar' },
  ];

  // Debounced search for better performance
  const debouncedSetSearchTerm = useMemo(
    () => tabletDebounce(setSearchTerm, 500),
    []
  );

  const enrichedMovements = useMemo(() => {
    return movements.map(movement => {
      const customer = customers.find(c => c.id === movement.customerId);
      const product = products.find(p => p.id === movement.productId);
      return {
        ...movement,
        customerName: customer?.name || 'Bilinmeyen Müşteri',
        productName: product?.name || 'Bilinmeyen Kartela',
        productCode: product?.code || 'N/A',
      };
    });
  }, [movements, customers, products]);

  const filteredMovements = useMemo(() => {
    let filtered = enrichedMovements;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = enrichedMovements.filter(movement =>
        movement.customerName.toLowerCase().includes(term) ||
        movement.productName.toLowerCase().includes(term) ||
        movement.productCode.toLowerCase().includes(term) ||
        (movement.notes && movement.notes.toLowerCase().includes(term))
      );
    }

    return filtered.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      // Handle undefined values
      if (aVal === undefined && bVal === undefined) return 0;
      if (aVal === undefined) return 1;
      if (bVal === undefined) return -1;
      if (aVal === bVal) return 0;
      
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(aVal as Date).getTime() - new Date(bVal as Date).getTime();
      } else {
        // Safe comparison with type checking
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal, 'tr-TR', { sensitivity: 'base' });
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        } else {
          // Convert to string for comparison
          comparison = String(aVal).localeCompare(String(bVal), 'tr-TR', { sensitivity: 'base' });
        }
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    }).slice(0, displayCount); // Limit display for performance
  }, [enrichedMovements, searchTerm, sortBy, sortOrder, displayCount]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 20); // Tablet için daha az yükleme
  };

  const getMovementTypeColor = (type: Movement['type']) => {
    switch (type) {
      case 'given':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'taken':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'returned':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMovementTypeText = (type: Movement['type']) => {
    switch (type) {
      case 'given':
        return 'Verildi';
      case 'taken':
        return 'Alındı';
      case 'returned':
        return 'İade';
      default:
        return 'Bilinmeyen';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hareket Geçmişi</h3>
        <p className="text-gray-600 mb-4">Toplam {movements.length} hareket kaydı</p>
      </div>

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={debouncedSetSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field) => setSortBy(field as keyof Movement)}
        onSortOrderToggle={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        sortOptions={sortOptions}
        placeholder="Hareket ara..."
      />

      {filteredMovements.length > 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kartela
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tür
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Miktar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMovements.map((movement, index) => (
                  <tr key={movement.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movement.customerName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Package className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {movement.productName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {movement.productCode}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeText(movement.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {movement.quantity} adet
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {formatDate(movement.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const details = `
HAREKET DETAYLARI
================
Müşteri: ${movement.customerName}
Kartela: ${movement.productName} (${movement.productCode})
Hareket Türü: ${getMovementTypeText(movement.type)}
Miktar: ${movement.quantity} adet
Tarih: ${formatDate(movement.createdAt)}
${movement.notes ? `\nNotlar: ${movement.notes}` : ''}
                            `.trim();
                            alert(details);
                          }}
                          className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors shadow-sm"
                          title="Görüntüle"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(movement)}
                          className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                          title="Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(movement.id)}
                          className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Load More Button for Desktop */}
          {movements.length > displayCount && (
            <div className="text-center p-4 border-t border-gray-200">
              <button
                onClick={handleLoadMore}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Daha Fazla Yükle ({movements.length - displayCount} kaldı)
              </button>
            </div>
          )}

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredMovements.map((movement, index) => (
              <div key={movement.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getMovementTypeColor(movement.type)}`}>
                      {getMovementTypeText(movement.type)}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const details = `
HAREKET DETAYLARI
================
Müşteri: ${movement.customerName}
Kartela: ${movement.productName} (${movement.productCode})
Hareket Türü: ${getMovementTypeText(movement.type)}
Miktar: ${movement.quantity} adet
Tarih: ${formatDate(movement.createdAt)}
${movement.notes ? `\nNotlar: ${movement.notes}` : ''}
                        `.trim();
                        alert(details);
                      }}
                      className="p-1.5 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(movement)}
                      className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(movement.id)}
                      className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{movement.customerName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{movement.productName}</span>
                    <span className="text-sm text-gray-500">({movement.productCode})</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{movement.quantity} adet</span>
                    <span className="text-sm text-gray-500">{formatDate(movement.createdAt)}</span>
                  </div>
                  
                  {movement.notes && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
                      {movement.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Load More Button for Mobile */}
          {movements.length > displayCount && (
            <div className="text-center p-4 border-t border-gray-200">
              <button
                onClick={handleLoadMore}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Daha Fazla Yükle ({movements.length - displayCount} kaldı)
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpDown className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Hareket bulunamadı</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Arama kriterlerinize uygun hareket bulunamadı.' : 'Henüz hiç hareket kaydı bulunmuyor.'}
          </p>
        </div>
      )}
    </div>
  );
}