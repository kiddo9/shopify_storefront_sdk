import ShopifyStorefront from "shopify_storefront_sdk";

/**
 * Example: A Next.js (App Router) API Route verifying a Shopify Webhook.
 * 
 * File: app/api/webhooks/shopify/route.ts
 */
export async function POST(request: Request) {
  try {
    // 1. Get the raw payload buffer
    const rawBody = await request.text();
    
    // 2. Extract the HMAC header sent by Shopify
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256");

    if (!hmacHeader) {
      return new Response("Missing HMAC header", { status: 401 });
    }

    // 3. Verify the webhook securely using the SDK helper
    const isValid = ShopifyStorefront.verifyWebhook(
      rawBody,
      hmacHeader,
      process.env.SHOPIFY_WEBHOOK_SECRET!
    );

    if (!isValid) {
      return new Response("Unauthorized webhook signature", { status: 401 });
    }

    // 4. Process the verified webhook payload
    const payload = JSON.parse(rawBody);
    console.log("Verified Webhook Received for Topic:", request.headers.get("x-shopify-topic"));
    console.log("Payload:", payload);

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Webhook processing failed:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
