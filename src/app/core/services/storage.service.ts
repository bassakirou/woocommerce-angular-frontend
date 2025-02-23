import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly storage: Storage;

  constructor() {
    this.storage = this.getStorage();
  }

  private getStorage(): Storage {
    try {
      // Test if localStorage is available and working
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return localStorage;
    } catch {
      // Fallback to in-memory storage if localStorage is not available
      return new InMemoryStorage();
    }
  }

  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.warn(`Error saving to storage:`, error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn(`Error reading from storage:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from storage:`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.warn(`Error clearing storage:`, error);
    }
  }
}

// Fallback storage implementation using in-memory Map
class InMemoryStorage implements Storage {
  private data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] || null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}
