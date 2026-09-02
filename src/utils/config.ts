import type { ShopifyCache } from "./cache.js";

export type ShopifyApiVersion = 
  | "2023-10" 
  | "2024-01" 
  | "2024-04" 
  | "2024-07" 
  | "2024-10" 
  | "2025-01" 
  | "unstable" 
  | (string & {}); // Allows autocomplete but accepts any string for future versions

export type StoreConfig = {
  storeUrl: string;
  storefrontToken: string;
  apiVersion?: ShopifyApiVersion;
  maxRetries?: number;
  cache?: ShopifyCache;
  defaultCacheTtl?: number;
};
