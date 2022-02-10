export function setItem(key: string, value: any) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getItem<T>(key: string): T | null {
  try {
    const stringedValue = window.localStorage.getItem(key);
    return stringedValue !== null ? JSON.parse(stringedValue) : null;
  } catch {
    return null;
  }
}
