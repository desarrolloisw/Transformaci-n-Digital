import { useState } from 'react';
import { CompactTiptap } from '../components/ui/RichTextEditor';

export function ProcessDetails() {
      const [htmlContent, setHtmlContent] = useState('');

  return (
    <div className="process-details">
      <h1>Process Details</h1>
      <p>Here you can view and manage the details of a specific process.</p>
      
      <div>
        <h2>Editor compacto Tiptap:</h2>
        <CompactTiptap onChange={setHtmlContent} />

        <h3 className="text-lg font-semibold mt-4 mb-2 text-white">Vista previa:</h3>

        <div
          className="prose max-w-[450px] bg-white text-black p-4 rounded-lg border border-gray-300 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        <pre className="bg-zinc-900 text-green-400 p-4 rounded-lg border border-zinc-700 overflow-x-auto text-xs max-w-[450px] whitespace-pre-wrap">
          {htmlContent}
        </pre>
      </div>

    </div>
  );
}