"use client";

import OtpStep from "@/src/features/register/components/otp-step";
import PasswordStep from "@/src/features/register/components/password-step";
import { useRegister } from "@/src/features/register/hooks/use-register";
import EmailStep from "@/src/features/register/components/email-step";
import Image from "next/image";

export default function RegisterPage() {
  const {
    step,
    email,
    loading,
    error,
    requestOtp,
    confirmOtp,
    completeRegister,
  } = useRegister();

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <EmailStep
            email={email}
            loading={loading}
            error={error}
            onSubmit={requestOtp}
          />
        );
      case 2:
        return (
          <OtpStep
            email={email}
            loading={loading}
            error={error}
            onSubmit={confirmOtp}
          />
        );
      case 3:
        return (
          <PasswordStep
            loading={loading}
            error={error}
            onSubmit={completeRegister}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex pb-8 lg:h-screen lg:pb-0">
      <div className="hidden w-1/2 bg-gray-100 lg:block relative">
        <Image fill unoptimized src="/images/cover.png" alt="Register visual" className="object-cover" />
      </div>

      <div className="flex w-full items-center justify-center lg:w-1/2">
        <div className="w-full max-w-md space-y-8 px-4">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-500">Register</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a new account to access the dashboard.
            </p>
          </div>

          {renderStep()}
        </div>
      </div>
    </div>
  );
}
