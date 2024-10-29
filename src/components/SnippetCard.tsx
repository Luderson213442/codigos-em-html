import React from 'react';
import { Copy, Check, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import type { CodeSnippet } from '../types';

interface Props {
  snippet: CodeSnippet;
  onEdit: (snippet: CodeSnippet) => void;
  onDelete: (snippet: CodeSnippet) => void;
}

export default function SnippetCard({ snippet, onEdit, onDelete }: Props) {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-gray-800 rounded-xl border border-gray-700/50 shadow-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 animate-fade-up">
      <div className="relative">
        <img
          src={snippet.previewImage}
          alt={snippet.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-100">{snippet.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 mt-2">
              {snippet.category}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(snippet)}
              className="inline-flex items-center justify-center rounded-full p-2 bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              title="Editar snippet"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(snippet)}
              className="inline-flex items-center justify-center rounded-full p-2 bg-red-900/30 text-red-300 hover:bg-red-900/50 hover:text-red-200 transition-colors"
              title="Excluir snippet"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={copyToClipboard}
              className={`inline-flex items-center justify-center rounded-full p-2 transition-colors ${
                copied
                  ? 'bg-green-900/50 text-green-300'
                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title="Copiar código"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <time className="text-xs text-gray-400">
            {new Date(snippet.createdAt).toLocaleDateString()}
          </time>
          {snippet.previewImage && (
            <a
              href={snippet.previewImage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Ver imagem
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}