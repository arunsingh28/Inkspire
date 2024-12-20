const STORAGE = window.localStorage;

const storage = {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    try {
      return item ? JSON.parse(item) : null;  // Safely parse, return null if not found
    } catch (e) {
      console.error(`Failed to parse ${key} from localStorage`, e);
      return null;  // Return null if parsing fails
    }
  },

  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key: string) {
    STORAGE.removeItem(key);
  },
  clear() {
    STORAGE.clear();
  },
};

export default storage;
