import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaFileAlt, FaTimes, FaUpload } from 'react-icons/fa';

interface FileItem {
  file: File;
  id: string;
}

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
  value?: File[];
  label?: string;
}

const humanFileSize = (size: number) => {
  if (size === 0) return '0 B';
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
};

const FileUpload: React.FC<FileUploadProps> = ({ accept = '.jpg,.jpeg,.png,.pdf', multiple = false, onFilesChange, value = [], label = 'Upload files' }) => {
  const [items, setItems] = useState<FileItem[]>(() => (value || []).map((f, i) => ({ file: f, id: `${f.name}-${i}` })));
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (value && value.length > 0) {
      setItems(value.map((f, i) => ({ file: f, id: `${f.name}-${i}` })));
    }
  }, [value]);

  const notifyChange = (newItems: FileItem[]) => {
    setItems(newItems);
    onFilesChange && onFilesChange(newItems.map((i) => i.file));
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, multiple ? undefined : 1);
    const newItems = [...items, ...arr.map((f, i) => ({ file: f, id: `${f.name}-${Date.now()}-${i}` }))];
    notifyChange(newItems);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // reset input to allow same file re-select
    if (inputRef.current) inputRef.current.value = '';
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const remove = (id: string) => {
    const filtered = items.filter((it) => it.id !== id);
    notifyChange(filtered);
  };

  const openFilePicker = () => inputRef.current && inputRef.current.click();

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div>
      <label className="text-sm text-gray-700 mb-2 block">{label}</label>
      <div
        className={`relative rounded-xl border-2 transition ${dragActive ? 'border-dashed border-orange-400 bg-white/80 shadow-lg' : 'border-gray-200 bg-white/70'} overflow-hidden`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          className="hidden"
          aria-hidden="true"
        />

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-[#f26722] to-[#ff8f57] text-white shadow">
              <FaUpload className="h-4 w-4" />
            </div>
            <div>
              <div className="font-medium text-gray-800">Drag & drop files here</div>
              <div className="text-xs text-gray-600">or click to browse. Supported: JPG, PNG, PDF</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={openFilePicker} className="px-4 py-2 rounded-lg bg-white/90 border border-gray-200 text-gray-800 hover:shadow transition">
              Choose
            </button>
            <button type="button" onClick={() => { notifyChange([]); }} className="px-4 py-2 rounded-lg border border-gray-200 bg-white/80 text-gray-700 hover:shadow transition">
              Clear
            </button>
          </div>
        </div>

        <div className="p-3 border-t border-gray-100">
          {items.length === 0 ? (
            <div className="text-sm text-gray-600">No files uploaded</div>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.id} className="flex items-center justify-between p-2 rounded-md hover:bg-white/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-white/80 border border-gray-200">
                      <FaFileAlt className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{it.file.name}</div>
                      <div className="text-xs text-gray-500">{humanFileSize(it.file.size)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => remove(it.id)} className="p-2 rounded-full hover:bg-red-100 text-red-600 transition" aria-label={`Remove ${it.file.name}`}>
                      <FaTimes />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
};

export default FileUpload;
