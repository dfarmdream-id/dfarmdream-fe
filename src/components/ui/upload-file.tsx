import { useHttpMutation } from "@/hooks/http";
import { Card, Button, Spinner } from "@nextui-org/react";
import { useState } from "react";

type Props = {
  onChange: (id: string) => void;
};

export default function UploadFile(props: Props) {
  const { mutate, isPending } = useHttpMutation<
    FormData,
    { data: { id: string } }
  >("/v1/file/upload", {
    method: "POST",
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    setFileSize((file.size / 1024).toFixed(2) + " KB"); // Calculate file size in KB
    mutate(
      {
        body: formData,
      },
      {
        onSuccess: (data) => {
          props.onChange(data.data.id);
        },
      }
    );
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      uploadFile(selectedFile);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      uploadFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileSize(null);
  };

  return (
    <div>
      <div className="flex items-center gap-4 p-6 border rounded-md border-dashed border-gray-400">
        {!file && (
          <label
            className="w-full text-center cursor-pointer"
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="icon icon-tabler icons-tabler-outline icon-tabler-cloud-upload"
                viewBox="0 0 24 24"
              >
                <path stroke="none" d="M0 0h24v24H0z"></path>
                <path d="M7 18a4.6 4.4 0 0 1 0-9 5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1"></path>
                <path d="m9 15 3-3 3 3M12 12v9"></path>
              </svg>
              <p className="text-gray-500">Drag & Drop your files or <span className="text-blue-500">Browse</span></p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".doc,.pdf,.jpg,.png"
              onChange={handleFileChange}
            />
          </label>
        )}
        {file && (
          <Card
            className="flex items-start gap-4 p-4 rounded-md"
          >
            <div className="flex-grow">
              <div className="text-green-800 font-semibold truncate">{file.name}</div>
              <div className="text-sm text-gray-500">{fileSize}</div>
            </div>
            {isPending && (
              <div className="flex items-center gap-2">
                <Spinner size="sm"/>
                <span className="text-gray-600">Uploading...</span>
              </div>
            )}
            <Button
              size="sm"
              onClick={removeFile}
            >
              ✕
            </Button>
          </Card>
        )}
      </div>
    {/* text to accept */}
    <p className="text-gray-500 text-sm mt-2">Accepted file types: .doc, .pdf, .jpg, .png</p>
    </div>
  );
}