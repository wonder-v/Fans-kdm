import { Router } from 'itty-router';

const router = Router();

// Get all posts
router.get('/posts', async (request, env) => {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = (page - 1) * limit;

    const posts = await env.DB.prepare(`
      SELECT p.*, u.username, u.full_name, u.avatar_url,
             (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.is_pinned DESC, p.created_at DESC
      LIMIT ? OFFSET ?
    `).bind(limit, offset).all();

    const total = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM posts
    `).first();

    return new Response(JSON.stringify({
      success: true,
      data: {
        posts: posts.results,
        pagination: {
          page,
          limit,
          total: total.count,
          totalPages: Math.ceil(total.count / limit)
        }
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch posts'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Create new post
router.post('/posts', async (request, env) => {
  try {
    const body = await request.json();
    const { title, content, image_url } = body;
    
    // For demo, assume user_id = 1
    const user_id = 1;

    const result = await env.DB.prepare(`
      INSERT INTO posts (user_id, title, content, image_url)
      VALUES (?, ?, ?, ?)
    `).bind(user_id, title, content, image_url).run();

    return new Response(JSON.stringify({
      success: true,
      data: { id: result.meta.last_row_id }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to create post'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

// Get post with comments
router.get('/posts/:id', async (request, env) => {
  try {
    const postId = request.params.id;

    const post = await env.DB.prepare(`
      SELECT p.*, u.username, u.full_name, u.avatar_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).bind(postId).first();

    if (!post) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Post not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const comments = await env.DB.prepare(`
      SELECT c.*, u.username, u.full_name, u.avatar_url
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).bind(postId).all();

    return new Response(JSON.stringify({
      success: true,
      data: {
        post,
        comments: comments.results
      }
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch post'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as forumRouter };