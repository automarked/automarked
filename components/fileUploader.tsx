import { CloudUpload, Edit, IdCard } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface FileUploaderProps {
  onFileSelect: (files: File) => void;
  multiple?: boolean;
  previewFile: string | null
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, previewFile }) => {
  const [file, setFile] = useState<File | string | null>(previewFile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (file instanceof File)
      onFileSelect(file)
  }, [file])

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const verifyExtension = (file: string | File | null) => {
    if (!file) return false;

    // Handle Google Drive links
    if (typeof file === 'string' && file.includes('drive.google.com')) {
      if (file.includes('image')) return 'image';
      return 'pdf';
    }
    console.log(file)
    // Handle regular files with extensions
    const fileExtension = file instanceof File
      ? file.name.split('.').pop()?.toLowerCase()
      : file.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension ?? '')) {
      return 'image';
    } else if (fileExtension === 'pdf') {
      return 'pdf';
    }
    return false;
  };

  // const verifyExtension = () => {
  //   const fileExtension = previewFile?.split('.').pop()?.toLowerCase() ?? '';
  //   console.log(previewFile)
  //   if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileExtension)) {
  //     return 'image'
  //   } else if (fileExtension === 'pdf') {
  //     return 'pdf'
  //   } else {
  //     return false
  //   }
  // }
  // pretendo limitar os arquivos a receber, permitindo apenas jpg, pdf, png num 
  return (
    <>
      {!previewFile ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{
            border: "1.5px dashed #ccc",
            borderRadius: "10px",
            padding: "20px",
            textAlign: "center",
            margin: "auto",
          }}
          className="w-full"
        >
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="fileInput"
          />
          <label htmlFor="fileInput" className="cursor-pointer text-sm">
            <CloudUpload size={40} className="mx-auto mb-2 text-blue-600" />
            <p className="font-bold">Carregue o seu Bilhete de Identidade</p>
            <p className="font-2 text-[#888]">
              Tamanho máximo: 10 MB
              <br />
              Formatos suportados: .pdf, .png, .jpg, .jpeg
            </p>
          </label>
          {file && (
            <p className="mt-2.5 text-green-500">
              {file instanceof File && (
                <p className="mt-2.5 text-green-500">
                  Carregado: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </p>
              )}
            </p>
          )}
        </div>
      ) : (
        previewFile && (
          <div className="w-full flex justify-center">
            {verifyExtension(file) === 'image' && (
              <div className="relative h-fit">
                <Image
                  width={100}
                  height={100}
                  src={file instanceof File ? URL.createObjectURL(file) : file ?? ''}
                  alt="Preview"
                  className="w-full max-w-xl h-52 object-cover rounded border-[1px]"
                />
                <div
                  className="p-2 bg-slate-200 shadow-md absolute right-1 bottom-1 rounded cursor-pointer"
                  onClick={handleClick}
                >
                  <Edit width={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}
            {verifyExtension(file) === 'pdf' && (
              <div className="relative w-full max-w-xl">
                <iframe
                  src={file instanceof File
                    ? URL.createObjectURL(file)
                    : `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(file ?? '')}`
                  }
                  title="PDF Preview"
                  className="w-full h-52 border rounded"
                />
                <div
                  className="p-2 bg-slate-200 shadow-md absolute right-1 bottom-1 rounded cursor-pointer"
                  onClick={handleClick}
                >
                  <Edit width={20} />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}
            {!verifyExtension(file) && (
              <div className="w-full flex flex-col items-center gap-4">
                <div className="text-red-500">Formato de arquivo não suportado</div>
                <button
                  type="button"
                  onClick={handleClick}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-400 text-white rounded-md hover:bg-slate-600"
                >
                  <CloudUpload size={20} />
                  Carregar novo arquivo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>
        )
      )}
    </>
  );
};

export default FileUploader;
