"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  isEmailRegistered,
  sendOtp,
  verifyOtp,
  completeRegister as completeRegisterService,
} from "@/lib/services/register.service";

type RegisterStep = 1 | 2 | 3;

type RegisterState = {
  step: RegisterStep;
  email: string;
  otp: string;
  password: string;
  loading: boolean;
  error: string;
};

export function useRegister() {
  const router = useRouter();
  const [state, setState] = useState<RegisterState>({
    step: 1,
    email: "",
    otp: "",
    password: "",
    loading: false,
    error: "",
  });

  const setError = useCallback((message: string) => {
    setState((current) => ({ ...current, error: message }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState((current) => ({ ...current, loading }));
  }, []);

  const requestOtp = useCallback(async (emailInput: string) => {
    setLoading(true);
    setState((current) => ({ ...current, email: emailInput, error: "" }));

    try {
      // 1. Check if email is already registered and confirmed with password
      const registered = await isEmailRegistered(emailInput);
      if (registered) {
        throw new Error("Tài khoản đã tồn tại");
      }

      // 2. Trigger native Supabase OTP
      const { error } = await sendOtp(emailInput);
      if (error) {
        throw new Error(error.message);
      }

      setState((current) => ({ ...current, step: 2 }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading]);

  const confirmOtp = useCallback(async (otpInput: string) => {
    setLoading(true);
    setState((current) => ({ ...current, otp: otpInput, error: "" }));

    try {
      // Verify OTP (automatically signs the user in)
      const { error } = await verifyOtp(state.email, otpInput);
      if (error) {
        throw new Error(error.message);
      }

      setState((current) => ({
        ...current,
        step: 3,
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, state.email]);

  const completeRegister = useCallback(
    async (name: string, passwordInput: string) => {
      setLoading(true);
      setState((current) => ({ ...current, password: passwordInput, error: "" }));

      try {
        // Complete registration by setting password and name in Supabase Auth & public profiles
        await completeRegisterService(name, passwordInput);

        // Redirect directly since verifyOtp already established a valid session
        router.replace("/dashboard");
      } catch (error) {
        setError(error instanceof Error ? error.message : "Registration failed");
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading, router]
  );

  return {
    step: state.step,
    email: state.email,
    otp: state.otp,
    password: state.password,
    loading: state.loading,
    error: state.error,
    requestOtp,
    confirmOtp,
    completeRegister,
  };
}
