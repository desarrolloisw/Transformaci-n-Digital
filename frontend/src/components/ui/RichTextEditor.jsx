import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import { useState } from 'react';

export function CompactTiptap({ initialValue, onChange }) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkValue, setLinkValue] = useState('');

  // Solo convierte saltos de línea si el contenido es texto plano
  // Dos saltos de línea = nuevo párrafo (<p>), un salto de línea = <br>
  const isPlainText = initialValue && !/<[a-z][\s\S]*>/i.test(initialValue);
  const formattedContent = isPlainText
    ? initialValue
        .split(/\n{2,}/)
        .map(paragraph => {
          // Si termina con salto de línea, genera <p> vacía después del último <br>
          if (/\n$/.test(paragraph)) {
            const trimmed = paragraph.replace(/\n+$/, '');
            return `<p>${trimmed.replace(/\n/g, '<br>')}</p><p></p>`;
          }
          return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`;
        })
        .join('')
    : initialValue || '';

  const addTailwindToLinks = html =>
    html.replace(
      /<a /g,
      '<a class="text-blue-600 underline hover:no-underline" '
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      HardBreak.configure({
        HTMLAttributes: {
          class: 'tiptap-hard-break',
        },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Escribe algo...',
      }),
    ],
    content: formattedContent,
    editorProps: {
      handleKeyDown(view, event) {
        // Shift+Enter: salto de línea (<br>)
        if (event.key === 'Enter' && event.shiftKey) {
          view.dispatch(
            view.state.tr
              .replaceSelectionWith(view.state.schema.nodes.hardBreak.create())
              .scrollIntoView()
          );
          return true;
        }
        // Enter solo: nuevo párrafo (<p>)
        // No se previene el comportamiento por defecto
        return false;
      },
    },
    onUpdate: ({ editor }) => {
        onChange(addTailwindToLinks(editor.getHTML()));
    }
  });

  if (!editor) return null;



    // Helper to check if a mark is active
    const isActive = (type) => editor.isActive(type);

    // Open modal for link
    const handleLink = () => {
        setLinkValue(editor.getAttributes('link').href || '');
        setShowLinkModal(true);
    };

    // Apply or remove link
    const applyLink = () => {
        if (linkValue === '') {
        editor.chain().focus().unsetLink().run();
        } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: linkValue }).run();
        }
        setShowLinkModal(false);
    };

    // Cancel modal
    const cancelLink = () => {
        setShowLinkModal(false);
        setLinkValue('');
    };

    return (
        <div className="w-full max-w-[450px] h-[380px] sm:h-[420px] border border-gray-700 rounded-xl overflow-hidden flex flex-col bg-zinc-900 text-gray-100 shadow-2xl mx-auto">
        {/* Toolbar */}
       <div className="p-2 border-b border-zinc-800 flex flex-wrap gap-2 bg-zinc-800 justify-center">
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('bold') ? 'bg-yellow-400 text-zinc-900 shadow' : 'text-yellow-400 hover:bg-zinc-700'}`}
                onClick={() => editor.chain().focus().toggleBold().run()}
                title="Negrita (cntrl + B)"
                type="button"
            >
                B
            </button>
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('italic') ? 'bg-sky-400 text-zinc-900 shadow' : 'text-sky-400 hover:bg-zinc-700'}`}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                title="Cursiva (cntrl + I)"
                type="button"
            >
                <em>I</em>
            </button>
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('strike') ? 'bg-rose-400 text-zinc-900 shadow' : 'text-rose-400 hover:bg-zinc-700'}`}
                onClick={() => editor.chain().focus().toggleStrike().run()}
                title="Tachado"
                type="button"
            >
                <span className="line-through">S</span>
            </button>
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('bulletList') ? 'bg-lime-400 text-zinc-900 shadow' : 'text-lime-400 hover:bg-zinc-700'}`}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                title="Lista"
                type="button"
            >
                • List
            </button>
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('orderedList') ? 'bg-pink-400 text-zinc-900 shadow' : 'text-pink-400 hover:bg-zinc-700'}`}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                title="Lista ordenada"
                type="button"
            >
                1. List
            </button>
            <button
                className={`px-2 py-1 rounded font-bold transition 
                    ${isActive('link') ? 'bg-emerald-400 text-zinc-900 shadow' : 'text-emerald-400 hover:bg-zinc-700'}`}
                onClick={handleLink}
                title="Enlace"
                type="button"
            >
                Link
            </button>
            {/* Nota sobre salto de línea */}
            <span className="ml-4 text-xs text-gray-400 self-center">
                Shift + Enter para salto de línea
            </span>
        </div>
        {/* Modal para el link */}
        {showLinkModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-zinc-800 p-6 rounded-lg shadow-xl flex flex-col gap-4 w-[90vw] max-w-xs">
                <label className="text-sm text-gray-200">URL del enlace:</label>
                <input
                className="rounded px-2 py-1 border border-gray-600 bg-zinc-900 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="url"
                value={linkValue}
                onChange={e => setLinkValue(e.target.value)}
                placeholder="https://..."
                autoFocus
                />
                <div className="flex gap-2 justify-end">
                <button
                    className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                    onClick={applyLink}
                    type="button"
                >
                    Aplicar
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700"
                    onClick={cancelLink}
                    type="button"
                >
                    Cancelar
                </button>
                </div>
            </div>
            </div>
        )}
        {/* Editor */}
        <EditorContent
            editor={editor}
            className="flex-1 px-5 py-4 overflow-y-auto bg-white text-black text-base outline-none resize-none rounded-b-xl focus-visible:ring-2 focus-visible:ring-blue-500"
            placeholder="Escribe algo..."
        />
        {/* Estilos para listas y cursor */}
        <style>
            {`
            .ProseMirror ul { list-style-type: disc; margin-left: 1.5em; }
            .ProseMirror ol { list-style-type: decimal; margin-left: 1.5em; }
            .ProseMirror li { margin-bottom: 0.2em; }
            .ProseMirror:focus { outline: none; }
            .ProseMirror a { color: #2563eb; text-decoration: underline; }
            .ProseMirror a:hover { text-decoration: none; }
            .ProseMirror p.is-editor-empty:first-child::before {
                content: attr(data-placeholder);
                color: #a1a1aa;
                float: left;
                height: 0;
                pointer-events: none;
                font-style: italic;
                opacity: 0.7;
            }
            `}
        </style>
        </div>
    );
    }