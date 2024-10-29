import React, { useState } from 'react';
import { Plus, Link, Code2, Hash, ArrowLeft, ArrowRight } from 'lucide-react';
import type { SnippetFormData } from '../types';
import ImageUpload from './ImageUpload';

interface Props {
  onSave: (data: SnippetFormData) => void;
  initialData?: SnippetFormData;
}

export default function SnippetForm({ onSave, initialData }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SnippetFormData>(
    initialData || {
      title: '',
      category: '',
      previewImage: '',
      code: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      onSave(formData);
    }
  };

  const goBack = () => setStep(1);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              1
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-200">Informações Básicas</p>
              <p className="text-xs text-gray-400">Título, categoria e imagem</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              2
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-200">Código</p>
              <p className="text-xs text-gray-400">Seu código HTML</p>
            </div>
          </div>
        </div>
        <div className="absolute top-4 left-8 right-8 h-0.5 bg-gray-700">
          <div
            className="h-full bg-indigo-600 transition-all duration-300"
            style={{ width: step === 1 ? '0%' : '100%' }}
          />
        </div>
      </div>

      {step === 1 ? (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-gray-400" />
                  <span>Título do Código</span>
                </div>
              </label>
              <input
                type="text"
                id="title"
                placeholder="Ex: Menu Responsivo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="block w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 focus:ring-opacity-50"
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1.5">
                <div className="flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <span>Categoria</span>
                </div>
              </label>
              <input
                type="text"
                id="category"
                placeholder="Ex: Navigation, Layout, Form"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="block w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 focus:ring-opacity-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              <div className="flex items-center space-x-2">
                <Link className="h-4 w-4 text-gray-400" />
                <span>Imagem de Preview</span>
              </div>
            </label>
            <ImageUpload
              value={formData.previewImage}
              onChange={(value) => setFormData({ ...formData, previewImage: value })}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1.5">
              <div className="flex items-center space-x-2">
                <Code2 className="h-4 w-4 text-gray-400" />
                <span>Código HTML</span>
              </div>
            </label>
            <div className="relative">
              <textarea
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                rows={12}
                placeholder="Cole seu código HTML aqui..."
                className="block w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 font-mono text-sm text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 focus:ring-opacity-50"
                required
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                {formData.code.length} caracteres
              </div>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Dica: Formate seu código antes de colar para melhor legibilidade.
            </p>
          </div>
        </div>
      )}

      <div className="pt-4 flex justify-between items-center">
        {step === 2 && (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </button>
        )}
        <button
          type="submit"
          className={`inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:from-indigo-500 hover:to-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 ${
            step === 1 ? 'ml-auto' : 'w-32'
          }`}
        >
          {step === 1 ? (
            <>
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              {initialData ? 'Atualizar' : 'Salvar'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}