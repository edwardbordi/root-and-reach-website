import HomePage from "./components/HomePage";
import AnimatedPortrait from "./components/AnimatedPortrait";
import { buildPageMetadata } from "../lib/seo";

export const metadata = buildPageMetadata({
  title: "Root & Reach Creative — Content for Small Businesses, Made Easy",
  description:
    "Photo and video content for small businesses, made fun, comfortable and easy. Cristina Vann is your creative partner: one shoot a month, content that's yours.",
  path: "/",
  focusKeyword: "content creation for small business",
});

/* Home: the animated version (looping portrait). Both versions share the
   headline "Being on camera can be ~~scary~~ fun." (HomePage default).
   The original still-portrait version lives at /still for comparison. */
export default function Home() {
  return (
    <HomePage portrait={<AnimatedPortrait />} />
  );
}
