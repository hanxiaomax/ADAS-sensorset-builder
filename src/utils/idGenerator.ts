/**
 * Generates a unique ID with an optional prefix
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateId = (prefix: string = ""): string => {
  return `${prefix}${prefix ? "-" : ""}${Date.now().toString(
    36
  )}-${Math.random().toString(36).substring(2, 9)}`;
};
