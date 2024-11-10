import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => boolean) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="border-b border-gray-200 pb-2 mb-2 flex gap-2">
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBold().run())}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bold') ? 'bg-gray-100' : ''
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleItalic().run())}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('italic') ? 'bg-gray-100' : ''
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleBulletList().run())}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('bulletList') ? 'bg-gray-100' : ''
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={(e) => handleButtonClick(e, () => editor.chain().focus().toggleOrderedList().run())}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive('orderedList') ? 'bg-gray-100' : ''
        }`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        // Prevent form submission on Enter key
        if (event.key === 'Enter' && event.ctrlKey) {
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
  });

  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none" />
    </div>
  );
}