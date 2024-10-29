export interface CodeSnippet {
  id: string;
  title: string;
  category: string;
  previewImage: string;
  code: string;
  createdAt: number;
}

export type SnippetFormData = Omit<CodeSnippet, 'id' | 'createdAt'>;

export type DialogMode = 'add' | 'edit';