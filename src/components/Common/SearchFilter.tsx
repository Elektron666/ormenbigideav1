import React, { useState, useEffect } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  onSortOrderToggle: () => void;
  sortOptions: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function SearchFilter({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  onSortOrderToggle,
  sortOptions,
  placeholder = "Ara...",
}: SearchFilterProps) {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearch = useDebounce(inputValue, 300);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="flex gap-2">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onSortOrderToggle}
          className="px-3 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title={sortOrder === 'asc' ? 'Artan sıralama' : 'Azalan sıralama'}
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="w-4 h-4 text-gray-600" />
          ) : (
            <SortDesc className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
    </div>
  );
}
