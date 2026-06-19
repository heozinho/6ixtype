import { UploadCloud } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
}

export default function FileDropzone({
  onFileSelect,
  accept = { 'text/csv': ['.csv'], 'application/json': ['.json'] },
  maxSize = 50 * 1024 * 1024, // 50MB default
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'group relative w-full h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300',
        isDragActive && !isDragReject
          ? 'border-cyan-400 bg-cyan-500/10'
          : isDragReject
          ? 'border-red-400 bg-red-500/10'
          : 'border-white/10 bg-white/[0.02] hover:border-cyan-500/50 hover:bg-white/[0.04]'
      )}
    >
      <input {...getInputProps()} />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

      <div
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform duration-300',
          isDragActive ? 'scale-110 bg-cyan-500/20' : 'bg-white/5',
          isDragReject && 'bg-red-500/20'
        )}
      >
        <UploadCloud
          className={cn(
            'w-8 h-8 transition-colors',
            isDragActive && !isDragReject ? 'text-cyan-400' : isDragReject ? 'text-red-400' : 'text-white/40'
          )}
        />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {isDragActive && !isDragReject ? 'Drop to upload' : isDragReject ? 'File type not supported' : 'Select a file or drag and drop here'}
      </h3>
      <p className="text-sm text-white/40 max-w-sm">
        CSV or JSON files are supported up to {Math.round(maxSize / 1024 / 1024)}MB in size. Data is processed entirely in your browser and never leaves your device.
      </p>
    </div>
  );
}
