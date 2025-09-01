import { Router } from 'itty-router';

const router = Router();

// Get latest videos from YouTube channel
router.get('/', async (request, env) => {
  try {
    const cacheKey = 'youtube_videos';
    
    // Check KV cache first
    let cachedVideos = await env.CACHE.get(cacheKey);
    if (cachedVideos) {
      const videos = JSON.parse(cachedVideos);
      return new Response(JSON.stringify({
        success: true,
        data: videos,
        cached: true
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Fetch from YouTube API
    const channelId = env.YOUTUBE_CHANNEL_ID;
    const apiKey = env.YOUTUBE_API_KEY;
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&maxResults=20&type=video&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    
    // Get video details
    const videoIds = data.items.map(item => item.id.videoId).join(',');
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
    );

    const detailsData = await detailsResponse.json();
    
    // Combine results
    const videos = data.items.map((item, index) => {
      const details = detailsData.items[index];
      return {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        channelTitle: item.snippet.channelTitle,
        viewCount: details?.statistics?.viewCount || 0,
        likeCount: details?.statistics?.likeCount || 0
      };
    });

    // Cache in KV for 1 hour
    await env.CACHE.put(cacheKey, JSON.stringify(videos), { expirationTtl: 3600 });

    return new Response(JSON.stringify({
      success: true,
      data: videos,
      cached: false
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to fetch videos'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

export { router as videosRouter };