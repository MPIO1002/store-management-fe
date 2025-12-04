/**
 * Trim all string properties of an object recursively
 */
export const trimAll = <T extends Record<string, any>>(obj: T): T => {
  if (obj === null || obj === undefined) return obj;

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (typeof value === "string") {
      (obj as any)[key] = value.trim();
    } else if (typeof value === "object" && !Array.isArray(value)) {
      trimAll(value);
    }
  }
  return obj;
};

/**
 * Remove null/undefined values from object
 */
export const removeEmpty = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== "")
  ) as Partial<T>;
};
