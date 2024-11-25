"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateProfile, useUploadImage } from "../_services/profile";
import { useGetProfile } from "../../_services/profile";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "Username tidak boleh kosong",
    }),
    fullName: z.string({
      message: "Mohon isi nama lengkap",
    }),
    phone: z.string({
      message: "Mohon isi nomor telp",
    }),
    address: z.string({
      message: "Mohon isi alamat",
    }),
    email: z.string({
      message: "Email tidak boleh kosong",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateProfile();
  const router = useRouter();
  const profile = useGetProfile();

  useEffect(() => {
    if (profile.data) {
      if (profile?.data?.data) {
        form.setValue("username", profile?.data?.data?.username);
        form.setValue("fullName", profile?.data?.data?.fullName);
        form.setValue("phone", profile?.data?.data?.phone);
        form.setValue("address", profile?.data?.data?.address);
        form.setValue("email", profile?.data?.data?.email);
      }
    }
  }, [profile.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil melakukan update profile");
          form.reset();
          router.push("/dashboard");
        },
      }
    );
  });

  const [file, setFile] = useState([]);
  const uploader = useUploadImage();
  const handleUpload = async (fileItems: any) => {
    alert("testing");
    if (fileItems.length > 0) {
      alert("proses upload");
      const formData = new FormData();
      formData.append("file", fileItems[0].file);
      try {
        const response = await uploader.mutateAsync({
          body: formData,
        });
        console.log("Response : ", response);

        // if (response.ok) {
        //   const result = await response.json();
        //   console.log('Profile image updated:', result);
        // } else {
        //   console.error('Upload failed');
        // }
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Profile</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="mt-2">
            <FilePond
              files={file as any[]}
              onupdatefiles={setFile as any}
              onprocessfiles={handleUpload as any}
              maxFiles={1}
              name="profileImage"
              acceptedFileTypes={["image/png", "image/jpeg", "image/gif"]}
              labelIdle='Drag & Drop your profile picture or <span class="filepond--label-action">Browse</span>'
              imagePreviewHeight={250}
              stylePanelLayout="compact"
              styleButtonRemoveItemPosition="center bottom"
              credits={false}
            />
          </div>
          <div className="mt-5">
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Username"
                  placeholder="Ketikkan Username Anda"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5">
            <Controller
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Lengkap"
                  placeholder="Ketikkan Nama Lengkap Anda"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5">
            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="email"
                  label="Email"
                  placeholder="Ketikkan Email Anda"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5">
            <Controller
              control={form.control}
              name="phone"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Phone"
                  placeholder="Ketikkan Nomor HP"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5">
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Alamat"
                  placeholder="Ketikkan Alamat Anda"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>
          <div className="mt-5 flex gap-3 justify-end">
            <Button variant="bordered" color="primary">
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
