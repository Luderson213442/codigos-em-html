import React, { useState, useRef } from 'react';
import { Code2, Plus, Search, Undo2 } from 'lucide-react';
import AddSnippetDialog from './components/AddSnippetDialog';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import SnippetGrid from './components/SnippetGrid';
import type { CodeSnippet, SnippetFormData, DialogMode } from './types';

function App() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [snippets, setSnippets] = useState<CodeSnippet[]>(() => {
    const saved = localStorage.getItem('codeSnippets');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [dialogMode, setDialogMode] = useState<DialogMode>('add');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [lastDeletedSnippet, setLastDeletedSnippet] = useState<CodeSnippet | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<number>();

  const filteredSnippets = snippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (data: SnippetFormData) => {
    let updatedSnippets: CodeSnippet[];
    
    if (dialogMode === 'add') {
      const newSnippet: CodeSnippet = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      updatedSnippets = [newSnippet, ...snippets];
    } else {
      updatedSnippets = snippets.map((snippet) =>
        snippet.id === selectedSnippet?.id
          ? { ...snippet, ...data }
          : snippet
      );
    }
    
    setSnippets(updatedSnippets);
    localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
    setSelectedSnippet(null);
  };

  const handleEdit = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDelete = (snippet: CodeSnippet) => {
    setSelectedSnippet(snippet);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSnippet) {
      const updatedSnippets = snippets.filter(
        (snippet) => snippet.id !== selectedSnippet.id
      );
      setSnippets(updatedSnippets);
      localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
      setDeleteConfirmOpen(false);
      
      // Store the deleted snippet and show undo button
      setLastDeletedSnippet(selectedSnippet);
      setShowUndo(true);
      
      // Clear any existing timeout
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
      
      // Set new timeout for 5 seconds
      undoTimeoutRef.current = window.setTimeout(() => {
        setShowUndo(false);
        setLastDeletedSnippet(null);
      }, 5000);
      
      setSelectedSnippet(null);
    }
  };

  const handleUndo = () => {
    if (lastDeletedSnippet) {
      const updatedSnippets = [lastDeletedSnippet, ...snippets];
      setSnippets(updatedSnippets);
      localStorage.setItem('codeSnippets', JSON.stringify(updatedSnippets));
      setShowUndo(false);
      setLastDeletedSnippet(null);
      
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    }
  };

  const handleAddNew = () => {
    setSelectedSnippet(null);
    setDialogMode('add');
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Code2 className="h-8 w-8 text-indigo-400" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Gerenciador de Códigos
              </h1>
            </div>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar códigos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-100 placeholder-gray-400"
                />
              </div>
              <span className="hidden sm:inline-block text-sm text-gray-400">
                {filteredSnippets.length} código{filteredSnippets.length !== 1 ? 's' : ''} salvos
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SnippetGrid
          snippets={filteredSnippets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </main>

      <button
        onClick={handleAddNew}
        className="fixed right-6 bottom-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 animate-fade-up"
      >
        <Plus className="h-6 w-6" />
      </button>

      {showUndo && (
        <div className="fixed left-6 bottom-6 animate-fade-up">
          <button
            onClick={handleUndo}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Undo2 className="h-4 w-4 mr-2" />
            Desfazer exclusão
          </button>
        </div>
      )}

      <AddSnippetDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        initialData={selectedSnippet ? {
          title: selectedSnippet.title,
          category: selectedSnippet.category,
          previewImage: selectedSnippet.previewImage,
          code: selectedSnippet.code,
        } : undefined}
        mode={dialogMode}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={selectedSnippet?.title || ''}
      />
    </div>
  );
}

export default App;