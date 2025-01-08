import { useState, useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";

interface FileUploaderProps {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  fieldChange,
  mediaUrl,
}) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles); // Update parent state
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      } else {
        setFileUrl(null);
      }
      console.log('Field Change: ', fieldChange);
    },
    [file] // Removed unnecessary dependencies
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
    maxFiles: 1, // Limit to one file
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10"> {/* Center image */}
            <img src={fileUrl} alt="Uploaded Image" className="max-h-48 max-w-full object-contain" /> {/* Improved image styling */}
          </div>
          <p className="file_uploader-label text-center"> {/* Center text */}
            Click or drag to replace
          </p>
        </>
      ) : (
        <div className="file_uploader-box flex flex-col items-center justify-center py-10"> {/* Center content vertically */}
          <img
            src="/assets/icons/file-upload.svg"
            width={96}
            height={77}
            alt="file-upload"
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6 text-center"> {/* Center text */}
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-6 text-center">
            SVG, PNG, JPG
          </p>
          <Button className="shad-button_dark_4">Select from Computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;