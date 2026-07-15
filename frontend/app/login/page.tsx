"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, registerSchema, type LoginFormData, type RegisterFormData } from "@/schemas/auth";
import { loginRequest, register } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

export default function AuthPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
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
      window.location.href = "/";
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Invalid email or password.");
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setIsLoginView(true);
      loginForm.setValue("email", data.email);
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Registration failed.");
    }
  };

  const toggleView = () => {
    setServerError(null);
    loginForm.reset();
    registerForm.reset();
    setIsLoginView(!isLoginView);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-dark px-4 py-12">
      <div className="w-full max-w-md border border-white/10 bg-[#2a2a28] p-8">

        {/* Branding */}
        <div className="mb-8">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-1">
            Aurelius Restaurant
          </p>
          <h1 className="font-serif text-white text-3xl">
            {isLoginView ? "Welcome Back" : "Create Account"}
          </h1>
        </div>

        {/* Toggle */}
        <div className="flex border border-white/10 mb-8">
          <button
            type="button"
            onClick={() => !isLoginView && toggleView()}
            className={`w-1/2 py-2.5 text-xs tracking-[0.15em] uppercase font-sans transition-colors ${
              isLoginView
                ? "bg-brand-gold text-[#1E1E1D]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => isLoginView && toggleView()}
            className={`w-1/2 py-2.5 text-xs tracking-[0.15em] uppercase font-sans transition-colors ${
              !isLoginView
                ? "bg-brand-gold text-[#1E1E1D]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            Register
          </button>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 border border-red-500/30 bg-red-900/20 p-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <form
          onSubmit={
            isLoginView
              ? loginForm.handleSubmit(onLoginSubmit)
              : registerForm.handleSubmit(onRegisterSubmit)
          }
          className="space-y-5"
        >
          {/* Name — register only */}
          {!isLoginView && (
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...registerForm.register("name")}
                placeholder="John Doe"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
              />
              {registerForm.formState.errors.name && (
                <p className="mt-1.5 text-xs text-red-400">
                  {registerForm.formState.errors.name.message}
                </p>
              )}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
              Email Address
            </label>
            <input
              type="email"
              {...(isLoginView
                ? loginForm.register("email")
                : registerForm.register("email"))}
              placeholder="john@example.com"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
            />
            {(isLoginView
              ? loginForm.formState.errors.email
              : registerForm.formState.errors.email) && (
              <p className="mt-1.5 text-xs text-red-400">
                {isLoginView
                  ? loginForm.formState.errors.email?.message
                  : registerForm.formState.errors.email?.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...(isLoginView
                  ? loginForm.register("password")
                  : registerForm.register("password"))}
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
            {(isLoginView
              ? loginForm.formState.errors.password
              : registerForm.formState.errors.password) && (
              <p className="mt-1.5 text-xs text-red-400">
                {isLoginView
                  ? loginForm.formState.errors.password?.message
                  : registerForm.formState.errors.password?.message}
              </p>
            )}
          </div>

          {/* Confirm Password — register only */}
          {!isLoginView && (
            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-white/50 mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                {...registerForm.register("confirmPassword")}
                placeholder="••••••••"
                className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm text-white placeholder-white/20 outline-none focus:border-brand-gold transition-colors"
              />
              {registerForm.formState.errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-400">
                  {registerForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={
              isLoginView
                ? loginForm.formState.isSubmitting
                : registerForm.formState.isSubmitting
            }
            className="w-full bg-brand-gold text-[#1E1E1D] font-sans text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-brand-accent transition-colors disabled:opacity-50 mt-2"
          >
            {isLoginView
              ? loginForm.formState.isSubmitting
                ? "Signing In..."
                : "Sign In"
              : registerForm.formState.isSubmitting
              ? "Creating Account..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}