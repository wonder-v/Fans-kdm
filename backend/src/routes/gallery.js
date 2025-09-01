import { Router } from 'itty-router';

const router = Router();

// Get gallery items
router.get('/', async (request, env) => {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let query = `
      SELECT g.*, u.username, u.full_name
      FROM gallery g
      LEFT JOIN users u ON g.uploaded_by = u.id
    `;
    
    if (category) {
      query += ` WHERE g.category = ?`;
      query += ` ORDER BY g.created_at DESC`;
      
      const items = await env.DB.prepare(query).bind(category).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: items.results
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      query += ` ORDER BY g.created_at DESC`;
      
      const items = await env.DB.prepare(query).all();
      
      return new Response(JSON.stringify({
        success: true,
        data: items.results
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch gallery items'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Upload file to R2
router.post('/upload', async (request, env) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const title = formData.get('title');
    const description = formData.get('description');
    const category = formData.get('category');
    
    if (!file) {
      return new Response(JSON.stringify({
        success: false,
        error: 'No file provided'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
    
    // Upload to R2
    const fileBuffer = await file.arrayBuffer();
    await env.STORAGE.put(fileName, fileBuffer, {
      httpMetadata: {
        contentType: file.type
      }
    });

    // Get public URL
    const fileUrl = `https://${env.STORAGE.name}.r2.cloudflarestorage.com/${fileName}`;

    // Store in database
    const result = await env.DB.prepare(`
      INSERT INTO gallery (title, description, file_url, file_type, file_size, category, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(title, description, fileUrl, file.type, file.size, category, 1).run();

    return new Response(JSON.stringify({
      success: true,
      data: {
        id: result.meta.last_row_id,
        file_url: fileUrl,
        file_name: fileName
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to upload file'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as galleryRouter };