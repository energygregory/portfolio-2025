# How to Set Up a Shopify Subdomain (shop.designedbygreg.com)

To connect your subdomain `shop.designedbygreg.com` to a Shopify store, you need to configure the DNS settings at your domain registrar (GoDaddy, Namecheap, Vercel, etc.) and in your Shopify admin panel.

## Step 1: Configure Shopify
1.  Log in to your **Shopify Admin** panel.
2.  Go to **Settings** > **Domains**.
3.  Click **Connect existing domain**.
4.  Enter `shop.designedbygreg.com` and click **Next**.

## Step 2: Configure DNS Settings
Log in to your domain provider (where you bought `designedbygreg.com`).

**Add a CNAME Record:**
-   **Type:** `CNAME`
-   **Host (or Name):** `shop`
-   **Value (or Points to):** `shops.myshopify.com`
-   **TTL:** Automatic or 3600 (default)

*Note: You do not need to change the A record for the root domain if you are only setting up a subdomain.*

## Step 3: Verify Connection
1.  Go back to **Shopify Admin** > **Domains**.
2.  Click **Verify connection**.
3.  It may take up to 48 hours for changes to propagate, but usually happens within an hour.

## Step 4: Link from Portfolio
Once the shop is live, you can update your portfolio links to point to `https://shop.designedbygreg.com`.

# Scenario B: Can I use Shopify Live View with a Subdomain?

**Yes, absolutely!**

Shopify treats whatever domain you connect (whether it's `shop.designedbygreg.com` or `www.designedbygreg.com`) as your **Primary Domain**.

When you set up the subdomain as described above:
1.  All traffic goes directly to Shopify's servers.
2.  Shopify Analytics (including **Live View**) works perfectly because the entire shopping experience happens on the Shopify platform.
3.  You will see real-time visitors, carts, and checkouts just like any other Shopify store.

The only difference is the URL users type in. Everything else remains the same.
