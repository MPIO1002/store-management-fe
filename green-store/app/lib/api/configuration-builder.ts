import { Configuration } from "./configuration";

export const createApiConfiguration = (): Configuration => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL;

  return new Configuration({
    basePath: url,
    baseOptions: {
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
};

let apiConfig: Configuration | null = null;

export const getApiConfiguration = (): Configuration => {
  if (!apiConfig) {
    apiConfig = createApiConfiguration();
  }
  return apiConfig;
};