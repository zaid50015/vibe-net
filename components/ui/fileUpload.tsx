import { UploadButton } from '@/lib/uploadthing'
import { FC } from 'react';
interface fileUploadProps{
    onChange:(url?:string)=>void;
    endpoint:"serverImage"|"messageAttachment";
    value:string;
}

const FileUpload :FC<fileUploadProps>= ({onChange,endpoint,value}) => {
  return (
   <UploadButton
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          // Do something with the response
         onChange(res?.[0].url );
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
  )
}

export default FileUpload