"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateProfileSchema } from "../_schemas/profile.schema";
import { useProfileMutation } from "../_hooks/useProfileMutation";
import type { Profile, UpdateProfileData } from "../_types/profile.types";

interface Props { readonly profile: Profile; readonly onSuccess: () => void; }

export function ProfileEditForm({ profile, onSuccess }: Props) {
  const mutation = useProfileMutation(onSuccess);
  const { register, handleSubmit, control, formState: { errors } } = useForm<UpdateProfileData>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      first_name:   profile.first_name,
      last_name:    profile.last_name,
      phone_number: profile.phone_number ?? undefined,
      gender:       profile.gender ?? undefined,
    },
  });

  const onSubmit = (data: UpdateProfileData) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" {...register("first_name")} />
          {errors.first_name && <p className="text-xs text-rose-600">{errors.first_name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" {...register("last_name")} />
          {errors.last_name && <p className="text-xs text-rose-600">{errors.last_name.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone_number">Phone Number</Label>
        <Input id="phone_number" type="tel" placeholder="+1 (555) 000-0000" {...register("phone_number")} />
        {errors.phone_number && <p className="text-xs text-rose-600">{errors.phone_number.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label>Gender</Label>
        <Controller
          control={control}
          name="gender"
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
              <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unknown">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="sticky bottom-0 pt-4 bg-white border-t border-stone-100">
        <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
