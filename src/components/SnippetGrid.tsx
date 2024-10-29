import React from 'react';
import { Code } from 'lucide-react';
import SnippetCard from './SnippetCard';
import type { CodeSnippet } from '../types';

interface Props {
  snippets: CodeSnippet[];
  onEdit: (snippet: CodeSnippet) => void;
  onDelete: (snippet: CodeSnippet) => void;
}

export default function SnippetGrid({ snippets, onEdit, onDelete }: Props) {
  if (snippets.length === 0) {
    return (
      <div className="text-center py-16">
        <Code className="h-16 w-16 mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400 text-lg">
          Nenhum código salvo ainda. Clique no botão + para adicionar seu primeiro código!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <SnippetCard
          key={snippet.id}
          snippet={snippet}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}