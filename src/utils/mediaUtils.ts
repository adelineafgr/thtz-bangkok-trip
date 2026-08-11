/**
 * Helper utility to parse media URLs, embed links, and extract video IDs/thumbnails
 * for YouTube, TikTok, Instagram, Pinterest, and direct image links.
 */

export interface ParsedMedia {
  type: 'image' | 'video' | 'tiktok' | 'instagram';
  mediaUrl: string;
  thumbnailUrl: string;
  embedUrl?: string;
  platformName: 'YouTube' | 'TikTok' | 'Instagram' | 'Pinterest' | 'Image' | 'Web Link';
  isEmbeddable: boolean;
  youtubeId?: string;
  instagramCode?: string;
  tiktokId?: string;
}

/**
 * Extracts a clean URL if user pastes an embed code (e.g. <iframe src="...">)
 */
export function extractUrlFromEmbedCode(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  
  // If it's an iframe snippet
  if (trimmed.includes('<iframe') || trimmed.includes('<blockquote')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
    const hrefMatch = trimmed.match(/href=["']([^"']+)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      return hrefMatch[1];
    }
  }

  // If it starts with quote
  if ((trimmed.startsWith('"') || trimmed.startsWith("'")) && (trimmed.endsWith('"') || trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

/**
 * Parses any pasted URL or embed code to return platform type, thumbnail URL, and embed URL.
 */
export function parseMediaUrl(inputUrl: string): ParsedMedia {
  const cleanUrl = extractUrlFromEmbedCode(inputUrl);

  if (!cleanUrl) {
    return {
      type: 'image',
      mediaUrl: '',
      thumbnailUrl: '',
      platformName: 'Image',
      isEmbeddable: false
    };
  }

  // 1. YouTube Video / Shorts / Embed
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytMatch = cleanUrl.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'video',
      mediaUrl: cleanUrl,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      platformName: 'YouTube',
      isEmbeddable: true,
      youtubeId: videoId
    };
  }

  // 2. TikTok Links / Embeds
  const tiktokRegex = /tiktok\.com\/@[\w.-]+\/video\/(\d+)|tiktok\.com\/v\/(\d+)|vt\.tiktok\.com\/([\w-]+)/i;
  const tiktokMatch = cleanUrl.match(tiktokRegex);
  if (tiktokMatch || cleanUrl.includes('tiktok.com')) {
    const videoId = tiktokMatch ? (tiktokMatch[1] || tiktokMatch[2] || tiktokMatch[3]) : undefined;
    const embedUrl = videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : cleanUrl;
    return {
      type: 'tiktok',
      mediaUrl: cleanUrl,
      // Default TikTok fallback thumbnail or embed frame
      thumbnailUrl: videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : cleanUrl,
      embedUrl: embedUrl,
      platformName: 'TikTok',
      isEmbeddable: true,
      tiktokId: videoId
    };
  }

  // 3. Instagram Reels / Posts
  const igRegex = /instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/i;
  const igMatch = cleanUrl.match(igRegex);
  if (igMatch && igMatch[1]) {
    const code = igMatch[1];
    return {
      type: 'instagram',
      mediaUrl: cleanUrl,
      thumbnailUrl: `https://www.instagram.com/p/${code}/media/?size=m`,
      embedUrl: `https://www.instagram.com/p/${code}/embed`,
      platformName: 'Instagram',
      isEmbeddable: true,
      instagramCode: code
    };
  }

  // 4. Pinterest Pins
  if (cleanUrl.includes('pinterest.com') || cleanUrl.includes('pin.it')) {
    const pinMatch = cleanUrl.match(/pin\/(\d+)/i);
    const pinId = pinMatch ? pinMatch[1] : undefined;
    return {
      type: 'image',
      mediaUrl: cleanUrl,
      thumbnailUrl: cleanUrl,
      embedUrl: pinId ? `https://assets.pinterest.com/ext/embed.html?id=${pinId}` : cleanUrl,
      platformName: 'Pinterest',
      isEmbeddable: !!pinId
    };
  }

  // 5. Direct Image URLs (Unsplash, Imgur, Cloudinary, etc.)
  const isImageFile = /\.(jpeg|jpg|png|gif|webp|svg)(\?.*)?$/i.test(cleanUrl) ||
    cleanUrl.includes('images.unsplash.com') ||
    cleanUrl.includes('i.pinimg.com') ||
    cleanUrl.includes('imgur.com') ||
    cleanUrl.includes('googleusercontent.com') ||
    cleanUrl.includes('pexels.com') ||
    cleanUrl.includes('giphy.com') ||
    cleanUrl.includes('tenor.com');

  if (isImageFile) {
    return {
      type: 'image',
      mediaUrl: cleanUrl,
      thumbnailUrl: cleanUrl,
      platformName: 'Image',
      isEmbeddable: false
    };
  }

  // 6. Generic Web Link
  const isVideoKeyword = cleanUrl.includes('video') || cleanUrl.includes('watch') || cleanUrl.includes('mp4');
  return {
    type: isVideoKeyword ? 'video' : 'image',
    mediaUrl: cleanUrl,
    thumbnailUrl: cleanUrl,
    platformName: 'Web Link',
    isEmbeddable: false
  };
}
