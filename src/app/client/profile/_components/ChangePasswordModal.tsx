"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChangePasswordSchema } from "../_schemas/profile.schema";
import { useChangePasswordMutation } from "../_hooks/useChangePasswordMutation";
import type { ChangePasswordData } from "../_types/profile.types";
import type { ChangePasswordModalProps } from "../_props/profile.props";

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const mutation = useChangePasswordMutation(onClose);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordData) =>
    mutation.mutate({ current_password: data.current_password, new_password: data.new_password });

  const handleClose = () => { reset(); onClose(); };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password then choose a new one.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="current_password">Current Password</Label>
            <Input id="current_password" type="password" autoComplete="current-password" {...register("current_password")} />
            {errors.current_password && <p className="text-xs text-rose-600">{errors.current_password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new_password">New Password</Label>
            <Input id="new_password" type="password" autoComplete="new-password" {...register("new_password")} />
            {errors.new_password && <p className="text-xs text-rose-600">{errors.new_password.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirm_password">Confirm New Password</Label>
            <Input id="confirm_password" type="password" autoComplete="new-password" {...register("confirm_password")} />
            {errors.confirm_password && <p className="text-xs text-rose-600">{errors.confirm_password.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
