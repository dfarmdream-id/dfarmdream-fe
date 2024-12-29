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
import { useQueryClient } from "@tanstack/react-query";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "Username tidak boleh kosong",
    }),
    fullName: z.string({
      message: "Mohon isi nama lengkap",
    }),
    phone: z
      .string({
        message: "Mohon isi nomor telp",
      })
      .optional(),
    address: z
      .string({
        message: "Mohon isi alamat",
      })
      .optional(),
    email: z.string({
      message: "Email tidak boleh kosong",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const queryClient = useQueryClient();

  const submission = useUpdateProfile();
  const router = useRouter();
  const profile = useGetProfile();
  const [loading, setLoading] = useState<boolean>(false);

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

  const onSubmit = form.handleSubmit(async (data) => {
    setLoading(true);
    let imageId: string | null = null;
    if (file && file.length > 0) {
      // Proses upload file
      const formData = new FormData();
      formData.append("file", file[0].file);
      try {
        const response: any = await uploader.mutateAsync({
          body: formData,
        });
        imageId = response?.data?.id ?? null;
      } catch (e) {
        console.log("Failed to upload profile iamge : ", e);
      }
    }
    setLoading(false);
    submission.mutate(
      {
        body: {
          ...data,
          imageId: imageId,
        },
      },
      {
        onError: (error) => {
          setLoading(false);
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          setLoading(false);
          toast.success("Berhasil melakukan update profile");
          form.reset();
          queryClient.refetchQueries({
            queryKey: ["/v1/auth/profile", "/v1/auth/sites"],
          });
          router.push("/dashboard");
        },
      }
    );
  });

  const [file, setFile] = useState<any>([]);
  const uploader = useUploadImage();

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Profile</div>
      <div>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="mt-2">
            <FilePond
              files={file as any[]}
              onupdatefiles={setFile as any}
              // onprocessfiles={handleUpload as any}
              allowMultiple={false}
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
          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button variant="bordered" color="primary" onClick={() => router.push("/dashboard")}>
              Kembali
            </Button>
            <Button isLoading={loading} color="primary" type="submit">
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
