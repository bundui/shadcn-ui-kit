"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface Props {
  email: string;
  loading: boolean;
  error: string;
  onSubmit: (otp: string) => void;
}

const schema = z.object({
  otp: z.string().regex(/^\d{6}$/, { message: "OTP must be 6 digits" }),
});

type FormData = z.infer<typeof schema>;

export default function OtpStep({ email, loading, error, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const submit = (data: FormData) => {
    onSubmit(data.otp);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP sent to {email}</Label>
        <Input
          id="otp"
          placeholder="123456"
          maxLength={6}
          disabled={loading}
          {...register("otp")}
        />
        {errors.otp && (
          <p className="text-sm text-destructive">{errors.otp.message}</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying OTP
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </form>
  );
}
