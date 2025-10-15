'use client';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CodeViewerProps {
  code: string;
  language: string;
  showLineNumbers?: boolean;
  highlightedLines?: number[];
}

export default function CodeViewer({ 
  code, 
  language, 
  showLineNumbers = true,
  highlightedLines = []
}: CodeViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineProps = (lineNumber: number) => {
    const style: any = { display: 'block' };
    if (highlightedLines.includes(lineNumber)) {
      style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      style.borderLeft = '3px solid red';
      style.paddingLeft = '8px';
    }
    return { style };
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-gray-700">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 px-3 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors text-sm text-gray-300"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language.toLowerCase()}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        lineProps={lineProps}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '14px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

