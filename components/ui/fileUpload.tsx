"use client";
import { imageRemove } from "@/lib/deleteUploadthing";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";


interface fileUploadProps {
  onChange: (url?: string) => void;
  endpoint: "serverImage" | "messageAttachment";
  value: string;
}
interface file {
  fileType: string;
  fileKey: string;
}

const FileUpload: FC<fileUploadProps> = ({ onChange, endpoint, value }) => {
  const [fileInfo, setFileInfo] = useState<file | null>(null);
  // Deleting file because the uplaod thing upload it first
  console.log(value);
  console.log(fileInfo);
  const handleDelete = async () => {
    if (fileInfo?.fileKey) {
      // Delete the file from the server using the fileKey
      const resp = await imageRemove(fileInfo.fileKey);
      // After deletion, update the state and notify the parent
      if (resp.success == "true") {
        onChange('');
        setFileInfo(null);
        
      } else {
          console.log("Error occured while deleting image")
      }
    }
  };

  if (value && fileInfo?.fileType !== "pdf") {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
        <button
          onClick={() => handleDelete()}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4">{}</X>
        </button>
      </div>
    );
  }
  return (
    <>
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
          onChange(res?.[0].url);
          setFileInfo({
            fileType: res?.[0].type,
            fileKey: res?.[0].key,
          });
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
      />
    
    </>
  );
};

export default FileUpload;
