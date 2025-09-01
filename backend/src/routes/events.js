import { Router } from 'itty-router';

const router = Router();

// Get all events
router.get('/', async (request, env) => {
  try {
    const events = await env.DB.prepare(`
      SELECT e.*, u.username, u.full_name
      FROM events e
      LEFT JOIN users u ON e.created_by = u.id
      ORDER BY e.start_date ASC
    `).all();

    return new Response(JSON.stringify({
      success: true,
      data: events.results
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch events'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create new event
router.post('/', async (request, env) => {
  try {
    const body = await request.json();
    const { title, description, location, start_date, end_date, image_url } = body;
    
    const result = await env.DB.prepare(`
      INSERT INTO events (title, description, location, start_date, end_date, image_url, created_by)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).bind(title, description, location, start_date, end_date, image_url).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id: result.meta.last_row_id }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create event'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as eventsRouter };