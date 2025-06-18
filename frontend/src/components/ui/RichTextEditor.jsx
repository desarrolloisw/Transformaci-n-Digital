import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import HardBreak from '@tiptap/extension-hard-break';
import { useState } from 'react';

export function CompactTiptap({ initialValue, onChange }) {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkValue, setLinkValue] = useState('');

  // Si el contenido es plano, lo convierte a HTML
  const isPlainText = initialValue && !/<[a-z][\s\S]*>/i.test(initialValue);

function normalizeInitialBreaks(html) {
  // 1. Elimina cualquier <br> dentro de <p></p> vacíos
  html = html.replace(/<p>\s*(<br\s*\/?>)*\s*<\/p>/gi, '<p></p>');
  // 2. Reemplaza todos los <br> y <br /> por <br class="ProseMirror-trailingBreak">
  html = html.replace(/<br\s*\/?>/gi, '<br class="ProseMirror-trailingBreak">');
  return html;
}

function splitParagraphsAndBreaks(html) {
  return html.replace(/<p>([\s\S]*?)<\/p>/gi, (_, content) => {
    // Divide el contenido por cualquier <br>
    const parts = content.split(/<br[^>]*>/gi);
    let result = '';
    let lastWasBreak = false;

    for (let i = 0; i < parts.length; i++) {
      const text = parts[i].trim();

      if (text) {
        // Si hubo un <br> antes, añadimos un <br> fuera
        if (lastWasBreak) result += '';
        result += `<p>${text}</p>`;
        lastWasBreak = false;
      } else {
        // Si está vacío, solo mete un <br /> y marca que el último fue break
        result += '<br />';
        lastWasBreak = true;
      }
    }

    return result;
  }).replace(/<p>\s*<\/p>/gi, ''); // elimina <p> vacíos
}


  const formattedContent = isPlainText
    ? normalizeInitialBreaks(
        initialValue
          .split(/\n{2,}/)
          .map(paragraph =>
            paragraph
              .split(/\n/)
              .map(line => line.trim() === '' ? '<br class="ProseMirror-trailingBreak">' : `<p>${line}</p>`)
              .join('')
          )
          .join('')
      )
    : normalizeInitialBreaks(initialValue || '');

  const addTailwindToLinks = html =>
    html.replace(
      /<a /g,
      '<a class="text-blue-600 underline hover:no-underline" '
    );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Escribe algo...',
      }),
    ],
    content: formattedContent,
    onUpdate: ({ editor }) => {
      // Normaliza el HTML exportado en cada cambio
      const html = editor.getHTML();
      const normalized = splitParagraphsAndBreaks(html);
      onChange(addTailwindToLinks(normalized));
    }
  });

  if (!editor) return null;

  const isActive = (type) => editor.isActive(type);

  const handleLink = () => {
    setLinkValue(editor.getAttributes('link').href || '');
    setShowLinkModal(true);
  };

  const applyLink = () => {
    let url = linkValue.trim();
    if (url && !/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    if (url === '') {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
    setShowLinkModal(false);
  };

  const cancelLink = () => {
    setShowLinkModal(false);
    setLinkValue('');
  };

  return (
    <div className="w-full max-w-[450px] h-[380px] sm:h-[420px] border border-gray-700 rounded-xl overflow-hidden flex flex-col bg-zinc-900 text-gray-100 shadow-2xl mx-auto">
      {/* Toolbar */}
      <div className="p-2 border-b border-zinc-800 flex flex-wrap gap-2 bg-zinc-800 justify-center">
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('bold') ? 'bg-yellow-400 text-zinc-900 shadow' : 'text-yellow-400 hover:bg-zinc-700'}`} onClick={() => editor.chain().focus().toggleBold().run()} title="Negrita" type="button">B</button>
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('italic') ? 'bg-sky-400 text-zinc-900 shadow' : 'text-sky-400 hover:bg-zinc-700'}`} onClick={() => editor.chain().focus().toggleItalic().run()} title="Cursiva" type="button"><em>I</em></button>
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('strike') ? 'bg-rose-400 text-zinc-900 shadow' : 'text-rose-400 hover:bg-zinc-700'}`} onClick={() => editor.chain().focus().toggleStrike().run()} title="Tachado" type="button"><span className="line-through">S</span></button>
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('bulletList') ? 'bg-lime-400 text-zinc-900 shadow' : 'text-lime-400 hover:bg-zinc-700'}`} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista" type="button">• List</button>
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('orderedList') ? 'bg-pink-400 text-zinc-900 shadow' : 'text-pink-400 hover:bg-zinc-700'}`} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista ordenada" type="button">1. List</button>
        <button className={`px-2 py-1 rounded font-bold transition ${isActive('link') ? 'bg-emerald-400 text-zinc-900 shadow' : 'text-emerald-400 hover:bg-zinc-700'}`} onClick={handleLink} title="Enlace" type="button">Link</button>
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
              <button className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600" onClick={applyLink} type="button">Aplicar</button>
              <button className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700" onClick={cancelLink} type="button">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="flex-1 px-5 py-4 overflow-y-auto bg-white text-black text-base outline-none resize-none rounded-b-xl focus-visible:ring-2 focus-visible:ring-blue-500"
      />
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
