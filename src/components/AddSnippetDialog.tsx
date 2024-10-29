import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SnippetForm from './SnippetForm';
import type { SnippetFormData, DialogMode } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SnippetFormData) => void;
  initialData?: SnippetFormData;
  mode: DialogMode;
}

export default function AddSnippetDialog({ isOpen, onClose, onSave, initialData, mode }: Props) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (data: SnippetFormData) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-gray-900 dialog-overlay">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div className={`relative bg-gray-800 border border-gray-700/50 rounded-xl shadow-2xl w-full max-w-3xl my-2 sm:my-8 transition-all duration-300 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 bg-gray-800/95 backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-100">
                {mode === 'add' ? 'Adicionar Novo Código' : 'Editar Código'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700/50 rounded-lg"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {showContent && (
              <div className="p-4 sm:p-6">
                <SnippetForm onSave={handleSave} initialData={initialData} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}