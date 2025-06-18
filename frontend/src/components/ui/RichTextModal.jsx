import { useEffect, useRef, useState } from "react";
import { CompactTiptap } from "./RichTextEditor";

export default function RichTextModal({ open, onClose, onSave, initialHtml = "", readOnly = false, title = "Editor de texto enriquecido", loading = false }) {
  const [content, setContent] = useState(initialHtml);
  const [touched, setTouched] = useState(false);
  const original = useRef(initialHtml);
  const modalRef = useRef(null);

  // Bloquear scroll fondo
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Cerrar con Esc
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (onClose) onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Reset content si cambia initialHtml
  useEffect(() => {
    setContent(initialHtml);
    original.current = initialHtml;
    setTouched(false);
  }, [initialHtml, open]);

  if (!open) return null;

  // Evita que el click en el fondo cierre el modal accidentalmente
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] px-2" onClick={handleBackdropClick}>
      <div ref={modalRef} className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-auto p-0 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-[#00478f]">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-white text-2xl font-bold hover:text-red-300 transition" tabIndex={-1}>×</button>
        </div>
        <div className="flex flex-col md:flex-row gap-0 md:gap-4 p-4 bg-zinc-50">
          {/* Editor */}
          <div className="flex-1 min-w-0 mb-4 md:mb-0">
            <CompactTiptap
              initialValue={content}
              onChange={val => { setContent(val); setTouched(true); }}
              readOnly={readOnly}
            />
          </div>
          {/* Vista previa */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 shadow p-3 overflow-auto max-h-[420px]">
            <div className="text-gray-900 text-base prose prose-blue max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
        {!readOnly && (
          <div className="flex justify-end gap-3 px-4 py-3 border-t border-gray-200 bg-gray-50">
            <button
              className="px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded-md font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
              onClick={() => onSave && onSave(content)}
              disabled={loading || (!touched || content === original.current || !content.trim())}
            >
              Guardar
            </button>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .prose { font-size: 0.98rem; }
        }
        .prose ol { list-style-type: decimal; margin-left: 1.5em; }
        .prose ul { list-style-type: disc; margin-left: 1.5em; }
        .prose li { margin-bottom: 0.2em; }
        .prose a { color: #2563eb; text-decoration: underline; }
        .prose a:hover { text-decoration: none; }
        .prose p { margin: 0.5em 0; }
        .prose br { display: inline; }
      `}</style>
    </div>
  );
}
