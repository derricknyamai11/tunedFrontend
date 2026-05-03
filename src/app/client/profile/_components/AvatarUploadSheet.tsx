"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Camera01Icon, Delete01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { useUploadAvatarMutation, useDeleteAvatarMutation } from "../_hooks/useAvatarMutation";
import type { AvatarUploadSheetProps } from "../_props/profile.props";

export function AvatarUploadSheet({ open, onClose, currentUrl }: AvatarUploadSheetProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useUploadAvatarMutation(() => { setPreview(null); setPendingFile(null); onClose(); });
  const deleteMutation = useDeleteAvatarMutation(onClose);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleClose = () => { setPreview(null); setPendingFile(null); onClose(); };
  const isPending = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && handleClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader className="mb-4">
          <SheetTitle>Profile Photo</SheetTitle>
        </SheetHeader>

        {preview && (
          <div className="flex justify-center mb-5">
            <Image
              src={preview} alt="Preview"
              width={96} height={96}
              unoptimized
              className="h-24 w-24 rounded-full object-cover ring-2 ring-emerald-400 ring-offset-2 transition-opacity duration-200"
            />
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        <div className="space-y-2 pb-4">
          {pendingFile ? (
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => uploadMutation.mutate(pendingFile)}
              disabled={isPending}
            >
              {uploadMutation.isPending ? "Uploading…" : "Save Photo"}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>
              <HugeiconsIcon icon={Camera01Icon} className="h-4 w-4 mr-2" strokeWidth={2} />
              Upload Photo
            </Button>
          )}
          {currentUrl && !pendingFile && (
            <Button
              variant="ghost"
              className="w-full text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              onClick={() => deleteMutation.mutate()}
              disabled={isPending}
            >
              <HugeiconsIcon icon={Delete01Icon} className="h-4 w-4 mr-2" strokeWidth={2} />
              {deleteMutation.isPending ? "Removing…" : "Remove Photo"}
            </Button>
          )}
          <Button variant="ghost" className="w-full text-stone-500" onClick={handleClose}>
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 mr-2" strokeWidth={2} />
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
