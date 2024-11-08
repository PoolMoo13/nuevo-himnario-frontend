// sessionStorage.ts
interface SessionStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
  }
  
  class SessionStorageImpl implements SessionStorage {
    getItem(key: string): string | null {
      try {
        return sessionStorage.getItem(key);
      } catch (error) {
        console.error(`Error getting item with key "${key}":`, error);
        return null;
      }
    }
  
    setItem(key: string, value: string): void {
      try {
        sessionStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error setting item with key "${key}" and value "${value}":`, error);
      }
    }
  
    removeItem(key: string): void {
      try {
        sessionStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item with key "${key}":`, error);
      }
    }
  
    clear(): void {
      try {
        sessionStorage.clear();
      } catch (error) {
        console.error("Error clearing session storage:", error);
      }
    }
  }
  
  export { SessionStorageImpl };
  