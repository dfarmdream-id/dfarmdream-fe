import { useHttpMutation } from "@/hooks/http";
import { Spinner } from "@nextui-org/react";
import { useMemo, useState } from "react";

type Props = {
  onChange: (id: string) => void;
};

export default function UploadFile(props: Props) {
  const { mutate, isPending, isSuccess } = useHttpMutation<
    FormData,
    { data: { id: string } }
  >("/v1/file/upload", {
    method: "POST",
  });
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
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

  const isStandBy = useMemo(() => {
    return !isPending && !isSuccess;
  }, [isPending, isSuccess]);

  return (
    <div>
      <div className="mb-3">Upload File</div>
      {isSuccess && <div>{file?.name} berhasil diupload</div>}
      {isPending && (
        <div className="flex justify-center items-center gap-5">
          <Spinner />
          <div>Sedang mengupload file</div>
        </div>
      )}
      {isStandBy && (
        <label
          htmlFor="file"
          className="cursor-pointer"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="p-8 border-2 border-dashed border-gray-300 rounded-md">
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 0110 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-2">Tarik dan lepaskan untuk mengunggah atau klik untuk mengunggah file</p>
            </div>
          </div>
          <input
            id="file"
            className="hidden"
            type="file"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}
