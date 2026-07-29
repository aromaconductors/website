// Runs on Netlify's servers — the Stripe SECRET key stays in an
// environment variable (STRIPE_SECRET_KEY) and never reaches the browser.

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const SHIPPING_CENTS = 1000; // flat $10 shipping across the board

// Countries shown in Stripe's shipping address form.
// Add or remove ISO country codes here to change where you ship.
const SHIP_TO = ['NZ', 'AU', 'US', 'CA', 'GB', 'IE', 'SG', 'JP'];

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { items } = JSON.parse(event.body);

    if (!items || !Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Cart is empty' }),
      };
    }

    // Build Stripe line items. For bespoke scents, the customer's
    // ingredient selections are attached as the product description
    // so they show on the checkout page and in the Stripe dashboard.
    const line_items = items.map((item) => {
      const product_data = { name: item.name };
      if (item.custom && item.meta) {
        product_data.description = String(item.meta).slice(0, 500);
      }
      return {
        price_data: {
          currency: 'nzd',
          product_data,
          unit_amount: item.price,
        },
        quantity: item.quantity,
      };
    });

    // Also attach bespoke selections to the session's metadata so they
    // appear on the payment record itself (Payments → click the payment).
    const metadata = {};
    items
      .filter((item) => item.custom)
      .forEach((item, i) => {
        const c = item.custom;
        metadata[`bespoke_${i + 1}`] = [
          c.name ? `Name: ${c.name}` : '',
          `Top: ${(c.top || []).join(', ')}`,
          `Mid: ${(c.mid || []).join(', ')}`,
          `Base: ${(c.base || []).join(', ')}`,
          `Feel: ${(c.descriptors || []).join(', ')}`,
          c.vision ? `Vision: ${c.vision}` : '',
        ].filter(Boolean).join(' | ').slice(0, 500); // Stripe metadata values max 500 chars
      });

    const siteUrl = process.env.URL || `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      metadata,
      // Collect a shipping address in Stripe Checkout:
      shipping_address_collection: { allowed_countries: SHIP_TO },
      // Flat $10 shipping applied to every order:
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard Shipping',
            type: 'fixed_amount',
            fixed_amount: { amount: SHIPPING_CENTS, currency: 'nzd' },
          },
        },
      ],
      success_url: `${siteUrl}/success.html`,
      cancel_url: `${siteUrl}/cart.html`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
