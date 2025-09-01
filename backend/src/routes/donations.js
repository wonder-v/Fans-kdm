import { Router } from 'itty-router';

const router = Router();

// Get Trakteer integration info
router.get('/trakteer', async (request, env) => {
  try {
    return new Response(JSON.stringify({
      success: true,
      data: {
        url: env.TRAKTEER_URL,
        title: "Dukung Pengembang Aplikasi",
        description: "Bantu pengembangan aplikasi Fans-Kdm dengan donasi melalui Trakteer",
        image: "https://cdn.trakteer.id/images/logo/trakteer-logo.png"
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get Trakteer info'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create donation (Midtrans integration)
router.post('/', async (request, env) => {
  try {
    const body = await request.json();
    const { amount, currency, payment_method, purpose, message, anonymous } = body;
    
    // Generate transaction ID
    const transaction_id = `DON_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store donation record
    const result = await env.DB.prepare(`
      INSERT INTO donations (user_id, amount, currency, payment_method, transaction_id, purpose, message, anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(1, amount, currency || 'IDR', payment_method, transaction_id, purpose, message, anonymous || false).run();

    // Midtrans integration (simplified)
    const midtransPayload = {
      transaction_details: {
        order_id: transaction_id,
        gross_amount: amount
      },
      customer_details: {
        first_name: anonymous ? 'Anonymous' : 'User',
        email: 'user@example.com'
      },
      item_details: [{
        id: 'DONATION',
        price: amount,
        quantity: 1,
        name: purpose || 'Donation'
      }]
    };

    // Call Midtrans API
    const midtransResponse = await fetch('https://api.sandbox.midtrans.com/v2/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Basic ${btoa(env.MIDTRANS_SERVER_KEY + ':')}`
      },
      body: JSON.stringify(midtransPayload)
    });

    const midtransData = await midtransResponse.json();

    return new Response(JSON.stringify({
      success: true,
      data: {
        donation_id: result.meta.last_row_id,
        transaction_id,
        payment_url: midtransData.redirect_url,
        payment_data: midtransData
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create donation'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get donation status
router.get('/status/:id', async (request, env) => {
  try {
    const transactionId = request.params.id;

    const donation = await env.DB.prepare(`
      SELECT * FROM donations WHERE transaction_id = ?
    `).bind(transactionId).first();

    if (!donation) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Donation not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: donation
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to get donation status'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as donationsRouter };