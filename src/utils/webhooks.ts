import * as crypto from "node:crypto";

/**
 * Verifies a Shopify webhook's HMAC signature.
 * 
 * @param rawBody The raw, unparsed request body string or buffer.
 * @param hmacHeader The `x-shopify-hmac-sha256` header provided by Shopify.
 * @param secret Your Shopify app or storefront webhook API secret.
 * @returns A boolean indicating whether the webhook signature is valid.
 */
export function verifyWebhook(rawBody: string | Buffer, hmacHeader: string, secret: string): boolean {
  if (!rawBody || !hmacHeader || !secret) {
    return false;
  }

  try {
    const generatedHash = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("base64");

    const generatedBuffer = Buffer.from(generatedHash);
    const hmacBuffer = Buffer.from(hmacHeader);

    // Use timingSafeEqual to prevent timing attacks
    if (generatedBuffer.length !== hmacBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(generatedBuffer, hmacBuffer);
  } catch (err) {
    return false;
  }
}
