import api from "./axios";
import Cookies from "js-cookie";
import { LoginFormData, RegisterFormData } from "@/schemas/auth";

export interface AuthResponse {
    id: number;
    name: string;
    role: string;
    token: string;
}

export async function login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data);
    Cookies.set("token", response.data.token, { expires: 1 });
    Cookies.set("user", JSON.stringify({
        id: response.data.id,
        name: response.data.name,
        role: response.data.role,
    }), { expires: 1 });

  return response.data;
}

export async function register(data: Omit<RegisterFormData, "confirmPassword">): Promise<void> {
    await api.post("/auth/register", data);
}

export async function logout(): Promise<void> {
    Cookies.remove("token");
    Cookies.remove("user");
}