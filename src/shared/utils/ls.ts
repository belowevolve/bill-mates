export function getStorageData<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function setStorageData<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeStorageData(key: string) {
  localStorage.removeItem(key)
}
