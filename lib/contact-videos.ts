/**
 * Free CDN-hosted videos — no backend required.
 * Override with NEXT_PUBLIC_CONTACT_VIDEO_URL in .env.local if needed.
 */
export const CONTACT_VIDEO_SOURCES = [
  // Ink-in-water abstract (Pexels, direct MP4)
  'https://videos.pexels.com/video-files/3571264/3571264-hd_1920_1080_30fps.mp4',
  // Small public demo clips (fallbacks)
  'https://www.w3schools.com/html/mov_bbb.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
] as const

export function getContactVideoSources() {
  const custom = process.env.NEXT_PUBLIC_CONTACT_VIDEO_URL?.trim()
  if (custom) return [custom, ...CONTACT_VIDEO_SOURCES]
  return [...CONTACT_VIDEO_SOURCES]
}
