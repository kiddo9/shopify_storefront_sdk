import { describe, it, expect } from "vitest";
import { verifyWebhook } from "../../utils/webhooks.js";
import ShopifyStorefront from "../../index.js";
import * as crypto from "node:crypto";

describe("Webhook Verification", () => {
  const SECRET = "my_super_secret_key";
  const PAYLOAD = JSON.stringify({ id: 12345, status: "created" });

  it("should return true for a valid signature", () => {
    // Generate valid HMAC
    const validHmac = crypto
      .createHmac("sha256", SECRET)
      .update(PAYLOAD)
      .digest("base64");

    // Test standalone utility
    expect(verifyWebhook(PAYLOAD, validHmac, SECRET)).toBe(true);
    
    // Test SDK static method wrapper
    expect(ShopifyStorefront.verifyWebhook(PAYLOAD, validHmac, SECRET)).toBe(true);
  });

  it("should return false for an invalid signature", () => {
    const invalidHmac = crypto
      .createHmac("sha256", "wrong_secret")
      .update(PAYLOAD)
      .digest("base64");

    expect(verifyWebhook(PAYLOAD, invalidHmac, SECRET)).toBe(false);
  });

  it("should return false if payload has been tampered with", () => {
    const validHmac = crypto
      .createHmac("sha256", SECRET)
      .update(PAYLOAD)
      .digest("base64");

    const tamperedPayload = JSON.stringify({ id: 12345, status: "deleted" });
    expect(verifyWebhook(tamperedPayload, validHmac, SECRET)).toBe(false);
  });

  it("should return false if missing parameters", () => {
    expect(verifyWebhook("", "hmac", SECRET)).toBe(false);
    expect(verifyWebhook(PAYLOAD, "", SECRET)).toBe(false);
    expect(verifyWebhook(PAYLOAD, "hmac", "")).toBe(false);
  });
});
