import HomePage from "../components/HomePage";
import { buildPageMetadata } from "../../lib/seo";

/* TEMPORARY — the original still-portrait home page ("doesn't have to be
   scary." with the hover swap), kept for comparison in the preview's version
   switch. noindex, canonical "/"; delete this route once Cristina signs off. */
export const metadata = buildPageMetadata({
  title: "Root & Reach Creative — Content for Small Businesses, Made Easy",
  description:
    "Photo and video content for small businesses, made fun, comfortable and easy. Cristina Vann is your creative partner: one shoot a month, content that's yours.",
  path: "/",
  focusKeyword: "content creation for small business",
  noindex: true,
});

export default function StillHome() {
  return <HomePage />;
}
