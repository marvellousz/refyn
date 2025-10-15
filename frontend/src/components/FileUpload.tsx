'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileCode, Loader2 } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  isLoading?: boolean;
}

export default function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFiles(acceptedFiles);
      onUpload(acceptedFiles);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.py', '.js', '.jsx', '.ts', '.tsx', '.java', '.go', '.rs', '.cpp', '.c', '.cs', '.php', '.rb', '.swift', '.kt', '.scala', '.r', '.sql', '.sh', '.yaml', '.yml', '.json', '.html', '.css', '.scss', '.vue', '.dart'],
    },
    multiple: true,
    disabled: isLoading,
  });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <Loader2 className="w-16 h-16 text-primary-500 animate-spin" />
          ) : (
            <Upload className="w-16 h-16 text-gray-400" />
          )}
          
          <div>
            <p className="text-xl font-semibold text-gray-700 mb-2">
              {isLoading ? 'Analyzing your code...' : 'Drop your code files here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (supports multiple files)
            </p>
          </div>

          {!isLoading && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {['.py', '.js', '.ts', '.java', '.go', '.rs', '.cpp', '.php', '.rb'].map((ext) => (
                <span
                  key={ext}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono"
                >
                  {ext}
                </span>
              ))}
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                and more...
              </span>
            </div>
          )}

          {selectedFiles.length > 0 && !isLoading && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                Selected files ({selectedFiles.length}):
              </p>
              <div className="space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                    <FileCode className="w-4 h-4" />
                    <span>{file.name}</span>
                    <span className="text-xs text-gray-400">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

