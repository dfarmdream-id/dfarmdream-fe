"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUploadDokumen } from "@/app/(authenticated)/_services/dokumen";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { useUploadImage } from "@/app/(authenticated)/user/_services/profile";
import { useGetCages } from "@/app/(authenticated)/_services/cage";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama Dokumen Wajib Diisi",
    }),
    cageId: z.string({
      message: "Kandang Wajib Diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUploadDokumen();
  const router = useRouter();
  const params = useParams();

  const [file, setFile] = useState<any>([]);
  const uploader = useUploadImage();
  const cages = useGetCages(
    useMemo(() => ({ page: "1", limit: "1000000" }), [])
  );

  const onSubmit = form.handleSubmit(async (data) => {
    let fileId: any = null;
    let fileUrl:any = null
    if (file && file.length > 0) {
      // Proses upload file
      const formData = new FormData();
      formData.append("file", file[0].file);
      try {
        const response: any = await uploader.mutateAsync({
          body: formData,
        });
        fileId = response?.data?.id ?? null;
        fileUrl = response?.data?.url ?? null
      } catch (e) {
        console.log("Failed to upload profile iamge : ", e);
      }
    }
    console.log("file id : ", fileId);

    submission.mutate(
      {
        body: {
          ...data,
          investorId: params.id as string,
          url: fileUrl,
          fileId:fileId
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengupload dokumen");
          form.reset();
          router.push(`/master/investors/${params.id as string}/dokumen`);
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Upload Dokumen</div>
      <div>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Dokumen"
                  placeholder="Ketikkan nama dokumen"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cages.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div className=" mt-2">
            <label>Dokumen</label>
            <FilePond
              className="mt-5 mb-5"
              files={file as any[]}
              onupdatefiles={setFile as any}
              // onprocessfiles={handleUpload as any}
              allowMultiple={false}
              maxFiles={1}
              name="dokumenFile"
              acceptedFileTypes={["application/pdf"]}
              labelIdle='Drag & Drop File Dokumen atau <span class="filepond--label-action">Pilih File</span>'
              //   stylePanelLayout="compact"
              //   styleButtonRemoveItemPosition="center bottom"
              credits={false}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            <Button
              isLoading={submission.isPending}
              color="primary"
              type="submit"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
