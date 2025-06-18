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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000b0] backdrop-blur-sm px-1 sm:px-2 animate-fadein" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto p-0 flex flex-col overflow-hidden max-h-[98vh] sm:max-h-[90vh] border border-blue-200 animate-modalpop"
        style={{ minHeight: '60vh' }}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-blue-100 bg-gradient-to-r from-blue-700 to-blue-500">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl font-bold hover:text-red-300 transition focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full w-9 h-9 flex items-center justify-center"
            tabIndex={-1}
            aria-label="Cerrar"
          >×</button>
        </div>
        <div className="flex flex-col md:flex-row gap-2 sm:gap-4 p-2 sm:p-4 bg-zinc-50 flex-1 min-h-0">
          {/* Editor */}
          <div className="flex-1 min-w-0 mb-2 md:mb-0 max-h-72 sm:max-h-none overflow-auto rounded-xl border border-blue-100 bg-white shadow-sm">
            <CompactTiptap
              initialValue={content}
              onChange={val => { setContent(val); setTouched(true); }}
              readOnly={readOnly}
            />
          </div>
          {/* Vista previa */}
          <div className="flex-1 min-w-0 bg-white rounded-xl border border-blue-200 shadow p-2 sm:p-3 overflow-auto max-h-72 sm:max-h-[420px]">
            <div className="text-gray-900 text-base prose prose-blue max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          </div>
        </div>
        {!readOnly && (
          <div className="flex justify-end gap-2 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 border-t border-blue-100 bg-gray-50">
            <button
              className="px-3 sm:px-4 py-2 rounded-md font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="px-3 sm:px-4 py-2 rounded-md font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition disabled:opacity-60 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          .max-w-2xl { max-width: 98vw !important; }
          .rounded-2xl { border-radius: 0.7rem !important; }
        }
        @media (max-width: 640px) {
          .max-w-2xl { max-width: 100vw !important; }
          .rounded-2xl { border-radius: 0.3rem !important; }
          .prose { font-size: 0.95rem; }
        }
        .prose ol { list-style-type: decimal; margin-left: 1.5em; }
        .prose ul { list-style-type: disc; margin-left: 1.5em; }
        .prose li { margin-bottom: 0.2em; }
        .prose a { color: #2563eb; text-decoration: underline; }
        .prose a:hover { text-decoration: none; }
        .prose p { margin: 0.5em 0; }
        .prose br { display: inline; }
        .animate-fadein { animation: fadein 0.2s; }
        .animate-modalpop { animation: modalpop 0.25s; }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalpop { 0% { transform: scale(0.95); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
