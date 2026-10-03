import { buildPageMetadata } from "../../lib/seo";
import { SITE_NAME } from "../../lib/site-config";
import BlogArchive from "./BlogArchive";

/**
 * /blog — page 1 of the archive. Pages 2+ live at /blog/page/[page]; both
 * render through BlogArchive so they can never drift apart. /blog/page/1
 * 308s here (next.config.ts) so page 1 never exists at two URLs.
 */
export const metadata = buildPageMetadata({
  title: `Notes from set: the blog — ${SITE_NAME}`,
  description: "On-camera tips, content ideas you can use, and stories from real shoots with small businesses, from Cristina Vann of Root & Reach Creative.",
  path: "/blog",
  focusKeyword: "content tips for small businesses",
});

export default function BlogIndexPage() {
  return <BlogArchive page={1} />;
}
