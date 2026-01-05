'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, Clock, X, MapPin, Star, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchSuggestion {
  id: string;
  title: string;
  category: string;
  type: 'category' | 'service' | 'specialist' | 'location';
  icon?: React.ReactNode;
  trending?: boolean;
  rating?: number;
  priceRange?: string;
}

interface SmartSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showFilters?: boolean;
  compact?: boolean;
}

const popularSuggestions: SearchSuggestion[] = [
  { id: '1', title: 'Ремонт квартир под ключ', category: 'Ремонт и отделка', type: 'service', trending: true, priceRange: 'от 50,000 ₽' },
  { id: '2', title: 'Электрик на дом', category: 'Электрика', type: 'service', trending: true, priceRange: 'от 1,500 ₽' },
  { id: '3', title: 'Сантехник срочно', category: 'Сантехника', type: 'service', trending: true, priceRange: 'от 2,000 ₽' },
  { id: '4', title: 'Дизайн интерьера', category: 'Дизайн', type: 'service', priceRange: 'от 30,000 ₽' },
  { id: '5', title: 'Строительство домов', category: 'Строительство', type: 'category', trending: true },
  { id: '6', title: 'Репетитор английского', category: 'Образование', type: 'service', priceRange: 'от 800 ₽/час' },
  { id: '7', title: 'Клининг квартиры', category: 'Уборка', type: 'service', priceRange: 'от 3,000 ₽' },
  { id: '8', title: 'Мастер по мебели', category: 'Мебель', type: 'specialist', rating: 4.9 },
];

const categories = [
  'Строительство домов',
  'Ремонт квартир',
  'Архитектура',
  'Сантехника',
  'Электромонтаж',
  'Дизайн интерьера',
  'Кровельные работы',
  'Фасадные работы',
  'Клининг',
  'Репетиторы',
  'IT и разработка',
];

export default function SmartSearch({ 
  placeholder = 'Что вам нужно? Начните вводить...', 
  onSearch,
  showFilters = false,
  compact = false 
}: SmartSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('yodo_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history).slice(0, 5));
    }
  }, []);

  // Save to search history
  const saveToHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const newHistory = [
      searchQuery,
      ...searchHistory.filter(h => h !== searchQuery)
    ].slice(0, 10);
    
    setSearchHistory(newHistory);
    localStorage.setItem('yodo_search_history', JSON.stringify(newHistory));
  }, [searchHistory]);

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(popularSuggestions.filter(s => s.trending).slice(0, 6));
      return;
    }

    const filtered = popularSuggestions.filter(s => 
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase())
    );

    // Also filter categories
    const categoryMatches = categories
      .filter(c => c.toLowerCase().includes(query.toLowerCase()))
      .map((c, i) => ({
        id: `cat-${i}`,
        title: c,
        category: 'Категория',
        type: 'category' as const,
      }));

    setSuggestions([...filtered, ...categoryMatches].slice(0, 8));
  }, [query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      saveToHistory(query);
      onSearch?.(query);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title);
    saveToHistory(suggestion.title);
    onSearch?.(suggestion.title);
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('yodo_search_history');
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={searchRef} className={`relative w-full ${compact ? 'max-w-md' : 'max-w-2xl'} mx-auto`}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full ${compact ? 'py-3' : 'py-4'} pl-14 pr-32 
            bg-white border-2 border-gray-200 rounded-full
            text-gray-900 placeholder:text-gray-400
            transition-all duration-300
            focus:border-teal-500 focus:ring-4 focus:ring-teal-100 focus:outline-none
            hover:border-gray-300
            shadow-lg hover:shadow-xl
          `}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {query && (
            <button
              onClick={clearSearch}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Очистить поиск"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          
          <button
            onClick={handleSearch}
            className="btn-accent py-3 px-6 text-sm font-semibold"
          >
            Найти
          </button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="max-h-[500px] overflow-y-auto">
              {/* Search History */}
              {!query && searchHistory.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="w-4 h-4" />
                      История поиска
                    </div>
                    <button
                      onClick={handleClearHistory}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                      Очистить
                    </button>
                  </div>
                  <div className="space-y-1">
                    {searchHistory.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(item);
                          onSearch?.(item);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 ? (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {query.length < 2 ? 'Популярные запросы' : 'Предложения'}
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 rounded-xl
                        transition-all duration-200
                        ${selectedIndex === index 
                          ? 'bg-teal-50 text-teal-900' 
                          : 'hover:bg-gray-50 text-gray-900'
                        }
                      `}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={`
                          flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                          ${suggestion.type === 'category' ? 'bg-gradient-to-br from-teal-400 to-teal-600' : ''}
                          ${suggestion.type === 'service' ? 'bg-gradient-to-br from-blue-400 to-blue-600' : ''}
                          ${suggestion.type === 'specialist' ? 'bg-gradient-to-br from-purple-400 to-purple-600' : ''}
                          ${suggestion.type === 'location' ? 'bg-gradient-to-br from-orange-400 to-orange-600' : ''}
                        `}>
                          {suggestion.type === 'category' && <Search className="w-5 h-5 text-white" />}
                          {suggestion.type === 'service' && <Search className="w-5 h-5 text-white" />}
                          {suggestion.type === 'specialist' && <Star className="w-5 h-5 text-white" />}
                          {suggestion.type === 'location' && <MapPin className="w-5 h-5 text-white" />}
                        </div>
                        
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-medium truncate">{suggestion.title}</span>
                            {suggestion.trending && (
                              <span className="flex-shrink-0 flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <TrendingUp className="w-3 h-3" />
                                Популярно
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{suggestion.category}</span>
                            {suggestion.rating && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                  {suggestion.rating}
                                </span>
                              </>
                            )}
                            {suggestion.priceRange && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {suggestion.priceRange}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Ничего не найдено</p>
                  <p className="text-xs mt-1">Попробуйте изменить запрос</p>
                </div>
              ) : null}

              {/* Popular Categories */}
              {!query && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                    Популярные категории
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 6).map((cat, index) => (
                      <Link
                        key={index}
                        href={`/search?q=${encodeURIComponent(cat)}`}
                        onClick={() => setIsOpen(false)}
                        className="px-3 py-1.5 bg-white rounded-full text-xs font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors border border-gray-200 hover:border-teal-200"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters (optional) */}
      {showFilters && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200"
        >
          <div className="flex gap-2 flex-wrap">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Все категории</option>
              {categories.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Любая цена</option>
              <option>До 5,000 ₽</option>
              <option>5,000 - 20,000 ₽</option>
              <option>20,000 - 50,000 ₽</option>
              <option>Более 50,000 ₽</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Рейтинг 4+</option>
              <option>Рейтинг 4.5+</option>
              <option>Рейтинг 4.8+</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
}



