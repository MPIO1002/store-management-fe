import { apiUrl } from "./api-config";

export type Category = {
  id?: number | string;
  name: string;
  description?: string;
  [key: string]: any;
};

const endpoint = apiUrl("Category");

async function handleResponse(res: Response) {
  const text = await res.text();
  const contentType = res.headers.get("content-type") || "";
  if (!res.ok) {
    try {
      const json = contentType.includes("application/json") ? JSON.parse(text) : { message: text };
      throw new Error(json?.message || res.statusText || text);
    } catch (err) {
      throw new Error(text || res.statusText);
    }
  }

  if (contentType.includes("application/json")) {
    return JSON.parse(text);
  }
  return null;
}

/** GET /api/Category */
export async function getCategories(signal?: AbortSignal): Promise<Category[]> {
  const res = await fetch(endpoint, { method: "GET", signal });
  return handleResponse(res);
}

/** GET /api/Category/{id} */
export async function getCategory(id: number | string, signal?: AbortSignal): Promise<Category> {
  const res = await fetch(`${endpoint}/${id}`, { method: "GET", signal });
  return handleResponse(res);
}

/** POST /api/Category */
export async function createCategory(payload: Partial<Category>, signal?: AbortSignal): Promise<Category> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  return handleResponse(res);
}

/** PUT /api/Category/{id} */
export async function updateCategory(id: number | string, payload: Partial<Category>, signal?: AbortSignal): Promise<Category> {
  const res = await fetch(`${endpoint}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal,
  });
  return handleResponse(res);
}

/** DELETE /api/Category/{id} */
export async function deleteCategory(id: number | string, signal?: AbortSignal): Promise<void> {
  const res = await fetch(`${endpoint}/${id}`, { method: "DELETE", signal });
  await handleResponse(res);
}
