import React, { useState, useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  onFilesChange: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesChange }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles.length > 0) {
        console.log("Files dropped:", acceptedFiles); // Debugging log
        onFilesChange(acceptedFiles);
        setPreviewUrls(acceptedFiles.map((file) => URL.createObjectURL(file)));
      } else {
        onFilesChange([]);
        setPreviewUrls([]);
      }
    },
    [onFilesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpeg", ".jpg", ".svg"] },
    maxFiles: 5, // Limit to 5 files
  });

  const handleRemovePreview = (index: number) => {
    setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer p-4 ${
          isDragActive ? "border-2 border-dashed border-primary-500" : ""
        }`}
      >
        <input {...getInputProps()} />
        {!previewUrls.length ? (
          <div className="file_uploader-box flex flex-col items-center justify-center py-10">
            <img
              src="/assets/icons/file-upload.svg"
              width={96}
              height={77}
              alt="file-upload"
            />
            <h3 className="base-medium text-light-2 mb-2 mt-6 text-center">
              Drag photos here
            </h3>
            <p className="text-light-4 small-regular mb-6 text-center">
              Up to 5 SVG, PNG, JPG
            </p>
            <Button className="shad-button_dark_4">Select from Computer</Button>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {previewUrls.map((previewUrl, index) => (
          <div key={index} className="relative">
            <img
              src={previewUrl}
              alt={`Preview ${index + 1}`}
              className="max-h-48 max-w-full object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={() => handleRemovePreview(index)}
              className="absolute top-2 right-2 bg-gray-600 rounded-full text-white p-1"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
