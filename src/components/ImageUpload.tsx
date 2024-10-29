import React, { useCallback, useRef } from 'react';
import { Upload, Link, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onChange(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const file = item.getAsFile();
        if (file) handleFileChange(file);
        break;
      }
    }
  }, []);

  React.useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const clearImage = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const isBase64Image = value.startsWith('data:image/');

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <input
            type="url"
            id="previewImage"
            placeholder="https://exemplo.com/imagem.jpg"
            value={isBase64Image ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full rounded-lg bg-gray-900 border border-gray-700 px-3 py-2 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-500/20 focus:ring-opacity-50"
          />
        </div>
        <span className="text-gray-400">ou</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileChange(file);
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </button>
      </div>

      {value && (
        <div className="relative group">
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-900/80 text-red-300 hover:bg-red-900 hover:text-red-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center text-sm text-gray-400"
      >
        <p>Arraste uma imagem aqui ou use Ctrl+V para colar</p>
      </div>
    </div>
  );
}