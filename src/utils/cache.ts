export interface ShopifyCache {
  get(key: string): Promise<any> | any;
  set(key: string, value: any, ttlSeconds: number): Promise<void> | void;
}

export class InMemoryCache implements ShopifyCache {
  private cache = new Map<string, { value: any; expiresAt: number }>();

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number) {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Utility to manually clear the entire memory cache.
   */
  clear() {
    this.cache.clear();
  }
}
