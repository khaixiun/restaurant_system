"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { loginRequest } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const response = await loginRequest(data);
      login(response.token, {
        id: response.id,
        name: response.name,
        role: response.role,
      });
      window.location.href = "/admin/foods";
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Invalid email or password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4 py-12">
      <div className="w-full max-w-md border border-white/10 bg-[#2a2a28] p-8">

        <div className="mb-8">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">
            Aurelius Restaurant
          </p>
          <h1 className="font-serif text-white text-3xl">
            Admin Sign In
          </h1>
        </div>

        {serverError && (
          <div className="mb-6 border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <form
          onSubmit={loginForm.handleSubmit(onLoginSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...loginForm.register("email")}
              placeholder="admin@example.com"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
            />
            {loginForm.formState.errors.email && (
              <p className="mt-1.5 text-xs text-red-400">
                {loginForm.formState.errors.email?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...loginForm.register("password")}
                placeholder="••••••••"
                className="w-full bg-transparent border border-white/10 px-4 py-3 pr-10 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {loginForm.formState.errors.password && (
              <p className="mt-1.5 text-xs text-red-400">
                {loginForm.formState.errors.password?.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loginForm.formState.isSubmitting}
            className="w-full bg-brand-gold text-[#1E1E1D] font-sans text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-brand-accent transition-colors disabled:opacity-50 mt-2"
          >
            {loginForm.formState.isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}