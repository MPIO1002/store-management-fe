export const API_BASE = "http://localhost:5163/api/";

export function apiUrl(path: string) {
  return `${API_BASE.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
