import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080";

export type School = {
  id: number;
  name: string;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  school?: School | null;
  role?: string | null;
};

export type AuthResponse = {
  token: string;
  tokenType: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  schoolId?: number;
  schoolName?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

type RequestConfig = AxiosRequestConfig & {
  token?: string;
  tokenType?: string;
};

async function request<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const response = await api.request<T>({
    url: path,
    ...config
  });

  if (response.status === 204) {
    return undefined as T;
  }

  return response.data;
}

const api = axios.create({
  baseURL: API_BASE
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { token, tokenType = "Bearer" } = config as RequestConfig;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `${tokenType} ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      `Request failed with status ${status}`;

    return Promise.reject(new ApiError(message, status));
  }
);

export async function login(username: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: { username, password }
  });
}

export async function getStudents(token: string, tokenType?: string): Promise<Student[]> {
  return request<Student[]>("/students", { token, tokenType });
}

export async function getSchools(): Promise<School[]> {
  return request<School[]>("/schools");
}

export async function register(payload: RegisterPayload): Promise<Student> {
  return request<Student>("/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload
  });
}

export async function registerAdmin(
  payload: RegisterPayload,
  token: string,
  tokenType?: string
): Promise<Student> {
  return request<Student>("/auth/register-admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: payload,
    token,
    tokenType
  });
}
