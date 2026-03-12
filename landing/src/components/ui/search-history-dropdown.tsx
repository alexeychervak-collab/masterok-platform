'use client';

import { useState, useEffect, useRef } from 'react';
import { Clock, TrendingUp, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchHistoryDropdownProps {
  onSelect?: (query: string) => void;
}

export default function SearchHistoryDropdown({ onSelect }: SearchHistoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [trending, setTrending] = useState<string[]>([
    'Ремонт квартир под ключ',
    'Электрик на дом',
    'Сантехник срочно',
    'Дизайн интерьера',
    'Строительство дома',
  ]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('masterok_search_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory).slice(0, 8));
    }

    // Close on click outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('masterok_search_history');
    setHistory([]);
  };

  const removeItem = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = history.filter(h => h !== item);
    setHistory(newHistory);
    localStorage.setItem('masterok_search_history', JSON.stringify(newHistory));
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
      >
        <Clock className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
        <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
          История поиска
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50"
          >
            {/* History Section */}
            {history.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <h3 className="text-sm font-semibold text-gray-700">Недавние поиски</h3>
                  </div>
                  <button
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-red-600 transition-colors font-medium"
                  >
                    Очистить всё
                  </button>
                </div>
                <div className="space-y-1">
                  {history.map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onSelect?.(item);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-sm text-gray-700 group-hover:text-gray-900 truncate">
                          {item}
                        </span>
                      </div>
                      <button
                        onClick={(e) => removeItem(item, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-200 rounded"
                      >
                        <X className="w-3.5 h-3.5 text-gray-500" />
                      </button>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Section */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <h3 className="text-sm font-semibold text-gray-700">Популярные запросы</h3>
              </div>
              <div className="space-y-1">
                {trending.map((item, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (history.length + index) * 0.05 }}
                    onClick={() => {
                      onSelect?.(item);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary-50 transition-colors group text-left"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-primary-700 font-medium">
                      {item}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {history.length === 0 && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">История поиска пуста</p>
                <p className="text-xs text-gray-400 mt-1">Начните искать специалистов</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}




